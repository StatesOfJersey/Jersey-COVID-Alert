'use strict';

const fs = require('fs');
const _ = require('lodash');
const Excel = require('exceljs');

function process(ws, path, en, bg, pl, pt, ro) {
  if (!_.isObject(en)) {
    const enVal = en.replace(/\n/g, '\\n');
    const bgVal = _.get(bg, path, '');
    const plVal = _.get(pl, path, '');
    const ptVal = _.get(pt, path, '');
    const roVal = _.get(ro, path, '');

    ws.addRow({
      context: path,
      english: enVal,
      bulgarian: bgVal,
      polish: plVal,
      portuguese: ptVal,
      romanian: roVal
    });
    return;
  }

  Object.keys(en).forEach((key) => {
    process(
      ws,
      path === '' ? key : `${path}.${key}`,
      en[key],
      bg,
      pl,
      pt,
      ro
    );
  });
}

async function generateFile() {

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

  const workbook = new Excel.Workbook();
  const worksheet = workbook.addWorksheet('Translations');

  worksheet.columns = [
    {header: 'Context', key: 'context'},
    {header: 'English', key: 'english'},
    {header: 'Bulgarian', key: 'bulgarian'},
    {header: 'Polish', key: 'polish'},
    {header: 'Portuguese', key: 'portuguese'},
    {header: 'Romanian', key: 'romanian'}
  ];

  process(worksheet, '', en, bg, pl, pt, ro);

  await workbook.xlsx.writeFile('output.xlsx');
}

generateFile();