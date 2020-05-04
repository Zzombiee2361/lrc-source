import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

const NotifyContext = React.createContext();

export class NotifyProvider extends Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false,
			message: '',
			duration: 5000,
			action: [
				<IconButton
					key="close"
					aria-label="close"
					color="inherit"
					onClick={() => this.close.call(this)}
				>
					<CloseIcon />
				</IconButton>
			],
		};

		['show', 'close'].forEach((method) => {
			this[method] = this[method].bind(this);
		})
	}

	show(msg, cfg = {}) {
		const open = () => {
			this.setState({
				open: true,
				message: msg,
				duration: (cfg.duration || this.state.duration),
				action: (cfg.action || this.state.action),
			});
		}

		if(this.state.open) {
			this.close(() => setTimeout(open, 300))
		} else {
			open();
		}
	}

	close(callback, reason) {
		if(reason === 'clickaway') return;
		if(typeof callback !== 'function') {
			callback = undefined;
		}
		this.setState({ open: false }, callback);
	}

	render() {
		const { children } = this.props;
		return (
			<NotifyContext.Provider
				value={{
					show: this.show,
					close: this.close,
				}}
			>
				<Snackbar
					anchorOrigin={{
						vertical: 'bottom',
						horizontal: 'center',
					}}
					open={this.state.open}
					autoHideDuration={this.state.duration}
					onClose={this.close}
					message={this.state.message}
					action={this.state.action}
				/>
				{children}
			</NotifyContext.Provider>
		);
	}
}

NotifyProvider.propTypes = {
	children: PropTypes.object
}

export default NotifyContext;
