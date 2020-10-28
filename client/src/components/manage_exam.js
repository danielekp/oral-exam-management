import React from 'react';
import {Row, Col} from 'react-bootstrap';
import {AuthContext} from '../authcontext';
import API from '../api';
import StudentLine from './student_line';

function getStudentLine(e, examName){
  return <StudentLine student={e.id} exam={examName}/>
}

class ManageExam extends React.Component{

  constructor(props){
    super (props);
    this.state = {loading: true};
    this.name = props.name;
  }

  componentDidMount(){
    API.getStudentForExam(this.name.replace(/ /g,'_')).then((e) => this.setState({students: e, loading: false}))
  }

  render(){
    return(
      <AuthContext.Consumer>
      {(context) =>(
        <>
        {this.state.loading &&
          <div id="dots4">
                      <span></span>
                      <span></span>
                      <span></span>
                      <span></span>
                  </div>}
      {!this.state.loading && this.state.students &&
        <>
        {this.state.students.map(e => getStudentLine(e,this.name))}
      </>
      }
    </>
    )
      }
    </AuthContext.Consumer>
    )
  }
}

export default ManageExam;
