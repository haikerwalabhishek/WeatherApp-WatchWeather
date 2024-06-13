const apiKey = "1fc0f2a755f22e3a3d85fe668df0b5aa";
// const geoCodingUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`;
// const revGeoCodingUrl =`http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`;
// const daysSixForcastUrl = `api.openweathermap.org/data/2.5/forecast/daily?lat=${lat}&lon=${lon}&appid=${apiKey}`;

const searchBtn = document.getElementById("searchBtn");
const search = document.getElementById("search");
const list = document.getElementById("dropdown");


// const getData(url){

// }

const getCordinates = (value) =>{
    const geoCodingUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${value}&limit=1&appid=${apiKey}`;
    
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
            search.value = event.target.classList[1];
        })
    });
    
};

searchBtn.addEventListener("click",()=> {
    const city = document.getElementById("search").value;
    const data = localStorage.getItem("places");
    store(city.toLocaleLowerCase().trim());
    getCordinates(search.value);
    search.value="";
});

search.addEventListener("keydown",(event)=>{
    if (event.key === "Enter"){
        const city = document.getElementById("search").value;
        const data = localStorage.getItem("places");
        store(city.toLocaleLowerCase().trim());
        getCordinates(search.value);
        search.value="";
    }

    let data = localStorage.getItem("places");
    data = JSON.parse(data);
    if(data.length !== 0 ){
        list.innerHTML="";
        display();
    }
});

search.addEventListener("mouseenter",()=>{
    let data = localStorage.getItem("places");
    data = JSON.parse(data);
    if(data.length !== 0 ){
        list.innerHTML="";
        display();
    }
});

document.addEventListener("click",(event)=>{
    if (!search.contains(event.target) && !list.contains(event.target)) { // Check if click is outside the list and search button
        if (!list.classList.contains("hidden")) {
            list.classList.add("hidden");
        }
    }
});

