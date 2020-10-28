import React from 'react';
import {Col, Row} from 'react-bootstrap';

class Home extends React.Component{

  constructor(props){
    super (props);
    this.handleUser = props.handleUser;
  }

  render(){
    return(
      <>
      <Row className="justify-content-center">
        <Col xs={12} sm={12} md={12} lg={12} xl={12} className="choose_box">
          <p className="choose_text">CHOOSE YOUR PROFILE</p>
        </Col>
        <Col onClick={this.handleUser} xs={6} sm={5} md={5} lg={4} xl={3} className="who_are_you">
            <p className="who_are_you_text unselectable">student</p>
        </Col>
        <Col onClick={this.handleUser} xs={6} sm={5} md={5} lg={4} xl={3} className="who_are_you">
            <p className="who_are_you_text unselectable">teacher</p>
        </Col>
      </Row>
      </>
    )
  }
}

export default Home;
