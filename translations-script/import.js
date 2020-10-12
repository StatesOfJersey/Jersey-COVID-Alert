const fs = require('fs');
const _ = require('lodash');
const readXlsxFile = require('read-excel-file/node');

async function main(filename) {
  const enRaw = await fs.promises.readFile('../src/assets/lang/en.json');
  const bgRaw = await fs.promises.readFile('../src/assets/lang/bg.json');
  const plRaw = await fs.promises.readFile('../src/assets/lang/pl.json');
  const ptRaw = await fs.promises.readFile('../src/assets/lang/pt.json');
  const roRaw = await fs.promises.readFile('../src/assets/lang/ro.json');

  const en = JSON.parse(enRaw);
  const bg = JSON.parse(bgRaw);
  const pl = JSON.parse(plRaw);
  const pt = JSON.parse(ptRaw);
  const ro = JSON.parse(roRaw);

  const [, ...rows] = await readXlsxFile(filename);
  rows.forEach((row) => {
    const path = row[0];
    _.set(en, path, row[1]);
    _.set(bg, path, row[2]);
    _.set(pl, path, row[3]);
    _.set(pt, path, row[4]);
    _.set(ro, path, row[5]);
  });

  return [en, bg, pl, pt, ro];
}

main('input.xlsx').then(([en, bg, pl, pt, ro]) => {
  fs.writeFileSync('../src/assets/lang/en.json', JSON.stringify(en, null, 2));
  fs.writeFileSync('../src/assets/lang/bg.json', JSON.stringify(bg, null, 2));
  fs.writeFileSync('../src/assets/lang/pl.json', JSON.stringify(pl, null, 2));
  fs.writeFileSync('../src/assets/lang/pt.json', JSON.stringify(pt, null, 2));
  fs.writeFileSync('../src/assets/lang/ro.json', JSON.stringify(ro, null, 2));
});