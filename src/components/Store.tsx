// eslint-disable-next-line
import * as React from 'react';
import { createContainer } from "unstated-next";
import moment from 'moment';
import _ from 'lodash';
import { country_list } from './Map/countries';
import {IGlobalData, ICountry , IDataCovid} from './modules/Interfaces';
// source : "https://api.covid19api.com/"
// source : "https://covidtracking.com/api/us/daily"


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

  /**
   * function countryDataGraph(data: IDataCovid[] | ICountry[], country: string, caseType: string, dateTo: string) {
   * Clean data array result of API and transform into array for graph
   * @param data 
   * @param country 
   * @param caseType 
   * @param dateTo 
   * @returns nothing, just  setData([]); setLabels([]);setDataDiff([]); in the store
   */
  function countryDataGraph(data: IDataCovid[] | ICountry[], country: string, caseType: string, dateTo: string) {
    let resultCases: any[] = []
    let resultDates: any[] = []
    if (data.length > 0) {
      data.forEach((item: any) => {
        // console.log("item : ", caseType, item[caseType], item);
        if (country === 'FR') {
          // console.log(`country`, country)
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
      // console.log(`resultCases`, resultCases)
      resultCasesDiff.pop();
      resultCases.pop();
      resultDates.pop();
      // dataDiff === [] ? console.log(dataDiff) : console.log('');
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
              // console.log(`res Fetch`, res)
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

  // console.log(`https://covid19-api.org/api/timeline/${country}`)
  // console.log(`https://api.covid19api.com/country/${country}/status/${caseType}/live?from=${dateTo}&to=${moment().format('YYYY-MM-DDT00:00:00')}`)
  const getCovidCountry = async (country: string, caseType: string, dateTo: string) => {
    setCovidApi(await getCovidApi(country, caseType, dateTo));
  }

  /**
   * just update global world total data for main dashboard
   */
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

  /**
   * function for creating markers for the world map component
   */
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

  /**
   * just a function to get all countries list infectino for left side bar
   * @returns nothing
   */
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
    dataDiff,
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
