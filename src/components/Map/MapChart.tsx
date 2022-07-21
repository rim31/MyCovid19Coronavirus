import React from "react";
import { StoreContainer } from '../Store';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import Map from "./map.json"
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";

interface IMarkers {
  markerOffset: number,
  name: string,
  lon: number,
  lat: number
}
const geoUrl: any = Map;
  // "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json"; // old url crash : https://github.com/zcreativelabs/react-simple-maps/issues/289
  // "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/v2/topojson-maps/world-110m.json"; /////// OK but if the owner change the url again , don't know what will happen

const MapChart = (props: any) => {
  const unstated = StoreContainer.useContainer();
  const [data, setData] = React.useState<any>(unstated.total);
  const [maxMarkers, setMaxMarkers] = React.useState<number>(700000);
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

  React.useEffect(() => {
    console.log(unstated.markers)
    if (unstated.markers !== undefined)
      setMaxMarkers(unstated.markers[9] ? unstated.markers[9].TotalConfirmed : 700000);
    // eslint-disable-next-line
  }, [unstated.markers])

  return (
    <ComposableMap
      projectionConfig={{
        rotate: [-10, 0, 0],
        scale: 200
      }}
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
                  unstated.setCode(ISO_A2.toUpperCase());
                  unstated.setCountry(NAME.toUpperCase());

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
          (_.filter(unstated.markers, (o: any) => o.CountryCode === unstated.code || o.TotalConfirmed > maxMarkers))
            .map((item: any) => (
              <Marker key={item.name} coordinates={[item.lon, item.lat]}>
                {item.CountryCode.toUpperCase() === unstated.code.toUpperCase() ?
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
                      item.TotalConfirmed > maxMarkers ?
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

                {item.CountryCode.toUpperCase() === unstated.code.toUpperCase() ?
                  <>
                    <text
                      textAnchor="middle"
                      style={{ fill: "red", fontWeight: "bold", textShadow: "1px 1px 1px black", fontSize: "15px", cursor: "default", zIndex: -10 }}
                    >
                      {/*  eslint-disable-next-line */}
                      <Link to="/covid19/stats">📈 Details - {item.CountryCode} : {item.TotalConfirmed}cases
                        </Link>
                    </text>
                  </>
                  :
                  <>
                    <text
                      textAnchor="middle"
                      style={{ fill: "orange", textShadow: "1px 1px 1px black", fontWeight: "bold", fontSize: "10px", cursor: "default", zIndex: -10 }}
                      onMouseEnter={() => {
                        let country: object | any = _.find((unstated.markers), { CountryCode: item.CountryCode });
                        if (country) {
                          // cases = country.TotalConfirmed;
                          props.setTooltipContent({
                            Country: item.Country,
                            Population: '',
                            NewConfirmed: country.NewConfirmed,
                            TotalConfirmed: country.TotalConfirmed,
                            NewDeaths: country.NewDeaths,
                            TotalDeaths: country.TotalDeaths,
                            NewRecovered: country.NewRecovered,
                            TotalRecovered: country.TotalRecovered,
                            data: country
                          });
                        } else {
                          props.setTooltipContent({ Country: item.Country });
                        }
                      }}
                      onMouseLeave={() => {
                        props.setTooltipContent("");
                      }}
                      onClick={() => {
                        unstated.setCode(item.CountryCode.toUpperCase());
                        unstated.setCountry(item.Country.toUpperCase());
                      }}
                    >
                      {item.TotalConfirmed > maxMarkers ? `${item.CountryCode} ${item.TotalConfirmed}` : ""}
                    </text>
                  </>
                }
              </Marker >
            )) : ""
        }
      </ZoomableGroup>
    </ComposableMap >
  );
};

export default MapChart;


// Country: "United States of America"
// CountryCode: "US"
// Date: "2020-12-12T01:31:13Z"
// NewConfirmed: 224452
// NewDeaths: 2768
// NewRecovered: 95151
// Premium: {}
// Slug: "united-states"
// TotalConfirmed: 15611014
// TotalDeaths: 292141
// TotalRecovered: 5985047
// capital: "Washington D.C."
// code: "US"
// lat: 38
// lon: -97
// name: "United States"
// timezones: (29) ["America/New_York", "America/Detroit", "America/Kentucky/Louisville", "America/Kentucky/Monticello", "America/Indiana/Indianapolis", "America/Indiana/Vincennes", "America/Indiana/Winamac", "America/Indiana/Marengo", "America/Indiana/Petersburg", "America/Indiana/Vevay", "America/Chicago", "America/Indiana/Tell_City", "America/Indiana/Knox", "America/Menominee", "America/North_Dakota/Center", "America/North_Dakota/New_Salem", "America/North_Dakota/Beulah", "America/Denver", "America/Boise", "America/Phoenix", "America/Los_Angeles", "America/Anchorage", "America/Juneau", "America/Sitka", "America/Metlakatla", "America/Yakutat", "America/Nome", "America/Adak", "Pacific/Honolulu"]
// __proto__: Object