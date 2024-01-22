const fs = require('fs');
const path = require('path');
const writeStream = fs.createWriteStream(path.join(__dirname, 'text.txt'), {
  encoding: 'utf-8',
});
const { stdin, stdout } = process;

stdout.write('Write text:\n');

stdin.on('data', (data) => {
  if (data.toString().trim() === 'exit') {
    process.exit();
  } else {
    writeStream.write(data);
  }
});

process.on('SIGINT', () => process.exit());

process.on('exit', () => {
  console.log('Good Bye!');
});
