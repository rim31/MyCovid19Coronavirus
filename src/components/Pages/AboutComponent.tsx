import React from 'react'
import { StoreContainer } from '../Store';
import Dashboard from '../Charts/Dashboard';
import MapChart from '../Map/MapChart';

export default function AboutComponent() {
  const unstated = StoreContainer.useContainer();
  const [content, setContent] = React.useState("");

  React.useEffect(() => {
    unstated.getTotal();// fetching data => the can call unstated.total, unstated.getCovid19All for the markers
    // eslint-disable-next-line
  }, [])

  return (
    <div style={{ backgroundColor: "black" }}>
      <Dashboard data={unstated.total}
        content={content ? content : ''}
        style={{ position: "absolute", zIndex: 100 }}
      />
      <MapChart setTooltipContent={setContent} />
    </div>
  )
}
