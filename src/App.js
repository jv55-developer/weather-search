import "./App.scss";
import { useState } from "react";
import axios from "axios";
import buildings from "./assets/buildings.png";
import radio from "./assets/radio-button.png";
import radio_alt from "./assets/radio.png";
import { ThreeCircles } from "react-loader-spinner";

function App() {
  const [location, setLocation] = useState("");
  const [locationOptions, setLocationOptions] = useState([]);
  const [ uniqueLat, setUniqueLat ] = useState('')
  const [weather, setWeather] = useState([]);
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [checking, setChecking] = useState(false);
  const config = {
    headers: {
      "X-Api-Key": process.env.REACT_APP_GEOCODE_X_API_KEY,
    },
  };

  const openWeatherKey = process.env.REACT_APP_OPEN_WEATHER_KEY;

  const handleLatLon = (e) => {
    e.preventDefault();
    setChecking(true);

    setLocationOptions([]);
    setWeather([]);

    // Get latitude and longitude
    axios
      .get(`https://api.api-ninjas.com/v1/geocoding?city=${location}`, config)
      .then((res) => {
        setLocationOptions(res.data.slice(0, 4));
        setChecking(false);
        setLocation("");
      });
  };

  const handleRadioButton = (lat, lon, city, province) => {
    setUniqueLat(lat)

    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${openWeatherKey}`
      )
      .then((res) => {
        console.log(res.data);
        setWeather(res.data);
        setCity(city);
        setProvince(province);
      });
  };

  return (
    <div className="weather-container py-2">
      <div className="container bg-white p-5 rounded-soft ">
        <div className="row">
          <div className="col">
            {/* Form */}
            <form onSubmit={(e) => handleLatLon(e)} className="mb-5">
              <div className="mb-3">
                <label className="form-label">Enter your city</label>
                <input
                  type="text"
                  className="form-control rounded-pill"
                  placeholder="e.g. London"
                  value={location}
                  required
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <div className="mb-3">
                {!checking && (
                  <button className="btn btn-purple rounded-pill">
                    Check Weather
                  </button>
                )}
                {checking && (
                  <button
                    disabled
                    type="submit"
                    className="btn btn-purple rounded-pill"
                  >
                    <ThreeCircles
                      height="20"
                      width="20"
                      color="#ffffff"
                      ariaLabel="three-circles-rotating"
                      radius="1"
                      wrapperStyle={{ display: "inline" }}
                      visible={true}
                    />{" "}
                    Checking
                  </button>
                )}
              </div>
            </form>

            {/* Location Option cards */}
            {locationOptions.map((item) => {
              return (
                (
                  <div
                    className="location-card px-3 py-2 mb-4"
                    key={item.latitude}
                  >
                    <div className="first-section">
                      <img
                        src={buildings}
                        alt="animated location graphic"
                        className="img-responsive img-city my-auto"
                      />
                      <div className="mx-4">
                        <p>
                          {item.name}
                          <br />
                          {item.state}
                          <br />
                          {item.country}
                        </p>
                      </div>
                    </div>
                    <img
                      onClick={() => {
                        handleRadioButton(
                          item.latitude,
                          item.longitude,
                          item.name,
                          item.state
                        )                        
                      }}
                      src={uniqueLat === item.latitude ? radio_alt : radio}
                      alt="animated location graphic"
                      className="img-responsive img-radio my-auto"
                    />
                  </div>
                )
              );
            })}
          </div>
          <div className="col location-container">
            {Object.keys(weather).length > 0 && (
              <>
                <div
                  className={`${weather.weather[0].main.toLowerCase()} weather-image`}
                ></div>
                <div className="p-4">
                  <h3>{city}</h3>
                  <h5>{province}</h5>
                  <hr />
                  <table className="table table-borderless">
                    <tbody>
                      <tr>
                        <td className="fw-bold">Weather</td>
                        <td>{weather.weather[0].main}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Description</td>
                        <td>{weather.weather[0].description}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Current Temp.</td>
                        <td>{weather.main.temp}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Min Temp.</td>
                        <td>{weather.main.temp_min}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Max Temp.</td>
                        <td>{weather.main.temp_max}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Air pressure</td>
                        <td>{weather.main.pressure}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Humdidity</td>
                        <td>{weather.main.humidity}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Wind speed</td>
                        <td>{weather.wind.speed}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
