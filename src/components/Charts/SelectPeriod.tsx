import React from 'react'
import moment from 'moment';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

export default function SelectPeriod(props: any) {
  const [period, setPeriod] = React.useState<string>("last month")

  const handleChange = (event: any) => {
    setPeriod(event.target.value);
    switch (event.target.value) {
      case "last week":
        props.setDates(`${moment().subtract(1, 'weeks').format('YYYY-MM-DDT00:00:00')}`);
        break;
      case "last 2 weeks":
        props.setDates(`${moment().subtract(2, 'weeks').format('YYYY-MM-DDT00:00:00')}`);
        break;
      case "last month":
        props.setDates(`${moment().subtract(1, 'months').format('YYYY-MM-DDT00:00:00')}`);
        break;
      case "last 2 months":
        props.setDates(`${moment().subtract(2, 'months').format('YYYY-MM-DDT00:00:00')}`);
        break;
      case "last 4 months":
        props.setDates(`${moment().subtract(4, 'months').format('YYYY-MM-DDT00:00:00')}`);
        break;
      case "last 6 months":
        props.setDates(`${moment().subtract(6, 'months').format('YYYY-MM-DDT00:00:00')}`);
        break;
      case "since January 2020":
        props.setDates(`${moment().subtract(1, 'years').format('YYYY-MM-DDT00:00:00')}`);
        break;
      default:
        props.setDates(`${moment().subtract(5, 'days').format('YYYY-MM-DDT00:00:00')}`);
        break;
    }
  }

  return (
    <>
      <InputLabel className="pt-2 pb-0 mb-0" style={{ color: "white" }}>Period</InputLabel>
      <Select
        labelId="demo-simple-select-filled-label"
        id="demo-simple-select-filled"
        value={period}
        defaultValue={"last month"}
        onChange={handleChange}
        className="ml-1 mb-2"
        style={{ backgroundColor: 'white', borderRadius: 5, width: "auto", paddingLeft: "1px" }}
      >
        <MenuItem value={"last month"} >last month</MenuItem>
        <MenuItem value={"last week"} >last week</MenuItem>
        <MenuItem value={"last 2 weeks"} >last 2 weeks</MenuItem>
        <MenuItem value={"last 2 months"} >last 2 months</MenuItem>
        <MenuItem value={"last 4 months"} >last 4 months</MenuItem>
        <MenuItem value={"last 6 months"} >last 6 months</MenuItem>
        <MenuItem value={"since January 2020"} >since January 2020</MenuItem>
      </Select>
    </>
  )
}
