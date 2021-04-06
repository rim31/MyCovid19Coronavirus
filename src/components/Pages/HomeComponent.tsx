import React, { useState } from 'react'
// import { useParams, useHistory } from 'react-router-dom';
import BarChart from '../Charts/BarChart';
import LinearChart from '../Charts/LinearChart';
import moment from 'moment';
import { StoreContainer } from '../Store';
// import ListCountries from '../modules/ListCountries';
import Dashboard from '../Charts/Dashboard';
import Flag from '../modules/Flag';
import SelectCase from '../Charts/SelectCase';
import SelectPeriod from '../Charts/SelectPeriod';
import SortCountries from '../modules/SortCountries';
import TableCasesData from '../modules/TableCasesData';

import _ from 'lodash';
import '../../App.css'


// position: "-webkit-sticky", top: "4.5rem"


interface ICountry {
  code: string,
  name: string
}

export default function HomeComponent() {
  const [data, setData] = useState<any>("");
  const [date, setDate] = useState<any>("");
  const [countries, setCountries] = useState<any>([]);
  const [dates, setDates] = React.useState<string>(`${moment().subtract(1, 'months').format()}`)
  const [cases, setCases] = React.useState<string>("confirmed")
  const [X, setX] = useState<any>([]);
  const [Y, setY] = useState<any>([]);
  let countrySelect: ICountry = { code: "fr", name: 'france' };
  const unstated = StoreContainer.useContainer();

  function setGraph(data: any) {
    setDate("World " + moment(data.Date).format('YYYY/MM/DD'));// set date for graph Label Title
    const infos = unstated.globalDataGraph(data.Global);// cleaning data =  returning a double table 
    setX(infos?.resultDates)
    setY(infos?.resultCases)
  }

  function getCovidData() {
    try {
      fetch(`https://api.covid19api.com/summary`, {
        method: "GET",
      }).then((response: any) => response.json()).then((res) => {
        // setData(res);
        setGraph(res)
        return (res)
      }).catch(err => alert(err));
    } catch (err) {
      console.log(err)
      return;
    }
  };

  async function getAll() {
    await unstated.getTotal();
  }


  function handleClick(event: any) {
    unstated.setCountry(event.currentTarget.dataset.name.toLowerCase());
    unstated.setCode(event.currentTarget.dataset.code.toLowerCase());
  }

  React.useEffect(() => {
    setCountries(unstated.country_list);
    if (unstated.code) {
      unstated.getCovidCountry(unstated.code, cases, dates);
    } else if (countries.filter((countries: any) => countries.name.toLowerCase().includes(unstated.country)).length === 1) {
      // eslint-disable-next-line
      countrySelect = countries.filter((countries: any) => countries.name.toLowerCase().includes(unstated.country))[0];
      unstated.setCode(countrySelect.code.toLowerCase());
      unstated.getCovidCountry(countrySelect.code.toLowerCase(), "confirmed", `${moment().subtract(1, 'months').format()}`);
    } else {
      unstated.getCovidCountry("", "", `${moment().subtract(30, 'days').format()}`);
    }
    // eslint-disable-next-line
  }, [unstated.country, cases, dates])

  React.useEffect(() => {
    setData(getCovidData());
    getAll();
    // eslint-disable-next-line
  }, [])
  React.useEffect(() => {
    if (!_.isEmpty(unstated.total)) {
      let tmp: any = unstated.total;
      if (!_.isEmpty(tmp.Countries))
        setData(tmp.Countries.sort(SortCountries('TotalConfirmed', 'desc')));
    }
    // eslint-disable-next-line
  }, [unstated.total])

  return (
    <>

      <header>
      </header>
      <aside className="sidebar">
        <div className="field" style={{ position: "sticky", top: "0rem", zIndex: 100, backgroundColor: '#333' }}>
          <div className="control has-icons-left" style={{ position: 'sticky' }} >
            <span style={{ display: 'flex', flexDirection: 'column' }}>
              {/* <input type="text" className="input  is-fullwidth mt-1" value={unstated.country} onChange={e => unstated.setCountry((e.target.value).toLowerCase())} placeholder='Search a country' />
              {unstated.country ? <span className="icon is-small is-left" onClick={() => { unstated.setCountry(""); unstated.setCode(""); }}>
                <i className="delete"></i>
              </span> : <></>} */}
              <SelectCase setCases={setCases} className="is-fullwidth" />
              <SelectPeriod setDates={setDates} className="is-fullwidth" />
            </span>
          </div>
        </div>

        <h3 className="mt-1">Countries </h3>
        {!_.isEmpty(unstated.code) && !_.isEmpty(unstated.country) ?
          <TableCasesData />
          : ""}

        {data ? data.filter((countries: any) => countries.Country.toLowerCase().includes(unstated.country)).map((item: any, i: any) => <span data-name={item.Country} data-code={item.CountryCode}
          className="button is-secondary" key={i} onClick={handleClick}
          style={{
            margin: "1px", display: 'flex', justifyContent: "space-between",
            backgroundColor: "#333", color: "whitesmoke", fontSize: "0.8em",
          }} >
          {item.Country}
          <span>{item.TotalConfirmed}{Flag(item.CountryCode)}</span>
        </span>) : ""}
      </aside>

      <section className="main">
        <Dashboard data={unstated.total ? unstated.total : (data ? data : {})} />
        <div className="sticky-top">
          <div className="nav flex-column">
            {unstated.code ?
              <span>
                <LinearChart dataCountry={unstated.data} labelsCountry={unstated.labels} country={`${unstated.code.toUpperCase()}`} />
              </span>
              : <></>}
            {data ?
              <BarChart dataCountry={Y} labelsCountry={X} country={date} />
              : <></>}
          </div>
        </div>
      </section>
    </>
  )
}
