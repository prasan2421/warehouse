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
            ip:'',
            device:'',
            branch:'',
            warehouse:'',
            pickingList:'',
            dataBranch:[],
            dataWarehouse:[],
            dataPickingList:[],
            dataItem:{},
            dataBarcode:[],
            dataLocation:[],
            location:'',
            packitemvalue:[],
            dataUnit:[],
            barcode:'',
            showPagination:true,
            isLoading: false,
            item: '',
            value:'',
            quantity:'',

            Unit:'',
            packageNo: '',
            remarks: ''
        }
    }

    componentDidMount() {
        this.focusListener = this.props.navigation.addListener('didFocus', () => {
            const action = this.props.navigation.getParam('action', '');

            if(!action) {
                return;
            }

            this.props.navigation.setParams({'action': ''});

            if(action == 'complete') {
                this.setState({
                    pickingList: '',
                    packageNo: '',
                    remarks: ''
                });
            }
        });

        this.getIp();
       
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
    }

    componentWillUnmount () {
        this.focusListener.remove();

        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }
     getIp= async () => {
        if(await AsyncStorage.getItem('ip')){
            this.setState({
            ip:await AsyncStorage.getItem('ip'),
                device:await AsyncStorage.getItem('Device'),
        })
             this.getPickingListFromAsyncStorage();
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

    _keyboardDidShow = () => {
        this.setState({
            showPagination: false
        });
    }
    _keyboardDidHide = () => {
        this.setState({
            showPagination: true
        });
    }
    submit() {

        let Mcode = this.state.item;
        let BCode = this.state.barcode;
        let Unit = this.state.dataBarcode.baseunit;
        let LocationId = this.state.location;
        let Quantity = this.state.quantity;

        const data = new FormData();

        data.append('Mcode', Mcode);
        data.append('BCode', BCode);
        data.append('Unit', Unit);
        data.append('LocationId', LocationId);
        data.append('Quantity', Quantity);
        data.append('DeviceId', this.state.device);
        data.append('User', 'Admin');
        data.append('PackageNo', '5645');


// console.warn(data);

        let url = this.state.ip+'/warehouse/api/SavePackedItem';
        this.showLoader();
        fetch(url, {
            method: 'POST', // or 'PUT'
            body: JSON.stringify({data}), // data can be `string` or {object}!
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json',
            }
        }).then(res => res.json())
            .then(response => {
                if(response.message) {
                    this.hideLoader();
                    Alert.alert('Success!!','Saved successfully.');
                    this.refs.mySlide.scrollBy(1,true);
                }


            })
            .catch(error => {
                alert(error);

                this.hideLoader();
            });
    }

    getDivisionFromAsyncStorage = async () => {

        const access_token = await AsyncStorage.getItem('access_token');

        this.setState({access_token: access_token});
        fetch(this.state.ip+'/warehouse/api/GetDivisionList', {
            headers: {
                Authorization: 'Bearer ' + access_token
            }
        })
            .then((response) => response.json())
            .then((responseJson) => {
                if(responseJson.errors) {

                    alert(responseJson.errors);
                }
                else if(responseJson.result) {
                    this.setState({
                        dataBranch: responseJson.result,
                    })
                }
            })
            .catch((error) => {

                alert('An error occurred');
            })

    }
    getWarehouseFromAsyncStorage = async () => {
        if(!this.state.branch) {
            return;
        }


        const access_token = await AsyncStorage.getItem('access_token');

        this.setState({access_token: access_token});
        fetch(this.state.ip+'/warehouse/api/GetWarehouselist/'+this.state.branch, {
            headers: {
                Authorization: 'Bearer ' + access_token
            }
        })
            .then((response) => response.json())
            .then((responseJson) => {
                if(responseJson.errors) {

                    alert(responseJson.errors);
                }
                else if(responseJson.result) {

                    this.setState({

                        dataWarehouse: responseJson.result,
                    })
                }

            })
            .catch((error) => {

                alert('An error occurred');
            })

    }
    getPickingListFromAsyncStorage = async () => {

        const access_token = await AsyncStorage.getItem('access_token');
        const device = await AsyncStorage.getItem('Device');
        this.setState({access_token: access_token});
        fetch(this.state.ip+'/warehouse/api/GetPackingList', {
            headers: {
                Authorization: 'Bearer ' + access_token
            }
        })
            .then((response) => response.json())
            .then((responseJson) => {
                if(responseJson.errors) {

                    alert(responseJson.errors);
                }
                else if(responseJson.result) {

                    this.setState({

                        dataPickingList: responseJson.result,
                    })
                }

            })
            .catch((error) => {

                alert('An error occurred');
            })

    }
    getListPackingFromAsyncStorage = async () => {

        const access_token = await AsyncStorage.getItem('access_token');

        this.setState({access_token: access_token});
        fetch(this.state.ip+'/warehouse/api/GetListToPack/'+this.state.device+'/'+this.state.pickingList, {
            headers: {
                Authorization: 'Bearer ' + access_token
            }
        })
            .then((response) => response.json())
            .then((responseJson) => {
                if(responseJson.errors) {

                    alert(responseJson.errors);
                }
                else if(responseJson.result) {
                    let dataItem = {};

                    for(item of responseJson.result) {
                        dataItem[item.mcode] = item;
                    }

                    this.setState({
                        dataItem
                    })
                }

            })
            .catch((error) => {

                alert('An error occurred');
            })

    };
    getLocationFromApi = async () => {

        const access_token = await AsyncStorage.getItem('access_token');

        this.setState({access_token: access_token});
        fetch(this.state.ip+'/warehouse/api/CheckLocation/'+this.state.location, {
            headers: {
                Authorization: 'Bearer ' + access_token
            }
        })
            .then((response) => response.json())
            .then((responseJson) => {
                if(responseJson.errors) {

                    alert(responseJson.errors);
                }
                else if(responseJson.result) {
                    let dataItem = {};

                    for(item of responseJson.result) {
                        dataItem[item.mcode] = item;
                    }

                    this.setState({
                        dataItem
                    })
                }

            })
            .catch((error) => {

                alert('An error occurred');
            })

    };

    getBarcodeFromAsyncStorage = async () => {

        const access_token = await AsyncStorage.getItem('access_token');

        this.setState({access_token: access_token});
        fetch(this.state.ip+'/warehouse/api/GetProduct/'+this.state.barcode, {
            headers: {
                Authorization: 'Bearer ' + access_token
            }
        })
            .then((response) => response.json())
            .then((responseJson) => {
                if(responseJson.errors) {

                    alert(responseJson.errors);
                }
                else if(responseJson.result) {

                    this.setState({
                        dataBarcode: responseJson.result,
                        location:responseJson.result.locations
                    });
                    this.getLocationFromAsyncStorage();
                }
            })
            .catch((error) => {

                // alert('An error occurred');
            })

    }
    saveToAsyncStorage = async (data) => {
        let packListJson = await AsyncStorage.getItem('PackList');
        let packList = [];
        try {
            packList = JSON.parse(packListJson);
        }
        catch(e) {

        }

        if(!Array.isArray(packList)) {
            packList = [];
        }
        packList.push(data)
        await AsyncStorage.setItem(
            'PackList',JSON.stringify(packList)
        );


    };
    onPress=()=>{
        if(this.state.quantity > this.state.value){
            alert('The quantity exceeds the limit.')
        }
        else if(!this.state.quantity){
            alert('Enter the quantity')
        }
        else if(!this.state.dataBarcode.desca){
            alert('Description is empty')
        }
        else{
            this.saveToAsyncStorage(this.state.dataBarcode.desca)
                .then(() => {
                    this.GetPickItem();
                    this.submit();

                });
            
        }

    };
    onPressFirst=()=>{
        const packageNo = this.state.packageNo.trim();

        if(!this.state.pickingList) {
            alert('No packing list selected')
        }
        else if(!packageNo) {
            alert('Please enter package no.');
        }
        else {
            this.props.navigation.navigate('PackItemEntry', {
                packingListId: this.state.pickingList,
                packageNo
            });
        }
    };
    onBack=()=>{
        this.refs.mySlide.scrollBy(-1,true);
    };
    onBackPress=()=>{
        this.setState({barcode: '', quantity: '',dataBarcode:[]});
        this.refs.mySlide.scrollBy(-1,true);
    };
    GetPickItem = () => {
        // this._retrieveData()
        AsyncStorage.getItem('PackList')
            .then((value)=>{
                let packitemvalue = [];
                try {
                    packitemvalue = JSON.parse(value);
                }
                catch(e) {

                }
                this.setState({packitemvalue})
            })
    };
    updateValue(text, field){
        if(field =='quantity'){
            if(text!='' && text>this.state.value){
                alert('The quantity exceeds the required amount.');
            }

            this.setState({ quantity: text });

        }

    }


    render() {
        return (
            <ScrollView>
                <View style={{marginTop:20,width:'100%',alignItems:'center',}}>
                    <View style={{marginBottom:20,width:'90%'}}>
                        <Text style={{fontSize:16,fontWeight:'bold',width:'100%',textAlign:'center',color:'#1481ff'}}>PACKING LIST</Text>

                    </View>

                    {/*
                    <View style={{marginBottom:15,width:'90%'}}>
                        <Text style={{fontSize:16,color:'#000',fontWeight:'bold',width:'100%'}}>Branch/Divison :</Text>
                        <View style={styles.inputContainer}>
                            <Picker
                                selectedValue={this.state.branch}
                                style={{width:'100%'}}
                                onValueChange={(itemValue, itemIndex) =>
                                    this.setState({branch: itemValue, warehouse: ''}, () => {
                                        this.getWarehouseFromAsyncStorage()
                                    })
                                }>
                                <Picker.Item label="Select a Branch/Division .." value="" />
                                {this.state.dataBranch.map(item => (<Picker.Item key={'' + item.id} label={item.name} value={item.initial} />))}
                            </Picker>
                        </View>
                    </View>
                    */}
                    <View style={{marginBottom:15,width:'90%'}}>
                        <Text style={{fontSize:16,color:'#000',fontWeight:'bold',width:'100%'}}>Packing List :</Text>
                        <View style={styles.inputContainer}>
                            <Picker
                                selectedValue={this.state.pickingList}
                                style={{width: '100%'}}
                                onValueChange={(itemValue, itemIndex) =>
                                    this.setState({pickingList: itemValue})
                                }>
                                <Picker.Item label="Choose packing list .." value=""  />
                                {this.state.dataPickingList.map(item => (<Picker.Item key={'' + item.id} label={item} value={item} />))}

                            </Picker>
                        </View>
                    </View>
                    {/*
                    <View style={{marginBottom:15,width:'90%'}}>
                        <Text style={{fontSize:16,color:'#000',fontWeight:'bold',width:'100%'}}>Warehouse :</Text>
                        <View style={styles.inputContainer}>
                            <Picker
                                selectedValue={this.state.warehouse}
                                style={{width:'100%'}}
                                onValueChange={(itemValue, itemIndex) =>
                                    this.setState({warehouse: itemValue})

                                }>
                                <Picker.Item label="Select a warehouse .." value="" />
                                {this.state.dataWarehouse.map(item => (<Picker.Item key={'' + item.id} label={item.name} value={item.division} />))}

                            </Picker>
                        </View>
                    </View>
                    */}
                    <View style={{marginBottom:15,width:'90%'}}>
                        <Text style={{fontSize:16,color:'#000',fontWeight:'bold',width:'100%'}}>Package No. :</Text>
                        <View style={styles.inputContainer}>
                            <TextInput style={{marginLeft:10,width:'100%'}}
                                       placeholder="Package No."
                                       value={this.state.packageNo}
                                       returnKeyType='next'
                                       onSubmitEditing={() => this.passwordRef.focus()}
                                       blurOnSubmit={false}
                                       underlineColorAndroid='transparent'
                                       onChangeText={(packageNo) => this.setState({packageNo})}
                            />
                        </View>
                    </View>
                    <View style={{marginBottom:15,width:'90%'}}>
                        <Text style={{fontSize:16,color:'#000',fontWeight:'bold',width:'100%'}}>Remarks :</Text>
                        <View style={styles.inputContainer}>
                            <TextInput style={{marginLeft:10,width:'100%'}}
                                       placeholder="Enter the remarks"
                                       value={this.state.remarks}
                                       ref={passwordRef => this.passwordRef = passwordRef}
                                       returnKeyType='done'
                                       onSubmitEditing={Keyboard.dismiss}
                                       underlineColorAndroid='transparent'
                                       onChangeText={(remarks) => this.setState({remarks})}
                            />
                        </View>
                    </View>


                </View>
                <View style={{width:'100%',alignItems:'center',marginTop:20,marginBottom:10}}>
                    <TouchableOpacity style={styles.nextButton} onPress={() => this.onPressFirst()}><Text style={{color:'#fff',textAlign:'center'}}>NEXT</Text></TouchableOpacity>

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