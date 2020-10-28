const baseURL = '/api';

async function isAuthenticated(){
  let url = '/teacher'
  const response = await fetch(baseURL + url);
  const userJson = await response.json();
  if(response.ok){
    return userJson;
  } else {
    let err = {status: response.status, errObj: userJson};
    throw err;
  }
}

async function teacherLogin(name, password) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + '/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({name: name, password: password}),
        }).then((response) => {
            if (response.ok) {
                response.json().then((user) => {
                    resolve(user);
                });
            } else {
                response.json()
                    .then((obj) => { reject(obj);})
                    .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) });
        }}).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) });
    });
}

async function getAvailableSlot(course){
  let url = '/availableSlot';
  return new Promise((resolve, reject) => {
    fetch(baseURL+url, {
      method: 'POST',
      headers: {
        'Content-Type' : 'application/json',
      },
      body: JSON.stringify({course: course}),
    }).then((response) => {
      if(response.ok){
        response.json().then((availableSlot) => {
          resolve(availableSlot);
        });
      }
    }).catch((err) => {reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) });
  })
}

async function getExam(student_id){
  let url = '/getExam';
  return new Promise((resolve, reject) => {
    fetch(baseURL+url,{
      method: 'POST',
      headers: {
        'Content-Type' : 'application/json',
      },
      body: JSON.stringify({stuid: student_id})
    }).then((response) => {
      if(response.ok){
        response.json().then((exam) => {
          resolve(exam.map((x) => x.name));
        });
      }
    }).catch((err) => {reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) });
  })
}

async function registerBooking(exam, start_date, student_id){
  let url='/registerBooking';
  return new Promise((resolve, reject) => {
    fetch(baseURL+url,{
      method: 'POST',
      headers: {
        'Content-Type' : 'application/json',
      },
      body: JSON.stringify({start_date: start_date, stuid: student_id, exam: exam})
    }).then((response) => {
      if(response.ok){
        response.json().then((resp) => {
          resolve(resp);
        });
      }
    }).catch((err) => {reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) });
  })
}

async function getBookedSlot(student_id, exam){
  let url='/getBookedSlot';
  return new Promise((resolve, reject) => {
    fetch(baseURL+url,{
      method: 'POST',
      headers: {
        'Content-Type' : 'application/json',
      },
      body: JSON.stringify({student_id: student_id, exam: exam})
    }).then((response) =>{
      if(response.ok){
        response.json().then((resp) => {
          resolve(resp);
        });
      }
    }).catch((err) => {reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) });
  })
}

async function deleteBooking(exam,student_id){
  let url='/deleteBooking/'+student_id;
  return new Promise((resolve, reject) =>{
    fetch(baseURL+url,{
      method: 'DELETE',
      headers: {
        'Content-Type' : 'application/json',
      },
      body: JSON.stringify({exam: exam.replace(/ /g,'_')})
    }).then((response)=>{
      if(response.ok)
        resolve(null);
      else {
        response.json().then( (obj) => {reject(obj);} )
                .catch( (err) => {reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) });
              }
    }).catch((err) => {reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) });
  });
}

async function teacherLogout() {
    return new Promise((resolve, reject) => {
        fetch(baseURL + '/logout', {
            method: 'POST',
        }).then((response) => {
            if (response.ok) {
                resolve(null);
            } else {
                response.json()
                    .then((obj) => { reject(obj); })
                    .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) });
            }
        });
    });
}

async function getExams(){
  let url = '/getExams'
  const response = await fetch(baseURL + url);
  const examJson = await response.json();
  if(response.ok){
    return examJson;
  } else {
    console.log(response);
    let err = {status: response.status, errObj: examJson};
    throw err;
  }
}

async function getStudentForExam(exam){
  let url = '/studentLine';
  return new Promise((resolve, reject) => {
    fetch(baseURL+url,{
      method: 'POST',
      headers: {
        'Content-Type' : 'application/json',
      },
      body: JSON.stringify({exam: exam})
    }).then((response) =>{
      if(response.ok){
        response.json().then((resp) => {
          resolve(resp);
        });
      }
    }).catch((err) => {reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) });
  })
}

async function getLineInfo(student, exam){
  let url='/lineInfo';
  return new Promise((resolve, reject) => {
    fetch(baseURL+url,{
      method: 'POST',
      headers: {
        'Content-Type' : 'application/json',
      },
      body: JSON.stringify({student: student, exam: exam})
    }).then((response) =>{
      if(response.ok){
        response.json().then((resp) => {
          resolve(resp);
        });
      }
    }).catch((err) => {reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) });
  })
}

async function setGrade(grade, student, exam){
  let url = '/setGrade';
  return new Promise((resolve, reject) => {
    fetch(baseURL+url,{
      method: 'POST',
      headers: {
        'Content-Type' : 'application/json',
      },
      body: JSON.stringify({grade:grade, student: student, exam: exam})
    }).then((response) =>{
      if(response.ok){
        response.json().then((resp) => {
          resolve(resp);
        });
      }
    }).catch((err) => {reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) });
  })
}

async function getStudents(){
  let url = '/getStudents'
  const response = await fetch(baseURL + url);
  const examJson = await response.json();
  if(response.ok){
    return examJson;
  } else {
    console.log(response);
    let err = {status: response.status, errObj: examJson};
    throw err;
  }
}

async function submit_new_exam(students, date, duration, duration_total){
  let url = '/addExam';
  return new Promise((resolve, reject) => {
    fetch(baseURL+url,{
      method: 'POST',
      headers: {
        'Content-Type' : 'application/json',
      },
      body: JSON.stringify({students:students, date: date, duration: duration, duration_total: duration_total})
    }).then((response) =>{
      if(response.ok){
        response.json().then((resp) => {
          resolve(resp);
        });
      }
    }).catch((err) => {reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) });
  })
}

const API = {getStudents, submit_new_exam, getStudentForExam, getAvailableSlot, getLineInfo, getExam, registerBooking, getBookedSlot, deleteBooking, teacherLogin, isAuthenticated, teacherLogout, getExams, setGrade};

export default API;
