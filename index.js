//For explaination 


// console.log('Hello Pavesh');

// const API_key = "efe62cc1cea59d4a6ea6f4680c7f0b6d";

// // async function showWeather(){     //async function isiliye banaya hai qki humko wait nahi karna hai weather ke result aane ka humko dusre kaam bhi dekhna hoge toh await ka bhi use karege or async ka isiliye ki async ye achieve hoga synchronous me sb saath me dekhe jate hai isko alg se dekhna hoga 

// //     let city = "goa";

// //     const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_key}`);

// //     const data = await response.json();  //yha par kabhi hum response me await nahi lagayege toh dikkat hogi qki hum data me response ke data ko json me convert karne chale gaye hai or response ne abhi tak api fetch hi nahi kiya hai

// //     console.log("Weather data:-> " + data);  //data me bhi await lagaya hai qki aisa na ho ki data nahi mila ho or hum data ko print karne chale gaye ho

// // }

// function renderWeatherInfo(data){
//     let newPara = document.createElement('p');
//     newPara.textContent = `${data?.main?.temp.toFixed(2)} K`;
//     document.body.appendChild(newPara);
// }

// async function showWeather(){
//     try{
//         let city = "goa";

//         const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_key}`);
    
//         const data = await response.json();
//         console.log("Weather data:- ", data);
//     }
//     catch(err){
//         //handle the error here
//         console.log("Error Found: ", err);
//     }
// }



//Code:---

const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-conatiner");

const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

// initials variables needed
let currentTab = userTab;
const API_KEY = "efe62cc1cea59d4a6ea6f4680c7f0b6d"; 
currentTab.classList.add("current-tab");
getfromSessionStorage();

function switchTab(clickedTab){
    if(clickedTab != currentTab){
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")){
            // kya search wala tab invisible tha, if yes then make it visible 
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else{
            //main pehle search wale tab par tha ab user wala visible karna hai
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            // ab me user weather tab me aagya hu, toh weather bhi display karna pdega, so lets check local storage first for coordinates, if we have saved them there.
            getfromSessionStorage();
        }
    }
}

userTab.addEventListener("click", ()=>{
    //pass selected tab as input parameter
    switchTab(userTab);
});

searchTab.addEventListener("click", ()=>{
    //pass selected tab as input parameter
    switchTab(searchTab);
});

// check if coordinates are already present in session storage
function getfromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        //agar local coordinates nahi mile 
        grantAccessContainer.classList.add("active");
    }  
    else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates){
    const {lat, lon} = coordinates;
    // make grant container invisible 
    grantAccessContainer.classList.remove("active");
    //make loader visible 
    loadingScreen.classList.add("active");

    // API call 
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
        const data = await response.json();

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err){
        loadingScreen.classList.remove("active");
        console.log("Error found: ", err);
    }
}

function renderWeatherInfo(weatherInfo){
    //firstly we have to fetch the elements

    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    // fetch values from weatherInfo object and put it in UI elements
    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} K`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;

}

function getLocation(){
    if(navigator.getLocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        // HW show alert for no geolocation support available
    }
}

function showPosition(position){
    const userCoordinates = {
        lat: position.coords.latitude ,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation);

const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("click", (e)=>{
    e.preventDefault();
    let cityName = searchInput.value;

    if(cityName === ""){
        return ;
    }
    else{
        fetchSearchWeatherInfo(cityName);
    }
});

async function fetchSearchWeatherInfo(city){
   loadingScreen.classList.add("active");
   userInfoContainer.classList.remove("active");
   grantAccessContainer.classList.remove("active");
   
   try{
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`);
    const data = await response.json();
    loadingScreen.classList.remove("active");
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);
   }
   catch(e){
    console.log("Error Found: ", e);
   }
}