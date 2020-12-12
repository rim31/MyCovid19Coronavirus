// eslint-disable-next-line
import * as React from 'react';
import { createContainer } from "unstated-next";
import moment from 'moment';
import _ from 'lodash';

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

  const country_list = [
    {
      "timezones": [
        "America/Aruba"
      ],
      "lat": 12.5,
      "lon": -69.96666666,
      "name": "Aruba",
      "code": "AW",
      "capital": "Oranjestad"
    },
    {
      "timezones": [
        "Asia/Kabul"
      ],
      "lat": 33,
      "lon": 65,
      "name": "Afghanistan",
      "code": "AF",
      "capital": "Kabul"
    },
    {
      "timezones": [
        "Africa/Luanda"
      ],
      "lat": 12.5,
      "lon": 18.5,
      "name": "Angola",
      "code": "AO",
      "capital": "Luanda"
    },
    {
      "timezones": [
        "America/Anguilla"
      ],
      "lat": 18.25,
      "lon": -63.16666666,
      "name": "Anguilla",
      "code": "AI",
      "capital": "The Valley"
    },
    {
      "timezones": [
        "Europe/Mariehamn"
      ],
      "lat": 60.116667,
      "lon": 19.9,
      "name": "\u00c5land Islands",
      "code": "AX",
      "capital": "Mariehamn"
    },
    {
      "timezones": [
        "Europe/Tirane"
      ],
      "lat": 41,
      "lon": 20,
      "name": "Albania",
      "code": "AL",
      "capital": "Tirana"
    },
    {
      "timezones": [
        "Europe/Andorra"
      ],
      "lat": 42.5,
      "lon": 1.5,
      "name": "Andorra",
      "code": "AD",
      "capital": "Andorra la Vella"
    },
    {
      "timezones": [
        "Asia/Dubai"
      ],
      "lat": 24,
      "lon": 54,
      "name": "United Arab Emirates",
      "code": "AE",
      "capital": "Abu Dhabi"
    },
    {
      "timezones": [
        "America/Argentina/Buenos_Aires",
        "America/Argentina/Cordoba",
        "America/Argentina/Salta",
        "America/Argentina/Jujuy",
        "America/Argentina/Tucuman",
        "America/Argentina/Catamarca",
        "America/Argentina/La_Rioja",
        "America/Argentina/San_Juan",
        "America/Argentina/Mendoza",
        "America/Argentina/San_Luis",
        "America/Argentina/Rio_Gallegos",
        "America/Argentina/Ushuaia"
      ],
      "lon": -58.3816, "lat": -34.6037,
      "name": "Argentina",
      "code": "AR",
      "capital": "Buenos Aires"
    },
    {
      "timezones": [
        "Asia/Yerevan"
      ],
      "lat": 40,
      "lon": 45,
      "name": "Armenia",
      "code": "AM",
      "capital": "Yerevan"
    },
    {
      "timezones": [
        "Pacific/Pago_Pago"
      ],
      "lat": 14.33333333,
      "lon": -170,
      "name": "American Samoa",
      "code": "AS",
      "capital": "Pago Pago"
    },
    {
      "timezones": [
        "Antarctica/McMurdo",
        "Antarctica/Casey",
        "Antarctica/Davis",
        "Antarctica/DumontDUrville",
        "Antarctica/Mawson",
        "Antarctica/Palmer",
        "Antarctica/Rothera",
        "Antarctica/Syowa",
        "Antarctica/Troll",
        "Antarctica/Vostok"
      ],
      "lat": 90,
      "lon": 0,
      "name": "Antarctica",
      "code": "AQ",
      "capital": null
    },
    {
      "timezones": [
        "Indian/Kerguelen"
      ],
      "lat": 49.25,
      "lon": 69.167,
      "name": "French Southern and Antarctic Lands",
      "code": "TF",
      "capital": "Port-aux-Fran\u00e7ais"
    },
    {
      "timezones": [
        "America/Antigua"
      ],
      "lat": 17.05,
      "lon": -61.8,
      "name": "Antigua and Barbuda",
      "code": "AG",
      "capital": "Saint John's"
    },
    {
      "timezones": [
        "Australia/Lord_Howe",
        "Antarctica/Macquarie",
        "Australia/Hobart",
        "Australia/Currie",
        "Australia/Melbourne",
        "Australia/Sydney",
        "Australia/Broken_Hill",
        "Australia/Brisbane",
        "Australia/Lindeman",
        "Australia/Adelaide",
        "Australia/Darwin",
        "Australia/Perth",
        "Australia/Eucla"
      ],
      "lat": 27,
      "lon": 133,
      "name": "Australia",
      "code": "AU",
      "capital": "Canberra"
    },
    {
      "timezones": [
        "Europe/Vienna"
      ],
      "lat": 47.33333333,
      "lon": 13.33333333,
      "name": "Austria",
      "code": "AT",
      "capital": "Vienna"
    },
    {
      "timezones": [
        "Asia/Baku"
      ],
      "lat": 40.5,
      "lon": 47.5,
      "name": "Azerbaijan",
      "code": "AZ",
      "capital": "Baku"
    },
    {
      "timezones": [
        "Africa/Bujumbura"
      ],
      "lat": 3.5,
      "lon": 30,
      "name": "Burundi",
      "code": "BI",
      "capital": "Bujumbura"
    },
    {
      "timezones": [
        "Europe/Brussels"
      ],
      "lat": 50.83333333,
      "lon": 4,
      "name": "Belgium",
      "code": "BE",
      "capital": "Brussels"
    },
    {
      "timezones": [
        "Africa/Porto-Novo"
      ],
      "lat": 9.5,
      "lon": 2.25,
      "name": "Benin",
      "code": "BJ",
      "capital": "Porto-Novo"
    },
    {
      "timezones": [
        "Africa/Ouagadougou"
      ],
      "lat": 13,
      "lon": -2,
      "name": "Burkina Faso",
      "code": "BF",
      "capital": "Ouagadougou"
    },
    {
      "timezones": [
        "Asia/Dhaka"
      ],
      "lat": 24,
      "lon": 90,
      "name": "Bangladesh",
      "code": "BD",
      "capital": "Dhaka"
    },
    {
      "timezones": [
        "Europe/Sofia"
      ],
      "lat": 43,
      "lon": 25,
      "name": "Bulgaria",
      "code": "BG",
      "capital": "Sofia"
    },
    {
      "timezones": [
        "Asia/Bahrain"
      ],
      "lat": 26,
      "lon": 50.55,
      "name": "Bahrain",
      "code": "BH",
      "capital": "Manama"
    },
    {
      "timezones": [
        "America/Nassau"
      ],
      "lat": 24.25,
      "lon": -76,
      "name": "Bahamas",
      "code": "BS",
      "capital": "Nassau"
    },
    {
      "timezones": [
        "Europe/Sarajevo"
      ],
      "lat": 44,
      "lon": 18,
      "name": "Bosnia and Herzegovina",
      "code": "BA",
      "capital": "Sarajevo"
    },
    {
      "timezones": [
        "America/St_Barthelemy"
      ],
      "lat": 18.5,
      "lon": -63.41666666,
      "name": "Saint Barth\u00e9lemy",
      "code": "BL",
      "capital": "Gustavia"
    },
    {
      "timezones": [
        "Europe/Minsk"
      ],
      "lat": 53,
      "lon": 28,
      "name": "Belarus",
      "code": "BY",
      "capital": "Minsk"
    },
    {
      "timezones": [
        "America/Belize"
      ],
      "lat": 17.25,
      "lon": -88.75,
      "name": "Belize",
      "code": "BZ",
      "capital": "Belmopan"
    },
    {
      "timezones": [
        "Atlantic/Bermuda"
      ],
      "lat": 32.33333333,
      "lon": -64.75,
      "name": "Bermuda",
      "code": "BM",
      "capital": "Hamilton"
    },
    {
      "timezones": [
        "America/La_Paz"
      ],
      "lon": -68.1193, "lat": -16.4897,
      "name": "Bolivia",
      "code": "BO",
      "capital": "Sucre"
    },
    {
      "timezones": [
        "America/Noronha",
        "America/Belem",
        "America/Fortaleza",
        "America/Recife",
        "America/Araguaina",
        "America/Maceio",
        "America/Bahia",
        "America/Sao_Paulo",
        "America/Campo_Grande",
        "America/Cuiaba",
        "America/Santarem",
        "America/Porto_Velho",
        "America/Boa_Vista",
        "America/Manaus",
        "America/Eirunepe",
        "America/Rio_Branco"
      ],
      "lat": -34.6037,
      "lon": -58.3816,
      "name": "Brazil",
      "code": "BR",
      "capital": "Bras\u00edlia"
    },
    {
      "timezones": [
        "America/Barbados"
      ],
      "lat": 13.16666666,
      "lon": -59.53333333,
      "name": "Barbados",
      "code": "BB",
      "capital": "Bridgetown"
    },
    {
      "timezones": [
        "Asia/Brunei"
      ],
      "lat": 4.5,
      "lon": 114.66666666,
      "name": "Brunei",
      "code": "BN",
      "capital": "Bandar Seri Begawan"
    },
    {
      "timezones": [
        "Asia/Thimphu"
      ],
      "lat": 27.5,
      "lon": 90.5,
      "name": "Bhutan",
      "code": "BT",
      "capital": "Thimphu"
    },
    {
      "timezones": [
        "Europe/Oslo"
      ],
      "lat": 54.43333333,
      "lon": 3.4,
      "name": "Bouvet Island",
      "code": "BV",
      "capital": null
    },
    {
      "timezones": [
        "Africa/Gaborone"
      ],
      "lat": 22,
      "lon": 24,
      "name": "Botswana",
      "code": "BW",
      "capital": "Gaborone"
    },
    {
      "timezones": [
        "Africa/Bangui"
      ],
      "lat": 7,
      "lon": 21,
      "name": "Central African Republic",
      "code": "CF",
      "capital": "Bangui"
    },
    {
      "timezones": [
        "America/St_Johns",
        "America/Halifax",
        "America/Glace_Bay",
        "America/Moncton",
        "America/Goose_Bay",
        "America/Blanc-Sablon",
        "America/Toronto",
        "America/Nipigon",
        "America/Thunder_Bay",
        "America/Iqaluit",
        "America/Pangnirtung",
        "America/Atikokan",
        "America/Winnipeg",
        "America/Rainy_River",
        "America/Resolute",
        "America/Rankin_Inlet",
        "America/Regina",
        "America/Swift_Current",
        "America/Edmonton",
        "America/Cambridge_Bay",
        "America/Yellowknife",
        "America/Inuvik",
        "America/Creston",
        "America/Dawson_Creek",
        "America/Fort_Nelson",
        "America/Vancouver",
        "America/Whitehorse",
        "America/Dawson"
      ],
      "lat": 60,
      "lon": -95,
      "name": "Canada",
      "code": "CA",
      "capital": "Ottawa"
    },
    {
      "timezones": [
        "Indian/Cocos"
      ],
      "lat": 12.5,
      "lon": 96.83333333,
      "name": "Cocos (Keeling) Islands",
      "code": "CC",
      "capital": "West Island"
    },
    {
      "timezones": [
        "Europe/Zurich"
      ],
      "lat": 47,
      "lon": 8,
      "name": "Switzerland",
      "code": "CH",
      "capital": "Bern"
    },
    {
      "timezones": [
        "America/Santiago",
        "Pacific/Easter"
      ],
      "lon": -70.6693, "lat": -33.4489,
      "name": "Chile",
      "code": "CL",
      "capital": "Santiago"
    },
    {
      "timezones": [
        "Asia/Shanghai",
        "Asia/Urumqi"
      ],
      "lat": 35,
      "lon": 105,
      "name": "China",
      "code": "CN",
      "capital": "Beijing"
    },
    {
      "timezones": [
        "Africa/Abidjan"
      ],
      "lat": 8,
      "lon": -5,
      "name": "Ivory Coast",
      "code": "CI",
      "capital": "Yamoussoukro"
    },
    {
      "timezones": [
        "Africa/Douala"
      ],
      "lat": 6,
      "lon": 12,
      "name": "Cameroon",
      "code": "CM",
      "capital": "Yaound\u00e9"
    },
    {
      "timezones": [
        "Africa/Kinshasa",
        "Africa/Lubumbashi"
      ],
      "lat": 0,
      "lon": 25,
      "name": "DR Congo",
      "code": "CD",
      "capital": "Kinshasa"
    },
    {
      "timezones": [
        "Africa/Brazzaville"
      ],
      "lat": 1,
      "lon": 15,
      "name": "Republic of the Congo",
      "code": "CG",
      "capital": "Brazzaville"
    },
    {
      "timezones": [
        "Pacific/Rarotonga"
      ],
      "lat": 21.23333333,
      "lon": -159.76666666,
      "name": "Cook Islands",
      "code": "CK",
      "capital": "Avarua"
    },
    {
      "timezones": [
        "America/Bogota"
      ],
      "lon": -74.0721, "lat": 4.711,
      "name": "Colombia",
      "code": "CO",
      "capital": "Bogot\u00e1"
    },
    {
      "timezones": [
        "Indian/Comoro"
      ],
      "lat": 12.16666666,
      "lon": 44.25,
      "name": "Comoros",
      "code": "KM",
      "capital": "Moroni"
    },
    {
      "timezones": [
        "Atlantic/Cape_Verde"
      ],
      "lat": 16,
      "lon": -24,
      "name": "Cape Verde",
      "code": "CV",
      "capital": "Praia"
    },
    {
      "timezones": [
        "America/Costa_Rica"
      ],
      "lat": 10,
      "lon": -84,
      "name": "Costa Rica",
      "code": "CR",
      "capital": "San Jos\u00e9"
    },
    {
      "timezones": [
        "America/Havana"
      ],
      "lat": 21.5,
      "lon": -80,
      "name": "Cuba",
      "code": "CU",
      "capital": "Havana"
    },
    {
      "timezones": [
        "America/Curacao"
      ],
      "lat": 12.116667,
      "lon": -68.933333,
      "name": "Cura\u00e7ao",
      "code": "CW",
      "capital": "Willemstad"
    },
    {
      "timezones": [
        "Indian/Christmas"
      ],
      "lat": 10.5,
      "lon": 105.66666666,
      "name": "Christmas Island",
      "code": "CX",
      "capital": "Flying Fish Cove"
    },
    {
      "timezones": [
        "America/Cayman"
      ],
      "lat": 19.5,
      "lon": -80.5,
      "name": "Cayman Islands",
      "code": "KY",
      "capital": "George Town"
    },
    {
      "timezones": [
        "Asia/Nicosia"
      ],
      "lat": 35,
      "lon": 33,
      "name": "Cyprus",
      "code": "CY",
      "capital": "Nicosia"
    },
    {
      "timezones": [
        "Europe/Prague"
      ],
      "lat": 49.75,
      "lon": 15.5,
      "name": "Czech Republic",
      "code": "CZ",
      "capital": "Prague"
    },
    {
      "timezones": [
        "Europe/Berlin",
        "Europe/Busingen"
      ],
      "lat": 51,
      "lon": 9,
      "name": "Germany",
      "code": "DE",
      "capital": "Berlin"
    },
    {
      "timezones": [
        "Africa/Djibouti"
      ],
      "lat": 11.5,
      "lon": 43,
      "name": "Djibouti",
      "code": "DJ",
      "capital": "Djibouti"
    },
    {
      "timezones": [
        "America/Dominica"
      ],
      "lat": 15.41666666,
      "lon": -61.33333333,
      "name": "Dominica",
      "code": "DM",
      "capital": "Roseau"
    },
    {
      "timezones": [
        "Europe/Copenhagen"
      ],
      "lat": 56,
      "lon": 10,
      "name": "Denmark",
      "code": "DK",
      "capital": "Copenhagen"
    },
    {
      "timezones": [
        "America/Santo_Domingo"
      ],
      "lat": 19,
      "lon": -70.66666666,
      "name": "Dominican Republic",
      "code": "DO",
      "capital": "Santo Domingo"
    },
    {
      "timezones": [
        "Africa/Algiers"
      ],
      "lat": 28,
      "lon": 3,
      "name": "Algeria",
      "code": "DZ",
      "capital": "Algiers"
    },
    {
      "timezones": [
        "America/Guayaquil",
        "Pacific/Galapagos"
      ],
      "lon": -78.4678, "lat": -0.1807,
      "name": "Ecuador",
      "code": "EC",
      "capital": "Quito"
    },
    {
      "timezones": [
        "Africa/Cairo"
      ],
      "lat": 27,
      "lon": 30,
      "name": "Egypt",
      "code": "EG",
      "capital": "Cairo"
    },
    {
      "timezones": [
        "Africa/Asmara"
      ],
      "lat": 15,
      "lon": 39,
      "name": "Eritrea",
      "code": "ER",
      "capital": "Asmara"
    },
    {
      "timezones": [
        "Africa/El_Aaiun"
      ],
      "lat": 24.5,
      "lon": -13,
      "name": "Western Sahara",
      "code": "EH",
      "capital": "El Aai\u00fan"
    },
    {
      "timezones": [
        "Europe/Madrid",
        "Africa/Ceuta",
        "Atlantic/Canary"
      ],
      "lat": 40,
      "lon": -4,
      "name": "Spain",
      "code": "ES",
      "capital": "Madrid"
    },
    {
      "timezones": [
        "Europe/Tallinn"
      ],
      "lat": 59,
      "lon": 26,
      "name": "Estonia",
      "code": "EE",
      "capital": "Tallinn"
    },
    {
      "timezones": [
        "Africa/Addis_Ababa"
      ],
      "lat": 8,
      "lon": 38,
      "name": "Ethiopia",
      "code": "ET",
      "capital": "Addis Ababa"
    },
    {
      "timezones": [
        "Europe/Helsinki"
      ],
      "lat": 64,
      "lon": 26,
      "name": "Finland",
      "code": "FI",
      "capital": "Helsinki"
    },
    {
      "timezones": [
        "Pacific/Fiji"
      ],
      "lat": 18,
      "lon": 175,
      "name": "Fiji",
      "code": "FJ",
      "capital": "Suva"
    },
    {
      "timezones": [
        "Atlantic/Stanley"
      ],
      "lat": 51.75,
      "lon": -59,
      "name": "Falkland Islands",
      "code": "FK",
      "capital": "Stanley"
    },
    {
      "timezones": [
        "Europe/Paris"
      ],
      "lat": 46,
      "lon": 2,
      "name": "France",
      "code": "FR",
      "capital": "Paris"
    },
    {
      "timezones": [
        "Atlantic/Faroe"
      ],
      "lat": 62,
      "lon": -7,
      "name": "Faroe Islands",
      "code": "FO",
      "capital": "T\u00f3rshavn"
    },
    {
      "timezones": [
        "Pacific/Chuuk",
        "Pacific/Pohnpei",
        "Pacific/Kosrae"
      ],
      "lat": 6.91666666,
      "lon": 158.25,
      "name": "Micronesia",
      "code": "FM",
      "capital": "Palikir"
    },
    {
      "timezones": [
        "Africa/Libreville"
      ],
      "lat": 1,
      "lon": 11.75,
      "name": "Gabon",
      "code": "GA",
      "capital": "Libreville"
    },
    {
      "timezones": [
        "Europe/London"
      ],
      "lat": 54,
      "lon": -2,
      "name": "United Kingdom",
      "code": "GB",
      "capital": "London"
    },
    {
      "timezones": [
        "Asia/Tbilisi"
      ],
      "lat": 42,
      "lon": 43.5,
      "name": "Georgia",
      "code": "GE",
      "capital": "Tbilisi"
    },
    {
      "timezones": [
        "Europe/Guernsey"
      ],
      "lat": 49.46666666,
      "lon": -2.58333333,
      "name": "Guernsey",
      "code": "GG",
      "capital": "St. Peter Port"
    },
    {
      "timezones": [
        "Africa/Accra"
      ],
      "lat": 8,
      "lon": -2,
      "name": "Ghana",
      "code": "GH",
      "capital": "Accra"
    },
    {
      "timezones": [
        "Europe/Gibraltar"
      ],
      "lat": 36.13333333,
      "lon": -5.35,
      "name": "Gibraltar",
      "code": "GI",
      "capital": "Gibraltar"
    },
    {
      "timezones": [
        "Africa/Conakry"
      ],
      "lat": 11,
      "lon": -10,
      "name": "Guinea",
      "code": "GN",
      "capital": "Conakry"
    },
    {
      "timezones": [
        "America/Guadeloupe"
      ],
      "lat": 16.25,
      "lon": -61.583333,
      "name": "Guadeloupe",
      "code": "GP",
      "capital": "Basse-Terre"
    },
    {
      "timezones": [
        "Africa/Banjul"
      ],
      "lat": 13.46666666,
      "lon": -16.56666666,
      "name": "Gambia",
      "code": "GM",
      "capital": "Banjul"
    },
    {
      "timezones": [
        "Africa/Bissau"
      ],
      "lat": 12,
      "lon": -15,
      "name": "Guinea-Bissau",
      "code": "GW",
      "capital": "Bissau"
    },
    {
      "timezones": [
        "Africa/Malabo"
      ],
      "lat": 2,
      "lon": 10,
      "name": "Equatorial Guinea",
      "code": "GQ",
      "capital": "Malabo"
    },
    {
      "timezones": [
        "Europe/Athens"
      ],
      "lat": 39,
      "lon": 22,
      "name": "Greece",
      "code": "GR",
      "capital": "Athens"
    },
    {
      "timezones": [
        "America/Grenada"
      ],
      "lat": 12.11666666,
      "lon": -61.66666666,
      "name": "Grenada",
      "code": "GD",
      "capital": "St. George's"
    },
    {
      "timezones": [
        "America/Godthab",
        "America/Danmarkshavn",
        "America/Scoresbysund",
        "America/Thule"
      ],
      "lat": 72,
      "lon": -40,
      "name": "Greenland",
      "code": "GL",
      "capital": "Nuuk"
    },
    {
      "timezones": [
        "America/Guatemala"
      ],
      "lat": 15.5,
      "lon": -90.25,
      "name": "Guatemala",
      "code": "GT",
      "capital": "Guatemala City"
    },
    {
      "timezones": [
        "America/Cayenne"
      ],
      "lat": 4,
      "lon": -53,
      "name": "French Guiana",
      "code": "GF",
      "capital": "Cayenne"
    },
    {
      "timezones": [
        "Pacific/Guam"
      ],
      "lat": 13.46666666,
      "lon": 144.78333333,
      "name": "Guam",
      "code": "GU",
      "capital": "Hag\u00e5t\u00f1a"
    },
    {
      "timezones": [
        "America/Guyana"
      ],
      "lon": -58.1551, "lat": 6.8013,
      "name": "Guyana",
      "code": "GY",
      "capital": "Georgetown"
    },
    {
      "timezones": [
        "Asia/Hong_Kong"
      ],
      "lat": 22.267,
      "lon": 114.188,
      "name": "Hong Kong",
      "code": "HK",
      "capital": "City of Victoria"
    },
    {
      "timezones": [
        "America/Tegucigalpa"
      ],
      "lat": 15,
      "lon": -86.5,
      "name": "Honduras",
      "code": "HN",
      "capital": "Tegucigalpa"
    },
    {
      "timezones": [
        "Europe/Zagreb"
      ],
      "lat": 45.16666666,
      "lon": 15.5,
      "name": "Croatia",
      "code": "HR",
      "capital": "Zagreb"
    },
    {
      "timezones": [
        "America/Port-au-Prince"
      ],
      "lat": 19,
      "lon": -72.41666666,
      "name": "Haiti",
      "code": "HT",
      "capital": "Port-au-Prince"
    },
    {
      "timezones": [
        "Europe/Budapest"
      ],
      "lat": 47,
      "lon": 20,
      "name": "Hungary",
      "code": "HU",
      "capital": "Budapest"
    },
    {
      "timezones": [
        "Asia/Jakarta",
        "Asia/Pontianak",
        "Asia/Makassar",
        "Asia/Jayapura"
      ],
      "lat": 5,
      "lon": 120,
      "name": "Indonesia",
      "code": "ID",
      "capital": "Jakarta"
    },
    {
      "timezones": [
        "Europe/Isle_of_Man"
      ],
      "lat": 54.25,
      "lon": -4.5,
      "name": "Isle of Man",
      "code": "IM",
      "capital": "Douglas"
    },
    {
      "timezones": [
        "Asia/Kolkata"
      ],
      "lat": 20,
      "lon": 77,
      "name": "India",
      "code": "IN",
      "capital": "New Delhi"
    },
    {
      "timezones": [
        "Indian/Chagos"
      ],
      "lat": 6,
      "lon": 71.5,
      "name": "British Indian Ocean Territory",
      "code": "IO",
      "capital": "Diego Garcia"
    },
    {
      "timezones": [
        "Europe/Dublin"
      ],
      "lat": 53,
      "lon": -8,
      "name": "Ireland",
      "code": "IE",
      "capital": "Dublin"
    },
    {
      "timezones": [
        "Asia/Tehran"
      ],
      "lat": 32,
      "lon": 53,
      "name": "Iran",
      "code": "IR",
      "capital": "Tehran"
    },
    {
      "timezones": [
        "Asia/Baghdad"
      ],
      "lat": 33,
      "lon": 44,
      "name": "Iraq",
      "code": "IQ",
      "capital": "Baghdad"
    },
    {
      "timezones": [
        "Atlantic/Reykjavik"
      ],
      "lat": 65,
      "lon": -18,
      "name": "Iceland",
      "code": "IS",
      "capital": "Reykjavik"
    },
    {
      "timezones": [
        "Asia/Jerusalem"
      ],
      "lat": 31.47,
      "lon": 35.13,
      "name": "Israel",
      "code": "IL",
      "capital": "Jerusalem"
    },
    {
      "timezones": [
        "Europe/Rome"
      ],
      "lat": 42.83333333,
      "lon": 12.83333333,
      "name": "Italy",
      "code": "IT",
      "capital": "Rome"
    },
    {
      "timezones": [
        "America/Jamaica"
      ],
      "lat": 18.25,
      "lon": -77.5,
      "name": "Jamaica",
      "code": "JM",
      "capital": "Kingston"
    },
    {
      "timezones": [
        "Europe/Jersey"
      ],
      "lat": 49.25,
      "lon": -2.16666666,
      "name": "Jersey",
      "code": "JE",
      "capital": "Saint Helier"
    },
    {
      "timezones": [
        "Asia/Amman"
      ],
      "lat": 31,
      "lon": 36,
      "name": "Jordan",
      "code": "JO",
      "capital": "Amman"
    },
    {
      "timezones": [
        "Asia/Tokyo"
      ],
      "lat": 36,
      "lon": 138,
      "name": "Japan",
      "code": "JP",
      "capital": "Tokyo"
    },
    {
      "timezones": [
        "Asia/Almaty",
        "Asia/Qyzylorda",
        "Asia/Aqtobe",
        "Asia/Aqtau",
        "Asia/Oral"
      ],
      "lat": 48,
      "lon": 68,
      "name": "Kazakhstan",
      "code": "KZ",
      "capital": "Astana"
    },
    {
      "timezones": [
        "Africa/Nairobi"
      ],
      "lat": 1,
      "lon": 38,
      "name": "Kenya",
      "code": "KE",
      "capital": "Nairobi"
    },
    {
      "timezones": [
        "Asia/Bishkek"
      ],
      "lat": 41,
      "lon": 75,
      "name": "Kyrgyzstan",
      "code": "KG",
      "capital": "Bishkek"
    },
    {
      "timezones": [
        "Asia/Phnom_Penh"
      ],
      "lat": 13,
      "lon": 105,
      "name": "Cambodia",
      "code": "KH",
      "capital": "Phnom Penh"
    },
    {
      "timezones": [
        "Pacific/Tarawa",
        "Pacific/Enderbury",
        "Pacific/Kiritimati"
      ],
      "lat": 1.41666666,
      "lon": 173,
      "name": "Kiribati",
      "code": "KI",
      "capital": "South Tarawa"
    },
    {
      "timezones": [
        "America/St_Kitts"
      ],
      "lat": 17.33333333,
      "lon": -62.75,
      "name": "Saint Kitts and Nevis",
      "code": "KN",
      "capital": "Basseterre"
    },
    {
      "timezones": [
        "Asia/Seoul"
      ],
      "lat": 37,
      "lon": 127.5,
      "name": "South Korea",
      "code": "KR",
      "capital": "Seoul"
    },
    {
      "timezones": ["Europe/Belgrade"],
      "lat": 42.666667,
      "lon": 21.166667,
      "name": "Kosovo",
      "code": "XK",
      "capital": "Pristina"
    },
    {
      "timezones": [
        "Asia/Kuwait"
      ],
      "lat": 29.5,
      "lon": 45.75,
      "name": "Kuwait",
      "code": "KW",
      "capital": "Kuwait City"
    },
    {
      "timezones": [
        "Asia/Vientiane"
      ],
      "lat": 18,
      "lon": 105,
      "name": "Laos",
      "code": "LA",
      "capital": "Vientiane"
    },
    {
      "timezones": [
        "Asia/Beirut"
      ],
      "lat": 33.83333333,
      "lon": 35.83333333,
      "name": "Lebanon",
      "code": "LB",
      "capital": "Beirut"
    },
    {
      "timezones": [
        "Africa/Monrovia"
      ],
      "lat": 6.5,
      "lon": -9.5,
      "name": "Liberia",
      "code": "LR",
      "capital": "Monrovia"
    },
    {
      "timezones": [
        "Africa/Tripoli"
      ],
      "lat": 25,
      "lon": 17,
      "name": "Libya",
      "code": "LY",
      "capital": "Tripoli"
    },
    {
      "timezones": [
        "America/St_Lucia"
      ],
      "lat": 13.88333333,
      "lon": -60.96666666,
      "name": "Saint Lucia",
      "code": "LC",
      "capital": "Castries"
    },
    {
      "timezones": [
        "Europe/Vaduz"
      ],
      "lat": 47.26666666,
      "lon": 9.53333333,
      "name": "Liechtenstein",
      "code": "LI",
      "capital": "Vaduz"
    },
    {
      "timezones": [
        "Asia/Colombo"
      ],
      "lat": 7,
      "lon": 81,
      "name": "Sri Lanka",
      "code": "LK",
      "capital": "Colombo"
    },
    {
      "timezones": [
        "Africa/Maseru"
      ],
      "lat": 29.5,
      "lon": 28.5,
      "name": "Lesotho",
      "code": "LS",
      "capital": "Maseru"
    },
    {
      "timezones": [
        "Europe/Vilnius"
      ],
      "lat": 56,
      "lon": 24,
      "name": "Lithuania",
      "code": "LT",
      "capital": "Vilnius"
    },
    {
      "timezones": [
        "Europe/Luxembourg"
      ],
      "lat": 49.75,
      "lon": 6.16666666,
      "name": "Luxembourg",
      "code": "LU",
      "capital": "Luxembourg"
    },
    {
      "timezones": [
        "Europe/Riga"
      ],
      "lat": 57,
      "lon": 25,
      "name": "Latvia",
      "code": "LV",
      "capital": "Riga"
    },
    {
      "timezones": [
        "Asia/Macau"
      ],
      "lat": 22.16666666,
      "lon": 113.55,
      "name": "Macau",
      "code": "MO",
      "capital": null
    },
    {
      "timezones": [
        "America/Marigot"
      ],
      "lat": 18.08333333,
      "lon": -63.95,
      "name": "Saint Martin",
      "code": "MF",
      "capital": "Marigot"
    },
    {
      "timezones": [
        "Africa/Casablanca"
      ],
      "lat": 32,
      "lon": -5,
      "name": "Morocco",
      "code": "MA",
      "capital": "Rabat"
    },
    {
      "timezones": [
        "Europe/Monaco"
      ],
      "lat": 43.73333333,
      "lon": 7.4,
      "name": "Monaco",
      "code": "MC",
      "capital": "Monaco"
    },
    {
      "timezones": [
        "Europe/Chisinau"
      ],
      "lat": 47,
      "lon": 29,
      "name": "Moldova",
      "code": "MD",
      "capital": "Chi\u0219in\u0103u"
    },
    {
      "timezones": [
        "Indian/Antananarivo"
      ],
      "lat": 20,
      "lon": 47,
      "name": "Madagascar",
      "code": "MG",
      "capital": "Antananarivo"
    },
    {
      "timezones": [
        "Indian/Maldives"
      ],
      "lat": 3.25,
      "lon": 73,
      "name": "Maldives",
      "code": "MV",
      "capital": "Mal\u00e9"
    },
    {
      "timezones": [
        "America/Mexico_City",
        "America/Cancun",
        "America/Merida",
        "America/Monterrey",
        "America/Matamoros",
        "America/Mazatlan",
        "America/Chihuahua",
        "America/Ojinaga",
        "America/Hermosillo",
        "America/Tijuana",
        "America/Bahia_Banderas"
      ],
      "lat": 23,
      "lon": -102,
      "name": "Mexico",
      "code": "MX",
      "capital": "Mexico City"
    },
    {
      "timezones": [
        "Pacific/Majuro",
        "Pacific/Kwajalein"
      ],
      "lat": 9,
      "lon": 168,
      "name": "Marshall Islands",
      "code": "MH",
      "capital": "Majuro"
    },
    {
      "timezones": [
        "Europe/Skopje"
      ],
      "lat": 41.83333333,
      "lon": 22,
      "name": "Macedonia",
      "code": "MK",
      "capital": "Skopje"
    },
    {
      "timezones": [
        "Africa/Bamako"
      ],
      "lat": 17,
      "lon": -4,
      "name": "Mali",
      "code": "ML",
      "capital": "Bamako"
    },
    {
      "timezones": [
        "Europe/Malta"
      ],
      "lat": 35.83333333,
      "lon": 14.58333333,
      "name": "Malta",
      "code": "MT",
      "capital": "Valletta"
    },
    {
      "timezones": [
        "Asia/Rangoon"
      ],
      "lat": 22,
      "lon": 98,
      "name": "Myanmar",
      "code": "MM",
      "capital": "Naypyidaw"
    },
    {
      "timezones": [
        "Europe/Podgorica"
      ],
      "lat": 42.5,
      "lon": 19.3,
      "name": "Montenegro",
      "code": "ME",
      "capital": "Podgorica"
    },
    {
      "timezones": [
        "Asia/Ulaanbaatar",
        "Asia/Hovd",
        "Asia/Choibalsan"
      ],
      "lat": 46,
      "lon": 105,
      "name": "Mongolia",
      "code": "MN",
      "capital": "Ulan Bator"
    },
    {
      "timezones": [
        "Pacific/Saipan"
      ],
      "lat": 15.2,
      "lon": 145.75,
      "name": "Northern Mariana Islands",
      "code": "MP",
      "capital": "Saipan"
    },
    {
      "timezones": [
        "Africa/Maputo"
      ],
      "lat": 18.25,
      "lon": 35,
      "name": "Mozambique",
      "code": "MZ",
      "capital": "Maputo"
    },
    {
      "timezones": [
        "Africa/Nouakchott"
      ],
      "lat": 20,
      "lon": -12,
      "name": "Mauritania",
      "code": "MR",
      "capital": "Nouakchott"
    },
    {
      "timezones": [
        "America/Montserrat"
      ],
      "lat": 16.75,
      "lon": -62.2,
      "name": "Montserrat",
      "code": "MS",
      "capital": "Plymouth"
    },
    {
      "timezones": [
        "America/Martinique"
      ],
      "lat": 14.666667,
      "lon": -61,
      "name": "Martinique",
      "code": "MQ",
      "capital": "Fort-de-France"
    },
    {
      "timezones": [
        "Indian/Mauritius"
      ],
      "lat": 20.28333333,
      "lon": 57.55,
      "name": "Mauritius",
      "code": "MU",
      "capital": "Port Louis"
    },
    {
      "timezones": [
        "Africa/Blantyre"
      ],
      "lat": 13.5,
      "lon": 34,
      "name": "Malawi",
      "code": "MW",
      "capital": "Lilongwe"
    },
    {
      "timezones": [
        "Asia/Kuala_Lumpur",
        "Asia/Kuching"
      ],
      "lat": 2.5,
      "lon": 112.5,
      "name": "Malaysia",
      "code": "MY",
      "capital": "Kuala Lumpur"
    },
    {
      "timezones": [
        "Indian/Mayotte"
      ],
      "lat": 12.83333333,
      "lon": 45.16666666,
      "name": "Mayotte",
      "code": "YT",
      "capital": "Mamoudzou"
    },
    {
      "timezones": [
        "Africa/Windhoek"
      ],
      "lat": 22,
      "lon": 17,
      "name": "Namibia",
      "code": "NA",
      "capital": "Windhoek"
    },
    {
      "timezones": [
        "Pacific/Noumea"
      ],
      "lat": 21.5,
      "lon": 165.5,
      "name": "New Caledonia",
      "code": "NC",
      "capital": "Noum\u00e9a"
    },
    {
      "timezones": [
        "Africa/Niamey"
      ],
      "lat": 16,
      "lon": 8,
      "name": "Niger",
      "code": "NE",
      "capital": "Niamey"
    },
    {
      "timezones": [
        "Pacific/Norfolk"
      ],
      "lat": 29.03333333,
      "lon": 167.95,
      "name": "Norfolk Island",
      "code": "NF",
      "capital": "Kingston"
    },
    {
      "timezones": [
        "Africa/Lagos"
      ],
      "lat": 10,
      "lon": 8,
      "name": "Nigeria",
      "code": "NG",
      "capital": "Abuja"
    },
    {
      "timezones": [
        "America/Managua"
      ],
      "lat": 13,
      "lon": -85,
      "name": "Nicaragua",
      "code": "NI",
      "capital": "Managua"
    },
    {
      "timezones": [
        "Pacific/Niue"
      ],
      "lat": 19.03333333,
      "lon": -169.86666666,
      "name": "Niue",
      "code": "NU",
      "capital": "Alofi"
    },
    {
      "timezones": [
        "Europe/Amsterdam"
      ],
      "lat": 52.5,
      "lon": 5.75,
      "name": "Netherlands",
      "code": "NL",
      "capital": "Amsterdam"
    },
    {
      "timezones": [
        "Europe/Oslo"
      ],
      "lat": 62,
      "lon": 10,
      "name": "Norway",
      "code": "NO",
      "capital": "Oslo"
    },
    {
      "timezones": [
        "Asia/Kathmandu"
      ],
      "lat": 28,
      "lon": 84,
      "name": "Nepal",
      "code": "NP",
      "capital": "Kathmandu"
    },
    {
      "timezones": [
        "Pacific/Nauru"
      ],
      "lat": 0.53333333,
      "lon": 166.91666666,
      "name": "Nauru",
      "code": "NR",
      "capital": "Yaren"
    },
    {
      "timezones": [
        "Pacific/Auckland",
        "Pacific/Chatham"
      ],
      "lat": 41,
      "lon": 174,
      "name": "New Zealand",
      "code": "NZ",
      "capital": "Wellington"
    },
    {
      "timezones": [
        "Asia/Muscat"
      ],
      "lat": 21,
      "lon": 57,
      "name": "Oman",
      "code": "OM",
      "capital": "Muscat"
    },
    {
      "timezones": [
        "Asia/Karachi"
      ],
      "lat": 30,
      "lon": 70,
      "name": "Pakistan",
      "code": "PK",
      "capital": "Islamabad"
    },
    {
      "timezones": [
        "America/Panama"
      ],
      "lat": 9,
      "lon": -80,
      "name": "Panama",
      "code": "PA",
      "capital": "Panama City"
    },
    {
      "timezones": [
        "Pacific/Pitcairn"
      ],
      "lat": 25.06666666,
      "lon": -130.1,
      "name": "Pitcairn Islands",
      "code": "PN",
      "capital": "Adamstown"
    },
    {
      "timezones": [
        "America/Lima"
      ],
      "lon": -77.0428, "lat": -12.0464,
      "name": "Peru",
      "code": "PE",
      "capital": "Lima"
    },
    {
      "timezones": [
        "Asia/Manila"
      ],
      "lat": 13,
      "lon": 122,
      "name": "Philippines",
      "code": "PH",
      "capital": "Manila"
    },
    {
      "timezones": [
        "Pacific/Palau"
      ],
      "lat": 7.5,
      "lon": 134.5,
      "name": "Palau",
      "code": "PW",
      "capital": "Ngerulmud"
    },
    {
      "timezones": [
        "Pacific/Port_Moresby",
        "Pacific/Bougainville"
      ],
      "lat": 6,
      "lon": 147,
      "name": "Papua New Guinea",
      "code": "PG",
      "capital": "Port Moresby"
    },
    {
      "timezones": [
        "Europe/Warsaw"
      ],
      "lat": 52,
      "lon": 20,
      "name": "Poland",
      "code": "PL",
      "capital": "Warsaw"
    },
    {
      "timezones": [
        "America/Puerto_Rico"
      ],
      "lat": 18.25,
      "lon": -66.5,
      "name": "Puerto Rico",
      "code": "PR",
      "capital": "San Juan"
    },
    {
      "timezones": [
        "Asia/Pyongyang"
      ],
      "lat": 40,
      "lon": 127,
      "name": "North Korea",
      "code": "KP",
      "capital": "Pyongyang"
    },
    {
      "timezones": [
        "Europe/Lisbon",
        "Atlantic/Madeira",
        "Atlantic/Azores"
      ],
      "lat": 39.5,
      "lon": -8,
      "name": "Portugal",
      "code": "PT",
      "capital": "Lisbon"
    },
    {
      "timezones": [
        "America/Asuncion"
      ],
      "lon": -57.5759, "lat": -25.2637,
      "name": "Paraguay",
      "code": "PY",
      "capital": "Asunci\u00f3n"
    },
    {
      "timezones": [
        "Asia/Gaza",
        "Asia/Hebron"
      ],
      "lat": 31.9,
      "lon": 35.2,
      "name": "Palestine",
      "code": "PS",
      "capital": "Ramallah"
    },
    {
      "timezones": [
        "Pacific/Tahiti",
        "Pacific/Marquesas",
        "Pacific/Gambier"
      ],
      "lat": 15,
      "lon": -140,
      "name": "French Polynesia",
      "code": "PF",
      "capital": "Papeet\u0113"
    },
    {
      "timezones": [
        "Asia/Qatar"
      ],
      "lat": 25.5,
      "lon": 51.25,
      "name": "Qatar",
      "code": "QA",
      "capital": "Doha"
    },
    {
      "timezones": [
        "Indian/Reunion"
      ],
      "lat": 21.15,
      "lon": 55.5,
      "name": "R\u00e9union",
      "code": "RE",
      "capital": "Saint-Denis"
    },
    {
      "timezones": [
        "Europe/Bucharest"
      ],
      "lat": 46,
      "lon": 25,
      "name": "Romania",
      "code": "RO",
      "capital": "Bucharest"
    },
    {
      "timezones": [
        "Europe/Kaliningrad",
        "Europe/Moscow",
        "Europe/Simferopol",
        "Europe/Volgograd",
        "Europe/Kirov",
        "Europe/Astrakhan",
        "Europe/Samara",
        "Europe/Ulyanovsk",
        "Asia/Yekaterinburg",
        "Asia/Omsk",
        "Asia/Novosibirsk",
        "Asia/Barnaul",
        "Asia/Tomsk",
        "Asia/Novokuznetsk",
        "Asia/Krasnoyarsk",
        "Asia/Irkutsk",
        "Asia/Chita",
        "Asia/Yakutsk",
        "Asia/Khandyga",
        "Asia/Vladivostok",
        "Asia/Ust-Nera",
        "Asia/Magadan",
        "Asia/Sakhalin",
        "Asia/Srednekolymsk",
        "Asia/Kamchatka",
        "Asia/Anadyr"
      ],
      "lat": 60,
      "lon": 100,
      "name": "Russia",
      "code": "RU",
      "capital": "Moscow"
    },
    {
      "timezones": [
        "Africa/Kigali"
      ],
      "lat": 2,
      "lon": 30,
      "name": "Rwanda",
      "code": "RW",
      "capital": "Kigali"
    },
    {
      "timezones": [
        "Asia/Riyadh"
      ],
      "lat": 25,
      "lon": 45,
      "name": "Saudi Arabia",
      "code": "SA",
      "capital": "Riyadh"
    },
    {
      "timezones": [
        "Africa/Khartoum"
      ],
      "lat": 15,
      "lon": 30,
      "name": "Sudan",
      "code": "SD",
      "capital": "Khartoum"
    },
    {
      "timezones": [
        "Africa/Dakar"
      ],
      "lat": 14,
      "lon": -14,
      "name": "Senegal",
      "code": "SN",
      "capital": "Dakar"
    },
    {
      "timezones": [
        "Asia/Singapore"
      ],
      "lat": 1.36666666,
      "lon": 103.8,
      "name": "Singapore",
      "code": "SG",
      "capital": "Singapore"
    },
    {
      "timezones": [
        "Atlantic/South_Georgia"
      ],
      "lat": 54.5,
      "lon": -37,
      "name": "South Georgia",
      "code": "GS",
      "capital": "King Edward Point"
    },
    {
      "timezones": [
        "Arctic/Longyearbyen"
      ],
      "lat": 78,
      "lon": 20,
      "name": "Svalbard and Jan Mayen",
      "code": "SJ",
      "capital": "Longyearbyen"
    },
    {
      "timezones": [
        "Pacific/Guadalcanal"
      ],
      "lat": 8,
      "lon": 159,
      "name": "Solomon Islands",
      "code": "SB",
      "capital": "Honiara"
    },
    {
      "timezones": [
        "Africa/Freetown"
      ],
      "lat": 8.5,
      "lon": -11.5,
      "name": "Sierra Leone",
      "code": "SL",
      "capital": "Freetown"
    },
    {
      "timezones": [
        "America/El_Salvador"
      ],
      "lat": 13.83333333,
      "lon": -88.91666666,
      "name": "El Salvador",
      "code": "SV",
      "capital": "San Salvador"
    },
    {
      "timezones": [
        "Europe/San_Marino"
      ],
      "lat": 43.76666666,
      "lon": 12.41666666,
      "name": "San Marino",
      "code": "SM",
      "capital": "City of San Marino"
    },
    {
      "timezones": [
        "Africa/Mogadishu"
      ],
      "lat": 10,
      "lon": 49,
      "name": "Somalia",
      "code": "SO",
      "capital": "Mogadishu"
    },
    {
      "timezones": [
        "America/Miquelon"
      ],
      "lat": 46.83333333,
      "lon": -56.33333333,
      "name": "Saint Pierre and Miquelon",
      "code": "PM",
      "capital": "Saint-Pierre"
    },
    {
      "timezones": [
        "Europe/Belgrade"
      ],
      "lat": 44,
      "lon": 21,
      "name": "Serbia",
      "code": "RS",
      "capital": "Belgrade"
    },
    {
      "timezones": [
        "Africa/Juba"
      ],
      "lat": 7,
      "lon": 30,
      "name": "South Sudan",
      "code": "SS",
      "capital": "Juba"
    },
    {
      "timezones": [
        "Africa/Sao_Tome"
      ],
      "lat": 1,
      "lon": 7,
      "name": "S\u00e3o Tom\u00e9 and Pr\u00edncipe",
      "code": "ST",
      "capital": "S\u00e3o Tom\u00e9"
    },
    {
      "timezones": [
        "America/Paramaribo"
      ],
      "lon": -55.2038, "lat": 5.852,
      "name": "Suriname",
      "code": "SR",
      "capital": "Paramaribo"
    },
    {
      "timezones": [
        "Europe/Bratislava"
      ],
      "lat": 48.66666666,
      "lon": 19.5,
      "name": "Slovakia",
      "code": "SK",
      "capital": "Bratislava"
    },
    {
      "timezones": [
        "Europe/Ljubljana"
      ],
      "lat": 46.11666666,
      "lon": 14.81666666,
      "name": "Slovenia",
      "code": "SI",
      "capital": "Ljubljana"
    },
    {
      "timezones": [
        "Europe/Stockholm"
      ],
      "lat": 62,
      "lon": 15,
      "name": "Sweden",
      "code": "SE",
      "capital": "Stockholm"
    },
    {
      "timezones": [
        "Africa/Mbabane"
      ],
      "lat": 26.5,
      "lon": 31.5,
      "name": "Swaziland",
      "code": "SZ",
      "capital": "Lobamba"
    },
    {
      "timezones": [
        "America/Lower_Princes"
      ],
      "lat": 18.033333,
      "lon": -63.05,
      "name": "Sint Maarten",
      "code": "SX",
      "capital": "Philipsburg"
    },
    {
      "timezones": [
        "Indian/Mahe"
      ],
      "lat": 4.58333333,
      "lon": 55.66666666,
      "name": "Seychelles",
      "code": "SC",
      "capital": "Victoria"
    },
    {
      "timezones": [
        "Asia/Damascus"
      ],
      "lat": 35,
      "lon": 38,
      "name": "Syria",
      "code": "SY",
      "capital": "Damascus"
    },
    {
      "timezones": [
        "America/Grand_Turk"
      ],
      "lat": 21.75,
      "lon": -71.58333333,
      "name": "Turks and Caicos Islands",
      "code": "TC",
      "capital": "Cockburn Town"
    },
    {
      "timezones": [
        "Africa/Ndjamena"
      ],
      "lat": 15,
      "lon": 19,
      "name": "Chad",
      "code": "TD",
      "capital": "N'Djamena"
    },
    {
      "timezones": [
        "Africa/Lome"
      ],
      "lat": 8,
      "lon": 1.16666666,
      "name": "Togo",
      "code": "TG",
      "capital": "Lom\u00e9"
    },
    {
      "timezones": [
        "Asia/Bangkok"
      ],
      "lat": 15,
      "lon": 100,
      "name": "Thailand",
      "code": "TH",
      "capital": "Bangkok"
    },
    {
      "timezones": [
        "Asia/Dushanbe"
      ],
      "lat": 39,
      "lon": 71,
      "name": "Tajikistan",
      "code": "TJ",
      "capital": "Dushanbe"
    },
    {
      "timezones": [
        "Pacific/Fakaofo"
      ],
      "lat": 9,
      "lon": -172,
      "name": "Tokelau",
      "code": "TK",
      "capital": "Fakaofo"
    },
    {
      "timezones": [
        "Asia/Ashgabat"
      ],
      "lat": 40,
      "lon": 60,
      "name": "Turkmenistan",
      "code": "TM",
      "capital": "Ashgabat"
    },
    {
      "timezones": [
        "Asia/Dili"
      ],
      "lat": 8.83333333,
      "lon": 125.91666666,
      "name": "Timor-Leste",
      "code": "TL",
      "capital": "Dili"
    },
    {
      "timezones": [
        "Pacific/Tongatapu"
      ],
      "lat": 20,
      "lon": -175,
      "name": "Tonga",
      "code": "TO",
      "capital": "Nuku'alofa"
    },
    {
      "timezones": [
        "America/Port_of_Spain"
      ],
      "lat": 11,
      "lon": -61,
      "name": "Trinidad and Tobago",
      "code": "TT",
      "capital": "Port of Spain"
    },
    {
      "timezones": [
        "Africa/Tunis"
      ],
      "lat": 34,
      "lon": 9,
      "name": "Tunisia",
      "code": "TN",
      "capital": "Tunis"
    },
    {
      "timezones": [
        "Europe/Istanbul"
      ],
      "lat": 39,
      "lon": 35,
      "name": "Turkey",
      "code": "TR",
      "capital": "Ankara"
    },
    {
      "timezones": [
        "Pacific/Funafuti"
      ],
      "lat": 8,
      "lon": 178,
      "name": "Tuvalu",
      "code": "TV",
      "capital": "Funafuti"
    },
    {
      "timezones": [
        "Asia/Taipei"
      ],
      "lat": 23.5,
      "lon": 121,
      "name": "Taiwan",
      "code": "TW",
      "capital": "Taipei"
    },
    {
      "timezones": [
        "Africa/Dar_es_Salaam"
      ],
      "lat": 6,
      "lon": 35,
      "name": "Tanzania",
      "code": "TZ",
      "capital": "Dodoma"
    },
    {
      "timezones": [
        "Africa/Kampala"
      ],
      "lat": 1,
      "lon": 32,
      "name": "Uganda",
      "code": "UG",
      "capital": "Kampala"
    },
    {
      "timezones": [
        "Europe/Kiev",
        "Europe/Uzhgorod",
        "Europe/Zaporozhye"
      ],
      "lat": 49,
      "lon": 32,
      "name": "Ukraine",
      "code": "UA",
      "capital": "Kiev"
    },
    {
      "timezones": [
        "Pacific/Johnston",
        "Pacific/Midway",
        "Pacific/Wake"
      ],
      "lat": 19.2911437,
      "lon": 166.618332,
      "name": "United States Minor Outlying Islands",
      "code": "UM",
      "capital": null
    },
    {
      "timezones": [
        "America/Montevideo"
      ],
      "lon": -56.1645, "lat": -34.9011,
      "name": "Uruguay",
      "code": "UY",
      "capital": "Montevideo"
    },
    {
      "timezones": [
        "America/New_York",
        "America/Detroit",
        "America/Kentucky/Louisville",
        "America/Kentucky/Monticello",
        "America/Indiana/Indianapolis",
        "America/Indiana/Vincennes",
        "America/Indiana/Winamac",
        "America/Indiana/Marengo",
        "America/Indiana/Petersburg",
        "America/Indiana/Vevay",
        "America/Chicago",
        "America/Indiana/Tell_City",
        "America/Indiana/Knox",
        "America/Menominee",
        "America/North_Dakota/Center",
        "America/North_Dakota/New_Salem",
        "America/North_Dakota/Beulah",
        "America/Denver",
        "America/Boise",
        "America/Phoenix",
        "America/Los_Angeles",
        "America/Anchorage",
        "America/Juneau",
        "America/Sitka",
        "America/Metlakatla",
        "America/Yakutat",
        "America/Nome",
        "America/Adak",
        "Pacific/Honolulu"
      ],
      "lat": 38,
      "lon": -97,
      "name": "United States",
      "code": "US",
      "capital": "Washington D.C."
    },
    {
      "timezones": [
        "Asia/Samarkand",
        "Asia/Tashkent"
      ],
      "lat": 41,
      "lon": 64,
      "name": "Uzbekistan",
      "code": "UZ",
      "capital": "Tashkent"
    },
    {
      "timezones": [
        "Europe/Vatican"
      ],
      "lat": 41.9,
      "lon": 12.45,
      "name": "Vatican City",
      "code": "VA",
      "capital": "Vatican City"
    },
    {
      "timezones": [
        "America/St_Vincent"
      ],
      "lat": 13.25,
      "lon": -61.2,
      "name": "Saint Vincent and the Grenadines",
      "code": "VC",
      "capital": "Kingstown"
    },
    {
      "timezones": [
        "America/Caracas"
      ],
      "lon": -66.9036, "lat": 10.4806,
      "name": "Venezuela",
      "code": "VE",
      "capital": "Caracas"
    },
    {
      "timezones": [
        "America/Tortola"
      ],
      "lat": 18.431383,
      "lon": -64.62305,
      "name": "British Virgin Islands",
      "code": "VG",
      "capital": "Road Town"
    },
    {
      "timezones": [
        "America/St_Thomas"
      ],
      "lat": 18.35,
      "lon": -64.933333,
      "name": "United States Virgin Islands",
      "code": "VI",
      "capital": "Charlotte Amalie"
    },
    {
      "timezones": [
        "Asia/Ho_Chi_Minh"
      ],
      "lat": 16.16666666,
      "lon": 107.83333333,
      "name": "Vietnam",
      "code": "VN",
      "capital": "Hanoi"
    },
    {
      "timezones": [
        "Pacific/Efate"
      ],
      "lat": 16,
      "lon": 167,
      "name": "Vanuatu",
      "code": "VU",
      "capital": "Port Vila"
    },
    {
      "timezones": [
        "Pacific/Wallis"
      ],
      "lat": 13.3,
      "lon": -176.2,
      "name": "Wallis and Futuna",
      "code": "WF",
      "capital": "Mata-Utu"
    },
    {
      "timezones": [
        "Pacific/Apia"
      ],
      "lat": 13.58333333,
      "lon": -172.33333333,
      "name": "Samoa",
      "code": "WS",
      "capital": "Apia"
    },
    {
      "timezones": [
        "Asia/Aden"
      ],
      "lat": 15,
      "lon": 48,
      "name": "Yemen",
      "code": "YE",
      "capital": "Sana'a"
    },
    {
      "timezones": [
        "Africa/Johannesburg"
      ],
      "lat": 29,
      "lon": 24,
      "name": "South Africa",
      "code": "ZA",
      "capital": "Pretoria"
    },
    {
      "timezones": [
        "Africa/Lusaka"
      ],
      "lat": 15,
      "lon": 30,
      "name": "Zambia",
      "code": "ZM",
      "capital": "Lusaka"
    },
    {
      "timezones": [
        "Africa/Harare"
      ],
      "lat": 20,
      "lon": 30,
      "name": "Zimbabwe",
      "code": "ZW",
      "capital": "Harare"
    }
  ]

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
        if (country === 'us' || debug === true) {
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
        if (country === "us" || debug === true) {
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

