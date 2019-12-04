import React, { Component } from 'react';
// import PropTypes from 'prop-types';
// import axios from 'axios';

// import  { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';

class RevisionViewer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			steps: this.getSteps(),
      stepContent: [],
      activeStep: 0,
    };

    ['handleNext', 'handleBack', 'handleReset'].forEach((method) => {
      this[method] = this[method].bind(this);
    });
	}

	getSteps() {
		return ['Select campaign settings', 'Create an ad group', 'Create an ad'];
	}

	getStepContent(step) {
		switch (step) {
			case 0:
				return `For each ad campaign that you create, you can control how much
						you're willing to spend on clicks and conversions, which networks
						and geographical locations you want your ads to show on, and more.`;
			case 1:
				return 'An ad group contains one or more ads which target a shared set of keywords.';
			case 2:
				return `Try out different ad text to see what brings in the most customers,
						and learn how to enhance your ads using features like ad extensions.
						If you run into any problems with your ads, find out how to tell if
						they're running and how to resolve approval issues.`;
			default:
				return 'Unknown step';
		}
  }

  handleNext() {
    this.setState({ activeStep: this.state.activeStep + 1 });
  }

  handleBack() {
    this.setState({ activeStep: this.state.activeStep - 1 });
  }

  handleReset() {
    this.setState({ activeStep: 0 });
  }

	render() {
		return (
			<Container>
				<Grid container spacing={3}>
					<Grid item sm={12} md={4}>
						<Paper>
              <Stepper activeStep={this.state.activeStep} orientation="vertical">
                {this.state.steps.map((label, index) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                    <StepContent>
                      <Typography>{this.getStepContent(index)}</Typography>
                      <div>
                        <div>
                          <Button
                            disabled={this.state.activeStep === 0}
                            onClick={this.handleBack}
                          >
                            Back
                          </Button>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={this.handleNext}
                          >
                            {this.state.activeStep === this.state.steps.length - 1 ? 'Finish' : 'Next'}
                          </Button>
                        </div>
                      </div>
                    </StepContent>
                  </Step>
                ))}
              </Stepper>
              {this.state.activeStep === this.state.steps.length && (
                <Paper square elevation={0}>
                  <Typography>All steps completed - you&apos;re finished</Typography>
                  <Button onClick={this.handleReset}>
                    Reset
                  </Button>
                </Paper>
              )}
						</Paper>
					</Grid>
					<Grid item sm={12} md={8}>

					</Grid>
				</Grid>
			</Container>
		);
	}
}

export default RevisionViewer;
