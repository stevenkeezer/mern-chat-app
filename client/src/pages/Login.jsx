import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { Formik } from 'formik';
import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import Authorization from '../layout/Authorization';
import { useLogin } from '../services/authenticationService';

const useStyles = makeStyles((theme) => ({
	welcome: {
		paddingBottom: 20,
		color: '#000000',
		fontWeight: 500
	},
	buttonHeader: {
		display: 'flex',
		alignItems: 'flex-start',
		justifyContent: 'space-between',
		flexDirection: 'column',
		bgcolor: 'background.paper',
		minHeight: '100vh',
		paddingTop: 23
	},
	accBtn: {
		width: 170,
		height: 54,
		borderRadius: 5,
		filter: 'drop-shadow(0px 2px 6px rgba(74,106,149,0.2))',
		backgroundColor: '#ffffff',
		color: '#3a8dff',
		boxShadow: 'none',
		marginRight: 35
	},
	noAccBtn: {
		color: '#b0b0b0',
		fontWeight: 400,
		textAlign: 'center',
		marginRight: 21,
		whiteSpace: 'nowrap'
	},
	box: {
		padding: 24,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		minHeight: '100vh',
		flexDirection: 'column',
		maxWidth: 900,
		margin: 'auto'
	},
	form: {
		width: '100%', // Fix IE 11 issue.
		marginTop: theme.spacing(1)
	},
	label: { color: 'rgb(0,0,0,0.4)', paddingLeft: '5px' },
	submit: {
		margin: theme.spacing(3, 2, 2),
		padding: 10,
		width: 160,
		height: 56,
		borderRadius: 3,
		marginTop: 49,
		fontWeight: 'bold'
	},
	inputs: {
		marginTop: '.8rem',
		height: '2rem',
		padding: '5px'
	},
	link: { textDecoration: 'none', display: 'flex', flexWrap: 'nowrap' },
	forgot: {
		paddingRight: 10,
		color: '#3a8dff'
	}
}));

export default function Login() {
	const classes = useStyles();
	const history = useHistory();
	const login = useLogin();

	return (
		<Authorization>
			<Box className={classes.buttonHeader}>
				<Box p={1} alignSelf="flex-end" alignItems="center">
					<Link to="/signup" className={classes.link}>
						<Button className={classes.noAccBtn}>Don't have an account?</Button>
						<Button color="background" className={classes.accBtn} variant="contained">
							Create account
						</Button>
					</Link>
				</Box>

				<Box width="100%" maxWidth={450} p={3} alignSelf="center">
					<Grid container>
						<Grid item xs>
							<Typography className={classes.welcome} variant="h4">
								Welcome back!
							</Typography>
						</Grid>
					</Grid>
					<Formik
						initialValues={{
							email: '',
							password: ''
						}}
						validationSchema={Yup.object().shape({
							email: Yup.string().required('Email is required').email('Email is not valid'),
							password: Yup.string()
								.required('Password is required')
								.max(100, 'Password is too long')
								.min(6, 'Password too short')
						})}
						onSubmit={({ email, password }, { setStatus, setSubmitting }) => {
							setStatus();
							login(email, password).then(
								(user) => {
									history.push('/chat');
									return;
								},
								(error) => {
									setSubmitting(false);
									setStatus(error);
								}
							);
						}}
					>
						{({ handleSubmit, handleChange, values, touched, errors }) => (
							<form onSubmit={handleSubmit} className={classes.form} noValidate>
								<TextField
									id="email"
									label={
										<Typography className={classes.label} variant="subtitle1">
											E-mail address
										</Typography>
									}
									fullWidth
									margin="normal"
									InputLabelProps={{
										shrink: true
									}}
									InputProps={{ classes: { input: classes.inputs } }}
									name="email"
									autoComplete="email"
									autoFocus
									helperText={touched.email ? errors.email : ''}
									error={touched.email && Boolean(errors.email)}
									value={values.email}
									onChange={handleChange}
								/>
								<TextField
									id="password"
									label={
										<Typography className={classes.label} variant="subtitle1">
											Password
										</Typography>
									}
									fullWidth
									margin="normal"
									InputLabelProps={{
										shrink: true
									}}
									InputProps={{
										classes: { input: classes.inputs },
										endAdornment: <Typography className={classes.forgot}>Forgot?</Typography>
									}}
									type="password"
									autoComplete="current-password"
									helperText={touched.password ? errors.password : ''}
									error={touched.password && Boolean(errors.password)}
									value={values.password}
									onChange={handleChange}
									type="password"
								/>

								<Box textAlign="center">
									<Button
										type="submit"
										size="large"
										variant="contained"
										color="primary"
										className={classes.submit}
									>
										Login
									</Button>
								</Box>

								<div style={{ height: 95 }} />
							</form>
						)}
					</Formik>
				</Box>
				<Box p={1} alignSelf="center" />
			</Box>
		</Authorization>
	);
}
