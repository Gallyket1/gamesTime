import React, {Component} from 'react'
import FlagElement from "./FlagElement";
import {StyleSheet, View, Text, TouchableOpacity,
  Button, Animated, Easing, Dimensions, ImageBackground, Platform} from "react-native";
import Emoji from "react-native-emoji";
import {emo} from "./MyList";
import * as globalTexts from "./globalTexts";
import CustomSelect from "./CustomSelect";
import LinearGradient from 'react-native-linear-gradient';
import TextMessage from "./TextMessage";
import DialogMessage from "./DialogMessage";
import GiftCard from "./MagicFive/GiftCard";
import ListGiftCards from "./MagicFive/ListGiftCards";
import AsyncStorage from "@react-native-community/async-storage"
import CountDown from "react-native-countdown-component";
import Notif from "./MagicFive/UpdatesStack/Notif";
import {FLAG_PICK_GAIN, FLAG_PICK_RULES, JACKPOT_GAIN, JACKPOT_RULES} from "./RuleTexts";
import DialogRules from "./DialogRules";

const AImageBackground = Animated.createAnimatedComponent(ImageBackground);

export default class FlagPick extends Component{
  constructor(props) {
    super(props);
    this.state = {
      listFlags: [],
      listMise: [{id: 1, value: 0.50, label: "0.5$"}, {id: 2, value: 1, label: "1$"},
        {id: 3, value: 2, label: "2$"}, {id: 4, value: 3, label: "3$"},
        {id: 5, value: 5, label: "5$"}, {id: 6, value: 10, label: "10$"}],
      selectedMise: 0.50,
      initialListFlags: [],
      listOfRandomEmoji: [],
      attemptNumber: 8,
      openResultModal: false,
      beginGame: false,
      listChosenEmoji: [],
      listChosenKeys: [],
      textMessage: '',
      displayCongrat: false,
      displayPlusOne: false,
      currentEmoji: '',
      congratText: 'EXCELLENT !',
      congratEmoji: '+1',
      congratTextList: ['EXCELLENT !', 'YOU GOT IT !', 'BIEN VU !',"T'ES UN BOSS !", 'SUPER !'],
      congratEmojiList: ['+1', 'star-struck', 'woman-juggling', 'scream', 'fire'],
      showGiftCards: false,
      countId: 0,
      boostActivated: false,
      gameName: "Flag Picker",
      openRulesModal: false,
      giftList: [{id: 1, gift: "+1 coup"}, {id: 2, gift: "+2coups"},
        {id: 3, gift: "Money :)"
        }]
    }
    for (let i = 0; i < 42; i++){
      this.state.listFlags[i] = new FlagElement(i , "soccer", "rgba(0, 25, 100, 0)");
      this.state.initialListFlags[i] = new FlagElement(i , "soccer", 'rgba(0, 25, 100, 0)',);
    }
  }


  animatedCongrats = new Animated.Value(deviceWidth/4);
  rotatingDisk = new Animated.Value(0);

  movingStadium = new Animated.Value(0);

  rotateStadium = () => {
    let finValue;
    if(this.movingStadium.__getValue() === 0){
      finValue = 1
    }else{
      finValue = 0
    }
    Animated.timing(
      this.movingStadium,
      {
        toValue: finValue,
        duration: 2000,
        easing: Easing.bounce,
      }
    ).start()
  }

  animate = () => {
    Animated.parallel([
      Animated.loop(
        Animated.timing(
          this.animatedCongrats,
          {
            toValue: deviceWidth/2,
            duration: 2000,
            easing: Easing.bounce,
          }
        )
      ),
      ]
    ).start(() => {
      if(!beginAnim){
        this.animate();
      }
    })
  }

  updateBudget= async (amount, operation) => {
    let User = await AsyncStorage.getItem("User");
    User = JSON.parse(User);
    switch (operation){
      case "add":
        User.budget = Math.round((User.budget + amount)*100.0)/100;
        await AsyncStorage.setItem("User", JSON.stringify(User));
        break;
      case "remove":
        User.budget = Math.round((User.budget -amount)*100.0)/100;
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
  generateGameEmoji = async () => {
    await AsyncStorage.removeItem("giftKey")
    let canPlay = await this.isBudgetEnough(this.state.selectedMise);
    if(!canPlay) {
      this.setState({
        openResultModal: true,
        textMessage: new TextMessage(globalTexts.NOT_ENOUGH_MONEY, "red", "woman-walking")
      });
      return
    }
    await this.updateBudget(this.state.selectedMise, "remove");
    this.rotateStadium();
    let {listFlags, countId} = this.state;
    let listEmoLenght = emo.length;

    this.setState({
      beginGame: true,
      countId: countId + 1,
      boostActivated: false
    })

    let gameList = ["flag-cd", "dvd", "flag-cd", "flag-cd", "star2", "flag-cd",
      "flag-cd"];

    for (let i = 7; i < listFlags.length; i++) {
      const index = Math.floor(Math.random()*(listEmoLenght));
      gameList[i] = emo[index];
    }
    this.shuffle(gameList);
    this.setState({
      listOfRandomEmoji: gameList
    });
  }

  updateNotifications = async (amount, result) => {
    let notifications = await AsyncStorage.getItem("Notifications");
    notifications = JSON.parse(notifications);
    switch (result) {
      case "success":
        let notif = new Notif(globalTexts.won(amount, this.state.gameName));
        notifications.push(notif);
        await AsyncStorage.setItem("Notifications", JSON.stringify(notifications));
        break;
      case "failure":
        let notif1 = new Notif(globalTexts.lost(amount, this.state.gameName));
        notifications.push(notif1);
        await AsyncStorage.setItem("Notifications", JSON.stringify(notifications));
        break;
      case "bonus":
        let notif2 = new Notif(globalTexts.bonus(amount, this.state.gameName));
        notifications.push(notif2);
        await AsyncStorage.setItem("Notifications", JSON.stringify(notifications));
        break;
      default: break;
    }
  }

  showTheBoard() {
    let {listFlags, listOfRandomEmoji} = this.state
    for(let i = 0; i < listFlags.length; i++){
      listFlags[i].emoji = listOfRandomEmoji[i];
    }
    this.setState({
      listFlags
    })
  }
  resetTheBoard() {
    let {listFlags} = this.state
    for(let i = 0; i < listFlags.length; i++){
      listFlags[i].emoji = 'soccer'
    }
    this.setState({
      listFlags,
      attemptNumber: 8,
      listChosenEmoji: [],
      listChosenKeys: [],
    })
  }

  revealEmoji = async (key) => {
    //console.log(key)
    let {listFlags, listOfRandomEmoji,
      attemptNumber, listChosenEmoji,
      listChosenKeys, selectedMise, currentEmoji} = this.state;
    let clonedListFlags = [...this.state.listFlags];

    let elemInModif = listFlags.filter(elem => elem.id === key)[0];

    if(attemptNumber === 0 || listChosenKeys.indexOf(key) !== -1) {
      return;
    }else{
      this.setState({
        attemptNumber: attemptNumber - 1
      })
    }

    elemInModif.emoji = listOfRandomEmoji[key];

    if(listOfRandomEmoji[key] === 'flag-cd'){
      this.setCongratTextList();
      this.setState({
        displayCongrat: true,
      })
      setTimeout(() => {
        this.setState({
          displayCongrat: false
        })
      }, 1000)
    }else if(listOfRandomEmoji[key] === 'dvd') {
      this.addAttempt()
      this.setState({
        displayPlusOne: true,
      })
      setTimeout(() => {
        this.setState({
          displayPlusOne: false
        })
      }, 2000)
    }else if(listOfRandomEmoji[key] === 'star2'){
      this.setState({
        showGiftCards: true
      });
      /*setTimeout(() => {
        this.setState({
          showGiftCards: false
        });
      }, 3000)*/
    }
    listChosenEmoji.push(elemInModif.emoji)
    listChosenKeys.push(key)
    let verifList = listChosenEmoji.filter(elem => elem === 'flag-cd');
    let verifDisk = listChosenEmoji.filter(elem => elem === 'dvd');

    if(attemptNumber === 1 && listOfRandomEmoji[key] !== 'dvd'
      && listOfRandomEmoji[key] !== 'star2'){
      setTimeout(() => {
        this.setState({
          openResultModal: true
        })
      }, 800);
      setTimeout(() => {
        this.showTheBoard()
      }, 3000)
      setTimeout(() => {
        this.updateNewNotifs();
        this.resetTheBoard();
        this.rotateStadium()
        this.setState({
          beginGame: false
        })
      }, 8000)

      if(verifList.length === 0  || (verifList.length === 1 && verifDisk.length === 0)){
        this.setState({
          textMessage: new TextMessage(globalTexts.NO_GAIN, 'red', 'pensive')
        });
        await this.updateNotifications(this.state.selectedMise, "failure");
      }else{
        if(verifList.length === 4 && verifDisk.length === 1){
          let gain = selectedMise*10;
          this.setState({
            textMessage: new TextMessage(globalTexts.gain(gain), 'green','moneybag')
          });
           await this.updateBudget(gain, "add");
           await this.updateNotifications(gain, "success");
        }else if(verifList.length === 5 && verifDisk.length === 1){
          let gain = selectedMise*300;
          this.setState({
            textMessage: new TextMessage(globalTexts.gain(gain), 'green','crown')
          });
          await this.updateBudget(gain, "add");
          await this.updateNotifications(gain, "success");
        }else{
          let gain = selectedMise*verifList.length
          this.setState({
            textMessage: new TextMessage(globalTexts.gain(gain), 'green','moneybag')
          });
          await this.updateBudget(gain, "add");
          await this.updateNotifications(gain, "success");
        }
      }
    }

    this.setState({
      listFlags,
      listChosenEmoji
    })
  }
  async updateNewNotifs(){
    let newNotifs = await AsyncStorage.getItem("newNotifs");
    if(newNotifs){
      newNotifs = JSON.parse(newNotifs);
      newNotifs += 1;
      await AsyncStorage.setItem("newNotifs", JSON.stringify(newNotifs));
    }
  }
  shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  verifyGift = async () => {
    let {attemptNumber, selectedMise, listFlags, listOfRandomEmoji} = this.state;
    let bonus = selectedMise > 3 ? selectedMise/2: selectedMise
    let indexGift = await AsyncStorage.getItem("giftKey");
    indexGift = JSON.parse(indexGift);
    if(attemptNumber >= 1){
      if(indexGift){
        if(parseFloat(indexGift) !== 3){
          this.setState({
            showGiftCards: false,
            attemptNumber: attemptNumber + parseFloat(indexGift)
          })
        }else{
          this.setState({
            showGiftCards: false,
          });
          await this.updateNewNotifs();
          await this.updateNotifications(bonus, "bonus");
          await this.updateBudget(bonus, "add");
        }
      }else{
        this.setState({
          showGiftCards: false,
        })
      }
    }else{
      let firstGoodFlagIndex = 0;
      for (let i = 0; i < listOfRandomEmoji.length; i++){
        if(listOfRandomEmoji[i] !== 'flag-cd' && listOfRandomEmoji[i] !== 'dvd' &&
          listFlags[i].emoji === 'soccer'){
          firstGoodFlagIndex = i;
          break;
        }
      }
      //console.log(firstGoodFlagIndex);
      if(indexGift && parseFloat(indexGift) !== 3){
        this.setState({
          showGiftCards: false,
          attemptNumber: attemptNumber + parseFloat(indexGift)
        })
      }else if(indexGift && parseFloat(indexGift) === 3){
        this.setState({
          showGiftCards: false,
          attemptNumber: attemptNumber + 1
        });
        await this.revealEmoji(firstGoodFlagIndex);
        await this.updateNewNotifs();
        await this.updateNotifications(bonus, "bonus");
        await this.updateBudget(bonus, "add");
      }else{
        this.setState({
          showGiftCards: false,
          attemptNumber: attemptNumber + 1
        });
        this.revealEmoji(firstGoodFlagIndex);
      }
    }

  }

  addAttempt = () => {
    let {attemptNumber} = this.state;
    this.setState({
      attemptNumber
    })
  }

  componentDidMount() {
    this.animate();
  }
  componentWillUnmount() {
    // A very good way to stop the animation
    this.animatedCongrats.setValue(0);
    this.rotatingDisk.setValue(0);
  }

  boost = () => {
    let{listOfRandomEmoji, listFlags, attemptNumber} = this.state
    let firstGoodFlagIndex = 0;
    let listOfNeigbors = [];
    for (let i = 0; i < listOfRandomEmoji.length; i++){
      if(listOfRandomEmoji[i] === 'flag-cd' && listFlags[i].emoji === 'soccer'){
        firstGoodFlagIndex = i;
        break;
      }
    }
    if(firstGoodFlagIndex === 0){
      //console.log("here")
      listOfNeigbors = this.createNeighborsList(firstGoodFlagIndex + 7);
    }else if(firstGoodFlagIndex > 0 && firstGoodFlagIndex < 5){
      listOfNeigbors = this.createNeighborsList(firstGoodFlagIndex + 6);
    }else if(firstGoodFlagIndex === 5){
      listOfNeigbors = this.createNeighborsList(firstGoodFlagIndex + 5);
    }else if(firstGoodFlagIndex % 6 === 0 && firstGoodFlagIndex !== 36){
      listOfNeigbors = this.createNeighborsList(firstGoodFlagIndex + 1);
    }else if (firstGoodFlagIndex === 36){
      listOfNeigbors = this.createNeighborsList(firstGoodFlagIndex - 5);
    }else if (firstGoodFlagIndex >= 37 && firstGoodFlagIndex !== 41){
      listOfNeigbors = this.createNeighborsList(firstGoodFlagIndex - 6);
    }else if (firstGoodFlagIndex === 41){
      listOfNeigbors = this.createNeighborsList(firstGoodFlagIndex - 7);
    }else{
      let listOftPrimeNum = [];
      for(let i = 11; i < 35; i += 6){
        listOftPrimeNum.push(i);
      }
      if(listOftPrimeNum.indexOf(firstGoodFlagIndex) !== -1){
        listOfNeigbors = this.createNeighborsList(firstGoodFlagIndex - 1);
      }else{
        listOfNeigbors = this.createNeighborsList(firstGoodFlagIndex);
      }
    }
    listOfNeigbors.forEach(element => listFlags[element].color = 'red');
    this.setState({
      listOfNeigbors,
      attemptNumber: attemptNumber - 2,
      boostActivated: true
    })

    setTimeout(() => {
      listOfNeigbors.forEach(element => listFlags[element].color = 'rgba(0, 25, 100, 0)');
      this.setState({
        listOfNeigbors
      })
    }, 5000)
    //console.log(listOfNeigbors)
  }


  createNeighborsList(index){

    let listOfNeigbors = [];
    //listOfNeigbors.push(index);
    for(let i = 7; i >= 5; i--){
      listOfNeigbors.push(index - i);
    }
    for (let i = -1; i <= 1; i++){
      listOfNeigbors.push(index - i);
    }
    for(let i = 7; i >= 5; i--){
      listOfNeigbors.push(index + i);
    }
    //console.log(listOfNeigbors);
    return listOfNeigbors;
  }


  setCongratTextList = () =>{
    let{congratTextList, congratEmojiList, congratText, congratEmoji} = this.state;
    const r = Math.floor(Math.random() * 5);
    congratText = congratTextList[r];
    congratEmoji = congratEmojiList[r]
    this.setState({
      congratText: congratText,
      congratEmoji: congratEmoji
    })
  }

  render() {
    let {listFlags, attemptNumber,
      beginGame, listMise, selectedMise, openResultModal,
      textMessage, boostActivated, openRulesModal, showGiftCards} = this.state;
    const rotation = this.movingStadium.interpolate({
      inputRange: [0, 1],
      outputRange: ['80deg', '30deg'],
    });
    let showFlags = listFlags.map((flag, index) =>
      <TouchableOpacity key={index} onPress={() => this.revealEmoji(index)} disabled={!beginGame}>
          <View style={{...styles.roundedDigitContainer, backgroundColor: flag.color}}>
            <Emoji name={flag.emoji} style={{fontSize: carre -15}}/>
          </View>
      </TouchableOpacity>
    )
    return (
      <View style={styles.container}>
        <View style={{flexDirection: 'row',
          backgroundColor: 'black',
          position: 'absolute',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: 0.8,
          width: deviceWidth}}>
          <Text style={{color: 'white', fontStyle : 'italic', marginRight: 6}}>
            Trouvez les 5 drapeaux
          </Text>
          <Emoji name="flag-cd" style={{fontSize: 16, marginRight: 3}}/>
          <Text style={{color: 'white', fontStyle : 'italic', marginRight: 2}}>
            et 1 disque
          </Text>
          <Emoji name="dvd" style={{fontSize: 16}}/>
        </View>
        {(beginGame && !showGiftCards) &&
        <View style = {{flexDirection: 'row',
          marginTop: 30,
          width: deviceWidth,
          position: 'absolute', alignItems: 'center', justifyContent: 'center', zIndex: 2}}>
          <Text style = {{color: attemptNumber > 1? 'black': 'red',
            fontSize: 17,
            fontStyle: 'italic',
            fontWeight: 'bold',}}>
            {attemptNumber > 1? <Emoji name="arrows_counterclockwise" style={{fontSize: 25}}/>:
              attemptNumber === 1? "Dernier coup !": "Partie terminée"}
          </Text>
          <Text style={{color: attemptNumber >= 4? 'green': 'red', fontWeight: 'bold', fontSize: 25}}>
            {attemptNumber > 1? " : " + attemptNumber: ""}
          </Text>
          {(beginGame && attemptNumber >= 3) &&
          <TouchableOpacity
            style={{...styles.boostContainer, opacity: boostActivated? 0.4 : 1}}
            disabled ={boostActivated}
            onPress={() => this.boost()}>
              <Text>Boost</Text>
          </TouchableOpacity>}
        </View>}
        {!beginGame &&
        <View style={{borderRadius: 20, flex: 1, position: 'absolute', marginTop: 30, zIndex: 1}}>
          <TouchableOpacity
            style={{color: 'white', marginLeft: 5, flexDirection: 'row'}}
            onPress={() => this.setState({openRulesModal: true})}>
            <Text style={{color: 'blue', fontStyle: 'italic', fontWeight: 'bold', fontSize: 20}}>
              Comment jouer ?
            </Text>
            <Emoji name="information_source" style={{fontSize: 18, color: 'white'}}/>
          </TouchableOpacity>
        </View>}
        <View>
        </View>
        <AImageBackground
          resizeMode={'contain'}
          style={{flex: 1, alignItems: 'center'}}
          source={require('./MagicFive/martyrs.jpg')}>
          <View style={styles.innerContainer}>
            {this.state.showGiftCards &&
            <Text style = {{color: 'red', margin: 5}}>
              Choisissez une carte avant la fin du chrono
            </Text>}
            {this.state.showGiftCards &&
            <CountDown
              id={this.state.countId.toString()}
              until={9}
              onFinish={() => this.verifyGift()}
              onPress={() => console.log('gift')}
              size={13}
              timeToShow={['M', 'S']}
              timeLabels={{m: 'Minutes', s: 'Secondes'}}
              running={this.state.showGiftCards}
            />}
            {!showGiftCards &&
            <AImageBackground
              resizeMode={'cover'}
              style={{...styles.imgbcg, transform: [{rotateX: rotation}]}}
              source={require('./MagicFive/rouge.jpeg')}>
              <View style={{
                ...styles.flagsBoardContainer,
                transform: [{rotateX: "0deg"}]
              }}
                    pointerEvents={!this.state.showGiftCards ? "auto" : "none"}>
                {showFlags}
              </View>
            </AImageBackground>}
            <View pointerEvents ={beginGame? 'none' : 'auto'}
                  style={{flexDirection: 'row',
                    backgroundColor: "black",
                  alignItems: 'center',
                  justifyContent: 'center',
                    marginTop: deviceHeight/1.9,
                    position: 'absolute',
                  opacity: 0.9}}>
              <View style = {{flex: 2, marginLeft: 5}}>
                <CustomSelect
                  title={globalTexts.MISE}
                  list={listMise}
                  option={selectedMise}
                  handleSelectChange={(value) => this.setState({selectedMise: value})}
                />
              </View>
              <View style = {{flex: 1, marginRight: 5}}>
                <Button title="Lancer"  onPress={() => this.generateGameEmoji()} disabled={beginGame}/>
              </View>
            </View>
          </View>
          {this.state.displayCongrat &&
          <Animated.View style={{...styles.congratContainer, marginTop: this.animatedCongrats}}>
            <Text style={{color: 'orange', fontSize: 20}}>{this.state.congratText}</Text>
            <Emoji name={this.state.congratEmoji} style={{fontSize: 20}}/>
          </Animated.View>}
          {this.state.displayPlusOne &&
          <Animated.View style={{
            ...styles.congratContainer,
            transform: [{rotateZ: "45deg"}], marginTop: this.animatedCongrats
          }}>
            <Emoji name="dvd" style={{fontSize: 25}}/>
            <Text style={{color: 'green', fontSize: 20}}>+1 coup</Text>
          </Animated.View>}
          {this.state.showGiftCards && <View style={{position: "absolute"}}>
            <ListGiftCards
              giftList={(this.shuffle(this.state.giftList))}
            />
          </View>}
          <DialogMessage
            openResultModal = {openResultModal}
            textMessage ={textMessage}
            onTouchOutside = {() => this.setState({openResultModal: false})}
          />
          <DialogRules
            openRulesModal={openRulesModal}
            onTouchOutside = {() => this.setState({openRulesModal: false})}
            charts = {{rules: FLAG_PICK_RULES, jackpot: FLAG_PICK_GAIN}}
          />
        </AImageBackground>
      </View>
    );
  }

}
let beginAnim = true;
const carre = 40;
const margin = 1.5
const elemByRow = 7;
const elemByColumn = 6;
const offset = carre + 2;
const paddingTop = offset/4
const tableHeight = elemByColumn*(carre + margin) - margin + offset
const tableWidth = elemByRow*(carre + margin) - margin + offset
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
    zIndex: 1
  },
  innerContainer: {
    //backgroundColor: 'rgba(0, 0, 0, 255)',
    margin: 30,
    flexDirection: 'column',

    alignItems: 'center',
    borderRadius: 20
  },
  linearGradient: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5
  },
  flagsBoardContainer: {
    flexWrap: 'wrap',
    //borderWidth: 1,
    height: tableHeight,
    width: tableWidth,
    padding: paddingTop,
    //borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 30,
  },
  roundedDigitContainer: {
    height: carre,
    width: carre,
    borderRadius: 5,
    //backgroundColor: 'rgba(0, 25, 100, 0)',
    alignItems: 'center',
    margin: 1.5,
    borderColor: 'orange',
    justifyContent: 'center',
  },
  congratContainer: {
    backgroundColor: 'rgba(111, 10, 40, 0.8)',
   /* height: 40,
    width: 40,*/
    borderRadius: 10,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imgbcg: {
    //flex: 1,
    //resizeMode: "stretch",
    //flexWrap: 'wrap',
    //borderWidth: 1,
    height: tableHeight,
    width: tableWidth,
    //padding: paddingTop,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10
  },
  text: {
    color: "grey",
    fontSize: 30,
    fontWeight: "bold"
  },
  boostContainer: {
    height: 50,
    width: 50,
    borderRadius: 25,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 36,
    backgroundColor: 'violet',
    opacity: 1,
  }

})

