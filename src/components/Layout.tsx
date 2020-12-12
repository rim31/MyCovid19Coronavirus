import React from 'react'
import { Link } from 'react-router-dom';
import SearchBar from './modules/SearchBar';
import Typography from '@material-ui/core/Typography';
import LinkURL from '@material-ui/core/Link';
import Box from '@material-ui/core/Box';
import { withStyles } from "@material-ui/core/styles";


const WhiteTextTypography = withStyles({
  root: {
    color: "#FFFFFF"
  }
})(Typography);

function Copyright() {
  return (
    <WhiteTextTypography variant="body2" color="textSecondary" align="center" >
      {'Copyright © '}
      <LinkURL color="inherit" href="https://material-ui.com/">
        https://rim31.github.io/
      </LinkURL>{' '}
      {new Date().getFullYear()}
    </WhiteTextTypography>
  );
}

export default function Layout(props: any) {
  return (
    <>
      <nav className="navbar sticky-top  navbar-dark " style={{ backgroundColor: "#574b90", display: "flex", flexWrap: "wrap", justifyContent: "space-between" }}>

        <button className="d-lg-none navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent1"
          aria-controls="navbarSupportedContent1" aria-expanded="false" aria-label="Toggle navigation"><span className="dark-blue-text"><i
            className="fas fa-bars fa-1x"></i></span></button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent1">
          <h3 style={{ color: 'white', textDecoration: 'inherit', paddingLeft: '15px' }}>Covid-19</h3>
          <ul className="navbar-nav mr-auto">
            <li className="nav-item active">
              <Link style={{ color: 'white', textDecoration: 'inherit', paddingLeft: '15px' }} to="/" >Map</Link>
            </li>
            <li className="nav-item">
              <Link style={{ color: 'white', textDecoration: 'inherit', paddingLeft: '15px' }} to="/stats">Stats</Link>
            </li>
            <li>
              <SearchBar />
            </li>
          </ul>
        </div>
        <span className="d-none d-lg-block" style={{ display: "flex", flexWrap: "wrap", justifyContent: "flex-start" }}>
          <Link style={{ color: 'white', textDecoration: 'inherit', paddingLeft: '15px' }} to="/" >Map</Link>
          <Link style={{ color: 'white', textDecoration: 'inherit', paddingLeft: '15px' }} to="/stats">Stats</Link>
        </span>
        <h1 style={{ color: "white", fontWeight: "bold" }}>COVID-19</h1>
        <span className="d-none d-lg-block">
          <SearchBar />
        </span>
      </nav>
      {props.children}
      {/* {React.cloneElement(props.children, { code: unstated.code, country: unstated.country })} */}
      <Box pt={4} style={{ bottom: 0, position: 'absolute', right: 0 }}>
        <Copyright />
      </Box>
    </ >
  )
}
