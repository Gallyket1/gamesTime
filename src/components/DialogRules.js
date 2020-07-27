import Dialog, { DialogContent } from 'react-native-popup-dialog';
import {Text, View, StyleSheet, TouchableOpacity} from "react-native";
import React from "react";
import Emoji from "react-native-emoji";
import GameRule from "./GameRule";




export default function DialogRules(props){

  return (
    <View>
      <Dialog
        visible={props.openRulesModal}
        onTouchOutside={props.onTouchOutside}
      >
        <DialogContent style = {styles.container}>
          <GameRule
            charts = {props.charts}
          />
          <TouchableOpacity onPress={props.onTouchOutside}>
            <Emoji name="ok" style={{fontSize: 20, color: 'white'}} />
          </TouchableOpacity>
        </DialogContent>
      </Dialog>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    margin: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'dodgerblue',
    height: 300

  },
  textMessage: {
    color: 'green',
    fontWeight: 'bold'
  }
})
