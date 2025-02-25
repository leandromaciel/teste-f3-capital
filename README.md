# CNAB Reader

O **CNAB Reader** é uma ferramenta de linha de comando (CLI) desenvolvida em Node.js para leitura, filtragem e exportação de arquivos CNAB. Ela permite:
- Filtrar linhas do arquivo CNAB por segmento.
- Pesquisar por nome de empresa (usando o campo de empresa do arquivo).
- Exportar os resultados para um arquivo JSON (apenas registros do segmento Q).

> **Observação:**  
> O arquivo CNAB padrão é lido da pasta `files/raw` e os arquivos exportados são salvos na pasta `files/processed`.

---

## Requisitos

- Node.js (versão 22)
- npm

---

## Instalação

Clone o repositório e navegue para o diretório do projeto:

   ```bash
   git clone <URL-do-repositório>
   cd cnab-reader
   npm install
   ```


## Estrutura do projeto
```bash
cnab-reader/
├── package.json             # Gerenciador de dependências e scripts
├── jest.config.js           # Configuração do Jest para testes unitários
├── babel.config.cjs         # Configuração do Babel para transformar ES Modules
├── src/
│   ├── index.js             # Ponto de entrada da CLI
│   ├── cnabReader.js        # Orquestra o processamento do CNAB
│   ├── cnabUtils.js         # Funções de processamento (filtragem, busca exportação, etc.)
│   └── fileUtils.js         # Funções para leitura de arquivo
├── tests/
│   └── cnabUtils.test.js    # Testes unitários (usando Jest)
└── files/
    ├── raw/
    │   └── cnabExample.rem  # Arquivo CNAB de exemplo
    └── processed/           # Pasta onde os arquivos exportados serão salvos
```


## Uso

Executando a CLI
Para executar o CNAB Reader, utilize o seguinte comando:
```bash
node src/index.js [opções]
```

Opções Disponíveis
-a, --arquivo
Descrição: Caminho para o arquivo CNAB.
Padrão: files/raw/cnabExample.rem (caso não seja informado).

-f, --from
Descrição: Posição inicial para extração de um campo da linha do CNAB.
Padrão: null (caso não seja informado, extrai a linha inteira).

-t, --to
Descrição: Posição final para extração de um campo da linha do CNAB.
Padrão: null.

-s, --segmento
Descrição: Tipo de segmento a ser filtrado.
Padrão: "" (se não informado, todas as linhas são consideradas).

-e, --empresa
Descrição: Pesquisa por nome da empresa (parcial ou completo). Quando informado, o script realiza a busca e exibe os resultados.

-x, --export
Descrição: Exporta os resultados para um arquivo JSON (apenas registros do segmento Q, pois os segmentos Q e R não possuem endereço).
Padrão: false.

## Exemplos de Uso
1. Pesquisar por empresa e exportar os resultados para JSON:
```bash
node src/index.js -e TECNOL -x
```

2. Filtrar linhas por segmento e extrair um campo específico (utilizando -f e -t):
```bash
node src/index.js -s P -f 21 -t 34
```

3 . Utilizar um arquivo CNAB customizado:
```bash
node src/index.js -a /caminho/para/seu/arquivo.rem
```

## Execução dos Testes
Os testes unitários foram desenvolvidos utilizando o Jest. Para executá-los, utilize:
```bash
npm test
```

Os testes estão localizados na pasta tests/ e cobrem as principais funções do módulo cnabUtils.js.

