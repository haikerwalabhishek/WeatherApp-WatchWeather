const apiKey = "1fc0f2a755f22e3a3d85fe668df0b5aa";
// const geoCodingUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`;
// const revGeoCodingUrl =`http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`;
// const daysSixForcastUrl = `api.openweathermap.org/data/2.5/forecast/daily?lat=${lat}&lon=${lon}&appid=${apiKey}`;

const searchBtn = document.getElementById("searchBtn");
const search = document.getElementById("search");
const list = document.getElementById("dropdown");
let idx = -1;


const getWeatherData = (lat,lon) =>{
    let days16DataUrl = `api.openweathermap.org/data/2.5/forecast/daily?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    fetch(days16DataUrl)
    .then(response =>{
        if(!response.ok){
            throw new Error("Network response was not ok");
        }
        return response.json();
    })
    .then(data =>{
        console.log(data);
    })
    .catch(error =>{
        if (error){
            alert("There was a problem check console!");
            console.log(error);
        }
    });
};

const getData = (url)=>{
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
            const {name,lat,lon} = data[0];
            getWeatherData(name,lat,lon);
        }
    })
    .catch(error =>{
        if (error){
            alert("There was a problem check console!");
            console.log(error);
        }
    });
};

const getCordinates = (value) =>{
    if(value){
        let city = value[0].toLocaleUpperCase()+value.slice(1);
        let geoCodingUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;
        getData(geoCodingUrl);
        // alert(city);
    }else{
        alert("enter a city");
    }    // alert(value);
    
};

const store = (placeName) => {
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

const display = () =>{
    if (list.classList.contains("hidden")) {
        list.classList.remove("hidden");
    };
    let data = localStorage.getItem("places");
    data = JSON.parse(data);
    data.reverse();
    for (item of data){
        const newList = document.createElement("li");
        newList.className =`flex ${item.toLocaleLowerCase().trim()} justify-between ps-1 pe-1 items-center hover:bg-white hover:text-black cursor-pointer listItem`;
        newList.innerHTML = `${item.toLocaleLowerCase().trim()}<button class="deleteBtn ${item.toLocaleLowerCase().trim()} bg-[#222222] text-white h-5 w-7 rounded-full flex justify-center items-center">X</button>`;
        list.appendChild(newList);
    };

    const deleteBtn = document.querySelectorAll(".deleteBtn");

    deleteBtn.forEach(element => {
        element.addEventListener("click",(event)=>{
            const eventRecord = event;
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

    const listItem = document.querySelectorAll(".listItem");

    listItem.forEach(element =>{
        element.addEventListener("click",(event) =>{
            list.classList.add("hidden");
            // console.log(list.children.length);
            search.value = event.target.classList[1];
        });

    });
    
};


const updateSelection = (Nidx) => {
    const listItems = document.querySelectorAll(".listItem");
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
    const city = document.getElementById("search").value;
    const data = localStorage.getItem("places");
    store(city.toLocaleLowerCase().trim());
    getCordinates(search.value);
    search.value="";

    
});

search.addEventListener("keydown",(event)=>{
    const listItems = document.querySelectorAll(".listItem");
    if (event.key === "Enter"){
        if (event.key === "Enter" && idx !== -1) {
            search.value = listItems[idx].classList[1];
            idx=-1;
        }else{
            if (search.value){
                const city = document.getElementById("search").value;
                const data = localStorage.getItem("places");
                store(city.toLocaleLowerCase().trim());
                getCordinates(search.value);
                search.value="";
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

