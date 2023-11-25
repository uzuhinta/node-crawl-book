const imgToPDF = require('image-to-pdf');
const fs = require('fs');

const pages = [];

var r = /\d+/;

fs.readdirSync('./screenshots').forEach((file) => {
  console.log(file);
  pages.push(`./screenshots/${file}`);
});

const sortPages = [...pages].sort((a, b) => {
  const aNumber = +a.match(r);
  const bNumber = +b.match(r);

  return aNumber - bNumber;
});

console.log(sortPages);

imgToPDF(sortPages, [841.89, 595.28]).pipe(
  fs.createWriteStream('Dive_into_design_patern.pdf')
);
