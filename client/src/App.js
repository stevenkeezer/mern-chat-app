import React from "react";
import { MuiThemeProvider } from "@material-ui/core";
import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';
import { BrowserRouter, Route, Redirect } from "react-router-dom";
import Login from "./pages/Login"
import Signup from "./pages/Signup"

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
    }
  },
  underline: {
    color: 'red',
    '&:before': {
      border: '2px solid red'
    }
  }
});

theme = responsiveFontSizes(theme);

function App() {
  const [loggedIn, setLoggedIn] = React.useState(true)

  return (
    <MuiThemeProvider theme={theme}>
      <BrowserRouter>
        <Route exact path="/">
          {loggedIn ? <Redirect to="/signup" /> : <Redirect to="/login" />}
        </Route>
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />

      </BrowserRouter>
    </MuiThemeProvider>
  );
}

export default App;
