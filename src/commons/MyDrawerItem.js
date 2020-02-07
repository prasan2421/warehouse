import React, { Component } from 'react';
import { View, StyleSheet, Text, TouchableHighlight } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/Ionicons'
export default class MyDrawerItem extends Component {
    render() {
        let containerStyles = [styles.drawerItemContainer];

        if(this.props.active) {
            containerStyles.push({backgroundColor: 'rgba(0, 0, 0, 0.07)'})
        }

        return (
            <TouchableHighlight
                onPress={this.props.onPress}
                activeOpacity={1}
                underlayColor="rgba(0, 0, 0, 0.5)"
            >
                <View style={containerStyles}>
                    {/*<Icon*/}
                        {/*name={this.props.iconName}*/}
                        {/*size={24}*/}
                        {/*color={'#fff'}*/}
                    {/*/>*/}
<View style={{flexDirection:'row',alignItems:'center'}}>
    <Icon name={this.props.icon} size={22} color="#000" style={{}}/>
                    <Text style={styles.drawerItemText}>{this.props.text}</Text>
</View>
                </View>
            </TouchableHighlight>
        );
    }
}

const styles = StyleSheet.create({


    drawerItemContainer: {
        paddingTop: 21,
        paddingBottom: 16,
        paddingLeft: 15,
        paddingRight: 10,
        // flexDirection: 'row',
        // alignItems: 'center',
        // paddingTop: 10,
        // paddingBottom: 10,
        // paddingLeft: 20,
        // paddingRight: 20
    },
    drawerItemText: {
        fontWeight:'bold',
        marginLeft: 20,
        color: '#494949'
    }
});