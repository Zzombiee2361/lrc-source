import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';

import  { fade, withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import InputBase from '@material-ui/core/InputBase';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';

import SearchIcon from '@material-ui/icons/Search';
import MenuIcon from '@material-ui/icons/Menu';

const useStyles = theme => ({
	grow: {
		flexGrow: 1
	},
	menuButton: {
		marginRight: theme.spacing(2)
	},
	menuTitle: {
		textDecoration: 'none',
		color: 'white',
	},
	search: {
		borderRadius: theme.shape.borderRadius,
		backgroundColor: fade(theme.palette.common.white, 0.15),
		'&:hover': {
			backgroundColor: fade(theme.palette.common.white, 0.25),
		},
		color: theme.palette.common.white,
		marginRight: theme.spacing(2)
	},
	searchInput: {
		padding: theme.spacing(1)
	}
});

class MenuBar extends Component {
	constructor(props) {
		super(props);

		this.handleSearchField = this.handleSearchField.bind(this);
		this.handleSearch = this.handleSearch.bind(this);
	}

	handleSearchField(event) {
		this.setState({
			[event.target.name]: event.target.value
		});
	}

	handleSearch(event) {
		event.preventDefault();
		const data = [
			'recording:'+this.state.searchTitle,
			'artist:'+this.state.searchArtist
		];
		this.props.history.push('/search?query='+data.join(' AND '));
	}

	render() {
		const { classes } = this.props;
		return (
			<AppBar position="static">
				<Toolbar>
					<IconButton
						edge="start"
						className={classes.menuButton}
						color="inherit"
						aria-label="menu"
						onClick={this.props.toggleSidebar}
					>
						<MenuIcon />
					</IconButton>
					<Typography variant="h5" className={`${classes.grow} ${classes.menuTitle}`} component={Link} to="/">
						LRC Source
					</Typography>
					<form onSubmit={this.handleSearch}>
						<InputBase
							placeholder="Title"
							classes={{
								root: classes.search,
								input: classes.searchInput
							}}
							name="searchTitle"
							inputProps={{ 'aria-label': 'search title' }}
							onChange={this.handleSearchField}
						/>
						<InputBase
							placeholder="Artist"
							classes={{
								root: classes.search,
								input: classes.searchInput
							}}
							name="searchArtist"
							inputProps={{ 'aria-label': 'search artist' }}
							onChange={this.handleSearchField}
						/>
						<Button
							type="submit"
							variant="contained"
							color="secondary"
							startIcon={<SearchIcon />}
						>
							Search
						</Button>
					</form>
				</Toolbar>
			</AppBar>
		);
	}
}

MenuBar.propTypes = {
	classes: PropTypes.object,
	history: PropTypes.object.isRequired,
	toggleSidebar: PropTypes.func.isRequired,
};

export default withRouter(withStyles(useStyles)(MenuBar));
