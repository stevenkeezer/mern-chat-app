import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import Users from '../components/Users';
import { useVerify } from '../services/authenticationService';

export default function Chat() {
	const history = useHistory();
	const verifyUser = useVerify();

	React.useEffect(
		() => {
			const user = JSON.parse(localStorage.getItem('currentUser'));
			async function verifiedToken() {
				if (user) {
					const verified = await verifyUser(user.token);

					if (verified.ok === false) {
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
			<Users />
		</div>
	);
}
