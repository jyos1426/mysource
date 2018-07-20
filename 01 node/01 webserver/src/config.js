const fs = require('fs');
const path = require('path')
const execSync = require('child_process').execSync

const log = require('./libs/log');

const configFileName = "../config.json";
const sniperDatFilePath = "/home1/TMS21/sniper.dat"
const cmd = 'cat /home1/TMS21/sniper.dat |grep "^[Serial].*\\[" | md5sum | cut -d " " -f1'

const root_path = this.getConfigValue('root_path')
const dbb_path  = root_path + '/dbb/'
exports.path = {
  ssl: {
    key: '../.pem',
    cert: '../.crt'
  },

  dbbpath     : dbb_path,
  auditpath   : dbb_path + 'audit.dbb',
  versionPath: '/home1/-/',
  intergrityPath : '/home1/-/integrity_db.sh'
};

log.write("INFO",`[config.js] config path value = ${JSON.stringify(this.path)}`)
