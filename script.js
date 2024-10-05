const cityInput = document.querySelector('.city-input')
const searchBtn = document.querySelector('.search-btn')

const weatherInfoSection = document.querySelector('.weather-info')
const notFoundSection = document.querySelector('.not-found')
const searchCitySection = document.querySelector('.search-city')

const countryTxt = document.querySelector('.country-txt')
const tempTxt = document.querySelector('.temp-txt')
const conditionTxt = document.querySelector('.condition-txt')
const humidityValueTxt = document.querySelector('.humidity-value-txt')
const windValueTxt = document.querySelector('.wind-value-txt')
const weatherSummaryImg = document.querySelector('.weather-summary-img')
const currentDateTxt = document.querySelector('.current-date-txt')

const forecastItemsSection = document.querySelector('.forecast-items-container')
const forcastItemsContainer = document.querySelector('.forecast-items-container')

const apiKey = '4ba9b888560733e4e2a8db4b826e2df5'

searchBtn.addEventListener('click', () => {
    if(cityInput.value.trim() != '') {
        updateWeatherInfo(cityInput.value)
        cityInput.value = ''
        cityInput.blur()
    }
})

cityInput.addEventListener('keydown', (event) => {
    if(event.key == 'Enter' && cityInput.value.trim() != ''){
        updateWeatherInfo(cityInput.value)
        cityInput.value = ''
        cityInput.blur()
    }
})

async function getFetchData(endPoint, city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`

    const response = await fetch(apiUrl)
    return response.json()
}

function getWeatherIcon(main) {
    if(main == 'Clouds') return 'clouds.svg'
    if(main == 'Drizzle') return 'drizzle.svg'
    if(main == 'Rain') return 'rain.svg'
    if(main == 'Snow') return 'snow.svg'
    if(main == 'Mist') return 'atmosphere.svg'
    if(main == 'Clear') return 'clear.svg'
    if(main == 'Mist') return 'rain.svg'
    else return 'thunderstorm.svg'
}

function getCurrentDate(){
    const currentDate = new Date()
    const options = {
        weekday: 'short',
        day: '2-digit',
        month: 'short'
    }

    return currentDate.toLocaleDateString('en-GB', options)
}

async function updateWeatherInfo(city) {
    const weatherData = await getFetchData('weather', city)
    if(weatherData.cod != 200){
        showDisplaySection(notFoundSection)
        return
    }

    const {
        name : country,
        main : { temp, humidity },
        weather : [{ id, main }],
        wind : { speed }
    } = weatherData

    countryTxt.textContent = country
    tempTxt.textContent = Math.round(temp) + ' °C'
    conditionTxt.textContent = main
    humidityValueTxt.textContent = humidity + '%'
    windValueTxt.textContent = speed + ' Km/hr'

    currentDateTxt.textContent = getCurrentDate()
    weatherSummaryImg.src = `weather-svgs/${getWeatherIcon(main)}`
    
    changeWeatherBackground(main);
    
    await updateForecastsInfo(city)
    showDisplaySection(weatherInfoSection)
}

async function updateForecastsInfo(city){
    const forecastsData = await getFetchData('forecast', city)

    const timeTaken = '12:00:00'
    const todayDate = new Date().toISOString().split('T')[0]

    forcastItemsContainer.innerHTML = ''
    forecastsData.list.forEach(forecastWeather => {
        if(forecastWeather.dt_txt.includes(timeTaken) && !forecastWeather.dt_txt.includes(todayDate)){
            updateForecastsItems(forecastWeather)
        }
    })
}

function updateForecastsItems(weatherData){
    const{
        dt_txt: date,
        weather: [{ id, main }],
        main: { temp }
    } = weatherData

    const dateTaken = new Date(date)
    const dateOption = {
        day: '2-digit',
        month: 'short'
    }
    const dateResult = dateTaken.toLocaleDateString('en-US', dateOption)

    const forecastItem = `
        <div class="forecast-item">
            <h5 class="forecast-item-date regular-txt">${dateResult}</h5>
            <img src="weather-svgs/${getWeatherIcon(main)}" class="forcast-item-img">
            <h5 class="forecast-item-temp">${Math.round(temp)} °C</h5>
        </div>
    `
    forcastItemsContainer.insertAdjacentHTML('beforeend', forecastItem)
}

function showDisplaySection(section){
    [weatherInfoSection, searchCitySection, notFoundSection, forecastItemsSection]
        .forEach(section => section.style.display = 'none')
    
    if (section === weatherInfoSection) {
        forecastItemsSection.style.display = 'flex';
    } else {
        forecastItemsSection.style.display = 'none';
    }
    section.style.display = 'flex'
}

function getWeatherBg(main) {

    if(main == 'Clouds') return 'images/clouds.gif'
    if(main == 'Drizzle') return 'images/drizzle.gif'
    if(main == 'Rain') return 'images/rain.gif'
    if(main == 'Snow') return 'images/snow.gif'
    if(main == 'Mist') return 'images/mist.gif'
    if(main == 'Clear') return 'images/aa72913855f9e02a949a5c392b48299e.jpg'
    if(main == 'Mist') return 'images/rain.gif'
    if(main == 'Haze') return 'images/haze.webp'
    else return 'thunderstorm.svg'
}

function changeWeatherBackground(weatherMain) {
    const bgImage = getWeatherBg(weatherMain);
    document.body.style.backgroundImage = `url(${bgImage})`;
}