import React, {Component} from 'react';

import {
    AppRegistry,
    ImageBackground,
    Dimensions,
    Alert,
    ScrollView,
    Button,
    Image,
    TextInput,
    View,
    TouchableOpacity,
    TouchableHighlight,
    Animated,
    StatusBar,
    StyleSheet, AsyncStorage, Keyboard
} from 'react-native';

import {Text} from 'react-native';
import ActivityIcon from "../commons/ActivityIcon";
import ErrorText from '../commons/ErrorText';

import {images} from "../constants/images";

class LoginScreen extends Component{
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            ip   : '',
           
            ipError: '',
           
            opacity: new Animated.Value(0),
            position: new Animated.Value(0),
        }
    }
    componentDidMount(){
        this.getFromAsyncStorage();
    }

     getFromAsyncStorage = async () => {

        const ipadd = await AsyncStorage.getItem('ip');
        if(ipadd){
          this.setState({
            ip:ipadd
        })  
        }
        
        
    };


    ipSave = () => {
        let ip = this.state.ip.trim();
        let ipError = '';
       
        if(ip==""){
            //alert('please fill the first name');
            // this.setState({emailError: 'please fill the email'});
            ipError = 'Please enter the ip';
    
        }
    
    
        this.setState({
            ipError,
        
        });
    
        if(ipError) {
            return;
        }
        this.showLoader();
        this.saveToAsyncStorage(ip);
    };
    
    saveToAsyncStorage = async (data) => {
        await AsyncStorage.multiSet([
            ['ip', data],
    
        ]);
        Alert.alert('Success','IP address has been set!')
        this.props.navigation.navigate('Login', { action: 'refresh' });
    };
    


    showLoader = () => {
        this.setState({ isLoading: true });
    };

    hideLoader = () => {
        this.setState({ isLoading: false });
    };



    render(){

        return(
                <View style={styles.wrapper}>
                <View style={styles.container}>
    <View style={styles.containerInside}>
<View style={{marginBottom:30}}>
<View style={{marginBottom:10}}><Text style={{textAlign:'center',fontSize:16, fontWeight:'bold'}}>IP address</Text></View>
    <View style={styles.inputContainer}>
    
        <TextInput style={styles.inputs}
                   placeholder="Enter the Ip address"
                   value={this.state.ip}
                   returnKeyType='next'
                   autoCapitalize = 'none'
                   underlineColorAndroid='transparent'
                   onChangeText={(ip) => this.setState({ip})}/>

    </View>
    <ErrorText text={this.state.ipError} />
</View>

    <View style={[styles.loginWrapper]}>
        <TouchableHighlight onPress={this.ipSave} style={styles.loginButton}>
        <Text style={styles.loginText}>Save</Text>
        </TouchableHighlight>
    </View>


    </View>
</View>

                    <TouchableHighlight style={[styles.forgotText]}
                        onPress={() => this.props.navigation.navigate('Login')}
                    >
                        <Text style={{fontSize:16,color:'#9b9b9b'}}>Go back to login screen</Text>

                    </TouchableHighlight>


                </View>
        );
    }
}
export default LoginScreen;
const styles = StyleSheet.create({
    wrapper:{
        flex:1,
         backgroundColor: '#f7f7f7',
        alignItems:'center',
        justifyContent:'center'
    },
    container: {
        justifyContent:'center',
        // elevation:2,
        // shadowOffset: { width: 0, height: 5 },
        // shadowOpacity: 0.1,
        // shadowRadius: 5,
        // backgroundColor: '#e4e4e4',
        alignItems:'center',
        width:'80%',
        borderRadius:25,
        height:'50%',
         backgroundColor: '#fff',
    },
    containerInside:{
        justifyContent:'center',
        marginTop:0,
        marginBottom:40,
       width:'80%',

    },

    inputContainer: {
        borderWidth:1.5,
        borderColor:'#dbdbdb',
        backgroundColor: '#ffffff',

        borderRadius:25,
        height:56,
        justifyContent:'center'
    },


    inputs:{

    },
    inputIcon:{
        marginTop:5,
        width:40,
        height:15,
        marginLeft:15,
        alignSelf: 'flex-end'
    },
    loginWrapper: {
        alignItems:'center',
    },
    loginButton:{
        elevation:5,
        shadowOffset: { width: 1, height: 5 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        paddingTop:17,
        paddingBottom:17,
        paddingLeft:50,
        paddingRight:50,
        borderTopRightRadius:30,
        borderTopLeftRadius:30,
        borderBottomLeftRadius:30,
        backgroundColor:'#4a84ff'
    },

    forgotText:{
        width:'70%',
        alignItems: 'center',
        marginTop:40
    },
    loginText: {
        color: 'white',
    }

});
