import React, { useEffect, useState } from 'react';
import List from '@material-ui/core/List';
import Avatar from '@material-ui/core/Avatar';
import socketIOClient from 'socket.io-client';
import { useHistory } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import ListItem from '@material-ui/core/ListItem';
import { useGetUsers } from '../services/userService';
import { makeStyles } from '@material-ui/core/styles';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import { authenticationService, useLogout } from '../services/authenticationService';
import { useSearchUsers } from '../services/userService';

const useStyles = makeStyles((theme) => ({
	list: {
		maxHeight: 'calc(100vh - 112px)',
		overflowY: 'auto'
	}
}));

const Users = (props) => {
	const classes = useStyles();
	const history = useHistory();
	const [ users, setUsers ] = useState([]);
	const [ onlineUsers, setOnlineUsers ] = useState({});
	const [ query, setQuery ] = useState('');

	const getUsers = useGetUsers();
	const searchUsers = useSearchUsers();
	const logout = useLogout();

	useEffect(() => {
		getUsers().then((res) => setUsers(res));
	}, []);

	useEffect(() => {
		const socket = socketIOClient(process.env.REACT_APP_API_URL, {
			transports: [ 'websocket', 'polling', 'flashsocket' ]
		});
		socket.on('onlineUsers', (data) => {
			setOnlineUsers(data);
		});
		socket.on('newUser', (data) => {
			const newUsers = [ ...users ];
			newUsers.push(data);
			setUsers(newUsers);
		});
	}, []);

	const handleLogout = async () => {
		logout(authenticationService.currentUserValue._id).then(
			() => {
				history.push('/signup');
				return;
			},
			(error) => {}
		);
	};

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
		<React.Fragment>
			<Button onClick={handleLogout}>Logout</Button>

			<input type="text" value={query} onChange={(e) => handleSearch(e.target.value)} />

			<List className={classes.list}>
				{users &&
				users.length > 0 && (
					<React.Fragment>
						{users.map((u) => (
							<ListItem
								className={classes.listItem}
								key={u._id}
								onClick={() => {
									props.setUser(u);
									props.setScope(u.username);
								}}
								button
							>
								<ListItemAvatar className={classes.avatar}>
									<Avatar>{u.username.slice(0, 2)}</Avatar>
								</ListItemAvatar>
								<ListItemText primary={u.username} />
								<div>{onlineUsers[u._id] && 'online'}</div>
							</ListItem>
						))}
					</React.Fragment>
				)}
			</List>
		</React.Fragment>
	);
};

export default Users;
