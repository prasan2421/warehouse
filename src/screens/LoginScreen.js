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
    StyleSheet, AsyncStorage, Keyboard,Text,Picker
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import ActivityIcon from "../commons/ActivityIcon";
import DeviceInfo from 'react-native-device-info';
import ErrorText from '../commons/ErrorText';

import {images} from "../constants/images";

class LoginScreen extends Component{
    constructor(props) {
        super(props);
        this.state = {
            ip:'',
            warehouse:'',
            dataBranch:[],
            dataWarehouse:[],
            branch:'',
            isLoading: false,
            username   : '',
            password: '',
            usernameError: '',
            passwordError: '',
            opacity: new Animated.Value(0),
            position: new Animated.Value(0),
        }
    }
    componentDidMount(){
        this.focusListener = this.props.navigation.addListener('didFocus', () => {
            const action = this.props.navigation.getParam('action', '');
            // alert('action ' + action);
            if(action == 'refresh') {
                // alert('refreshed');
                 this.EmptyData();
       
            }

            this.props.navigation.setParams({action: ''});
        });
        this.opacityAnim();
        this.positionAnim();
         this.getFromAsyncStorage();
       

    }
    
    componentWillUnmount() {
        this.focusListener.remove();
    }
    
    EmptyData(){
        this.setState({
            dataBranch:[]
        })
        this.getFromAsyncStorage();
    }

    getFromAsyncStorage = async () => {
        const ipadd = await AsyncStorage.getItem('ip');

        if(ipadd) {
            this.setState({
                ip:ipadd
            },
            this.getDivisionFromAsyncStorage)
           
        }
        else{
            alert('IP address is empty!')
        }
        
        
    };


    login = () => {
        let username = this.state.username.trim();
        let password = this.state.password;
        let usernameError = '';
        let passwordError = '';

        if(username==""){

            usernameError = 'Please fill the username';

        }

        if(password==""){
            passwordError = 'Please fill the password';
        }


        this.setState({
            usernameError: usernameError,
            passwordError: passwordError
        });

        if(usernameError ||  passwordError) {
            return;
        }
        this.showLoader();
        fetch(this.state.ip+'/warehouse/api/Checkuser',{
            method:'POST',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json',
            },
            body: JSON.stringify({
                UserName: this.state.username,
                Password: this.state.password,
            })
        })
            .then((response)=> response.json())


            .then ((responseJson) => {

                    if(responseJson.status == "ok"){
                        this.saveToAsyncStorage(responseJson.data);
                    }
                    else{
                        alert('User does not not exist');
                        this.hideLoader();
                    }
            })
            .done();

    };

    saveToAsyncStorage = async (data) => {
        const serialNumber = DeviceInfo.getSerialNumber();
        await AsyncStorage.multiSet([
            ['role', 'bride'],
            ['Branch',this.state.branch],
            ['Warehouse',this.state.warehouse],
            // ['Device','abcd'],
            ['Device',serialNumber],
        ]);
        this.props.navigation.navigate('navTabsBride');
    };

    getDivisionFromAsyncStorage = async () => {
       
this.showLoader();
        this.setState({refreshing: true});
        const access_token = await AsyncStorage.getItem('access_token');

        this.setState({access_token: access_token});
        fetch(this.state.ip+'/warehouse/api/GetDivisionList', {
            // headers: {
            //     Authorization: 'Bearer ' + access_token
            // }
        })
            .then((response) => response.json())
            .then((responseJson) => {
                if(responseJson.status=='error') {
                    this.hideLoader();
                    this.setState({refreshing: false});
                    alert(responseJson.result.Message);
                }
                else{
                    this.hideLoader();
                    this.setState({
                        refreshing: false,
                        dataBranch: responseJson.result,
                    })
                }

            })
            .catch((error) => {
                // console.error(error);
                this.hideLoader();
                this.setState({refreshing: false});
                alert('An error occurred (Incorrect IP address)');
            })
            
        

    }
    getWarehouseFromAsyncStorage = async () => {
        if(!this.state.branch) {
            return;
        }

        this.showLoader();
        this.setState({refreshing: true}); 
        const access_token = await AsyncStorage.getItem('access_token');

        this.setState({access_token: access_token});
        fetch(this.state.ip+'/warehouse/api/GetWarehouselist/'+this.state.branch, {
            // headers: {
            //     // Authorization: 'Bearer ' + access_token
            // }
        })
            .then((response) => response.json())
            .then((responseJson) => {
                if(responseJson.status=='error') {
                    this.hideLoader();
                    this.setState({refreshing: false});
                    alert(responseJson.result.Message);
                }
                else{
                    this.hideLoader();
                    this.setState({
                        refreshing: false,
                        dataWarehouse: responseJson.result,
                    })
                }

            })
            .catch((error) => {
                this.hideLoader();
                this.setState({refreshing: false});
                alert('An error occurred');
            })

    }

    showLoader = () => {
        this.setState({ isLoading: true });
    };

    hideLoader = () => {
        this.setState({ isLoading: false });
    };

    opacityAnim=() =>{
        Animated.timing(this.state.opacity,{
            toValue:1,
            duration:200
        }).start()
    };

    positionAnim=() =>{
        Animated.timing(this.state.position,{
            toValue:1,
            duration:300,
            useNativeDriver:true,
        }).start()
    };


    render(){
        const logoTranslate = this.state.position.interpolate({
            inputRange:[0,1],
            outputRange:[345,10],
        });

        return(
            <View style={styles.wrapper}>
                <StatusBar
                    barStyle="dark-content"
                    backgroundColor='white'
                />
                <Animated.View style={{
                    alignItems:'center',
                    transform:[
                        {
                            translateY:logoTranslate,
                        }
                    ]}}>

                    <View style={{alignItems:'center',position: 'relative',width:'80%',marginTop:20}} >
                   
                        <View>
                            <Text style={{fontWeight:'bold',fontSize:30,marginBottom:20}}>Warehouse</Text>
                            
                        </View>

                            <TouchableHighlight
                                style={{position:'absolute',right:0,top:0}}
                                onPress={()=>this.props.navigation.navigate('Ip')}>
                                <Icon name="md-cog"  size={22} style={{ padding: 10 }} />
                            </TouchableHighlight>

                    </View>
                    <View style={styles.container}>
                        <View style={styles.containerInside}>
                        
                            <View style={{marginBottom:30}}>
                            
                                <View style={styles.inputContainer}>
                                    <Picker
                                        selectedValue={this.state.branch}
                                        style={{}}
                                        onValueChange={(itemValue, itemIndex) =>
                                            this.setState({branch: itemValue, warehouse: ''}, () => {
                                                this.getWarehouseFromAsyncStorage()
                                            })
                                        }>
                                        <Picker.Item label="Select a Branch/Division" value="" />
                                        {this.state.dataBranch.map(item => (<Picker.Item key={'' + item.id} label={item.name} value={item.initial} />))}
                                    </Picker>
                                </View>
                            </View>
                            <View style={{marginBottom:30}}>
                                <View style={styles.inputContainer}>
                                    <Picker
                                        selectedValue={this.state.warehouse}
                                        style={{}}
                                        onValueChange={(itemValue, itemIndex) =>
                                            this.setState({warehouse: itemValue})

                                        }>
                                        <Picker.Item label="Select a warehouse" value="" />
                                        {this.state.dataWarehouse.map(item => (<Picker.Item key={'' + item.id} label={item.name} value={item.division} />))}

                                    </Picker>
                                </View>
                            </View>
                            <View style={{marginBottom:30}}>
                                <View style={styles.inputContainer}>
                                    <TextInput style={styles.inputs}
                                               placeholder="Enter the username"
                                               returnKeyType='next'
                                               onSubmitEditing={() => this.passwordRef.focus()}
                                               autoCapitalize = 'none'
                                               underlineColorAndroid='transparent'
                                               onChangeText={(username) => this.setState({username})}/>

                                </View>
                                <ErrorText text={this.state.usernameError} />
                            </View>
                            <View style={{marginBottom:30}}>
                                <View style={styles.inputContainer}>
                                    <TextInput style={styles.inputs}
                                               placeholder="Did you read the Code???"
                                               ref={passwordRef => this.passwordRef = passwordRef}
                                               returnKeyType='done'
                                               onSubmitEditing={Keyboard.dismiss}
                                               secureTextEntry={true}
                                               underlineColorAndroid='transparent'
                                               onChangeText={(password) => this.setState({password})}/>

                                </View>
                                <ErrorText text={this.state.passwordError} />
                            </View>
                            <View style={[styles.loginWrapper]}>
                                <TouchableHighlight onPress={this.login} style={styles.loginButton}>
                                    <Text style={styles.loginText}>Log In</Text>
                                </TouchableHighlight>
                            </View>


                        </View>

                    </View>


                </Animated.View>

            </View>
        );
    }
}
export default LoginScreen;
const styles = StyleSheet.create({
    wrapper:{
        flex:1,
         backgroundColor: '#f7f7f7',
    },
    container: {
        justifyContent:'center',
        // elevation:2,
        // shadowOffset: { width: 0, height: 5 },
        // shadowOpacity: 0.1,
        // shadowRadius: 5,
        backgroundColor: '#fff',
        alignItems:'center',
        width:'80%',
        borderRadius:25,
        // borderWidth:2,
        // borderColor:'#efefef'
        // height:'65%'
    },
    containerInside:{
        justifyContent:'center',

        marginTop:40,
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
