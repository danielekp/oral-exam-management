import React from 'react';
import {Row, Col} from 'react-bootstrap';
import API from '../api';

class StudentLine extends React.Component{

  constructor(props){
    super (props);
    this.student = props.student;
    this.exam = props.exam;
    this.state = {}
    this.gradeInput = React.createRef();
    this.handleGrade = this.handleGrade.bind(this);
    this.absent = this.absent.bind(this);
  }

  componentDidMount(){
    API.getLineInfo(this.student, this.exam.replace(/ /g,'_')).then(e => this.setState({info: e}));
  }

  absent(){
    API.setGrade(-1, this.student, this.exam.replace(/ /g,'_')).then((n) => {let t=this.state.info[0]; t.Grade=-1; this.setState({info: [t]})});
  }

  handleGrade(){
    console.log(this.gradeInput.current.value)
    let grade = Number(this.gradeInput.current.value);
    if(grade>31 || grade<18){
      //error
    } else
      API.setGrade(grade, this.student, this.exam.replace(/ /g,'_')).then((n) => {let t=this.state.info[0]; t.Grade=grade; this.setState({info: [t]})});
  }

  render(){
    return(
      <>
      {this.state.info && this.state.info[0] &&
        <>
        <Row className="justify-content-center line">
          <Col xs={8} sm={5} md={4} lg={2} xl={2} className="student_name">
            <b>{this.state.info[0].Student}</b>
          </Col>
          <Col xs={8} sm={5} md={4} lg={3} xl={3} className="student_name">
            <b>Start:</b> {this.state.info[0].Start.replace('_',' ')}
          </Col>
          <Col xs={5} sm={5} md={4} lg={3} xl={3} className="student_name">
            <b>Grade:</b> {this.state.info[0].Grade!==-1 && this.state.info[0].Grade} {!this.state.info[0].Grade && 'Void'} {this.state.info[0].Grade===-1 && 'Marked as absent'}
          </Col>
          {!this.state.info[0].Grade &&
          <Col xs={7} sm={5} md={4} lg={3} xl={3} className="student_name">
          <Row className="justify-content-center">
            <Col xs={4} sm={4} md={4} lg={4} xl={4}>
              Grade:
              </Col>
              <Col xs={4} sm={4} md={4} lg={4} xl={4}>
              <input ref={this.gradeInput} style={{width: '100%'}}></input>
            </Col>
            <Col xs={2} sm={2} md={2} lg={2} xl={2}>
             <div onClick={this.handleGrade} className="button_grade unselectable">+</div>
           </Col>
           <Col xs={10} sm={10} md={10} lg={10} xl={10}>
            <div onClick={this.absent} className="absent unselectable">Absent</div>
          </Col>
          </Row>
          </Col>
          }
        </Row>
      </>
    }
    </>
    )
  }
}

export default StudentLine;
