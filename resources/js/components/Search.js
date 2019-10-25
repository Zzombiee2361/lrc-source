import React, { Component } from 'react';
import update from 'immutability-helper';
import PropTypes from 'prop-types';
import axios from 'axios';

import  { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

const useStyles = theme => ({
	image: {
		height: '100%'
	}
});
class Search extends Component {
	constructor(props) {
		super(props);

		this.state = {
			prevQuery: this.props.location.search,
			query: this.props.location.search,
			searched: false,
			result: [],
			details: {
				count: 0,
				offset: 0
			}
		};

		this.search = this.search.bind(this);
		this.filterResult = this.filterResult.bind(this);
		this.fetchCover = this.fetchCover.bind(this);
		this.renderResult = this.renderResult.bind(this);
	}

	search() {
		axios({
			method: 'get',
			url: '/api/search'+this.props.location.search
		})
		.then((response) => {
			const result = this.filterResult(response.data.recordings);
			this.setState({
				result: result,
				details: {
					count: response.data.count,
					offset: response.data.offset,
					prevQuery: this.state.query,
				}
			});
		})
		.catch((error) => {
			this.setState({ result: [] });
			console.log(error);
		})
		.finally(() => {
			this.setState({ searched: true });
		});
	}

	componentDidMount() {
		this.search();
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		if(nextProps.location.search !== prevState.query) {
			return {
				prevQuery: prevState.query,
				query: nextProps.location.search
			};
		}
		return null;
	}

	filterResult(result) {
		let results = [];
		result.forEach((recording) => {
			const releases = recording.releases;
			if(releases === undefined) return;
			releases.forEach((release) => {
				const album = release['release-group'];
				const notThese = ['Compilation', 'DJ-mix'];
				const filtered = !(album['secondary-types'] && album['secondary-types'].some((r) => notThese.includes(r)));
				if(filtered) {
					const i = results.length;
					this.fetchCover(release.id, i);
					release.cover = 'https://via.placeholder.com/150x150?text=Loading...';
					release.recording = Object.assign({}, recording);
					delete release.recording.releases;
					results.push(release);
				}
			});
		});
		return results;
	}

	fetchCover(id, i) {
		let cover;

		const requestedWith = axios.defaults.headers.common['X-Requested-With'];
		delete axios.defaults.headers.common['X-Requested-With'];
		axios.get('http://coverartarchive.org/release/' + id)
			.then((response) => {
				const images = response.data.images;
				images.some((img) => {
					if(img.approved && img.front) {
						cover = img.thumbnails.small;
						return true;
					}
				});
				if(cover === undefined) cover = images[0].thumbnails.small;
				this.setState({
					result: update(this.state.result, { [i]: { cover: { $set: cover } } })
				});
				// this.setState(prevState => ({
				// 	result: prevState.result.map((obj) => (
				// 		obj.id === id
				// 		? Object.assign(obj, { cover: cover })
				// 		: obj
				// 	))
				// }));
			})
			.catch(() => {
				const cover = 'https://via.placeholder.com/150x150?text=No+Cover';
				this.setState({
					result: update(this.state.result, { [i]: { cover: { $set: cover } } })
				});
			});
		axios.defaults.headers.common['X-Requested-With'] = requestedWith;
	}

	renderResult(result) {
		const { classes } = this.props;
		if(result.length === 0) {
			return (
				<Grid item xs={12}>
					<Typography variant="h6" color="textSecondary">No song found.</Typography>
				</Grid>
			);
		}
		console.log(result);
		return result.map((item, i) => {
			const artist = item.recording['artist-credit'].reduce((prev, artist) => {
				return prev + artist.name + (artist.joinphrase ? artist.joinphrase : '');
			}, '');
			return (
				<Grid item md={6} sm={12} key={i}>
					<Card>
						<CardActionArea>
							<Grid container spacing={0}>
								<Grid item xs={4}>
									<CardMedia
										className={classes.image}
										image={item.cover}
										title={item.title}
									/>
								</Grid>
								<Grid item xs={8}>
									<CardContent>
										<Typography gutterBottom variant="h5">
											{item.recording.title}
										</Typography>
										<Typography variant="subtitle1" color="textSecondary">
											{artist}
										</Typography>
										<Typography variant="subtitle2" color="textSecondary">
											{item.title}
										</Typography>
									</CardContent>
								</Grid>
							</Grid>
						</CardActionArea>
					</Card>
				</Grid>
			);
		});
	}
	
	render() {
		const resultList = (this.state.searched
			? this.renderResult(this.state.result)
			: (<Typography variant="h6" color="textSecondary">Searching...</Typography>));

		// if(this.state.prevQuery !== this.state.query) {
		// 	this.search();
		// }
		
		return (
			<Container maxWidth="md">
				<Typography variant="h2" gutterBottom>Search result</Typography>
				<Grid container spacing={3}>
					{resultList}
				</Grid>
			</Container>
		)
	}
}

Search.propTypes = {
	location: PropTypes.object.isRequired,
	history: PropTypes.object.isRequired,
	classes: PropTypes.object,
}

export default withStyles(useStyles)(Search);
