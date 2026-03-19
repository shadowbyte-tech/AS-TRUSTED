/**
 * Multi-File JSON Storage System
 * Automatically splits data across multiple files when they get too large
 * Provides better performance and scalability
 */

import { promises as fs } from 'fs';
import path from 'path';
import type { Plot as PlotType } from './definitions';
import { logger } from './logger';

const DATA_DIR = path.join(process.cwd(), 'data');
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB per file
const MAX_PLOTS_PER_FILE = 100; // Maximum plots per file

// File naming pattern: plots_001.json, plots_002.json, etc.
const getPlotFileName = (index: number): string => {
  return path.join(DATA_DIR, `plots_${index.toString().padStart(3, '0')}.json`);
};

const getPlotIndexFileName = (): string => {
  return path.join(DATA_DIR, 'plots_index.json');
};

interface PlotIndex {
  totalFiles: number;
  totalPlots: number;
  fileStats: Array<{
    fileIndex: number;
    plotCount: number;
    fileSize: number;
    lastModified: string;
  }>;
}

async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

async function readJsonFile<T>(filePath: string): Promise<T[]> {
  try {
    await ensureDataDir();
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeJsonFile<T>(filePath: string, data: T[]): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
}

async function getFileSize(filePath: string): Promise<number> {
  try {
    const stats = await fs.stat(filePath);
    return stats.size;
  } catch {
    return 0;
  }
}

async function readPlotIndex(): Promise<PlotIndex> {
  try {
    const indexData = await readJsonFile<PlotIndex>(getPlotIndexFileName());
    return indexData[0] || { totalFiles: 0, totalPlots: 0, fileStats: [] };
  } catch {
    return { totalFiles: 0, totalPlots: 0, fileStats: [] };
  }
}

async function writePlotIndex(index: PlotIndex): Promise<void> {
  await writeJsonFile(getPlotIndexFileName(), [index]);
}

async function updateFileStats(fileIndex: number): Promise<void> {
  const fileName = getPlotFileName(fileIndex);
  const plots = await readJsonFile<PlotType>(fileName);
  const fileSize = await getFileSize(fileName);
  
  const index = await readPlotIndex();
  const statIndex = index.fileStats.findIndex(s => s.fileIndex === fileIndex);
  
  const newStat = {
    fileIndex,
    plotCount: plots.length,
    fileSize,
    lastModified: new Date().toISOString()
  };
  
  if (statIndex >= 0) {
    index.fileStats[statIndex] = newStat;
  } else {
    index.fileStats.push(newStat);
  }
  
  index.totalFiles = Math.max(index.totalFiles, fileIndex);
  index.totalPlots = index.fileStats.reduce((sum, stat) => sum + stat.plotCount, 0);
  
  await writePlotIndex(index);
}

export async function readAllPlots(): Promise<PlotType[]> {
  const index = await readPlotIndex();
  const allPlots: PlotType[] = [];
  
  // If no index exists, try to read from legacy plots.json
  if (index.totalFiles === 0) {
    const legacyPlots = await readJsonFile<PlotType>(path.join(DATA_DIR, 'plots.json'));
    if (legacyPlots.length > 0) {
      // Migrate legacy data to new system
      await migrateLegacyData(legacyPlots);
      return legacyPlots;
    }
    return [];
  }
  
  // Read from all plot files
  for (let i = 1; i <= index.totalFiles; i++) {
    const plots = await readJsonFile<PlotType>(getPlotFileName(i));
    allPlots.push(...plots);
  }
  
  return allPlots.sort((a, b) => {
    const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    
    if (aTime !== bTime) {
      return bTime - aTime;
    }
    
    // Fallback to id for stable sort
    return (b.id || '').localeCompare(a.id || '');
  });
}

async function migrateLegacyData(plots: PlotType[]): Promise<void> {
  logger.info('🔄 Migrating legacy plots.json to multi-file system...');
  
  // Split plots into chunks
  const chunks: PlotType[][] = [];
  for (let i = 0; i < plots.length; i += MAX_PLOTS_PER_FILE) {
    chunks.push(plots.slice(i, i + MAX_PLOTS_PER_FILE));
  }
  
  // Write chunks to separate files
  for (let i = 0; i < chunks.length; i++) {
    const fileIndex = i + 1;
    await writeJsonFile(getPlotFileName(fileIndex), chunks[i]);
    await updateFileStats(fileIndex);
  }
  
  // Backup legacy file
  const backupPath = path.join(DATA_DIR, `plots_legacy_${Date.now()}.json`);
  await fs.copyFile(path.join(DATA_DIR, 'plots.json'), backupPath);
  
  logger.info(`✅ Migration complete! Created ${chunks.length} files. Legacy backed up.`);
}

async function findPlotFile(plotId: string): Promise<{ fileIndex: number; plot: PlotType } | null> {
  const index = await readPlotIndex();
  
  for (let i = 1; i <= index.totalFiles; i++) {
    const plots = await readJsonFile<PlotType>(getPlotFileName(i));
    const plot = plots.find(p => p.id === plotId);
    if (plot) {
      return { fileIndex: i, plot };
    }
  }
  
  return null;
}

async function getOptimalFileForNewPlot(): Promise<number> {
  const index = await readPlotIndex();
  
  // Find a file that's not full
  for (const stat of index.fileStats) {
    if (stat.plotCount < MAX_PLOTS_PER_FILE && stat.fileSize < MAX_FILE_SIZE) {
      return stat.fileIndex;
    }
  }
  
  // All files are full, create a new one
  return index.totalFiles + 1;
}

export async function createPlot(plotData: Omit<PlotType, 'id'>): Promise<PlotType> {
  const newPlot: PlotType = {
    ...plotData,
    id: generatePlotId()
  };
  
  const fileIndex = await getOptimalFileForNewPlot();
  const fileName = getPlotFileName(fileIndex);
  
  const plots = await readJsonFile<PlotType>(fileName);
  plots.push(newPlot);
  
  await writeJsonFile(fileName, plots);
  await updateFileStats(fileIndex);
  
  logger.info(`✅ Plot ${newPlot.id} added to file ${fileIndex} (${plots.length} plots in file)`);
  
  return newPlot;
}

export async function updatePlot(id: string, updateData: Partial<PlotType>): Promise<boolean> {
  const result = await findPlotFile(id);
  if (!result) return false;
  
  const { fileIndex } = result;
  const fileName = getPlotFileName(fileIndex);
  const plots = await readJsonFile<PlotType>(fileName);
  
  const plotIndex = plots.findIndex(p => p.id === id);
  if (plotIndex === -1) return false;
  
  plots[plotIndex] = { ...plots[plotIndex], ...updateData };
  
  await writeJsonFile(fileName, plots);
  await updateFileStats(fileIndex);
  
  logger.info(`✅ Plot ${id} updated in file ${fileIndex}`);
  
  return true;
}

export async function deletePlot(id: string): Promise<boolean> {
  const result = await findPlotFile(id);
  if (!result) return false;
  
  const { fileIndex } = result;
  const fileName = getPlotFileName(fileIndex);
  const plots = await readJsonFile<PlotType>(fileName);
  
  const filteredPlots = plots.filter(p => p.id !== id);
  if (filteredPlots.length === plots.length) return false; // Plot not found
  
  await writeJsonFile(fileName, filteredPlots);
  await updateFileStats(fileIndex);
  
  logger.info(`✅ Plot ${id} deleted from file ${fileIndex} (${filteredPlots.length} plots remaining)`);
  
  // If file is empty, we could optionally clean it up
  if (filteredPlots.length === 0) {
    await cleanupEmptyFile(fileIndex);
  }
  
  return true;
}

async function cleanupEmptyFile(fileIndex: number): Promise<void> {
  const index = await readPlotIndex();
  
  // Remove from file stats
  index.fileStats = index.fileStats.filter(s => s.fileIndex !== fileIndex);
  
  // Delete the empty file
  try {
    await fs.unlink(getPlotFileName(fileIndex));
    logger.info(`🗑️ Cleaned up empty file ${fileIndex}`);
  } catch (error) {
    logger.warn(`Failed to delete empty file ${fileIndex}:`, error);
  }
  
  await writePlotIndex(index);
}

function generatePlotId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export async function getStorageStats(): Promise<{
  totalFiles: number;
  totalPlots: number;
  totalSize: string;
  fileBreakdown: Array<{
    fileName: string;
    plotCount: number;
    fileSize: string;
    lastModified: string;
  }>;
}> {
  const index = await readPlotIndex();
  const totalSize = index.fileStats.reduce((sum, stat) => sum + stat.fileSize, 0);
  
  return {
    totalFiles: index.totalFiles,
    totalPlots: index.totalPlots,
    totalSize: formatFileSize(totalSize),
    fileBreakdown: index.fileStats.map(stat => ({
      fileName: `plots_${stat.fileIndex.toString().padStart(3, '0')}.json`,
      plotCount: stat.plotCount,
      fileSize: formatFileSize(stat.fileSize),
      lastModified: stat.lastModified
    }))
  };
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Initialize the system
export async function initializeMultiFileStorage(): Promise<void> {
  await ensureDataDir();
  
  // Check if we need to migrate from legacy system
  const legacyPath = path.join(DATA_DIR, 'plots.json');
  try {
    const legacyStats = await fs.stat(legacyPath);
    if (legacyStats.size > 0) {
      const legacyPlots = await readJsonFile<PlotType>(legacyPath);
      if (legacyPlots.length > 0) {
        const index = await readPlotIndex();
        if (index.totalFiles === 0) {
          await migrateLegacyData(legacyPlots);
        }
      }
    }
  } catch {
    // Legacy file doesn't exist, that's fine
  }
}