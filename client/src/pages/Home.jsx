import React, { useState, useEffect } from 'react';
import Container from '@material-ui/core/Container';
import Login from './Login';
import Signup from './Signup';

const Home = () => {
	const [ page, setPage ] = useState('login');

	const handleClick = (location) => {
		setPage(location);
	};

	let Content;

	if (page === 'login') {
		Content = <Login handleClick={handleClick} />;
	} else {
		Content = <Signup handleClick={handleClick} />;
	}

	return (
		<Container component="main" maxWidth={false} disableGutters>
			{Content}
		</Container>
	);
};

export default Home;
