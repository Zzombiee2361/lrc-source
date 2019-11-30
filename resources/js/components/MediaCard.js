import React, { Component } from 'react';
import PropTypes from 'prop-types';
import emojiFlags from 'emoji-flags';

import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

class MediaCard extends Component {
	constructor(props) {
		super(props);

		if(this.props.mbid) {
			this.cover = 'http://coverartarchive.org/release/' + this.props.mbid + '/front-250"), ';
		} else {
			this.cover = '';
		}
		
		this.flag = '';
		if(this.props.country === 'XW') {
			this.flag = {
				code: 'XW',
				emoji: '🌎',
				name: 'Worldwide'
			};
		} else if(this.props.country) {
			this.flag = emojiFlags.countryCode(this.props.country);
		}
	}
	
	render() {
		return (
			<Card>
				<CardActionArea
					data-index={this.props.id}
					onClick={this.props.onClick}
				>
					<Grid container spacing={0}>
						<Grid item xs={4} sm={5}>
							<CardMedia
								style={{
									width: '100%',
									paddingBottom: '100%',
								}}
								image={this.cover + 'url("/img/cover-generic.svg'}
							/>
						</Grid>
						<Grid item xs={8} sm={7}>
							<CardContent>
								<Typography gutterBottom variant="h5">
									{this.props.title}&nbsp;
									<span title={this.flag.name}>{this.flag.emoji}</span>
								</Typography>
								<Typography variant="subtitle1" color="textSecondary">
									{this.props.artist}
								</Typography>
								<Typography variant="subtitle2" color="textSecondary">
									{this.props.album}
								</Typography>
							</CardContent>
						</Grid>
					</Grid>
				</CardActionArea>
			</Card>
		);
	}
}

MediaCard.defaultProps = {
	id: 0
};

MediaCard.propTypes = {
	id: PropTypes.number,
	country: PropTypes.string,
	mbid: PropTypes.string,
	title: PropTypes.string.isRequired,
	artist: PropTypes.string.isRequired,
	album: PropTypes.string.isRequired,
	onClick: PropTypes.func,
};

export default MediaCard;
