import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from "@material-ui/core/ListItemAvatar";

import HomeIcon from '@material-ui/icons/Home';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import PersonIcon from '@material-ui/icons/Person';

const useStyles = {
	sidebar: {
		minWidth: 250
	}
};

class SidebarDrawer extends Component {
	render() {
		const listItems = [
			{
				text: 'Home',
				to: '/',
				icon: <HomeIcon />
			}, {
				text: 'Login',
				to: '/login',
				icon: <LockOutlinedIcon />
			}
		];
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
					<ListItem>
						<ListItemAvatar>
							<Avatar>
								<PersonIcon />
							</Avatar>
						</ListItemAvatar>
						<ListItemText
							primary={this.props.auth.name}
							secondary={this.props.auth.email}
					</ListItem>
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
}

export default withStyles(useStyles)(SidebarDrawer);
