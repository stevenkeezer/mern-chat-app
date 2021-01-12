import React from 'react';
import { useHistory } from 'react-router-dom';

export default function Chat() {
	const history = useHistory();

	React.useEffect(() => {}, [ history ]);

	return <div>CHAT</div>;
}
