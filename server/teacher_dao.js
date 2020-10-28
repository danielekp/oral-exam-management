'use strict';

const Teacher = require('./teacher');
const db = require('./db');
const moment = require('moment');

const createTeacher = function (row) {
    const id = row.id;
    const name = row.name;
    const password = row.password;

    return new Teacher(name, password, id);
}

exports.getTeacherByName = function (name) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM Teachers WHERE name = '"+name+"'";
        db.all(sql, [], (err, rows) => {
            if (err)
                reject(err);
            else if (rows.length === 0)
                resolve(undefined);
            else{
                const user = createTeacher(rows[0]);
                resolve(user);
            }
        });
    });
  };

  exports.getTeacher = function(name){
  return new Promise((resolve,reject) => {
    const sql = "SELECT * FROM Teachers WHERE name = '"+name+"'";
    db.all(sql, [], (err, rows) => {
      if(err){
        reject(err);
      } else if (rows.length===0){
        resolve(undefined);
      } else{
        const user = createTeacher(rows[0]);
        resolve(user);
      }
    })
  })
}

exports.checkPassword = function(user, password){
    return user.password===password;
}

exports.getStudentLine = function(name){
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM Students WHERE exams in (SELECT id FROM Exams WHERE name='"+name+"')";
    console.log(sql);
    db.all(sql, [], (err, rows) => {
      if(err)
        reject(err);
      else
        resolve(rows);
    })
  })
}

exports.getLineInfo = function(student, exam){
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM '"+exam+"' WHERE Student='"+student+"'"
    console.log(sql);
    db.all(sql, [], (err, rows)=>{
      if(err){
        reject(err);
      } else{
        resolve(rows);
      }
    })
  })
  }

exports.getExams = function(name){
  return new Promise((resolve, reject) => {
    const sql = "Select name FROM Exams WHERE Teacher='"+name+"'";
    db.all(sql, [], (err, rows)=>{
      if(err){
        reject(err);
      } else{
        resolve(rows);
      }
    })
  })
}

exports.setGrade = function(grade, student, exam){
  return new Promise((resolve, reject) => {
    const sql = "UPDATE '"+exam+"' SET Grade="+grade+" WHERE Student='"+student+"'";
    db.run(sql, [], (err) => {
      if(err)
        reject(err);
      else
          if(grade>17){
              const sql_2 = "UPDATE Students_Courses SET Passed=1 WHERE Student='"+student+"'";
              db.run(sql_2, [], (err) => {
                  if(err)
                      reject(err);
                  else 
                      resolve('ok');
              })}
    })
  })
}

exports.getStudents = function(teacher){
  return new Promise((resolve, reject) => {
    const sql = "SELECT Student FROM Students_Courses WHERE Course in (SELECT id FROM Courses WHERE Teacher='"+teacher+"')";
    db.all(sql, [], (err, rows) => {
      if(err)
        reject(err);
      else
        resolve(rows);
    })
  })
}

exports.addExam = function(students, date, duration, duration_total, teacher){
  return new Promise((resolve, reject) => {
    const sql_1 = "SELECT Name, id FROM Courses WHERE Teacher='"+teacher+"'";
    console.log(sql_1);
    db.all(sql_1, [], (err, rows) => {
      if(err)
        reject(err);
      else{
        const table_name = rows[0].Name+"_"+date.split('_')[0];
        const sql_2 = "CREATE TABLE '"+table_name+"' (Start INTEGER, End INTEGER, Status TEXT DEFAULT 'Free', Student TEXT DEFAULT Null, Grade INTEGER)"
        db.run(sql_2, [], (err) => {if(err) reject(err); else{
          let d = moment(date, 'DD/MM/YY_HH:mm');
          let sql;
          for(let i=0; i<duration_total; i=i+duration){
            sql = "INSERT INTO '"+table_name+"' (Start, End) VALUES('"+d.format('DD/MM/YY_HH:mm').toString()+"','"+d.add(duration,'minutes').format('DD/MM/YY_HH:mm').toString()+"')";
            db.run(sql, [], (err) => {
              if(err)
                reject(err);
            })
          }}})
          let course_id = rows[0].id;
          const sql_3 = "INSERT INTO Exams (name, Teacher, course_id) VALUES('"+table_name+"','"+teacher+"','"+course_id+"')";
          console.log(sql_3);
          db.run(sql_3, [], (err) => {
            if(err){
              reject(err);
            } else {
              const sql_4 = "SELECT id FROM Exams WHERE name='"+table_name+"'";
              db.all(sql_4, [], (err, rows2) => {
                if(err){
                  reject(err);
                } else {
                  for(let student of students){
                    const sql_5 = "INSERT INTO Students (id, exams, course_id) VALUES('"+student+"','"+rows2[0].id+"','"+course_id+"')";
                    db.run(sql_5, [], (err) => {
                      if(err){
                        reject(err);
                      }
                    })
                  }
                }
              })
            }
          })
          resolve('ok');
        }});
      }
    )
  }
