import React, { Component}from 'react'
import {View, StyleSheet, TouchableOpacity, Text, ScrollView, ImageBackground} from "react-native";
import GameBox from "./GameBox";
import LotoGame from "./LotoGame";
import FlagPick from "./FlagPick";
import ListFlipingComponents from "./Intrus/ListFlipingComponents";


export default class List extends Component{

  render() {
    let {navigate} = this.props.navigation
    let viewList = listGames.map((game, index) =>
      <TouchableOpacity key={index} onPress={() => navigate('Games', {Component: game.component, title: game.title})}>
        <GameBox
          game= {game}
        />
      </TouchableOpacity>
    )
    return (
      <ImageBackground
        resizeMode={'cover'}
        style={{...styles.container}}
        source={require('./MagicFive/bluebor.jpg')}>
          <ScrollView>
            {viewList}
          </ScrollView>
      </ImageBackground>

    )
  }
}

const listGames = [
  {
    id: '1',
    title: 'Magic Five',
    miseMin: '0.20 $',
    emoji: 'game_die',
    maxWin: '4500 $',
    component: LotoGame
  },
  {
    id: '2',
    title: 'Flag Pick',
    miseMin: '0.5 $',
    emoji: 'flag-cd',
    maxWin: '3000 $',
    component: FlagPick
  },
  {
    id: '3',
    title: "L'intrus Malin",
    miseMin: '0.0 $',
    emoji: 'male-teacher',
    maxWin: '100 %',
    component: ListFlipingComponents
  }
]

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: 5,
    justifyContent: 'center',
  },
  imgbcg: {
    flex: 1,
    //resizeMode: "stretch",
    //flexWrap: 'wrap',
    //borderWidth: 1,
    /*height: 50,
    width: 25,*/
    //padding: paddingTop,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10
  },
})
