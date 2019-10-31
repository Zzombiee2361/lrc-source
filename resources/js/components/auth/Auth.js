import axios from 'axios';

class Auth {
	constructor(instance) {
		this.parent = instance;
		this.auth = localStorage.getItem('auth');
		if(this.auth === null) {
			this.parent.state.user = {
				email: '',
				name: '',
			};
		} else {
			const data = JSON.parse(this.auth);
			this._setData(data, true);
		}

		['_setData', '_clearData', 'authenticate', 'logout'].forEach((method) => {
			this[method] = this[method].bind(this);
		})
	}

	_setData(data, mutate = false) {
		localStorage.setItem('auth', JSON.stringify(data));
		this.auth = data;
		axios.defaults.headers.common['Authorization'] = data.token_type+' '+data.access_token;
		const userData = {
			email: data.user.email,
			name: data.user.name,
		};
		if(mutate) {
			this.parent.state.user = userData
		} else {
			this.parent.setState({ user: userData });
		}
	}

	_clearData(mutate = false) {
		localStorage.removeItem('auth');
		delete this.auth;
		delete axios.defaults.headers.common['Authorization'];
		const userData = {
			email: '',
			name: '',
		};
		if(mutate) {
			this.parent.state.user = userData
		} else {
			this.parent.setState({ user: userData });
		}
	}

	authenticate(email, password) {
		const request = axios.post('/api/auth/login', {email: email, password: password});
		request.then((response) => {
			if(response.status === 200) {
				const data = response.data;
				this._setData(data);
			}
		}).catch((error) => {
			console.log(error.response);
		});
		return request;
	}

	logout() {
		const request = axios.get('/api/auth/logout');
		request.then(() => {
			this._clearData();
		}).catch((error) => {
			if(error.response.status === 401) {
				this._clearData();
			}
		});
		return request;
	}
}

export default Auth;
