import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import Drawer from '../layout/Drawer';
import { useVerify } from '../services/authenticationService';

export default function Chat({ socket }) {
	const history = useHistory();
	const verifyUser = useVerify();
	const [ scope, setScope ] = useState('Global Chat');
	const [ user, setUser ] = useState(null);

	React.useEffect(
		() => {
			const user = JSON.parse(localStorage.getItem('currentUser'));
			async function verifiedToken() {
				if (user) {
					const verified = await verifyUser();
					socket.emit('login', { userId: verified[0]._id });

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

	return <Drawer scope={scope} setScope={setScope} user={user} setUser={setUser} socket={socket} />;
}
