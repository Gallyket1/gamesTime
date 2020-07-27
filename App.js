import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  Animated,
  Alert
} from 'react-native'
import LotoGame from "./src/components/LotoGame";
import PullDigits from "./src/components/PullDigits";
import DiceRotating from "./src/components/DiceRotating";
import CustomCountDown from "./src/components/CustomCountDown";
import {Routing} from "./src/Routing";
import GameBox from "./src/components/GameBox";
import ListGameBoxes from "./src/components/ListGameBoxes";
import GiftCard from "./src/components/MagicFive/GiftCard";
import FlipCard from 'react-native-flip-card'
import AsyncStorage from "@react-native-community/async-storage"
import Player from "./src/components/MagicFive/Player";
import SignUpDialog from "./src/SignUpDialog";
import FlipingComponent from "./src/components/FlipingComponent";
import ListFlipingComponents from "./src/components/Intrus/ListFlipingComponents";

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  /*promptUser = () => {
    const title = 'Time to choose!';
    const message = 'Please make your selection.';
    const buttons = [
      { button: 'Cancel', type: 'cancel' },
      { text: 'Option Am', onPress: () => this.setState({userSelection: 'Option A'}) },
      { text: 'Option B', onPress: () => this.setState({userSelection: 'Option B'}) }
    ];
    Alert.alert(title, message, buttons);
  }*/

  render() {
    return (
      <View style={{flex: 1}}>
        <Routing/>
        <SignUpDialog/>
        {/*<ListFlipingComponents/>*/}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  box: {
    width: 15,
    height: 15,
    margin: .5,
    backgroundColor: 'red'
  }
})
