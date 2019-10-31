import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router';

class Logout extends Component {
	constructor(props) {
		super(props);
		this.state = {
			logout: false
		};

		this.props.logout()
			.finally(() => {
				this.setState({ logout: true })
			});
	}

	render() {
		if(this.state.logout === true) {
			return (<Redirect to="/" />)
		} else {
			return null;
		}
	}
}

Logout.propTypes = {
	logout: PropTypes.func.required
};

export default Logout;
