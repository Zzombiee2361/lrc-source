import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import emojiFlags from 'emoji-flags';

import  { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Slide from '@material-ui/core/Slide';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import TextField from '@material-ui/core/TextField';

import CloseIcon from '@material-ui/icons/Close';

const useStyles = theme => ({
	appBar: {
		position: 'relative',
	},
	appbarBtn: {
		marginLeft: theme.spacing(1),
	},
	title: {
		marginLeft: theme.spacing(2),
		flex: 1,
	},
	gridContainer: {
		paddingTop: theme.spacing(3),
		paddingBottom: theme.spacing(3)
	},
	image: {
		width: '100%',
		paddingBottom: '100%',
	},
	textArea: {
		width: '100%',
	},
});

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

class Contribute extends Component {
	constructor(props) {
		super(props);
		this.state = {
			open: props.lyricOpen,
			lyric: ''
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleFile = this.handleFile.bind(this);
	}

	handleChange(event) {
		this.setState({
			[event.target.name]: event.target.value
		});
	}

	handleSubmit() {
		const { item } = this.props;
		axios.post('/api/contribute', {
			id_song: item.recording.id,
			id_album: item.id,
			lyric: this.state.lyric
		})
			.then((response) => {
				this.props.notify.show(response.data.message);
				this.props.handleClose();
			})
			.catch((error) => {
				console.log(error);
				this.props.notify.show('Failed to upload lyric');
			})
	}

	handleFile(event) {
		const el = event.currentTarget;
		const file = el.files[0];
		if(file) {
			const reader = new FileReader();
			reader.readAsText(file, "UTF-8");
			reader.onload = (evt) => {
				this.setState({
					lyric: evt.target.result
				});
			};
			reader.onerror = (evt) => {
				console.log(evt);
				this.props.notify.show('Error reading file');
			};
		}
	}

	render() {
		const { classes, item } = this.props;

		if(!item || Object.keys(item).length === 0){
			return null;
		}

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
			<Dialog fullScreen open={this.props.lyricOpen} onClose={this.props.handleClose} TransitionComponent={Transition}>
				<AppBar className={classes.appBar}>
					<Toolbar>
						<IconButton edge="start" color="inherit" onClick={this.props.handleClose} aria-label="close">
							<CloseIcon />
						</IconButton>
						<Typography variant="h6" className={classes.title}>
							Contribute Lyric
						</Typography>
						<Button
							autoFocus
							color="secondary"
							variant="contained"
							onClick={this.handleSubmit}
						>
							submit
						</Button>
					</Toolbar>
				</AppBar>
				<Container>
					<Grid container justify="center" className={classes.gridContainer}>
						<Grid item xs={12} md={7} lg={5}>
						<Card>
							<Grid container spacing={0}>
								<Grid item xs={12} sm={5}>
									<CardMedia
										className={classes.image}
										image={item.cover}
										title={item.title}
									/>
								</Grid>
								<Grid item xs={12} sm={7}>
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
						</Card>
						</Grid>
					</Grid>
					<TextField
						label="Lyric"
						name="lyric"
						multiline
						variant="outlined"
						rows="6"
						rowsMax="15"
						className={classes.textArea}
						onChange={this.handleChange}
						value={this.state.lyric}
					/>
					<Grid container justify="center" className={classes.gridContainer}>
						<Grid item xs={6} md={4} lg={2} xl={1}>
						<Button component="label" variant="contained" style={{ display: 'block' }}>
							Choose File
							<input
								type="file"
								style={{ display: "none" }}
								onChange={this.handleFile}
							/>
						</Button>
						</Grid>
					</Grid>
				</Container>
			</Dialog>
		);
	}
}

Contribute.propTypes = {
	classes: PropTypes.object,
	lyricOpen: PropTypes.bool.isRequired,
	item: PropTypes.object,
	handleClose: PropTypes.func.isRequired,
	notify: PropTypes.object.isRequired,
};

export default withStyles(useStyles)(Contribute);
