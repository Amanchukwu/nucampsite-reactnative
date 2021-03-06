import React, { Component } from 'react';
import Home from './HomeComponent';
import Directory from './DirectoryComponent';
import CampsiteInfo from './CampsiteInfoComponent';
import { View, Platform } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { createAppContainer } from 'react-navigation';

const DirectoryNavigator = createStackNavigator( // createStackNavigator is a Function that has one requred argument called the route-configs-object which is where we set what components will be available for the stack. We will set it to Directory and CampsiteInfo
    {
        Directory: { screen: Directory },
        CampsiteInfo: { screen: CampsiteInfo }
    }, 
    { //Optional second argument
        initialRouteName: 'Directory', //When the navigator is open, it will default to showing "Directory" component
        defaultNavigationOptions: { //Configure settings for the header
            headerStyle: {
                backgroundColor: '#5637DD'
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                color: '#fff'
            }
        }
    }
);

const HomeNavigator = createStackNavigator(
    {
        Home: { screen: Home }
    },
    {
        defaultNavigationOptions: {
            headerStyle: {
                backgroundColor: '#5637DD'
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                color: '#fff'
            }
        }
    }
);

const MainNavigator = createDrawerNavigator( //Needs an object that contains the screens that will be in the drawer for first object, can take optional second argument
    {
        Home: { screen: HomeNavigator },
        Directory: { screen: DirectoryNavigator }
    },
    {
        drawerBackgroundColor: '#CEC8FF'
    }
);

const AppNavigator = createAppContainer(MainNavigator); //Stack navigator needs to be passed to the imported function "createAppContainer". Will return a react component that connects top level navigator to the react native application environment.

class Main extends Component {
    render() {
        return (
            <View
                style={{
                    flex: 1,
                    paddingTop: Platform.OS === 'ios' ? 0 : Expo.Constants.statusBarHeight //Patform gets the operating system and allows us to use a tertinary operator to set different padding top for IOS
            }}>
                <AppNavigator />
            </View> // NOTE FOR LINE 37: container for the DirectoryNavigator which contains the screens for both the DirectoryComponent and CampsiteInfoComponent
        );
    }
}

export default Main;