import React from 'react';
import _ from 'lodash';
import PeopleOutlineIcon from '@material-ui/icons/PeopleOutline';

interface IGlobal {
  NewConfirmed: number,
  TotalConfirmed: number,
  NewDeaths: number,
  TotalDeaths: number,
  NewRecovered: number,
  TotalRecovered: number,
}


// ISO 3166-1 alpha-2
// ⚠️ No support for IE 11
function countryToFlag(isoCode: any) {
  return typeof String.fromCodePoint !== 'undefined'
    ? isoCode
      .toUpperCase()
      .replace(/./g, (char: any) => String.fromCodePoint(char.charCodeAt(0) + 127397))
    : isoCode;
}

export default function Dashboard(props: any) {
  const Global: IGlobal = props.data.Global;

  let confirmedAverage: number | any = 0;
  let deathsAverage: number | any = 0;
  let recoveredAverage: number | any = 0;

  React.useEffect(() => {
    if (_.isEmpty(props.content) === false) {
      // eslint-disable-next-line
      confirmedAverage = (100 * props.content.TotalConfirmed / props.content.Population).toFixed(2);
      // eslint-disable-next-line
      deathsAverage = (100 * props.content.TotalDeaths / props.content.Population).toFixed(2);
      // eslint-disable-next-line
      recoveredAverage = (100 * props.content.TotalRecovered / props.content.Population).toFixed(2);
    }
  }, [props.content])

  return (
    <div>
      <div className="row mb-4 mt-1">
        <div className="col-xl-4 col-lg-4">
          <div className="card card-inverse card-success">
            <div className="card-block rounded bg-warning">
              <h6 className="mt-2 ml-2">Total confirmed</h6>
              <h1 className="ml-2">{Global ? Global.TotalConfirmed : "..."}</h1>
            </div>
          </div>
        </div>
        <div className="col-xl-4 col-lg-4">
          <div className="card card-inverse card-danger">
            <div className="card-block rounded bg-danger">
              <h6 className="mt-2 ml-2">Total deaths</h6>
              <h1 className="ml-2">{Global ? Global.TotalDeaths : "..."}</h1>
            </div>
          </div>
        </div>
        <div className="col-xl-4 col-lg-4">
          <div className="card card-inverse card-info">
            <div className="card-block rounded bg-success">
              <h6 className="mt-2 ml-2">Total recover</h6>
              <h1 className="ml-2">{Global ? Global.TotalRecovered : "..."}</h1>
            </div>
          </div>
        </div>
        {props.content ?
          <div className="col-xl-12 col-lg-12" style={{ position: "absolute", zIndex: 100 }}>
            <div className="card card-inverse mb-0">
              <div className="card-block rounded mb-0">
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
                  <span>
                    <h6 className="mt-2 ml-2">Country : {props.content.Population} pers <PeopleOutlineIcon /> </h6>
                    <h1 className="ml-2">
                      {_.isEmpty(props.content.data) === false ? <span>{countryToFlag(props.content.data.code)}</span> : ""}
                      {props.content.Country}
                    </h1>
                  </span>
                  <div>
                    <table className="table table-sm table-dark table-striped" style={{ fontSize: "0.6rem", fontWeight: "bold", marginBottom: "0px" }} >
                      <thead>
                        <tr>
                          <th style={{ color: "white" }}>Cases</th>
                          <th style={{ color: "white" }}>Today</th>
                          <th style={{ color: "white" }}>Total</th>
                          <th style={{ color: "white" }}>% pop T</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr style={{ color: "#ffc107", padding: '0!important', }}>
                          <td>Confirmed</td>
                          <td>{props.content?.NewConfirmed}</td>
                          <td>{props.content?.TotalConfirmed}</td>
                          <td>{confirmedAverage} %</td>
                        </tr>
                        <tr style={{ color: "#dc3545", padding: '0!important', }}>
                          <td>Deaths</td>
                          <td>{props.content?.NewDeaths}</td>
                          <td>{props.content?.TotalDeaths}</td>
                          <td>{deathsAverage} %</td>
                        </tr>
                        <tr style={{ color: "#28a745", padding: '0!important', }}>
                          <td>Recovered</td>
                          <td>{props.content?.NewRecovered}</td>
                          <td>{props.content?.TotalRecovered}</td>
                          <td>{recoveredAverage} %</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
          : ""}
      </div>


    </div >
  )
}
