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


let queryUrl = function (dateNum, next) {
  loadHtml("http://app.zhcw.com/wwwroot/zhcw/jsp/kjggServ.jsp?catalogId=14609&issueNo=" + dateNum + "&jsonpcallback=?", function (err, data) {
    if (err) {
      return next(err)
    }
    let str = data.body;
    str = str.replace(new RegExp('\n', 'g'), '');
    str=str.substring(str.indexOf('(')+1);
    str=str.substring(0,str.indexOf(')'));
    data = JSON.parse(str);
    next(null, data.id);
  })
};

let str = fs.readFileSync(path.join(__dirname, `../json/summary/all.json`), 'utf8');

let allJson = JSON.parse(str);
let urlPath = [];
async.eachSeries(allJson, function (one, nextO) {
  queryUrl(one.dateNum, function (err, id) {
    if (err) {
      return nextO(err)
    }
    urlPath.push("http://www.zhcw.com/ssq/kjgg/" + id + ".shtml")
    console.log(`success: ${one.dateNum} ,${id}`);
    nextO();
  })
}, function (err, date) {
  if (err) {
    return console.log(err);
  } else {
    mkdirp(path.join(__dirname, `../json/detail`))
    fs.writeFileSync(path.join(__dirname, `../json/detail/path.json`), JSON.stringify(urlPath), 'utf8');
  }
});
