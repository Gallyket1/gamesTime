import {Text, View, StyleSheet, Animated, Easing} from "react-native";
import Emoji from "react-native-emoji";
import React,{Component} from "react";

export default class Announcement extends Component{
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.animate();
  }
  animatedText = new Animated.Value(0);
  animate = () => {
    Animated.loop(
      Animated.timing(
        this.animatedText,
        {
          toValue: 20,
          duration: 2000,
          delay: 2000,
          easing: Easing.bounce
        }
      )
    ).start()
  }

  render() {
    return(
      <View style = { styles.anouncementContainer}>
        <Animated.Text style = {{...styles.buttonText, fontWeight: 'bold',
          fontSize: this.animatedText}}>{this.props.message}</Animated.Text>
        <Emoji name={this.props.emoji} style={{fontSize: 50}} />
      </View>
    )
  }

}


const styles = StyleSheet.create({
  anouncementContainer: {
    backgroundColor: 'skyblue',
    marginTop: 8,
    margin: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20
  },
  buttonText: {
    color: 'white',

  },
})
