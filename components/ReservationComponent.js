import React, { Component } from 'react';
import { Text, View, ScrollView, StyleSheet,
    Picker, Switch, Button, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Animatable from 'react-native-animatable';
import * as Notifications from 'expo-notifications';

//Creating this form as a react controlled form where the form data is stored in and controlled by the component itself instead of redux
class Reservation extends Component { 

    constructor(props) {
        super(props);

        this.state = { //Initialze the values for each form input
            campers: 1,
            hikeIn: false,
            date: new Date(), //JS built in "Date()" function
            showCalendar: false,
        };
    }

    static navigationOptions = { //Will be a stack navigator screen, so add navigationOptions
        title: 'Reserve Campsite'
    }

    handleReservation() { //Will need to handle when the form is submitted
        console.log(JSON.stringify(this.state));//Echo back the form data 
        
        const message = `Number of Campers: ${this.state.campers}
        \nHike-In? ${this.state.hikeIn}
        \nDate: ${this.state.date.toLocaleDateString('en-US')}`

        Alert.alert(
            'Begin Search?',
            message,
            [
               {
                   text: 'Cancel',
                   onPress: () => this.resetForm(),
                   style: 'cancel'
               },
               {
                   text: 'OK',
                   onPress: () => {
                        this.presentLocalNotification(this.state.date.toLocaleDateString('en-US')); //Call the "presentLocalNotification" async function that we created and pass in the date which is taken from the reservations component's local state.
                        this.resetForm();
                    }
                }
            ]
        )
    }

    resetForm() {
        this.setState({
            campers: 1,
            hikeIn: false,
            date: new Date(),
            showCalendar: false,
            showModal: false
        });
    }

    async presentLocalNotification(date) { //async/await syntax. Want to use promises and asynchronous code because we have to request permissions and wait for a response before continuing. We create an "async" funciton (a special type of function that always returns a promise) using the "async" JS keyword and assigning it a function name "presentLocalNotification" giving it a parameter of "date" which we want to be the reservaiton date. Will be called in the alert's "OK" button.
        function sendNotification() { //Dont want to send notification right away because first have to verifiy from that we have permission to do so, so put our notificaiton sending code inside another function that can be called when we are ready.
            Notifications.setNotificationHandler({ //override default behavior of notification not showing when app is in foreground.  "setNotificationHandler" is a built in method from the Notifications API for this purpose.
                handleNotification: async () => ({ //documentation says to set it up this way to show an alert
                    shouldShowAlert: true
                })
            });

            Notifications.scheduleNotificationAsync({ //Built in by Notifications API. Pass in object called "content" 
                content: {
                    title: 'Your Campsite Reservation Search',
                    body: `Search for ${date} requested` //pass in "date" variable that was passed into the "presentLocalNotification" function
                },
                trigger: null //THis causes the notfication to fire immediately. Can be used to schedule the notification in the future & set to repeat.
            });
        }

        //Need to check if we have permission to send notifications at all.  
        let permissions = await Notifications.getPermissionsAsync();  //Create a variable called "permissions" and set to the value seen here. The "await" keyword can only be used inside an "async function". The Notifications API tells us that the ".getPermissionsAsync()" method wil check for if the app already has notificaitons permission from the device. Will return a promise that will fulfill with the result of that check. Using this method with the "await" keyword will cause the "presentLocalNotification" method to stop and wait for this promise to be fulfilled, once it does, it will assign the promise's result to the "permissions" variable.
        if (!permissions.granted) { //Once done waiting, check if the permissions were not granted. If they were, the "permissions.granted" object  would have a "true" value. If the NOT (!) "permissions.granted" were true, that means we were not able to verify existing permissions (not that they were denied).
            permissions = await Notifications.requestPermissionsAsync(); //Make an explicit request for permissions since they dont already exist.  "await" will stop the code unitl the promise from ".requestPermissionsAsync()" is fulfilled. Then store in the "permissions" variable.
        }
        if (permissions.granted) { //Check one more time if permissions were granted. If yes, the "permissions.granted" object is truthy, that means we already had permissions or we were able to request and get permissions. Then call "sendNotification" method that we defined earlier. Otherwise, we won't do anything at all.
            sendNotification();
        }
    }

    render() {
        return (
            <ScrollView /*Create the form inside a <ScrollView> component */> 
                <Animatable.View animation='zoomIn' duration={2000} delay={1000}>
                    <View style={styles.formRow} /*When building a form, put each form input inside of its own view*/>
                        <Text style={styles.formLabel}>Number of Campers</Text>
                        <Picker //Want to give the user the option to choose between 1 and 6 (would use Option and Select elements in HTML), use <Picker> in React Native
                            style={styles.formItem}
                            selectedValue={this.state.campers} //<Picker> comes with a built in prop called selectedValue which we set to
                            onValueChange={itemValue => this.setState({campers: itemValue})}//<Picker> comes with a built in prop called "onValueChange" which we pass a callback funciton with a "itemValue" parameter and it will update the component's state's camper's property with that itemValue. When user selects a value, it will trigger this"onValueChange" prop to update the component's state with that item's value. Then the "selectedValue" prop will be updated to match the current state so the picker knows which item to display as the current selection.
                        >
                            <Picker.Item label='1' value='1' /* "label" is what the user sees, the "value" is what is passed to the "onValueChange" prop when the user makes a selection*//>
                            <Picker.Item label='2' value='2' />
                            <Picker.Item label='3' value='3' />
                            <Picker.Item label='4' value='4' />
                            <Picker.Item label='5' value='5' />
                            <Picker.Item label='6' value='6' />
                        </Picker>
                    </View>
                    <View style={styles.formRow}>
                        <Text style={styles.formLabel}>Hike-In?</Text>
                        <Switch //Built in React Native component <Switch> is designed
                            style={styles.formItem} 
                            value={this.state.hikeIn} //Built in prop, 
                            trackColor={{true: '#5637DD', false: null}} //Built in prop, give a color if the value is true or false
                            onValueChange={value => this.setState({hikeIn: value})} //Built in prop, triggered when the user changes the value. This prop takes a callback funciton to which we pass the "value" parameter which contains the value the user has changed to and it will update the ReservationComponents's state with a new value.
                        />
                    </View>
                    <View style={styles.formRow}>
                        <Text style={styles.formLabel}>Date</Text> 
                        <Button
                            onPress={() => //Built in prop, toggle a new state value called "showCalender" by using the logical not operator
                                this.setState({showCalendar: !this.state.showCalendar})
                            }
                            title={this.state.date.toLocaleDateString('en-US')}//Built in prop, 
                            color='#5637DD' //built in prop
                            accessibilityLabel='Tap me to select a reservation date' //Helps with screen readers
                        />
                    </View>
                    {this.state.showCalendar && ( //Only want to show the calendar if the "showCalendar" state property is set to true from the user clicking the <Button> above. Can use the logical and operator. When the logical and operator is used, if the left side operand is false, then the right side operand is not evaluated at all. Use { } to embed JS inside JSX to say "showCalendar && DateTimePicker". If "showCalendar" is false, the logical and will stop evaluating and not show <DateTimePicker> at all.
                        <DateTimePicker
                            value={this.state.date} //Built in prop, give it a value of the date stored in the state
                            mode={'date'} //Built in prop
                            display='default' //Built in prop
                            onChange={(event, selectedDate) => { //Built in prop, this will cause the selectedDate to be saved to the state.
                                selectedDate && this.setState({date: selectedDate, showCalendar: false}); //When a date is selected, the calendar will also be hidden. If the user cancels out the calendar instead of choosing a date, the set of the date can be undefined, so, use the logical and operator to make sure that the state is set to the selected date only if the "selectedDate" is truthy.
                            }}
                            style={styles.formItem}
                        />
                    )}
                    <View style={styles.formRow}>
                        <Button 
                            onPress={() => 
                                this.handleReservation()
                            } //Built in prop, use the event handler we created above
                            title='Search' //Built in prop, gives button a title
                            color='#5637DD' //Built in prop, give button a color
                            accessibilityLabel='Tap me to search for available campsites to reserve' //for screen readers
                        />
                    </View>
                </Animatable.View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    formRow: {
        alignItems: 'center', 
        justifyContent: 'center',
        flex: 1,
        flexDirection: 'row',
        margin: 20
    },
    formLabel: {
        fontSize: 18,
        flex: 2 //applied to the labels, the label will take up twice as much of the row as the picker
    },
    formItem: {
        flex: 1 //applied to pickers and switch, the picker will then take up half as much of the row as the label
    }
});

export default Reservation;
