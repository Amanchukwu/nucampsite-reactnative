import React, { Component } from 'react';
import { Text, View, ScrollView, FlatList } from 'react-native';
import { Card, Icon } from 'react-native-elements';
import { CAMPSITES } from '../shared/campsites';
import { COMMENTS } from '../shared/comments';  //Flow of comments through app: COMMENTS array is imported from shared directory, it is then brought into the local state of the "CampsiteInfo" component as "this.state.comments", just the comments for the target campsite are filtered into a new array called "comments", that array is passed into the "RenderComments" component as props within "CampsiteInfo" component, then in the "RenderComments" component, that array is used as the "data" for the <FlatList>, then the "renderCommentItem" function takes each comment in the array and renders it to its final form using <Text> components. Then the "RenderComments" component returns a card with all the comments in it to the "CampsiteInfo" component. "RenderComments" is wrapped in <ScrollView> which is then returned through the navigators to the "MainComponent", then "Main" is returned to the "App" component which renders everything to the devics.

function RenderCampsite(props) { //Pass entire props into argument from the props object it receives from CampsiteInfo component
    
    const {campsite} = props;//Destructure "campsite" from props
   
    if (campsite) { //make sure the object is not null or undefined
        return (
            <Card 
                featuredTitle={campsite.name} 
                image={require('./images/react-lake.jpg')}
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
    
    constructor(props) {
        super(props);
        this.state = {
            campsites: CAMPSITES,
            comments: COMMENTS,
            favorite: false //Stores whether or not the current campsite has been marked as a favorite
        };
    }

//Event handler that will toggle if "this.favorite" is true or false
    markFavorite() {
        this.setState({favorite: true});
    }

    static navigationOptions = { //Sets the title for the screen
        title: 'Campsite Information'
    }

    render() {
        const campsiteId = this.props.navigation.getParam('campsiteId');//Directory component navigates here and has a parameter that holds the campsiteId being passed. It is automatically passed through the naviagation prop that is passed to all "screens".
        const campsite = this.state.campsites.filter(campsite => campsite.id === campsiteId)[0]; //Campsite array is in the local state, use the ID from above to filter that array for the campsite object with the correct id.
        const comments = this.state.comments.filter(comment => comment.campsiteId === campsiteId); //Filter out all the comments that have a campsiteId property that matches the campsite Id we are trying to display. Makes an array of all the comments that match the campsiteId
        return (
            <ScrollView /*Used because can't "return" more than one component. Not sure why ScrollView was chosen.*/> 
                <RenderCampsite campsite={campsite} /*Need to pass "markFavorite" and "favorite" to the "RenderCampsite" component so the "onPress" will work for the Icon */
                    favorite={this.state.favorite}
                    markFavorite={() => this.markFavorite()}
                />
                <RenderComments comments={comments} /*display the RenderComments component while passing it props of the filtered list of "comments" made above.*/ />
            </ScrollView>
        ); 
    }
}

export default CampsiteInfo;