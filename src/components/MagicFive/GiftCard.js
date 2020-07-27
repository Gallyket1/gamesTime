import React , { Component} from 'react'
import {View, StyleSheet, Text,
  Dimensions, Animated,
  Easing, TouchableOpacity, ImageBackground} from 'react-native'
import Emoji from "react-native-emoji";
import {createAnimatedComponent} from "react-native-reanimated";
import {GIFT_CARD_TIMEOUT} from "../GlobaTimers";

const AImageBackground = Animated.createAnimatedComponent(ImageBackground);

export default class GiftCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      room: false,
      baby: "ffa"
    }
  }

   ImageBackground = Animated.createAnimatedComponent(ImageBackground)
  animateCard = new Animated.Value(0);
  fadInanimate = new Animated.Value(0);


  animateMargin = () => {
    Animated.timing(
      this.fadInanimate,
      {
        toValue: deviceHeight/4,
        duration: 1000,
        easing: Easing.bounce,
      }
    ).start()
  };
  componentDidMount() {
    this.animateMargin();
  }
  componentWillUnmount(){
    this.fadInanimate.setValue(0)
  }

  animate = () => {
    Animated.timing(
      this.animateCard,
      {
        toValue: 1,
        duration: GIFT_CARD_TIMEOUT,
        easing: Easing.linear,
      }
    ).start()
  }

  render() {
    const rotation = this.animateCard.interpolate({
      inputRange: [0, 1],
      outputRange: ['180deg', '0deg'],
    })
    const externalRotation = this.animateCard.interpolate({
      inputRange: [0, 0.5],
      outputRange: ['0deg', '360deg']
    });
    const image = require('./cardback.png');
    return (
      <Animated.View style={{...styles.container, marginTop:this.fadInanimate,}}>
        <AImageBackground
            resizeMode={'stretch'}
            style={{...styles.imgbc, transform: [{rotateY: externalRotation}]}}
            source={require('./cardback.png')}>
            <TouchableOpacity onPress={() => {this.animate(); this.props.storeKey()}}>
              <Animated.View
                style={{...styles.cardContainer,
                  transform: [{rotateY: rotation}]}}>
                <Text>{this.props.gift}</Text>
              </Animated.View>
            </TouchableOpacity>
          </AImageBackground>
      </Animated.View>
    );
  }
}
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height

const cardHeight = 90;
const cardWidth = 70

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
  outerCardContainer:{
    flex:1,
    height: cardHeight,
    width: cardWidth,
    //marginTop: deviceHeight/5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'yellow',
    borderColor: 'green',
    borderWidth: 0.5,
    marginLeft: 5
  },
  imgbc: {
    //flex: 1,
    //resizeMode: "stretch",
    height: cardHeight,
    width: cardWidth,
    //marginTop: deviceHeight/5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'yellow',
    borderColor: 'green',
    borderWidth: 0.5,
    marginLeft: 5
  },
  cardContainer: {
    height: cardHeight,
    width: cardWidth,
    //marginTop: deviceHeight/5,
    borderWidth: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    backfaceVisibility: 'hidden',
    borderColor: 'green',
    backgroundColor: 'pink',
    opacity: 1
  },

  text: {
    color: "grey",
    fontSize: 30,
    fontWeight: "bold"
  }
})
