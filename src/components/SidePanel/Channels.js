import  React  from 'react';
import {connect} from 'react-redux'
import { Menu,Icon, Modal, Form, Input, Button} from 'semantic-ui-react';
import firebase from '../../firebase';
import { setCurrentChannel } from '../../actions/index'
class Channels extends React.Component {
    state = {
        activeChannel : '',
        user : this.props.currentUser,
        channels : [],
        channelName: '',
        channelDetails: '',
        channelsRef : firebase.database().ref('channels'),
        modal : false,
        firstLoad : true,
    }

    componentDidMount () {
        this.addChannelListener()
    }

    componentWillUnmount () {
        this.removeListeners()
    }

    addChannelListener = () => {
        let loadedChannel = [];
        this.state.channelsRef.on('child_added',snap=> {
            loadedChannel.push(snap.val())
            this.setState({
                channels : loadedChannel
            },()=>this.setFirstChannel())
        })
    }

    removeListeners = () => {
        this.state.channelsRef.off();
        console.log('removed listeners');
    }

    setFirstChannel = () => {
        let firstChannel = this.state.channels[0];
        if(this.state.firstLoad && this.state.channels.length > 0) {
            this.props.setCurrentChannel(firstChannel)
            this.setActiveChannel(firstChannel)
        }
        this.setState({firstLoad: false})
    }

    closeModal = () => {
        this.setState({
            modal: false
        })
    }
    openModal = () => {
        this.setState({
            modal: true
        })
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    handleSubmit = (e) => {
        e.preventDefault()
        if(this.formValid(this.state)){
            this.addChannel()
        }
    }

    formValid = ({channelName,channelDetails}) => channelName && channelDetails

    addChannel = () => {
        const { channelsRef,channelName,channelDetails,user} =this.state;
        const key = channelsRef.push().key

        const newChannel = {
            id : key,
            name : channelName,
            details : channelDetails,
            createdBy : {
                name : user.displayName,
                avatar : user.photoURL
            }
        }

        channelsRef.child(key).update(newChannel)
        .then(()=>{
            this.setState({
                channelName: '',
                channelDetails: ''
            })
            this.closeModal()
            console.log('channel Added')
        })
        .catch(console.error)
    }

    displayChannels = channels => (
        channels.map(channel=> {
        return <Menu.Item
        key={channel.id}
        name= {channel.name}
        style={{opacity : 0.7}}
        active ={channel.id === this.state.activeChannel}
        onClick={()=>this.changeChannels(channel)}
        >
        # {channel.name}
        </Menu.Item>
        })
    )

    changeChannels =(channel)=>{
        this.setActiveChannel(channel)
        this.props.setCurrentChannel(channel)
    }

    setActiveChannel = channel => {
        this.setState({
            activeChannel : channel.id
        })
    }


    render (){
        const {channels,modal} = this.state;
        return (
            <React.Fragment>
            <Menu.Menu>
                <Menu.Item>
                    <span>
                        <Icon name="exchange"/> CHANNELS
                    </span> {" "}
                     ({channels.length}) <Icon name="add" onClick={this.openModal}/>
                </Menu.Item>

                {this.displayChannels(channels)}

            </Menu.Menu>

            <Modal basic open={modal} onClose={this.closeModal}>
                <Modal.Header>
                    Add a Channel
                </Modal.Header>
                <Modal.Content>
                    <Form onSubmit={this.handleSubmit}>
                        <Form.Field>
                            <Input
                            fluid
                            label="Name of Channel"
                            name="channelName"
                            onChange={this.handleChange}
                             />
                        </Form.Field>
                        <Form.Field>
                        <Input
                        fluid
                        label="About the Channel"
                        name="channelDetails"
                        onChange={this.handleChange}
                         />
                    </Form.Field>
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button color="green" inverted onClick={this.handleSubmit}>
                        <Icon name="checkmark"/> Add
                    </Button>
                    <Button color="red" inverted onClick={this.closeModal}>
                    <Icon name="remove"/> Cancel
                </Button>
                </Modal.Actions>
            </Modal>
            </React.Fragment>
        )
    }
}

export default connect(null,{setCurrentChannel})(Channels);
