import React from 'react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import { StoreContainer } from '../Store';
import ListCountries from '../modules/ListCountries';
import Dashboard from '../Charts/Dashboard';
import MapChart from '../Map/MapChart';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        https://rim31.github.io/
      </Link>{' '}
      {new Date().getFullYear()}
    </Typography>
  );
}

export default function MainComponent() {
  const unstated = StoreContainer.useContainer();
  const [data, setData] = React.useState<any>("");
  const [content, setContent] = React.useState("");


  const getCovidData = () => {
    try {
      fetch(`https://api.covid19api.com/summary`, {
        method: "GET",
      }).then((response: any) => response.json()).then((res) => {
        setData(res);
        return (res)
      }).catch(err => alert(`please change browser : error getting data`));
    } catch (err) {
      console.log(err)
      return;
    }
  };

  async function getAll() {
    await unstated.getTotal();
  }

  React.useEffect(() => {
    setData(getCovidData());
    unstated.updateCountriesML();
    console.log("countriesML : mainComponents", unstated.countriesML)
    // problem with fetching data :TODO  Remove this(after found out) 
    getAll();
    // eslint-disable-next-line
  }, [])
  return (
    <div style={{ backgroundColor: '#282c34' }}>
      <div className="row py-3">
        <div className=" col-lg-9 col-md-9 col-sm-12 col-xs-12" id="sticky-sidebar">
          <Dashboard data={unstated.total ? unstated.total : (data ? data : {})}
            content={content ? content : ''}
            style={{ position: "absolute", zIndex: 100, backgroundColor: '#282c34' }}
          />
          <MapChart setTooltipContent={setContent} />
        </div>
        <div className="order-1 col-lg-3 col-md-3 col-sm-12 col-xs-12" id="main" >
          {/* <ListCountries data={unstated.getCovid19All} /> */}
          <ListCountries data={unstated.total !== undefined ? unstated.total : (data !== undefined ? data : {})}
            setCountry={unstated.setCountry} setCode={unstated.setCode} />
          {/* {unstated.total ? unstated.total : (data ? data : {})} */}
        </div>
      </div>


      <Box pt={4} style={{ bottom: 0, position: 'absolute' }}>
        <Copyright />
      </Box>
    </div>
  );
}