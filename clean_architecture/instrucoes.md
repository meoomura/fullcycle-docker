
Criar projeto typescript
``` bash
# criando packages typescript
npm i typescript --save-dev

# iniciando configuração typescript
npx tsc --init

```

Configurar arquivo tsconfig.json
``` json
# descomentar os parametros
"incremental": true,                              /* Save .tsbuildinfo files to allow for incremental compilation of projects. */
"outDir": "./dist",                               /* Specify an output folder for all emitted files. */

#incluir a pasta onde ficarão os fontes
  ,
  "include": [
      "src/**/*.js"
  ],
```

Configurar tslint
```bash
npm i tslint --save-dev
npx tslint --init

### causa conflito npm i tslint-config-airbnb --legacy-peer-deps
```
 Configurar ambiente de testes
 ```bash
 #instalar jest
 npm i -D jest @types/jest ts-node --save-dev

 #instalar compilador swc
 npm i -D @swc/jest @swc/cli @swc/core

 #inicializar o jest
 npx jest --init

 #para evitar que erro de sintaxe não apareça nos testes colocar a instrução no arquivo package.json:
 "scripts": {
    "test": "npm run tsc -- --noEmit && jest",
    "tsc": "tsc"
  },
  # 
  # e colocar incluir o comando na configuração do vscode 
  "jestrunner.jestCommand": "npm test"
 ```

## ORM sequelize
```bash
npm install sequelize reflect-metadata sequelize-typescript

# utilizando o sqlite3
npm install sqlite3
```

## Express
```bash
npm i express @types/express dotenv
```

## Nodemon
```bash
npm i nodemon

# incluir o package.json o script
"dev": "nodemon src/infrastructure/api/server.ts"

# Executar o comando para startar o server
npm run dev
```

## Supertest
```bash
npm i -D supertest @types/supertest
```
