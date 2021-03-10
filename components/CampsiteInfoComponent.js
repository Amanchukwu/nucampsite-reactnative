import React, { Component } from 'react';
import { Text, View, ScrollView, FlatList } from 'react-native';
import { Card, Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { postFavorite } from '../redux/ActionCreators';

const mapStateToProps = state => { //Recieves the state as a prop and returns the campsite and comments and favorites data from the state. Redux has defined this way to call what part of the state we are using. This funciton will need to be passed to the "connect" function.
    return {
        campsites: state.campsites,
        comments: state.comments,
        favorites: state.favorites
    };
};

const mapDispatchToProps = { //Added to pass in the "postFavorite" action creator with the "campsiteId" as the parameter. Allows us to access "postFavorite" as props in the <CampsiteInfo> component below
    postFavorite: campsiteId => (postFavorite(campsiteId))
};

function RenderCampsite(props) { //Pass entire props into argument from the props object it receives from CampsiteInfo component
    
    const {campsite} = props;//Destructure "campsite" from props
   
    if (campsite) { //make sure the object is not null or undefined
        return (
            <Card 
                featuredTitle={campsite.name} 
                image={{uri: baseUrl + campsite.image}}
            >
                <Text style={{margin: 10}}>
                    {campsite.description}
                </Text>
                <Icon //Icon component uses icon fonts. Documentation on the icon component will give list of available icons
                    name={props.favorite ? 'heart' : 'heart-o'} //Use {} to embed JS. Use terinary operator to check if "props.favorite" is true, if ture, make the name of the icon 'heart' which is a filled in heart, if false, make the name 'heart-o' which is heart outline
                    type='font-awesome' //type must be sent to 'font-awesome' to use 'font-awesome'
                    color='#f50' //color of icon
                    raised //will give icon a shadow effect
                    reverse //will reverse the color scheme
                    onPress={() => props.favorite ? //"onPress" is a built in property of <Icon>. Pass the "onPress" property the "markFavorite" function by using an arrow function. Terinary operator checks if it's already a favorite, if so, it does nothing, if not, it will make the heart a favorite.
                        console.log('Already set as a favorite') : props.markFavorite()}
                />
            </Card>
        );
    }
    return <View />; //If there is nothing in the campsite object, returns an empty view
}

function RenderComments({comments}) { //it recieves the "comments" array as a property of the props object. Destructur the comments array

    const renderCommentItem = ({item}) => { //Automatically gets an "item" prop (FROM WHERE???) which can be destructured 
        return (//Want to return a few lines of text, so wrap them in the <View> component
            <View style={{margin: 10}}>
                <Text style={{fontSize: 14}}>{item.text}</Text>
                <Text style={{fontSize: 12}}>{item.rating} Stars</Text>
                <Text style={{fontSize: 12}}>{`-- ${item.author}, ${item.date}`} {/*Formatted with template literal syntax ` ` so the dashes and comma can be added.*/} </Text> 
            </View>
        );
    };

    return ( //Want to render the comments in a <Card> component 
        <Card title='Comments'>
            <FlatList //comments are in an array, so use FlatList because it expects its data in the form of an array
                data={comments} //"comments" array is used for the "data" property
                renderItem={renderCommentItem} //"renderItem" property is given a function
                keyExtractor={item => item.id.toString()} //Because all the comments have a unique ID, this can be set to use that ID
            />
        </Card>
    );
}


class CampsiteInfo extends Component {
    
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
                />
                <RenderComments comments={comments} /*display the RenderComments component while passing it props of the filtered list of "comments" made above.*/ />
            </ScrollView>
        ); 
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CampsiteInfo); //Include "mapDispatchToProps" as the second argument being passed into the "connect" function