require("dotenv").config();
const Axios = require("axios");
exports.giveWeather = (req,res)=>{
    makeWeatherAPICall(req.body).then(data=>{
        res.send(data);
    })
}
exports.giveLocation = (req,res)=>{
    makeLocationAPICall(req.body.value).then((data)=>{
        res.send(data);
    });
}
async function makeLocationAPICall(value) {
    const searchUrl = `https://api.weatherapi.com/v1/search.json?key=${process.env.API_KEY}&q=${value}`;
    const resultData = await Axios.get(searchUrl);
    return resultData.data;
}
async function makeWeatherAPICall({lat,lon,urlData}) {
    let url = `https://api.weatherapi.com/v1/current.json?key=${process.env.API_KEY}&q=${lat},${lon}`;
    if (urlData)
        url = `https://api.weatherapi.com/v1/current.json?key=${process.env.API_KEY}&q=${urlData}`;
    let astroUrl = `https://api.weatherapi.com/v1/astronomy.json?key=${process.env.API_KEY}&q=${lat},${lon}`;
    if (urlData)
        astroUrl = `https://api.weatherapi.com/v1/astronomy.json?key=${process.env.API_KEY}&q=${urlData}`;
    const result = await Promise.all([getWeatherData(url), getAstroData(astroUrl)]).then((result)=>{
        return [result[0].data, result[1].data];
    })
    return result;
}
function getWeatherData(url) {
    return Axios.get(url)
}
function getAstroData(url) {
    return Axios.get(url)
}