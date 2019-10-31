import React, {Component} from 'react';
import ReactDOM from "react-dom";
import {BrowserRouter, Route, Switch} from 'react-router-dom';

import MenuBar from './MenuBar';
import SidebarDrawer from './SidebarDrawer';
import HomePage from './HomePage';

import Search from './Search';
import Login from './auth/Login.js';
import Register from './auth/Register.js';
import Logout from './auth/Logout.js';

import Auth from './auth/Auth.js';

export default class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			sidebarOpen: false
		}

		this.auth = new Auth(this);

		this.toggleSidebar = this.toggleSidebar.bind(this);
	}

	// TODO: implement auth change to be called from Login.js then update SidebarDrawer.js

	toggleSidebar(event) {
		if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
			return;
		}

		this.setState({
			sidebarOpen: !this.state.sidebarOpen
		});
	}

	render() {
		return (
			<BrowserRouter>
				<MenuBar toggleSidebar={this.toggleSidebar} />
				<SidebarDrawer open={this.state.sidebarOpen} toggleSidebar={this.toggleSidebar} user={this.state.user} />
				<Switch>
					<Route exact path="/" component={HomePage} />
					<Route path="/search" component={Search} />
					<Route path="/login" render={(props) => <Login {...props} authenticate={this.auth.authenticate} />} />
					<Route path="/register" component={Register} />
					<Route path="/logout" render={(props) => <Logout {...props} logout={this.auth.logout} />} />
				</Switch>
			</BrowserRouter>
		);
	}
}

ReactDOM.render(<App />, document.getElementById('app'));
