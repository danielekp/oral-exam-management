import React from 'react';
import API from '../api';
import {Row, Col} from 'react-bootstrap';
import moment from 'moment';

function slot_line(f, handle){
  if(moment(f.Start,'DD/MM/YY_HH:mm').isAfter(moment())){
    return (
    <>
     <Col className="slot_info" xs={8} sm={8} md={7} lg={7} xl={6}>Start date: {f.Start}</Col>
     <Col className="slot_info" xs={2} sm={2} md={2} lg={2} xl={2}>
       <svg onClick={handle} width="2em" height="2em" viewBox="0 0 16 16" className="bi bi-trash trash" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
          <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
        </svg>
     </Col>
    </>
  )
  } else {
    return (
      <>
      <Col className="slot_info" xs={8} sm={8} md={7} lg={7} xl={6}>Start date: {f.Start}</Col>
      <Col className="slot_info" xs={2} sm={2} md={2} lg={2} xl={2}>Grade: {f.Grade!==null && f.Grade}{f.Grade===null && 'not yey published'}</Col>
      </>
    )
  }
}

class SlotLine extends React.Component{

  constructor(props){
    super (props);
    this.student_id = props.student;
    this.exam = props.course;
    this.state={loading: true};
    this.handleDelete = this.handleDelete.bind(this);
  }

  componentDidMount(){
    API.getBookedSlot(this.student_id, this.exam).then((r) => this.setState({loading: false, slot: r}))
  }

  handleDelete(){
    API.deleteBooking(this.exam, this.student_id).then((r) => this.setState({slot: []}));
  }

  render(){
    return(
      <>
      {this.state.loading &&
        <div id="dots4">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
      }
      {!this.state.loading &&
        <Row className="justify-content-center">
          <Col className="exam_info" xs={12} sm={12} md={12} lg={12} xl={12}>
            {this.exam}
          </Col>
          {this.state.slot.map((e) => slot_line(e, this.handleDelete))}
        </Row>
      }
      </>
    )
  }
}

export default SlotLine;
