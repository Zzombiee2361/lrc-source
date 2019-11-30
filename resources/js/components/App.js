import React, {Component} from 'react';
import ReactDOM from "react-dom";
import {BrowserRouter, Route, Switch} from 'react-router-dom';

import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';

import CloseIcon from '@material-ui/icons/Close';

import MenuBar from './MenuBar';
import SidebarDrawer from './SidebarDrawer';
import HomePage from './HomePage';

import Search from './Search';
import Login from './auth/Login.js';
import Register from './auth/Register.js';
import Logout from './auth/Logout.js';

import Auth from './auth/Auth.js';
import Notify from './Notify.js';

export default class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			sidebarOpen: false
		}

		this.auth = new Auth(this);
		this.notify = new Notify(this);
		Object.assign(this.notify.defaultCfg, {
			action: [
				<IconButton
					key="close"
					aria-label="close"
					color="inherit"
					onClick={this.notify.close}
				>
					<CloseIcon />
				</IconButton>
			]
		});

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
			<BrowserRouter>
				<Snackbar
					anchorOrigin={{
						vertical: 'bottom',
						horizontal: 'center',
					}}
					open={this.state.notify.open}
					autoHideDuration={this.state.notify.duration}
					onClose={this.notify.close}
					message={this.state.notify.message}
					action={this.state.notify.action}
				/>
				<MenuBar toggleSidebar={this.toggleSidebar} />
				<SidebarDrawer open={this.state.sidebarOpen} toggleSidebar={this.toggleSidebar} user={this.state.user} />
				<div style={{marginTop: '20px'}}>
					<Switch>
						<Route exact path="/" render={(props) => <HomePage {...props} user={this.state.user} />} />
						<Route path="/search" render={(props) => <Search {...props} notify={this.notify} user={this.state.user} />} />
						<Route path="/login" render={(props) => <Login {...props} authenticate={this.auth.authenticate} notify={this.notify} />} />
						<Route path="/register" render={(props) => <Register {...props} notify={this.notify} />} />
						<Route path="/logout" render={(props) => <Logout {...props} logout={this.auth.logout} />} />
					</Switch>
				</div>
			</BrowserRouter>
		);
	}
}

ReactDOM.render(<App />, document.getElementById('app'));
