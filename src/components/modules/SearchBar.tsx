/* eslint-disable no-use-before-define */
import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { StoreContainer } from '../Store';


// ISO 3166-1 alpha-2
// ⚠️ No support for IE 11
function countryToFlag(isoCode: any) {
  return typeof String.fromCodePoint !== 'undefined'
    ? isoCode
      .toUpperCase()
      .replace(/./g, (char: any) => String.fromCodePoint(char.charCodeAt(0) + 127397))
    : isoCode;
}


/**
 * Search bar component to select a country and display its stats in /stats url
 */
export default function SearchBar() {
  const unstated = StoreContainer.useContainer();
  let textInput = "";

  const handleChange = (e: any, values: any) => {
    if (values) {
      unstated.setCountry(values.name);
      unstated.setCode(values.code);
    } else {
      unstated.setCountry("");
      unstated.setCode("");
    }
  }


  return (
    <Autocomplete
      id="country-select"
      options={unstated.country_list}
      autoHighlight
      getOptionLabel={(option) => option.name}
      renderOption={(option) => (
        <React.Fragment>
          <span>{countryToFlag(option.code)}</span>
          {option.name} ({option.code})
        </React.Fragment>
      )}
      onChange={handleChange}
      renderInput={(params) => (
        <TextField
          style={{ backgroundColor: 'white', borderRadius: 5, width: 300 }}
          {...params}
          label="Choose a country"
          variant="outlined"
          size="small"
          inputProps={{
            ...params.inputProps,
          }}
          value={textInput}
        />
      )
      }
    />
  );
}


