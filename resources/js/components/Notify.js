import update from 'immutability-helper';

class Notify {
	constructor(instance) {
		this.parent = instance;
		this.defaultCfg = {
			open: false,
			message: '',
			duration: 4000,
			action: [],
		};
		this.parent.state.notify = this.defaultCfg;

		['show', 'close'].forEach((method) => {
			this[method] = this[method].bind(this);
		})
	}

	show(msg, cfg = {}) {
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

	close() {
		this.parent.setState({
			notify: this.defaultCfg
		});
	}
}

export default Notify;
