import fs from 'fs';
import path from 'path';

const MODELS_PATH = './src/model/generated';
const TABLE_NAMES = {
  'account.model.ts': 'accounts',
  'dexLiquidity.model.ts': 'dex_liquidities',
  'socialMedia.model.ts': 'social_media',
  'token.model.ts': 'tokens',
  'trade.model.ts': 'trades',
};

const fixEntity = (fileName, tableName) => {
  const filePath = path.join(MODELS_PATH, fileName);
  const content = fs.readFileSync(filePath, 'utf-8');
  const replaced = content.replace('@Entity_()', `@Entity_({ name: '${tableName}' })`);
  if (replaced !== content) {
    fs.writeFileSync(filePath, replaced, 'utf-8');
  }
};

const fixEntities = () => {
  Object.entries(TABLE_NAMES).forEach(([fileName, tableName]) => {
    fixEntity(fileName, tableName);
  });
};

fixEntities();
