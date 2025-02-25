import { readFile } from 'fs/promises';

export async function readCNABFile(filePath) {
  try {
    console.time('leitura Async');
    const content = await readFile(filePath, 'utf8');
    console.timeEnd('leitura Async');
    return content.split('\n').filter(line => line.trim() !== '');
  } catch (error) {
    throw new Error(`Erro ao ler o arquivo: ${error.message}`);
  }
}
