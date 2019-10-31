import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from "@material-ui/core/ListItemAvatar";

import HomeIcon from '@material-ui/icons/Home';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import PersonIcon from '@material-ui/icons/Person';

const useStyles = {
	sidebar: {
		minWidth: 250
	}
};

class UserCard extends Component {
	render() {
		if(this.props.email && this.props.name) {
			return (
				<ListItem>
					<ListItemAvatar>
						<Avatar>
							<PersonIcon />
						</Avatar>
					</ListItemAvatar>
					<ListItemText
						primary={this.props.name}
						secondary={this.props.email} />
				</ListItem>
			)
		} else {
			return null;
		}
	}
}

class SidebarDrawer extends Component {
	render() {
		const listItems = [
			{
				text: 'Home',
				to: '/',
				icon: <HomeIcon />
			},
		];
		if(this.props.user.email === '' && this.props.user.name === '') {
			listItems.push({
				text: 'Login',
				to: '/login',
				icon: <LockOutlinedIcon />
			});
		} else {
			listItems.push({
				text: 'Logout',
				to: '/logout',
				icon: <ExitToAppIcon />
			});
		}

		const { classes } = this.props;
		return (
			<Drawer open={this.props.open} onClose={this.props.toggleSidebar}>
				<List
					className={classes.sidebar}
					component="nav"
					aria-label="main navigation"
					onClick={this.props.toggleSidebar}
					onKeyDown={this.props.toggleSidebar}
				>
					<UserCard email={this.props.user.email} name={this.props.user.name} />
					{listItems.map((item, i) => (
						<ListItem button component={Link} to={item.to} key={i}>
							<ListItemIcon>{item.icon}</ListItemIcon>
							<ListItemText primary={item.text} />
						</ListItem>
					))}
				</List>
			</Drawer>
		);
	}
}

SidebarDrawer.propTypes = {
	open: PropTypes.bool.isRequired,
	toggleSidebar: PropTypes.func.isRequired,
	classes: PropTypes.object.isRequired,
	user: PropTypes.object.isRequired,
}

UserCard.propTypes = {
	email: PropTypes.string,
	name: PropTypes.string,
}

export default withStyles(useStyles)(SidebarDrawer);
