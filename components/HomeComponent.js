import React, { Component } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Card } from 'react-native-elements';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';

const mapStateToProps = state => { //Recieves the state as a prop and returns the campsite, promotions, and partners data from the state in the redux store. Redux has defined this way to call what part of the state we are using. This funciton will need to be passed to the "connect" function.
    return {
        campsites: state.campsites,
        promotions: state.promotions,
        partners: state.partners
    };
};

function RenderItem({item}) { //passed props from which we destruct "item"
    if (item) {
        return (
            <Card
                featuredTitle={item.name}
                image={{uri: baseUrl + item.image}}
            >
                <Text style={{margin: 10}}>
                    {item.description}
                </Text>
            </Card>
        );
    }
    return <View />;
}

class Home extends Component {

    static navigationOptions = { //Sets up screen title
        title: 'Home'
    }

    render() {
        return ( //NOTE FOR LINE 41: Can be used to render groups of items like FlatList. ScrollView loads all at once, FlatList just renders the visible part
            <ScrollView> 
                <RenderItem 
                    item={this.props.campsites.campsites.filter(campsite => campsite.featured)[0]} //Takes campsite data from state and searches for the ".featured" attribute that is set to true.
                />
                <RenderItem 
                    item={this.props.promotions.promotions.filter(promotion => promotion.featured)[0]}
                />
                <RenderItem 
                    item={this.props.partners.partners.filter(partner => partner.featured)[0]}
                />
            </ScrollView>
        );
    }
}

export default connect(mapStateToProps)(Home);