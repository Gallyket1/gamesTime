import React, {Component} from 'react'
import {View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity} from "react-native";
import moment from "moment";
import AsyncStorage from "@react-native-community/async-storage"
import Emoji from "react-native-emoji";

export default class Notifications extends Component{
  constructor(props) {
    super(props);
    this.state = {
      notifList: [],
      checkNotif: 0
    }
  }

  async componentDidMount(){
    const { navigation } = this.props;
    this.focusListener = navigation.addListener("focus", () => {
       this.takeNotifications();
       this.cleanNotifs()
    });
  }
  /*async componentDidMount() {

  };*/
  async componentDidUpdate() {
    await this.takeNotifications();
    /*this.props.navigation.addListener('focus', () => {
      this.cleanNotifs()
    })*/
    //await this.cleanNotifs()
  }

  cleanNotifs = async () => {
    let newNotifs = await AsyncStorage.getItem("newNotifs");
    if (newNotifs) {
      newNotifs = JSON.parse(newNotifs)
      newNotifs = 0;
      await AsyncStorage.setItem("newNotifs", JSON.stringify(newNotifs))
    }
  }

  takeNotifications = async () => {
    let notifications = await AsyncStorage.getItem("Notifications");
    notifications = JSON.parse(notifications);
    notifications.sort((a, b) => a.date < b.date? 1: -1)
    this.setState({
      notifList: notifications
    })
  }

  render() {
    let time = moment(new Date("2020-06-26T17:14:26.086Z"), "YYYYMMDD").fromNow();
    let listNotifications = this.state.notifList.map((notification, index) =>
    <View key={index} style = {styles.notifContainer}>
      <View style = {styles.manette}>
        <Emoji name = "bell" style = {{fontSize: 22}}/>
      </View>
      <View style = {styles.textNotiContainer}>
        <Text style = {styles.text}>{notification.text}</Text>
        <Text style = {styles.timeLabels}>{moment(new Date(notification.date), "YYYY-MM-DD").fromNow()}</Text>
      </View>
    </View>)

    return (
      <View style={styles.container}>
        <ScrollView>
          {listNotifications}
        </ScrollView>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex:1,
    justifyContent: 'center',
  },
  notifContainer: {
    margin: 8,
    flexDirection: 'row',
    flexWrap: 'wrap'

  },
  text: {
    fontWeight: 'bold',
  },
  timeLabels:{
    alignSelf: 'flex-end'
  },
  manette: {
    marginRight: 10,
  },
  textNotiContainer: {
    justifyContent: 'center',
    flexWrap : 'wrap',
    width: 250,
    //height: 100,
    borderColor: 'red',
    borderWidth: 0.5,
    alignItems: 'center',
    padding: 5
  }
})
