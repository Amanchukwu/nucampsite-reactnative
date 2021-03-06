import React from 'react';
import { FlatList } from 'react-native';
import { ListItem } from 'react-native-elements';

function Directory(props) { //Funcitonal component that recieves props from its parent MainComponent

    const renderDirectoryItem = ({item}) => { //"item" is a property of a defalut object that is passed from FlatList. 
        return (
            <ListItem //The current item that is being iterated over can be accessed as "item.".
                title={item.name} 
                subtitle={item.description}
                onPress={() => props.onPress(item.id)} //onPress is built into ListItem, due to this when this component is pressed, the funciton that you give it will automatically fire. onPress was passed in from MainComponent
                leftAvatar={{ source: require('./images/react-lake.jpg')}} //leftAvatar requires an object so 2 sets of {} are needed. 1st defines JSX, 2nd defines object. "requrie" is a funciton provided by node.js.
            />
        );
    };

    return (
        <FlatList //FlatList will iterate through every item in the array that is given to the "data" and then it will run the function in the "renderItem" on every single one of the items
            data={props.campsites} //Tells the FlatList where the data is coming from, expects an array. 
            renderItem={renderDirectoryItem} //Specifies how to render each item in the list, uses a callback function 
            keyExtractor={item => item.id.toString()} //Unique key, expects a string. This sets the unique key for each item.
        />
    );
}

export default Directory;