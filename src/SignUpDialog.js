import Dialog, { DialogContent } from 'react-native-popup-dialog';
import {Text, View, StyleSheet, TouchableOpacity, TextInput, Button, Alert} from "react-native";
import React, {Component}from "react";
import Emoji from "react-native-emoji";
import AsyncStorage from "@react-native-community/async-storage";
import Player from "./components/MagicFive/Player";



export default class SignUpDialog extends Component{
  constructor(props) {
    super(props);
    this.state = {
      prenom: "",
      nom: "",
      email: "",
      error: "",
      showModal: true,
      success: false
    }
  }

  async componentDidMount() {
    await this.verifyUserInDevice();
    await this.persitNotifications();
    await this.persistNewNotif();
    //await AsyncStorage.clear();
  }

  async persitNotifications(){
    let notifications = await AsyncStorage.getItem("Notifications");
    if(notifications === null || notifications === undefined){
      let notifications = [];
      await AsyncStorage.setItem("Notifications", JSON.stringify(notifications))
    }
  }

  async verifyUserInDevice() {
    let registeredUser = await AsyncStorage.getItem("User");
    if(registeredUser){
      this.setState({
        showModal: false
      })
    }
  }
  async persistNewNotif() {
    let newNotifs = await AsyncStorage.getItem("newNotifs");
    if(!newNotifs){
      let newNot = 0;
      await AsyncStorage.setItem("newNotifs", JSON.stringify(newNot));
    }
  }

  async register(firstName, lastName, email){
    let registeredUser = await AsyncStorage.getItem("User");
    if(registeredUser === null || registeredUser === undefined){
      let User = new Player(firstName, lastName, email, 50);
      await AsyncStorage.setItem("User", JSON.stringify(User));
    }else{
      console.log(JSON.parse(registeredUser));
    }
  }

  async persistUser(){
    let {prenom, nom, email, error} = this.state;
    let isDataOk = this.validateData();
    if(isDataOk){
      await this.register(prenom, nom, email);
      this.setState({
        success: true
      });
      setTimeout(() => {
        this.setState({
          showModal: false
        })
      }, 2000)
    }
  }

  clearError = () => {
    this.setState({
      error: "",
    })
  }

  validateData = () =>{
    let {prenom, nom, email, error} = this.state;
    if(!this.validateEmail(email)){
      error = "Votre email n'est pas valide";
      this.setState({
        error
      });
      return false;
    }
    if(prenom && nom && email){
      return true;
    }else{
      error = "Veuillez entrer vos données";
      this.setState({
        error
      });
      return false;
    }
  }

  validateEmail = (email) => {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };
  render(){
    return (
      <View>
        <Dialog
          visible={this.state.showModal}
          onTouchOutside={()=> console.log('hahah')}
        >
          <DialogContent>
            {!this.state.success &&
            <View style = {styles.container}>
              <Text style={{fontWeight: 'bold', fontSize: 20}}>Inscription</Text>
              <Text style={{fontStyle: 'italic'}}>Inscrivez-vous pour accéder aux jeux</Text>
              <View style={{...styles.formContainer}}>
                <Text style={{color: "red"}}>{this.state.error}</Text>
                <View style={styles.inputbox}>
                  <TextInput
                    placeholder={"Votre prénom"}
                    onChangeText={text => {
                      this.setState({prenom: text});
                      this.clearError()
                    }}
                    onBlur={() => {
                      if (!this.state.prenom) {
                        Alert.alert('Attention !', "Veuillez entrer votre prénom.")
                      }
                    }}
                  />
                </View>
                <View style={styles.inputbox}>
                  <TextInput
                    placeholder={"Votre nom"}
                    autoCapitalize="words"
                    onChangeText={text => {
                      this.setState({nom: text});
                      this.clearError()
                    }}
                    onBlur={() => {
                      if (!this.state.nom) {
                        Alert.alert('Attention !', "Veuillez entrer votre nom.")
                      }
                    }}
                  />
                </View>
                <View style={styles.inputbox}>
                  <TextInput
                    placeholder={"E-mail"}
                    onChangeText={text => {
                      this.setState({email: text});
                      this.clearError()
                    }}
                    onBlur={() => {
                      if (!this.validateEmail(this.state.email)) {
                        Alert.alert('Attention !', "Votre email n'est pas valide.")
                      }
                    }}
                  />
                </View>
                <View style={{marginTop: 14}}>
                  <Button title="Valider" onPress={() => this.persistUser()}/>
                </View>
              </View>
            </View>}
            {this.state.success && <View style={styles.container}>
              <Text style={{fontSize: 18}}>Amusez-vous bien !</Text>
              <Emoji name="white_check_mark" style={{fontSize: 33}}/>
            </View>}
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
    backgroundColor: 'white',
  },
  textMessage: {
    color: 'green',
    fontWeight: 'bold'
  },
  formContainer: {
    height: 250,
    width: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputbox: {
    height: 30,
    width: 200,
    borderColor: "gray",
    borderBottomWidth: 2,
    paddingLeft: 7,
    marginTop: 7
  }
})
