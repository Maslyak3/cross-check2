const fs = require('fs');
const path = require('path');
const pathToFolder = path.join(__dirname, 'secret-folder');

fs.readdir(pathToFolder, (err, fileList) => {
  fileList.forEach((file) => {
    const pathToFile = path.join(pathToFolder, file);
    fs.stat(pathToFile, (err, el) => {
      let elSize = el.size;
      const extansion = path.extname(file);
      if (el.isFile()) {
        console.log(
          file.slice(0, -extansion.length),
          '-',
          extansion.slice(1, extansion.length),
          '-',
          elSize,
        );
      }
    });
  });
});
