import axios from 'axios';

class Auth {
	constructor(instance) {
		this.parent = instance;

		this.parent.state.user = {
			email: '',
			name: '',
			role: null
		};

		axios.get('/api/auth/user')
			.then((response) => { this._setData(response.data); })
			.catch(() => { /* Unauthenticated */ });

		['_setData', 'authenticate', 'logout'].forEach((method) => {
			this[method] = this[method].bind(this);
		})
	}

	_setData(data) {
		this.auth = data;
		let userData
		
		if(typeof data === 'object' && data !== null) {
			userData = {
				email: data.user.email,
				name: data.user.name,
				role: data.user.role_id,
			};
		} else {
			userData = {
				email: '',
				name: '',
				role: null
			};
		}

		this.parent.setState({ user: userData });
	}

	async authenticate(email, password) {
		await axios.get('/sanctum/csrf-cookie');
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
			this._setData(null);
		}).catch((error) => {
			if(error.response.status === 401) {
				this._setData(null);
			}
		});
		return request;
	}
}

export default Auth;
