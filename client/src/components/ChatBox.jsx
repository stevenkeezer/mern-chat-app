import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import classnames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { useVerify } from '../services/authenticationService';
import { useGetConversationMessages, useSendConversationMessage } from '../services/chatService';

const useStyles = makeStyles((theme) => ({
	root: {
		height: '100vh',
		'& .MuiOutlinedInput-notchedOutline': {
			borderColor: 'white'
		}
	},
	headerRow: {
		maxHeight: 60,
		zIndex: 5
	},
	paper: {
		display: 'flex',
		alignItems: 'center',
		height: '100%',
		marginLeft: 3,
		height: 90,
		filter: 'drop-shadow(0px 2px 10px rgba(88,133,196,0.1))',
		boxShadow: 'none'
	},
	messageContainer: {
		display: 'flex',
		alignContent: 'flex-end'
	},
	messagesRow: {
		overflowY: 'auto'
	},
	newMessageRow: {
		width: '100%',
		padding: theme.spacing(0, 2, 1)
	},
	messageBubble: {
		flex: '0 1 auto',
		padding: 10,
		border: '1px solid white',
		color: theme.palette.primary.light,
		backgroundImage: 'linear-gradient(225deg, #6cc1ff 0%, #3a8dff 100%)',
		borderRadius: '0 10px 10px 10px',
		marginTop: 8,
		maxWidth: '40em',
		color: 'white'
	},
	messageBubbleRight: {
		borderRadius: '10px 0 10px 10px',
		backgroundColor: '#f4f6fa',
		backgroundImage: 'none',
		color: '#91a3c0',
		fontWeight: 600,
		borderRadius: '10px 10px 0 10px',
		maxWidth: '60%'
	},
	inputRow: {
		background: 'white',
		position: 'fixed',
		bottom: 0,
		right: 0,
		padding: 20,
		left: 342
		// [theme.breakpoints.up('xs')]: {}
	},
	form: {
		width: '100%'
	},
	avatar: {
		margin: theme.spacing(1, 1.5),
		minWidth: 0
	},
	listItem: {
		display: 'flex',
		width: '100%'
	},
	listItemRight: {
		flexDirection: 'row-reverse'
	},
	messageInput: {
		height: 70,
		borderRadius: 8,
		backgroundColor: '#F4F6FA',
		display: 'flex',
		paddingLeft: 20,
		alignItems: 'center'
	}
}));

const ChatBox = (props) => {
	const [ currentUserId, setCurrentUserId ] = useState(null);
	const [ newMessage, setNewMessage ] = useState('');
	const [ messages, setMessages ] = useState([]);
	const [ lastMessage, setLastMessage ] = useState(null);
	const verifyUser = useVerify();

	const getConversationMessages = useGetConversationMessages();
	const sendConversationMessage = useSendConversationMessage();

	let chatBottom = useRef(null);
	const classes = useStyles();

	useEffect(
		() => {
			reloadMessages();
			scrollToBottom();
		},
		[ lastMessage, props.scope, props.conversationId ]
	);

	useEffect(() => {
		props.socket.on('messages', (data) => setLastMessage(data));
	}, []);

	const reloadMessages = () => {
		if (props.scope === 'Global Chat') {
			return;
		} else if (props.scope !== null && props.conversationId !== null) {
			getConversationMessages(props.user._id).then((res) => setMessages(res));
		} else {
			setMessages([]);
		}
	};

	const scrollToBottom = () => {
		chatBottom.current.scrollIntoView({ behavior: 'smooth' });
	};

	useEffect(
		() => {
			scrollToBottom();
		},
		[ messages ]
	);

	const handleSubmit = (e) => {
		e.preventDefault();

		if (props.scope === 'Global Chat') {
		} else {
			sendConversationMessage(props.user._id, newMessage).then((res) => {
				setNewMessage('');
			});
		}
	};
	useEffect(() => {
		const currentLoggedInUser = async () => {
			const curr = await verifyUser();
			if (curr) setCurrentUserId(curr[0]._id);
		};
		currentLoggedInUser();
	}, []);

	return (
		<Grid container className={classes.root}>
			<Grid item xs={12}>
				<Grid container className={classes.messageContainer}>
					<Grid item xs={12} className={classes.messagesRow}>
						<div style={{ height: 30 }} />
						{messages.length > 0 && (
							<List>
								{messages.map((m) => (
									<ListItem
										key={m._id}
										className={classnames(classes.listItem, {
											[`${classes.listItemRight}`]: m.fromObj[0]._id === currentUserId
										})}
										alignItems="flex-start"
									>
										<ListItemAvatar className={classes.avatar}>
											<Avatar>{m.fromObj[0].name}</Avatar>
										</ListItemAvatar>
										<p>{m.fromObj[0]._id !== currentUserId && m.fromObj[0].username}</p>
										<ListItemText
											classes={{
												root: classnames(classes.messageBubble, {
													[`${classes.messageBubbleRight}`]:
														m.fromObj[0]._id === currentUserId
												})
											}}
											primary={<React.Fragment>{m.body}</React.Fragment>}
										/>
									</ListItem>
								))}
							</List>
						)}
						<div ref={chatBottom} />
					</Grid>
				</Grid>
				<div style={{ height: 120 }} />
			</Grid>
			{props.scope !== 'Global Chat' && (
				<Grid item xs={12} className={classes.inputRow}>
					<form onSubmit={handleSubmit} className={classes.form}>
						<Grid container className={classes.newMessageRow} alignItems="flex-end">
							<Grid item xs={12}>
								<TextField
									id="message"
									placeholder="Type something..."
									variant="outlined"
									fullWidth
									value={newMessage}
									InputProps={{
										className: classes.messageInput,
										disableunderline: true
									}}
									onChange={(e) => setNewMessage(e.target.value)}
								/>
							</Grid>
						</Grid>
					</form>
				</Grid>
			)}
		</Grid>
	);
};

export default ChatBox;
