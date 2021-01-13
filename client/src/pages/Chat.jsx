import React from 'react';
import { useHistory } from 'react-router-dom';
import Users from '../components/Users';
import { authenticationService } from '../services/authenticationService';

export default function Chat() {
	const history = useHistory();

	React.useEffect(
		() => {
			if (!authenticationService.currentUserValue) {
				history.push('/signup');
			}
		},
		[ history ]
	);

	return (
		<div>
			<Users />
		</div>
	);
}
