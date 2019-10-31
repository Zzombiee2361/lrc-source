import React, { Component } from 'react';
import update from 'immutability-helper';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';

import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';

import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import CloseIcon from '@material-ui/icons/Close';

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
		marginTop: theme.spacing(1),
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
	},
});

class Login extends Component {
	constructor(props){
		super(props);
		this.state = {
			inputs: {},
			errors: {
				name: '',
				email: '',
				password: '',
				password_confirmation: '',
			},
			snackbar: {
				open: false,
				message: '',
			}
		}

		this.openSnackbar = this.openSnackbar.bind(this);
		this.closeSnackbar = this.closeSnackbar.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	openSnackbar(message) {
		this.setState({
			snackbar: {
				open: true,
				message: message,
			}
		});
	}

	closeSnackbar() {
		this.setState({
			snackbar: {
				open: false,
				message: '',
			}
		});
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
		this.props.authenticate(this.state.inputs.email, this.state.inputs.password)
			.then((response) => {
				if(response.status === 200) {
					this.props.history.push('/');
				} else {
					this.openSnackbar(response.data.message);
				}
			})
			.catch((error) => {
				if(typeof error.response === 'object' && typeof error.response.data === 'object') {
					const data = error.response.data;
					if(typeof data.errors === 'object') {
						this.setState({
							errors: update(this.state.errors, { $merge: data.errors })
						})
					}
					this.openSnackbar(data.message);
				} else {
					this.openSnackbar('Login failed');
				}
			});
	}

	render(){
		const { classes } = this.props;
		return (
			<Container component="main" maxWidth="xs">
				<CssBaseline />
				<div className={classes.paper}>
					<Avatar className={classes.avatar}>
						<LockOutlinedIcon />
					</Avatar>
					<Typography component="h1" variant="h5">
						Log in
					</Typography>
					<form className={classes.form} noValidate onSubmit={this.handleSubmit}>
						<TextField
							variant="outlined"
							margin="normal"
							required
							fullWidth
							id="email"
							label="Email Address"
							name="email"
							autoComplete="email"
							autoFocus
							onChange={this.handleInputChange}
							error={this.state.errors.email !== ''}
							helperText={this.state.errors.email}
						/>
						<TextField
							variant="outlined"
							margin="normal"
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
						{/* <FormControlLabel
							control={<Checkbox value="remember" color="primary" />}
							label="Remember me"
						/> */}
						<Button
							type="submit"
							fullWidth
							variant="contained"
							color="primary"
							className={classes.submit}
						>
							Login
						</Button>
						<Grid container>
							<Grid item xs>
								<Link to="#">
									Forgot password?
								</Link>
							</Grid>
							<Grid item>
								<Link to="/register">
									{"Don't have an account? Register"}
								</Link>
							</Grid>
						</Grid>
					</form>
				</div>
				<Snackbar
					anchorOrigin={{
						vertical: 'top',
						horizontal: 'right',
					}}
					open={this.state.snackbar.open}
					autoHideDuration={6000}
					onClose={this.closeSnackbar}
					message={this.state.snackbar.message}
					action={[
						<IconButton
							key="close"
							aria-label="close"
							color="inherit"
							onClick={this.closeSnackbar}
						>
							<CloseIcon />
						</IconButton>
					]}
				/>
			</Container>
		);
	}
}

Login.propTypes = {
	classes: PropTypes.object,
	history: PropTypes.object.isRequired,
	authenticate: PropTypes.func,
}

export default withRouter(withStyles(useStyles)(Login));
