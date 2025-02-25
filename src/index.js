#!/usr/bin/env node
import path from 'path';
import { fileURLToPath } from 'url';
import yargs from 'yargs';
import { processCNAB } from './cnabReader.js';
import chalk from 'chalk';

const optionsYargs = yargs(process.argv.slice(2))
  .usage('Uso: $0 [opções]')
  .option("f", { 
    alias: "from", 
    describe: "posição inicial de pesquisa da linha do CNAB", 
    type: "number", 
    demandOption: false, 
    default: null 
  })
  .option("t", { 
    alias: "to", 
    describe: "posição final de pesquisa da linha do CNAB", 
    type: "number", 
    demandOption: false, 
    default: null 
  })
  .option("s", { 
    alias: "segmento", 
    describe: "tipo de segmento", 
    type: "string", 
    demandOption: false, 
    default: "" 
  })
  .option("arquivo", { 
    alias: "a", 
    describe: "Caminho do arquivo CNAB", 
    type: "string", 
    default: null 
  })
  .option("empresa", { 
    alias: "e", 
    describe: "Pesquisa por nome da empresa (parcial ou completo)", 
    type: "string" 
  })
  .option("export", { 
    alias: "x", 
    describe: "Exporta os resultados para um arquivo JSON", 
    type: "boolean", 
    default: false 
  })
  .example('$0 -e TECNOL -x', 'Pesquisa empresa e exporta os resultados para JSON (somente segmentos Q)')
  .argv;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = optionsYargs.arquivo
  ? path.resolve(optionsYargs.arquivo)
  : path.resolve(__dirname, '../files/raw/cnabExample.rem');

if (!optionsYargs.arquivo) {
  console.log(chalk.yellow("Arquivo não informado, usando arquivo padrão em ../files/raw/cnabExample.rem"));
}

const options = {
  filePath,
  from: optionsYargs.from,
  to: optionsYargs.to,
  segmento: optionsYargs.segmento,
  empresa: optionsYargs.empresa,
  exportFlag: optionsYargs.export
};

processCNAB(options);
