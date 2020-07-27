import React, { Component} from 'react'
import {View, Image, Icon} from "react-native";
import Emoji from "react-native-emoji";

export default function HeaderImage() {
  return (
    <View style = {{ marginRight: 0, marginLeft:19, }}>
      <Emoji name={"flower_playing_cards"} style={{fontSize: 25}}/>
    </View>
  )
}
