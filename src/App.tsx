import React from 'react';
import Layout from './components/Layout';
import MainComponent from './components/Pages/MainComponent';
import MapComponent from './components/Pages/MapComponent';
import HomeComponent from './components/Pages/HomeComponent';
import AboutComponent from './components/Pages/AboutComponent';
import GraphComponent from './components/Pages/GraphComponent';
import { StoreContainer } from "./components/Store"
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <StoreContainer.Provider>
        <Layout className="App">
          <Switch>
            <Route exact path={'/covid19'} component={MapComponent} />
            <Route exact path={'/'} component={MapComponent} />
            <Route exact path={'/stats'} component={HomeComponent} />
            <Route exact path={'/main'} component={MainComponent} />
            <Route exact path={'/about'} component={AboutComponent} />
            <Route exact path={'/graph/:country?'} component={GraphComponent} />
            <Route path={'*'} ><NotFound /></Route>
          </Switch>
        </Layout>
      </StoreContainer.Provider>
    </Router>
  );
}

function NotFound() {
  return (
    <h1>Page Not Found</h1>
  )
}

export default App;
