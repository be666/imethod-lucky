/**
 * Created by bcaring on 16/8/9.
 */
let async = require('async');
let path = require('path');
let http = require('http');
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

    res.on('error', (err) => {
      cbx(err, {
        url: _url,
        state: "false"
      });
    });
  });

  req.on('error', (err) => {
    console.log(err)
    cbx(null, {
      url: _url,
      state: "false"
    });
  });
  req.end();
};


let loadDetail = function (path, next) {
  loadHtml(path, function (err, text) {
    if (err) {
      return next(err);
    }
    if ($("#currentScript", text.body).length == 0) {
      let $table = $(".result_tab", text.body)[0];
      let trL = $(">tbody >tr", $table);
      if (trL.length == 0) {
        trL = $(" >tr", $table);
      }
      console.log($('td', trL[1])[1])
      console.log($($('td', trL[1])[1]).text())
      next(err, {
        onez: $($('td', trL[1])[1]).text(),
        onej: $($('td', trL[1])[2]).text(),
        twoz: $($('td', trL[2])[1]).text(),
        twoj: $($('td', trL[2])[2]).text(),
        threez: $($('td', trL[3])[1]).text(),
        threej: $($('td', trL[3])[2]).text(),
        fourz: $($('td', trL[4])[1]).text(),
        fourj: $($('td', trL[4])[2]).text(),
        fivez: $($('td', trL[5])[1]).text(),
        fivej: $($('td', trL[5])[2]).text(),
        sixz: $($('td', trL[6])[1]).text(),
        sixj: $($('td', trL[6])[2]).text()
      })
    } else {
      let data = $("#currentScript", text.body).text();
      let dataJson = {};
      dataJson = JSON.parse(data)[0];
      next(err, {
        onez: dataJson['ONE_Z'],
        onej: dataJson['ONE_J'],
        twoz: dataJson['TWO_Z'],
        twoj: dataJson['TWO_J'],
        threez: dataJson['THREE_Z'],
        threej: dataJson['THREE_J'],
        fourz: dataJson['FOUR_Z'],
        fourj: dataJson['FOUR_J'],
        fivez: dataJson['FIVE_Z'],
        fivej: dataJson['FIVE_J'],
        sixz: dataJson['SIX_Z'],
        sixj: dataJson['SIX_J']
      })
    }

  });

};


let strPathObj = fs.readFileSync(path.join(__dirname, `../json/detail/pathObj.json`), 'utf8');

let jsonPathObj = JSON.parse(strPathObj);

let dataList = [];
let i = 0;
let j = 1;
async.eachSeries(jsonPathObj, function (pathObj, nextP) {
  i++;
  if (j < 13) {
    if (i == 20) {
      j++;
      i = 0;
    }
    return nextP();
  }
  loadDetail(pathObj.path, function (err, data) {
    if (err) {
      return nextP(err);
    }
    data.dateNum = pathObj.dateNum;
    console.log(pathObj.dateNum);
    console.log({i, j});
    dataList.push(data);
    nextP();
    if (i == 20) {
      fs.writeFileSync(path.join(__dirname, `../json/detail/${j}.json`), JSON.stringify(dataList), 'utf8');
      dataList = [];
      j++;
      i = 0;
    }
  })

}, function (err, res) {
  if (err) {
    return console.log(err);
  }
  fs.writeFileSync(path.join(__dirname, `../json/detail/${j}.json`), JSON.stringify(dataList), 'utf8');
});
