const myform = document.querySelector("#search-form");
const myInput = document.querySelector("#country-input");
const btn = document.querySelector("#btn");
const facts = document.querySelector("#facts");
const themeToggle=document.querySelector("#theme-toggle")


function renderStat(label, value){
    const div=document.createElement("div");
    const strong=document.createElement("strong");
    const span=document.createElement("span");
   strong.textContent=label +":";
   span.textContent=value;
   div.appendChild(strong)
   div.appendChild(span);
   facts.appendChild(div)
   
  
}

const API_KEY = "rc_live_7dd3840ff4004c8abedb2457f49d46de"; 


async function dataFetching(countryName) {
    facts.textContent = "Loading...";
    try {
        const res = await fetch(
            `https://api.restcountries.com/countries/v5?q=${encodeURIComponent(countryName)}&api-key=${API_KEY}`
        );

        if (!res.ok) {
            throw new Error("Country not found");
        }

       const data = await res.json();
const country = data.data.objects[0];
        
        facts.innerHTML = "";
        
       renderStat(
    "Capital", country.capitals[0].name
       )
        renderStat("Population", country.population ? country.population.toLocaleString() : "N/A");
        renderStat("Region", country.region || "N/A");
        
       
        renderStat("Currencies code", country.currencies[0].code);
        renderStat("currencies name", country.currencies[0].name)
        
     const flagUrl=country.flag.url_svg[0];
     const image=document.createElement("img");
     image.src=flagUrl;
     image.alt=`flag of ${countryName}`
      facts.appendChild(image)
    } catch (error) {
        facts.textContent = error.message;
    }
}


dataFetching("ethiopia");

myform.addEventListener("submit", (e)=>{
    e.preventDefault();
    if(myInput.value.trim()!==""){
        dataFetching(myInput.value);
        myInput.value="";
    }
})