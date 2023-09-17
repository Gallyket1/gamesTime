import React, {Component} from 'react'
import {View, StyleSheet, Text, ScrollView, Animated, Dimensions, Easing} from "react-native";
import {Title} from "react-native-paper";
import Emoji from "react-native-emoji";

const AnimtedEmoji = Animated.createAnimatedComponent(View)

export default class GameBox extends Component{
  constructor(props) {
    super(props);
      this.state = {
      }
  }

  componentDidMount() {
    this.animate();
  }
  componentWillUnmount() {
    this.movingEmoji.setValue(0);
    this.tourning.setValue(0);

  }
  movingEmoji = new Animated.Value(35);
  tourning = new Animated.Value(0);

  animate = () => {
    Animated.parallel([
      Animated.loop(
        Animated.spring(
          this.movingEmoji,
          {
            toValue: 100,
            delay: 2000,
            duration: 5000,
            easing: Easing.elastic,
          }
        )
      ),
      Animated.loop(
        Animated.spring(
          this.tourning,
          {
            toValue: 1,
            duration: 1000,
            delay: 5000,
            friction:0.8,
            easing: Easing.bounce
          }
        )
      ),
    ]).start()
  }


  render() {
    let {game} = this.props
    let rotation = this.tourning.interpolate({
      inputRange: [0, 1],
      outputRange: ["0deg", "360deg"]
    })
    return (
      <ScrollView>
        <View style={styles.container}>
          <View style ={{flexDirection: 'row', justifyContent: 'center',}}>
            <Title style ={{color: 'blue', transform:[{rotateX: "35deg"}]}}>{game.title}</Title>
            <View>
              <Emoji name={game.emoji} style={{fontSize: 25, margin: 20}} />
            </View>
          </View>
          <View style={styles.firstLineContainer}>
            <View style={styles.priceFromContainer}>
              <Text>{"Dès " + game.miseMin}</Text>
            </View>
            <View style={styles.winUpToContainer}>
              <Text style={styles.textWinUpTo}>
                {"Gagnez jusqu'à " +game.maxWin}
              </Text>
            </View>
          </View>
          {/*<Animated.View style = {{position: 'absolute', margin: this.movingEmoji, transform:[{rotateY: rotation}]}}>
            <Text style ={{backgroundColor: "yellow",
              fontWeight: 'bold',
            fontSize:14}}>
              All Lives Matter
            </Text>
          </Animated.View>*/}
        </View>
      </ScrollView>
    )
  }

}
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 180,
    width: 350,
    borderWidth: 3,
    borderRadius: 20,
    marginBottom: 10,
    marginTop: 10,
    backgroundColor: 'white',
    borderColor: 'green'

  },
  gameTitleContainer: {

  },
  firstLineContainer : {
  },
  priceFromContainer: {
    height: 50,
    width: 90,
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: 'center',
    borderColor: 'rgba(255, 111, 102, 200)',
    alignItems: 'center',
    margin: 5,
  },
  winUpToContainer: {
    alignSelf: 'flex-end',
    marginRight: 10
  },
  textWinUpTo : {
    fontSize: 20,
    /*fontWeight: 'bold',*/
    color: 'blue'
  }
})
