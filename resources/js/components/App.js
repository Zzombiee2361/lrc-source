import React, {Component} from 'react';
import ReactDOM from "react-dom";
import {BrowserRouter, Route, Switch} from 'react-router-dom';

import MenuBar from './MenuBar';
import HomePage from './HomePage';
import Search from './Search';

export default class App extends Component {
	render() {
		return (
			<BrowserRouter>
				<MenuBar />
				<Switch>
					<Route exact path="/" component={HomePage} />
					<Route path="/search" component={Search} />
				</Switch>
			</BrowserRouter>
		);
	}
}

ReactDOM.render(<App />, document.getElementById('app'));
