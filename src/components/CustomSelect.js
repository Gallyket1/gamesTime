import React from 'react'
import {Picker, StyleSheet, View, Text} from "react-native";
import SelectInput from 'react-native-select-input-ios'

export default function CustomSelect({list, handleSelectChange, title, option}){

 /* const options = list.map(element => <Picker.Item
    key={element.id} label = {element.val + '$'} value = {element.val}/>)*/
  return (
    <View style = {styles.container}>
      <Text style = {styles.title}> {title}</Text>
     {/* <Picker
        selectedValue={option}
        style={styles.pickerStyle}
        onValueChange={handleSelectChange}
      >
        {options}
      </Picker>*/}
      <SelectInput
        options={list}
        value ={0}
        onSubmitEditing={handleSelectChange}
        style={{backgroundColor: "skyblue", width: 100, height: 40, justifyContent: 'center'}}
      />
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    marginBottom: 20
  },
  title: {
    color: 'orange',
    fontWeight: 'bold',
  },
  pickerStyle: {
    height: 25,
    width: 50,
    color: "white",
    backgroundColor: 'dodgerblue',
    borderWidth: 1,
    borderRadius: 12
  }
})
