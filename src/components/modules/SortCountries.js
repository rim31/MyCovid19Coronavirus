export default function SortCountries(key, order = 'asc') {
  return function innerSort(a, b) {
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

// use it : 

    // array is sorted by TotalConfirmed, in ascending order by default
    // setData((data).sort(compareValues('TotalConfirmed')));
    // (data).sort(compareValues('TotalConfirmed', 'desc'));
    // // array is sorted by TotalConfirmed in descending order
    // (data).sort(compareValues('TotalConfirmed', 'desc'));
    // // array is sorted by Country name in ascending order
    // (data).sort(compareValues('Country'));
    // // array is sorted by Country name in descending order
    // (data).sort(compareValues('Country', 'desc'));

    // ('list countries', props.data.Countries)
    // _.filter(props.data.Countries, function (i: any) {
    //   return i.CountryCode === unstated.code.toUpperCase();
    // });