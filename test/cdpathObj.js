/**
 * Created by bcaring on 16/8/9.
 */
let async = require('async');
let path = require('path');
let mkdirp = require('mkdirp');
let fs = require('fs');
let strAll = fs.readFileSync(path.join(__dirname, `../json/summary/all.json`), 'utf8');
let strPath = fs.readFileSync(path.join(__dirname, `../json/detail/path.json`), 'utf8');

let jsonAll = JSON.parse(strAll);
let jsonPath = JSON.parse(strPath);
let jsonPathObj = [];
for (let i = 0; i < jsonAll.length; i++) {
  if (jsonPath[i].indexOf('undefined') > -1) {
    // console.log(jsonAll[i]);
    console.log(jsonAll[i].dateNum);
  }else{
    jsonPathObj.push({
      dateNum: jsonAll[i].dateNum,
      path: jsonPath[i]
    })
  }
}
fs.writeFileSync(path.join(__dirname, `../json/detail/pathObj.json`), JSON.stringify(jsonPathObj), 'utf8');

