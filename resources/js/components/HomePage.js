import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import axios from 'axios';

import  { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import MediaCard from './MediaCard';
import Notify from './Notify';

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
		let notify = this.context;
		return (
			// <Notify>
			// {({ showNotify }) => (
				<Container>
					<Typography gutterBottom variant="h3">Welcome to LRC Source</Typography>
					{/* <Button variant="contained" color="primary" onClick={() => showNotify('test')}>Test</Button> */}
					<Button variant="contained" color="primary" onClick={() => notify.show('test')}>Test</Button>
					<NeedReview items={this.state.needReview} />
					<RecentLyrics items={this.state.recents} />
				</Container>
			// )}
			// </Notify>
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

HomePage.contextType = Notify;

export default HomePage;
