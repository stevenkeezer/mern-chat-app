import React from 'react';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';

export default function Login({ handleClick }) {
	return (
		<div>
			<Typography>
				<Link onClick={() => handleClick('register')}>Don't have an account?</Link>
			</Typography>
		</div>
	);
}
