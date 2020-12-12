import React from 'react';
// import { Line } from 'react-chartjs-2';
import { Bar } from 'react-chartjs-2';
import { StoreContainer } from '../Store';

export default function LinearChart(props: any) {
  const unstated = StoreContainer.useContainer();
  const data = {
    labels: props.labelsCountry,
    datasets: [
      {
        label: `COVID-19 ${unstated.code.toUpperCase()} ${props.labelsCountry[0]}`,
        data: props.dataCountry,
        backgroundColor: "red",
        color: "rgba(255,0,255,0,75)",
        hoverBackgroundColor: "rgba(232,105,90,0.8)",
      }
    ]
  }
  const options = {
    legend: {
      display: true,
      fontColor: 'whitesmoke'
    },
    title: {
      display: true,
      text: `${unstated.country.toUpperCase()} ${props.labelsCountry[0]} - covid19`,
      fontColor: 'whitesmoke',
    },
    scales: {
      yAxes: [{
        ticks: {
          fontColor: "white",
          fontSize: 18,
          color: "rgba(2, 2, 2, 0.1)"
        }
      }],
      xAxes: [{
        ticks: {
          fontColor: "white",
          fontSize: 14,
        }
      }]
    }
    // responsive: true,
    // maintainAspectRatio: true,
  }
  return (
    <div style={{ backgroundColor: "#555555" }}>
      <Bar data={data} options={options} />
      {/* <Line data={data} options={options} /> */}
    </div>
  );
}
