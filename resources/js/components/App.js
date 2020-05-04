import React, {Component} from 'react';
import ReactDOM from "react-dom";
import {BrowserRouter, Route, Switch} from 'react-router-dom';

import MenuBar from './MenuBar';
import SidebarDrawer from './SidebarDrawer';
import HomePage from './HomePage';

import Search from './Search';
import RevisionViewer from './RevisionViewer';
import LyricViewer from './LyricViewer';
import Login from './auth/Login.js';
import Register from './auth/Register.js';
import Logout from './auth/Logout.js';

import Auth from './auth/Auth.js';
import { NotifyProvider } from './Notify.js';

export default class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			sidebarOpen: false
		}

		this.auth = new Auth(this);
		this.toggleSidebar = this.toggleSidebar.bind(this);
	}

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
			<NotifyProvider>
			<BrowserRouter>
				<MenuBar toggleSidebar={this.toggleSidebar} />
				<SidebarDrawer open={this.state.sidebarOpen} toggleSidebar={this.toggleSidebar} user={this.state.user} />
				<div style={{marginTop: '20px'}}>
					<Switch>
						<Route exact path="/" render={(props) => <HomePage {...props} user={this.state.user} />} />
						<Route path="/search" render={(props) => <Search {...props} notify={this.notify} user={this.state.user} />} />
						<Route path="/revision/:id_song" render={(props) => <RevisionViewer user={this.state.user} notify={this.notify} {...props} />} />
						<Route path="/lyric/:id_song" component={LyricViewer} />
						<Route path="/login" render={(props) => <Login {...props} authenticate={this.auth.authenticate} notify={this.notify} />} />
						<Route path="/register" render={(props) => <Register {...props} notify={this.notify} />} />
						<Route path="/logout" render={(props) => <Logout {...props} logout={this.auth.logout} />} />
					</Switch>
				</div>
			</BrowserRouter>
			</NotifyProvider>
		);
	}
}

ReactDOM.render(<App />, document.getElementById('app'));
