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

const useStyles = makeStyles((theme) => ({
	list: {
		maxHeight: 'calc(100vh - 112px)',
		overflowY: 'auto'
	}
}));

const Users = (props) => {
	const classes = useStyles();
	const history = useHistory();
	const [ currentUserId ] = useState(authenticationService.currentUserValue._id);
	const [ users, setUsers ] = useState([]);
	const [ newUser, setNewUser ] = useState(null);
	const [ onlineUsers, setOnlineUsers ] = useState({});

	const getUsers = useGetUsers();
	const logout = useLogout();

	useEffect(
		() => {
			getUsers().then((res) => setUsers(res));
		},
		[ newUser ]
	);

	useEffect(() => {
		const socket = socketIOClient('http://localhost:5000', {
			transports: [ 'websocket', 'polling', 'flashsocket' ]
		});
		socket.on('onlineUsers', (data) => {
			setOnlineUsers(data);
		});
		socket.on('users', (data) => {
			setNewUser(data);
		});
	}, []);

	const handleLogout = async () => {
		logout(currentUserId).then(
			() => {
				history.push('/signup');
				return;
			},
			(error) => {}
		);
	};
	return (
		<React.Fragment>
			<Button onClick={handleLogout}>Logout</Button>
			<List className={classes.list}>
				{users.length > 0 && (
					<React.Fragment>
						{users.map((u) => (
							<ListItem className={classes.listItem} key={u._id} button>
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
