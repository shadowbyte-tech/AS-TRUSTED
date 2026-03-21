import { promises as fs } from 'fs';
import path from 'path';
import { Favorite, Comparison } from './models';
import { initDB } from './mongodb-database';
import type { 
  Favorite as FavoriteType, 
  Comparison as ComparisonType, 
  SearchHistory as SearchHistoryType 
} from './enhanced-definitions';
import { logger } from './logger';

// Data file paths
const favoritesDataPath = path.join(process.cwd(), 'src', 'lib', 'favorites-data.json');
const comparisonsDataPath = path.join(process.cwd(), 'src', 'lib', 'comparisons-data.json');
const searchHistoryDataPath = path.join(process.cwd(), 'src', 'lib', 'search-history-data.json');

async function readJsonFile<T>(filePath: string): Promise<T[]> {
  try {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(fileContent) as T[];
  } catch (error) {
    return [];
  }
}

async function writeJsonFile<T>(filePath: string, data: T[]): Promise<void> {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    logger.warn(`Failed to write JSON ${path.basename(filePath)} (Vercel?):`, err);
  }
}

/**
 * Read favorites data from MongoDB or fallback to file
 */
export async function readFavorites(): Promise<FavoriteType[]> {
  const isDBConnected = await initDB();
  if (!isDBConnected) return await readJsonFile<FavoriteType>(favoritesDataPath);

  try {
    const docs = await Favorite.find({}).lean();
    return docs.map(doc => ({
      id: doc._id.toString(),
      userId: doc.userId,
      plotId: doc.plotId,
      addedAt: doc.addedAt?.toISOString(),
      notes: doc.notes
    }));
  } catch (err) {
    logger.error('MongoDB read favorites failed:', err);
    return await readJsonFile<FavoriteType>(favoritesDataPath);
  }
}

/**
 * Write favorites data - supports single addition/update in MongoDB
 */
export async function writeFavorites(favorites: FavoriteType[]): Promise<void> {
  // Attempt JSON write but don't crash
  await writeJsonFile<FavoriteType>(favoritesDataPath, favorites);
}

// Helper for single favorite addition in MongoDB
export async function addFavoriteDB(fav: FavoriteType): Promise<void> {
  const isDBConnected = await initDB();
  if (isDBConnected) {
    try {
      await Favorite.create({
        _id: fav.id,
        userId: fav.userId,
        plotId: fav.plotId,
        notes: fav.notes,
        addedAt: new Date(fav.addedAt)
      });
    } catch (err) {
      logger.error('MongoDB add favorite failed:', err);
    }
  }
}

export async function removeFavoriteDB(userId: string, plotId: string): Promise<void> {
  const isDBConnected = await initDB();
  if (isDBConnected) {
    try {
      await Favorite.findOneAndDelete({ userId, plotId });
    } catch (err) {
      logger.error('MongoDB remove favorite failed:', err);
    }
  }
}

/**
 * Read comparisons data from MongoDB or fallback to file
 */
export async function readComparisons(): Promise<ComparisonType[]> {
  const isDBConnected = await initDB();
  if (!isDBConnected) return await readJsonFile<ComparisonType>(comparisonsDataPath);

  try {
    const docs = await Comparison.find({}).lean();
    return docs.map(doc => ({
      id: doc._id.toString(),
      userId: doc.userId,
      plotIds: doc.plotIds,
      createdAt: doc.createdAt?.toISOString(),
      expiresAt: doc.expiresAt?.toISOString()
    }));
  } catch (err) {
    logger.error('MongoDB read comparisons failed:', err);
    return await readJsonFile<ComparisonType>(comparisonsDataPath);
  }
}

/**
 * Write comparisons data to file
 */
export async function writeComparisons(comparisons: ComparisonType[]): Promise<void> {
  await writeJsonFile<ComparisonType>(comparisonsDataPath, comparisons);
}

export async function updateComparisonDB(comp: ComparisonType): Promise<void> {
  const isDBConnected = await initDB();
  if (isDBConnected) {
    try {
      await Comparison.findByIdAndUpdate(
        comp.id,
        {
          userId: comp.userId,
          plotIds: comp.plotIds,
          expiresAt: comp.expiresAt ? new Date(comp.expiresAt) : undefined
        },
        { upsert: true }
      );
    } catch (err) {
      logger.error('MongoDB update comparison failed:', err);
    }
  }
}

/**
 * Read search history data from file
 */
export async function readSearchHistory(): Promise<SearchHistoryType[]> {
  return await readJsonFile<SearchHistoryType>(searchHistoryDataPath);
}

/**
 * Write search history data to file
 */
export async function writeSearchHistory(history: SearchHistoryType[]): Promise<void> {
  await writeJsonFile<SearchHistoryType>(searchHistoryDataPath, history);
}
