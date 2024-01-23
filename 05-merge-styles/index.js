const fs = require('fs').promises;
const path = require('path');
const pathToProject = path.join(__dirname, 'project-dist');
const pathToBundle = path.join(pathToProject, 'bundle.css');
const pathToStyles = path.join(__dirname, 'styles');
const arrOfStyles = [];
async function combine() {
  try {
    const stylesFilesList = await fs.readdir(pathToStyles, { recursive: true });

    await Promise.all(
      stylesFilesList.map(async (file) => {
        if (path.extname(file) === '.css') {
          const data = await fs.readFile(
            path.join(pathToStyles, file),
            'utf-8',
          );
          arrOfStyles.push(data);
        }
      }),
    );
    await fs.rm(pathToBundle, { recursive: true, force: true });
    await fs.writeFile(pathToBundle, '');
    await Promise.all(
      arrOfStyles.map(async (cssData) => {
        await fs.appendFile(pathToBundle, cssData);
      }),
    );
  } catch (e) {
    console.log(e);
  }
}
combine();

// if (path.extname(file) === 'css') {
//   const readFiles = fs.readFile(file, 'utf-8');
//   fs.writeFile(pathToProject)
// }
