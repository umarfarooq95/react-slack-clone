import React from 'react';
import {Segment,Comment} from 'semantic-ui-react'
import MessagesHeader from './MessagesHeader'
import MessagesForm from './MessagesForm'
import Message from './Message'
import firebase  from '../../firebase';

class Messages extends React.Component{

    state= {
        messagesRef : firebase.database().ref('messages'),
        channel : this.props.currentChannel,
        user : this.props.currentUser,
        messages : [],
        messagesLoading : true,
    }

    componentDidMount () {
        const {channel,user} = this.state

        if(channel && user) {
            this.addListeners (channel.id)
        }
    }

    addListeners = channelId => {
        this.addMessageListener (channelId)
    }

    addMessageListener = channelId => {
        let loadedMessage = [];
        this.state.messagesRef.child(channelId).on('child_added',snap=>{
            loadedMessage.push(snap.val())
            this.setState({
                messages : loadedMessage,
                messagesLoading : false
            })
        })
    }


    displayMessages = messages => {
       return messages.length > 0 && messages.map((message)=> {
          return <Message
                key={message.timestamp}
                message={message}
                user={this.state.user}
            />
        })
    }


    render (){
        const {messagesRef,channel,user,messages} = this.state
        return (
          <React.Fragment>
            <MessagesHeader/>

            <Segment>
                <Comment.Group className="messages">
                    {this.displayMessages(messages)}
                </Comment.Group>
            </Segment>

            <MessagesForm
                messagesRef={messagesRef}
                currentUser={user}
                channel={channel}
            />
          </React.Fragment>
        )
    }
}

export default Messages;