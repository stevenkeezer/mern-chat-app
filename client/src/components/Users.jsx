import Avatar from '@material-ui/core/Avatar';
import Badge from '@material-ui/core/Badge';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import SearchIcon from '@material-ui/icons/Search';
import React, { useEffect, useState } from 'react';
import Dropdown from '../layout/Dropdown';
import commonUtilities from '../utilities/common';
import { useGetUsers, useSearchUsers } from '../services/userService';

const useStyles = makeStyles((theme) => ({
	root: {
		'& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
			borderColor: 'white'
		},
		'& .Mui-focused .MuiOutlinedInput-notchedOutline': {
			border: '1px solid white'
		}
	},
	subheader: {
		display: 'flex',
		alignItems: 'center',
		cursor: 'pointer'
	},
	globe: {
		backgroundColor: theme.palette.primary.dark
	},
	subheaderText: {
		color: theme.palette.primary.dark
	},
	list: {
		overflowY: 'auto',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center'
	},
	box: {
		paddingLeft: 21,
		paddingRight: 21
	},
	listItem: {
		height: 80,
		filter: 'drop-shadow(0px 2px 5px rgba(88,133,196,0.05))',
		borderRadius: 8
	},
	listItemTop: { marginTop: 15, marginBottom: 15 },
	chatHeader: {
		fontWeight: 600,
		paddingBottom: 12
	},
	avatar: { width: 44, height: 44, textTransform: 'uppercase' },
	search: {
		height: '50px',
		borderRadius: '5px',
		marginLeft: 30,
		marginTop: 10
	},
	margin: {
		paddingBottom: 20
	},
	searchHeader: {
		'& .MuiFilledInput-underline::before': {
			borderBottom: 'none'
		},
		backgroundColor: 'white',
		top: 0,
		width: 300,
		zIndex: 10,
		marginBottom: 10
	},
	searchInput: {
		height: 50,
		borderRadius: 8,
		backgroundColor: '#e9eef9',
		display: 'flex',
		paddingLeft: 20,
		alignItems: 'center'
	},
	searchIcon: {
		color: '#B1C3DF',
		marginRight: 6
	},
	topUserLabel: {
		marginLeft: 6
	},
	bottomUserLabel: {
		marginLeft: 10
	}
}));

const StyledBadge = withStyles((theme) => ({
	badge: {
		backgroundColor: (props) => props.color,
		color: (props) => props.color,
		boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
		'&::after': {
			position: 'absolute',
			top: 0,
			left: 0,
			width: '100%',
			height: '100%',
			borderRadius: '50%',
			border: '1px solid currentColor',
			content: '""'
		}
	}
}))(Badge);

const Users = ({ socket, setUser, setScope, currentUser }) => {
	const classes = useStyles();
	const [ users, setUsers ] = useState([]);
	const [ onlineUsers, setOnlineUsers ] = useState({});
	const [ query, setQuery ] = useState('');

	const getUsers = useGetUsers();
	const searchUsers = useSearchUsers();

	useEffect(() => {
		getUsers().then((res) => setUsers(res));
	}, []);

	useEffect(() => {
		socket.on('onlineUsers', (data) => {
			setOnlineUsers(data);
		});
		socket.on('newUser', (data) => {
			const newUsers = [ ...users ];
			newUsers.push(data);
			setUsers(newUsers);
		});
	}, []);

	const search = async () => {
		const searchResults = await searchUsers(query);
		setUsers(searchResults);
	};

	const handleSearch = (e) => {
		setQuery(e);
	};

	useEffect(
		() => {
			search();
		},
		[ query ]
	);

	return (
		<div className={classes.box}>
			<div position="fixed" className={classes.searchHeader}>
				{currentUser && (
					<ListItem
						disableGutters={true}
						className={(classes.listItem, classes.listItemTop)}
						key={currentUser._id}
					>
						<ListItemAvatar className={classes.avatar}>
							<StyledBadge
								overlap="circle"
								anchorOrigin={{
									vertical: 'bottom',
									horizontal: 'right'
								}}
								variant="dot"
								color={'#1CED84'}
							>
								<Avatar
									className={classes.avatar}
									style={{
										fontWeight: 'bold',
										backgroundColor:
											'#' +
											commonUtilities.intToRGB(commonUtilities.hashCode(currentUser.username)),
										marginRight: 4
									}}
								>
									{currentUser.username.slice(0, 2)}
								</Avatar>
							</StyledBadge>
						</ListItemAvatar>
						<ListItemText className={classes.topUserLabel} primary={currentUser.username} />
						<Dropdown currentUserId={currentUser._id} />
					</ListItem>
				)}

				<Typography variant="h6" className={classes.chatHeader}>
					Chats
				</Typography>
				<TextField
					variant="outlined"
					fullWidth
					placeholder="Search..."
					className={classes.root}
					InputProps={{
						className: classes.searchInput,
						startAdornment: <SearchIcon className={classes.searchIcon} />
					}}
					value={query}
					onChange={(e) => handleSearch(e.target.value)}
				/>
			</div>
			<List className={classes.list}>
				{users &&
				users.length > 0 && (
					<React.Fragment>
						{users.map((u) => (
							<ListItem
								className={classes.listItem}
								key={u._id}
								onClick={() => {
									setUser(u);
									setScope(u.username);
								}}
								button
							>
								<ListItemAvatar className={classes.avatar}>
									<StyledBadge
										overlap="circle"
										anchorOrigin={{
											vertical: 'bottom',
											horizontal: 'right'
										}}
										variant="dot"
										color={!onlineUsers[u._id] ? '#D0DAE9' : '#1CED84'}
									>
										<Avatar
											className={classes.avatar}
											style={{
												fontWeight: 'bold',
												backgroundColor:
													'#' + commonUtilities.intToRGB(commonUtilities.hashCode(u.username))
											}}
										>
											{u.username.slice(0, 2)}
										</Avatar>
									</StyledBadge>
								</ListItemAvatar>
								<ListItemText primary={u.username} className={classes.bottomUserLabel} />
							</ListItem>
						))}
					</React.Fragment>
				)}
			</List>
		</div>
	);
};

export default Users;
