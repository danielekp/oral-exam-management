import React,{ createRef } from 'react';
import API from '../api';
import {Row, Col} from 'react-bootstrap';

class Booking extends React.Component{

  constructor(props){
    super (props);
    this.student = props.student;
    this.exam = props.exam;
    this.state = {loading: true, selected: false, bookedMe: false, completed: null};
    this.selectedSlot_f = this.selectedSlot_f.bind(this);
    this.mappa = this.mappa.bind(this);
    this.slots = [];
  }

  componentDidMount(){
    API.getAvailableSlot(this.exam.replace(/ /g,'_')).then((g) => this.setState({slots: g, loading: false}))
  }

  selectedSlot_f(slot){
    if(this.state.selected_slot!==slot.target.lastChild.data){
      if(this.state.selected){
        for(let slot of this.slots){

          slot.style.backgroundColor = 'lightGreen'
        }
      }
      this.setState({selected_slot: slot.target.lastChild.data, selected: true});
      slot.target.style.backgroundColor = 'green';
    }else{
      this.setState({selected: false, selected_slot: null});
      slot.target.style.backgroundColor = 'lightGreen';
    }
  }

  handleBooking(){
    API.registerBooking(this.exam.replace(/ /g,'_'), this.state.selected_slot, this.student).then((r) => {if(r=='ok') this.setState({completed: 1}); else this.error_while_booking();})
  }

  mappa(e,i){
    let color;
    if(e.Status==='Free'){
      color = 'lightGreen';
      return <Col ref={ref => {this.slots[i] = ref}} key={i} onClick={this.selectedSlot_f} style={{backgroundColor: color}} className="slot_box unselectable" xs={6} sm={4} md={3} lg={3} xl={3}>{e.Start}</Col>
    }else{
      color = 'Red';
      if(e.Student===this.student){
        console.log(color);
        if(!this.state.bookedMe)
          this.setState({bookedMe: true})
      }
      return <Col style={{backgroundColor: color}} className="slot_box_booked unselectable" xs={6} sm={4} md={3} lg={3} xl={3}>{e.Start.replace(/ /g,'_')}</Col>
    }
  }

  render(){
    return(
      <>
      <Row className="justify-content-center">
      {this.state.loading &&
        <div id="dots4">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
        </div>
      }
      {!this.state.loading && !this.state.bookedMe &&
        this.state.slots.map(this.mappa)
      }
      {this.state.selected && !this.state.bookedMe &&
        <Col onClick={() => this.handleBooking()} className="book unselectable" xs={12} sm={12} md={12} lg={12} xl={12}>
          Book the selected slot
        </Col>
      }
      {this.state.bookedMe &&
        <Col className="already_booked unselectable" xs={12} sm={12} md={12} lg={12} xl={12}>
          You have already booked a slot for this exam call!
        </Col>
      }
      {this.state.completed===1 &&
        <div className="completed">
          Booking successful!
        </div>
      }
      </Row>
      </>
    )
  }
}

export default Booking;
