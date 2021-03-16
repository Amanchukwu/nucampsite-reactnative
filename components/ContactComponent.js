import React, { Component } from 'react';
import { ScrollView, Text } from 'react-native';
import { Card } from 'react-native-elements';
import * as Animatable from 'react-native-animatable';

class Contact extends Component {
    
    static navigationOptions = { //Sets up screen title
        title: 'Contact Us'
    }
    
    render() {
        return (
            <ScrollView>
            <Animatable.View animation='fadeInDown' duration={2000} delay={1000} /*"Animatable.View" is a built in adaptation of the <View> component. "animation" is a built in property and 'fadeInDown' is a built in condition. "delay" will wait X amount after the component is mounted before animation starts.*/ >
                    <Card
                        title="Contact Information"
                        wrapperStyle={{margin: 10}}
                    >
                        <Text>1 Nucamp Way</Text>
                        <Text>Seattle, WA 98001</Text>
                        <Text style={{marginBottom: 10}}>U.S.A.</Text>
                        <Text>Phone: 1-206-555-1234</Text>
                        <Text>Email: campsites@nucamp.co</Text>
                    </Card>
                </Animatable.View>     
            </ScrollView> 
        );
    }
}

export default Contact;