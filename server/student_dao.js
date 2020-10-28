'use strict';

const db = require('./db')

exports.getExam = function(student_id){
	return new Promise((resolve, reject) => {
	const sql = "SELECT name FROM Exams WHERE id in (SELECT exams FROM Students WHERE id='"+student_id+"')";
	db.all(sql, [], (err, rows) => {
		if(err){
			reject(err);
		} else {
			resolve(rows);
		}
	})
	})
}

exports.getBookedSlot = function(student_id, exam){
	return new Promise((resolve, reject) => {
		const sql = "SELECT Start, Grade FROM '"+exam.replace(/ /g,'_')+"' WHERE Student='"+student_id+"' AND Status='Booked'";
		db.all(sql, [], (err, rows) => {
				if(err){
					reject(err)
				} else {
					resolve(rows);
				}})
	})
}
