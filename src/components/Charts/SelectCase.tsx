import React from 'react'
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
export default function SelectCase(props: any) {

  const handleChange = (event: any) => {
    props.setCases(event.target.value);
  }

  return (
    // <div className="control" >
    //   <select className="select is-primary" value={props.cases} onChange={handleChange}>
    //     <option value="confirmed">confirmed</option>
    //     <option value="deaths">deaths</option>
    //     <option value="recovered">recovered</option>
    //   </select>
    // </div >
    <>
      <InputLabel className="pt-2 pb-0 mb-0" style={{ color: "white" }}>Cases</InputLabel>
      <Select
        labelId="demo-simple-select-filled-label"
        id="demo-simple-select-filled"
        value={props.cases}
        defaultValue={"confirmed"}
        onChange={handleChange}
        className="ml-1"
        style={{ backgroundColor: 'white', borderRadius: 5, width: "auto", paddingLeft: "1px" }}
      >
        <MenuItem value={"confirmed"}>confirmed</MenuItem>
        <MenuItem value={"deaths"}>deaths</MenuItem>
        <MenuItem value={"recovered"}>recovered</MenuItem>
      </Select>
    </>

  )
}
