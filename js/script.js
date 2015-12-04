$(document).ready(function () {

    $("<h4>", {
        text: "Please enter a valid zip code to optain the current local weather."
    }).insertBefore("#form");

    weatherApp = {

        $targetArea: $("#weather"),

        weatherApiKey: "",

        localStorageKey: "openWeatherApi",

        getFormData: function () {
            if (weatherApp.weatherApiKey === null || weatherApp.weatherApiKey === "") {
                weatherApp.weatherApiKey = $("#apikey").val().trim();
                weatherApp.saveApiKey();
            }

            var zip = $("#zip").val().trim();

            if (zip === null || zip === "") {
                weatherApp.$targetArea.html("Zip Code cannot be blank.");
            } else if (zip.length < 5) {
                weatherApp.$targetArea.html("Zip Code must be at least 5 numbers.");
            } else if (zip.length > 5) {
                weatherApp.$targetArea.html("Zip Code cannot be greater than 5 numbers.");
            } else if (zip.length === 5) {
                weatherApp.getWeatherData(zip);
            }
        },

        getWeatherData: function (zipcode) {

            var url = "http://api.openweathermap.org/data/2.5/weather?zip=" + zipcode + ",us&appid=" + weatherApp.weatherApiKey + "&units=imperial";

            $.getJSON(url, function (data) {

                if (data.cod === 200) {
                    weatherApp.displayData(data);
                } else {
                    weatherApp.$targetArea.html("Sorry, no weather data available. Try again later");
                }
            }).fail(function () {
                weatherApp.$targetArea.html("Sorry, no weather data available. Try again later");
            });

        },

        loadApiKey: function () {
            if (typeof (localStorage) === "undefined") {
                weatherApp.$targetArea.html("Sorry, local storage is not supported for this browser.");
            } else {
                weatherApp.weatherApiKey = localStorage.getItem(weatherApp.localStorageKey);
                if (weatherApp.weatherApiKey === null || weatherApp.weatherApiKey === "") {
                    return false;
                }
                return true;
            }

        },

        saveApiKey: function () {
            if (typeof (localStorage) === "undefined") {
                weatherApp.$targetArea.html("Sorry, local storage is not supported for this browser.");
            } else {

                if (weatherApp.weatherApiKey === null || weatherApp.weatherApiKey === "") {
                    weatherApp.$targetArea.html("Sorry, you must enter an API key.");

                } else {
                    localStorage.setItem(weatherApp.localStorageKey, weatherApp.weatherApiKey);
                    $("#apiDiv").attr("class", "hide");
                }

            }

        },

        displayData: function (data) {
            weatherApp.$targetArea.html("");
            $("<p>", {
                text: ("Current Weather: " + data.weather[0].description)
            }).appendTo(weatherApp.$targetArea);
            $("<p>", {
                text: ("Current Temp: " + data.main.temp + " F")
            }).appendTo(weatherApp.$targetArea);
        },

    }

    $("#submit").click(function () {

        weatherApp.getFormData();

        return false;
    });

    if (weatherApp.loadApiKey()) {
        $("#apiDiv").attr("class", "hide");

    }

});