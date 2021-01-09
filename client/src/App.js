import React from "react";
import { MuiThemeProvider } from "@material-ui/core";
import { createMuiTheme } from '@material-ui/core/styles';
import { BrowserRouter, Route, Redirect } from "react-router-dom";
import { SnackbarProvider } from 'notistack';

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
  }
});


function App() {
  const [loggedIn, setLoggedIn] = React.useState(true)

  return (
    <MuiThemeProvider theme={theme}>
      <SnackbarProvider maxSnack={3} autoHideDuration={3000}>
        <BrowserRouter>
          <Route exact path="/">
            {loggedIn ? <Redirect to="/signup" /> : <Redirect to="/login" />}
          </Route>
          <Route path="/signup" component={Signup} />
          <Route path="/login" component={Login} />
          <Route path="/chat" component={Chat} />
        </BrowserRouter>
      </SnackbarProvider>

    </MuiThemeProvider>
  );
}

export default App;
