'use server';

import { readPlots, writePlots } from '../database';
import type { Plot } from '../definitions';
import type { EnhancedPlot } from '../enhanced-definitions';

/**
 * Migrate existing plots to enhanced schema
 * Fully type-safe for strict production builds
 */
export async function migratePlotsToEnhanced(): Promise<{
  success: boolean;
  migratedCount: number;
  errors?: string[];
}> {
  try {
    // 1️⃣ Read legacy plots
    const legacyPlots: Plot[] = await readPlots();

    const errors: string[] = [];
    const enhancedPlots: EnhancedPlot[] = [];

    // 2️⃣ Convert Plot → EnhancedPlot
    for (const plot of legacyPlots) {
      try {
        const enhancedPlot: EnhancedPlot = {
          ...plot,

          // Enhanced-only fields
          status: 'Available',
          priceNegotiable: true,
          priceVisibility: 'inquiry',

          images: plot.imageUrl ? [plot.imageUrl] : [],
          thumbnailUrl: plot.imageUrl ?? '',

          imageHint: plot.imageHint || 'legacy upload',

          viewCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        enhancedPlots.push(enhancedPlot);
      } catch (err) {
        errors.push(`Failed to migrate plot ${plot.id}: ${String(err)}`);
      }
    }

    // 3️⃣ Convert EnhancedPlot → Plot (for writePlots)
    const migratedPlots: Plot[] = enhancedPlots.map((enhanced) => ({
      ...enhanced,
      propertyType: 'Plot' as const,
      propertyNumber: enhanced.plotNumber,
      // ✅ Plot requires imageUrl — derive from EnhancedPlot
      imageUrl: enhanced.thumbnailUrl || '',

      // ✅ Plot requires imageHint — guarantee string
      imageHint: enhanced.imageHint || 'legacy upload',
    }));

    // 4️⃣ Persist
    await writePlots(migratedPlots);

    return {
      success: errors.length === 0,
      migratedCount: migratedPlots.length,
      errors: errors.length ? errors : undefined,
    };
  } catch (err) {
    return {
      success: false,
      migratedCount: 0,
      errors: [`Migration failed: ${String(err)}`],
    };
  }
}

/**
 * Check whether migration is required
 */
export async function checkMigrationStatus(): Promise<{
  needsMigration: boolean;
  plotCount: number;
  enhancedCount: number;
}> {
  const plots = await readPlots();

  const enhancedCount = plots.filter(
    (p: any) => 'status' in p && 'images' in p
  ).length;

  return {
    needsMigration: enhancedCount < plots.length,
    plotCount: plots.length,
    enhancedCount,
  };
}
