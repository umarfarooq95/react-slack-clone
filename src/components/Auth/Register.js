import React from 'react'
import { Grid, Form, Segment, Button, Header, Message, Icon } from
    'semantic-ui-react';
import {Link} from 'react-router-dom'
import md5 from 'md5';

import firebase from '../../firebase';


class Register extends React.Component {
    state = {
        username : '',
        email : '',
        password : '',
        passwordConfirmation : '',
        errors : [],
        loading : false,
        usersRef : firebase.database().ref('users')
    }

    handleChange = (event) => {this.setState({ [event.target.name] : event.target.value}) }

    isFormValid = () => {
        let errors = [];
        let error;

        if(this.isFormEmpty()){
            //throw err
            error = {message : 'Fill in all Fields'}
            this.setState({errors:errors.concat(error)})
            return false;
        }
        else if (!this.passwordValid()){
            //throw err
            error = {message : 'Password is Invalid'}
            this.setState({errors:errors.concat(error)})
            return false;
        }
        else {
            //form valid
            return true;
        }
    }

    displayErrors =()=>{
        const {errors} = this.state
        return errors.map((err,i)=> <p key={i}>{err.message}</p>)
    }

    passwordValid = () => {
        const {password,passwordConfirmation} = this.state
        if(password.length < 6 || passwordConfirmation.length < 6){
            return false
        }
        else if (password !=passwordConfirmation){
            return false
        }
        else {
            return true;
        }
    }

    isFormEmpty = () => {
        const {email,password,username,passwordConfirmation} = this.state
        return !username.length || !email.length || !password.length || !passwordConfirmation.length
    }

    handleSubmit = (event) => {
        event.preventDefault();
        if(this.isFormValid()){
            this.setState({errors:[],loading:true})
            const {email,password,username} = this.state
            firebase
            .auth()
            .createUserWithEmailAndPassword(email,password)
            .then((createdUser) => {
                    createdUser.user.updateProfile({
                            displayName: username,
                            photoURL: `http://gravatar.com/avatar/${md5(createdUser.user.email)}?d=identicon`
                        })
                        .then(() => {
                            this.saveCreatedUser(createdUser)
                            .then(()=>{
                                console.log("user saved")
                                this.setState({
                                    loading: false
                                })
                            })
                        })
                        .catch((err) => {
                            this.setState({
                                errors: this.state.errors.concat(err),
                                loading: false
                            })
                        })
                })
                .err((err) => {
                    console.log(err)
                    this.setState({
                        errors: this.state.errors.concat(err),
                        loading: false
                    })
                })
        }
    }

    handleInputError = (errors,inputName)=>{
        return errors.some(err => err.message.toLowerCase().includes(inputName)) ? 'error' : ''
    }

    saveCreatedUser=(createdUser)=>{
        return this.state.usersRef.child(createdUser.user.uid).set({
            name :  createdUser.user.displayName,
            avatar : createdUser.user.photoURL
        })
    }

    render() {
        const {username,email,password,passwordConfirmation,errors,loading} = this.state
        return (
            <Grid textAlign='center' verticalAlign='middle' className="App">
                <Grid.Column style={{ maxWidth: 450 }}>
                    <Header as="h2" icon color="orange" textAlign="center">
                        <Icon name="puzzle piece" color="orange" />
                        Register for DevChat
                    </Header>
                    <Form size="large" onSubmit={this.handleSubmit}>
                        <Segment stacked>
                            <Form.Input fluid name="username" icon="user"
                                iconPosition="left" placeholder="UserName" onChange={this.handleChange}
                                value={username}
                                type="text" />

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

                                <Form.Input fluid name="passwordConfirmation" icon="repeat"
                                className={this.handleInputError(errors,'password')}
                                iconPosition="left" placeholder="Password Confirmation" onChange={this.handleChange}
                                value={passwordConfirmation}
                                type="password" />

                                <Button disabled={loading}
                                className={loading ? 'loading' : ''} color="orange" fluid size="large">Submit</Button>

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
                    Already a User ? <Link to="/login">Login</Link>
                    </Message>
                </Grid.Column>
            </Grid>
        )
    }
}

export default Register