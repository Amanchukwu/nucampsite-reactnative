import React, { Component } from 'react';
import { Text, ScrollView, FlatList } from 'react-native';
import { Card, ListItem } from 'react-native-elements';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import Loading from './LoadingComponent'; //Doesn't need { } because it is the default export of "LoadingComponent.js"

const mapStateToProps = state => { //Recieves the state as a prop and returns the partners data from the state. Redux has defined this way to call what part of the state we are using. This funciton will need to be passed to the "connect" function.
    return {
        partners: state.partners
    };
};

function Mission() {
    return (
        <Card title="Our Mission">
            <Text>
            We present a curated database of the best campsites in the vast woods and backcountry of the World Wide Web Wilderness. We increase access to adventure for the public while promoting safe and respectful use of resources. The expert wilderness trekkers on our staff personally verify each campsite to make sure that they are up to our standards. We also present a platform for campers to share reviews on campsites they have visited with each other.  
            </Text>
        </Card>
    );
}

class About extends Component {
    
    static navigationOptions = { //Sets up screen title
        title: 'About Us'
    }
    
    render() {
        
        const renderPartner = ({item}) => {
            return (
                <ListItem
                    title={item.name}
                    subtitle={item.description}
                    leftAvatar={{source: {uri: baseUrl + item.image}}} //Since the images are coming from the server the {object} in the "source"  tells the "leftAvatar" to grab the image at location "baseUrl" and relative image path stored in the "item.image".
                />
            );
        };

        if (this.props.partners.isLoading) { //We know that the object stored in "this.props.partners" holds the partners data from the redux store, which means we can access the "isLoading" property of the partner's state so we can check if "isLoading" is true or false. If true, return the <ScrollView>, <Mission> and <Card> structure and <Loading> component where the <FlatList> will eventually load.
            return (
                <ScrollView>
                    <Mission />
                    <Card
                        title='Community Partners'>
                        <Loading />
                    </Card>
                </ScrollView>
            );
        }
        if (this.props.partners.errMess) {//We know that the object stored in "this.props.partners" holds the error message data from the redux store, which means we can access the "errMess" property of the partner's state so we can check if "errMess" is true or false. If true, return the <ScrollView>, <Mission> and <Card> structure and <Text> component with the error message.
            return (
                <ScrollView>
                    <Mission />
                    <Card
                        title='Community Partners'>
                        <Text>{this.props.partners.errMess}</Text>
                    </Card>
                </ScrollView>
            );
        }

        return (
            <ScrollView>
                <Mission />
                <Card
                    title="Community Partners"
                >
                    <FlatList
                        data={this.props.partners.partners}// Was "this.state.partners" when this component held the state locally. In switching to Redux, the state is now a passed as props. First "partners" refers to the entire part of the state that handles the partners data including the isLoading and error message properties along with the partners array. The second "partners" actually referrs to the partners array.
                        renderItem={renderPartner}
                        keyExtractor={item => item.id.toString()}
                    />
                </Card>
            </ScrollView> 
        );
    }
}

export default connect(mapStateToProps)(About); //"connect" will be passed the "matStateToProps" function, and ( ) are added around the "About" component. This makes sure the <About> component recieves the partners props from the redux store.