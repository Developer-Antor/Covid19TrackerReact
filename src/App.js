import React, { useState, useEffect } from "react";
import "./App.css";
import Box from "./Components/Box";
import axios from "axios";
import { Card, CardContent } from "@material-ui/core";
import { FormControl, MenuItem, Select } from "@material-ui/core";
import Table from "./Components/Table";
import { sortData } from "./Components/Util";
import LineGraph from "./Components/LineGraph";
import "leaflet/dist/leaflet.css";
import numeral from "numeral";
function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [casesType, setcasesType] = useState("cases");
  const [color, setColor] = useState("#fff");

  useEffect(() => {
    const primaryCountryInfo = axios
      .get("https://disease.sh/v3/covid-19/all")
      .then((res) => {
        setCountryInfo(res.data);
        console.log(res.data);
      });
    return () => {
      return primaryCountryInfo;
    };
  }, []);

  useEffect(() => {
    const getCountriesData = axios
      .get("https://disease.sh/v3/covid-19/countries")
      .then((response) => {
        let countryList = response.data;
        const countries = countryList.map((country) => {
          return { name: country.country, value: country.countryInfo.iso2 };
        });
        const sortedData = sortData(response.data);
        setCountries(countries);
        setTableData(sortedData);
      });

    return getCountriesData;
  }, []);

  const onCountryChange = (event) => {
    const countryCode = event.target.value;
    setCountry(countryCode);
    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    axios.get(url).then((res) => {
      setCountryInfo(countryCode);
      setCountryInfo(res.data);
    });
  };

  return (
    <div className="App">
      <div className="app-left">
        <div className="header">
          <h1>COVID-19 TRACKER</h1>
          <FormControl className="header-dropdown">
            <Select
              variant="outlined"
              onChange={onCountryChange}
              value={country}
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((country) => {
                return (
                  <MenuItem value={country.value}>{country.name}</MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </div>
        <div style={{ marginTop: "1rem", textAlign: "center" }}>
          Click on any card to see graph below.
        </div>
        <div className="app-stats">
          <Box
            className="mybox1"
            onClick={(e) => {
              setColor("#f0eeee");
              setcasesType("cases");
            }}
            title="Coronavirus Cases"
            cases={numeral(countryInfo.todayCases).format("0a")}
            total={numeral(countryInfo.cases).format("0.0a")}
          ></Box>
          <Box
            className="mybox2"
            onClick={(e) => {
              setColor("#f0eeee");
              setcasesType("recovered");
            }}
            title="Recovered"
            cases={numeral(countryInfo.todayRecovered).format("0a")}
            total={numeral(countryInfo.recovered).format("0.0a")}
          ></Box>
          <Box
            className="mybox3"
            onClick={(e) => {
              setColor("#f0eeee");
              setcasesType("deaths");
            }}
            title="Deaths"
            cases={numeral(countryInfo.todayDeaths).format("0a")}
            total={numeral(countryInfo.deaths).format("0.0a")}
          ></Box>
        </div>
      </div>

      <Card className="app-right">
        <CardContent>
          <h3 className="card-title">Live Cases By Country</h3>
          <Table countries={tableData}></Table>
          <h3 className="card-title">Worldwide new {casesType}</h3>
          <LineGraph casesType={casesType}></LineGraph>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
