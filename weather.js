var el = document.getElementById("showName");
el.addEventListener("click", formatName, false);

function formatName () {
  var name = document.getElementById('fname').value;

  document.getElementById('fullName').innerHTML = "Hi " + name; 
}


var options = {
  enableHighAccuracy: true,
  timeout: 80000,
  maximumAge: 0
};

var error = function(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
}

var getDate = function () {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();

  today = mm + '/' + dd + '/' + yyyy;
  return today
}

var ToCelsius = function (temp) {
  celsius = (temp - 32) * (5 / 9);
  return Math.floor(celsius);
};

var setIcons = function(icon, iconID) {
  const skycons = new Skycons({color: "white"});
  const currentIcon = icon.replace(/-/g, "_").toUpperCase();
  skycons.play();
  return skycons.set(iconID, Skycons[currentIcon]);
};

window.addEventListener('load', function() {
  var CurrentDate = document.querySelector(".Date");
  var location = document.querySelector(".Location-Timezone");
  var temperatureDescription = document.querySelector(".Temperature-Description");
  var temperatureDegree = document.querySelector(".Degree");
  var temperatureSection = document.querySelector(".Temperature-Section");
  const temperaturespan = document.querySelector(".Temperature-Section span");

  CurrentDate.textContent = getDate();

  if (navigator.geolocation) {

    // Obtain geolocation
    var geoloc = function(position) {
      var long = position.coords.longitude;
      var lat = position.coords.latitude;
      // const api = `http://api.openweathermap.org/data/2.5/find?lat=${lat}&lon=${long}&cnt=1&appid=9127a894a9e2c98639ed5ca00991a2c7`;
      const proxy = "https://cors-anywhere.herokuapp.com/"
      const api = `${proxy}https://api.darksky.net/forecast/68caf3cad151571d05b5843c6cb4eb88/${lat},${long}`;

      // Fetch weather data
      fetch(api)
      .then (weather => {
        return weather.json();
      })
      .then(data => {
        const {temperature, summary, icon} = data.currently;

        // Set DOM elements from API
        if (summary.includes("Cloudy") || summary.includes("Overcast")) {
          document.getElementById('myVideo').setAttribute("src", "../videos/cloud.mp4");
          document.getElementById('myVideo').load();
          document.getElementById('myVideo').play();
        }
        else if (summary.includes("Drizzle") || summary.includes("Rain")) {
          document.getElementById('myVideo').setAttribute("src", "../videos/rain.mp4");
          document.getElementById('myVideo').load();
          document.getElementById('myVideo').play();
        }
        else if (summary.includes("Snow")) {
          document.getElementById('myVideo').setAttribute("src", "../videos/snowflake.mp4");
          document.getElementById('myVideo').load();
          document.getElementById('myVideo').play();
        }
        else {
          document.getElementById('myVideo').setAttribute("src", "../videos/sun.mp4");
          document.getElementById('myVideo').load();
          document.getElementById('myVideo').play();
        }

        temperatureDegree.textContent = temperature;
        temperatureDescription.textContent = summary;
        location.textContent = data.timezone;

        // Set icons
        setIcons(icon, document.querySelector(".icon"));

        // Convert to celsius on click
        temperatureSection.addEventListener("click", () => {
          if (temperaturespan.textContent === "F") {
            temperaturespan.textContent = "C";
            temperatureDegree.textContent = ToCelsius(temperature);
          } else {
            temperaturespan.textContent = "F";
            temperatureDegree.textContent = temperature;
          }
        });
      });
    }
    navigator.geolocation.getCurrentPosition(geoloc, error, options);
  } else {
    console.log("Please install live service to simulate environment.")
  };
});



