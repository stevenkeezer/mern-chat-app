import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';
import React, { useEffect, useState } from 'react';
import Chatbox from '../components/ChatBox';
import Users from '../components/Users';
import Dropdown from '../layout/Dropdown';
import { useVerify } from '../services/authenticationService';

const drawerWidth = 342;

const useStyles = makeStyles((theme) => ({
	root: {
		'& .MuiDrawer-paperAnchorDockedLeft': {
			borderRight: 'none'
		},
		'& .MuiOutlinedInput-notchedOutline': {
			borderColor: theme.palette.background.default
		},
		display: 'flex',
		borderRight: 'none'
	},
	drawer: {
		[theme.breakpoints.up('sm')]: {
			width: drawerWidth,
			flexShrink: 0
		}
	},
	dots: {
		color: '#95A7C4'
	},
	onlineIcon: {
		backgroundColor: '#1CED84',
		fontSize: 13,
		marginRight: 5,
		width: 8,
		height: 8,
		borderRadius: 4
	},
	appBar: {
		height: 89,
		display: 'flex',
		justifyContent: 'center',
		backgroundColor: theme.palette.background.default,
		color: 'black',
		filter: 'drop-shadow(0px 2px 10px rgba(88,133,196,0.1))',
		boxShadow: 'none',
		[theme.breakpoints.up('sm')]: {
			width: `calc(100% - ${drawerWidth + 25}px)`,
			marginLeft: drawerWidth
		}
	},
	menuButton: {
		marginRight: theme.spacing(2),
		[theme.breakpoints.up('sm')]: {
			display: 'none'
		}
	},
	// necessary for content to be below app bar
	toolbar: theme.mixins.toolbar,
	toolbar: {
		display: 'flex',
		justifyContent: 'space-between',
		marginRight: 19
	},
	drawerPaper: {
		width: drawerWidth
	},
	content: {
		flexGrow: 1
	},
	onlineLabel: {
		color: '#BFC9DB'
	},
	topBarContent: {
		display: 'flex',
		alignItems: 'baseline',
		marginLeft: 10
	}
}));

function ResponsiveDrawer({ setScope, socket, setUser, user, scope, mobileOpen, setMobileOpen }) {
	const { window } = { setScope, socket, setUser, user, scope, mobileOpen, setMobileOpen };
	const classes = useStyles();
	const theme = useTheme();

	const [ onlineUsers, setOnlineUsers ] = useState({});
	const [ currentUser, setCurrentUser ] = useState(null);

	const verifyUser = useVerify();

	const handleDrawerToggle = () => {
		setMobileOpen(!mobileOpen);
	};

	useEffect(
		() => {
			socket.on('onlineUsers', (data) => {
				setOnlineUsers(data);
			});
		},
		[ socket ]
	);

	useEffect(() => {
		const currentLoggedInUser = async () => {
			const curr = await verifyUser();
			if (curr) setCurrentUser(curr[0]);
			console.log(curr[0], 'curr');
		};
		currentLoggedInUser();
	}, []);

	const drawer = (
		<div>
			<Users
				setScope={setScope}
				socket={socket}
				setUser={setUser}
				currentUser={currentUser}
				onlineUsers={onlineUsers}
			/>
		</div>
	);

	const container = window !== undefined ? () => window().document.body : undefined;

	return (
		<React.Fragment>
			<div className={classes.root}>
				<CssBaseline />
				<AppBar position="fixed" className={classes.appBar}>
					<Toolbar className={classes.toolbar}>
						<IconButton
							color="inherit"
							aria-label="open drawer"
							edge="start"
							onClick={handleDrawerToggle}
							className={classes.menuButton}
						>
							<MenuIcon />
						</IconButton>

						<Typography color="inherit" variant="h6">
							{scope !== 'Global Chat' && (
								<div style={{ display: 'flex', alignItems: 'baseline' }}>
									<span>{scope}</span>
									{onlineUsers[user._id] && (
										<div className={classes.topBarContent}>
											<div className={classes.onlineIcon} />
											<Typography variant="caption" className={classes.onlineLabel}>
												Online
											</Typography>
										</div>
									)}
								</div>
							)}
						</Typography>

						<Dropdown currentUserId={currentUser && currentUser._id} />
					</Toolbar>
				</AppBar>
				<nav className={classes.drawer} aria-label="chats">
					<Hidden smUp implementation="css">
						<Drawer
							container={container}
							variant="temporary"
							anchor={theme.direction === 'rtl' ? 'right' : 'left'}
							open={mobileOpen}
							onClose={handleDrawerToggle}
							classes={{
								paper: classes.drawerPaper
							}}
							ModalProps={{
								keepMounted: true
							}}
						>
							{drawer}
						</Drawer>
					</Hidden>
					<Hidden xsDown implementation="css">
						<Drawer
							classes={{
								paper: classes.drawerPaper
							}}
							variant="permanent"
							open
						>
							{drawer}
						</Drawer>
					</Hidden>
				</nav>
				<main className={classes.content}>
					<div className={classes.toolbar} />
					<Chatbox scope={scope} user={user} socket={socket} currentUser={currentUser} />
					<div className={classes.toolbar} />
				</main>
			</div>
		</React.Fragment>
	);
}

export default ResponsiveDrawer;
