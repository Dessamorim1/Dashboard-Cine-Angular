const fs = require('fs');
const path = require('path');
require('dotenv').config();

const BACK4APP_APP_ID = process.env.BACK4APP_APP_ID || '';
const BACK4APP_API_KEY = process.env.BACK4APP_API_KEY || '';
const API_KEY_TMB = process.env.API_KEY_TMB || '';

const envDir = path.resolve('src/environments');

if (!fs.existsSync(envDir)) {
  fs.mkdirSync(envDir, { recursive: true });
}

const devContent = `export const environment = {
  production: false,
  BACK4APP_APP_ID: '${BACK4APP_APP_ID}',
  BACK4APP_API_KEY: '${BACK4APP_API_KEY}',
  API_KEY_TMB: '${API_KEY_TMB}'
};`;

// conteúdo do production
const prodContent = `export const environment = {
  production: true,
  BACK4APP_APP_ID: '${BACK4APP_APP_ID}',
  BACK4APP_API_KEY: '${BACK4APP_API_KEY}',
  API_KEY_TMB: '${API_KEY_TMB}'
};`;

fs.writeFileSync(path.join(envDir, 'environment.development.ts'), devContent);
fs.writeFileSync(path.join(envDir, 'environment.production.ts'), prodContent);

console.log('environment.development.ts e environment.production.ts gerados');
