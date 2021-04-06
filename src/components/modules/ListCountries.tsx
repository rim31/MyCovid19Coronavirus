import React from 'react';
import TableCasesData from './TableCasesData';
import _ from 'lodash';
import { StoreContainer } from '../Store';
import Flag from '../modules/Flag';

export default function ListCountries(props: any) {
  const [data, setData] = React.useState<any>(props.countries)
  const [country, setCountry] = React.useState<String>("")
  const [code, setCode] = React.useState<String>("")
  const unstated = StoreContainer.useContainer();


  function handleClick(event: any) {
    const value = event.currentTarget.dataset.name.toUpperCase();
    // console.log(value)
    setCountry(value);
    setCode(event.currentTarget.dataset.code.toUpperCase());
    unstated.setCountry(value);
    unstated.setCode(event.currentTarget.dataset.code.toUpperCase());
  }

  // to sort array according attribute of object inside
  // (data).sort(compareValues('TotalConfirmed', 'desc'))
  function compareValues(key: string, order = 'asc') {
    return function innerSort(a: any, b: any) {
      if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
        // property doesn't exist on either object
        return 0;
      }
      const varA = (typeof a[key] === 'string')
        ? a[key].toUpperCase() : a[key];
      const varB = (typeof b[key] === 'string')
        ? b[key].toUpperCase() : b[key];
      let comparison = 0;
      if (varA > varB) {
        comparison = 1;
      } else if (varA < varB) {
        comparison = -1;
      }
      return (
        (order === 'desc') ? (comparison * -1) : comparison
      );
    };
  }

  React.useEffect(() => {
    if (!_.isEmpty(props.data.Countries))
      setData(props.data.Countries.sort(compareValues('TotalConfirmed', 'desc')));

  }, [props.data, data, unstated.code, unstated.country])

  return (
    <div
      style={{
        display: "flex", flexDirection: "column", flexWrap: "wrap", overflow: "hidden",
        whiteSpace: "nowrap", /* Don't forget this one */
        textOverflow: "ellipsis",
        justifyContent: "space-between",
        maxWidth: '50vh'
      }}>
      <h1 style={{ color: 'whitesmoke' }}>
        {!_.isEmpty(unstated.code) && !_.isEmpty(unstated.country) ?
          <TableCasesData />
          : ""}
        <span>{Flag(unstated.code ? unstated.code : code)}</span>
        {!_.isEmpty(unstated.country) ? unstated.country : country}
      </h1>
      {!_.isEmpty(props.data.Countries) ?
        props.data.Countries.map((item: any, i: any) =>
          <span className="button is-secondary is-fullwidth"
            style={{
              display: "flex", fontSize: '12px', paddingLeft: '3px', justifyContent: "space-between",
              whiteSpace: "nowrap", textOverflow: "ellipsis", backgroundColor: '#282c34', color: "whitesmoke"
            }} key={i} onClick={handleClick} data-name={item.Country} data-code={item.CountryCode}>
            <span>{item.Country}</span><span> {item.TotalConfirmed}</span>
          </span>)
        : ""}
    </div>
  )
}
