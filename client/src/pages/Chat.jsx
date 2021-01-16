import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import Users from '../components/Users';
import ChatBox from '../components/ChatBox';
import { useVerify } from '../services/authenticationService';
import socketIOClient from 'socket.io-client';

export default function Chat() {
	const history = useHistory();
	const verifyUser = useVerify();
	const [ scope, setScope ] = useState('Global Chat');
	const [ user, setUser ] = useState(null);
	const socket = socketIOClient(process.env.REACT_APP_API_URL, {
		transports: [ 'websocket', 'polling', 'flashsocket' ]
	});

	React.useEffect(
		() => {
			const user = JSON.parse(localStorage.getItem('currentUser'));
			async function verifiedToken() {
				if (user) {
					const verified = await verifyUser();

					if (!verified) {
						return history.push('/signup');
					}
				} else {
					return history.push('/signup');
				}
			}
			verifiedToken();
		},
		[ history, verifyUser ]
	);

	return (
		<div>
			<Users setUser={setUser} setScope={setScope} socket={socket} />
			<ChatBox scope={scope} user={user} socket={socket} />
		</div>
	);
}
