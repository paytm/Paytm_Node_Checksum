"use strict";

var crypt = require('./crypt');
var util = require('util');
var crypto = require('crypto');

//mandatory flag: when it set, only mandatory parameters are added to checksum

function paramsToString(params, mandatoryflag) {
  var data = '';
  var flag = params.refund ? true : false;
  var value = "";
  delete params.refund;
  var tempKeys = Object.keys(params);
  if (!flag) tempKeys.sort();
  tempKeys.forEach(function (key) {
    value = params[key];

    if (value.indexOf("REFUND") > -1 || value.indexOf("|") > -1) {
      continue;
    }
    
    if (key !== 'CHECKSUMHASH' ) {
      if (params[key] === 'null') params[key] = '';
      if (!mandatoryflag || mandatoryParams.indexOf(key) !== -1) {
        data += (params[key] + '|');
      }
    }
  });
  return data;
}


function genchecksum(params, key, cb) {
	var flag = params.refund ? true : false;
  var data = paramsToString(params);
	crypt.gen_salt(4, function (err, salt) {
    var sha256 = crypto.createHash('sha256').update(data + salt).digest('hex');
    var check_sum = sha256 + salt;
    var encrypted = crypt.encrypt(check_sum, key);
    if (flag) {
      params.CHECKSUM = (encrypted);
      params.CHECKSUM = encrypted;
    } else {
      params.CHECKSUMHASH = (encrypted);
		}
    cb(undefined, params);
  });
}


function verifychecksum(params, key) {

  if (!params) console.log("params are null");

  var data = paramsToString(params, false);
  //TODO: after PG fix on thier side remove below two lines
  if (params.CHECKSUMHASH) {
    params.CHECKSUMHASH = params.CHECKSUMHASH.replace('\n', '');
    params.CHECKSUMHASH = params.CHECKSUMHASH.replace('\r', '');

    var temp = decodeURIComponent(params.CHECKSUMHASH);
    var checksum = crypt.decrypt(temp, key);
    var salt = checksum.substr(checksum.length - 4);
    var sha256 = checksum.substr(0, checksum.length - 4);
    var hash = crypto.createHash('sha256').update(data + salt).digest('hex');
    if (hash === sha256) {
      return true;
    } else {
      util.log("checksum is wrong");
      return false;
    }
  } else {
    util.log("checksum not found");
    return false;
  }
}

module.exports.genchecksum = genchecksum;
module.exports.verifychecksum = verifychecksum;


/* ---------------- TEST CODE ---------------- */
/*
(function () {

  if (require.main === module) {
       
    var ver_param = {
      MID: 'wVhtoq05771472615938',
      ORDER_ID: 52,
      CUST_ID: '298233',
      TXN_AMOUNT: '1',
      CHANNEL_ID: 'WEB',
      INDUSTRY_TYPE_ID: 'Retail',
      WEBSITE: 'PaytmMktPlace',
      CHECKSUMHASH: '5xORNy+qP7G53XWptN7dh1AzD226cTTDsUe4yjAgKe19eO5olCPseqhFDmlmUTcSiEJFXuP/usVEjHlfMCgvqtI8rbkoUCVC3uKZzOBFpOw='
    };
    genchecksum(ver_param, config.mid_key_map[ver_param.MID], function (err, res) {
      console.log(res);
    });
    if (verifychecksum(ver_param, config.mid_key_map[ver_param.MID])) {
      console.log('verified checksum');
    } else {
      console.log("verification failed");
    }

  }
}());




*/