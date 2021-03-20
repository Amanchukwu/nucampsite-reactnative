import React, { Component } from 'react';
import { Text, View, ScrollView, StyleSheet,
    Picker, Switch, Button, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Animatable from 'react-native-animatable';

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
                   onPress: () => this.resetForm(),
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


/*
                    <Modal
                        animationType={'slide'} //Built in, there are a few options
                        transparent={false} //THis makes it opaque
                        visible={this.state.showModal} //"visible" will be set to what is stored in the state
                        onRequestClose={() => this.toggleModal()} //Gets triggered if user uses the hardware back button on their device and will call the "toggleModal" function.
                    >
                        <View style={styles.modal}>
                            <Text style={styles.modalTitle}>Search Campsite Reservations</Text>
                            <Text style={styles.modalText}>
                                Number of Campers: {this.state.campers}
                            </Text>
                            <Text style={styles.modalText}>
                                Hike-In?: {this.state.hikeIn ? 'Yes' : 'No' /*Use terinary operator to set Yes or No depending on the state.hikeIn value. If the value is true, Yes will be displayed, otherwise No will be displayed
                                </Text>
                                <Text style={styles.modalText} /*Shows the date from the state >
                                    Date: {this.state.date.toLocaleDateString('en-US')}
                                </Text>
                                <Button
                                    onPress={() => { //built in prop that is set up to toggle the modal and reset the form
                                        this.toggleModal();
                                        this.resetForm();
                                    }}
                                    color='#5637DD'
                                    title='Close'
                                />
                            </View>
                        </Modal>
*/
    