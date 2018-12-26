import React from 'react';
import {Segment,Input, Button} from 'semantic-ui-react'
import firebase  from '../../firebase';


class MessagesForm extends React.Component{
    state = {
        message : "",
        loading : false,
        errors : [],
    }

    handleChange = e => {
        this.setState({
            [e.target.name] : e.target.value
        })
    }

    createMessage = () => {
        const { currentUser } = this.props
        const message = {
            content : this.state.message,
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            user : {
                 id : currentUser.uid,
                 name : currentUser.displayName,
                 avatar : currentUser.photoURL
            }
        }
        return message;
    }

    sendMessage = () => {
        const { messagesRef,channel } = this.props
        const { message } = this.state
        if(message){
            this.setState({loading : true})
            messagesRef.child(channel.id)
                .push()
                .set(this.createMessage())
                .then (()=>{
                    this.setState({
                       loading : false,
                       message : '',
                       errors : []
                    })
                })
                .catch ((err)=>{
                    this.setState({
                       loading : false,
                       errors : this.state.errors.concat(err)
                    })
            })

        }
        else {
            this.setState({
                errors : this.state.errors.concat({message : 'Add a message'})
             })
        }
    }


    render (){
        const {errors,message,loading } = this.state
        return (
            <Segment className="message__form">
                <Input
                    fluid
                    name="message"
                    value={message}
                    onChange={this.handleChange}
                    style={{marginBottom:'0.7em'}}
                    label={<Button icon="add"/>}
                    labelPosition="left"
                    className={errors.some(err => err.message.includes('message')) ? "error" : ""}
                    placeholder="Write Your messages"
                />
                <Button.Group icon widths="2">
                    <Button
                        color="orange"
                        disabled={loading}
                        onClick={this.sendMessage}
                        content="Add Reply"
                        labelPosition="left"
                        icon="edit"
                    />
                    <Button
                    color="teal"
                    content="Upload Media"
                    labelPosition="right"
                    icon="cloud upload"
                    />
                </Button.Group>

            </Segment>
        )
    }
}

export default MessagesForm;