import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import FileSaver from 'file-saver';

import  { withStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';

import GetAppIcon from '@material-ui/icons/GetApp';

import MediaCard from "./MediaCard";

const useStyles = theme => ({
	paperPadding: {
		padding: theme.spacing(5),
	},
});

class LyricViewer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			song: null,
		};

		['fetchData', 'handleDownload'].forEach((method) => {
			this[method] = this[method].bind(this);
		})
	}

	componentDidMount() {
		this.fetchData();
	}

	fetchData() {
		const { id_song } = this.props.match.params;
		axios.get('/api/get_song_or_lyric', {
			params: {
				id_song: id_song,
				get: 'both',
			}
		})
		.then((response) => {
			if(response.data.message === 'success') {
				const data = response.data.data;
				this.setState({ song: data });
			}
		});
	}

	handleDownload() {
		const blob = new Blob([this.state.song.lyric.lyric], {type: "text/plain;charset=utf-8"});
		FileSaver.saveAs(blob, this.state.song.artist + ' - ' + this.state.song.name + '.lrc');
	}

	render() {
		const { classes } = this.props;

		return (
			<Container>
				<Grid container spacing={3}>

					<Grid item sm={12} md={4}>

						{this.state.song !== null && (
							<MediaCard
								mbid={this.state.song.id_album}
								title={this.state.song.name}
								artist={this.state.song.artist}
								album={this.state.song.album}
								actionProps={{ disabled: true }}
							/>
						)}

						<Box my={3}>
							<Button
								variant="contained"
								color="secondary"
								onClick={this.handleDownload}
								startIcon={<GetAppIcon />}
							>Download</Button>
						</Box>

					</Grid>

					<Grid item sm={12} md={8}>
						<Paper className={classes.paperPadding}>
							{(this.state.song && this.state.song.lyric.lyric.split("\n").map((item, key) => (
								<Typography key={key} display="block">{item}</Typography>
							)))}
						</Paper>
					</Grid>

				</Grid>
			</Container>
		);
	}
}

LyricViewer.propTypes = {
	classes: PropTypes.object.isRequired,
	match: PropTypes.object.isRequired,
}

export default withStyles(useStyles)(LyricViewer);
