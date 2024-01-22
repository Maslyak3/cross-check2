const fs = require('fs').promises;
const path = require('path');
const pathOriginalFolder = path.join(__dirname, 'files');
const pathCopyFolder = path.join(__dirname, 'files-copy');

async function createCopyFolder() {
  try {
    await fs.rm(pathCopyFolder, { recursive: true, force: true });
  } catch (e) {
    console.log('oops', e);
  }
  await fs.mkdir(pathCopyFolder, { recursive: true });

  const originalFiles = await fs.readdir(pathOriginalFolder);
  await Promise.all(
    originalFiles.map(async (file) => {
      const pathOriginalFolderForCopy = path.join(pathOriginalFolder, file);
      const pathCopyFolderForCopy = path.join(pathCopyFolder, file);
      await fs.copyFile(pathOriginalFolderForCopy, pathCopyFolderForCopy);
    }),
  );
}
createCopyFolder();
