import React, { Component } from 'react';
// import update from 'immutability-helper';
import PropTypes from 'prop-types';
import axios from 'axios';

import  { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepButton from '@material-ui/core/StepButton';
import StepContent from '@material-ui/core/StepContent';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import MediaCard from "./MediaCard";
import Notify from './Notify';

const useStyles = theme => ({
	paperPadding: {
		padding: theme.spacing(5),
	},
	revisionStepper: {
		marginTop: theme.spacing(3),
	},
});

class RevisionViewer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			histories: [],
			song: null,
			activeStep: 0,
			dialogOpen: false,
			dialog: {},
		};

		['fetchRevision', 'handleApprove', 'handleReject', 'closeDialog'].forEach((method) => {
			this[method] = this[method].bind(this);
		})
	}

	componentDidMount() {
		this.fetchRevision();
		this.notify = this.context;
	}

	fetchRevision() {
		const { id_song } = this.props.match.params;
		axios.get('/api/get_revision', {
			params: {
				id_song: id_song,
				approve_only: false,
			}
		})
		.then((response) => {
			if(response.data.message === 'success') {
				this.setState({ histories: response.data.data });
			}
		});

		axios.get('/api/get_song_or_lyric?get=song&id_song=' + id_song)
		.then((response) => {
			if(response.data.message === 'success') {
				this.setState({ song: response.data.data });
			}
		});
	}

	handleStep(step) {
		this.setState({ activeStep: step });
	}

	post(type) {
		if(type === 'approve' || type === 'reject') {
			axios({
				url: '/api/' + type,
				method: 'post',
				data: {
					id: this.state.histories[this.state.activeStep].id
				}
			})
			.then((response) => {
				this.notify.show(response.data.message);
				this.fetchRevision();
				this.setState({ dialogOpen: false });
			})
			.catch((response) => {
				console.log(response);
				this.notify.show(response.data.message);
				this.setState({ dialogOpen: false });
			});
		}
	}

	handleApprove() {
		this.setState({
			dialogOpen: true,
			dialog: {
				title: 'Approve this revision?',
				content: 'Are you sure to approve this revision and all previous unapproved revision?',
				type: 'approve',
			}
		});
	}

	handleReject() {
		this.setState({
			dialogOpen: true,
			dialog: {
				title: 'Reject this revision?',
				content: 'Are you sure to reject this revision and all revision after it?',
				type: 'reject',
			}
		});
	}

	closeDialog() {
		this.setState({ dialogOpen: false });
	}

	render() {
		const { classes } = this.props;
		const activeHistory = this.state.histories[this.state.activeStep];
		return (
			<Container>
				<Grid container spacing={3}>

					<Grid item sm={12} md={4}>

						{this.state.song !== null && (
							<MediaCard
								mbid={this.state.song.id_album}
								title={this.state.song.name}
								artist={this.state.song.artist}
								album={this.state.song.album}
								actionProps={{ disabled: true }}
							/>
						)}

						<Paper className={classes.revisionStepper}>
							<Stepper activeStep={this.state.activeStep} orientation="vertical" nonLinear>

								{this.state.histories.map((history, index) => (
									<Step key={index}>

										<StepButton
											onClick={() => this.handleStep(index)}
											icon={history.revision}
											completed={history.approved_by !== null && history.approved_at !== null}
										>
											<Typography align='left' variant='h6'>
												{history.contributor_name}<br />
											</Typography>
											<Typography align='left' variant='subtitle1'>
												{history.created_at}
											</Typography>
										</StepButton>

										<StepContent>
											<Typography component="div">
												<Grid container spacing={2}>
													{(
														history.approved_by === null || history.approved_at === null
														? (
															<React.Fragment>
																<Grid item xs={12}>Not yet approved</Grid>
																{this.props.user.role >= 3 && (
																	<React.Fragment>
																		<Grid item xs={6}>
																			<Button variant="contained" color="primary" onClick={() => this.handleApprove(history.id)}>Approve</Button>
																		</Grid>
																		<Grid item xs={6}>
																			<Button variant="contained" color="secondary" onClick={() => this.handleReject(history.id)}>Reject</Button>
																		</Grid>
																	</React.Fragment>
																)}
															</React.Fragment>
														) : (
															<React.Fragment>
																<Grid item xs={5}>Approved By</Grid>
																<Grid item xs={7}>{history.approver_name}</Grid>
																<Grid item xs={5}>Approved At</Grid>
																<Grid item xs={7}>{history.approved_at}</Grid>
															</React.Fragment>
														)
													)}
												</Grid>
											</Typography>
										</StepContent>

									</Step>
								))}

							</Stepper>
						</Paper>
					</Grid>

					<Grid item sm={12} md={8}>
						<Paper className={classes.paperPadding}>
							{(activeHistory && activeHistory.lyric.split("\n").map((item, key) => (
								<Typography key={key} display="block">{item}</Typography>
							)))}
						</Paper>
					</Grid>

				</Grid>
				
				<Dialog
					open={this.state.dialogOpen}
					onClose={this.closeDialog}
				>
					<DialogTitle>{this.state.dialog.title}</DialogTitle>
					<DialogContent>
						<DialogContentText>{this.state.dialog.content}</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button onClick={this.closeDialog} color="primary">
							Cancel
						</Button>
						<Button onClick={() => this.post(this.state.dialog.type)} color="primary">
							Ok
						</Button>
					</DialogActions>
				</Dialog>
			</Container>
		);
	}
}

RevisionViewer.propTypes = {
	classes: PropTypes.object,
	match: PropTypes.object,
	user: PropTypes.object,
	notify: PropTypes.object,
}

RevisionViewer.contextType = Notify;

export default withStyles(useStyles)(RevisionViewer);
