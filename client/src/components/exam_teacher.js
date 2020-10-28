import React from 'react';
import {Row, Col} from 'react-bootstrap';
import ManageExam from './manage_exam';

class Exam extends React.Component{
  constructor(props){
    super (props);
    this.name = props.name;
    this.state = {collapsed: true}
  }
  render(){
    return (
      <><Col onClick={() => this.setState({collapsed: !this.state.collapsed})} className="exam unselectable" xs={12} sm={12} md={12} lg={11} xl={10}>
        {this.name}
      </Col>
      {!this.state.collapsed &&
      <Col className="collapsible" xs={12} sm={12} md={12} lg={11} xl={10}>
        <ManageExam name={this.name}/>
      </Col>}
      </>
    )
  }
}

export default Exam;
