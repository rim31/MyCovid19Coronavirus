import React, { useState } from 'react'
// import { useParams, useHistory } from 'react-router-dom';
import BarChart from '../Charts/BarChart';
import moment from 'moment';
import { StoreContainer } from '../Store';
import ListCountries from '../modules/ListCountries';
import Dashboard from '../Charts/Dashboard';
import '../../App.css'

export default function HomeComponent() {
  // const [countries, setCountries] = useState<any>([]);
  // const [cases, setCases] = useState<any>([]);
  // const [global, setGlobal] = useState<any>([]);
  const [data, setData] = useState<any>("");
  const [date, setDate] = useState<any>("");
  const [X, setX] = useState<any>([]);
  const [Y, setY] = useState<any>([]);
  const unstated = StoreContainer.useContainer();

  // const country_list = global.Countries.map((item: any, i: any) =>
  //   <span style={{ fontSize: '6px', paddingLeft: '3px' }} key={i} >{item.Country}</span>)

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
        // console.log(res, unstated.total)
        // if (unstated.total !== [])
        //   res = unstated.total
        setData(res);
        setGraph(res)
        // setDate("World " + moment(res.Date).format('YYYY/MM/DD'));// set date for graph Label Title
        // const infos = unstated.globalDataGraph(res.Global);// cleaning data =  returning a double table 
        // setX(infos?.resultDates)
        // setY(infos?.resultCases)
        // console.log(res)
        return (res)

        // const results = unstated.countriesListData(res.Countries);
        // console.log(results)
        // setCountries(results);
        // setCases(res.Countries)
        // setGlobal(res)
      }).catch(err => alert(err));
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

    // problem with fetching data :TODO  Remove this(after found out) 
    getAll();

    // eslint-disable-next-line
  }, [])

  return (
    <>

      <header>
      </header>

      <aside className="sidebar">
        <h3>Countries </h3>
        <ListCountries data={unstated.total ? unstated.total : (data ? data : {})} />
      </aside>

      <section className="main">
        <Dashboard data={unstated.total ? unstated.total : (data ? data : {})} />
        <div className="sticky-top">
          <div className="nav flex-column">
            {data ?
              <BarChart dataCountry={Y} labelsCountry={X} country={date} />
              : <></>}
          </div>
        </div>
      </section>



      {/* <div className="row py-3">
        <div className="order-1 col-lg-3 col-md-3 col-sm-12 col-xs-12" id="main"
          style={{
            display: "inline-block",
            verticalAlign: "top",
            height: "70%",
            overflow: "auto",
          }}
        >
          <ListCountries data={unstated.total ? unstated.total : (data ? data : {})} />
        </div>
        <div className=" col-lg-9 col-md-9 col-sm-12 col-xs-12" id="sticky-sidebar">
          <Dashboard data={unstated.total ? unstated.total : (data ? data : {})} />
          <div className="sticky-top">
            <div className="nav flex-column">
              {data ?
                <BarChart dataCountry={Y} labelsCountry={X} country={date} />
                : <></>}
            </div>
          </div>
        </div>
      </div> */}



      {/* <h1> HOME </h1>
      <div className="row">
        <div className="col-sm-3">
          <ListCountries data={data} />
        </div>
        <div className="col-sm-9">
          {data ?
            <BarChart dataCountry={Y} labelsCountry={X} country={date} />
            : <></>}
        </div>
      </div>
      {data ?
        data.Countries.map((item: any, i: any) =>
          <span style={{ fontSize: '6px', paddingLeft: '3px' }} key={i} >{item.Country} {item.TotalConfirmed}</span>)
        : "--"} */}
    </>
  )
}
