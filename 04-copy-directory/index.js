const fs = require('fs').promises;
const path = require('path');

async function createCopyFolder() {
  const pathFolder = path.join(__dirname, 'files-copy');
  await fs.mkdir(pathFolder);
}
createCopyFolder();
