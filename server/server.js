'use strict';

const express = require('express');
const morgan = require('morgan');
const jwt = require('express-jwt');
const slotDao = require('./slot_dao')
const studentDao = require('./student_dao')
const cookieParser = require('cookie-parser');
const teacherDao = require('./teacher_dao');
const jsonwebtoken = require('jsonwebtoken');

const jwtSecret = 'OUKXdp16dNZT432Vd0DZXWKVvZdYAxZ8lcZQzbM6tAITkbkjVaGOwUJFC7f3f5jI';

const expireTime = 300;

const PORT = 3001;

const authErrorObj = {errors: [{ 'param': 'Server', 'msg': 'Authorization error'}]};

const app = express();

app.use(morgan('tiny'));

app.use(express.json())

app.use(cookieParser());

app.post('/api/logout', (req, res) => {
    res.clearCookie('token').end();
});

app.post('/api/availableSlot', (req, res) => {
	const course = req.body.course;
	slotDao.getSlots(course).then((n) => {
		res.json(n);
	}).catch((err) => res.status(401).json(err));
});

app.post('/api/getExam', (req, res) => {
	const student_id = req.body.stuid;
	studentDao.getExam(student_id).then((n) => {
		res.json(n);
	}).catch((err) => res.status(401).json(err));
});

app.post('/api/registerBooking', (req, res) => {
	const student_id = req.body.stuid;
	const exam = req.body.exam;
	const start_date = req.body.start_date;
	slotDao.bookSlot(exam, start_date, student_id).then((resp) => {
		res.json(resp);
	}).catch((err) => res.status(401).json(err));
})

app.post('/api/getBookedSlot', (req, res) => {
	const student_id = req.body.student_id;
	const exam = req.body.exam;
	studentDao.getBookedSlot(student_id, exam).then((n) => {
		res.json(n)
	}).catch((err) => res.status(401).json(err));
});

app.delete('/api/deleteBooking/:stuid', (req, res)=>{
	if(!req.body.exam){
		res.status(400).end();
	} else {
		const exam = req.body.exam;
		const student_id = req.params.stuid;
		slotDao.deleteBooking(exam, student_id).then((result) => res.status(204).end()).catch((err) => res.status(500).json({
            errors: [{'param': 'Server', 'msg': err}],
        }));
		}
});

app.post('/api/login', (req, res) => {
    const name = req.body.name;
    const password = req.body.password;

    teacherDao.getTeacher(name)
      .then((teacher) => {

        if(teacher === undefined) {
            res.status(404).send({
                errors: [{ 'param': 'Server', 'msg': 'Invalid name' }]
              });
        } else {
            if(!teacherDao.checkPassword(teacher, password)){
                res.status(401).send({
                    errors: [{ 'param': 'Server', 'msg': 'Wrong password' }]
                  });
            } else {
                const token = jsonwebtoken.sign({ teacher: teacher.name }, jwtSecret, {expiresIn: expireTime});
                res.cookie('token', token, { httpOnly: true, sameSite: true, maxAge: 1000*expireTime });
                res.json({id: teacher.id, name: teacher.name});
            }
        }
      }).catch((err) => {
            new Promise((resolve) => {setTimeout(resolve, 1000)}).then(() => res.status(401).json(authErrorObj))
        }
      );
  });

	app.use(
    jwt({
      secret: jwtSecret,
      getToken: req => req.cookies.token,
			algorithms: ['HS256']
    })
  );

	app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
      res.status(401).json(authErrorObj);
    }
  });

	app.get('/api/getExams', (req,res) => {
		const teacher = req.user && req.user.teacher;
		teacherDao.getExams(teacher).then((rows) =>{
			res.json(rows);
		}).catch((err) => {
					new Promise((resolve) => {setTimeout(resolve, 1000)}).then(() => res.status(401).json(authErrorObj))
			}
		);
	})

	app.get('/api/teacher', (req,res) => {
	    const teacher = req.user && req.user.teacher;
	    teacherDao.getTeacherByName(teacher)
	        .then((teacher) => {
	            res.json({id: teacher.id, name: teacher.name});
	        }).catch(
	        (err) => {
	         res.status(401).json(authErrorObj);
	        }
	      );
	});

  app.post('/api/studentLine', (req, res) => {
    const exam = req.body.exam;
    teacherDao.getStudentLine(exam).then((n) => {
  		res.json(n)
  	}).catch((err) => res.status(401).json(err));
  });

  app.post('/api/lineInfo', (req, res) => {
    const student = req.body.student;
    const exam = req.body.exam;
    teacherDao.getLineInfo(student, exam).then((n) => {
  		res.json(n)
  	}).catch((err) => res.status(401).json(err));
  })

  app.post('/api/setGrade', (req, res) => {
    const grade = req.body.grade;
    const student = req.body.student;
    const exam = req.body.exam;
    teacherDao.setGrade(grade, student, exam).then((n) => {
      res.json(n)
  	}).catch((err) => res.status(401).json(err));
  })

  app.get('/api/getStudents', (req, res) => {
    const teacher = req.user && req.user.teacher;
    teacherDao.getStudents(teacher)
        .then((students) => {
            res.json(students);
        }).catch(
        (err) => {
         res.status(401).json(authErrorObj);
        }
      );
  });

  app.post('/api/addExam', (req, res) => {
    const students = req.body.students;
    const date = req.body.date;
    const duration = req.body.duration;
    const duration_total = req.body.duration_total;
    const teacher = req.user && req.user.teacher;
    teacherDao.addExam(students, date, duration, duration_total, teacher).then((e) =>
      res.json(e)).catch(
      (err) => {
       res.status(401).json(authErrorObj);
      }
    );
  })

	app.listen(PORT, ()=>console.log(`Server running on http://localhost:${PORT}/`));
