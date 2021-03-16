import React, { Component } from 'react';
import { Text, View, ScrollView, FlatList, Modal, Button, StyleSheet, Alert, PanResponder } from 'react-native';
import { Card, Icon, Rating, Input } from 'react-native-elements';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { postFavorite, postComment } from '../redux/ActionCreators';
import * as Animatable from 'react-native-animatable';

const mapStateToProps = state => { //Recieves the state as a prop and returns the campsite and comments and favorites data from the state. Redux has defined this way to call what part of the state we are using. This funciton will need to be passed to the "connect" function.
    return {
        campsites: state.campsites,
        comments: state.comments,
        favorites: state.favorites
    };
};

const mapDispatchToProps = { //Added to pass in the "postFavorite" action creator with the "campsiteId" as the parameter. Allows us to access "postFavorite" as props in the <CampsiteInfo> component below
    postFavorite: campsiteId => (postFavorite(campsiteId)),
    postComment
};

function RenderCampsite(props) { //Pass entire props into argument from the props object it receives from CampsiteInfo component
    
    const {campsite} = props;//Destructure "campsite" from props
   
    const recognizeDrag = ({dx}) => (dx < -200) ? true : false; //As a parameter, this takes an object and descture from it "dx" (distance of a gesture across the x axis). Use terinary operator to return true if the value is less than -200 (means we will recgonize the gesture where there is a horizontal drag to the left that is smaller than -200px)

    const panResponder = PanResponder.create({ //"PanResponder" API is put into a variable called "panResponder". Pass the "create" method an object as an argument that describes what type of responder to create. Predefined event handlers called "Pan handlers" exist and will be used to define this object.
        onStartShouldSetPanResponder: () => true, //built in event handler that is taking an arrow funciton that simply returns true and will activate the pan responder to respond to gestures on the component that it is used on
        onPanResponderEnd: (e, gestureState) => { //built in event handler. Paramter "e" and "gestureState" will hold values that are automatically passed into this event handler. The first paramenter gets a value of the native event object (which is why we chose to name it e. Not actually using it in this program, but need to include it so that the function gets to the second parameter which we need). "gestureState" holds important info about the gesture that just ended.
            console.log('pan responder end', gestureState);
            if (recognizeDrag(gestureState)) { //Call the "recgnizeDrag" function and pass the "gestureState" object to it. This will return with a true value if the gesture was more than 200px to the left (the same as saying if it was less than -200px) - means drag from right to left.
                Alert.alert(
                    'Add Favorite', //Alert title
                    'Are you sure you wish to add ' + campsite.name + ' to favorites?', //Alert body text
                    [ //Array of alert buttons
                        {
                            text: 'Cancel',
                            style: 'cancel',
                            onPress: () => console.log('Cancel Pressed')
                        },
                        {
                            text: 'OK',
                            onPress: () => props.favorite ? //Terinary operator called on press, check if it's already a favorite
                                console.log('Already set as a favorite') : props.markFavorite() //If yes, console.log, if no, run "marFavorite" function
                        }
                    ],
                    { cancelable: false }
                );
            }
            return true; //Finish the onPanResponder and event handler by returning "true" at the end of the method. 
        }
    });

    if (campsite) { //make sure the object is not null or undefined
        return (
            <Animatable.View animation='fadeInDown' duration={2000} delay={1000}  /*"Animatable.View" is a built in adaptation of the <View> component. "animation" is a built in property and 'fadeInDown' is a built in condition. "delay" will wait X amount after the component is mounted before animation starts.*/ {...panResponder.panHandlers} /*To connect the panResponder to this component, use spread syntax to spread out the panResponder's panHandlers then recombine them into one object to pass in as "props" to the componenet.*/ >
                <Card 
                    featuredTitle={campsite.name} 
                    image={{uri: baseUrl + campsite.image}}
                >
                    <Text style={{margin: 10}}>
                        {campsite.description}
                    </Text>
                    <View style={styles.cardRow}>
                        <Icon //Icon component uses icon fonts. Documentation on the icon component will give list of available icons
                            name={props.favorite ? 'heart' : 'heart-o'} //Use {} to embed JS. Use terinary operator to check if "props.favorite" is true, if ture, make the name of the icon 'heart' which is a filled in heart, if false, make the name 'heart-o' which is heart outline
                            type='font-awesome' //type must be sent to 'font-awesome' to use 'font-awesome'
                            color='#f50' //color of icon
                            raised //will give icon a shadow effect
                            reverse //will reverse the color scheme
                            onPress={() => props.favorite ? //"onPress" is a built in property of <Icon>. Pass the "onPress" property the "markFavorite" function by using an arrow function. Terinary operator checks if it's already a favorite, if so, it does nothing, if not, it will make the heart a favorite.
                            console.log('Already set as a favorite') : props.markFavorite()}
                        />
                        <Icon
                            name='pencil'
                            type='font-awesome' 
                            color='#5637DD' 
                            raised 
                            reverse 
                            onPress={() => props.onShowModal()} 
                        />
                    </View>            
                </Card>
            </Animatable.View>
        );
    }
    return <View />; //If there is nothing in the campsite object, returns an empty view
}

function RenderComments({comments}) { //it recieves the "comments" array as a property of the props object. Destructur the comments array

    const renderCommentItem = ({item}) => { //Automatically gets an "item" prop (FROM WHERE???) which can be destructured 
        return (//Want to return a few lines of text, so wrap them in the <View> component
            <View style={{margin: 10}}>  
                <Text style={{fontSize: 14}}>{item.text}</Text>
                <Rating
                    startingValue={item.rating}
                    imageSize={10}
                    style={{alignItems: 'flex-start', paddingVertical: '5%'}}
                    readonly
                /> 
                <Text style={{fontSize: 12}}>{`-- ${item.author}, ${item.date}`} {/*Formatted with template literal syntax ` ` so the dashes and comma can be added.*/} </Text>
            </View>
        );
    };

    return ( //Want to render the comments in a <Card> component 
        <Animatable.View animation='fadeInUp' duration={2000} delay={1000} /*"Animatable.View" is a built in adaptation of the <View> component. "animation" is a built in property and 'fadeInDown' is a built in condition. "delay" will wait X amount after the component is mounted before animation starts.*/ >
                <Card title='Comments'>
                    <FlatList //comments are in an array, so use FlatList because it expects its data in the form of an array
                        data={comments} //"comments" array is used for the "data" property
                        renderItem={renderCommentItem} //"renderItem" property is given a function
                        keyExtractor={item => item.id.toString()} //Because all the comments have a unique ID, this can be set to use that ID
                    />
            </Card>
        </Animatable.View>
    );
}


class CampsiteInfo extends Component {

    constructor(props) {
        super(props);

        this.state = { 
            showModal: false,
            rating: 5,
            author: '',
            text: ''
        };
    }    

    toggleModal() {
        this.setState({showModal: !this.state.showModal});
    }

    handleComment(campsiteId) {
        this.props.postComment(campsiteId, this.state.rating, this.state.author, this.state.text);
        this.toggleModal()
    }

    resetForm() {
        this.setState({
            showModal: false,
            rating: 5,
            author: '',
            text: ''
        });
    }

//Event handler that will toggle if "this.favorite" is true or false. Because an array of campsiteIds is kept in the redux store, instead of tracking a local true or false, we need to pass in the campsiteId that will be marked true or false. Call "postFavorite" action creator which we are able to access as props thanks to setting it up earlier in the "mapDispatchToProps" object & pass it the ID of the campsite that was marked.
    markFavorite(campsiteId) {
        this.props.postFavorite(campsiteId);
    }

    static navigationOptions = { //Sets the title for the screen
        title: 'Campsite Information'
    }

    render() {
        const campsiteId = this.props.navigation.getParam('campsiteId');//Directory component navigates here and has a parameter that holds the campsiteId being passed. It is automatically passed through the naviagation prop that is passed to all "screens".
        const campsite = this.props.campsites.campsites.filter(campsite => campsite.id === campsiteId)[0]; //Campsite array is in the redux store, use the ID from above to filter that array for the campsite object with the correct id.
        const comments = this.props.comments.comments.filter(comment => comment.campsiteId === campsiteId); //Filter out all the comments that have a campsiteId property that matches the campsite Id we are trying to display. Makes an array of all the comments that match the campsiteId
        return (
            <ScrollView /*Used because can't "return" more than one component. Not sure why ScrollView was chosen.*/> 
                <RenderCampsite campsite={campsite} /*Need to pass "markFavorite" and "favorite" to the "RenderCampsite" component so the "onPress" will work for the Icon */
                    favorite={this.props.favorites.includes(campsiteId)}//this tests if the particular campsite that is being rendered exists in the favorites array (which we access through "this.props.favorites"). Then pass the boolean result of true or false to the <RenderCampsite> component.
                    markFavorite={() => this.markFavorite(campsiteId)}//Being passed as a prop to <RenderCampsite>
                    onShowModal={() => this.toggleModal()}
                />
                <RenderComments comments={comments} /*display the RenderComments component while passing it props of the filtered list of "comments" made above.*/ />
                <Modal
                    animationType={'slide'} //Built in, there are a few options
                    transparent={false} //THis makes it opaque
                    visible={this.state.showModal} //"visible" will be set to what is stored in the state
                    onRequestClose={() => this.toggleModal()}
                >
                    <View style={styles.modal}>
                        <Rating 
                            showRating
                            startingValue={this.state.rating}
                            imageSize={40}
                            onFinishRating={rating => this.setState({rating: rating})} 
                            style={{paddingVertical: 10}}
                        />
                        <Input
                            placeholder='Author'
                            leftIcon={
                                <Icon type='font-awesome' name='user-o'/>
                            }
                            leftIconContainerStyle={{paddingRight: 10}}
                            onChangeText={author => this.setState({author: author})} 
                            value={author => this.setState({author: author})} 
                        />
                        <Input
                            placeholder='Comment'
                            leftIcon={{type: 'font-awesome', name: 'comment-o'}}
                            leftIconContainerStyle={{paddingRight: 10}}
                            onChangeText={text => this.setState({text: text})} 
                            value={text => this.setState({text: text})} 
                        />
                        <View style={{margin: 10}}>
                            <Button 
                                onPress={() => { //built in prop that is set up to toggle the modal
                                    this.handleComment(campsiteId);
                                    this.resetForm();
                                }}
                                color='#5637DD'
                                title='Submit'
                            />
                        </View>
                        <View style={{margin: 10}}>
                            <Button 
                                onPress={() => { //built in prop that is set up to toggle the modal
                                    this.toggleModal();
                                    this.resetForm();
                                }}
                                color='#808080'
                                title='Cancel'
                            />
                        </View>
                    </View>
                </Modal>
</ScrollView>
        ); 
    }
}

const styles = StyleSheet.create({
    cardRow: {
        alignItems: 'center', 
        justifyContent: 'center',
        flex: 1,
        flexDirection: 'row',
        margin: 20
    },
    modal: { 
        justifyContent: 'center',
        margin: 20
    },

});

export default connect(mapStateToProps, mapDispatchToProps)(CampsiteInfo); //Include "mapDispatchToProps" as the second argument being passed into the "connect" function