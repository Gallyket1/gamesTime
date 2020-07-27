import React,{Component} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Button, ScrollView } from 'react-native';
import ModalResult from "../../ModalResult";
import Dialog, { DialogContent } from 'react-native-popup-dialog';
import DialogMessage from "./DialogMessage";
import * as  globalTexts from "./globalTexts";
import CustomSelect from "./CustomSelect";
import Emoji from "react-native-emoji";
import TextMessage from "./TextMessage";
import GameRule from "./GameRule";
import Announcement from "./Announcement";
import DialogTirage from "./DialogTirage";
import {CLOSE_DIALOG_TIMEOUT} from "./GlobaTimers";
import DialogRules from "./DialogRules";
import * as HttpStatus from 'http-status-codes'
import AsyncStorage from "@react-native-community/async-storage";
import Notif from "./MagicFive/UpdatesStack/Notif";
import {JACKPOT_GAIN, JACKPOT_RULES} from "./RuleTexts";



export default class App extends Component{
  constructor(props) {
    super(props);
    this.state = {
      initalList: [],
      listDigits : [],
      result: [],
      selectedDigits: [],
      openResultModal: false,
      textMessage: '',
      listMise: [{id: 7, value: 0.50, label: "0.2$"},{id: 1, value: 0.50, label: "0.5$"}, {id: 2, value: 1, label: "1$"},
        {id: 3, value: 2, label: "2$"}, {id: 4, value: 3, label: "3$"},
        {id: 5, value: 5, label: "5$"}, {id: 6, value: 10, label: "10$"}],
      selectedMise: 0.2,
      listLuckyBall:[{id: 1, name:'chipmunk', color: 'white'},
        {id: 2, name:'fries', color: 'white'}, {id: 3, name:'key', color: 'white'}, {id: 4, name:'bell', color: 'white'}],
      selectedLucky: '',
      luckyResult: '',
      bordCol: "red",
      openTirageModal: false,
      openRulesModal: false,
      idCounter: 0,
      isParticipating: false,
      listFaculties: [],
      gameName: "Magic Five"
    }
  }

  getFacList = (xObject) =>
    fetch("http://localhost:8080/faculty/getall", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
    }).then(response => {
      response.json().then( json =>{
        //console.log(response.status)
        if(response.status === HttpStatus.OK){
          xObject.setState({
            listFaculties: json,
            loading: false
          });
        }
        if(response.status !== HttpStatus.OK){
          xObject.setState({
            error: response.status
          })
        }

      });
    }).catch(err => {
      //console.log(err)
    });


  componentDidMount() {
    //this.getFacList(this)
    let listtmp = [];
    let dbor = [];
    for (let i = 0; i < 30; i++) {
      let digit = i + 1;
      let color = 'white'
      let elem = {digit, color}
      dbor.push(elem)
      listtmp.push(elem);
    }
    this.setState({
      listDigits:listtmp,
      initalList: ["H"]
    })
  };

  cleanTheBord = () => {
    let clonedList = [...this.state.listDigits];
    clonedList.forEach(element => {
      element.color = "white"
    });
    this.setState({
      listDigits: clonedList,
      selectedDigits: [],
      bordCol: 'red'
    })
  }

  quickPick = () => {
    this.cleanTheBord();
    let clonedList = [...this.state.listDigits];
    let listOfRandomDigits = [];
    while(listOfRandomDigits.length < 5){
      let c = Math.floor(Math.random()*31)
      if(listOfRandomDigits.indexOf(c) === -1 && c > 0){
        listOfRandomDigits.push(c)
      }
    }
    listOfRandomDigits.forEach(element => {
      let v = clonedList.filter(x => x.digit === element)[0];
      v.color = "orange"
    })
    this.setState({
      listDigits: clonedList,
      selectedDigits: listOfRandomDigits,
      bordCol: 'green'
    })
  }

  updateSelectedDigits = (key) => {
    //console.log(key)
    let clonedList = [...this.state.listDigits];
    let clonedSelectedDig = [...this.state.selectedDigits];
    let pressedElem = clonedList.filter(element => element.digit === key)[0]
    if(pressedElem.color === 'white'){
      if(clonedSelectedDig.length < 5 && clonedSelectedDig.indexOf(key) === -1){
        pressedElem.color = 'orange';
        clonedSelectedDig.push(key);
      }else{
        this.setState({
          openResultModal: true,
          textMessage: new TextMessage(globalTexts.ALREADY_FIVE, "black", "smirk")
        })
      }
    }else {
      clonedSelectedDig = clonedSelectedDig.filter(digit => digit !== key)
      pressedElem.color = 'white';

      //console.log(clonedSelectedDig)
    }
    this.setState({
      listDigits: clonedList,
      selectedDigits: clonedSelectedDig
    })
    if(clonedSelectedDig.length === 5){
      this.setState({
        bordCol: "green"
      })
    }else{
      this.setState({
        bordCol: "red"
      })
    }
  };
  updateSelectedLucky = (key) => {
    let {selectedLucky} = this.state;
    let clonedlistLuckyBall = [...this.state.listLuckyBall];
    let selectedElement = clonedlistLuckyBall.filter(element => element.id === key)[0];
    if(selectedElement.color === 'white'){
      if(selectedLucky && selectedElement.id !== selectedLucky){
        return;
      }
      selectedElement.color = 'green'
      this.setState({
        selectedLucky: selectedElement.name
      })
    }else{
      selectedElement.color = 'white'
      this.setState({
        selectedLucky: ''
      })
    }
    this.setState({
      listLuckyBall: clonedlistLuckyBall
    })
  }

  participate = () => {
    let clonedSelectedDig = [...this.state.selectedDigits];
    let {selectedMise} = this.state;
    let {selectedLucky} = this.state;
    let isLenListDigitFull = clonedSelectedDig.length === 5

    if(!(isLenListDigitFull && selectedLucky)){
      this.setState({
        openResultModal: true,
        textMessage: new TextMessage(globalTexts.BAD_COMBINATION,  'black', 'warning')
      })
      return
    }
    this.setState({
      isParticipating: true
    })

  }

  shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  updateBudget= async (amount, operation) => {
    let User = await AsyncStorage.getItem("User");
    User = JSON.parse(User);
    switch (operation){
      case "add":
        //User.budget *= 1.0
        User.budget = Math.round((User.budget + amount)*100.0)/100;
        await AsyncStorage.setItem("User", JSON.stringify(User));
        break;
      case "remove":
        //User.budget *= 1.0
        User.budget = Math.round((User.budget - amount)*100.0)/100;
        await AsyncStorage.setItem("User", JSON.stringify(User));
        break
      default: break;
    }
  }
  isBudgetEnough = async (mise) => {
    let User = await AsyncStorage.getItem("User");
    User = JSON.parse(User);
    return User.budget >= mise;
  }

  updateNotifications = async (amount, result) => {
    let notifications = await AsyncStorage.getItem("Notifications");
    notifications = JSON.parse(notifications);
    switch (result) {
      case "success":
        let notif = new Notif(globalTexts.won(amount, this.state.gameName))
        notifications.push(notif);
        await AsyncStorage.setItem("Notifications", JSON.stringify(notifications));
        break;
      case "failure":
        let notif1 = new Notif(globalTexts.lost(amount, this.state.gameName))
        notifications.push(notif1);
        await AsyncStorage.setItem("Notifications", JSON.stringify(notifications));
        break;
      default: break;
    }
  }

  async updateNewNotifs(){
    let newNotifs = await AsyncStorage.getItem("newNotifs");
    if(newNotifs){
      newNotifs = JSON.parse(newNotifs);
      newNotifs += 1;
      await AsyncStorage.setItem("newNotifs", JSON.stringify(newNotifs));
    }
  }

  play = async () => {
    let canPlay = await this.isBudgetEnough(this.state.selectedMise);
    if(!canPlay) {
      this.setState({
        openResultModal: true,
        textMessage: new TextMessage(globalTexts.NOT_ENOUGH_MONEY, "red", "woman-walking")
      });
      return
    }
    await this.updateBudget(this.state.selectedMise, "remove");
    let clonedSelectedDig = [...this.state.selectedDigits];
    let {selectedMise} = this.state;
    let {selectedLucky} = this.state;

    let isLenListDigitFull = clonedSelectedDig.length === 5

    if(!(isLenListDigitFull && selectedLucky)){
      this.setState({
        openResultModal: true,
        textMessage: new TextMessage(globalTexts.BAD_COMBINATION,  'black', 'warning')
      })
      return;
    }
    this.setState({
      openTirageModal: true
    })

    let genLucky = this.generateLucky()
    //let genLucky = 'fries'
    let isLuckyBallOk = genLucky === selectedLucky;
    let listnew = [];

    let bingo = this.generateTirage();
    let goodNumbers = bingo.filter(element => clonedSelectedDig.indexOf(element.digit) !== -1);
    let badNumbers = bingo.filter(element => clonedSelectedDig.indexOf(element.digit) === -1);

    let gdlength = goodNumbers.length;
    let wonMoney = Math.round(parseFloat(selectedMise)*(gdlength)*100.0)/100;
    let wonMoneyNoLuckyBall = Math.round(parseFloat(selectedMise)*(gdlength -1)*100.0)/100;
    let jackPot = Math.round(parseFloat(selectedMise)*200*100.0)/100;
    let almostJackPot = Math.round(parseFloat(selectedMise)*10*100.0)/100;

    if(gdlength === 0 || (!isLuckyBallOk && gdlength <= 1)){
      //console.log("1er cas")
      this.setState({
        textMessage: new TextMessage(globalTexts.NO_GAIN, 'red', 'pensive')
      });
      await this.updateNotifications(this.state.selectedMise, "failure")
    }else if (isLuckyBallOk && gdlength >= 1){
      //console.log("2ème cas")
      if(gdlength === 5){
        //console.log("2ème cas - A")
        this.setState({
          textMessage: new TextMessage(globalTexts.gain(jackPot), 'green','moneybag'),
        });
        await this.updateBudget(jackPot, "add");
        await this.updateNotifications(jackPot, "failure");
      }else{
        //console.log("2ème cas - B")
        this.setState({
          textMessage: new TextMessage(globalTexts.gain(wonMoney), 'green','moneybag'),
        });
        await this.updateBudget(wonMoney, "add");
        await this.updateNotifications(wonMoney, "success");
      }
    }else if (!isLuckyBallOk && gdlength > 1){
      if(gdlength === 5){
        this.setState({
          textMessage: new TextMessage(globalTexts.gain(almostJackPot), 'green','moneybag'),
        });
        await this.updateBudget(almostJackPot, "add");
        await this.updateNotifications(almostJackPot, "success");
      }else {
        this.setState({
          textMessage: new TextMessage(globalTexts.gain(wonMoneyNoLuckyBall), 'green','moneybag'),
        });
        await this.updateBudget(wonMoneyNoLuckyBall, "add");
        await this.updateNotifications(wonMoneyNoLuckyBall, "success");
      }
    }
    goodNumbers.forEach(element => element.color = 'green');
    badNumbers.forEach(element => element.color = 'red');
    let reslen = 5
    let bang = [...goodNumbers, ...badNumbers];
    this.shuffle(bang);
    for(let i = 0; i < reslen; i++) {
      setTimeout(() =>{
        listnew[i] = bang[i];
        this.setState({
          result: listnew
        })
      })
    }
    setTimeout(() =>{
      this.setState({
        luckyResult: genLucky
      })
    })
    setTimeout(() =>{
      this.updateNewNotifs();
      this.setState({
        openResultModal: true,
        openTirageModal: false
      })
    }, CLOSE_DIALOG_TIMEOUT);
  };

  updateShowModal = () => {
    this.setState({
      openResultModal: false
    })
  }

  generateLucky = () => {
    let clonedlistLuckyBall = [...this.state.listLuckyBall]
    let c = Math.floor(Math.random()*4)
    //console.log("c = " + c)
    return clonedlistLuckyBall[c].name
  }

  generateTirage = () => {
    let bingo = [];
    let beno = [];
    let fauxPlan = [{digit: 7, color: 'red'}, {digit: 2, color: 'red'}, {digit: 3, color: 'red'},
      {digit: 4, color: 'red'}, {digit: 5, color: 'red'}]
    while(beno.length < 5){
      let c = Math.floor(Math.random()*31);
      if(beno.indexOf(c) === -1 && c > 0){
        let color = 'red'
        let digit = c
        let elem = {digit, color}
        beno.push(c)
        bingo.push(elem);
      }
    }
    return bingo
  }

  render() {
    let {listDigits, result, bgColor, openResultModal,
      textMessage, listMise, selectedMise, listLuckyBall, luckyResult,
      bordCol, openTirageModal, openRulesModal} = this.state;


    let luckySet = listLuckyBall.map(elem =>
      <TouchableOpacity key={elem.id} onPress={() => this.updateSelectedLucky(elem.id)}>
        <View style = {{...styles.roundedDigitContainer, backgroundColor: elem.color}}>
          <Emoji name={elem.name} style={{fontSize: 15}} />
        </View>
      </TouchableOpacity>
    )

    let showResult = result.map(res =>
      <View style = {[styles.resultDigitsContainer, {backgroundColor:res.color}]} key={res.digit}>
        <Text style={{color:'white'}}>{res.digit}</Text>
      </View>
    )
    let table = listDigits.map(elem =>
      <TouchableOpacity key={elem.digit} onPress={() => this.updateSelectedDigits(elem.digit)}>
        <View style = {[styles.roundedDigitContainer, {backgroundColor: elem.color}]} >
          <Text style ={styles.resultDigitText}>{elem.digit}</Text>
        </View>
      </TouchableOpacity>
    )
    return (
      <View style = { styles.container}>
        <ScrollView>
          <Announcement
            message={globalTexts.JACKPOT_ANNOUNCEMENT}
            emoji = "champagne"
          />
          <View style = { styles.innerContainer}>
            {/*<Button title="hey" onPress={() => this.setState({openTirageModal: true})}/>*/}
            <View style = {{flexDirection: 'row'}}>
              <Text style = { styles.instructionsText}>{globalTexts.INSTRUCTION}</Text>
              <TouchableOpacity
                style = {{color: 'white', marginLeft: 5}}
                onPress={() => this.setState({openRulesModal: true})}>
                <Emoji name="information_source" style={{fontSize: 18, color: 'white'}} />
              </TouchableOpacity>
            </View>
            <View style = {{...styles.tableContainer, borderColor: bordCol}}>
              {table}
            </View>
            <View style = {{flexDirection: 'row'}}>
              {luckySet}
            </View>
            <CustomSelect
              title={globalTexts.MISE}
              list={listMise}
              option={selectedMise}
              handleSelectChange={(value) => this.setState({selectedMise: value})}
            />
            <View style = { styles.buttonsContainer}>
              <View style = {styles.randomButton}>
                <TouchableOpacity onPress = {this.quickPick} >
                  <Text style = {styles.buttonText}>Hasard</Text>
                </TouchableOpacity>
              </View>
              <View style = {styles.deleteButton}>
                <TouchableOpacity onPress = {this.cleanTheBord} >
                  <Text style = {styles.buttonText}>Supprimer</Text>
                </TouchableOpacity>
              </View>
              <View style = {styles.playButton}>
                <TouchableOpacity onPress = {this.play} >
                  <Text style = {styles.buttonText}>Jouer</Text>
                </TouchableOpacity>
              </View>
            </View>
            <Text style={{color: 'white', fontStyle: 'italic'}}>Dernier Tirage:</Text>
            {!openTirageModal? (
              <View style = {styles.resultContainer}>
                {showResult}
                {luckyResult  ?
                  <View style = {{...styles.roundedDigitContainer, backgroundColor: 'white'}}>
                    <Emoji name={luckyResult} style={{fontSize: 15}} />
                  </View> :null}
              </View>
            ): null}
          </View>
          <DialogMessage
            openResultModal = {openResultModal}
            textMessage ={textMessage}
            onTouchOutside = {() => this.setState({openResultModal: false})}
          />
            <DialogTirage
              openTirageModal={openTirageModal}
              onTouchOutside={() => alert('Vous ne pouvez pas fermer cette page avant la fin du tirage :)')}
              result={result}
              luckyResult ={luckyResult}
            />
            <DialogRules
              openRulesModal={openRulesModal}
              onTouchOutside = {() => this.setState({openRulesModal: false})}
              charts = {{rules: JACKPOT_RULES, jackpot: JACKPOT_GAIN}}
            />
        </ScrollView>

      </View>
    );
  }

}

const carre = 30;
const margin = 1.5
const elemByRow = 5;
const elemByColumn = 6;
const offset = carre + 2;
const paddingTop = offset/4
const tableHeight = elemByColumn*(carre + margin) - margin + offset
const tableWidth = elemByRow*(carre + margin) - margin + offset

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  innerContainer: {
    backgroundColor: 'black',
    margin: 20,
    flexDirection: 'column',

    alignItems: 'center',
    borderRadius: 20
  },
  tableContainer:{
    width: tableWidth,
    height: tableHeight,
    borderWidth: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingTop: paddingTop,
    borderRadius: 20,
    margin: 15,
  },
  roundedDigitContainer: {
    height: carre,
    width: carre,
    borderRadius: 5,
    borderWidth: 1,
    alignItems: 'center',
    margin: margin,
    borderColor: 'orange'
  },
  resultContainer: {
    margin: 10,
    flexDirection: 'row'
  },
  resultDigitsContainer: {
    height: carre,
    width: carre,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    margin: margin,
    borderColor: 'orange',
    justifyContent: 'center',
    backgroundColor: 'dodgerblue'
  },
  button: {
    width: 150,
    margin: 10
  },
  buttonsContainer: {
    flexDirection: 'row',
    width: tableWidth + 50
  },
  playButton: {
    flex: 3,
    margin: 3,
    backgroundColor: 'orange',
    alignItems: 'center',
    borderRadius: 20,
    color: 'orange'
  },
  deleteButton: {
    flex: 3,
    margin: 3,
    backgroundColor: 'red',
    alignItems: 'center',
    borderRadius: 20,
  },
  randomButton: {
    flex: 3,
    margin: 3,
    backgroundColor: 'dodgerblue',
    alignItems: 'center',
    borderRadius: 20
  },
  buttonText: {
    color: 'white',

  },
  instructionsText: {
    fontWeight: 'bold',
    fontStyle: 'italic',
    color: 'orange',
    fontSize: 12
  }
});


