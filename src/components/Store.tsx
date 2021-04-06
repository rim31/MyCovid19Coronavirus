// eslint-disable-next-line
import * as React from 'react';
import { createContainer } from "unstated-next";
import moment from 'moment';
import _ from 'lodash';
import { country_list } from './Map/countries';
// source : "https://api.covid19api.com/"
// source : "https://covidtracking.com/api/us/daily"

interface ICountryData {
  Cases: Number,
  City: String,
  CityName: String,
  Country: String,
  CountryName: String,
  Date: Date,
  Lat: String,
  Lon: String,
  Province: String,
  Status: String,
}

interface IGlobalData {
  NewConfirmed: Number,
  NewDeaths: Number,
  NewRecovered: Number,
  TotalConfirmed: Number,
  TotalDeaths: Number,
  TotalRecovered: Number
}

interface ICountry {
  Country: string,
  CountryName: string,
  Slug: string,
  NewConfirmed: number,
  TotalConfirmed: number,
  NewDeaths: number,
  TotalDeaths: number,
  NewRecovered: number,
  TotalRecovered: number,
  Date: Date
}

interface IDataCovid {
  country: string,
  cases: number,
  deaths: number,
  recovered: number,
  last_update: Date
}

interface ICountries {
  timezones: string[],
  latlon?: string[],
  lat?: number,
  lon?: number,
  name: string,
  code: string,
  capital: string
}

export const useStore = () => {
  const [country, setCountry] = React.useState<string>("");
  const [code, setCode] = React.useState<string>("");
  const [covidApi, setCovidApi] = React.useState<Object[] | null | void | undefined>([]);
  const [countriesML, setCountriesML] = React.useState<Object[] | any>([]);
  const [data, setData] = React.useState<Object[] | void | null | undefined>([]);// data for graph
  const [dataDiff, setDataDiff] = React.useState<number[] | any[] | undefined>([]);// data diff for graph
  const [total, setTotal] = React.useState<IGlobalData[] | void | null | undefined>([]);
  const [labels, setLabels] = React.useState<Object[] | void | null | undefined>([]);
  const [markers, setMarkers] = React.useState<any[] | undefined>([]);
  const headers = new Headers({
    "Accept": "application/json",
    "Content-Type": "application/json",
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:78.0) Gecko/20100101 Firefox/78.0"
  });

  const debug: boolean = true;



  function globalDataGraph(data: any) {
    let resultCases: any[] = []
    let resultDates: any[] = []
    for (let i in data) {
      resultDates.push(i);
      resultCases.push(data[i]);
    }
    // console.log(resultCases, resultDates);
    return ({ resultCases, resultDates });
  }

  function countriesListData(data: ICountry[]) {
    let resultCases: any[] = []
    let resultCountries: any[] = []
    let result: any[] = []
    for (let i in data) {
      resultCountries.push(data[i].Country);
      resultCases.push(data[i].TotalConfirmed);
      result.push({
        country: data[i].Country, TotalConfirmed: data[i].TotalConfirmed,
        sortable: true,
      })
    }
    // console.log(resultCases, resultCountries);
    return ({ result, resultCases, resultCountries });
  }

  function countryDataGraph(data: IDataCovid[] | ICountry[], country: string, caseType: string, dateTo: string) {
    let resultCases: any[] = []
    let resultDates: any[] = []
    if (data.length > 0) {
      data.forEach((item: any) => {
        // console.log("item : ", caseType, item[caseType], item);
        if (country === 'FR') {
          console.log(`country`, country)
          if (!item.Province) {
            resultCases.push(item.Cases);
            resultDates.push(moment(item.Date).format('YYYY/MM/DD'));
          }
          // } else if (country === 'us' || debug === true) {
        } else if (country === 'US' && debug === true) {
          if ((moment(item.last_update).isAfter(dateTo))) {
            resultCases.push(caseType === "confirmed" ? item.cases : item[caseType]);
            resultDates.push(moment(item.last_update).format('YYYY/MM/DD'));
          }
        } else {
          if ((moment(item.Date).isAfter(dateTo))) {
            resultCases.push(item.Cases);
            resultDates.push(moment(item.Date).format('YYYY/MM/DD'));
          }
        }
      })
      let resultCasesDiff: any[] = _.map(resultCases, function (e: any, i: any) {
        return (resultCases[i + 1] - e) < 0 ? 0 : (resultCases[i + 1] - e)
      });
      console.log(`resultCases`, resultCases)
      resultCasesDiff.pop();
      resultCases.pop();
      resultDates.pop();
      dataDiff === [] ? console.log(dataDiff) : console.log('');
      setData(resultCasesDiff);// inversion between resultCasesDiff and resultCases for display graph of variations and not total
      setDataDiff(resultCases);
      setLabels(resultDates);
      return ({ resultCases, resultDates, resultCasesDiff });
    } else {
      setData([]);
      setLabels([]);
      setDataDiff([]);

    }
  }

  // function getCovidApi() :  get data by country
  // differents source cause pb with USA, 
  // you cans get data according Country Code, date from  and case : confirmed, deaths, recovered
  // have to use function countryDataGraph() to clean data and have an array to fit with D3js charts react-map-smples
  function getCovidApi(country: string, caseType: string, dateTo: string) {
    if (country === "") {
      countryDataGraph([], "", "", "");
    } else {
      try {
        if (debug === false) {
          return fetch(`https://covid19-api.org/api/timeline/${country}`, {
            method: 'GET',
            redirect: 'follow',
            headers: headers
          })
            .then((response: any) => response.json()).then((res) => {
              countryDataGraph(res.reverse(), country, caseType, dateTo);// cleaning data for ChartJS
            }).catch(err => alert(err));
        } else {
          return fetch(`https://api.covid19api.com/country/${country}/status/${caseType}/live?from=${dateTo}&to=${moment().format('YYYY-MM-DDT00:00:00')}`, {
            method: 'GET',
            redirect: 'follow',
            headers: headers
          })
            .then((response: any) => response.json()).then((res) => {
              console.log(`res Fetch`, res)
              countryDataGraph(res, country, caseType, dateTo);// cleaning data for ChartJS
            }).catch(err => alert(err));
        }
      } catch (err) {
        console.log(err)
        return;
      }
    }
  };


  // to set unstated.total data : {Global, Countries,..} all total data of today
  const getTotal = async () => {
    await fetch(`https://api.covid19api.com/summary`)
      .then(res => res.json())
      .then(resp => setTotal(resp))
      .catch((err) => { throw (err) })
  }

  const getCovidCountry = async (country: string, caseType: string, dateTo: string) => {
    setCovidApi(await getCovidApi(country, caseType, dateTo));
    // console.log(`https://covid19-api.org/api/timeline/${country}`)
    // console.log(`https://api.covid19api.com/country/${country}/status/${caseType}/live?from=${dateTo}&to=${moment().format('YYYY-MM-DDT00:00:00')}`)
  }


  const updateTotalCovid = async () => {
    setTotal(await getTotal());
  }

  // =================================================

  // function matching data for the map : react map simples
  // source (`https://api.covid19api.com/all`, {
  function getMarkers(arr1: any, arr2: any) {
    return _.union(
      _.map(arr1, function (obj1) {
        var same = _.find(arr2, function (obj2) {
          return obj1["CountryCode"] === obj2["code"];
        });
        return same ? _.extend(obj1, same) : obj1;
      }),
      _.reject(arr2, function (obj2) {
        return _.find(arr1, function (obj1) {
          return obj2["code"] === obj1["CountryCode"];
        });
      })
    );
  }

  //order 
  function dynamicSort(property: any) {
    var sortOrder = 1;
    if (property[0] === "-") {
      sortOrder = -1;
      property = property.substr(1);
    }
    return function (b: any, a: any) {
      /* next line works with strings and numbers, 
       * and you may want to customize it to your needs
       */
      var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
      return result * sortOrder;
    }
  }
  function getCovidMapMarkers() {
    fetch(`https://api.covid19api.com/summary`, {
      method: "GET",
    }).then((response: any) => response.json()).then((res) => {
      // console.log("***********************", res.Countries);
      let resp = getMarkers(res.Countries, country_list);
      setMarkers(resp.sort(dynamicSort("TotalConfirmed")));
      // console.log(resp);
      return (resp);
    }).catch(err => alert(err));
  }

  function getCountriesML() {
    try {
      return fetch(`"https://covid19-api.org/api/status"`, {
        method: "GET",
      }).then((response: any) => response.text())
    } catch (err) {
      console.log(err)
      return;
    }
  };

  const updateCountriesML = async () => {
    setCountriesML(await getCountriesML());
  }

  return {
    covidApi,
    country_list,
    data,
    labels,
    total,
    country,
    code,
    markers,
    countriesML,
    setCountry,
    setCode,
    getTotal,
    getCovidCountry,
    updateTotalCovid,
    countryDataGraph,
    globalDataGraph,
    countriesListData,
    getCovidMapMarkers,
    updateCountriesML,
  };
}
export const StoreContainer = createContainer(useStore)

// let country_list = { 'AF' : 'Afghanistan', 'AX' : 'Aland Islands', 'AL' : 'Albania', 'DZ' : 'Algeria', 'AS' : 'American Samoa', 'AD' : 'Andorra', 'AO' : 'Angola', 'AI' : 'Anguilla', 'AQ' : 'Antarctica', 'AG' : 'Antigua And Barbuda', 'AR' : 'Argentina', 'AM' : 'Armenia', 'AW' : 'Aruba', 'AU' : 'Australia', 'AT' : 'Austria', 'AZ' : 'Azerbaijan', 'BS' : 'Bahamas', 'BH' : 'Bahrain', 'BD' : 'Bangladesh', 'BB' : 'Barbados', 'BY' : 'Belarus', 'BE' : 'Belgium', 'BZ' : 'Belize', 'BJ' : 'Benin', 'BM' : 'Bermuda', 'BT' : 'Bhutan', 'BO' : 'Bolivia', 'BA' : 'Bosnia And Herzegovina', 'BW' : 'Botswana', 'BV' : 'Bouvet Island', 'BR' : 'Brazil', 'IO' : 'British Indian Ocean Territory', 'BN' : 'Brunei Darussalam', 'BG' : 'Bulgaria', 'BF' : 'Burkina Faso', 'BI' : 'Burundi', 'KH' : 'Cambodia', 'CM' : 'Cameroon', 'CA' : 'Canada', 'CV' : 'Cape Verde', 'KY' : 'Cayman Islands', 'CF' : 'Central African Republic', 'TD' : 'Chad', 'CL' : 'Chile', 'CN' : 'China', 'CX' : 'Christmas Island', 'CC' : 'Cocos (Keeling) Islands', 'CO' : 'Colombia', 'KM' : 'Comoros', 'CG' : 'Congo', 'CD' : 'Congo, Democratic Republic', 'CK' : 'Cook Islands', 'CR' : 'Costa Rica', 'CI' : 'Cote D\'Ivoire', 'HR' : 'Croatia', 'CU' : 'Cuba', 'CY' : 'Cyprus', 'CZ' : 'Czech Republic', 'DK' : 'Denmark', 'DJ' : 'Djibouti', 'DM' : 'Dominica', 'DO' : 'Dominican Republic', 'EC' : 'Ecuador', 'EG' : 'Egypt', 'SV' : 'El Salvador', 'GQ' : 'Equatorial Guinea', 'ER' : 'Eritrea', 'EE' : 'Estonia', 'ET' : 'Ethiopia', 'FK' : 'Falkland Islands (Malvinas)', 'FO' : 'Faroe Islands', 'FJ' : 'Fiji', 'FI' : 'Finland', 'FR' : 'France', 'GF' : 'French Guiana', 'PF' : 'French Polynesia', 'TF' : 'French Southern Territories', 'GA' : 'Gabon', 'GM' : 'Gambia', 'GE' : 'Georgia', 'DE' : 'Germany', 'GH' : 'Ghana', 'GI' : 'Gibraltar', 'GR' : 'Greece', 'GL' : 'Greenland', 'GD' : 'Grenada', 'GP' : 'Guadeloupe', 'GU' : 'Guam', 'GT' : 'Guatemala', 'GG' : 'Guernsey', 'GN' : 'Guinea', 'GW' : 'Guinea-Bissau', 'GY' : 'Guyana', 'HT' : 'Haiti', 'HM' : 'Heard Island & Mcdonald Islands', 'VA' : 'Holy See (Vatican City State)', 'HN' : 'Honduras', 'HK' : 'Hong Kong', 'HU' : 'Hungary', 'IS' : 'Iceland', 'IN' : 'India', 'ID' : 'Indonesia', 'IR' : 'Iran, Islamic Republic Of', 'IQ' : 'Iraq', 'IE' : 'Ireland', 'IM' : 'Isle Of Man', 'IL' : 'Israel', 'IT' : 'Italy', 'JM' : 'Jamaica', 'JP' : 'Japan', 'JE' : 'Jersey', 'JO' : 'Jordan', 'KZ' : 'Kazakhstan', 'KE' : 'Kenya', 'KI' : 'Kiribati', 'KR' : 'Korea', 'KW' : 'Kuwait', 'KG' : 'Kyrgyzstan', 'LA' : 'Lao People\'s Democratic Republic', 'LV' : 'Latvia', 'LB' : 'Lebanon', 'LS' : 'Lesotho', 'LR' : 'Liberia', 'LY' : 'Libyan Arab Jamahiriya', 'LI' : 'Liechtenstein', 'LT' : 'Lithuania', 'LU' : 'Luxembourg', 'MO' : 'Macao', 'MK' : 'Macedonia', 'MG' : 'Madagascar', 'MW' : 'Malawi', 'MY' : 'Malaysia', 'MV' : 'Maldives', 'ML' : 'Mali', 'MT' : 'Malta', 'MH' : 'Marshall Islands', 'MQ' : 'Martinique', 'MR' : 'Mauritania', 'MU' : 'Mauritius', 'YT' : 'Mayotte', 'MX' : 'Mexico', 'FM' : 'Micronesia, Federated States Of', 'MD' : 'Moldova', 'MC' : 'Monaco', 'MN' : 'Mongolia', 'ME' : 'Montenegro', 'MS' : 'Montserrat', 'MA' : 'Morocco', 'MZ' : 'Mozambique', 'MM' : 'Myanmar', 'NA' : 'Namibia', 'NR' : 'Nauru', 'NP' : 'Nepal', 'NL' : 'Netherlands', 'AN' : 'Netherlands Antilles', 'NC' : 'New Caledonia', 'NZ' : 'New Zealand', 'NI' : 'Nicaragua', 'NE' : 'Niger', 'NG' : 'Nigeria', 'NU' : 'Niue', 'NF' : 'Norfolk Island', 'MP' : 'Northern Mariana Islands', 'NO' : 'Norway', 'OM' : 'Oman', 'PK' : 'Pakistan', 'PW' : 'Palau', 'PS' : 'Palestinian Territory, Occupied', 'PA' : 'Panama', 'PG' : 'Papua New Guinea', 'PY' : 'Paraguay', 'PE' : 'Peru', 'PH' : 'Philippines', 'PN' : 'Pitcairn', 'PL' : 'Poland', 'PT' : 'Portugal', 'PR' : 'Puerto Rico', 'QA' : 'Qatar', 'RE' : 'Reunion', 'RO' : 'Romania', 'RU' : 'Russian Federation', 'RW' : 'Rwanda', 'BL' : 'Saint Barthelemy', 'SH' : 'Saint Helena', 'KN' : 'Saint Kitts And Nevis', 'LC' : 'Saint Lucia', 'MF' : 'Saint Martin', 'PM' : 'Saint Pierre And Miquelon', 'VC' : 'Saint Vincent And Grenadines', 'WS' : 'Samoa', 'SM' : 'San Marino', 'ST' : 'Sao Tome And Principe', 'SA' : 'Saudi Arabia', 'SN' : 'Senegal', 'RS' : 'Serbia', 'SC' : 'Seychelles', 'SL' : 'Sierra Leone', 'SG' : 'Singapore', 'SK' : 'Slovakia', 'SI' : 'Slovenia', 'SB' : 'Solomon Islands', 'SO' : 'Somalia', 'ZA' : 'South Africa', 'GS' : 'South Georgia And Sandwich Isl.', 'ES' : 'Spain', 'LK' : 'Sri Lanka', 'SD' : 'Sudan', 'SR' : 'Suriname', 'SJ' : 'Svalbard And Jan Mayen', 'SZ' : 'Swaziland', 'SE' : 'Sweden', 'CH' : 'Switzerland', 'SY' : 'Syrian Arab Republic', 'TW' : 'Taiwan', 'TJ' : 'Tajikistan', 'TZ' : 'Tanzania', 'TH' : 'Thailand', 'TL' : 'Timor-Leste', 'TG' : 'Togo', 'TK' : 'Tokelau', 'TO' : 'Tonga', 'TT' : 'Trinidad And Tobago', 'TN' : 'Tunisia', 'TR' : 'Turkey', 'TM' : 'Turkmenistan', 'TC' : 'Turks And Caicos Islands', 'TV' : 'Tuvalu', 'UG' : 'Uganda', 'UA' : 'Ukraine', 'AE' : 'United Arab Emirates', 'GB' : 'United Kingdom', 'US' : 'United States', 'UM' : 'United States Outlying Islands', 'UY' : 'Uruguay', 'UZ' : 'Uzbekistan', 'VU' : 'Vanuatu', 'VE' : 'Venezuela', 'VN' : 'Viet Nam', 'VG' : 'Virgin Islands, British', 'VI' : 'Virgin Islands, U.S.', 'WF' : 'Wallis And Futuna', 'EH' : 'Western Sahara', 'YE' : 'Yemen', 'ZM' : 'Zambia', 'ZW' : 'Zimbabwe' };


// let country_list = ["Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Anguilla", "Antigua &amp; Barbuda", "Argentina", "Armenia", "Aruba", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia", "Bosnia &amp; Herzegovina", "Botswana", "Brazil", "British Virgin Islands", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Cape Verde", "Cayman Islands", "Chad", "Chile", "China", "Colombia", "Congo", "Cook Islands", "Costa Rica", "Cote D Ivoire", "Croatia", "Cruise Ship", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Estonia", "Ethiopia", "Falkland Islands", "Faroe Islands", "Fiji", "Finland", "France", "French Polynesia", "French West Indies", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Gibraltar", "Greece", "Greenland", "Grenada", "Guam", "Guatemala", "Guernsey", "Guinea", "Guinea Bissau", "Guyana", "Haiti", "Honduras", "Hong Kong", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Isle of Man", "Israel", "Italy", "Jamaica", "Japan", "Jersey", "Jordan", "Kazakhstan", "Kenya", "Kuwait", "Kyrgyz Republic", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Macau", "Macedonia", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Mauritania", "Mauritius", "Mexico", "Moldova", "Monaco", "Mongolia", "Montenegro", "Montserrat", "Morocco", "Mozambique", "Namibia", "Nepal", "Netherlands", "Netherlands Antilles", "New Caledonia", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Norway", "Oman", "Pakistan", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Puerto Rico", "Qatar", "Reunion", "Romania", "Russia", "Rwanda", "Saint Pierre &amp; Miquelon", "Samoa", "San Marino", "Satellite", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "South Africa", "South Korea", "Spain", "Sri Lanka", "St Kitts &amp; Nevis", "St Lucia", "St Vincent", "St. Lucia", "Sudan", "Suriname", "Swaziland", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor L'Este", "Togo", "Tonga", "Trinidad &amp; Tobago", "Tunisia", "Turkey", "Turkmenistan", "Turks &amp; Caicos", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "Uruguay", "Uzbekistan", "Venezuela", "Vietnam", "Virgin Islands (US)", "Yemen", "Zambia", "Zimbabwe"];

