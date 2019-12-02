import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import MediaCard from './MediaCard';

class NeedReview extends Component {
	constructor(props) {
		super(props);
		this.state = {
			items: []
		};

		axios({
			method: 'get',
			url: '/api/need_review'
		})
		.then((response) => {
			this.setState({
				items: response.data.data
			})
		});
	}
	
	render() {
		return (
			<React.Fragment>
				<Typography variant="h4">Need Review</Typography>
				<Grid container spacing={3}>
					{this.state.items.map((item, i) => {
						return (
							<Grid item key={i} xs={12} md={6} lg={4}>
								<MediaCard
									mbid={item.id_album} 
									id={i}
									title={item.name}
									artist={item.artist}
									album={item.album}
								/>
							</Grid>
						)
					})}
				</Grid>
			</React.Fragment>
		);
	}
}

class HomePage extends Component {
	constructor(props) {
		super(props);
	}
	
	render() {
		const needReview = (this.props.user.role >= 3 ? <NeedReview /> : null);
		return (
			<Container>
				<Typography gutterBottom variant="h3">Welcome to LRC Source</Typography>
				{needReview}
			</Container>
		);
	}
}

HomePage.propTypes = {
	user: PropTypes.object
}

export default HomePage;
