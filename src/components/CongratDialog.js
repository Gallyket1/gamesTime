import Dialog, { DialogContent } from 'react-native-popup-dialog';
import {Text, View, StyleSheet, TouchableOpacity} from "react-native";
import React, {Component} from "react";
import Emoji from "react-native-emoji";



export default class CongratDialog extends Component{
  constructor(props) {
    super(props);

  }

  render() {
    return (
      <View>
        <Dialog
          visible={true}
          onTouchOutside={() => {console.log('Hahah')}}
        >
          <DialogContent style={styles.container}>
            <View>
              <Emoji name = "+1" style={{fontSize: 30}} />
            </View>
          </DialogContent>
        </Dialog>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 25, 0.8)',
    borderRadius: 100,
  },
  textMessage: {
    color: 'green',
    fontWeight: 'bold'
  }
})
