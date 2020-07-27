import React, {Component} from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import LotoGame from "./components/LotoGame";
import ListGameBoxes from "./components/ListGameBoxes";
import { createStackNavigator } from '@react-navigation/stack';
import GameScreen from "./components/GameScreen";
import Profile from "./components/ProfileStack/Profile";
import Paypal from "./components/ProfileStack/Paypal";
import Notifications from "./components/MagicFive/UpdatesStack/Notifications";
import { Icon,  Avatar, Badge, withBadge } from 'react-native-elements'
import AsyncStorage from "@react-native-community/async-storage"
import HeaderImage from "./HeaderImage";

function Feed() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Feed!</Text>
    </View>
  );
}


const Tab = createMaterialBottomTabNavigator();
const Stack = createStackNavigator();

function NotifSack(){
  return (
    <Stack.Navigator initialRouteName="Activités">
      <Stack.Screen
        name={"Notifications"}
        component = {Notifications}
      />
    </Stack.Navigator>
  )
}

function GameStack (){
  return (
    <Stack.Navigator initialRouteName="Feed">
      <Stack.Screen
        name={"GamesTime"}
        component = {ListGameBoxes}
        options={{ headerStyle: {
            backgroundColor: 'white',
            opacity: 0.8,
          },
        headerLeft: () => <HeaderImage/>,
          headerTitleStyle: {
            fontWeight: 'bold',
            fontStyle: 'italic',
          },
        }}
      />
      <Stack.Screen
        name={"Games"}
        component = {GameScreen}
        options={({ route }) => ({ title: route.params.title ,
          headerStyle: {
            backgroundColor: 'white',
          },
        })}
      />
    </Stack.Navigator>
  )
}

function ProfileStack() {
  return (
    <Stack.Navigator initialRouteName="Profile">
      <Stack.Screen
        name={"Profil"}
        component = {Profile}
        options = {{tabBarVisible: false, headerLeft: null}}/>
      <Stack.Screen name={"Paypal"} component = {Paypal} options = {{tabBarVisible: false, headerLeft: null}}/>
    </Stack.Navigator>
  )
}

class MyTabs extends Component{
  constructor(props) {
    super(props);
    this.state = {
      badgeNumber: 0
    }
    this._isMounted = false;
  }
  verifyBadgeNumber = async () => {
    let newNotifs = await AsyncStorage.getItem("newNotifs");
    if(newNotifs){
      this.setState({
        badgeNumber: newNotifs
      })
    }
  }

  async componentDidMount() {
    this._isMounted = true;
    this._isMounted && await this.verifyBadgeNumber();
  }
  async componentDidUpdate(){
    this._isMounted = true;
    this._isMounted && await this.verifyBadgeNumber();
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  render() {
    return (
      <Tab.Navigator
        initialRouteName="Feed"
        activeColor="red"
        labelStyle={{ fontSize: 12 }}
        style={{ backgroundColor: 'tomato' }}
        barStyle={{ backgroundColor: 'white', borderTopWidth: 0.5}}
      >
        <Tab.Screen
          name="Feed"
          component={GameStack}
          options={{
            tabBarLabel: 'Jeux',
            tabBarIcon: ({ color }) => (
              <View>
                <MaterialCommunityIcons name="gamepad" color={color} size={26} />
              </View>
            ),

          }}
        />
        <Tab.Screen
          name="Activités"
          component={NotifSack}
          options={{
            tabBarLabel: 'Notifications',
            tabBarIcon: ({ color }) => (
              <View>
                <MaterialCommunityIcons name="bell" color={color} size={26}/>
                {this.state.badgeNumber > 0 &&
                <Badge
                  status="error"
                  value={this.state.badgeNumber <= 9? this.state.badgeNumber: "+"}
                  //style={{height: 4, width: 4,  top: 10, right: 10}}
                  containerStyle={{position: 'absolute', top: 0, right: -4, height: 10, width: 10}}
                />}
              </View>
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileStack}
          options={{
            tabBarLabel: 'Profile',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="face" color={color} size={26} />
            ),
          }}
        />
      </Tab.Navigator>
    );
  }

}

export function Routing() {
  return (
    <NavigationContainer>
      <MyTabs />
    </NavigationContainer>
  );
}
const styles = StyleSheet.create({

})
