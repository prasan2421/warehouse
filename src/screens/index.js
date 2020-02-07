import {createStackNavigator,createSwitchNavigator,createAppContainer } from 'react-navigation'
import React, {Component} from 'react';
// import { Box,} from 'react-native-design-utility';

import {Image,Text,View,TouchableOpacity} from 'react-native';
import navTabs from "./AppBaker.js";
import navTabsBride from "./AppBride.js";
import Icon from 'react-native-vector-icons/Ionicons'
import SigninBride from "./SigninBride";
import SignupBride from "./SignupBride";
import Ip from "./ip";
import SigninBaker from "./SigninBaker";
import SignupBaker from "./SignupBaker";
import SignupBakerSubmitted from "./SignupBakerSubmitted";
import SignupBrideSubmitted from "./SignupBrideSubmitted";
import LoginScreen from "./LoginScreen";
import ForgotPassword from "./ForgotPassword";
import BakerForm from "./BakerForm";
import BrideForm from "./BrideForm";
import PasswordResetBride from "./PasswordResetBride";
import PasswordResetBaker from "./PasswordResetBaker";


const AuthNavigator = createStackNavigator(
    {
        Login: {screen:LoginScreen,
            navigationOptions: {
                header: null,
            }} ,
        ForgotPassword: {screen:ForgotPassword,
            navigationOptions: {
                header: null,
            }} ,
            Ip: {screen:Ip,
            navigationOptions: {
                header: null,
            }} ,

        signinBride: {screen:SigninBride,navigationOptions: {
                topBarElevationShadowEnabled: false,
                headerStyle:{height:90, backgroundColor: '#f9f9f9',
                    elevation: 0,
                }

            }} ,
        signupBride: {screen:SignupBride,navigationOptions: {
                topBarElevationShadowEnabled: false,

                headerStyle:{height:90, backgroundColor: '#f9f9f9',
                    elevation: 0,
                }

            }} ,



        signinBaker: {screen:SigninBaker,navigationOptions: {

                topBarElevationShadowEnabled: false,

                headerStyle:{height:90, backgroundColor: '#f9f9f9',
                    elevation: 0,
                }}
                } ,
        signupBaker: {screen:SignupBaker,navigationOptions: {
                topBarElevationShadowEnabled: false,

                headerStyle:{height:90, backgroundColor: '#f9f9f9',
                    elevation: 0,
                }

            }} ,
        signupBakerSubmitted: {screen:SignupBakerSubmitted,navigationOptions: {
                header: null,
            }} ,
        signupBrideSubmitted: {screen:SignupBrideSubmitted,navigationOptions: {
                header: null,
            }} ,
        BakerForm: {screen:BakerForm,navigationOptions: {
                topBarElevationShadowEnabled: false,
headerTitle:<Text style={{color:'#ff4b98', textAlign:'center'}}>New Baker Application</Text>,
                headerStyle:{height:90, backgroundColor: '#f9f9f9',
                    elevation: 0,
                }

            }} ,
        BrideForm: {screen:BrideForm,navigationOptions: {
                topBarElevationShadowEnabled: false,
                headerTitle:<Text style={{color:'#ff4b98', textAlign:'center'}}>New Bride Application</Text>,
                headerStyle:{height:90, backgroundColor: '#f9f9f9',
                    elevation: 0,
                }
            }} ,
        PasswordResetBride: {screen:PasswordResetBride,navigationOptions: {
                topBarElevationShadowEnabled: false,
                headerTitle:<Text style={{color:'#ff4b98', textAlign:'center'}}>Reset Bride Password</Text>,
                headerStyle:{height:90, backgroundColor: '#f9f9f9',
                    elevation: 0,
                }
            }} ,
        PasswordResetBaker: {screen:PasswordResetBaker,navigationOptions: {
                topBarElevationShadowEnabled: false,
                headerTitle:<Text style={{color:'#ff4b98', textAlign:'center'}}>Reset Baker Password</Text>,
                headerStyle:{height:90, backgroundColor: '#f9f9f9',
                    elevation: 0,
                }
            }} ,
    });



const BakerNavigator =  createStackNavigator({

    navTabs: {screen:navTabs,navigationOptions: {
            header: null,
        }
    } ,

    });
const BrideNavigator =  createStackNavigator({

    navTabsBride: {screen:navTabsBride,navigationOptions: {
            header: null,
        }
    } ,


});

const AppNavigator =  createSwitchNavigator(
    {
        Splash: {
            getScreen: () => require('./SplashScreen').default,

        },
        Auth: AuthNavigator,
        Baker:BakerNavigator,
        Bride:BrideNavigator


    },{
initialRouteName: 'Splash',
    });
const AppContainer = createAppContainer(AppNavigator);


class Navigation extends React.Component{
    state = {};
    render(){
        return <AppContainer/>
    }
}

export default Navigation;