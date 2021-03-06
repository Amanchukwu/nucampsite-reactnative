import React, { Component } from 'react';
import { FlatList } from 'react-native';
import { ListItem } from 'react-native-elements';
import { CAMPSITES } from '../shared/campsites';

class Directory extends Component {

    constructor(props) {
        super(props);
        this.state = {
            campsites: CAMPSITES
        };
    }

    static navigationOptions = { //Header text. "static" JS keyword that sets a method on the class itself instead of the object that the class creates.  This sets the 
        title: 'Directory'
    }

    render() {
        const { navigate } = this.props.navigation; //Each "screen" is automatically provided with the "navigation" prop which contains a lot of built in functions. "navigate" is one of the built in functions and here it is being destructured since it's the only one we need.
        const renderDirectoryItem = ({item}) => {
            return (
                <ListItem
                    title={item.name}
                    subtitle={item.description}
                    onPress={() => navigate('CampsiteInfo', { campsiteId: item.id })} //2 arguments, name of the screen to navigate to. 2nd argument, adds extra parameters to the route; in this case we are specifying a parameter called "campsiteId" and will give it the id of the campsite that was pressed. Now when an item in the directory is pressed, it will call the "navigate" function from React Navigation in order to switch to the CampsiteInfo screen and the campsiteId parameter will be used to pass the correct campsite object to the screen.
                    leftAvatar={{ source: require('./images/react-lake.jpg')}}
                />
            );
        };

        return (
            <FlatList
                data={this.state.campsites}
                renderItem={renderDirectoryItem}
                keyExtractor={item => item.id.toString()}
            />
        );
    }
}

export default Directory;