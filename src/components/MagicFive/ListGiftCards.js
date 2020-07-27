import React,{useState} from 'react'
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native'
import GiftCard from "./GiftCard";
import AsyncStorage from "@react-native-community/async-storage"

export default function({giftList}){

  let [pointer, setPointer] = useState("auto")
  let storeKey = async (key) => {
    await AsyncStorage.setItem("giftKey", key.toString())
    setPointer("none")
    setPointer("none")
  }

  let giveTheGiftKey = async () => {
    let b = await AsyncStorage.getItem("giftKey");
  }

  let listGiftCards = giftList.map((element, index)=>
      <GiftCard
        key={index}
        gift={element.gift}
        storeKey={() => storeKey(element.id)}
      />
  )
  return (
    <View style={styles.container} pointerEvents={pointer}>
      {listGiftCards}
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row'
  }
})
