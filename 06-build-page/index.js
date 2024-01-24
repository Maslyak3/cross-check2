const fs = require('fs').promises;
const path = require('path');
const pathToTemplate = path.join(__dirname, 'template.html');
const pathToComponents = path.join(__dirname, 'components');
const pathToIndexHtml = path.join(__dirname, 'index.html');

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

      await fs.writeFile(pathToIndexHtml, templateContent, 'utf-8'); //create index.html with content
    }
  } catch (err) {
    console.error(err);
  }
}

createSite();
