const fs = require('fs').promises;
const path = require('path');
const pathToTemplate = path.join(__dirname, 'template.html');
const pathToComponents = path.join(__dirname, 'components');
const pathToIndexHtml = path.join(__dirname, 'index.html');
const pathToProjectDist = path.join(__dirname, 'project-dist');
const pathToStyles = path.join(__dirname, 'styles');
const pathToStyleCss = path.join(pathToProjectDist, 'style.css');
const arrOfStyles = [];

async function createSite() {
  try {
    let templateContent = await fs.readFile(pathToTemplate, 'utf-8');
    const componentsArray = await fs.readdir(pathToComponents); //array from components files

    // console.log(componentsArray);
    for (let i = 0; i < componentsArray.length; i++) {
      const extension = path.extname(componentsArray[i]);
      componentsArray[i] = componentsArray[i].slice(0, -extension.length); // remove extansions
    }
    console.log(componentsArray);

    for (const fileName of componentsArray) {
      const pathToComponentsFiles = path.join(
        pathToComponents,
        `${fileName}.html`, //add extansions
      );
      const regexp = new RegExp(`\\{\\{${fileName}\\}\\}`, 'g'); //change any {{word}} for content
      templateContent = templateContent.replace(
        regexp,
        await fs.readFile(pathToComponentsFiles, 'utf-8'),
      );
    }

    await fs.writeFile(pathToIndexHtml, templateContent, 'utf-8'); //create index.html with content

    await fs.mkdir(pathToProjectDist, { recursive: true }); // create the project-dist

    // replace index.html in project-dist folder
    await fs.rename(
      pathToIndexHtml,
      path.join(pathToProjectDist, 'index.html'),
    );
    // combine and move styles into project-dist -----------------------------------
    const stylesFilesList = await fs.readdir(pathToStyles, { recursive: true });

    await Promise.all(
      stylesFilesList.map(async (file) => {
        // if (path.extname(file) === '.css') {
        const data = await fs.readFile(path.join(pathToStyles, file), 'utf-8');
        arrOfStyles.push(data);
        // }
      }),
    );
    await fs.rm(pathToStyleCss, { recursive: true, force: true });
    await fs.writeFile(pathToStyleCss, '');
    await Promise.all(
      arrOfStyles.map(async (cssData) => {
        await fs.appendFile(pathToStyleCss, cssData);
      }),
    );
    copyAssets(pathToAssets, pathToTargetAssets); // invoking function for copying assets
    //-------------------------------------------------------------------------------
  } catch (err) {
    console.error(err);
  }
}

// copy assets into project-dist ----------------------------------------------
const pathToAssets = path.join(__dirname, 'assets');
const pathToTargetAssets = path.join(pathToProjectDist, 'assets');

async function copyAssets(assets, target) {
  try {
    const assetsFilesArray = await fs.readdir(assets);
    await fs.mkdir(target, { recursive: true });
    await Promise.all(
      assetsFilesArray.map(async (file) => {
        const pathToAssets = path.join(assets, file);
        const pathToTarget = path.join(target, file);
        const assetsStat = await fs.stat(pathToAssets);
        if (assetsStat.isDirectory()) {
          await copyAssets(pathToAssets, pathToTarget);
        } else {
          await fs.copyFile(pathToAssets, pathToTarget);
        }
      }),
    );
  } catch (err) {
    console.error(err);
  }
}
//-------------------------------------------------------------------------------
createSite();
