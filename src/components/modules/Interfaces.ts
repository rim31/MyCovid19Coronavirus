
export interface ICountryData {
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

export interface IGlobalData {
  NewConfirmed: Number,
  NewDeaths: Number,
  NewRecovered: Number,
  TotalConfirmed: Number,
  TotalDeaths: Number,
  TotalRecovered: Number
}

export interface ICountry {
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

export interface IDataCovid {
  country: string,
  cases: number,
  deaths: number,
  recovered: number,
  last_update: Date
}

export interface ICountries {
  timezones: string[],
  latlon?: string[],
  lat?: number,
  lon?: number,
  name: string,
  code: string,
  capital: string
}
