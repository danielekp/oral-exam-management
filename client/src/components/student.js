import React from 'react';
import {Row, Col} from 'react-bootstrap';
import Navv from './navbar';
import Exam from './exam_student';
import API from '../api';
import SlotLine from './slotLine';

function getExam(e,st){
  return <Exam student={st} name={e}/>
}

function createExamList(e){
  return e.replace(/_/g,' ');
}

function slot_line(course,st){
  return <SlotLine course={course} student={st}/>
}

class Student extends React.Component{
  constructor(props){
    super (props);
    this.state = {loading: true}
    if(props.studentId!='')
      this.studentId = props.studentId;
    else
      this.studentId = 'Guest';
    this.handleBookingFlag = this.handleBookingFlag.bind(this);
  }

  componentDidMount(){
    this.setState({loading: true})
    API.getExam(this.studentId).then(f => this.setState({loading: false, booking:true, courses: f.map(createExamList)}));
  }

  handleBookingFlag(g){
    this.setState({booking: g});
  }

  render(){
    return(
      <>
      <Navv profile={0} studentId={this.studentId} handle={this.handleBookingFlag}/>
      <Row className="justify-content-center">
        <Col xs={12} sm={12} md={12} lg={12} xl={9} className="box_instuctions_student">
          <p className="student_instructions">
            Welcome to your student page! Here you can book one available slot
             for the oral exam and view your currently booked slots.<br/>
             If you want to book a slot, please select a course firstly.
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
              {!this.state.loading && this.state.booking &&
                <Row className="justify-content-center" style={{marginTop: '50px'}}>
                  {this.state.courses.map((e) => getExam(e,this.studentId))}
                </Row>
              }
              {!this.state.booking && !this.state.loading &&
              <Row className="justify-content-center" style={{marginTop: '50px'}}>
                <Col xs={12} sm={12} md={12} lg={12} xl={9} className="student_profile">
                  {this.state.courses.map((e) => slot_line(e, this.studentId))}
                </Col>
              </Row>
            }
      </>
    )
  }
}

export default Student;
