import React, { Component } from 'react';
import { ScrollView, Text } from 'react-native';
import { Card, Button, Icon  } from 'react-native-elements';
import * as Animatable from 'react-native-animatable';
import * as MailComposer from 'expo-mail-composer';

class Contact extends Component {
    
    static navigationOptions = { //Sets up screen title
        title: 'Contact Us'
    }
    

    sendMail() {
        MailComposer.composeAsync({ //MailComposer method to set up an email, will start an email to device's defalut email client. Give it an argument object that has 3 properties.
            recipients: ['campsites@nucamp.co'], //Array with 1 item
            subject: 'Inquiry',
            body: 'To whom it may concern:'
        })
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
                        <Button //Button added to send email. React Native also has a Button, but this React Native Elements because it has more configuration options (can set icon on button)
                            title="Send Email" //Property built into <Button>
                            buttonStyle={{backgroundColor: '#5637DD', margin: 40}} //Property built into <Button>
                            icon={<Icon
                                name='envelope-o'
                                type='font-awesome'
                                color='#fff'
                                iconStyle={{marginRight: 10}}
                            />}
                            onPress={() => this.sendMail()} //Property built into <Button>. Have it activate the "sendMail" function created above which calls "MailComposer.composeAsync" to create an email
                        />
                    </Card>
                </Animatable.View>     
            </ScrollView> 
        );
    }
}

export default Contact;