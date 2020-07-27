import React from 'react'
import {View, Text} from 'react-native'
import LotoGame from "./LotoGame";
import FlagPick from "./FlagPick";

export default function GameScreen({route}) {
  let {Component} = route.params;

  return (
    <View style = {{flex: 1}}>
      <Component/>
    </View>
  )
}
