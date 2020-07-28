import React from 'react';
import { Line } from 'react-chartjs-2';
import { StoreContainer } from '../Store';

export default function LinearChart(props: any) {
  const unstated = StoreContainer.useContainer();
  const data = {
    labels: props.labelsCountry,
    datasets: [
      {
        label: `COVID-19 ${unstated.code.toUpperCase()} ${props.labelsCountry[0]}`,
        data: props.dataCountry,
        backgroundColor: "pink"
      }
    ]
  }
  const options = {
    legend: { display: true },
    // responsive: true,
    // maintainAspectRatio: true,
  }
  return (
    <div style={{ backgroundColor: "whitesmoke" }}>
      <Line data={data} options={options} />
    </div>
  );
}
