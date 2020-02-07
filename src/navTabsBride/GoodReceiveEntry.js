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
import {createMaterialTopTabNavigator, Header} from 'react-navigation';
import Swiper from 'react-native-swiper';
class PickItemEntry extends Component {


    constructor(props) {
        super(props);
        this.state = {
            ip:'',
            pickingListId:'',
            units: [],
            status:'',
            branch:'',
            device:'',
            warehouse:'',
            pickingList:'',
            dataBranch:[],
            dataWarehouse:[],
            dataPickingList:[],
            // dataItem:{},

            dataBarcode:[],
            dataLocation:[],
            pickitemvalue:[],
            dataUnit:[],
            barcode:'',
            showPagination:true,
            item: '',
            value:'',
            quantity:'',
            unit: '',
            location: '',
            currentItemIndex: 0,
            packageNo:'',
            // user:'',
            reqId:''
        }
    }

    componentDidMount() {
        this.getIp();
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
    }
    componentWillUnmount () {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }
    getIp= async () => {
        if(await AsyncStorage.getItem('ip')){
            this.setState({
            ip:await AsyncStorage.getItem('ip')
        })
            this.getFromAsyncStorage();
            this.loadUnits();

        }
        else{
            alert('No IP address!')
        }

    }

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

    loadUnits = () => {
        fetch(this.state.ip+'/warehouse/api/GetUnitList')
            .then(response => response.json())
            .then(responseJson => {
                if(responseJson.status == 'ok') {
                    this.setState({
                        units: responseJson.result
                    })
                }
            })
            .catch(error => {

            });
    }

    getFromAsyncStorage= async () => {
        const branch = await AsyncStorage.getItem('Branch');
        const warehouse = await AsyncStorage.getItem('Warehouse');
        const device = await AsyncStorage.getItem('Device');

        this.setState(
            {
                branch,
                warehouse,
                device
            }
        )
    }


    getBarcodeFromAsyncStorage = async () => {
        let a =this.state.barcode.trim();

        const access_token = await AsyncStorage.getItem('access_token');

        this.setState({access_token: access_token});
        fetch(this.state.ip+'/warehouse/api/GetProduct?barcode='+encodeURIComponent(a), {
            headers: {
                Authorization: 'Bearer ' + access_token
            }
        })
            .then((response) => response.json())
            .then((responseJson) => {
                if(responseJson.errors) {

                    alert('barcode error');
                }
                else if(status="ok") {
                    // alert(JSON.stringify(responseJson.result));return;
                    if(responseJson.result){
                        const unit = responseJson.result.baseunit;
                        let newState = {
                            dataBarcode: responseJson.result,
                            unit,
                        };

                        if(this.state.units.indexOf(unit) == -1) {
                            const units = this.state.units.concat(unit);
                            newState.units = units;
                        }


                        this.setState(newState);
                        // this.getLocationFromAsyncStorage();
                    }
                    else{
                        this.setState({
                            dataBarcode: {},
                            unit:'',
                        });
                    }

                }
            })
            .catch((error) => {

                alert('An error occurred');
            })

    }

    onPressConfirm=()=>{


        if(!this.state.quantity){
            alert('Enter the quantity.')
        }

        else if(!this.state.barcode){
            alert('Barcode is empty')
        }
        else if(!this.state.location) {
            alert('Location is required')
        }
        else {
            this.onPress();
            // Alert.alert(
            //     'Confirm',
            //     'regId:' + this.state.reqId + ', mcode:' + this.state.dataBarcode.mcode + ', bCode:' + encodeURIComponent(this.state.barcode) +
            //     ', unit:' + this.state.unit + ', locationId:' + this.state.location +
            //     ', quantity:' + this.state.quantity + ', deviceId:' + this.state.device + ', user:Admin, status:'
            //     + this.state.status + ', warehouse:' + this.state.warehouse + ', descA:' + this.state.dataBarcode.desca,
            //     [
            //         {text: 'OK', onPress: this.onPress},
            //         {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
            //     ],
            //     {cancelable: false}
            // )
        }
    };

    onPress=()=>{


            /*
            this.saveToAsyncStorage(this.state.dataBarcode.desca)
            .then(() => {
                this.GetPickItem();
                this.refs.mySlide.scrollBy(1,true);
            });
            */
            const data = JSON.stringify({
                reqId:this.state.reqId,
                mcode: this.state.dataBarcode.mcode,
                bCode: this.state.barcode,
                unit: this.state.unit,
                locationId: this.state.location,
                quantity: +this.state.quantity,
                deviceId: this.state.device,
                user: 'Admin',
                status:+this.state.status,
                warehouse:this.state.warehouse,
                descA:this.state.dataBarcode.desca,
                // packageNo:this.state.packageNo
            });
            // alert(data);return;


            let url = this.state.ip+'/warehouse/api/GoodReceive';
        // Alert.alert('Success!!','success test');return;
            fetch(url, {
                method: 'POST',
                body: data,
                headers:{
                    'Accept':'application/json',
                    'Content-Type':'application/json',
                }
            })

                .then(res => res.json())
                .then(response => {

                    if(response.status == 'ok') {
                        // Alert.alert('Success!!','success');
                        const pickedItem = {
                            bCode: this.state.barcode,
                            descA: this.state.dataBarcode.desca,
                            quantity: this.state.quantity
                        };

                        const pickitemvalue = this.state.pickitemvalue.concat(pickedItem);

                        // const currentItemIndex = this.state.currentItemIndex < this.state.dataItem.length - 1 ? this.state.currentItemIndex + 1 : 0;

                        this.setState({
                            pickitemvalue,
                            // currentItemIndex,
                            barcode:'',
                            dataBarcode: {},
                            location:'',
                            mcode:'',
                            unit:'',
                            quantity: '',
                            status:'',
                            descA:'',
                            packageNo:'',

                        });

                        Alert.alert('Success','Saved successfully.');
                    }
                    else {
                        Alert.alert('Error', 'Could not save your data!');
                    }

                })
                .catch(error => {
                    // console.error(error);
                    Alert.alert('Error','Something went wrong!');
                });


    };

    goToNextItem = () => {
        this.refs.mySlide.scrollBy(1,true);
        // const currentItemIndex = this.state.currentItemIndex < this.state.dataItem.length - 1 ? this.state.currentItemIndex + 1 : 0;
        //
        // this.setState({
        //     currentItemIndex,
        //     barcode: '',
        //     quantity: '',
        //     unit: '',
        //     location: '',
        //     dataBarcode: {}
        // });
    }

    onPressFirst=()=>{
        if(!this.state.pickingList==''){
            this.getListPickingFromAsyncStorage();
            this.refs.mySlide.scrollBy(1,true);
        }
        else{
            alert('No picking list selected')
        }

    };

    onBack=()=>{
        this.refs.mySlide.scrollBy(-1,true);
    };

    onBackPress=()=>{
        this.setState({barcode: '', quantity: '',dataBarcode:{}});
        this.refs.mySlide.scrollBy(-1,true);
    };



    updateValue(text, field){
        if(field =='quantity'){

            if(text='' ){
                alert('The quantity exceeds the required amount.');
            }

            this.setState({ quantity: text });
        }
    }
    enteredItem(){
        if(this.state.dataBarcode.menucode){
            return(
                <View style={{width:'90%',borderColor:'#000',borderWidth:1,padding:5}}>
                    <Text style={{textAlign:'center',fontWeight:'bold',color:'#000'}}>ITEM FROM BARCODE</Text>
                    <Text><Text style={{color:'#000',width:15}}></Text>Menucode : {this.state.dataBarcode.menucode}</Text>
                    <Text>Mcode : {this.state.dataBarcode.mcode}</Text>
                    <Text>Description : {this.state.dataBarcode.desca}</Text>
                    <Text>Barcode : {this.state.dataBarcode.barcode}</Text>
                    <Text>Baseunit : {this.state.dataBarcode.baseunit}</Text>
                    <Text>Locations : {this.state.dataBarcode.locations}</Text>
                </View>
            )
        }
        else
            return null;
    }

    renderForm() {

            return (
                <View style={{marginTop:10,width:'100%',alignItems:'center',}}>
                    <View style={{marginBottom:10,width:'90%'}}>
                        <Text style={{fontSize:16,fontWeight:'bold',width:'100%',textAlign:'center',color:'#1481ff'}}>GOODS RECEIVE ENTRY</Text>
                    </View>
                    {this.enteredItem()}
                    <View style={{marginBottom:5,width:'90%'}}>
                        <View style={styles.inputContainer}>

                            <Text style={{fontSize:16,color:'#000',fontWeight:'bold',flex:1}}>Req ID </Text>

                            <View style={{flex:2.5}}>

                                <TextInput style={{fontSize:18}}
                                           placeholder="Enter the Req ID"
                                           value={this.state.reqId}

                                           returnKeyType="next"
                                           onSubmitEditing={() => this.barcode.focus()}
                                           onChangeText={(reqId) => this.setState({reqId})}/>

                            </View>
                        </View>
                    </View>
                    <View style={{marginBottom:5,width:'90%'}}>
                        <View style={styles.inputContainer}>
                            <Text style={{fontSize:16,color:'#000',fontWeight:'bold',flex:1}}>Barcode</Text>
                            <View style={{flex:2.5}}>
                                <TextInput style={{fontSize:18}}
                                           placeholder="Enter the barcode"
                                           value={this.state.barcode}
                                           ref={(barcode) => {this.barcode = barcode}}
                                           returnKeyType='next'

                                           // onSubmitEditing={Keyboard.dismiss}
                                           onSubmitEditing={() => {
                                               Keyboard.dismiss();
                                               this.getBarcodeFromAsyncStorage();
                                               this.location.focus();
                                           }}
                                           blurOnSubmit={false}
                                           underlineColorAndroid='transparent'
                                           onChangeText={(barcode) => this.setState({barcode})}
                                />
                            </View>
                        </View>
                    </View>
                    <View style={{marginBottom:5,width:'90%'}}>
                        <View style={styles.inputContainer}>
                            <Text style={{fontSize:16,color:'#000',fontWeight:'bold',flex:1}}>Description</Text>
                            <View style={{flex:2.5}}>
                                <Text style={{fontSize:18}}>{this.state.dataBarcode.desca}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{marginBottom:5,width:'90%'}}>
                        <View style={styles.inputContainer}>
                            <Text style={{fontSize:16,color:'#000',fontWeight:'bold',flex:1}}>Unit</Text>

                            <Picker
                                style={{flex:2.5}}
                                selectedValue={this.state.unit}
                                onValueChange={value => this.setState({unit: value})}
                            >
                                <Picker.Item label="Select a Unit" value="" />
                                {this.state.units.map(item => (<Picker.Item key={item} label={item} value={item} />))}
                            </Picker>

                        </View>
                    </View>
                    {/*<View style={{marginBottom:5,width:'90%'}}>*/}
                        {/*<View style={styles.inputContainer}>*/}
                            {/*<Text style={{fontSize:16,color:'#000',fontWeight:'bold',flex:1}}>MCODE</Text>*/}
                            {/*<View style={{flex:2.5,fontSize:18}}>*/}
                                {/*<Text style={{fontSize:18}}>{this.state.dataBarcode.mcode}</Text>*/}
                            {/*</View>*/}
                        {/*</View>*/}
                    {/*</View>*/}


                    <View style={{marginBottom:5,width:'90%'}}>

                        <View style={styles.inputContainer}>
                            <Text style={{fontSize:16,color:'#000',fontWeight:'bold',flex:1}}>Location</Text>
                            <View style={{flex:2.5}}>
                            <TextInput style={{fontSize:18}}
                                       placeholder="Enter the Location Id"
                                       returnKeyType='next'
                                       value={this.state.location}
                                       ref={(location) => {this.location = location}}
                                       onSubmitEditing={() => this.quantity.focus()}
                                       underlineColorAndroid='transparent'
                                       // keyboardType={'numeric'}

                                       onChangeText={(location) => this.setState({location})}/>
                            </View>

                        </View>
                    </View>
                    <View style={{marginBottom:5,width:'90%'}}>
                        <View style={styles.inputContainer}>

                                <Text style={{fontSize:16,color:'#000',fontWeight:'bold',flex:1}}>Quantity </Text>


                            <View style={{flex:2.5}}>

                                <TextInput style={{fontSize:18}}
                                           placeholder="Enter the quantity"
                                           value={this.state.quantity}
                                           ref={quantity => this.quantity = quantity}
                                           returnKeyType='done'
                                           onSubmitEditing={Keyboard.dismiss}
                                           // onSubmitEditing={() => this.packageNo.focus()}
                                           underlineColorAndroid='transparent'
                                           keyboardType={'numeric'}
                                           onChangeText={(quantity) => this.setState({quantity})}/>

                            </View>
                        </View>
                    </View>


                    <View style={{width:'100%',justifyContent:'center',marginTop:5,marginBottom:10,flexDirection:'row',}}>


                        <TouchableOpacity style={styles.nextButton} onPress={() => this.onPressConfirm()}><Text style={{color:'#fff',textAlign:'center'}}>SAVE</Text></TouchableOpacity>

                        <TouchableOpacity style={styles.nextButton} onPress={() => this.goToNextItem()}><Text style={{color:'#fff',textAlign:'center'}}>NEXT</Text></TouchableOpacity>

                    </View>
                </View>
            );


    }


    render() {
        return (
            <Swiper style={{}}
                    showsPagination={this.state.showPagination}
                    activeDotColor='#1481FF'
                    ref={"mySlide"}>
                <ScrollView
                    behavior="padding"
                    keyboardVerticalOffset = {Header.HEIGHT + 20}
                    enabled
                    style={{flex:1, marginBottom: 50}}
                >
                    {this.renderForm()}
                </ScrollView>
                <View
                    style={{flex:1, marginBottom: 50}}
                >
                    <View style={{marginBottom:20,width:'100%'}}>
                        <Text style={{fontSize:16,fontWeight:'bold',width:'100%',textAlign:'center',color:'#1481ff'}}>PICKED ITEM LIST</Text>

                    </View>
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        style={{flex:1}}
                        data={this.state.pickitemvalue}
                        keyExtractor={(item, index) => '' + index}
                        renderItem={({item}) =>

                            <View
                                style={{
                                    padding: 5,
                                    margin: 10,
                                    borderColor: '#000',
                                    borderWidth: 1
                                }}
                            >
                                <Text>{item.bCode}</Text>
                                <Text style={{color:"black",fontWeight:'bold'}}>{item.descA}</Text>
                                <Text>Quantity: {item.quantity}</Text>
                            </View>
                        }
                    />

                </View>

            </Swiper>
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
    redText: {
        color: '#ff0000'
    },

});

export default PickItemEntry;