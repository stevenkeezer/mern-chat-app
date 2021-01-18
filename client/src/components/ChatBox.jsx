import React, { useEffect, useRef, useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import commonUtilities from '../utilities/common';
import EmptyState from '../layout/EmptyState';
import Moment from 'react-moment';

import classnames from 'classnames';
import { useGetConversationMessages, useSendConversationMessage } from '../services/chatService';

const useStyles = makeStyles((theme) => ({
	root: {
		height: '100vh',
		'& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
			borderColor: 'white'
		},
		'& .Mui-focused .MuiOutlinedInput-notchedOutline': {
			border: '1px solid white'
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
		height: '100%',
		display: 'flex',
		alignContent: 'flex-end'
	},
	messagesRow: {
		overflowY: 'auto',
		paddingLeft: 30,
		paddingRight: 30,
		[theme.breakpoints.up('sm')]: {
			paddingLeft: 50
		}
	},
	messageBubble: {
		flex: '0 1 auto',
		padding: 10,
		paddingLeft: 20,
		paddingRight: 20,
		border: '1px solid white',
		color: theme.palette.primary.light,
		backgroundImage: 'linear-gradient(225deg, #6cc1ff 0%, #3a8dff 100%)',
		borderRadius: '0 10px 10px 10px',
		marginTop: 8,
		maxWidth: '40em',
		color: 'white'
	},
	messageBubbleRight: {
		backgroundColor: '#f4f6fa',
		backgroundImage: 'none',
		color: '#91a3c0',
		fontWeight: 600,
		borderRadius: '10px 10px 0 10px'
	},
	messageLabel: { color: '#BECCE2' },
	inputRow: {
		background: 'white',
		paddingBottom: 35,
		position: 'fixed',
		bottom: 0,
		paddingLeft: 45,
		paddingRight: 45,
		width: '100%',
		[theme.breakpoints.up('sm')]: {
			width: 'calc(100% - 340px)',
			paddingLeft: 75
		}
	},
	recordIcon: { marginRight: 12 },
	form: {
		width: '100%'
	},
	avatar: {
		margin: theme.spacing(1, 1.5),
		minWidth: 0
	},
	avatarCircle: {
		height: 30,
		width: 30,
		fontSize: 13,
		textTransform: 'uppercase'
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
	},
	userLabel: { marginRight: 5 },
	messageIcons: {
		display: 'flex',
		color: '#D1D9E6',
		marginRight: 10
	},
	spacerBottom: {
		height: 120
	},
	emptyHeader: {
		marginTop: 30,
		marginBottom: 20
	}
}));

const ChatBox = (props) => {
	const [ newMessage, setNewMessage ] = useState('');
	const [ messages, setMessages ] = useState([]);
	const [ lastMessage, setLastMessage ] = useState(null);

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
		props.socket.on('messages', (data) => {
			setLastMessage(data);
		});
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
		} else if (newMessage !== '') {
			sendConversationMessage(props.user._id, newMessage).then((res) => {
				setNewMessage('');
			});
		}
	};

	return (
		<Grid container className={classes.root}>
			<Grid item xs={12}>
				<Grid container className={classes.messageContainer}>
					{props.scope === 'Global Chat' && (
						<Grid
							container
							spacing={0}
							direction="column"
							alignItems="center"
							justify="center"
							style={{ minHeight: '100vh', paddingTop: 100 }}
						>
							<Grid item>
								<EmptyState />
							</Grid>
							<Typography variant="h4" className={classes.emptyHeader}>
								Welcome to Sigmal
							</Typography>
							<Typography variant="h6">Select a friend or contact to start chatting.</Typography>
						</Grid>
					)}
					<Grid item xs={12} className={classes.messagesRow}>
						{messages.length > 0 && (
							<List>
								{messages.map((m) => (
									<ListItem
										key={m._id}
										className={classnames(classes.listItem, {
											[`${classes.listItemRight}`]: m.fromObj[0]._id === props.currentUser._id
										})}
										alignItems="flex-start"
									>
										{m.fromObj[0]._id !== props.currentUser._id && (
											<ListItemAvatar className={classes.avatar}>
												<Avatar
													className={classes.avatarCircle}
													style={{
														backgroundColor:
															'#' +
															commonUtilities.intToRGB(
																commonUtilities.hashCode(m.fromObj[0].username)
															)
													}}
												>
													{m.fromObj[0].username.slice(0, 2)}
												</Avatar>
											</ListItemAvatar>
										)}

										<div>
											<Typography variant="caption" className={classes.messageLabel}>
												<span
													style={{
														display: 'flex',
														justifyContent:
															m.fromObj[0]._id === props.currentUser._id && 'flex-end'
													}}
												>
													{m.fromObj[0]._id !== props.currentUser._id && (
														<span className={classes.userLabel}>
															{m.fromObj[0].username}
														</span>
													)}
													<Moment format="h:mm" unix>
														{Number(m.date) / 1000}
													</Moment>
												</span>
											</Typography>
											<ListItemText
												classes={{
													root: classnames(classes.messageBubble, {
														[`${classes.messageBubbleRight}`]:
															m.fromObj[0]._id === props.currentUser._id
													})
												}}
												primary={<React.Fragment>{m.body}</React.Fragment>}
											/>
										</div>
									</ListItem>
								))}
							</List>
						)}
						<div ref={chatBottom} />
					</Grid>
				</Grid>
				<div className={classes.spacerBottom} />
			</Grid>
			{props.scope !== 'Global Chat' && (
				<Grid item xs={12} className={classes.inputRow}>
					<form onSubmit={handleSubmit} className={classes.form}>
						<TextField
							id="message"
							placeholder="Type something..."
							variant="outlined"
							fullWidth
							value={newMessage}
							autoComplete="off"
							InputProps={{
								className: classes.messageInput,
								disableunderline: 'true',
								endAdornment: (
									<div className={classes.messageIcons}>
										<FiberManualRecordIcon className={classes.recordIcon} />
										<FileCopyIcon />
									</div>
								)
							}}
							onChange={(e) => setNewMessage(e.target.value)}
						/>
					</form>
				</Grid>
			)}
		</Grid>
	);
};

export default ChatBox;
