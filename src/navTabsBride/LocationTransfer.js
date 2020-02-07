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

    FlatList,
    TouchableOpacity,
    Picker,
    RefreshControl,
    TouchableHighlight,
    Dimensions,
    Image,
    ActivityIndicator, Keyboard
} from 'react-native';

class New extends Component {


    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
        }
    }


    componentDidMount() {

        // this.getFromAsyncStorage();
    }


    // getFromAsyncStorage = async () => {
    //
    //
    //     const access_token = await AsyncStorage.getItem('access_token');
    //
    //     fetch('http://weddingcake.cyya.com/api/brides/bid-requests?service=select&service_type=free&bid_request_type=new', {
    //         headers: {
    //             Authorization: 'Bearer ' + access_token
    //         }
    //     })
    //     .then((response) => response.json())
    //     .then((responseJson) => {
    //         if(responseJson.errors) {
    //
    //             alert(responseJson.errors);
    //         }
    //         else if(responseJson.data) {
    //
    //         }
    //     })
    //     .catch((error) => {
    //
    //         alert('An error occurred');
    //     })
    //
    // };
    signOutAsync = async (navigation) => {
        await AsyncStorage.clear();
        navigation.navigate('Auth');
    };
    toggle(){
        this.props.navigation.toggleDrawer();
    };
    setModalVisible(visible) {
        this.setState({modalVisible: visible});
    }


    render() {
        return (
            <View style={{flex:1,alignItems:'center'}}>
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                        this.setModalVisible(!this.state.modalVisible);
                    }}>
                    <View style={{flex:1,justifyContent:'center',backgroundColor:'rgba(0, 0, 0, 0.6)',alignItems:'center'}} >
                        <View style={{backgroundColor:'#ffffff',borderRadius:10,width:'70%',overflow:'hidden',alignItems:'center',}}>
                            <View style={{width:'85%',marginTop:10,marginBottom:10}}>
                                <View>
                                    <Text style={{fontSize:18}}>New Order</Text>
                                </View>
                                <View style={{flexDirection:'row',alignItems:'center'}}>
                                    <Text style={{width:'20%'}}>Name</Text>
                                    <View style={{width: '80%',borderBottomWidth:0.5,borderColor:'#000'}}>
                                        <TextInput
                                            // value={item.value}
                                            // onChangeText={text => this.updateValue(index, text)}
                                            // editable={item.checked}
                                            // style={{backgroundColor: item.checked ? '#fff' : '#acacac', color: '#808080', textAlign: 'center'}}
                                        />
                                    </View>
                                </View>
                                <View style={{flexDirection:'row',alignItems:'center'}}>
                                    <Text style={{width:'20%'}}>Status</Text>
                                    <View style={{width: '80%',borderBottomWidth:0.5,borderColor:'#000'}}>
                                        <TextInput/>
                                    </View>
                                </View>
                                <View style={{flexDirection:'row',alignItems:'center'}}>
                                    <Text style={{width:'20%'}}>Date</Text>
                                    <View style={{width: '80%',borderBottomWidth:0.5,borderColor:'#000'}}>
                                        <TextInput/>
                                    </View>
                                </View>

                                <TouchableOpacity
                                    onPress={() => {
                                        this.setModalVisible(!this.state.modalVisible);
                                    }}
                                    style={{marginTop:20,marginBottom:20}}
                                >
                                    <Text style={{fontSize:16,color:'#000',fontWeight:'bold',textAlign:'right'}}>Save</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
                <View style={{width:'85%'}}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        style={{}}>
                        <View style={{marginTop:30}}>
                            <View style={{marginBottom:15}}>
                                <Text style={{fontSize:16,color:'#000',fontWeight:'bold',width:'100%'}}>Trans ID</Text>
                                <View style={styles.inputContainerTopWrapper}>
                                    <View style={styles.inputContainerTopLeft}>
                                        <Picker
                                        selectedValue={this.state.language}
                                        style={{width: '100%'}}
                                        onValueChange={(itemValue, itemIndex) =>
                                            this.setState({language: itemValue})
                                        }>
                                        <Picker.Item label="P01-R1P-75/76" value="P01-R1P-75/76" />
                                        <Picker.Item label="T02-PWP-70/76" value="T02-PWP-70/76" />
                                    </Picker>
                                    </View>

                                    <TouchableOpacity style={styles.inputContainerTopRight} onPress={() => {
                                        this.setModalVisible(true);

                                    }}><Text style={{color:'#fff',textAlign:'center'}}>NEW</Text></TouchableOpacity>
                                </View>
                            </View>
                            <View style={{marginBottom:15}}>
                                <Text style={{fontSize:16,color:'#000',fontWeight:'bold',width:'100%'}}>Vendor</Text>
                                <View style={styles.inputContainer}>
                                    <Picker
                                        selectedValue={this.state.language}
                                        style={{width: '100%'}}
                                        onValueChange={(itemValue, itemIndex) =>
                                            this.setState({language: itemValue})
                                        }>
                                        <Picker.Item label="YETIPOLYCHEMPVT.LTD." value="YETIPOLYCHEMPVT.LTD." />
                                        <Picker.Item label="YETI.LTD." value="YETI.LTD." />
                                    </Picker>
                                </View>
                            </View>
                            <View style={{marginBottom:15}}>
                                <Text style={{fontSize:16,color:'#000',fontWeight:'bold',width:'100%'}}>Entry Date</Text>
                                <View style={styles.inputContainer}>
                                    <TextInput style={{marginLeft:10}}
                                               placeholder="Enter the date"
                                               ref={passwordRef => this.passwordRef = passwordRef}
                                               returnKeyType='done'
                                               onSubmitEditing={Keyboard.dismiss}
                                               underlineColorAndroid='transparent'
                                               // onChangeText={(password) => this.setState({password})}
                                    />
                                </View>
                            </View>
                            <View style={{marginBottom:15}}>
                                <Text style={{fontSize:16,color:'#000',fontWeight:'bold',width:'100%'}}>Status</Text>
                                <View style={styles.inputContainer}>
                                    <Text style={{marginLeft:10}}>Posted</Text>
                                </View>
                            </View>

                        </View>
                        <View style={{width:'100%',alignItems:'center',marginTop:20}}>
                            <TouchableOpacity style={styles.nextButton} onPress={() => this.props.navigation.navigate('PurchaseOrderNext')}><Text style={{color:'#fff',textAlign:'center'}}>NEXT</Text></TouchableOpacity>

                        </View>
                    </ScrollView>
                </View>
            </View>
        );
    }
}

export default New;
const styles = StyleSheet.create({

    container: {
        flex: 1,
        marginTop: 5,
        justifyContent:'center',
        alignItems:'center'
    },
    inputContainer: {
        marginTop:5,
        borderWidth:1.5,
        borderColor:'#dbdbdb',
        backgroundColor: '#ffffff',

        borderRadius:10,
        height:50,
        justifyContent:'center'
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
        // borderColor:'#dbdbdb',
        backgroundColor: '#3f74db',
        width:'40%',
        borderRadius:10,
        height:50,
        justifyContent:'center',

    },

});