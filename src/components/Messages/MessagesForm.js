import React from 'react';
import uuidv4 from 'uuid/v4'
import {Segment,Input, Button} from 'semantic-ui-react'
import firebase  from '../../firebase';
import FileModal from './FileModal';


class MessagesForm extends React.Component{
    state = {
        storageRef : firebase.storage().ref(),
        uploadTask : null,
        uploadState : "",
        message : "",
        loading : false,
        errors : [],
        modal : false,
        percentUploaded : 0
    }

    openModal = () => this.setState({modal : true})

    closeModal = () => this.setState({modal : false})

    handleChange = e => {
        this.setState({
            [e.target.name] : e.target.value
        })
    }

    uploadFile = (file,metaData) => {
        const pathToUpload = this.props.channel.id
        const ref = this.props.messagesRef
        const filePath = `chat/public/${uuidv4()}.jpg`

        this.setState({
            uploadState : "uploading...",
            uploadTask : this.state.storageRef.child(filePath).put(file,metaData)
        },
        () =>{
            this.state.uploadTask.on('state_changed',snap => {
                const percentUploaded = Math.round((snap.bytesTransferred / snap.totalBytes) * 100)
                this.setState({percentUploaded})
            },
            err => {
                console.error(err);
                this.setState({
                    errors : this.state.errors.concat(err),
                    uploadState : 'error',
                    uploadTask : null
                })

            },

            () => {
                this.state.uploadTask.snapshot.ref.getDownloadURL().then(downloadUrl => {
                    this.sendFileMessage(downloadUrl,ref,pathToUpload)
                })
                .catch(err=>{
                    console.error(err);
                    this.setState({
                        errors : this.state.errors.concat(err),
                        uploadState : 'error',
                        uploadTask : null
                    })
                })
            }
            )}
        )
    }

    sendFileMessage = (downloadUrl,ref,pathToUpload) => {
        ref.child(pathToUpload)
        .push()
        .set(this.createMessage(downloadUrl))
        .then(()=>{
            this.setState({
                uploadState : 'done',
            })
        })
        .catch(err=>{
            console.error(err);
            this.setState({
                errors : this.state.errors.concat(err)
            })
        })
    }

    createMessage = (fileUrl = null) => {
        const { currentUser } = this.props
        const message = {
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            user : {
                 id : currentUser.uid,
                 name : currentUser.displayName,
                 avatar : currentUser.photoURL
            }
        }
        if(fileUrl !==null){
            message['image'] = fileUrl
        }
        else {
            message['content'] = this.state.message;
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
        const {errors,message,loading,modal } = this.state
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
                    onClick={this.openModal}
                    content="Upload Media"
                    labelPosition="right"
                    icon="cloud upload"
                    />
                    <FileModal
                        modal={modal}
                        uploadFile={this.uploadFile}
                        closeModal={this.closeModal}
                    />
                </Button.Group>

            </Segment>
        )
    }
}

export default MessagesForm;