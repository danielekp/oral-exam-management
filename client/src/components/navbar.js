import React from 'react';
import {Navbar, Nav} from 'react-bootstrap';
import {NavLink} from 'react-router-dom';
import API from '../api';

class Navv extends React.Component{
  constructor(props){
    super (props);
    this.profile = props.profile;
    if(!this.profile){
      this.studentId = props.studentId;
      this.handle = props.handle;
    } else {
      this.teacherName = props.teacherName;
      this.logout = props.logout;
    }
  }

  render(){
    return(
      <Navbar collapseOnSelect expand='md' className='navbar' fixed="top">
        {!this.profile &&
        <Nav.Link as={NavLink} to='/' className="navbar_student_id">
        <svg width="2em" height="2em" viewBox="0 0 16 16" className="bi bi-caret-left-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M3.86 8.753l5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z"/>
        </svg>
        Go back
      </Nav.Link>
    }
      {this.profile &&
      <Nav.Link onClick={this.logout} as={NavLink} to='/' className="navbar_student_id">
      <svg width="2em" height="2em" viewBox="0 0 16 16" className="bi bi-caret-left-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M3.86 8.753l5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z"/>
      </svg>
      Go back (and log out)
    </Nav.Link>
  }
      {!this.profile &&
        <>
        <Navbar.Brand>
          <a className="navbar_student_id">&nbsp;|&nbsp;{this.studentId}&nbsp;|&nbsp;</a>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
          <Nav.Link as={NavLink} to="/student" onClick={() => this.handle(true)}>
            Book Slot
          </Nav.Link>
          <Nav.Link as={NavLink} to="/student" onClick={() => this.handle(false)}>
            Your Reservations
          </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </>
      }
      {this.profile &&
        <Navbar.Brand>
          <a className="navbar_student_id">&nbsp;|&nbsp;{this.teacherName} reserved space&nbsp;|&nbsp;</a>
        </Navbar.Brand>
      }
      </Navbar>
    )
  }
}

export default Navv;
