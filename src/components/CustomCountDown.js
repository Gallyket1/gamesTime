import React, { Component} from 'react';
import CountDown from 'react-native-countdown-component';

export default class CustomCountdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      countId: 0,
      showModal: false
    }
  }

 play = () => {
    let {countId} = this.state;
    this.setState({
      showModal: true
    })
   setTimeout(() => {
     this.setState({
       showModal: false,
       countId: countId + 1
     })
   }, 2000)
 }

  render() {
    return (
      <CountDown
        id={this.state.countId}
        until={50}
        onFinish={() => this.play()}
        onPress={() => alert("OK, C'est bon")}
        size={10}
        timeToShow={['M', 'S']}
        timeLabels={{m: 'Minutes', s: 'Secondes'}}
        running={!this.state.showModal}
      />
    )
  }
}
