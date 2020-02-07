import React from 'react';
import {StyleSheet, Text, View, Image, Dimensions, ScrollView, Alert, AsyncStorage,TouchableOpacity} from 'react-native';

import { createDrawerNavigator, createStackNavigator } from 'react-navigation'
import Icon from 'react-native-vector-icons/Ionicons'
import { DrawerItems, SafeAreaView, } from 'react-navigation';

import GoodReceiveEntry from '../navTabsBride/GoodReceiveEntry'
import LocationTransfer from '../navTabsBride/LocationTransfer'
import PickItem from '../navTabsBride/PickItem'
import PickItemEntry from '../navTabsBride/PickItemEntry'
import PackItem from '../navTabsBride/PackItem'
import PackItemEntry from '../navTabsBride/PackItemEntry'
import Help from '../navTabsBride/help'
import MyDrawerItem from '../commons/MyDrawerItem';
import {images} from "../constants/images";
import HeaderButtons, { HeaderButton, Item } from 'react-navigation-header-buttons';

_signOutAsync = async (navigation) => {
    await AsyncStorage.multiRemove([
            'role',
            'Branch',
            'Warehouse',
            'Device',
        ]);
    navigation.navigate('Auth');
};


 HeaderContents= () => {

    return<View style={{backgroundColor:'rgba(3,155,229 ,1)',height:130,justifyContent:'center',}}>
        <View  style={{justifyContent:'center',flexDirection:'row',alignItems:'center'}}>
            <View style={{height:70,width:70,backgroundColor:'#aa3f00',borderRadius:70,justifyContent:'center'}}>
                <Text style={{textAlign:'center',fontSize:22,color:'#e4e4e4',fontWeight:'bold'}}>S</Text>
            </View>
            <View style={{marginLeft:10}}>
                <Text style={{fontSize:16,color:'#e4e4e4',/*fontWeight:'bold',width:'100%'*/}}>Ripl International</Text>
                <Text style={{fontSize:12,color:'#aaaaaa'}}>Dillibazar, Kathmandu</Text></View>
        </View>
    </View>
 };



const GoodReceiveEntryTab = createStackNavigator({
    Home:{
        screen: GoodReceiveEntry,
        navigationOptions: ({navigation}) => ({
            topBarElevationShadowEnabled: false,
            headerStyle:{backgroundColor: '#f9f9f9',
                elevation: 0,
            },
            headerTitle: <View style={{width:'100%',justifyContent:'center',alignItems:'center',height:30}}><Text style={{color:'#000',fontSize:16}}>Warehouse App</Text></View>,

            headerLeft: <View>
                <TouchableOpacity
                    onPress={() => navigation.openDrawer()} >

                    <Icon name="md-menu" color={"#2f2f2f"} size={24} style={{ padding: 20 }} />
                </TouchableOpacity>
            </View>,
            headerRight:<View>

            </View>

        })
    },


});
const HelpTab = createStackNavigator({
    Help:{
        screen: Help,
        navigationOptions: ({navigation}) => ({
            topBarElevationShadowEnabled: false,
            headerStyle:{backgroundColor: '#f9f9f9',
                elevation: 0,
            },
            headerTitle: <Text style={{color:"#2f2f2f", fontWeight:"bold",width:"100%",textAlign:'center',fontSize:18,justifyContent:'center'}}>Help</Text>,
            headerLeft: <View>
                <TouchableOpacity
                    onPress={() => navigation.openDrawer()} >

                    <Icon name="md-menu" color={"#2f2f2f"} size={24} style={{ padding: 20 }} />
                </TouchableOpacity>
            </View>,
            headerRight:<View>

            </View>
        })
    },
});
const PickItemTab = createStackNavigator({
    PickItem:{
        screen: PickItem,
        navigationOptions: ({navigation}) => ({
            topBarElevationShadowEnabled: false,
            headerStyle:{backgroundColor: '#f9f9f9',
                elevation: 0,
            },
            headerTitle: <Text style={{color:"#2f2f2f", fontWeight:"bold",width:"100%",textAlign:'center',fontSize:18,justifyContent:'center'}}>Pick Item</Text>,
            headerLeft: <View>
                <TouchableOpacity
                    onPress={() => navigation.openDrawer()} >

                    <Icon name="md-menu" color={"#2f2f2f"} size={24} style={{ padding: 20 }} />
                </TouchableOpacity>
            </View>,
            headerRight:<View>

            </View>
        })
    },
    PickItemEntry: {
        screen: PickItemEntry,
        navigationOptions: {
            topBarElevationShadowEnabled: false,
            headerStyle:{backgroundColor: '#f9f9f9',
                elevation: 0,
            },
            headerTitle: <Text style={{color:"#2f2f2f", fontWeight:"bold",width:"100%",textAlign:'center',fontSize:18,justifyContent:'center'}}>Pick Item Entry</Text>,
            headerRight:<View>

            </View>
        }
    }
});
const PackItemTab = createStackNavigator({
    PackItem:{
        screen: PackItem,
        navigationOptions: ({navigation}) => ({
            topBarElevationShadowEnabled: false,
            headerStyle:{backgroundColor: '#f9f9f9',
                elevation: 0,
            },
            headerTitle: <Text style={{color:"#2f2f2f", fontWeight:"bold",width:"100%",textAlign:'center',fontSize:18,justifyContent:'center'}}>Pack Item</Text>,
            headerLeft: <View>
                <TouchableOpacity
                    onPress={() => navigation.openDrawer()} >

                    <Icon name="md-menu" color={"#2f2f2f"} size={24} style={{ padding: 20 }} />
                </TouchableOpacity>
            </View>,
            headerRight:<View>

            </View>
        })
    },
    PackItemEntry: {
        screen: PackItemEntry,
        navigationOptions: {
            topBarElevationShadowEnabled: false,
            headerStyle:{backgroundColor: '#f9f9f9',
                elevation: 0,
            },
            headerTitle: <Text style={{color:"#2f2f2f", fontWeight:"bold",width:"100%",textAlign:'center',fontSize:18,justifyContent:'center'}}>Pack Item Entry</Text>,
            headerRight:<View>

            </View>
        }
    }
});

export default createDrawerNavigator({
    GoodReceiveEntry: {screen: GoodReceiveEntryTab},
    Help: {screen: HelpTab},
    PickItem: {screen: PickItemTab},
    PackItem: {screen: PackItemTab},



},

    {
    contentComponent:(props)=> {
        const { routeName } = props.navigation.state.routes[props.navigation.state.index];
return(
    <ScrollView>
        <SafeAreaView style={styles.container} forceInset={{ top: 'always', horizontal: 'never' }}>
            <View>
                <HeaderContents/>
            </View>
            {/*<DrawerItems {...props} />*/}



            <MyDrawerItem
                onPress={() => {
                    props.navigation.navigate('GoodReceiveEntry');
                    props.navigation.closeDrawer();
                }}
                active={routeName == 'GoodReceiveEntry'}
                icon="md-home"
                text="Good Receive Entry"
            />
            <MyDrawerItem
                onPress={() => {
                    props.navigation.navigate('PickItem');
                    props.navigation.closeDrawer();
                }}
                active={routeName == 'PickItem'}
                icon="ios-list-box"
                text="Pick Item"
            />
            <MyDrawerItem
                onPress={() => {
                    props.navigation.navigate('PackItem');
                    props.navigation.closeDrawer();
                }}

                active={routeName == 'PackItem'}
                icon="ios-cube"
                text="Pack Item"
            />
            <MyDrawerItem
                onPress={() => {
                    props.navigation.navigate('Help');
                    props.navigation.closeDrawer();
                }}
                active={routeName == 'Help'}
                icon="md-information-circle"
                text="Help"
            />
            <MyDrawerItem
                onPress={()=>{
                    Alert.alert(
                        'Confirm',
                        'Do you want to Logout from this account ?',
                        [
                            {text: 'OK', onPress: () => this._signOutAsync(props.navigation)},
                            {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                        ],
                        { cancelable: false }
                    )
                }}
                text="Signout"
                icon="md-log-out"
            />
        </SafeAreaView>
    </ScrollView>
)
    },
        drawerWidth:300
    },



)
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

})

;
