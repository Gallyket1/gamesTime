import React, {Component} from 'react'
import FlipingComponent from "../FlipingComponent"
import {View, StyleSheet, Text, Button, TouchableOpacity} from 'react-native'
import DialogMessage from "../DialogMessage";
import TextMessage from "../TextMessage";
import * as globalTexts from "../globalTexts";
import CustomSelect from "../CustomSelect";
import Emoji from "react-native-emoji";
import {ArrayOfWords} from "./ArrayOfWords";
import {INTRUS_GAIN, INTRUS_RULES} from "../RuleTexts";
import DialogRules from "../DialogRules";
import AsyncStorage from "@react-native-community/async-storage";
import Notif from "../MagicFive/UpdatesStack/Notif";

export default class ListFlipingComponents extends Component{
  constructor(props) {
    super(props);
    this.state = {
      actualWordIndex: 0,
      listOfCharacters: '',
      listOfDisplayCharacters: '',
      wordsList: [],
      //wordsList: ['PATRIMONIALE', 'PARCELLE', 'STIPAD'],
      intrusList: ['[', ']', '(', ')', '{', '%', 'µ', '<', '>', '@', '&'],
      score: 0,
      actualWordLength: 0,
      wordTracker: 0,
      level: 1,
      entireWords: 0,
      openResultModal: false,
      textMessage: '',
      openLetters: 0,
      bgColor: 'white',
      listLevel: [{value: 1, label: '1 intrus'}, {value: 2, label: '2 intrus'},
        {value: 3, label: '3 intrus'}, {value: 4, label: '4 intrus'}],
      selectedLevel: 1,
      maxScore: 0,
      openRulesModal: false
    }
    this.initialState = {...this.state}
  }

  verifyCharacter = (character) => {
    let {listOfDisplayCharacters, listOfCharacters, score,
      actualWordIndex, wordsList, intrusList, actualWordLength,
      wordTracker, entireWords, openLetters, selectedLevel} = this.state;
    /*if(actualWordIndex > wordsList.length - 1){
      return;
    }*/
    //console.log(listOfCharacters.indexOf(character));
    //console.log(/*listOfCharacters.indexOf(character) === */actualWordLength - 1);
    let lossByIntrus = 50;
    if(listOfCharacters.indexOf(character) !== -1){
      let gainByWord = 250;
      score += 4*selectedLevel
      wordTracker++;
      openLetters++;
      this.setState({
        wordTracker,
        openLetters
      });
      setTimeout(() => {
        this.setState({
          score,
        })
      }, 800)
      if(wordTracker === actualWordLength && actualWordIndex <= wordsList.length - 1){
        //console.log("WT: " + wordTracker);
        if(wordsList[actualWordIndex + 1] !== undefined){
          actualWordIndex++;
          entireWords++;
          score += gainByWord*selectedLevel;
          wordTracker = 0;
          listOfCharacters = wordsList[actualWordIndex];
          actualWordLength = listOfCharacters.length;
          listOfDisplayCharacters = this.updateDisplayedCharacters(intrusList, wordsList,
            selectedLevel, actualWordIndex);
          setTimeout(() => {
            this.setState({
              bgColor: 'skyblue'
            })
          }, 850);
          setTimeout(() => {
            this.setState({
              listOfDisplayCharacters,
              listOfCharacters,
              actualWordIndex,
              actualWordLength,
              wordTracker,
              score,
              bgColor: 'white',
            })
          }, 1800);
        }else if(wordsList[actualWordIndex + 1] === undefined) {
          score += gainByWord*selectedLevel;
          setTimeout(() => {
            this.setState({
              bgColor: 'skyblue',
              score
            });
            setTimeout(() => {
              this.showResult()
            }, 1000);
          }, 850);
          /*setTimeout(() => {
            this.resetGame()
          }, 2300)*/
        }
      }
      //console.log(character)
    }else{
      /*console.log(character + "Hum")*/
      if(wordsList[actualWordIndex + 1] !== undefined){
        score -= lossByIntrus*selectedLevel;
        actualWordIndex++;
        wordTracker = 0;
        listOfCharacters = wordsList[actualWordIndex];
        actualWordLength = listOfCharacters.length;
        listOfDisplayCharacters = this.updateDisplayedCharacters(intrusList, wordsList,
          selectedLevel, actualWordIndex);
        setTimeout(() => {
          this.setState({
            bgColor: 'red'
          })
        }, 850);
        setTimeout(() => {
          this.setState({
            listOfDisplayCharacters,
            listOfCharacters,
            actualWordIndex,
            wordTracker,
            actualWordLength,
            bgColor: 'white',
            score
          })
        }, 1800)
      }else {
        score -= lossByIntrus*selectedLevel;

        setTimeout(() => {
          this.setState({
            bgColor: 'red',
            score
          })
        }, 850);
        setTimeout(() => {
          this.showResult()
        }, 1000);
        /*setTimeout(() => {
          this.resetGame()
        }, 2300)*/
      }
    }
  }

  showResult = async () => {
    let{maxScore, score} = this.state;
    let finalResult = (score/maxScore*100).toFixed(1)
    let resultColor = finalResult > 40? 'green' : 'red'
    this.setState({
      openResultModal: true,
      textMessage: new TextMessage(globalTexts.resultIntrus(finalResult),
        resultColor, 'loudspeaker'),
    });
    await this.updateNotifications(finalResult);
  }

  updateNotifications = async (score) => {
    await this.updateNewNotifs();
    let notifications = await AsyncStorage.getItem("Notifications");
    notifications = JSON.parse(notifications);
    let notif = new Notif(globalTexts.notifIntrus(score));
    notifications.push(notif);
    await AsyncStorage.setItem("Notifications", JSON.stringify(notifications));

  }

  async updateNewNotifs(){
    let newNotifs = await AsyncStorage.getItem("newNotifs");
    if(newNotifs){
      newNotifs = JSON.parse(newNotifs);
      newNotifs += 1;
      await AsyncStorage.setItem("newNotifs", JSON.stringify(newNotifs));
    }
  }

  populateWordlist(level){
    let n = 15;
    let gainByLetter = 4
    let gainByWord = 250;
    let aowLength = ArrayOfWords.length;
    let wordsList= [];
    while (wordsList.length < n){
      for (let i = 0; i < n; i++){
        const j = Math.floor(Math.random() *aowLength)
        if(wordsList.indexOf(ArrayOfWords[j].toLocaleUpperCase()) === -1){
          wordsList.push(ArrayOfWords[j].toLocaleUpperCase())
        }
      }
    }
    let maxScore = (wordsList.join("").length*gainByLetter + gainByWord*n)*level;
    return {wordsList, maxScore}
  }

  launch = () => {
    let {listOfDisplayCharacters, listOfCharacters, score, actualWordIndex,
      wordsList, intrusList, actualWordLength, wordTracker, selectedLevel, maxScore} = this.state;
    let popul = this.populateWordlist(selectedLevel)
    wordsList = popul.wordsList;
    maxScore = popul.maxScore

    this.shuffle(wordsList)
    wordTracker = 0;
    actualWordIndex = 0;
    listOfCharacters = wordsList[actualWordIndex];
    actualWordLength = listOfCharacters.length;

    listOfDisplayCharacters = this.updateDisplayedCharacters(intrusList, wordsList, selectedLevel, actualWordIndex);

    /*let ls = this.shuffle(listOfDisplayCharacters.split(""));
    ls = ls.join("");*/

    /*listOfDisplayCharacters = ls;*/
    //this.shuffle(listOfDisplayCharacters);
      this.setState({
        listOfCharacters,
        listOfDisplayCharacters,
        actualWordLength,
        wordTracker,
        wordsList,
        maxScore
      })
  }

  updateDisplayedCharacters = (intrusList, wordsList, selectedLevel, actualWordIndex) => {
    let intrusWord = ''
    for (let i = 0; i < selectedLevel; i++){
      intrusWord += this.shuffle(intrusList)[i];
    }
    let tmp = this.melangeLettres(  wordsList[actualWordIndex] + intrusWord)

    return this.shuffle((this.shuffle((tmp).split(""))).join(""));
  }

  melangeLettres(word){
    let shuffledWord = '';
    word = word.split('');
    while (word.length > 0) {
      shuffledWord +=  word.splice(word.length * Math.random() << 0, 1);
    }
    return shuffledWord;
  }

  resetGame = () => {
    this.setState({
      openResultModal: false,
    })
    setTimeout(() => {
      this.setState(this.initialState);
    }, 100)
  }

  endOfTheGame = () => {
    //let {} = this.state
    this.setState({
      openResultModal: true,
      textMessage: new TextMessage(globalTexts.BAD_COMBINATION,  'black', 'warning'),
      actualWordIndex: 0,
    });

  }

  shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  render() {
    let {listOfDisplayCharacters, listOfCharacters, wordsList,
      actualWordIndex, listLevel, openResultModal,
      textMessage, openRulesModal, selectedLevel} = this.state;
    //let wordToDisplay = wordsList[actualWordIndex];

    let levelToShow = listLevel.filter(level => level.value === selectedLevel)[0].label

    let cards = (listOfDisplayCharacters.split("")).map((character, index) =>
      <FlipingComponent
        key = {index}
        character ={character}
        letterNumber = {index + 1}
        verifyCharacter = {() => this.verifyCharacter(character)}
        bgColor = {this.state.bgColor}
      />
    );
    return (
      <View key={this.state.actualWordIndex}
            style = {{flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 5,
              borderRadius: 20,
              borderWidth: 1,
              margin: 15,
              paddingTop: 12, paddingBottom: 4}}>
        <TouchableOpacity
          style={{color: 'white', marginLeft: 5, flexDirection: 'row'}}
          onPress={() => this.setState({openRulesModal: true})}>
          <Text style={{color: 'blue', fontStyle: 'italic', fontWeight: 'bold', fontSize: 15}}>
            Comment jouer ?
          </Text>
          <Emoji name="information_source" style={{fontSize: 18, color: 'white'}}/>
        </TouchableOpacity>
        {listOfCharacters!== '' &&
        <View style={{flexDirection: 'row'}}>
          <Text>
            {"Score : "}
          </Text>
          <Text style={{color: this.state.score >= 0? 'green': 'red'}}>
            {this.state.score}
          </Text>
          <Text style={{color: 'green'}}>
            {" / " + this.state.maxScore}
          </Text>
        </View>}
        <View style={{flexDirection: 'row'}}>
          <Text>
            {listOfCharacters? "Mot : " : ""}
          </Text>
          <Text style = {{fontWeight: 'bold',}}>{listOfCharacters}</Text>
        </View>
        {listOfCharacters!== '' &&
        <View style={{flexDirection: 'row'}}>
          <Text style={{fontSize: 12, color: 'indianred', fontWeight: 'bold'}}>
            {"Difficulté: "}
          </Text>
          <Text style={{fontWeight: 'bold',fontSize: 11}}>
            {levelToShow}
          </Text>
        </View>}
        {listOfCharacters!== '' &&
        <View style={{flexDirection: 'row'}}>
          <Text style={{fontSize: 12, color: 'indianred', fontWeight: 'bold'}}>
            {"Mots déjà vus: "}
          </Text>
          <Text style={{fontWeight: 'bold',fontSize: 11}}>
            {(actualWordIndex +1 ) + " / " + wordsList.length}
          </Text>
        </View>}
        {listOfCharacters !== ''?
        <View style={{...styles.container, borderWidth: listOfCharacters ? 2 : 0}}>
          {cards}
        </View>:
        <View style = {{justifyContent: 'center',}}>
          <Text style={{color: 'red', fontStyle: "italic", fontSize: 18}}>Attention à l'intrus !!!</Text>
          <Emoji name = "male-teacher" style = {{fontSize:105}}/>
        </View>}

        {!listOfCharacters &&
        <View style={{flex: 1}}>
          <CustomSelect
            title={"Difficulté"}
            list={this.state.listLevel}
            option={this.state.selectedLevel}
            handleSelectChange={(value) => this.setState({selectedLevel: value})}
          />
          <Button title={"Jouer"} onPress={() => this.launch()}/>
        </View>}
        {listOfCharacters !== '' &&
        <View style={{flex: 1}}>
          <Button title={"Abandonner"} onPress={() => {this.setState({openResultModal: true}); this.resetGame()}}/>
        </View>}
        <DialogMessage
          openResultModal = {openResultModal}
          textMessage ={textMessage}
          onTouchOutside = {() => this.resetGame()}
        />
        <DialogRules
          openRulesModal={openRulesModal}
          onTouchOutside = {() => this.setState({openRulesModal: false})}
          charts = {{rules: INTRUS_RULES, jackpot: INTRUS_GAIN}}
        />
      </View>
    )
  }
}


const styles = StyleSheet.create({
  container: {
    //flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    borderColor: 'green',
    borderRadius: 10,
    paddingBottom: 10,
  }
})
