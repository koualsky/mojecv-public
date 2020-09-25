import React, { Component } from 'react';
import './App.css';
import Cv from './Cv';
import { BrowserRouter, Route } from 'react-router-dom'


//const CVID = 1;
const SENDTIME = 4; // Auto-save delay


export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
        response: [],
        count: SENDTIME,
    };
    this.handleUp = this.handleUp.bind(this);
  }

  handleUp(count, response) {
    this.setState({count: count, response: response});
  }

  render() {
    return (
      <div id="app">
        <BrowserRouter>
          <Route path="/app/:id" render={(props) => <Cv id={props.match.params.id} sec={SENDTIME} onHandleUp={this.handleUp} />}/>
        </BrowserRouter>
      </div>
    )
  }
}