import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import emojiFlags from 'emoji-flags';

import  { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';

import Contribute from './Contribute';

const useStyles = {
	image: {
		width: '100%',
		paddingBottom: '100%',
	}
};

class Search extends Component {
	constructor(props) {
		super(props);

		this.state = {
			query: this.props.location.search,
			searched: false,
			result: [],
			details: {
				count: 0,
				offset: 0
			},
			selected: null,
			lyricOpen: false,
		};

		this.search = this.search.bind(this);
		this.filterResult = this.filterResult.bind(this);
		this.renderResult = this.renderResult.bind(this);
		this.openLyricModal = this.openLyricModal.bind(this);
		this.closeLyricModal = this.closeLyricModal.bind(this);
	}

	search() {
		axios({
			method: 'get',
			url: '/api/search'+this.props.location.search
		})
		.then((response) => {
			const result = this.filterResult(response.data.recordings);
			this.setState({
				searched: true,
				result: result,
				details: {
					count: response.data.count,
					offset: response.data.offset,
				}
			});
		})
		.catch((error) => {
			this.setState({ searched: true });
			console.log(error);
		});
	}

	// search on query change
	static getDerivedStateFromProps(nextProps, prevState) {
		if(nextProps.location.search !== prevState.query) {
			return {
				searched: false,
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
			let earliest;
			let earliestDate;
			const qualified = [];

			releases.forEach((release) => {
				const album = release['release-group'];
				const notThese = ['Compilation', 'DJ-mix'];
				const filtered = !(Array.isArray(album['secondary-types']) && album['secondary-types'].some((r) => notThese.includes(r)));

				if(filtered) {
					release.score = 0;
					if(
						Array.isArray(release.media)
						&& release.media.length > 0
						&& release.media[0].format === 'Digital Media'
					) {
						release.score += 2;
					}
					if(release.country === 'XW') {
						release.score += 2;
					}

					if(release.date) {
						const dt = Date.parse(release.date);
						if(!earliestDate || earliestDate > dt) {
							earliest = release;
							earliestDate = dt;
						}
					}

					qualified.push(release);
				}
			});

			if(qualified.length > 0) {
				const bestRelease = qualified.reduce((prev, current) => {
					if(earliest && earliest.id === current.id) current.score += 1;
					if(!prev) prev = { score: -1 };
					return (prev.score > current.score) ? prev : current;
				}, {});

				let releaseResult = 0;
				qualified.forEach((release) => {
					if(release.score >= bestRelease.score-1 && releaseResult < 3) {
						release.cover = 'http://coverartarchive.org/release/' + release.id + '/front-250';
						release.recording = Object.assign({}, recording);
						delete release.recording.releases;
						results.push(release);
						releaseResult++;
					}
				});
			}
		});
		return results;
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

		return result.map((item, i) => {
			const listArtist = (item['artist-credit'] || item.recording["artist-credit"] || []);
			const artist = listArtist.reduce((prev, artist) => {
				return prev + artist.name + (artist.joinphrase ? artist.joinphrase : '');
			}, '');

			let album = item.title;
			if(typeof item['release-group'] === 'object' && item['release-group']['primary-type']) {
				album += ' - ' + item['release-group']['primary-type'];
			}

			let flag = '';
			if(item.country === 'XW') {
				flag = {
					code: 'XW',
					emoji: '🌎',
					name: 'Worldwide'
				};
			} else if(item.country) {
				flag = emojiFlags.countryCode(item.country);
			}

			return (
				<Grid item md={6} xs={12} key={i}>
					<Card>
						<CardActionArea
							data-index={i}
							onClick={this.openLyricModal}
						>
							<Grid container spacing={0}>
								<Grid item xs={4} sm={5}>
									<CardMedia
										className={classes.image}
										image={item.cover + '"), url("/img/cover-generic.svg'}
									/>
								</Grid>
								<Grid item xs={8} sm={7}>
									<CardContent>
										<Typography gutterBottom variant="h5">
											{item.recording.title}&nbsp;
											<span title={flag.name}>{flag.emoji}</span>
										</Typography>
										<Typography variant="subtitle1" color="textSecondary">
											{artist}
										</Typography>
										<Typography variant="subtitle2" color="textSecondary">
											{album}
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

	openLyricModal(event) {
		if(this.props.user.email === '' && this.props.user.name === '') {
			this.props.notify.show('Please login to contribute lyrics');
			return;
		}
		const el = event.currentTarget;
		const index = parseInt(el.getAttribute('data-index'));

		console.log(this.state.result[index]);

		this.setState({
			lyricOpen: true,
			selected: index
		})
	}

	closeLyricModal() {
		this.setState({
			lyricOpen: false,
		});
	}

	// Debugging info
	// componentDidUpdate(prevProps, prevState) {
	// 	Object.entries(this.props).forEach(([key, val]) =>
	// 		prevProps[key] !== val && console.log(`Prop '${key}' changed`, prevProps[key], val)
	// 	);
	// 	if (this.state) {
	// 		Object.entries(this.state).forEach(([key, val]) =>
	// 			prevState[key] !== val && console.log(`State '${key}' changed`, prevState[key], val)
	// 		);
	// 	}
	// }

	render() {
		const resultList = (this.state.searched
			? this.renderResult(this.state.result)
			: (<Typography variant="h6" color="textSecondary">
					<CircularProgress size={18} /> Searching...
				</Typography>));

		if(this.state.searched === false) {
			this.search();
		}

		const selectedItem = (
			this.state.selected === null
			? {}
			: this.state.result[this.state.selected]
		);

		return (
			<React.Fragment>
				<Container maxWidth="md">
					<Typography variant="h3" gutterBottom>Search result</Typography>
					<Grid container spacing={3}>
						{resultList}
					</Grid>
				</Container>
				<Contribute
					lyricOpen={this.state.lyricOpen}
					item={selectedItem}
					handleClose={this.closeLyricModal}
					notify={this.props.notify}
				/>
			</React.Fragment>
		)
	}
}

Search.propTypes = {
	location: PropTypes.object.isRequired,
	history: PropTypes.object.isRequired,
	classes: PropTypes.object,
	notify: PropTypes.object.isRequired,
	user: PropTypes.object,
}

export default withStyles(useStyles)(Search);
