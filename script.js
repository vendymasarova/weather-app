const api = {
  key: "7e899a6bac8e971b5d493c29dfe5b62c",
  base: "https://api.openweathermap.org/data/2.5/",
};

const searchbox = document.querySelector(".search-box");
searchbox.addEventListener("keypress", setQuery);

function setQuery(evt) {
  if (evt.keyCode == 13) {
    getResults(searchbox.value);
    getForecast(searchbox.value);
  }
}

function getForecast(query) {
  fetch(`${api.base}forecast?q=${query}&units=metric&APPID=${api.key}`).then(
    (weather) => {
      weather.json().then((forecast) => {
        let days = [
          forecast.list[0],
          forecast.list[8],
          forecast.list[16],
          forecast.list[24],
          forecast.list[32],
        ];
        let containers = document.querySelectorAll(".forecast-wrap main");
        for (let index = 0; index < days.length; index++) {
          const day = days[index];
          const container = containers[index];
          const date = dateBuilder(new Date(day.dt * 1000));
          container.querySelector(".date").innerText = date;
          const temp = day.main.temp;
          container.querySelector(".temp").innerHTML = `${Math.round(
            temp
          )}<span>°c<span>`;
          const mainWeather = day.weather[0].description;
          container.querySelector(".weather").innerHTML = mainWeather;
        }
      });
    }
  );
}

function getResults(query) {
  fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`)
    .then((weather) => {
      return weather.json();
    })
    .then(displayResults);
}

function displayResults(weather) {
  let city = document.querySelector(".location .city");
  city.innerText = `${weather.name}, ${weather.sys.country}`;

  let now = new Date();
  let date = document.querySelector(".location .date");
  date.innerText = dateBuilder(now);

  let temp = document.querySelector("main .current .temp");
  temp.innerHTML = `${Math.round(weather.main.temp)}<span>°c</span>`;
  //   let tempForecast = document.querySelector(".forecast-wrap .current .temp");
  //   tempForecast.innerHTML = `${Math.round(weather.main.temp)}<span>°c</span>`;

  let weather_el = document.querySelector(".current .weather");
  weather_el.innerText = weather.weather[0].description;
}

function dateBuilder(d) {
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let day = days[d.getDay()];
  let date = d.getDate();
  let month = months[d.getMonth()];
  let year = d.getFullYear();

  return `${day} ${date} ${month} ${year}`;
}

//Našeptávač city.list.json

let cities = [];
fetch("city.list.json")
  .then((blob) => blob.json())
  .then((data) => (cities = data.map((it) => it.name)));

const suggestionsPanel = document.querySelector(".suggestions");

searchbox.addEventListener("keyup", function () {
  const input = searchbox.value;

  if (input === undefined || input === "") {
    return;
  }

  suggestionsPanel.innerHTML = "";
  const suggestions = cities.filter(function (country) {
    return country.toLowerCase().startsWith(input);
  });
  suggestions.slice(0, 5).forEach(function (suggested) {
    const div = document.createElement("option");
    div.innerHTML = suggested;
    suggestionsPanel.appendChild(div);
  });
});
