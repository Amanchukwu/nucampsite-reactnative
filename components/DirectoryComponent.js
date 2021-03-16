import React, { Component } from 'react';
import { View, FlatList, Text } from 'react-native';
import { Tile } from 'react-native-elements';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import Loading from './LoadingComponent';
import * as Animatable from 'react-native-animatable';

const mapStateToProps = state => { //Recieves the state as a prop and returns the campsite and comments data from the state. Redux has defined this way to call what part of the state we are using. This funciton will need to be passed to the "connect" function.
    return {
        campsites: state.campsites,
    };
};

class Directory extends Component {

    static navigationOptions = { //Header text. "static" JS keyword that sets a method on the class itself instead of the object that the class creates.  This sets the 
        title: 'Directory'
    }

    render() {
        const { navigate } = this.props.navigation; //Each "screen" is automatically provided with the "navigation" prop which contains a lot of built in functions. "navigate" is one of the built in functions and here it is being destructured since it's the only one we need.
        const renderDirectoryItem = ({item}) => {
            return (
                <Animatable.View animation='fadeInRightBig' duration={2000} /*"Animatable.View" is a built in adaptation of the <View> component. "animation" is a built in property and 'fadeInDown' is a built in condition. "delay" will wait X amount after the component is mounted before animation starts.*/ >     
                    <Tile //used to be <ListItem>, but changed to <Tile> just for styling
                        title={item.name}
                        caption={item.description}
                        featured //Just changes the apperance of the title
                        onPress={() => navigate('CampsiteInfo', { campsiteId: item.id })} //2 arguments, name of the screen to navigate to. 2nd argument, adds extra parameters to the route; in this case we are specifying a parameter called "campsiteId" and will give it the id of the campsite that was pressed. Now when an item in the directory is pressed, it will call the "navigate" function from React Navigation in order to switch to the CampsiteInfo screen and the campsiteId parameter will be used to pass the correct campsite object to the screen.
                        imageSrc={{uri: baseUrl + item.image}}
                    />
                </Animatable.View>     
            );
        };

//Add logic here right before where the <FlatList> is depending on getting "data" from the server & check if that data is loading or has errors
        if (this.props.campsites.isLoading) {
            return <Loading />;
        }
        if (this.props.campsites.errMess) {
            return (
                <View>
                    <Text>{this.props.campsites.errMess}</Text>
                </View>
            );
        }

        return (
            <FlatList
                data={this.props.campsites.campsites} //WHY IS PROPS NEEDED HERE??
                renderItem={renderDirectoryItem}
                keyExtractor={item => item.id.toString()}
            />
        );
    }
}

export default connect(mapStateToProps)(Directory);