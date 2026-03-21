'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import type { EnhancedPlot, Favorite, Comparison } from './enhanced-definitions';
import { 
  readFavorites, 
  writeFavorites, 
  readComparisons, 
  writeComparisons,
  addFavoriteDB,
  removeFavoriteDB,
  updateComparisonDB
} from './enhanced-database';
import { readProperties, updateProperty, incrementPropertyViews } from './mongodb-database';

// Enhanced Plot Schema
const EnhancedPlotSchema = z.object({
  plotNumber: z.string().min(1, { message: 'Plot number is required.' }),
  villageName: z.string().min(1, { message: 'Village name is required.' }),
  areaName: z.string().min(1, { message: 'Area name is required.' }),
  plotSize: z.string().min(1, { message: 'Plot size is required.' }),
  plotFacing: z.enum(['North', 'South', 'East', 'West', 'North-East', 'North-West', 'South-East', 'South-West']),
  description: z.string().optional(),
  // NEW fields
  status: z.enum(['Available', 'Reserved', 'Sold', 'Under Negotiation']).default('Available'),
  price: z.number().optional(),
  pricePerSqft: z.number().optional(),
  priceNegotiable: z.boolean().default(true),
  priceVisibility: z.enum(['public', 'registered', 'inquiry']).default('inquiry'),
});

// Favorites Actions

/**
 * Add a plot to user's favorites
 * @param userId - User identifier
 * @param plotId - Plot identifier
 * @param notes - Optional notes about the favorite
 * @returns Promise with operation result
 */
export async function addToFavorites(userId: string, plotId: string, notes?: string) {
  try {
    const favorites = await readFavorites();
    
    // Check if already favorited
    const existing = favorites.find(f => f.userId === userId && f.plotId === plotId);
    if (existing) {
      return { success: false, message: 'Already in favorites' };
    }
    
    const newFavorite: Favorite = {
      id: `fav_${Date.now()}`,
      userId,
      plotId,
      addedAt: new Date().toISOString(),
      notes,
    };
    
    favorites.push(newFavorite);
    await writeFavorites(favorites);
    await addFavoriteDB(newFavorite);
    revalidatePath('/favorites');
    
    return { success: true, favorite: newFavorite };
  } catch (error) {
    return { success: false, message: 'Failed to add favorite', error };
  }
}

/**
 * Remove a plot from user's favorites
 * @param userId - User identifier
 * @param plotId - Plot identifier
 * @returns Promise with operation result
 */
export async function removeFromFavorites(userId: string, plotId: string) {
  try {
    const favorites = await readFavorites();
    const updated = favorites.filter(f => !(f.userId === userId && f.plotId === plotId));
    
    await writeFavorites(updated);
    await removeFavoriteDB(userId, plotId);
    revalidatePath('/favorites');
    
    return { success: true };
  } catch (error) {
    return { success: false, message: 'Failed to remove favorite', error };
  }
}

/**
 * Get all favorites for a user with plot details
 * @param userId - User identifier
 * @returns Promise with array of favorite plots
 */
export async function getUserFavorites(userId: string) {
  try {
    const favorites = await readFavorites();
    const plots = await readProperties();
    
    const userFavorites = favorites.filter(f => f.userId === userId);
    const favoritePlots = userFavorites.map(fav => {
      const plot = plots.find(p => p.id === fav.plotId);
      return plot ? { ...plot, favorite: fav } : null;
    }).filter(Boolean);
    
    return favoritePlots;
  } catch (error) {
    console.error('Failed to get user favorites:', error);
    return [];
  }
}

// Comparison Actions

/**
 * Add a plot to user's comparison list
 * @param userId - User identifier
 * @param plotId - Plot identifier
 * @returns Promise with operation result
 */
export async function addToComparison(userId: string, plotId: string) {
  try {
    const comparisons = await readComparisons();
    
    // Find user's active comparison or create new
    let userComparison = comparisons.find(c => 
      c.userId === userId && 
      (!c.expiresAt || new Date(c.expiresAt) > new Date())
    );
    
    if (!userComparison) {
      userComparison = {
        id: `comp_${Date.now()}`,
        userId,
        plotIds: [],
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
      };
      comparisons.push(userComparison);
    }
    
    // Max 4 plots for comparison
    if (userComparison.plotIds.length >= 4) {
      return { success: false, message: 'Maximum 4 plots can be compared' };
    }
    
    if (!userComparison.plotIds.includes(plotId)) {
      userComparison.plotIds.push(plotId);
      await writeComparisons(comparisons);
      await updateComparisonDB(userComparison);
      revalidatePath('/compare');
      
      return { success: true, comparison: userComparison };
    }
    
    return { success: false, message: 'Plot already in comparison' };
  } catch (error) {
    return { success: false, message: 'Failed to add to comparison', error };
  }
}

/**
 * Remove a plot from user's comparison list
 * @param userId - User identifier
 * @param plotId - Plot identifier
 * @returns Promise with operation result
 */
export async function removeFromComparison(userId: string, plotId: string) {
  try {
    const comparisons = await readComparisons();
    
    const userComparison = comparisons.find(c => c.userId === userId);
    if (userComparison) {
      userComparison.plotIds = userComparison.plotIds.filter(id => id !== plotId);
      await writeComparisons(comparisons);
      await updateComparisonDB(userComparison);
      revalidatePath('/compare');
    }
    
    return { success: true };
  } catch (error) {
    return { success: false, message: 'Failed to remove from comparison', error };
  }
}

/**
 * Get user's comparison with plot details
 * @param userId - User identifier
 * @returns Promise with comparison data including plots
 */
export async function getUserComparison(userId: string) {
  try {
    const comparisons = await readComparisons();
    const plots = await readProperties();
    
    const userComparison = comparisons.find(c => 
      c.userId === userId &&
      (!c.expiresAt || new Date(c.expiresAt) > new Date())
    );
    
    if (!userComparison) {
      return null;
    }
    
    const comparisonPlots = userComparison.plotIds.map(id => 
      plots.find(p => p.id === id)
    ).filter(Boolean);
    
    return {
      ...userComparison,
      plots: comparisonPlots,
    };
  } catch (error) {
    console.error('Failed to get user comparison:', error);
    return null;
  }
}

// Plot Status Update

/**
 * Update the status of a plot
 * @param plotId - Plot identifier
 * @param status - New status for the plot
 * @returns Promise with operation result
 */
export async function updatePlotStatus(plotId: string, status: 'Available' | 'Reserved' | 'Sold' | 'Under Negotiation') {
  try {
    // Use unified MongoDB updateProperty
    const updated = await updateProperty(plotId, { status } as any);
    
    revalidatePath('/dashboard/plots');
    revalidatePath('/plots');
    
    return { success: !!updated, plot: updated };
  } catch (error) {
    return { success: false, message: 'Failed to update plot status', error };
  }
}

/**
 * Increment the view count for a plot
 * @param plotId - Plot identifier
 * @returns Promise with operation result
 */
export async function incrementPlotViewCount(plotId: string) {
  try {
    // Use unified MongoDB incrementPropertyViews
    await incrementPropertyViews(plotId);
    
    return { success: true };
  } catch (error) {
    console.error('Failed to increment view count:', error);
    return { success: false };
  }
}
