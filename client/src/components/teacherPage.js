import React,{ createRef } from 'react';
import {AuthContext} from '../authcontext';
import Navv from './navbar';
import API from '../api';
import {Row, Col, InputGroup, FormControl, Dropdown, DropdownButton} from 'react-bootstrap';
import Exam from './exam_teacher';
import Datetime from 'react-datetime';
import moment from 'moment';

function getExam(e){
  return <Exam name={e.name.replace(/_/g,' ')}/>
}

class TeacherPage extends React.Component{

  constructor(props){
    super (props);
    this.difference_time = createRef();
    this.logout = props.logout;
    this.state={loading: true, collapsed: true, duration: 15, continue: false, students_selected: [], selected: false}
    this.input = createRef();
    this.students = []
    this.continue = this.continue.bind(this);
    this.collapsed = this.collapsed.bind(this);
    this.mappa = this.mappa.bind(this);
    this.selectedStudent = this.selectedStudent.bind(this);
    this.difference = this.difference.bind(this);
    this.submit = this.submit.bind(this);
    this.date = createRef();
  }

  componentDidMount(){
    API.getExams().then((rows) => this.setState({exams: rows, loading: false})).catch((err) => this.logout());
  }

  continue(){
    this.setState({continue: true})
  }

  difference(){
    if((this.input.current.value - (this.state.students_selected.length * this.state.duration))>0)
      this.difference_time.current.style.background = 'rgba(255, 255, 264, 0.7)';
    this.setState({difference: this.input.current.value - (this.state.students_selected.length * this.state.duration)})
  }

  selectedStudent(e){
    console.log(this.state.students_selected)
    this.setState({students_selected: this.state.students_selected.concat([e.currentTarget.lastChild.data]), selected: true});
    e.currentTarget.style.backgroundColor = 'grey';
  }

  collapsed(){
    API.getStudents().then((rows) => this.setState({students: rows, collapsed: !this.state.collapsed})).catch((err) => this.logout());
  }

  mappa(e, i){
    return <Col onClick={this.selectedStudent} className="student_box unselectable" ref={ref => {this.students[i] = ref}} key={i} xs={6} sm={4} md={3} lg={3} xl={3}>{e.Student}</Col>
  }

  submit(){
    if(this.input.current.value=='')
      this.input.current.style.borderColor = 'red';
    else if(this.state.difference<0)
            this.difference_time.current.style.backgroundColor = 'red';
        else {
          if(this.date.current.state.inputValue=='')
            console.log('set date')
          else {
            API.submit_new_exam(this.state.students_selected, moment(this.date.current.state.selectedDate._d).format('DD/MM/YYYY_HH:mm').toString(), this.state.duration, this.input.current.value).then((e) => window.location.reload(false))
          }
        }
  }

  render(){
    return(
      <AuthContext.Consumer>
        {(context)=> (<>
            <Navv profile={1} logout={this.logout} teacherName={context.authUser.name} />
            <Row className="justify-content-center">
              <Col xs={12} sm={12} md={12} lg={12} xl={9} className="box_instuctions_student">
                <p className="student_instructions">
                  Welcome to your personal teacher page! Here you can manage your exams and
                  add more ones.
                 </p>
              </Col>
            </Row>
            {this.state.loading &&
              <div id="dots4">
                          <span></span>
                          <span></span>
                          <span></span>
                          <span></span>
                      </div>}
            {!this.state.loading && this.state.exams &&
              <Row className="justify-content-center" style={{marginTop: '50px'}}>
                {this.state.exams.map(getExam)}
              </Row>
            }
            <Row className="justify-content-center" style={ { marginTop: '40px' }}>
              <Col onClick={this.collapsed} className="exam unselectable" xs={12} sm={12} md={12} lg={11} xl={10}>
                + Add new exam
              </Col>
              {!this.state.collapsed && !this.state.continue &&
                <Col className="collapsible" xs={12} sm={12} md={12} lg={11} xl={10}>
                  <Row className="justify-content-center">
                    {this.state.students.map(this.mappa)}
                  </Row>
                  {this.state.selected &&
                    <Row className="justify-content-center">
                      <Col onClick={this.continue} className="button unselectable" xs={8} sm={7} md={6} lg={5} xl={3}>
                        CONTINUE
                      </Col>
                    </Row>
                  }
                </Col>
              }
              {!this.state.collapsed && this.state.continue &&
              <Col className="collapsible" xs={12} sm={12} md={12} lg={11} xl={10}>
                <Row className="justify-content-center">
                  <Col className="datepicker" xs={11} sm={9} md={4} lg={3} xl={3}>
                    <Datetime ref={this.date}/>
                  </Col>
                  <Col xs={11} sm={9} md={5} lg={5} xl={5}>
                    <Row className="justify-content-center">
                      <Col className="datepicker" xs={12} sm={12} md={12} lg={12} xl={12}>
                        <InputGroup className="mb-3">Duration of each slot&nbsp; &nbsp; &nbsp;
                            <DropdownButton
                              as={InputGroup.Prepend}
                              variant="outline-secondary"
                              title={this.state.duration}
                              id="input-group-dropdown-1"
                            >
                              <Dropdown.Item onClick={() => this.setState({duration: 5})} href="#">5</Dropdown.Item>
                              <Dropdown.Item onClick={() => this.setState({duration: 10})} href="#">10</Dropdown.Item>
                              <Dropdown.Item onClick={() => this.setState({duration: 15})} href="#">15</Dropdown.Item>
                              <Dropdown.Item onClick={() => this.setState({duration: 20})} href="#">20</Dropdown.Item>
                              <Dropdown.Item onClick={() => this.setState({duration: 25})} href="#">25</Dropdown.Item>
                              <Dropdown.Item onClick={() => this.setState({duration: 30})} href="#">30</Dropdown.Item>
                              <Dropdown.Item onClick={() => this.setState({duration: 35})} href="#">35</Dropdown.Item>
                              <Dropdown.Item onClick={() => this.setState({duration: 40})} href="#">40</Dropdown.Item>
                              <Dropdown.Item onClick={() => this.setState({duration: 45})} href="#">45</Dropdown.Item>
                            </DropdownButton>
                          </InputGroup>
                      </Col>
                      <Col className="datepicker" xs={12} sm={12} md={12} lg={12} xl={12}>
                        Total duration (in minutes): <input onChange={this.difference} className="input_total_duration" ref={this.input} type="number"/>
                      </Col>
                      <Col ref={this.difference_time} className="datepicker" xs={12} sm={12} md={12} lg={12} xl={12}>
                        Difference time: {this.state.difference}
                      </Col>
                      <Col onClick={this.submit} className="button unselectable" xs={12} sm={12} md={12} lg={12} xl={12}>
                        CONTINUE
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Col>}
            </Row>
        </>)}
      </AuthContext.Consumer>
    )
  }
}

export default TeacherPage;
