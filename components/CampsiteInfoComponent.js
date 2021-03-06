import React from 'react';
import { Text, View } from 'react-native';
import { Card } from 'react-native-elements';

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

function CampsiteInfo(props) { //functional component that gets props
    return <RenderCampsite campsite={props.campsite} />; //Pull a campsite object from props and send it to a component called RenderCampsite
}

export default CampsiteInfo;