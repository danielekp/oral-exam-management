import React from 'react';
import {Switch} from 'react-router';
import {Redirect, Route, BrowserRouter, Link} from 'react-router-dom';
import './App.css';
import Home from './components/home';
import {Container} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import uni from './images/uni.jpeg';
import {Col, Row, InputGroup, FormControl} from 'react-bootstrap';
import Student from './components/student';
import API from './api';
import {AuthContext} from './authcontext';
import TeacherPage from './components/teacherPage.js';

class App extends React.Component{

  constructor(props){
    super (props);
    this.state = {}
    this.handleUser = this.handleUser.bind(this)
    this.studentIdInput = React.createRef();
    this.teacherNameInput = React.createRef();
    this.teacherPasswordInput = React.createRef();
    this.handleTeacher = this.handleTeacher.bind(this);
    this.logout = this.logout.bind(this);
  }

  componentDidMount(){
    API.isAuthenticated().then(
      (user) => {
        this.setState({authUser: user});
      }
    ).catch((err) => {
      this.setState({authErr: err.errorObj});
    });
  }

  handleErrors(err) {
    this.setState({authErr: err});
  }

  handleUser(profile){
    if(profile.target.lastChild.data!==undefined)
      profile = profile.target.lastChild.data
    else profile = profile.target.lastChild.lastChild.data
    this.setState({user: profile})
  }

  handleStudent(id){
    this.setState({studentId: id.toUpperCase()})
  }

  handleTeacher(name, password){
    if(name==''){
      this.teacherNameInput.current.style.borderColor = 'red';
    } else if(password == ''){
      this.teacherPasswordInput.current.style.borderColor = 'red';
    } else {
      API.teacherLogin(name, password).then(
        (user) => {
              console.log(user);
              this.setState({authUser: user, authErr: null});
            })
            .catch((errorObj) => {
              this.handleErrors(errorObj);
          });
    }
  }

  logout = () => {
    API.teacherLogout().then(() => {
      this.setState({authUser: null,authErr: null, tasks: null});
    });
  }

  render(){
    const value = {
      authUser: this.state.authUser,
      authErr: this.state.authErr,
    }
    return(
    <AuthContext.Provider value={value}>
      <BrowserRouter>
        <div className="background_image" style={{backgroundImage: `url(${uni})`}}>
        </div>
        <Container>
          <Switch>
            <Redirect exact from="/" to="home"/>
            <Route path="/home">
            {this.state.authUser && <Redirect to='/teacher'/>}
              <Home handleUser={this.handleUser}/>
              {this.state.user==='student' &&
                <>
                  <Row>
                    <Col className="input_student_id_box">
                      <InputGroup>
                        <FormControl ref={this.studentIdInput} className="input_student_id" autoFocus
                          placeholder="s123456"
                          aria-label="id"
                        />
                        <Link to='/student'>
                        <div onClick={() => this.handleStudent(this.studentIdInput.current.value)} className="button_student_id">
                        <svg width="3em" height="3em" viewBox="0 0 16 16" className="bi bi-arrow-right-circle-fill" fill="#6698FF" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-8.354 2.646a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L9.793 7.5H5a.5.5 0 0 0 0 1h4.793l-2.147 2.146z"/>
                        </svg>
                      </div>
                    </Link>
                      </InputGroup>
                    </Col>
                  </Row>
                </>
              }
              {this.state.user==='teacher' &&
              <>
                <Row>
                  <Col className="input_student_id_box">
                    <InputGroup>
                      <FormControl ref={this.teacherNameInput} className="input_student_id" autoFocus
                        placeholder="full name"
                        aria-label="full_name"
                      />
                      &nbsp;
                      <FormControl ref={this.teacherPasswordInput} className="input_student_id"
                        placeholder="password"
                        aria-label="password"
                        type="password"
                      />
                      <div onClick={() => this.handleTeacher(this.teacherNameInput.current.value, this.teacherPasswordInput.current.value)} className="button_student_id">
                      <svg width="3em" height="3em" viewBox="0 0 16 16" className="bi bi-arrow-right-circle-fill" fill="#6698FF" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-8.354 2.646a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L9.793 7.5H5a.5.5 0 0 0 0 1h4.793l-2.147 2.146z"/>
                      </svg>
                    </div>
                    </InputGroup>
                  </Col>
                  <Col className="error_login" xs={12} sm={12} md={12} lg={12} xl={12}>
                    {this.state.authErr && this.state.authErr.errors[0].msg}
                  </Col>
                </Row>
              </>
              }
            </Route>
            <Route path="/student">
              <Student studentId={this.state.studentId}/>
            </Route>
            <Route path="/teacher">
              {!value.authUser && <Redirect to="/home"/>}
              {value.authUser && <TeacherPage logout={this.logout}/>}
            </Route>
          </Switch>
        </Container>
        </BrowserRouter>
        </AuthContext.Provider>
    )
  }
}

export default App;
