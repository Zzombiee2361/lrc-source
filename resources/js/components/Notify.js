import update from 'immutability-helper';

class Notify {
	constructor(instance) {
		this.parent = instance;
		this.defaultCfg = {
			open: false,
			message: '',
			duration: 5000,
			action: [],
		};
		this.parent.state.notify = this.defaultCfg;

		['show', 'close'].forEach((method) => {
			this[method] = this[method].bind(this);
		})
	}

	show(msg, cfg = {}) {
		const open = () => {
			this.parent.setState({
				notify: update(this.parent.state.notify, {
					$merge: {
						open: true,
						message: msg,
						duration: (cfg.duration || this.defaultCfg.duration),
						action: (cfg.action || this.defaultCfg.action)
					}
				})
			});
		}

		if(this.parent.state.notify.open) {
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
		this.parent.setState({
			notify: this.defaultCfg
		}, callback);
	}
}

export default Notify;
