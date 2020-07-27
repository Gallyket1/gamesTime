import Dialog, { DialogContent } from 'react-native-popup-dialog';
import {Text, View, StyleSheet, TouchableOpacity} from "react-native";
import React from "react";
import Emoji from "react-native-emoji";



export default function DialogMessage(props){

  return (
    <View>
      <Dialog
        visible={props.openResultModal}
        onTouchOutside={props.onTouchOutside
        }
      >
        <DialogContent style = {styles.container}>
          <Emoji name={props.textMessage.emoji? props.textMessage.emoji: "game_die" } style={{fontSize: 30}} />
          <View style = {{marginBottom: 20, flexWrap: 'wrap'}}>
            <Text style={{ ...styles.textMessage, color:props.textMessage.color}}>
              {props.textMessage.text}
            </Text>
          </View>
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  textMessage: {
    color: 'green',
    fontWeight: 'bold'
  }
})
