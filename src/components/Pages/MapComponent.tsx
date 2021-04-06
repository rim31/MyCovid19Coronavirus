import React, { useState } from 'react'
// import { useParams, useHistory } from 'react-router-dom';
import BarChart from '../Charts/BarChart';
import moment from 'moment';
import { StoreContainer } from '../Store';
import ListCountries from '../modules/ListCountries';
import Dashboard from '../Charts/Dashboard';
import MapChart from '../Map/MapChart';
import '../../App.css'

export default function HomeComponent() {
  // eslint-disable-next-line
  const [data, setData] = useState<any>("");
  const [date, setDate] = useState<any>("");
  const [X, setX] = useState<any>([]);// for graph bar General world Covid
  const [Y, setY] = useState<any>([]);// for graph bar General world Covid
  const [content, setContent] = React.useState("");// for tooltip maps
  const unstated = StoreContainer.useContainer();

  function setGraph(data: any) {
    setDate("World " + moment().format('YYYY/MM/DD'));// set date for graph Label Title
    const infos = unstated.globalDataGraph(data.Global);// cleaning data =  returning a double table 
    setX(infos?.resultDates)
    setY(infos?.resultCases)
  }


  async function getAll() {
    await unstated.getTotal();
  }

  React.useEffect(() => {
    getAll();
    setGraph(unstated.total);
    // eslint-disable-next-line
  }, [])

  return (
    <>

      <header>
      </header>

      <aside className="sidebar">
        <h3 className="mt-1">Countries </h3>
        <ListCountries data={unstated.total ? unstated.total : (data ? data : {})} />
      </aside>

      <section className="main">
        {/* component with the info of world data infection */}
        <Dashboard data={unstated.total ? unstated.total : (data ? data : {})}
          content={content ? content : ''}
        />
        {/* component with the map */}
        <MapChart setTooltipContent={setContent} />
        <div className="sticky-top">
          <div className="nav flex-column">
            {data ?
              <BarChart dataCountry={Y} labelsCountry={X} country={date} />
              : <></>}
          </div>
        </div>
      </section>
    </>
  )
}
