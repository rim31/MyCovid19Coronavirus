import React from 'react';
import { StoreContainer } from '../Store';
import _ from 'lodash';

interface ICountry {
  country: string,
  last_update: Date,
  cases: number,
  deaths: number,
  recovered: number
}

interface ITable {
  Country: string,
  CountryCode: string,
  Date: Date,
  NewConfirmed: number,
  NewDeaths: number,
  NewRecovered: number,
  TotalConfirmed: number,
  TotalDeaths: number,
  TotalRecovered: number,
}


// table Component of infected Data : for the left side bar
export default function TableCasesData(props: any) {
  const unstated = StoreContainer.useContainer();
  // const [table, setTable] = React.useState<ITable | object>({})
  let data: any = {};
  let countries: any[] = [];

  if (_.isEmpty(unstated.total) === false) {
    data = unstated.total;
    countries = data.Countries;
  }
  const [result, setResult] = React.useState<ITable | any>({})
  React.useEffect(() => {
    if (unstated.code) {
      let temp = (_.filter(countries, function (i: any) {
        return i.CountryCode === unstated.code.toUpperCase();
      }));
      if (temp.length > 0)
        setResult(temp[0])
    }
    // eslint-disable-next-line
  }, [unstated.code])
  return (
    // table for the left side bat
    <table className="table table-sm table-dark table-striped" style={{ fontSize: "9px", fontWeight: 'bold' }} >
      <thead>
        <tr>
          <th style={{ color: "white" }}>Cases</th>
          <th style={{ color: "white" }}>New Cases</th>
          <th style={{ color: "white" }}>Total</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Confirmed</td>
          <td>{result?.NewConfirmed}</td>
          <td>{result?.TotalConfirmed}</td>
        </tr>
        <tr>
          <td>Deaths</td>
          <td>{result?.NewDeaths}</td>
          <td>{result?.TotalDeaths}</td>
        </tr>
        <tr>
          <td>Recovered</td>
          <td>{result?.NewRecovered}</td>
          <td>{result?.TotalRecovered}</td>
        </tr>
      </tbody>
    </table>
  );
}

