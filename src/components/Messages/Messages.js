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
        numUniqueUsers : "",
        searchTerm : "",
        searchLoading : false,
        searchResults : []
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
            this.countUniqueUsers(loadedMessage);
        })
    }

    countUniqueUsers = messages => {
        const uniqueUsers = messages.reduce((acc,message)=>{
            if(!acc.includes(message.user.name)){
                acc.push(message.user.name)
            }
            return acc;
        },[])
        const plural = uniqueUsers.length > 1 || uniqueUsers.length === 0
        const numUniqueUsers = `${uniqueUsers.length} user${plural ? 's' : ''}`
        this.setState({numUniqueUsers})
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

    displayChannelName = channel => channel ? `#${channel.name}` : "";

    handleSearchChange = event => {
        this.setState({
            searchTerm : event.target.value,
            searchLoading : true
        },()=> this.handleSearchMessages())
    }

    handleSearchMessages = () => {
        const channelMessages = [...this.state.messages];
        const regex = new RegExp( this.state.searchTerm, "gi");
        const searchResults = channelMessages.reduce((acc,message)=>{
            if(message.content && message.content.match(regex) ||
                message.user.name.match(regex)){
                acc.push(message)
            }
            return acc
        },[])

        this.setState({ searchResults })
       setTimeout(()=> this.setState({ searchLoading : false }),1000)
    }


    render (){
        const {messagesRef,channel,user,messages,numUniqueUsers,searchTerm,
                searchResults,searchLoading} = this.state
        return (
          <React.Fragment>
            <MessagesHeader
             channelName= {this.displayChannelName(channel)}
             numUniqueUsers= {numUniqueUsers}
             searchLoading= {searchLoading}
             handleSearchChange= {this.handleSearchChange}
            />
            <Segment>
                <Comment.Group className="messages">
                    {searchTerm ? this.displayMessages(searchResults) :
                        this.displayMessages(messages)}
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