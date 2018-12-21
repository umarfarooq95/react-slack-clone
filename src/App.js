import React from 'react';
import { Grid } from 'semantic-ui-react';
import ColorPanel from './components/ColorPanel/ColorPanel';
import SidePanel from './components/SidePanel/SidePanel';
import Messages from './components/Messages/Messages';
import MetaPanel from './components/MetaPanel/MetaPanel';

class App extends React.Component {
  render() {
    return (
    <Grid columns='equal' className='app'
    style={{background : '#eee',height: '100%',marginTop: 0,marginLeft: 0}}>
      <ColorPanel/>
      <SidePanel/>
      <Grid.Column style={{marginLeft : 320}}>
        <Messages/>
      </Grid.Column>
      <Grid.Column width={4}>
        <MetaPanel/>
      </Grid.Column>
    </Grid>
    );
  }
}

export default App;
