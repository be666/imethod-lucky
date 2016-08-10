/**
 * Created by bcaring on 16/8/9.
 */
'use strict'
let fs=require('fs');
let path=require('path');
let async=require('async');
let arr = Array.from({length: 100}, function (n,i) {
  return i+1;
});
let dataStr=[];
async.eachSeries(arr, function (i, nextI) {
  let str=fs.readFileSync(path.join(__dirname, `../json/summary/${i}.json`),'utf8');
  str=str.replace(new RegExp('\n','g'),'');
  dataStr.push(str.substring(1,str.length-1));
  nextI()
},function (err,s) {
  if(err){
    console.log(err)
  }else{
    console.log('xxx');
    fs.writeFileSync(path.join(__dirname, `../json/summary/all.json`), `[\n${dataStr.join(',\n')}\n]`, 'utf-8');
  }
});


