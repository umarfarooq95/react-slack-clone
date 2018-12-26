import React from 'react';
import { connect } from 'react-redux';
import { Grid } from 'semantic-ui-react';
import ColorPanel from './components/ColorPanel/ColorPanel';
import SidePanel from './components/SidePanel/SidePanel';
import Messages from './components/Messages/Messages';
import MetaPanel from './components/MetaPanel/MetaPanel';
import './App.css';

class App extends React.Component {
  render() {
    return (
    <Grid columns='equal' className='app'
    style={{background : '#eee',height: '100%',marginTop: 0,marginLeft: 0}}>
      <ColorPanel/>
      <SidePanel
      key={this.props.currentUser && this.props.currentUser.id}
      currentUser={this.props.currentUser}
      />
      <Grid.Column style={{marginLeft : 320}}>
        <Messages
        key={this.props.currentChannel && this.props.currentChannel.id}
        currentChannel={this.props.currentChannel}
        currentUser={this.props.currentUser}
        />
      </Grid.Column>
      <Grid.Column width={4}>
        <MetaPanel/>
      </Grid.Column>
    </Grid>
    );
  }
}

const mapStateToProps = state => ({
  currentUser : state.user.currentUser,
  currentChannel : state.channel.currentChannel
})

export default connect(mapStateToProps)(App)
