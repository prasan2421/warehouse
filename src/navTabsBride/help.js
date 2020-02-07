import React, { Component } from 'react';
import {
    View,
    ScrollView,
    Text,
    AsyncStorage,
    Button,
    TextInput,
    Alert,
    StyleSheet,
    Modal,
    Keyboard,
    FlatList,
    TouchableOpacity,
    Picker,
    RefreshControl,
    TouchableHighlight,
    Dimensions,
    Image,
    ActivityIndicator,
} from 'react-native';
import {createMaterialTopTabNavigator, Header} from 'react-navigation';
import Swiper from 'react-native-swiper';
import ActivityIcon from "../commons/ActivityIcon";
class PickingList extends Component {


    constructor(props) {
        super(props);
        this.state = {


            showPagination:true,
            isLoading: false,

        }
    }

    componentDidMount() {


        this.getIp();


    }


    getIp= async () => {
        if(await AsyncStorage.getItem('ip')){
            this.setState({
                ip:await AsyncStorage.getItem('ip'),
                device:await AsyncStorage.getItem('Device'),
            })
           
        }
        else{
            alert('No IP address!')
        }

    }
    showLoader = () => {
        this.setState({ isLoading: true });
    };
    hideLoader = () => {
        this.setState({ isLoading: false });
    };

    render() {
        return (
            <ScrollView>
                <View style={{marginTop:20,width:'100%',alignItems:'center',}}>

                    <View style={{marginBottom:15,width:'90%'}}>
                        <View  style={{flexDirection:'row',marginBottom:10}}>
                            <Text style={{fontSize:16,color:'#000',fontWeight:'bold',width:100}}>Device ID: </Text>
                            <Text>{this.state.device}</Text>
                        </View>
                        <View  style={{flexDirection:'row'}}>
                        <Text style={{fontSize:16,color:'#000',fontWeight:'bold',width:100}}>Ip address: </Text>
                        <Text>{this.state.ip}</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        );
    }
}



const styles = StyleSheet.create({

    container: {
        flex: 1,
        marginTop: 5,
        justifyContent:'center',
        alignItems:'center'
    },
    inputContainer: {
        flexDirection:'row',
        height:50,
        alignItems:'center'
    },
    inputContainerTopWrapper:{
        flexDirection:'row',
        justifyContent:'space-between'

    },
    inputContainerTopLeft: {
        marginTop:5,
        borderWidth:1.5,
        borderColor:'#dbdbdb',
        backgroundColor: '#ffffff',
        width:'75%',
        borderRadius:10,
        height:50,
        justifyContent:'center'
    },
    inputContainerTopRight: {
        marginTop:5,
        // borderColor:'#dbdbdb',
        backgroundColor: '#3f74db',
        width:'20%',
        borderRadius:10,
        height:50,
        justifyContent:'center',

    },
    nextButton: {
        marginTop:5,
        marginRight:5,
        // borderColor:'#dbdbdb',
        backgroundColor: '#3f74db',
        width:'40%',
        borderRadius:10,
        height:50,
        justifyContent:'center',

    },

});

export default PickingList;