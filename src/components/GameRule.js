import React from 'react';
import {StyleSheet, View, Text, ScrollView} from 'react-native'
import {JACKPOT_GAIN, JACKPOT_RULES} from "./RuleTexts";



export default function GameRule (props){

  return(
    <ScrollView>
      <View style={{...styles.container}}>
        <View style = {styles.linedDiv}>
          <Text style = {styles.title}>
            Règles du jeu
          </Text>
        </View>
        <View style = {styles.bodyDiv}>
          <Text style = {styles.textStyle}>
            {props.charts.rules}
          </Text>
        </View>
        <View style = {styles.linedDiv}>
          <Text style = {styles.title}>
            Et les gains ?
          </Text>
        </View>
        <View style = {styles.bodyDiv}>
          <Text style = {styles.textStyle}>
            {props.charts.jackpot}
          </Text>
        </View>

      </View>
    </ScrollView>
  )
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'dodgerblue',
    borderRadius: 20,
    flexDirection: 'column',
    padding: 10,
    marginTop: 0,
    margin: 10
  },
  textStyle: {
    color: 'white'
  },
  title: {
    color: 'white',
    fontWeight: 'bold',
    fontSize : 18,
    fontStyle: 'italic'
  },
  linedDiv: {
    borderBottomWidth: 5,
    borderColor: 'white',
    alignItems: 'center',
    marginTop: 0,
    marginBottom: 5,
    margin: 70
  },
  bodyDiv: {
    marginTop: 0
  }
})
