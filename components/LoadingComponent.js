import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

function Loading() { //Set up the "Loading" component as a functional component with a "return" statement
    return (
        <View style={styles.loadingView}> 
            <ActivityIndicator size='large' color='#5637DD' /*Do the styles in-line for this component, this is the spinning circle image*/ /> 
            <Text style={styles.loadingText}>Loading . . .</Text>
        </View>
    );
}

const styles = StyleSheet.create( //Create style sheet and call it a varible named "styles"
    {
        loadingView: {
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1
        },
        loadingText: {
            color: '#5637DD',
            fontSize: 14,
            fontWeight: 'bold'
        }
    }
);

export default Loading;