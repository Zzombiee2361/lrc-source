import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

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
	title: {
		marginLeft: theme.spacing(2),
		flex: 1,
	},
	cardContainer: {
		paddingTop: theme.spacing(3),
		paddingBottom: theme.spacing(3)
	},
	image: {
		height: '100%'
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

	render() {
		const { classes, item } = this.props;

		if(Object.keys(item).length === 0){
			return null;
		}

		const listArtist = (item['artist-credit'] || item.recording["artist-credit"] || []);
		const artist = listArtist.reduce((prev, artist) => {
			return prev + artist.name + (artist.joinphrase ? artist.joinphrase : '');
		}, '');

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
						<Button autoFocus color="inherit" onClick={this.handleSubmit}>
							submit
						</Button>
					</Toolbar>
				</AppBar>
				<Container>
					<Grid container justify="center" className={classes.cardContainer}>
						<Grid item xs={12} md={6} lg={4}>
						<Card>
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
						</Card>
						</Grid>
					</Grid>
					<TextField
						label="Lyric"
						name="lyric"
						multiline
						variant="outlined"
						rows="6"
						className={classes.textArea}
						onChange={this.handleChange}
					/>
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
