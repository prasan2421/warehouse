import React, { Component } from "react";
import { TouchableHighlight, TouchableOpacity, TouchableNativeFeedback, TouchableWithoutFeedback,
    View,
    ScrollView,
    Text,
    AsyncStorage,
    Button,
    Alert,
    StyleSheet,
    SafeAreaView,
    TextInput,
    Platform,
    FlatList,
    RefreshControl,
    ActivityIndicator,
    StatusBar,
    Dimensions,
    Image
} from "react-native";
import { UtilityThemeProvider,Box,} from 'react-native-design-utility';
import {images} from "../../src/constants/images";

import Icon from 'react-native-vector-icons/Ionicons'

import {createMaterialTopTabNavigator, createTabNavigator} from 'react-navigation'

class New extends Component{


        render() {
                return (
                        <View style={styles.container} >
                           <Text>dasdasd</Text>

                        </View>
          );
    }
}

class Pending extends Component{


    render() {
        return (
            <View style={styles.container} >
                <Text>hsagsdha</Text>

            </View>
        );
    }
}

export default createMaterialTopTabNavigator({
    New:{screen:New
    },
    Pending:{screen:Pending}
},{
    tabBarOptions: {
        activeTintColor: '#000000',
        inactiveTintColor: '#333333',

        style: {
            fontWeight:"bold",
            backgroundColor: '#fff',
            elevation:0,
        },
        indicatorStyle:{
            height:4,
            backgroundColor:'#ff4b98',
        }
    },

});



const styles = StyleSheet.create({

    container: {

        flex: 1,
        marginTop: 5,
        justifyContent:'center',
        alignItems:'center'
    },
    button: {
        marginBottom: 30,
        width: 260,
        alignItems: 'center',
        backgroundColor: '#2196F3'
    },
    buttonText: {
        padding: 20,
        color: 'white'
    },
    heading:{
        padding: 20,

        color: '#ff4b98'
    }
});