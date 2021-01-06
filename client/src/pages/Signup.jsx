import React from 'react';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';

export default function Signup({ handleClick }) {
	return (
		<div>
			<Typography>
				<Link onClick={() => handleClick('login')}>Already have an account?</Link>
			</Typography>
		</div>
	);
}
