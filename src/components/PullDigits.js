import React, { Component } from 'react';
import Emoji from "react-native-emoji";
import {
  StyleSheet,
  View,
  Animated, Easing, Text
} from 'react-native';
import * as  GlobaTimers from "./GlobaTimers";

export default class PullDigits extends Component {
  constructor(props) {
    super(props);
    this.state = {
      animtedValuelist: [],
      lisOfElement: [1, 2, 3, 4, 5],
      loading: true
    }
    for (let i = 0; i < 6; i++){
      this.state.animtedValuelist[i] = new Animated.Value(-600);
    }

  }

  componentDidMount() {
    this.animate();
  }



  animate = () => {
    const createAnimation = (value) => {
      return Animated.timing(
        value, {
          toValue: 300,
          duration: GlobaTimers.animationsDuration,
          delay: GlobaTimers.animationDelay,
          easing: Easing.bounce,
          friction: 0.7
        })
    }

    let listOfAnimations = [];
    for (let i = 0; i < this.state.animtedValuelist.length; i++) {
      listOfAnimations[i] = createAnimation(this.state.animtedValuelist[i])
    }

    Animated.sequence(listOfAnimations).start()
  }
  render() {

    let {animtedValuelist} = this.state

    const {lisOfElement, luckyResult} = this.props

    let elementsToPull = lisOfElement.map((element, index) =>
      <Animated.View style={[styles.resultDigitsContainer,
        { marginTop: animtedValuelist[index]}, {backgroundColor: element.color}]} key = {index}>
        <Text style={[styles.text,
          ]} key = {index}>
          {element.digit}
        </Text>
      </Animated.View>
    )

    return (
      <View style={styles.container}>
        <View style={styles.digitsContainer}>
          {elementsToPull}
          <Animated.View style={[styles.resultDigitsContainer,
            { marginTop: animtedValuelist[5]}, {backgroundColor: 'dodgerblue'}]}>
            <Emoji name={luckyResult} style={{fontSize: 15}} />
          </Animated.View>
        </View>
      </View>

    );
  }
}

const carre = 30;
const margin = 1.5
const elemByRow = 5;
const elemByColumn = 6;
const offset = carre + 2;
const paddingTop = offset/4
const tableHeight = elemByColumn*(carre + margin) - margin + offset
const tableWidth = elemByRow*(carre + margin) - margin + offset

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  digitsContainer: {
    justifyContent: 'center',
    flexDirection: 'row',
  },
  text: {
    fontSize: 12,
    color: 'white'
  },
  resultDigitsContainer: {
    height: carre,
    width: carre,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    margin: margin,
    borderColor: 'orange',
    justifyContent: 'center',
  }
});
