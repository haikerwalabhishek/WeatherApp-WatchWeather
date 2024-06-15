let apiKey = "1fc0f2a755f22e3a3d85fe668df0b5aa";
// let geoCodingUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`;
// let revGeoCodingUrl =`http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`;
// let daysSixForcastUrl = `api.openweathermap.org/data/2.5/forecast/daily?lat=${lat}&lon=${lon}&appid=${apiKey}`;
//  let AQI = `http://api.openweathermap.org/data/2.5/air_pollution?lat={lat}&lon={lon}&appid={API key}`;

let searchBtn = document.getElementById("searchBtn");
let search = document.getElementById("search");
let list = document.getElementById("dropdown");
let idx = -1;
let cityname;

let isOnline = () => {
    return navigator.onLine;
};

let monthtoString = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
];

let weekDay = [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat"
];


let getaqiDes = (aqi) =>{
    switch (aqi){
        case 1:
            return "Good";
        case 2:
            return "Fair";
        case 3:
            return "Moderate";
        case 4:
            return "Poor";
        case 5:
            return "Very Poor";
    }
};

let dateTimeFormat = (timestemp,timezone) =>{
  // Convert Unix timestamp to milliseconds
    let date = new Date((timestemp+timezone) * 1000);
    let dateNum = date.getUTCDate();
    let month = monthtoString[date.getUTCMonth()];
    let week = weekDay[date.getUTCDay()];
    return `${week} ${dateNum} ${month}`;
};

let dateTime = (timestemp,timezone) =>{
    // Convert Unix timestamp to milliseconds
    let date = new Date((timestemp+timezone) * 1000);
    let hours = date.getUTCHours();
    let minutes = date.getUTCMinutes();
    let period = hours>=12? "PM":"AM";
    return `${hours % 12 || 12}:${minutes} ${period}`
  };



let setSunCard = (sunrise,sunset,timezone) =>{
    // console.log(sunrise);
    // console.log(sunset);
    let sunrises= dateTime(sunrise,timezone);
    let sunsets= dateTime(sunset,timezone);

    let card = document.getElementById("sunCard");

    card.innerHTML = `
        <div class="flex justify-between mb-5 mt-3 items-center">
            <h2 class="text-[12px] text-[#a7a6a8] lg:text-[20px]">Sunrise & Sunset</h2>
        </div>

        <div class="flex justify-around mb-5 mt-3 items-center">

            <div class="flex gap-1 items-center w-2/4">
                <img class="invert" src="./static/sun.png" alt="Watch Weather Icon" style="width: 30px; height: 30px;">
                <div class="flex flex-col">
                    <h2 class="text-[10px] text-[#a7a6a8] lg:text-[12px]">Sunrise</h2>
                    <h2 class="text-[15px]">${sunrises}</h2>
                </div>
            </div>

            <div class="flex gap-1 items-center w-2/4">
                <img class="invert" src="./static/moon.png" alt="Watch Weather Icon" style="width: 30px; height: 30px;">
                <div class="flex flex-col">
                    <h2 class="text-[10px] text-[#a7a6a8] lg:text-[12px]">Sunset</h2>
                    <h2 class="text-[15px]">${sunsets}</h2>
                </div>
            </div>
        </div>                
    `

};

let setWeatherDataCard = (weatherData) =>{
    let dataCard = document.getElementById("dataCard");
    dataCard.innerHTML=`
        
    <div class="flex justify-between mb-5 mt-3 items-center md:mt-2 md:mb-3">
        <h2 class="text-[12px] text-[#a7a6a8] lg:text-[20px]">Weather Data</h2>
    </div>

    <div class="flex justify-around mb-5 mt-3 items-center md:mt-2 md:mb-3">

        <div class="flex gap-1 items-center w-2/4">
            <img class="invert" src="./static/humidity.png" alt="Watch Weather Icon" style="width: 30px; height: 30px;">
            <div class="flex flex-col">
                <h2 class="text-[10px] text-[#a7a6a8] lg:text-[12px]">Humidity</h2>
                <h2 class="text-[15px]">${weatherData[0].humidity}%</h2>
            </div>
        </div>

        <div class="flex gap-1 items-center w-2/4">
            <img class="invert" src="./static/pressure.png" alt="Watch Weather Icon" style="width: 30px; height: 30px;">
            <div class="flex flex-col">
                <h2 class="text-[10px] text-[#a7a6a8] lg:text-[12px]">Presure</h2>
                <h2 class="text-[15px]">${weatherData[0].preasure}hPa</h2>
            </div>
        </div>
    </div>

    <div class="flex justify-around mb-5 mt-3 items-center md:mt-2 md:mb-3">

        <div class="flex gap-1 items-center w-2/4">
            <img class="invert" src="./static/visibility.png" alt="Watch Weather Icon" style="width: 30px; height: 30px;">
            <div class="flex flex-col">
                <h2 class="text-[10px] text-[#a7a6a8]">Visibility</h2>
                <h2 class="text-[15px]">${weatherData[0].visibility/1000}km</h2>
            </div>
        </div>

        <div class="flex gap-1 items-center w-2/4">
            <img class="invert" src="./static/temp.png" alt="Watch Weather Icon" style="width: 30px; height: 30px;">
            <div class="flex flex-col">
                <h2 class="text-[10px] text-[#a7a6a8]">Feels Like</h2>
                <h2 class="text-[15px]">${(weatherData[0].feelsLike-273.15).toFixed(2)}<span class="text-[15px]"><sup>&deg;C</sup></span></h2>
            </div>
        </div>
    </div>

    `
};

let setWeatherCards = (weatherData,country,timezone) =>{
    let currentCard = document.getElementById("currentForcastCard");
    let fiveDaysCard = document.getElementById("fiveDaysForcastCard");

    fiveDaysCard.innerHTML="";
    for (let i=0;i<weatherData.length;i++){
        if (i===0){
            let tempCel = weatherData[i].temp-273.15
            setWeatherDataCard(weatherData);
            currentCard.innerHTML =`
            <div class="flex items-center justify-between">
                <h3>Now</h3>
                <h2 class="text-[12px] font-bold text-[#a7a6a8]">${weatherData[i].weatherDesc}</h2>
            </div>

            <div class="flex justify-between mb-5 mt-3">
                <h2 class="text-[40px]">${tempCel.toFixed(2)}<sup>&deg;C</sup></h2>
                <img class="w-[60px]" src="https://openweathermap.org/img/wn/${weatherData[i].weatherIcon}@2x.png" alt="Weather Icon">
            </div>                
            
            <div class="flex justify-between items-center text-[#a7a6a8]">
                <h2 class="text-[12px]">Wind:${weatherData[i].wind} M/S</h2>
                <h2 class="text-[12px]">Humidity:<span class="text-[#1d1b1f]">_</span>${weatherData[i].humidity}%</h2>
            </div>

            <div>
                <hr class="border-[#5c5b5e] mt-3">
                <span class="flex items-center text-[#a7a6a8] text-sm gap-2"><img class="mb-3 mt-3" src="./static/calander.png" alt="Watch Weather Icon" style="width: 20px;">${dateTimeFormat(weatherData[i].dateTime,timezone)}</span>
                <span class="flex items-center text-[#a7a6a8] text-sm gap-2"><img src="./static/location.png" alt="Watch Weather Icon" style="width: 20px;">${cityname}, ${country}</span>
            </div>

            `
        }else{
            let tempCels = weatherData[i].temp-273.15;
            let div = document.createElement("div");
            div.classList.add('flex', 'items-center', 'justify-between', 'text-[#b6b4b8]', 'gap-1');
            div.innerHTML = `
            <div class="flex gap-1 items-center">
                <img src="https://openweathermap.org/img/wn/${weatherData[i].weatherIcon}@2x.png" alt="Watch Weather Icon" style="width: 40px; height: 40px;">
                <h2 class="text-[15px]">${tempCels.toFixed(2)}<sup>&deg;</sup></h2>
            </div>
                <h2 class="text-[15px]"><span class="text-orange-500">W:</span> ${weatherData[i].wind}M/S</h2>
                <h2 class="text-[15px]"><span class="text-orange-500">H:</span> ${weatherData[i].humidity}%</h2>
            `;
            fiveDaysCard.appendChild(div);
        }
    }
};

let setAQI = (pm25,so2,no2,o3,aqiss) =>{
    let aqis = document.getElementById("aqiCard");
    let aqiValue = getaqiDes(aqiss);
    aqis.innerHTML=`
    <div class="flex justify-between mb-5 mt-3 items-center">
        <h2 class="text-[12px] text-[#a7a6a8] lg:text-[20px]">AQI</h2>
        <button class="text-[10px] p-2 rounded-full lg:text-[15px] ${aqiValue}"> ${aqiValue}</button>
    </div>
    <div class="flex justify-between mb-5 mt-3 items-center">
        <img class="invert" src="./static/air.png" alt="Watch Weather Icon" style="width: 30px; height: 30px;">
        <div class="flex flex-col justify-center items-center">
            <h2 class="text-[8px] text-[#a7a6a8] lg:text-[12px]">PM2.5</h2>
            <h2 class="text-[10px] lg:text-[15px]">${pm25}</h2>
        </div>
        <div class="flex flex-col justify-center items-center">
            <h2 class="text-[8px] text-[#a7a6a8] lg:text-[12px]">SO2</h2>
            <h2 class="text-[10px] lg:text-[15px]">${so2}</h2>
        </div>
        <div class="flex flex-col justify-center items-center">
            <h2 class="text-[8px] text-[#a7a6a8] lg:text-[12px]">NO2</h2>
            <h2 class="text-[10px] lg:text-[15px]">${no2}</h2>
        </div>
        <div class="flex flex-col justify-center items-center">
            <h2 class="text-[8px] text-[#a7a6a8] lg:text-[12px]">O3</h2>
            <h2 class="text-[10px] lg:text-[15px]">${o3}</h2>
        </div>
    </div>`;
};

let getWeatherData = (lat,lon) =>{
    let days16DataUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&cnt=6&appid=${apiKey}`;

    fetch(days16DataUrl)
    .then(response =>{
        if(!response.ok){
            throw new Error("Network response was not ok");
        }
        return response.json();
    })
    .then(data =>{
        // console.log(data)
        // console.log(data);
        let {sunrise,sunset,country,timezone} = data.city;
        let weatherData =[];
        for (let i=0;i<=5;i++){
            let dateTime = data.list[i].dt;
            let feelsLike = data.list[i].main.feels_like;
            let humidity = data.list[i].main.humidity;
            let wind = data.list[i].wind.speed;
            let preasure = data.list[i].main.pressure;
            let temp = data.list[i].main.temp;
            let visibility = data.list[i].visibility;
            let weatherIcon = data.list[i].weather[0].icon;
            let weatherDesc = data.list[i].weather[0].description;
            weatherData.push({dateTime,feelsLike,humidity,wind,preasure,temp,visibility,weatherIcon,weatherDesc})
        };

        setWeatherCards(weatherData,country,timezone);
        setSunCard(sunrise,sunset,timezone);
        // console.log(weatherData);
    })
    .catch(error =>{
        if (error){
            alert("There was a problem check console!");
            console.log(error);
        }
    });
};

let getAQI = (lat,lon) =>{
    let AQI = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    fetch(AQI)
    .then(response =>{
        if(!response.ok){
            throw new Error("Network response was not ok");
        }
        return response.json();
    })
    .then(data =>{
        // console.log(data);
        let pm25 = data.list[0].components.pm2_5;
        let so2s = data.list[0].components.so2;
        let no2s = data.list[0].components.no2;
        let o3s = data.list[0].components.o3;
        let aqiq = data.list[0].main.aqi;
        setAQI(pm25,so2s,no2s,o3s,aqiq);
        // console.log(pm25);
        // console.log(so2s);
        // console.log(no2s);
        // console.log(o3s);
        // console.log(aqiq);
    })
    .catch(error =>{
        if (error){
            alert("There was a problem check console!");
            console.log(error);
        }
    });
};

let getData = (url)=>{
    fetch(url)
    .then(response =>{
        if(!response.ok){
            throw new Error("Network response was not ok");
            alert("Network Error")
        }
        return response.json();
    })
    .then(data =>{
        if(data.length===0){
            alert("city not found!");
        }
        else if(!data[0].name){
            alert("city not found!");
        }else{
            let {lat,lon} = data[0];
            // console.log(lat);
            // console.log(lon);
            getWeatherData(lat,lon);
            getAQI(lat,lon);
            // console.log(data);
        }
        
    })
    .catch(error =>{
        if (error){
            alert("There was a problem check console!");
            console.log(error);
        }
    });
};

let getCordinates = (value) =>{
    if(value){
        let city = value[0].toLocaleUpperCase()+value.slice(1);
        let geoCodingUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;
        if (!isOnline()){
            alert("You are offline please connect to internet!")
        }else{
            getData(geoCodingUrl);
        }
        // alert(city);
    }else{
        alert("enter a city");
    }    // alert(value);
    
};

let store = (placeName) => {
    if (placeName) {
        // Retrieve the places array from localStorage
        let places = localStorage.getItem("places");
        
        if (places) {
            places = JSON.parse(places);
            
            // Check if the placeName already exists in the array
            if (places.includes(placeName)) {
                
                idx = places.indexOf(placeName);
                places.splice(idx,1);
                localStorage.setItem("places",JSON.stringify(places));
                list.innerHTML="";
                display();
            }
        } else {
            places = []; // Initialize as an empty array if no data in localStorage
        }

        // Add the new place to the array
        places.push(placeName);

        // Save the updated array back to localStorage
        localStorage.setItem("places", JSON.stringify(places));
    }
};

let display = () =>{
    if (list.classList.contains("hidden")) {
        list.classList.remove("hidden");
    };
    let data = localStorage.getItem("places");
    data = JSON.parse(data);
    data.reverse();
    for (item of data){
        let newList = document.createElement("li");
        newList.className =`flex ${item.toLocaleLowerCase().trim()} justify-between ps-1 pe-1 items-center hover:bg-white hover:text-black cursor-pointer listItem`;
        newList.innerHTML = `${item.toLocaleLowerCase().trim()}<button class="deleteBtn ${item.toLocaleLowerCase().trim()} bg-[#222222] text-white h-5 w-7 rounded-full flex justify-center items-center">X</button>`;
        list.appendChild(newList);
    };

    let deleteBtn = document.querySelectorAll(".deleteBtn");

    deleteBtn.forEach(element => {
        element.addEventListener("click",(event)=>{
            let eventRecord = event;
            idx = data.indexOf(event.target.classList[1]);
            data.splice(idx,1);
            if(data.length!==0){
                eventRecord.stopPropagation();
            }
            localStorage.setItem("places",JSON.stringify(data));

            // let data = localStorage.getItem("places");
            // data = JSON.parse(data);
            list.innerHTML="";
            display();
        })
    });

    let listItem = document.querySelectorAll(".listItem");

    listItem.forEach(element =>{
        element.addEventListener("click",(event) =>{
            list.classList.add("hidden");
            // console.log(list.children.length);
            search.value = event.target.classList[1];
        });

    });
    
};


let updateSelection = (Nidx) => {
    let listItems = document.querySelectorAll(".listItem");
    if (idx !== -1) {
        // console.log(idx);
        listItems[idx].classList.remove("selected");
    }
    idx = Nidx;
    if (idx !== -1) {
        // console.log(Nidx);
        listItems[idx].classList.add("selected");
        listItems[idx].focus();
    }
};

searchBtn.addEventListener("click",(event)=> {
    let city = document.getElementById("search").value;
    store(city.toLocaleLowerCase().trim());
    cityname = city[0].toLocaleUpperCase()+city.slice(1);
    getCordinates(search.value);
    search.value="";
    section.div.classList.remove("hiddenDiv");

    
});

search.addEventListener("keydown",(event)=>{
    let listItems = document.querySelectorAll(".listItem");
    let section = document.getElementById("section");
    if (event.key === "Enter"){
        if (event.key === "Enter" && idx !== -1) {
            search.value = listItems[idx].classList[1];
            idx=-1;
        }else{
            if (search.value){
                let city = document.getElementById("search").value;
                store(city.toLocaleLowerCase().trim());
                cityname = city[0].toLocaleUpperCase()+city.slice(1);
                getCordinates(search.value);
                search.value="";
                section.classList.remove("hiddenDiv");
        
            }else{
                search.value = listItems[0].classList[1];
            }
        }
        
    }

    let data = localStorage.getItem("places");
    data = JSON.parse(data);
    if(data.length !== 0 ){
        list.innerHTML="";
        display();
    }

     // Handle arrow key navigation
     if (event.key === "ArrowDown") {
        event.preventDefault();
        if (idx < listItems.length-1) {
            updateSelection(idx + 1);
        }else{
            updateSelection(0)
        }
    } else if (event.key === "ArrowUp") {
        event.preventDefault();
        if (idx >0) {
            updateSelection(idx - 1);
        }else{
            updateSelection(listItems.length-1)
        }
    }
});

search.addEventListener("mouseenter",()=>{
    let data = localStorage.getItem("places");
    data = JSON.parse(data);
    if(data.length !== 0 ){
        list.innerHTML="";
        display();
    };
});

document.addEventListener("click",(event)=>{
    if (!search.contains(event.target) && !list.contains(event.target)) { // Check if click is outside the list and search button
        if (!list.classList.contains("hidden")) {
            list.classList.add("hidden");
            idx=-1;
        }
    }
    });

const locationUser = document.getElementById("locationDiv");
locationUser.addEventListener("click",(even)=>{
    let section = document.getElementById("section");
    navigator.geolocation.getCurrentPosition(
        position =>{
            const {latitude,longitude} = position.coords;
            const revGeoLocation = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${apiKey}`;
            fetch(revGeoLocation)
            .then(res => res.json())
            .then(data =>{
                if (data && data.length > 0) {
                    cityname = data[0].name;
                    getWeatherData(latitude, longitude);
                    getAQI(latitude, longitude);
                } else {
                    alert("No data found for the given coordinates!");
                }
            })
            .then(section.classList.remove("hiddenDiv"))
            .catch(()=>{
                alert("An error occured while fetching the coordinates!");
            })
        },
        error => {
            if (error.code === error.PERMISSION_DENIED){
                alert("Geolocation request denied. Please reset location permission to grant access again.")
            }
        }
        )
});

