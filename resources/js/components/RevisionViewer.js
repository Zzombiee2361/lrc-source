import React, { Component } from 'react';
import update from 'immutability-helper';
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

import MediaCard from "./MediaCard";

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
		};

		this.fetchRevision = this.fetchRevision.bind(this);
	}

	componentDidMount() {
		this.fetchRevision();
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

	handleApprove(id) {
		axios({
			url: '/api/approve',
			method: 'post',
			data: {
				id: id
			}
		})
		.then((response) => {
			this.props.notify.show(response.data.message);
			this.fetchRevision();
		})
		.catch((response) => {
			console.log(response);
			this.props.notify.show(response.data.message);
		});
	}

	handleReject(id) {
		axios({
			url: '/api/reject',
			method: 'post',
			data: {
				id: id
			}
		})
		.then((response) => {
			this.props.notify.show(response.data.message);
			this.fetchRevision();
		})
		.catch((response) => {
			console.log(response);
			this.props.notify.show(response.data.message);
		});
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
							<Typography>
								{activeHistory ? activeHistory.lyric : ''}
							</Typography>
						</Paper>
					</Grid>

				</Grid>
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

export default withStyles(useStyles)(RevisionViewer);
