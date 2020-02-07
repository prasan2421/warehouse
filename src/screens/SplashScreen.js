import React, { Component} from 'react';
import {AsyncComponent,AsyncStorage, Alert,Dimensions,Image,View,Text} from 'react-native';
// import {Box,Text } from 'react-native-design-utility';
import {images} from '../constants/images';
import OnboardingLogo from '../commons/OnboardingLogo';



class SplashScreen extends Component{
    state = { };
    /*_retrieveData = async () => {
        try {
            const value = await AsyncStorage.getItem('user');
            if (value !== null) {
                // We have data!!
                this.props.navigation.navigate('navTabs');
            }
            else{
                this.props.navigation.navigate('Auth');
            }
        } catch (error) {
            // Error retrieving data
        }
    };*/

    componentDidMount(){
        this.checkAuth()
    }
    checkAuth = () => {
        setTimeout(() => {
         // this._retrieveData()
            AsyncStorage.getItem('role')
                .then((value)=>{
                    if (value == 'baker') {
                        // We have data!!
                        // alert('hghgh');
                        this.props.navigation.navigate('navTabs');
                    }
                    else if(value == 'bride') {
                        this.props.navigation.navigate('navTabsBride');
                    }
                    else{

                        this.props.navigation.navigate('Auth');
                    }
                })
        },2000);

    };
    render(){
        const logoWidth = Dimensions.get('window').width * 0.4;
        const logoHeight = logoWidth * 0.9;

        const imsLogoWidth = Dimensions.get('window').width * 0.4;
        const imsLogoHeight = imsLogoWidth * 0.75;

        return(
            <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'#fff'}}>
                <Image 
                    source={require('../../assets/logo.png')}
                    style={{
                        width: logoWidth,
                        height: logoHeight,
                        resizeMode: 'contain',
                        marginBottom: 10
                    }}
                />
                <Text style={{fontWeight:'bold',fontSize:30,marginBottom:50,textAlign:'center'}}>Warehouse App</Text>
                <Image 
                    source={require('../../assets/ims-logo.png')}
                    style={{
                        width: imsLogoWidth,
                        height: imsLogoHeight,
                        resizeMode: 'contain'
                    }}
                />
                {/*<Text>WeddingCake</Text>*/}
            </View>
        );
    }
}
export default SplashScreen;