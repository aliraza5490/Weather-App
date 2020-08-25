let latitude, longitude;
let showPosition = (position) => {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    console.log(`Latitude: ${position.coords.latitude} \n Longitude: ${position.coords.longitude}`);
    getWeather(latitude, longitude);
}
const formElem = document.getElementById("searchPlaceForm");
formElem.addEventListener("submit", (e) => {
    e.preventDefault();
});

const inputElem = document.getElementById("searchPlace");
const resultElem = document.getElementById("result");
const resultList = document.getElementById("resultList");
inputElem.onfocus = (e) => {
    resultElem.style.opacity = "100";
    resultElem.style.display = 'block';
}
inputElem.onchange = async e => {
    console.log(e.target.value);
    let data = {"value": e.target.value}
    if (e.target.value) {
        await fetch("/api/getLocation",{
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),}).then((Response) => {
                Response.json().then(data => {
                    let html = '';
                    data.forEach(element => {
                        let name = element.name;
                        html += `<li><div class="searchLink" data-url="${element.url}">${name}</div></li>`;
    
                    });
                    resultList.innerHTML = html;
                    const searchLinks = document.querySelectorAll(".searchLink");
                    searchLinks.forEach(link=>{
                        link.addEventListener("click",(event)=>{
                            getWeather(null,null,event.target.attributes[1].nodeValue);
                            resultElem.style.display = "none";
                        });
                    })
                })
        }).catch(err => {
            throw new Error(err)
        })
    }
}
(fetchLocation = () =>{
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition,(err)=>console.log(err))
    } else {
        alert("Geolocation is not supported by this browser.");
    }
})();
const fetchBtn = document.getElementById("fetchBtn");
fetchBtn.addEventListener("click", fetchLocation);

function getWeather(lat, lon, urlData) {
    let data = {"lat": lat, "lon": lon, "urlData": urlData};
    fetch("/api/getWeather",{
    method: "POST",
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),}).then((Response) => {
        Response.json().then((data) => {
            updateWeather(data[0], data[1]);
        })
    }).catch(err => {
        throw new Error(err)
    })
}


let updateWeather = (weather, astroData) => {
    const areaElem = document.getElementById("areaName");
    areaElem.innerText = weather.location.name;
    const updateElem = document.getElementById("lastUpdate");
    let updateTime = weather.current.last_updated.split(" ")[1].split(":");
    let hour = (updateTime[0] > 12) ? updateTime[0] - 12 : updateTime[0];
    let ampm = (updateTime[0] != hour) ? "PM" : "AM";
    let localTime = weather.location.localtime.split(" ")[1].split(":");
    let localHour = (localTime[0] > 12) ? localTime[0] - 12 : localTime[0];
    let localAmpm = (localTime[0] != localHour) ? "PM" : "AM";
    updateElem.innerText = "Last Update: " + hour + ":" + updateTime[1] + ampm+" | Local Time: " + localHour + ":" + localTime[1] + localAmpm;
    const imageContainer = document.getElementById('weatherImage');
    imageContainer.innerHTML = `<img src="https://${weather.current.condition.icon}">`
    const cityElement = document.getElementById("region");
    cityElement.innerText = weather.location.region;
    const tempDisplay = document.getElementById("temp");
    tempDisplay.innerText = weather.current.temp_c + "°C";
    const cloudDisplay = document.getElementById("clouds");
    cloudDisplay.innerText = weather.current.cloud + "%";
    const feelsLikeElement = document.getElementById("feelsLike");
    feelsLikeElement.innerText = weather.current.feelslike_c + "°C";
    const humidiyElement = document.getElementById("humidity");
    humidiyElement.innerText = weather.current.humidity + "%";
    const windInfoElement = document.getElementById("windInfo");
    windInfoElement.innerText = `Direction: ${weather.current.wind_degree}deg, ${weather.current.wind_dir}\n Speed: ${weather.current.wind_kph}kmph\n Gust:${weather.current.gust_kph}kmph`;
    const descriptionElem = document.getElementById("description");
    descriptionElem.innerText = weather.current.condition.text;
    const preciElem = document.getElementById("precipitation");
    preciElem.innerText = weather.current.precip_mm + "mm";
    const visibilityElem = document.getElementById("visibility");
    visibilityElem.innerText = weather.current.vis_km + "km";
    const pressureElem = document.getElementById("pressure");
    pressureElem.innerText = weather.current.pressure_mb + "mb";
    const sunSetElem = document.getElementById("sunSet");
    sunSetElem.innerText = astroData.astronomy.astro.sunset;
    const sunRiseElem = document.getElementById("sunRise");
    sunRiseElem.innerText = astroData.astronomy.astro.sunrise;
    const uvElem = document.getElementById("uv");
    uvElem.innerText = weather.current.uv;
    const moonSetElem = document.getElementById("moonSet");
    moonSetElem.innerText = astroData.astronomy.astro.moonset;
    const moonRiseElem = document.getElementById("moonRise");
    moonRiseElem.innerText = astroData.astronomy.astro.moonrise;
}