import { readCNABFile } from './fileUtils.js';
import { getBodyLines, filterBySegmentWithLineNumbers, searchCompany, exportToJSON } from './cnabUtils.js';
import chalk from 'chalk';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function processCNAB(options) {
  const { filePath, from, to, segmento, empresa, exportFlag } = options;
  const allLines = await readCNABFile(filePath);
  const body = getBodyLines(allLines);

  if (empresa) {
    console.log(chalk.blue(`Pesquisando pela empresa: "${empresa}"...`));
    const results = searchCompany(body, empresa);
    if (results.length === 0) {
      console.log(chalk.yellow('Nenhuma empresa encontrada com o termo informado.'));
    } else {
      results.forEach(res => {
        console.log(chalk.green(`Empresa encontrada na linha ${res.originalLineNumber}:`));
        console.log(`  Nome: ${chalk.bold(res.companyName)}`);
        console.log(`  Segmento: ${res.segment}`);
      });
      if (exportFlag) {
        const jsonFile = await exportToJSON(results, from, to, __dirname);
        if (jsonFile) {
          console.log(chalk.green(`Arquivo JSON exportado com sucesso: ${jsonFile}`));
        } else {
          console.log(chalk.yellow("Nenhum resultado do segmento Q encontrado para exportação."));
        }
      }
    }
  } else {
    const filteredResults = filterBySegmentWithLineNumbers(body, segmento, 2);
    if (filteredResults.length === 0) {
      console.log(chalk.yellow(`Nenhuma linha encontrada${segmento ? ` para o segmento "${segmento}"` : ''}.`));
      return;
    }
    if (segmento.toUpperCase() === 'Q') {
      filteredResults.forEach(item => {
        const companyName = item.line.slice(32, 73).split(/\s{2,}/)[0].trim();
        console.log(`Linha ${item.originalLineNumber}: ${companyName}`);
      });
    } else {
      filteredResults.forEach(item => {
        console.log(`Linha ${item.originalLineNumber}: ${item.line}`);
      });
    }
    if (exportFlag) {
      const jsonFile = await exportToJSON(filteredResults, from, to, __dirname);
      if (jsonFile) {
        console.log(chalk.green(`Arquivo JSON exportado com sucesso: ${jsonFile}`));
      } else {
        console.log(chalk.yellow("Nenhum resultado do segmento Q encontrado para exportação."));
      }
    }
  }
}
