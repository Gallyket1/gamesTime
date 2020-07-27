import Dialog, { DialogContent } from 'react-native-popup-dialog';
import {Text, View, StyleSheet} from "react-native";
import React from "react";
import Emoji from "react-native-emoji";
import DiceRotating from "./DiceRotating";

export default function DialogTirage(props){

  return (
    <View >
      <Dialog
        style = {{backgroundColor: 'red'}}
        visible={props.openTirageModal}
        onTouchOutside={props.onTouchOutside}
      >
        <DialogContent style = {styles.container}>
          <DiceRotating
            lisOfElement = {props.result}
            luckyResult = {props.luckyResult}
          />
          <View style = {{flexDirection:'row', margin: 30}}>
            {props.tirage}
          </View>
        </DialogContent
        >
      </Dialog>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#a1b',
    margin: 7
  },
  textMessage: {
    color: 'white',
    fontWeight: 'bold',
    fontStyle: 'italic'
  }
})
