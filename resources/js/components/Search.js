import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import queryString from 'query-string';
import axios from 'axios';

import Container from '@material-ui/core/Container';
// import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

export default class Search extends Component {
	constructor(props) {
		super(props);

		this.state = {
			result: 'Searching'
		};

		// const params = queryString.parse(this.props.location.search);
		delete axios.defaults.headers.common["X-Requested-With"]
		axios({
			method: 'get',
			url: 'https://musicbrainz.org/ws/2/recording'+this.props.location.search,
			headers: {
				Accept: 'application/json',
				'User-Agent': '0.0.1/lrc-source ( daffamumtaz2001@gmail.com )'
			},
			responseType: 'json',
		})
		.then((response) => {
			this.setState({ result: 'Search finished' });
			console.log(response.data);
		})
		.catch((error) => {
			this.setState({ result: 'Error while searching' });
			console.log(error.response.data);
		});
	}
	
	render() {
		return (
			<Container>
				<Typography variant="h4">Searching {'https://musicbrainz.org/ws/2/recording'+this.props.location.search}. Here is the result:</Typography>
				<code>{this.state.result}</code>
			</Container>
		)
	}
}

Search.propTypes = {
	location: PropTypes.object.isRequired,
	history: PropTypes.object.isRequired
}
