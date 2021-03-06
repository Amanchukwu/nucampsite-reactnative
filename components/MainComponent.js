import React, { Component } from 'react';
import Directory from './DirectoryComponent';
import CampsiteInfo from './CampsiteInfoComponent';
import { View } from 'react-native';
import { CAMPSITES } from '../shared/campsites';

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            campsites: CAMPSITES,
            selectedCampsite: null//need to reserve a space in the local state of main component where we keep track of which campsite was selected so we know which one to tell the campsiteInfo component to display
        };
    }


onCampsiteSelect(campsiteId) { //Update the seletedCampsite property in the state whenever a campsite is selected. Pass in the "campsiteId"
    this.setState({selectedCampsite: campsiteId});
}

    render() {
        return (//Can only return one component, so wrap with <View>. "style" attribute below makes it a flexible component of normal size
            <View style={{flex: 1}}>
                <Directory
                    campsites={this.state.campsites}
                    onPress={campsiteId => this.onCampsiteSelect(campsiteId)} //pass an arrow function that contains the onCampsiteSelect. Passing the method to the Directory component so it is availble to be triggered from Directory
                />
                <CampsiteInfo
                    campsite={this.state.campsites.filter( //Want to pass entire campsite object. Take entire array of campsites, filter it and look for matching campiste.id.
                        campsite => campsite.id === this.state.selectedCampsite)[0]}//Filter returns an array, grab first item [0]
                />
            </View>
        );
    }
}

export default Main;