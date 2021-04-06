import React from 'react';
import Layout from './components/Layout';
import MapComponent from './components/Pages/MapComponent';
import HomeComponent from './components/Pages/HomeComponent';
import { StoreContainer } from "./components/Store"
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <StoreContainer.Provider>
        <Layout className="App">
          <Switch>
            <Route exact path={'/'} component={MapComponent} />
            <Route exact path={'/covid19'} component={MapComponent} />
            <Route exact path={'/stats'} component={HomeComponent} />
            <Route exact path={'/covid19/stats'} component={HomeComponent} />
            <Route path={'*'} ><NotFound /></Route>
          </Switch>
        </Layout>
      </StoreContainer.Provider>
    </Router>
  );
}
{/* <Route exact path={'/graph/:country?'} component={GraphComponent} /> */}

function NotFound() {
  return (
    <h1>Page Not Found</h1>
  )
}

export default App;
