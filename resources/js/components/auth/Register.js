import React, { Component } from 'react';
import update from 'immutability-helper';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import axios from 'axios';

import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';

import LockOutlinedIcon from '@material-ui/icons/LockOutlined';

import Notify from '../Notify';

const useStyles = theme => ({
	'@global': {
		body: {
			backgroundColor: theme.palette.common.white,
		},
	},
	paper: {
		marginTop: theme.spacing(8),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
	},
	avatar: {
		margin: theme.spacing(1),
		backgroundColor: theme.palette.secondary.main,
	},
	form: {
		width: '100%', // Fix IE 11 issue.
		marginTop: theme.spacing(3),
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
	},
});

class Register extends Component {
	constructor(props) {
		super(props);
		this.state = {
			inputs: {},
			errors: {
				name: '',
				email: '',
				password: '',
				password_confirmation: '',
			},
		}

		this.handleInputChange = this.handleInputChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	componentDidMount() {
		this.notify = this.context;
	}

	handleInputChange(event) {
		this.setState(update(this.state, {
			inputs: {
				[event.target.name]: { $set: event.target.value }
			},
			errors: {
				[event.target.name]: { $set: '' }
			}
		}));
	}

	handleSubmit(event) {
		event.preventDefault();
		axios.post('/api/auth/register', this.state.inputs)
			.then((response) => {
				if(response.status === 201) {
					this.notify.show('Account registered, you can now login');
					this.props.history.push('/login');
				} else {
					this.notify.show(response.data.message);
				}
			})
			.catch((error) => {
				console.log(error.response);
				const data = error.response.data;
				if(typeof data.errors === 'object') {
					this.setState({
						errors: update(this.state.errors, { $merge: data.errors })
					})
				}
				this.notify.show(data.message);
			});
	}

	render() {
		const { classes } = this.props;
		return (
			<Container component="main" maxWidth="xs">
				<CssBaseline />
				<div className={classes.paper}>
					<Avatar className={classes.avatar}>
						<LockOutlinedIcon />
					</Avatar>
					<Typography component="h1" variant="h5">
						Register
					</Typography>
					<form className={classes.form} onSubmit={this.handleSubmit} noValidate>
						<Grid container spacing={2}>
							<Grid item xs={12}>
								<TextField
									autoComplete="name"
									name="name"
									variant="outlined"
									required
									fullWidth
									id="name"
									label="Name"
									autoFocus
									onChange={this.handleInputChange}
									error={this.state.errors.name !== ''}
									helperText={this.state.errors.name}
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									variant="outlined"
									required
									fullWidth
									id="email"
									label="Email Address"
									name="email"
									autoComplete="email"
									onChange={this.handleInputChange}
									error={this.state.errors.email !== ''}
									helperText={this.state.errors.email}
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									variant="outlined"
									required
									fullWidth
									name="password"
									label="Password"
									type="password"
									id="password"
									autoComplete="current-password"
									onChange={this.handleInputChange}
									error={this.state.errors.password !== ''}
									helperText={this.state.errors.password}
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									variant="outlined"
									required
									fullWidth
									name="password_confirmation"
									label="Confirm Password"
									type="password"
									id="password_confirmation"
									autoComplete="current-password"
									onChange={this.handleInputChange}
									error={this.state.errors.password_confirmation !== ''}
									helperText={this.state.errors.password_confirmation}
								/>
							</Grid>
							<Grid item xs={12}>
								<FormControlLabel
									control={<Checkbox value="allowExtraEmails" color="primary" />}
									label="I'm not a robot"
								/>
							</Grid>
						</Grid>
						<Button
							type="submit"
							fullWidth
							variant="contained"
							color="primary"
							className={classes.submit}
						>
							Register
						</Button>
						<Grid container justify="flex-end">
							<Grid item>
								<Link to="/login">
									Already have an account? Sign in
								</Link>
							</Grid>
						</Grid>
					</form>
				</div>
			</Container>
		);
	}
}

Register.propTypes = {
	classes: PropTypes.object.isRequired,
	history: PropTypes.object.isRequired,
	notify: PropTypes.object,
}

Register.contextType = Notify;

export default withRouter(withStyles(useStyles)(Register));
