import React , { Component} from 'react'
import {View, StyleSheet, Text, Dimensions, Button, Alert} from 'react-native'
import AsyncStorage from "@react-native-community/async-storage"
import Emoji from "react-native-emoji";

export default class Profile extends Component{
  constructor(props) {
    super(props);
    this.state = {
      name: "Not registered",
      budget: 0
    }
  }
  promptUser = () => {
    const {push} = this.props.navigation
    const title = 'Montant à ajouter';
    const message = 'Faites un choix';
    const buttons = [
      { text: 'Annuler', style: 'cancel' },
      { text: '5$', onPress: () => push('Paypal',{toPay: 5})},
      { text: '50$', onPress: () => push('Paypal',{toPay: 50})},
      /*{ text: '10$', onPress: () => push('Paypal',{toPay: 10})},
      { text: '50$', onPress: () => push('Paypal',{toPay: 50})},*/
    ];
    Alert.alert(title, message, buttons);
  }
  async componentDidMount() {
    await this.takeUserProfile();
  }
 async componentDidUpdate(prevProps, prevState, snapshot) {
    await this.takeUserProfile();
  }

  takeUserProfile = async () => {
    let User = await AsyncStorage.getItem("User");
    if(User) {
      User = JSON.parse(User)
      this.setState({
        name: User.firstName + " " + User.lastName,
        budget: User.budget
      })
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style = {styles.firstLineContainer}>
          <Text style = {styles.nameText}>
            {this.state.name}
          </Text>
        </View>
        <View style = {styles.budgetContainer}>
          <Text style = {styles.budgetText}>{this.state.budget + "$"}</Text>
        </View>
        <View style = {styles.buttonsContainer}>
          <Button
            title={"Ajouter de l'argent"}
            onPress={() => this.promptUser()}
          />
        </View>
        <View style = {styles.buttonsContainer}>
          <Button
            title={"Modifier vos données"}
          />
        </View>
        <View style = {styles.buttonsContainer}>
          <Button
            title={"Retirer vos gains"}
          />
        </View>
        <View style = {styles.buttonsContainer}>
          <Button
            title={"Nous contacter"}
          />
        </View>
      </View>
    );
  }
}
const deviceWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  firstLineContainer: {
    backgroundColor: "skyblue",

    justifyContent: 'center',
    alignItems: 'center',
    height: 150
  },
  nameText:{
    fontWeight: 'bold',
    fontSize: 24,
    color: 'white'
  },
  budgetContainer: {
    position: 'absolute',
    borderRadius: 60,
    marginTop: 90,
    borderWidth: 3,
    marginLeft: deviceWidth/2-65,
    height: 115,
    width: 115,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'red'
  },
  budgetText: {
    fontSize: 24,
    color: 'black',
    fontWeight: 'bold'
  },
  buttonsContainer: {
    marginTop: 60
  }
})
