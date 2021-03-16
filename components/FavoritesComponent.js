import React, { Component } from 'react';
import { FlatList, View, Text, StyleSheet, Alert } from 'react-native';
import { ListItem } from 'react-native-elements';
import { connect } from 'react-redux'; //need so that we can access the campsites from the redux store
import { Loading } from './LoadingComponent';
import { baseUrl } from '../shared/baseUrl'; //will be getting images from JSON server, so need this
import { SwipeRow } from 'react-native-swipe-list-view'; //Makes use of "TouchableOpacity" 
import { TouchableOpacity } from 'react-native-gesture-handler'; //Installed 'react-native-gesture-handler' in an exercise before "swipe to delete" exercise.
import { deleteFavorite } from '../redux/ActionCreators';
import * as Animatable from 'react-native-animatable';

const mapStateToProps = state => { //Get "campsites" and "favorites" data from the redux store and make it props
    return {
        campsites: state.campsites,
        favorites: state.favorites
    };
};

//Any time we want to dispatch an action creator from a component, we need to use a "mapDispatchToProps" object & need to add "mapDispatchToProps" to the "connect" function. Added to support the swipe-to-delete funcitonality
const mapDispatchToProps = {
    deleteFavorite: campsiteId => deleteFavorite(campsiteId) //Specify it's the "deletFavorite" action creator we want to match to props along with the "campsiteId" for it's parameter.
};

class Favorites extends Component {

    static navigationOptions = { //Needed for the Stack Navigator
        title: 'My Favorites'
    }

    render() {
        const { navigate } = this.props.navigation; //Need access to the "navigate" function so we can make every favorite in the list to be able to be pressed/clicked to route the user to the corresponding "CampsiteInfo" component.  "navigate" function is available as a built in method for the "navigation" prop, because this component will be set up as a navigator in MainComponent.js, it has access to the "navigation" prop.  The "navigate" function can be destructured from the "navigation" prop via { }.
        const renderFavoriteItem = ({item}) => { //created for use in the <FlatList>. Destructure the current item from the array via {item}
            return ( //Will return from the destructured item a <ListItem> with the title built in properties (title, subtitle, etc) as below.
                //Need to surround the <ListItem> component with the <SwipeRow> component which will set up the list item as a thing that can be swiped."rightOpenValue={-X}" is a built in property that reqires a negative integer that represents the amount of pixles that the user will have to swipe from right to left for the row to open. Must set up two <View> components inside the <SwipeRow> component (it is expecting that). The first <View> is expected to be the view that is shown after the user swipes and the second <View> is expected to be the default view that is shown befor the swipe.
                <SwipeRow rightOpenValue={-100} style={styles.swipeRow}>
                    <View style={styles.deleteView}>
                        <TouchableOpacity
                            style={styles.deleteTouchable}
                            onPress={() => //When touching this component, want the "Alert" dialog to pop up before deleting the favorite
                                Alert.alert( //call the method "alert" which has several paramters, the 1st is the title that will be displayed in the alert dialog. the 2nd parameter will be a short message show in the dialog box. 3rd parmaeter is the set of actions that the alert dialog needs to support provided as an array of objects where each object in the array represents a button in the alert dialog.
                                    'Delete Favorite?', //1st parameter to "alert"
                                    'Are you sure you wish to delete the favorite campsite ' +
                                        item.name +
                                        '?', //2nd parameter to "alert"
                                    [ //3rd parameter to "alert"
                                        {
                                            text: 'Cancel',
                                            onPress: () => console.log(item.name + 'Not Deleted'), //"onPress" is built in, define the funciton we want to run when the button is pressed
                                            style: 'cancel' //this style property will affect its color
                                        },
                                        {
                                            text: 'OK',                            
                                            onPress: () => this.props.deleteFavorite(item.id) //"onPress" property is built in and we give it the "deleteFavorite" action that we imported that so when this component is pressed, it will call the "deleteFavorite" action using this item's id.
                                        },
                                    ],
                                    { cancelable: false } //4th parameter, an object with the property "cancelable" set to false. By default, alerts on Android can be dismissed by tapping outside of the alert box. This parameter disables that behavior.
                                )
                            }                        
                        >
                        <Text style={styles.deleteText}  /*Acts as the label for the component*/ >Delete</Text>
                        </TouchableOpacity>
                    </View>
                    <View>                    
                        <ListItem
                            title={item.name}
                            subtitle={item.description}
                            leftAvatar={{source: {uri: baseUrl + item.image}}} 
                            onPress={() => navigate('CampsiteInfo', {campsiteId: item.id})} //turn the <ListItem> into a link by giving it an "onPress" prop to which we pass the callback containing the "navigate" function which will route to the "CampsiteInfo" screen with the campsiteId as a parameter. 
                        />
                    </View>
                </SwipeRow>    
            );
        };

        if (this.props.campsites.isLoading) { //check if the campsites data is still loading
            return <Loading />; //if true, return loading component
        }
        if (this.props.campsites.errMess) { //check if there is an error message
            return ( //if so, return a view with the text of error message
                <View>
                    <Text>{this.props.campsites.errMess}</Text>
                </View>
            );
        }
        return (//If there is no loading and no error message, safe to return <FlatList> with the campsites data
            <Animatable.View animation='fadeInRightBig' duration={2000} /*"Animatable.View" is a built in adaptation of the <View> component. "animation" is a built in property and 'fadeInDown' is a built in condition. "delay" will wait X amount after the component is mounted before animation starts.*/ >     
                <FlatList
                    data={this.props.campsites.campsites.filter( //Need to pass it a data prop that contains the array of campsites (this.props.campsites.campsites) with data to render. Need to also filter out the campsites where the id of the campsite matches one of the ids in the list of favorites which we access via this.props.favorites. Use the "filter" method on the array of campsites, the favorites array is an array of campsite ids so for every campsite object we check if the favorites array includes the id of that campsite. The filter method returns a new array that consists of all the campsites that have a match.
                        campsite => this.props.favorites.includes(campsite.id)
                    )}
                    renderItem={renderFavoriteItem} //Pass "renderFavoriteItem" which we create above
                    keyExtractor={item => item.id.toString()} //Pass each "item" into a fuction and extract the id as a string to use as the unique key for each item.
                />
            </Animatable.View>
        );
    }
}

const styles = StyleSheet.create({
    deleteView: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        flex: 1
    },
    deleteTouchable: {
        backgroundColor: 'red',
        height: '100%',
        justifyContent: 'center'
    },
    deleteText: {
        color: 'white',
        fontWeight: '700',
        textAlign: 'center',
        fontSize: 16,
        width: 100
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Favorites); 