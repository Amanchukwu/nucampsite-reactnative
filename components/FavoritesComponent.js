import React, { Component } from 'react';
import { FlatList, View, Text } from 'react-native';
import { ListItem } from 'react-native-elements';
import { connect } from 'react-redux'; //need so that we can access the campsites from the redux store
import { Loading } from './LoadingComponent';
import { baseUrl } from '../shared/baseUrl'; //will be getting images from JSON server, so need this

const mapStateToProps = state => { //Get "campsites" and "favorites" data from the redux store and make it props
    return {
        campsites: state.campsites,
        favorites: state.favorites
    };
};

class Favorites extends Component {

    static navigationOptions = { //Needed for the Stack Navigator
        title: 'My Favorites'
    }

    render() {
        const { navigate } = this.props.navigation; //Need access to the "navigate" function so we can make every favorite in the list to be able to be pressed/clicked to route the user to the corresponding "CampsiteInfo" component.  "navigate" function is available as a built in method for the "navigation" prop, because this component will be set up as a navigator in MainComponent.js, it has access to the "navigation" prop.  The "navigate" function can be destructured from the "navigation" prop via { }.
        const renderFavoriteItem = ({item}) => { //created for use in the <FlatList>. Destructure the current item from the array via {item}
            return ( //Will return from the destructured item a <ListItem> with the title built in properties (title, subtitle, etc) as below.
                <ListItem
                    title={item.name}
                    subtitle={item.description}
                    leftAvatar={{source: {uri: baseUrl + item.image}}} 
                    onPress={() => navigate('CampsiteInfo', {campsiteId: item.id})} //turn the <ListItem> into a link by giving it an "onPress" prop to which we pass the callback containing the "navigate" function which will route to the "CampsiteInfo" screen with the campsiteId as a parameter. 
                />
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
            <FlatList
                data={this.props.campsites.campsites.filter( //Need to pass it a data prop that contains the array of campsites (this.props.campsites.campsites) with data to render. Need to also filter out the campsites where the id of the campsite matches one of the ids in the list of favorites which we access via this.props.favorites. Use the "filter" method on the array of campsites, the favorites array is an array of campsite ids so for every campsite object we check if the favorites array includes the id of that campsite. The filter method returns a new array that consists of all the campsites that have a match.
                    campsite => this.props.favorites.includes(campsite.id)
                )}
                renderItem={renderFavoriteItem} //Pass "renderFavoriteItem" which we create above
                keyExtractor={item => item.id.toString()} //Pass each "item" into a fuction and extract the id as a string to use as the unique key for each item.
            />
        );
    }
}

export default connect(mapStateToProps)(Favorites); 