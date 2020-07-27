import {Animated, Easing, StyleSheet, Text, View} from "react-native";
import Emoji from "react-native-emoji";
import LotoGame from "./LotoGame";
import React, {Component} from "react"
import PullDigits from "./PullDigits";
import {TIRAGE_TIME_OUT} from "./GlobaTimers";
import {DialogContent} from "react-native-popup-dialog";

export default class DiceRotating extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      listAnimateValues: [],
    }
    this.AnimatedList = [];
    for (let i = 0; i < 6; i++){
      this.AnimatedList[i] = new Animated.Value(-30);
    }

  }

  pullDigits = () => {
    Animated.sequence()
  }

  componentDidMount() {
    this.animate();
    setTimeout(() => this.setState({ loading: false }), TIRAGE_TIME_OUT)
  }


  animatedRotation = new Animated.Value(0);
  animate = () => {
    Animated.loop(
      Animated.timing(
        this.animatedRotation,
        {
          toValue: 2,
          duration: 4000,
          easing: Easing.linear,
        }
      )
    ).start()
  }
  render() {
    const rotation = this.animatedRotation.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });
    const {lisOfElement, luckyResult} = this.props
    const {loading} = this.state;

    return (
      <View style={styles.container}>
        {loading ? (
          <View>
            <Text style={styles.textMessage}>Tirage en cours...</Text>
          </View>
        ) : <View>
          <Text style={styles.textMessage}>Tirage Terminé </Text>
        </View>}
        {
          loading ? (
            <Animated.View style={{
              transform: [{ rotate: rotation }] }}>
              <Emoji name="game_die" style={{fontSize: 35}} />
            </Animated.View>
          ) : (
            <Emoji name="white_check_mark" style={{fontSize: 35}} />
          )
        }
        <PullDigits
          lisOfElement = {lisOfElement}
          luckyResult = {luckyResult}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: 50,
    width: 250,
    height: 300,
    margin: 20,
  },
  input: {
    height: 50,
    marginHorizontal: 15,
    backgroundColor: '#ededed',
    marginTop: 10,
    paddingHorizontal: 9,
  },
  textMessage : {
    color: 'white'
  }
});
