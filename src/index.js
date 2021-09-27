import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import axios from 'axios';

const baseURL = axios.create({
  baseURL: 'https://api.coronavirus.data.gov.uk/v1/data?filters=area'
          + 'Type=nation;areaName=england&structure='
          + '{"date":"date",'
          + '"totalCases":"cumCasesByPublishDate",'
          + '"totalDeaths":"cumDeaths28DaysByPublishDate"}'
})

function DataDisplay(props) {
  return (
    <div className="data-display">
      <h2>{props.dataName}</h2>
      <br />
      <h3>{props.data}</h3>
    </div>
  );
}

function TitleDisplay(props) {
  return(
    <div className="graph-display">
      <h1>COVID-19 Statistics</h1>
      <h2>{props.data}</h2>
    </div>
  );
}

function App() {
  const [graphData, getGraphData] = useState('Loading...');
  const [deaths, getDeaths] = useState('Loading...');
  const [infections, getInfections] = useState('Loading...');
  const [error, setError] = useState(null);

  useEffect(() => {
    baseURL.get()
    .then(res => {
      const data = res.data.data[0];
      const today = JSON.stringify(data.date).replaceAll('"','');
      const infectionData = JSON.stringify(data.totalCases).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      const deathsData = JSON.stringify(data.totalDeaths).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

      getGraphData(today);
      getInfections(infectionData);
      getDeaths(deathsData);

    })
    .catch(err => {
      setError(err);
    });
  }, []);

  if (error) {
    return 'Error: '+ {error};
  } 
  
  return (
    <div>
      <div className="row">
        <TitleDisplay data={graphData}/>
      </div>
      
      <br />

      <div className="row">
        <DataDisplay data={infections} dataName="Infections"/>
        <DataDisplay data={deaths} dataName="Deaths"/>
      </div>
    </div>
  );
}


ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

