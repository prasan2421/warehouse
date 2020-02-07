import React, {Component} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import { UtilityThemeProvider,Box,Text } from 'react-native-design-utility';
import {images} from "../constants/images";

const OnboardingLogo = () => (
    <View style={styles.container}>
        <View style={styles.box}>
            <Image style={{height:140,width:150}} source={images.logo}/>
        </View>

    </View>
    );


export default OnboardingLogo;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },


    box:{
        flex: 1,
        flexDirection: 'column',
        width:'90%',
        alignItems:'center',
        justifyContent: 'center',

    },

    containerBox:{
        padding: 10,
        paddingBottom:20,
        paddingTop:20,
        position:'absolute',
        top:'30%',
        justifyContent:'center',
        width: '90%',
        backgroundColor: '#fff',
        elevation: 4,
        shadowOffset: { width: 5, height: 5 },
        shadowColor: 'black',
        shadowOpacity: 0.8,
        shadowRadius:10,
    },
    inputIcon:{
        width:30,
        height:30,
        marginLeft:15,

        alignSelf: 'flex-end'
    },
    buttonContainer: {
        height:60,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom:20,
        width:200,

    },
    loginButton: {
        position: 'absolute',
        top:0,
        left:0,
        backgroundColor: "#ff4b98",
    },
    forgotText:{
        position: 'absolute',
        bottom:20,



    },
    loginText: {
        color: 'white',
    },

});
