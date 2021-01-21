import React from "react";
import { MuiThemeProvider } from "@material-ui/core";
import { createMuiTheme } from '@material-ui/core/styles';
import { BrowserRouter, Route, Redirect } from "react-router-dom";
import { SnackbarProvider } from 'notistack';
import socketIOClient from 'socket.io-client';

import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Chat from "./pages/Chat"

import "./App.css";

let theme = createMuiTheme({
  palette: {
    primary: {
      light: '#4791db',
      main: '#3a8dff',
      dark: '#115293',
    },
    secondary: {
      light: '#ffd95a',
      main: '#f9a825',
      dark: '#c17900',
      contrastText: '#212121',
    },
    message: {
      bubble: "#f4f6fa"
    },
    background: {
      default: '#ffffff',
    },
  },
  typography: {
    useNextVariants: true,
    button: {
      textTransform: 'none'
    },
    h4: {
      fontSize: 26,
    },
    subtitle1: {
      fontSize: 19
    }
  },
  buttonHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    flexDirection: 'column',
    bgcolor: 'background.paper',
    minHeight: '100vh',
    paddingTop: 23
  },
  box: {
    padding: 24,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    flexDirection: 'column',
    maxWidth: 900,
    margin: 'auto'
  },
  noAccBtn: {
    color: '#b0b0b0',
    fontWeight: 400,
    textAlign: 'center',
    marginRight: 21,
    whiteSpace: 'nowrap'
  },
  welcome: {
    paddingBottom: 20,
    color: '#000000',
    fontWeight: 500
  }
});


function App() {
  const [loggedIn, setLoggedIn] = React.useState(true)
  const socket = socketIOClient(process.env.REACT_APP_API_URL, {
    transports: ['websocket', 'polling', 'flashsocket']
  });

  return (
    <MuiThemeProvider theme={theme}>
      <SnackbarProvider maxSnack={3} autoHideDuration={3000}>
        <BrowserRouter>
          <Route exact path="/">
            {loggedIn ? <Redirect to="/signup" /> : <Redirect to="/login" />}
          </Route>
          <Route path="/signup" component={Signup} />
          <Route path="/login" component={Login} />
          <Route path="/chat" component={() => <Chat socket={socket} />} />
        </BrowserRouter>
      </SnackbarProvider>

    </MuiThemeProvider>
  );
}

export default App;
