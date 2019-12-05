import React, { Component } from 'react';
// import update from 'immutability-helper';
import PropTypes from 'prop-types';
import axios from 'axios';

import  { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepButton from '@material-ui/core/StepButton';
import StepContent from '@material-ui/core/StepContent';

const useStyles = theme => ({
	paperPadding: {
		padding: theme.spacing(5),
	}
});

class RevisionViewer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			histories: [],
			activeStep: 0,
		};
	}

	componentDidMount() {
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
	}

	handleStep(step) {
		this.setState({ activeStep: step });
	}

	render() {
		const { classes } = this.props;
		const activeHistory = this.state.histories[this.state.activeStep];
		return (
			<Container>
				<Grid container spacing={3}>

					<Grid item sm={12} md={4}>
						<Paper>
							<Stepper activeStep={this.state.activeStep} orientation="vertical" nonLinear>

								{this.state.histories.map((history, index) => (
									<Step key={index}>

										<StepButton
											onClick={() => this.handleStep(index)}
											icon={history.revision}
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
												<Grid container>
													{(
														history.approved_by === null || history.approved_at === null
														? (
															<React.Fragment>
																<Grid item xs={6}>Not yet approved</Grid>
																<Grid item xs={6}></Grid>
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
}

export default withStyles(useStyles)(RevisionViewer);
