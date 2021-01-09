import React from 'react';
import { useHistory } from 'react-router-dom';

export default function Chat() {
	const history = useHistory();

	React.useEffect(
		() => {
			const userInfo = localStorage.getItem('currentUser');
			if (!userInfo) history.push('/signup');
		},
		[ history ]
	);

	return <div>CHAT</div>;
}
