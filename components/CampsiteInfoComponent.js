import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { Card } from 'react-native-elements';
import { CAMPSITES } from '../shared/campsites';

function RenderCampsite({campsite}) { //from the props object it receives, were only going to use the campsite object
    if (campsite) { //make sure the object is not null or undefined
        return (
            <Card 
                featuredTitle={campsite.name} 
                image={require('./images/react-lake.jpg')}
            >
                <Text style={{margin: 10}}>
                    {campsite.description}
                </Text>
            </Card>
        );
    }
    return <View />; //If there is nothing in the campsite object, returns an empty view
}

class CampsiteInfo extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            campsites: CAMPSITES
        };
    }

    static navigationOptions = { //Sets the title for the screen
        title: 'Campsite Information'
    }

    render() {
        const campsiteId = this.props.navigation.getParam('campsiteId');//Directory component navigates here and has a parameter that holds the campsiteId being passed. It is automatically passed through the naviagation prop that is passed to all "screens".
        const campsite = this.state.campsites.filter(campsite => campsite.id === campsiteId)[0]; //Campsite array is in the local state, use the ID from above to filter that array for the campsite object with the correct id.
        return <RenderCampsite campsite={campsite} />; 
    }
}

export default CampsiteInfo;