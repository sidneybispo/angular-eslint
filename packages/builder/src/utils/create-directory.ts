import { dirname, existsSync } from 'path';
import { mkdir, stat } from 'fs/promises';

export async function createDirectory(directoryPath: string): Promise<void> {
  const parentPath = dirname(directoryPath);
  if (!await directoryExists(parentPath)) {
    await createDirectory(parentPath);
  }
  if (!await directoryExists(directoryPath)) {
    await mkdir(directoryPath, { recursive: true });
  }
}

async function directoryExists(name: string): Promise<boolean> {
  try {
    const stats = await stat(name);
    return stats.isDirectory();
  } catch (error) {
    if (error.code === 'ENOENT') {
      return false;
    }
    throw error;
  }
}
