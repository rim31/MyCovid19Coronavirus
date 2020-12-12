import React, { useState } from 'react'
import { useHistory } from 'react-router-dom';
import { StoreContainer } from '../Store';
import LinearChart from '../Charts/LinearChart';
// import BarChart from '../Charts/BarChart';
// import { map } from 'lodash';
// import { imgUrl } from '../../../public/loading.png';
import SelectCase from '../Charts/SelectCase';
import SelectPeriod from '../Charts/SelectPeriod';
import moment from 'moment';

// const imgStyle = {
//   height: '2rem',
//   paddingLeft: '2px',
//   backgroundImage: 'url(`../../../public/loading.png`)',
// };

// ISO 3166-1 alpha-2
// ⚠️ No support for IE 11
function countryToFlag(isoCode: any) {
  return typeof String.fromCodePoint !== 'undefined'
    ? isoCode
      .toUpperCase()
      .replace(/./g, (char: any) => String.fromCodePoint(char.charCodeAt(0) + 127397))
    : isoCode;
}


export default function GraphComponent() {
  const [country, setCountry] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [countries, setCountries] = useState<any>([]);
  const [dates, setDates] = React.useState<string>(`${moment().subtract(1, 'week').format()}`)
  const [cases, setCases] = React.useState<string>("confirmed")

  let history = useHistory();
  // let url = useParams;
  const unstated = StoreContainer.useContainer();

  // const country_list = unstated.country_list.map((item, i) =>
  //   <span style={{ fontSize: '6px', paddingLeft: '3px' }} key={i} onClick={(i) => alert(i)}>{item.name}</span>)

  function handleClick(event: any) {
    // setCountry(value);
    setCountry(event.currentTarget.dataset.name.toLowerCase());
    unstated.setCountry(event.currentTarget.dataset.name.toLowerCase());
    setCode(event.currentTarget.dataset.code.toLowerCase());
    unstated.setCode(event.currentTarget.dataset.code.toLowerCase());
    console.log(event.currentTarget.dataset.code.toLowerCase());

  }

  const handleSubmit = (evt: any) => {
    evt.preventDefault();
    if (country) {
      // alert(`Submitting Country ${country}`);
      // console.log(getCovidByCountry(country));
      // console.log(unstated.getCovidCountry(country));
      history.push(`/graph/${code}`)
      // console.log(unstated.data);
      // console.log(unstated.labels);
    }
  }

  React.useEffect(() => {
    console.log("Graph")
    setCountries(unstated.country_list);



    // console.log(url);
    // console.log(unstated.covidApiCountries);
    if (unstated.code) {
      // unstated.getCovidCountry(country, "deaths");
      // unstated.getCovidCountry(country, "confirmed");
      unstated.getCovidCountry(unstated.code, cases, dates);
    } else if (unstated.country !== '' && countries.filter((countries: any) => countries.name.toLowerCase().includes(unstated.country)).length === 1) {
      // console.log("OK");
      // console.log(countries.filter((countries: any) => countries.name.toLowerCase().includes(unstated.country))[0].name);
      unstated.getCovidCountry(unstated.country, cases, dates);
    } else {
      unstated.getCovidCountry("", "", `${moment().subtract(3, 'days').format()}`);
    }

    // eslint-disable-next-line
  }, [country, unstated.country, cases, dates])

  return (
    <div style={{ backgroundColor: "#343a40" }}>
      < h2 style={{ textAlign: "center", color: "white" }}> Covid19 - Search a Country </h2 >
      <div className="field">
        <div className="control has-icons-left">
          <form onSubmit={handleSubmit} style={{ display: 'flex' }}>
            <input type="text" className="input  is-fullwidth" value={country} onChange={e => setCountry((e.target.value).toLowerCase())} />
            {country ? <span className="icon is-small is-left" onClick={() => { setCountry(""); setCode(""); }}>
              <i className="delete"></i>
            </span> : <></>}
            <SelectCase setCases={setCases} />
            <SelectPeriod setDates={setDates} />
            <input type="submit" value="Submit" className="button is-primary " style={{ marginLeft: "3px" }} />
          </form>
        </div>
      </div>
      <div>
        <h1> {country} </h1>
        <div className="columns">
          <div
            className="column is-one-fifth"
            style={{
              display: "flex", flexDirection: "column", flexWrap: "wrap", overflow: "hidden",
              whiteSpace: "nowrap", /* Don't forget this one */
              textOverflow: "ellipsis",
            }}>
            {unstated.country_list.filter((countries: any) => countries.name.toLowerCase().includes(country)).map((item: any, i: any) => <span data-name={item.name} data-code={item.code}
              className="button is-secondary is-fullwidth" key={i} onClick={handleClick}
              style={{ margin: "1px", justifyContent: "space-between", }} >
              {item.name}

              <span>{countryToFlag(item.code)}</span>

            </span>)}
          </div>
          <div className="column">

            <div id="carouselExampleIndicators" className="carousel slide" data-ride="carousel">
              {/*<ol className="carousel-indicators">
                <li data-target="#carouselExampleIndicators" data-slide-to="0" className="active"></li>
                <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
                <li data-target="#carouselExampleIndicators" data-slide-to="2"></li>
              </ol>
              <div className="carousel-inner">
                <div className="carousel-item active">
                  {unstated.data ?
                    <LinearChart dataCountry={unstated.data} labelsCountry={unstated.labels} country={country} />
                    : <></>}
                </div>
                <div className="carousel-item">
                  {unstated.data ?
                    <BarChart dataCountry={unstated.data} labelsCountry={unstated.labels} country={country} />
                    : <></>}    </div>
                <div className="carousel-item">
                  {unstated.data ?
                    <LinearChart dataCountry={unstated.data} labelsCountry={unstated.labels} country={country} />
                    : <></>}
                </div>
              </div>
              <a className="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="sr-only">Previous</span>
              </a>
              <a className="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="sr-only">Next</span>
              </a>*/}
            </div>

            {unstated.data ?
              <LinearChart dataCountry={unstated.data} labelsCountry={unstated.labels} country={country} />
              : <></>}
          </div>
        </div>
      </div>
    </div >
  )
}
