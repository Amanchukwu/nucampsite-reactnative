import React, { Component } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { Input, CheckBox } from 'react-native-elements';
import * as SecureStore from 'expo-secure-store';

class Login extends Component {

    constructor(props) {
        super(props);

        this.state = { //Use the component state to temporarly hold a username and password
            username: '',
            password: '',
            remember: false
        };
    }

    static navigationOptions = {
        title: 'Login'
    }

    handleLogin() {
        console.log(JSON.stringify(this.state));
        if (this.state.remember) { //If remember me checkbox is checked, save the username and password to the secure store 
            SecureStore.setItemAsync(
                'userinfo', //first argument, this is the key
                JSON.stringify({ //Want to store the username and password, but must be converted to a JSON string before it can be stored. So use JSON.stringify on an object containing the username and password taken from the component's state.
                    username: this.state.username,
                    password: this.state.password
                })
            ).catch(error => console.log('Could not save user info', error)); //All SecureStore methods return a promise that will reject if there is an error. Check for a rejected promise by adding this ".catch" block. An error will automatically passed in as an argument, so it can be logged to the console in this manner.
        } else { //Also want to handle the case for if the remember me checkbox is not checked, in which case, we want to delete any user info in the secure store.
            SecureStore.deleteItemAsync('userinfo').catch( //will delete any data stored under the key "userinfo" if there no data, nothing will happen.  If there is data, it will get deleted and a promise will be returned.  Can check for a rejected promise by adding the ".catch" block
                error => console.log('Could not delete user info', error)
            );
        }
    }

    componentDidMount() { //Ensure that the user info is retrieved from the secure store when the component mounts. Use the "componentDidMount()" lifecycle method (built into React and React Native). Since the user info gets deleted from the store if the remeber me check box is unchecked when the form is submitted that means that if ther is any user info in the store we can deduce that the remember me check box was checked the last time the form was submitted. Therefore, use the "getItemAsync" method to check if there is any data saved under the key "userinfo"
        SecureStore.getItemAsync('userinfo') //Check if there is any data saved under the key "userinfo".  Will returen a promise that, if it resolves, will return the value stored under the key.  That means we can access the value using the JS ".then" method.
            .then(userdata => { //"userdata" is just an intermediate variable name that should contain the JSON string with the username and password
                const userinfo = JSON.parse(userdata); //Must change the JSON string back to a JS object using "JSON.parse" method and store it inside a variable called "userinfo"
                if (userinfo) { //check to make sure that the "userinfo" variable actually contains a non null, truthy value.  If so update the login component state with the username and password from the "userinfo" object.
                    this.setState({username: userinfo.username});
                    this.setState({password: userinfo.password});
                    this.setState({remember: true})//We know that if there was a username and password saved to the secure store, that means that the last tiem the form was submitted, the remember me checkbox was checked. Because otherwise, the username and password would have been deleted from the secure stoer, so we can logically deduce that the remember me checkbox should be set to true.  
                }
            });
    }

    render() {
        return (
            <View style={styles.container}>
                <Input
                    placeholder='Username'
                    leftIcon={{type: 'font-awesome', name: 'user-o'}}
                    onChangeText={username => this.setState({username})} //whenever the text in the input changes, the state will get updated
                    value={this.state.username} //set the value so that it always reflects the state (which makes it a controlled component)
                    containerStyle={styles.formInput}
                    leftIconContainerStyle={styles.formIcon}
                />
                <Input
                    placeholder='Password'
                    leftIcon={{type: 'font-awesome', name: 'key'}}
                    onChangeText={password => this.setState({password})}
                    value={this.state.password}
                    containerStyle={styles.formInput}
                    leftIconContainerStyle={styles.formIcon}
                />
                <CheckBox
                    title='Remember Me' //checkbox requires a title
                    center //centers the check box
                    checked={this.state.remember} //control whether or not it is checked by setting this property to the state value of "remember"
                    onPress={() => this.setState({remember: !this.state.remember})}
                    containerStyle={styles.formCheckbox}
                />
                <View style={styles.formButton}>
                    <Button
                        onPress={() => this.handleLogin()}
                        title='Login'
                        color='#5637DD'
                    />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({ //required to pass in an object that contains all the styles you are using
    container: {
        justifyContent: 'center',
        margin: 20
    },
    formIcon: {
        marginRight: 10
    },
    formInput: {
        padding: 10
    },
    formCheckbox: {
        margin: 10,
        backgroundColor: null
    },
    formButton: {
        margin: 40
    }
});

export default Login;