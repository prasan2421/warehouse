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
class PackItemEntry extends Component {


    constructor(props) {
        super(props);
        this.state = {
            id:'',
            packingListId: this.props.navigation.getParam('packingListId', ''),
            packageNo: this.props.navigation.getParam('packageNo', ''),
            units: [],
            branch:'',
            warehouse:'',
            pickingList:'',
            device:'',
            dataBranch:[],
            dataWarehouse:[],
            dataPickingList:[],
            // dataItem:{},
            dataItem: [],
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
            unit: '',

            currentItemIndex: 0
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
            ip:await AsyncStorage.getItem('ip'),
                device:await AsyncStorage.getItem('Device'),
        })
             this.loadUnits();
        this.getListPackingFromAsyncStorage();
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
        // let DeviceId = this.state.check;
        // let User = this.state.check;
        let PackageNo = this.state.packageNo;
        const data = new FormData();

        data.append('Mcode', Mcode);
        data.append('BCode', BCode);
        data.append('Unit', Unit);
        data.append('LocationId', LocationId);
        data.append('Quantity', Quantity);
        data.append('DeviceId', this.state.device);
        data.append('User', 'Admin');
        // data.append('PackageNo', '5645');
        data.append('PackageNo', PackageNo);

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

    getListPackingFromAsyncStorage = async () => {

        const access_token = await AsyncStorage.getItem('access_token');

        this.setState({access_token: access_token});
        fetch(this.state.ip+'/warehouse/api/GetListToPack/'+this.state.device+'/'+this.state.packingListId, {
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
                    /*
                    let dataItem = {};

                    for(item of responseJson.result) {
                        dataItem[item.mcode] = item;
                    }

                    this.setState({
                        dataItem
                    })
                    */

                    this.setState({
                        dataItem: responseJson.result.filter(q=>q.quantity>0)
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
        let a =this.state.barcode.trim();


        const access_token = await AsyncStorage.getItem('access_token');

        this.setState({access_token: access_token});
        fetch(this.state.ip+'/warehouse/api/GetProductForPick?barcode='+encodeURIComponent(a)+'&DeviceId='+this.state.device+'&PickNo='+this.state.packingListId, {
            headers: {
                Authorization: 'Bearer ' + access_token
            }
        })
            .then((response) => response.json())
            .then((responseJson) => {
                if(responseJson.errors) {
                    alert(responseJson.errors);
                }
                else if(status="ok") {
                    // alert(JSON.stringify(responseJson));return;
                    if(responseJson.result){
                        const unit = responseJson.result.baseunit;
                        let newState = {
                            dataBarcode: responseJson.result,
                            unit
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

                // alert('An error occurred');
            })

    };
    updateItemValue = (index, text) => {
        let dataItem = this.state.dataItem.map((v, i) => {
            if(i == index) {
                v.quantity = v.quantity-text;
            }
            return v;
        }).filter(q=>q.quantity>0);

        this.setState({
            dataItem
        });
    }
    /*
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
    */
    onPress=()=>{
        const item = this.state.dataItem[this.state.currentItemIndex];
        // let body= JSON.stringify({
        //     reqId: this.state.packingListId,
        //     mcode: this.state.dataBarcode.mcode,
        //     bCode: this.state.dataBarcode.barcode,
        //     unit: this.state.unit,
        //     // locationId: this.state.location,
        //     quantity: this.state.quantity,
        //     deviceId: this.state.device,
        //     descA:this.state.dataBarcode.desca,
        //     User: 'Admin',
        //     PackageNo: this.state.packageNo
        //
        // })
        //
        // alert(body);return;

        // if(this.state.quantity > item.quantity){
        //     alert('The quantity exceeds the limit.')
        // }
        // else if(!this.state.quantity){
        //     alert('Enter the quantity')
        // }
        // else if(!this.state.dataBarcode.desca){
        //     alert('Description is empty')
        // }
        //
        // else{
            /*
            this.saveToAsyncStorage(this.state.dataBarcode.desca)
                .then(() => {
                    this.GetPickItem();
                    this.submit();

                });
                */

            let url = this.state.ip+'/warehouse/api/SavePackedItem';
            fetch(url, {
                method: 'POST',
                body: JSON.stringify({
                    reqId: this.state.packingListId,
                    mcode: this.state.dataBarcode.mcode,
                    bCode: this.state.dataBarcode.barcode,
                    unit: this.state.unit,
                    // locationId: this.state.location,
                    quantity: this.state.quantity,
                    deviceId: this.state.device,
                    descA:this.state.dataBarcode.desca,
                    User: 'Admin',
                    PackageNo: this.state.packageNo

                }),
                headers:{
                    'Accept':'application/json',
                    'Content-Type':'application/json',
                }
            })
            .then(res => res.json())
            .then(response => {
                if(response.status == 'ok') {
                    this.updateItemValue(this.state.currentItemIndex, this.state.quantity);
                    const packedItem = {
                        bCode: item.bCode,
                        descA: item.descA,
                        quantity: this.state.quantity
                    };

                    const packitemvalue = this.state.packitemvalue.concat(packedItem);
                    const currentItemIndex = this.state.currentItemIndex < this.state.dataItem.length - 1 ? this.state.currentItemIndex + 1 : 0;
                    
                    this.setState({
                        packitemvalue,
                        currentItemIndex,
                        barcode: '',
                        quantity: '',
                        unit: '',
                        location: '',
                        dataBarcode: {}
                    });

                    Alert.alert('Success!!','Saved successfully.');
                }
                else {
                    Alert.alert('Error!!', response.message);
                }

            })
            .catch(error => {
                Alert.alert('Error!!','Something went wrong.');
            });
        // }

    };

    goToNextItem = () => {
        const currentItemIndex = this.state.currentItemIndex < this.state.dataItem.length - 1 ? this.state.currentItemIndex + 1 : 0;
        
        this.setState({
            currentItemIndex,
            barcode: '',
            quantity: '',
            unit: '',
            location: '',
            dataBarcode: {}
        });
    }

    complete = () => {
        this.props.navigation.navigate('PackItem', {
            action: 'complete'
        });
    }

    onPressFirst=()=>{
        if(!this.state.pickingList==''){
            this.getListPackingFromAsyncStorage();
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
    /*
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
    */
    updateValue(text, field){
        if(field =='quantity'){
            const item = this.state.dataItem[this.state.currentItemIndex];
            if(text!='' && text > item.quantity){
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
                    <Text>Quantity : {this.state.dataBarcode.quantity}</Text>
                    <Text>Baseunit : {this.state.dataBarcode.baseunit}</Text>
                    <Text>Locations : {this.state.dataBarcode.locations}</Text>
                </View>
            )
        }
        else
            return null;
    }
    renderEmptyView() {
        if(this.state.dataItem.length<=0) {
            return (
                <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                    <Text style={{fontSize:24}}>No Items..</Text>
                </View>
            )
        }
        else {
            return<ActivityIndicator size="small" color="#353535" />;
        }
    }

    renderEmptyView1() {
        if(this.state.packitemvalue.length<=0) {
            return (
                <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                    <Text style={{fontSize:24}}>No Items..</Text>
                </View>
            )
        }
        else {
            return<ActivityIndicator size="small" color="#353535" />;
        }
    }

    renderForm() {
        if(this.state.dataItem.length == 0) {
            return null;
        }
        else if(this.state.currentItemIndex < this.state.dataItem.length) {
            const item = this.state.dataItem[this.state.currentItemIndex];

            return (
                <View style={{marginTop:10,width:'100%',alignItems:'center',}}>
                    <View style={{marginBottom:10,width:'90%'}}>
                        <Text style={{fontSize:16,fontWeight:'bold',width:'100%',textAlign:'center',color:'#1481ff'}}>ITEM ENTRY</Text>
                    </View>

                    <View style={{width: '90%', padding: 5, borderColor: '#000', borderWidth: 1}}>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={{flex: 1}}>Item</Text>
                            <Text style={{flex: 3}}>{item.descA}</Text>
                        </View>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={{flex: 1}}>Quantity</Text>
                            <Text style={{flex: 3}}>{item.quantity}</Text>
                        </View>
                    </View>
                    {this.enteredItem()}

                    {/*
                    <View style={{marginBottom:15,width:'90%'}}>
                        <Text style={{fontSize:16,color:'#000',fontWeight:'bold',width:'100%'}}>List of Items</Text>
                        <View style={styles.inputContainer}>
                            <Picker
                                selectedValue={this.state.item}
                                style={{width:'100%'}}
                                onValueChange={(itemValue, itemIndex) => {
                                    let value = '';
                                    if(itemValue) {
                                        value = this.state.dataItem[itemValue].quantity;
                                    }

                                    this.setState({
                                        item: itemValue,
                                        value
                                    })
                                }}>
                                <Picker.Item label="Select Item" value="" />
                                {Object.entries(this.state.dataItem).map(([key, value]) => (<Picker.Item key={'' + key} label={value.descA} value={key} />))}

                            </Picker>
                        </View>
                    </View>
                    */}

                    <View style={{marginBottom:5,width:'90%'}}>
                        <View style={styles.inputContainer}>
                            <Text style={{fontSize:16,color:'#000',fontWeight:'bold',width:120}}>Barcode</Text>
                            <View style={{width:'100%'}}>
                                <TextInput style={{marginLeft:10,fontSize:18}}
                                           placeholder="Barcode"
                                           value={this.state.barcode}
                                    // ref={passwordRef => this.passwordRef = passwordRef}
                                           returnKeyType='next'
                                           onSubmitEditing={() => {
                                               // Keyboard.dismiss();
                                               this.getBarcodeFromAsyncStorage();
                                               this.quantityInput.focus();
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
                            <Text style={{fontSize:16,color:'#000',fontWeight:'bold',width:120}}>Description</Text>
                            <View style={{width:'100%',}}>
                                <Text>{this.state.dataBarcode.desca}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{marginBottom:5,width:'90%'}}>
                        <View style={styles.inputContainer}>
                            <Text style={{fontSize:16,color:'#000',fontWeight:'bold',width:120}}>Unit</Text>
                            <View style={{width:'100%'}}>
                                <Picker
                                    selectedValue={this.state.unit}
                                    onValueChange={value => this.setState({unit: value})}
                                >
                                    <Picker.Item label="Select a Unit" value="" />
                                    {this.state.units.map(item => (<Picker.Item key={item} label={item} value={item} />))}
                                </Picker>
                            </View>
                        </View>
                    </View>
                    <View style={{marginBottom:5,width:'90%'}}>
                        <View style={styles.inputContainer}>
                            <View>
                                <Text style={{fontSize:16,color:'#000',fontWeight:'bold',width:120}}>Quantity <Text style={styles.redText}>*</Text></Text>
                                {/*
                                <Text>* Pick qty :<Text style={{color:'#000'}}>{this.state.value}</Text></Text>
                                */}
                            </View>
                            <View style={{width:'100%',}}>

                                <TextInput style={{marginLeft:10,fontSize:18}}
                                           placeholder="Quantity"
                                           value={this.state.quantity}
                                           ref={(input) => {this.quantityInput = input}}
                                           returnKeyType="done"
                                           onSubmitEditing={Keyboard.dismiss}
                                           // onSubmitEditing={() => this.locationInput.focus()}
                                           blurOnSubmit={false}
                                           keyboardType={'numeric'}
                                           autoCapitalize = 'none'
                                           underlineColorAndroid='transparent'
                                           onChangeText={(text) => this.updateValue(text,'quantity')}/>

                            </View>
                        </View>
                    </View>




                    {/*<View style={{marginBottom:5,width:'90%'}}>*/}

                        {/*<View style={styles.inputContainer}>*/}
                            {/*<Text style={{fontSize:16,color:'#000',fontWeight:'bold',width:120}}>Location <Text style={styles.redText}>*</Text></Text>*/}
                            {/*<View style={{width:'100%',}}>*/}
                                {/*<TextInput style={{marginLeft:10,fontSize:18}}*/}
                                           {/*placeholder="Location"*/}
                                           {/*value={this.state.location}*/}
                                           {/*ref={(input) => {this.locationInput = input}}*/}
                                           {/*underlineColorAndroid='transparent'*/}
                                           {/*onChangeText={(location) => this.setState({location})}/>*/}
                            {/*</View>*/}
                        {/*</View>*/}
                    {/*</View>*/}

                    <View style={{width:'100%',justifyContent:'center',marginTop:5,marginBottom:10,flexDirection:'row',}}>

                        {/*
                        <TouchableOpacity style={styles.nextButton} onPress={() => this.onBack()}><Text style={{color:'#fff',textAlign:'center'}}>Back</Text></TouchableOpacity>
                        */}

                        <TouchableOpacity style={styles.nextButton} onPress={() => this.onPress()}><Text style={{color:'#fff',textAlign:'center'}}>SAVE</Text></TouchableOpacity>

                        <TouchableOpacity style={styles.nextButton} onPress={() => this.goToNextItem()}><Text style={{color:'#fff',textAlign:'center'}}>NEXT</Text></TouchableOpacity>

                        <TouchableOpacity style={styles.nextButton} onPress={() => this.complete()}><Text style={{color:'#fff',textAlign:'center'}}>COMPLETE</Text></TouchableOpacity>

                    </View>
                </View>
            );
        }
        else {
            return (
                <Text>Packing Items Completed</Text>
            );
        }
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
                    <ActivityIcon visible={this.state.isLoading}
                                  indicatorColor={'#333333'}
                                  messageColor={'#afafaf'}
                                  message='Please wait!'
                    />
                    <View style={{marginBottom:20,width:'100%'}}>
                        <Text style={{fontSize:16,fontWeight:'bold',width:'100%',textAlign:'center',color:'#1481ff'}}>PACKED ITEM LIST</Text>

                    </View>
                    <FlatList
                        ListEmptyComponent={this.renderEmptyView1()}
                        showsVerticalScrollIndicator={false}
                        style={{flex:1}}
                        data={this.state.packitemvalue}
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
                    {/*
                    <View style={{width:'100%',alignItems:'center',marginTop:10,marginBottom:25}}>
                        <TouchableOpacity style={styles.nextButton} onPress={() => this.onBackPress()}><Text style={{color:'#fff',textAlign:'center'}}>Add New Item</Text></TouchableOpacity>
                    </View>
                    */}
                </View>
                <View
                    style={{flex:1, marginBottom: 50}}
                >
                    <View style={{marginBottom:20,width:'100%'}}>
                    <Text style={{fontSize:16,fontWeight:'bold',width:'100%',textAlign:'center',color:'#1481ff'}}>ITEM LIST</Text>

                </View>
                        <FlatList
                            ListEmptyComponent={this.renderEmptyView()}
                            showsVerticalScrollIndicator={false}
                            style={{flex:1}}
                            data={this.state.dataItem}
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
                    {/*
                    <View style={{width:'100%',alignItems:'center',marginTop:10,marginBottom:25}}>
                        <TouchableOpacity style={styles.nextButton} onPress={() => this.onBackPress()}><Text style={{color:'#fff',textAlign:'center'}}>Add New Item</Text></TouchableOpacity>
                    </View>
                    */}
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
        width:'30%',
        borderRadius:10,
        height:50,
        justifyContent:'center',

    },
    redText: {
        color: '#ff0000'
    },

});

export default PackItemEntry;