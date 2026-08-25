const h1=document.querySelector("h1");
const list=document.querySelector("#list");
const container=document.querySelector(".container");
const btn=document.querySelector(".btn");
const input=document.querySelector("#input");
const form=document.querySelector("#input");

 const cityNames=["Addis Abeba", "Dredawa", "Mekelle"];

h1.textContent="Ethiopian City Names";
h1.classList.toggle("toggle")

cityNames.forEach(city=>{
    const li=document.createElement("li");
    li.classList.add("city");
    li.textContent=city;
  
   list.append(li);

})
container.addEventListener("click", (e)=>{
    e.target.closest("div");
   
    console.log("btn clicked");
     e.preventDefault()
    const name=input.value.trim();
     if (name==="") return;
     const li=document.createElement("li");
     li.innerHTML=` <span> ${name}</span>   
     <button class="remove">remove</button>`

    list.append(li);
   input.value=""
  
    
    
   


})

  

 
list.addEventListener("click", e=>{
    if(!e.target.classList.contains("remove")) return;
    const li=e.target.closest("li");
    li.remove();
})