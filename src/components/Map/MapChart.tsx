import React from "react";
import { StoreContainer } from '../Store';
import _ from 'lodash';

import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup
} from "react-simple-maps";

interface IMarkers {
  markerOffset: number,
  name: string,
  lon: number,
  lat: number
}
const geoUrl: string =
  "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";

const MapChart = (props: any) => {
  const unstated = StoreContainer.useContainer();
  const [data, setData] = React.useState<any>(unstated.total);
  const myMarkers: IMarkers[] = []

  function mapDataCountries(data: any) {
    if (data.Countries) {
      data.Countries.map((item: any) => myMarkers.push({ name: item.Country, markerOffset: 0, lon: 0, lat: 0 }))
    }
    // console.log(myMarkers)
    return myMarkers;
  }
  React.useEffect(() => {
    setData(unstated.getCovidMapMarkers());
    if (data)
      mapDataCountries(data);
    // eslint-disable-next-line
  }, [data, unstated.code])
  return (
    <ComposableMap
      projectionConfig={{
        rotate: [-10, 0, 0],
        scale: 200
      }}
    // style={{ marginTop: '-5em' }}
    >
      <ZoomableGroup zoom={1}>
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map(geo => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#DDD"
                stroke="#FFF"
                onMouseEnter={() => {
                  let { NAME, POP_EST, ISO_A2 } = geo.properties;
                  let country: object | any = _.find((unstated.markers), { CountryCode: ISO_A2 });
                  if (country) {
                    // cases = country.TotalConfirmed;
                    props.setTooltipContent({
                      Country: NAME,
                      Population: POP_EST,
                      NewConfirmed: country.NewConfirmed,
                      TotalConfirmed: country.TotalConfirmed,
                      NewDeaths: country.NewDeaths,
                      TotalDeaths: country.TotalDeaths,
                      NewRecovered: country.NewRecovered,
                      TotalRecovered: country.TotalRecovered,
                      data: country
                    });
                  } else {
                    props.setTooltipContent({ Country: NAME });
                  }
                }}
                onMouseLeave={() => {
                  props.setTooltipContent("");
                }}
                onClick={() => {
                  let { NAME, ISO_A2 } = geo.properties;
                  unstated.setCode(ISO_A2.toLowerCase());
                  unstated.setCountry(NAME.toLowerCase());
                  // console.log("mapCharts : code ", unstated.code);
                }}

                style={{
                  default: {
                    fill: "#D6D6DA",
                    outline: "none"
                  },
                  hover: {
                    fill: "#F53",
                    outline: "none"
                  },
                  pressed: {
                    fill: "#E42",
                    outline: "none"
                  }
                }}
              />
            ))
          }
        </Geographies>
        {unstated.markers ?
          (_.filter(unstated.markers, (o: any) => o.CountryCode === unstated.code || o.TotalConfirmed > 7000))
            .map((item: any) => (
              <Marker key={item.name} coordinates={[item.lon, item.lat]}>
                {item.CountryCode.toLowerCase() === unstated.code.toLowerCase() ?
                  <g
                    fill="none"
                    stroke="#ff0000"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    transform="translate(-12, -35)"
                  >
                    <circle cx="12" cy="10" r="3" />
                    <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 11.7z" />
                  </g> :
                  <>
                    {
                      item.TotalConfirmed > 70000 ?
                        <g
                          fill="none"
                          stroke="#ffc107"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          transform="translate(-12, -6)"
                        >
                          <circle cx="12" cy="8" r="1" />
                        </g>
                        : ""}
                  </>
                }

                {item.CountryCode.toLowerCase() === unstated.code.toLowerCase() ?
                  <text
                    textAnchor="middle"
                    style={{ fill: "red", fontWeight: "bold", textShadow: "1px 1px 1px black", fontSize: "15px" }}
                  >
                    {item.CountryCode} : {item.TotalConfirmed} cases
                </text>
                  : <text
                    textAnchor="middle"
                    style={{ fill: "orange", textShadow: "1px 1px 1px black", fontWeight: "bold", fontSize: "10px" }}
                  >
                    {
                      item.TotalConfirmed > 80000 ? `${item.CountryCode} ${item.TotalConfirmed}` : ""}
                  </text>
                }
              </Marker >
            )) : ""
        }
      </ZoomableGroup>
    </ComposableMap >
  );
};

export default MapChart;
