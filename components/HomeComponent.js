import React, { Component } from 'react';
import { View, Text, Animated } from 'react-native';
import { Card } from 'react-native-elements';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import Loading from './LoadingComponent';

const mapStateToProps = state => { //Recieves the state as a prop and returns the campsite, promotions, and partners data from the state in the redux store. Redux has defined this way to call what part of the state we are using. This funciton will need to be passed to the "connect" function.
    return {
        campsites: state.campsites,
        promotions: state.promotions,
        partners: state.partners
    };
};

function RenderItem(props) { //Need to pass in the "isLoading" and "errMess" props as well as the "item" object, so just use the entire props object
    const {item} = props; //Since passed in the entire "props" object, this line will destructure the "item" object from it. We destructure it because it is called multiple times and destructuring will use less code
    
    if (props.isLoading) { //Check for "isLoading". Could destructure "isLoading" just like the "const {item}" above, but its only being used once, so not worth the extra line of code.
        return <Loading />;
    }
    if (props.errMess) { //Check if there is an error message
        return (
            <View>
                <Text>{props.errMess}</Text>
            </View>
        );
    }
    if (item) {
        return (
            <Card
                featuredTitle={item.name}
                image={{uri: baseUrl + item.image}}
            >
                <Text style={{margin: 10}}>
                    {item.description}
                </Text>
            </Card>
        );
    }
    return <View />;
}

class Home extends Component {

    constructor(props) { //Constuctor must be added because animated value needs to be stored in the local state
        super(props);
        this.state = {
            scaleValue: new Animated.Value(0) //Make a new animated value that is starting at 0, it is being named "scaleValue" but can be named anything.
        };
    }

    animate() { //A method we are creating to store the animation so it can be called. The name "animate" is arbitrary and can be named anything.
        Animated.timing( //Give this method 2 arguments, 1st is the name of the animated value that we want to have change over time, 2nd argument is an object that contains 3 properties
            this.state.scaleValue,
            {
                toValue: 1, //Built in property, What we want the animated value to change to from its initial value. 1 = 100% in terms of scale
                duration: 1500, //Built in property, how long to animate
                useNativeDriver: true //Built in property, helps improve the performance of animations
            }
        ).start(); //Chain a built in method called "start()" to run the animation. (The timing method also has a "stop" method that can be chained to it)
    }

    componentDidMount() { //To start the animation and have it run just 1 time, will call the "animate" method we created within the React lifecycle method "componentDidMount". When the component mounts, it will automatically start the animation.
        this.animate();
    }

    static navigationOptions = { //Sets up screen title
        title: 'Home'
    }

    render() {
        return ( //NOTE FOR LINE 41: Can be used to render groups of items like FlatList. ScrollView loads all at once, FlatList just renders the visible part
            <Animated.ScrollView style={{transform: [{scale: this.state.scaleValue}]}} /*To connect the animation to the rendered component, we changed <ScrollView> to <Animated.ScrollView> which gives us a <ScrollView> component that is hooked up to the Animated API. Set the style using a "transform" style and specify the type of transform we want is "scale" and set the value of the scale to "this.stat.scaleValue" which is a dynamic value that will change when the animation is being run*/> 
                <RenderItem 
                    item={this.props.campsites.campsites.filter(campsite => campsite.featured)[0]} //Takes campsite data from state and searches for the ".featured" attribute that is set to true.
                    isLoading={this.props.campsites.isLoading} //Pass the "isLoading" prop to the <RenderItem> component so it can be used for conditional checks
                    errMess={this.props.campsites.errMess} //Pass the "errorMess" prop to the <RenderItem> component so it can be used for conditional checks
                />
                <RenderItem 
                    item={this.props.promotions.promotions.filter(promotion => promotion.featured)[0]}
                    isLoading={this.props.promotions.isLoading}
                    errMess={this.props.promotions.errMess}
                />
                <RenderItem 
                    item={this.props.partners.partners.filter(partner => partner.featured)[0]}
                    isLoading={this.props.partners.isLoading}
                    errMess={this.props.partners.errMess}
                />
            </Animated.ScrollView>
        );
    }
}

export default connect(mapStateToProps)(Home);