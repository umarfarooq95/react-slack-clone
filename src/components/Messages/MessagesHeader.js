import React from 'react';
import {Header,Segment,Input, Icon} from 'semantic-ui-react'

class MessagesHeader extends React.Component{
    render (){
        const {channelName,numUniqueUsers,handleSearchChange,searchLoading} = this.props
        return (
         <Segment clearing>
            <Header fluid="true" as="h2" floated="left" style={{marginBottom:0}}>
                <span>
                    {channelName}
                    <Icon name={"star outline"} color="black"/>
                </span>
                <Header.Subheader>
                   {numUniqueUsers}
                </Header.Subheader>
            </Header>
            <Header floated="right">
                <Input icon="search"
                loading={searchLoading}
                onChange={handleSearchChange}
                size="mini" name="searchTerm"
                placeholder="search Messages"/>
            </Header>
         </Segment>
        )
    }
}

export default MessagesHeader;