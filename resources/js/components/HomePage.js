import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import axios from 'axios';

import  { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import MediaCard from './MediaCard';

const useStyles = makeStyles({
	sectionTitle: {
		margin: '.4em 0',
	}
});

function NeedReview(props) {
	const classes = useStyles();

	if(props.items.length > 0) {
		return (
			<div>
				<Typography className={classes.sectionTitle} variant="h4">Need Review</Typography>
				<Grid container spacing={3}>
					{props.items.map((item, i) => {
						return (
							<Grid item key={i} xs={12} md={6} lg={4}>
								<MediaCard
									mbid={item.id_album}
									id={i}
									title={item.name}
									artist={item.artist}
									album={item.album}
									actionProps={{
										component: Link,
										to: '/revision/' + item.id
									}}
								/>
							</Grid>
						)
					})}
				</Grid>
			</div>
		);
	} else {
		return null;
	}
}

function RecentLyrics(props) {
	const classes = useStyles();

	return (
		<div>
			<Typography className={classes.sectionTitle} variant="h4">Recent Lyrics</Typography>
			<Grid container spacing={3}>
				{props.items.map((item, i) => {
					return (
						<Grid item key={i} xs={12} md={6} lg={4}>
							<MediaCard
								mbid={item.id_album}
								id={i}
								title={item.name}
								artist={item.artist}
								album={item.album}
								actionProps={{
									component: Link,
									to: '/lyric/' + item.id
								}}
							/>
						</Grid>
					)
				})}
			</Grid>
		</div>
	);
}

class HomePage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			needReview: [],
			recents: [],
		}

		if(this.props.user.role >= 3) {
			axios({
				method: 'get',
				url: '/api/need_review'
			})
			.then((response) => {
				this.setState({
					needReview: response.data.data
				})
			});
		}

		axios({
			method: 'get',
			url: '/api/get_recent'
		})
		.then((response) => {
			this.setState({
				recents: response.data.data
			})
		});
	}

	render() {
		return (
			<Container>
				<Typography gutterBottom variant="h3">Welcome to LRC Source</Typography>
				<NeedReview items={this.state.needReview} />
				<RecentLyrics items={this.state.recents} />
			</Container>
		);
	}
}

NeedReview.propTypes = {
	items: PropTypes.array
};

RecentLyrics.propTypes = {
	items: PropTypes.array
}

HomePage.propTypes = {
	user: PropTypes.object
};

export default HomePage;
