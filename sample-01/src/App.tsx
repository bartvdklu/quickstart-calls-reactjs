import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import { ToastContainer, Flip } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/toast.override.css';
import LoginPage from 'components/pages/LoginPage';
import LoginPageAdmin from 'components/pages/LoginPageAdmin';
import DirectCallApp from './DirectCallApp';
import DirectCallAppAdmin from './DirectCallAppAdmin';
// import LandingPage from './components/pages/LandingPage';

function App() {
  return (
    <Router>
      <Switch>
        {/* <Route exact path="/" component={LandingPage} /> */}
        <Route path="/direct-call" component={DirectCallApp} />
        <Route path="/admin/direct-call" component={DirectCallAppAdmin} />
        <Route exact path="/" component={LoginPage} />
        <Route path="/admin" component={LoginPageAdmin} />
      </Switch>

      <ToastContainer
        position="bottom-left"
        autoClose={false}
        transition={Flip}
        hideProgressBar
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Router>
  );
}

export default App;
