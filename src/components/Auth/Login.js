import React from 'react'
import { Grid, Form, Segment, Button, Header, Message, Icon } from
    'semantic-ui-react';
import {Link} from 'react-router-dom'

import firebase from '../../firebase';


class Login extends React.Component {
    state = {
        email : '',
        password : '',
        errors : [],
        loading : false
    }

    handleChange = (event) => {this.setState({ [event.target.name] : event.target.value}) }

    displayErrors =()=>{
        const {errors} = this.state
        return errors.map((err,i)=> <p key={i}>{err.message}</p>)
    }

    handleSubmit = (event) => {
        const {email,password} = this.state
        event.preventDefault();
        if(this.formValid()){
            this.setState({errors:[],loading:true})
            firebase.auth().signInWithEmailAndPassword(email,password)
            .then(signedUser =>{
                this.setState({errors:[],loading:false})
                console.log(signedUser)
            })
            .catch(err =>{
                this.setState({errors:this.state.errors.concat(err),loading:false})
            })
        }
    }

    formValid =()=>{
        const {email,password} = this.state
        return email && password
    }

    handleInputError = (errors,inputName)=>{
        return errors.some(err => err.message.toLowerCase().includes(inputName)) ? 'error' : ''
    }

    render() {
        const {email,password,errors,loading} = this.state
        return (
            <Grid textAlign='center' verticalAlign='middle' className="App">
                <Grid.Column style={{ maxWidth: 450 }}>
                    <Header as="h2" icon color="violet" textAlign="center">
                        <Icon name="code branch" color="violet" />
                        Login to DevChat
                    </Header>
                    <Form size="large" onSubmit={this.handleSubmit}>
                        <Segment stacked>

                            <Form.Input fluid name="email" icon="mail"
                                className={this.handleInputError(errors,'email')}
                                iconPosition="left" placeholder="Email" onChange={this.handleChange}
                                value={email}
                                type="email" />

                            <Form.Input fluid name="password" icon="lock"
                                className={this.handleInputError(errors,'password')}
                                iconPosition="left" placeholder="Password" onChange={this.handleChange}
                                value={password}
                                type="password" />

                                <Button disabled={loading}
                                className={loading ? 'loading' : ''} color="violet" fluid size="large">Submit</Button>

                        </Segment>
                    </Form>
                    {
                        errors.length > 0 && (
                            <Message error>
                                <h3> Error</h3>
                                {this.displayErrors()}
                            </Message>
                        )
                    }
                    <Message>
                    Don't Have a account? <Link to="/register">Register</Link>
                    </Message>
                </Grid.Column>
            </Grid>
        )
    }
}

export default Login