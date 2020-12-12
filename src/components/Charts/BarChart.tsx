
import React from 'react';
import { Bar } from 'react-chartjs-2';
// import Chart from 'react-chartjs-2';

export default function BarChart(props: any) {
  const data = {
    labels: props.labelsCountry,
    datasets: [
      {
        label: `COVID-19 ${props.country}`,
        data: props.dataCountry,
        color: "rgba(255,0,255,0,75)",
        backgroundColor: "#ffc107"
      }
    ],
    options: {
      legend: {
        display: true
      },
      title: {
        display: true,
        text: `World stats : ${props.labelsCountry[0]} - covid19`,
        fontColor: 'whitesmoke',
      },
    }
  }

  React.useEffect(() => {

  }, [])

  return (
    <>
      <Bar data={data} />
    </>
  );
}
