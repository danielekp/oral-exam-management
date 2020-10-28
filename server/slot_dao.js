'use strict';

const db = require('./db')
const moment = require('moment');

exports.getSlots = function(course){
	return new Promise((resolve, reject) => {
		const sql = 'SELECT Start, End, Status, Student FROM "'+course+'"';
		db.all(sql, [], (err, rows) => {
			if(err){
				reject(err);
			} else {
				resolve(rows)
			}
		})
	})
}

exports.bookSlot = function(exam, start_date, student_id){
	return new Promise((resolve, reject) => {
		const sql = 'UPDATE "'+exam+'" SET Status="Booked",Student="'+student_id+'" WHERE Start="'+start_date+'"';
		db.run(sql, [], (err) => {
			if(err){
				reject(err);
			} else {
				resolve('ok');
			}
		})
	})
}

exports.deleteBooking = function(exam, student_id){
	return new Promise((resolve, reject) => {
		const sql = 'UPDATE "'+exam+'" SET Status="Free", Student=null WHERE Student="'+student_id+'"';
		db.run(sql, [], (err) => {
			if(err){
				reject(err);
			} else {
						resolve('ok');
			}
		})
	})
}
