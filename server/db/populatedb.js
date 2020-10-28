'use strict';
var moment = require('moment');

const sqlite = require('sqlite3').verbose();

const DBSOURCE = './booking.db';

const db = new sqlite.Database(DBSOURCE, (err) => {
  if(err){
    console.error(err.message);
    throw err;
  }
});

let slot = [];
let slot_init = moment().add(18, 'days').subtract(7, 'hours');
let slot_init_copy;
let sql;

while(slot_init.hours()!=19){
  slot_init_copy = slot_init;
  //slot.push([slot_init_copy.format('DD/MM/YY_HH:mm').toString(), slot_init.add(15, 'minutes').format('DD/MM/YY_HH:mm').toString()]);
  sql = 'INSERT INTO "Web_Applications_06/09/2020"(Start, End) VALUES("'+slot_init_copy.format('DD/MM/YY_HH:mm').toString()+'","'+slot_init.add(15, 'minutes').format('DD/MM/YY_HH:mm').toString()+'")';
  console.log(sql)
  db.run(sql);
}
