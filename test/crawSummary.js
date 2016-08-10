/**
 * Created by bcaring on 16/8/9.
 */
'use strict';
let http = require('http');
let async = require('async');
let path = require('path');
let mkdirp = require('mkdirp');
let fs = require('fs');
let $ = require('cheerio');
let loadHtml = (_url, cbx)=> {
  let req = http.request(_url, (res) => {
    let dataList = [];
    let total = 0;
    res.on('data', (data) => {
      total += data.length;
      dataList.push(data);
    });
    res.on('end', () => {
      let _rss;
      _rss = Buffer.concat(dataList, total);
      cbx(null, {
        url: _url,
        body: _rss.toString(),
        state: "success"
      });
    });

    res.on('error', () => {
      cbx(null, {
        url: _url,
        state: "false"
      });
    });
  });

  req.on('error', () => {
    cbx(null, {
      url: _url,
      state: "false"
    });
  });
  req.end();
};

let loadSummary = function (index,next) {
  loadHtml(`http://kaijiang.zhcw.com/zhcw/html/ssq/list_${index}.html`, function (err, text) {
    if (err) {
      return next();
    }
    let $trl = $(".wqhgt >tr", text.body);

    let data = [];
    for (let i = 2; i < $trl.length - 1; i++) {
      let $tr = $trl[i];
      let nums = [];
      let num = $('em', $('>td', $tr)[2]).each(function (i, x) {
        nums.push($(x).text())
      });

      data.push({
        dateNum: $($('>td', $tr)[1]).text(),
        ball: nums,
        money: $($('>td', $tr)[3]).text(),
        z1: $('strong', $('>td', $tr)[4]).text(),
        z2: $('strong', $('>td', $tr)[5]).text(),
      });
    }
    mkdirp(path.join(__dirname, `../json/summary`));
    fs.writeFileSync(path.join(__dirname, `../json/summary/${index}.json`), JSON.stringify(data), 'utf-8');
    next()
  });


};
let arr = Array.from({length: 100}, function (n,i) {
  return i+1;
});
async.eachSeries(arr, function (i, nextI) {
  loadSummary(i,function () {
    console.log(`success: ${i}`);
    nextI()
  })
},function (err,s) {
  if(err){
    console.log(err)
  }else{
    console.log('success')
  }
});


