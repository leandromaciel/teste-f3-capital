import { writeFile } from 'fs/promises';
import path from 'path';

export function getBodyLines(lines) {
  if (lines.length <= 4) {
    throw new Error("Arquivo com formato inesperado (menos de 4 linhas).");
  }
  return lines.slice(2, -2);
}

export function filterBySegmentWithLineNumbers(lines, segType, headerCount = 2) {
  if (!segType) {
    return lines.map((line, index) => ({ line, originalLineNumber: index + headerCount + 1 }));
  }
  const segUpper = segType.toUpperCase();
  const results = [];
  lines.forEach((line, index) => {
    if (line.charAt(13).toUpperCase() === segUpper) {
      results.push({ line, originalLineNumber: index + headerCount + 1 });
    }
  });
  return results;
}

export function searchCompany(lines, term) {
  const results = [];
  const termUpper = term.toUpperCase();
  lines.forEach((line, index) => {
    const companyField = line.slice(32, 73);
    const companyName = companyField.split(/\s{2,}/)[0].trim();
    if (companyName.toUpperCase().includes(termUpper)) {
      results.push({
        originalLineNumber: index + 3,
        line,
        companyName,
        segment: line.charAt(13)
      });
    }
  });
  return results;
}

export async function exportToJSON(results, fromPos, toPos, __dirname) {
  const resultsQ = results.filter(item => item.line.charAt(13).toUpperCase() === 'Q');
  if (resultsQ.length === 0) {
    return false;
  }
  const data = resultsQ.map(item => ({
    line: item.originalLineNumber,
    campoExtraido: (fromPos === null || toPos === null)
      ? item.line
      : item.line.substring(fromPos - 1, toPos).trim(),
    empresa: item.line.slice(32, 73).split(/\s{2,}/)[0].trim()
  }));
  const jsonFile = path.resolve(__dirname, '../files/processed/cnab_export.json');
  try {
    await writeFile(jsonFile, JSON.stringify(data, null, 2), 'utf8');
    return jsonFile;
  } catch (error) {
    throw new Error(`Erro ao exportar JSON: ${error.message}`);
  }
}
