const btnLoad=document.querySelector("#btn-load")
const statusEl=document.querySelector("#status");
const ProductList=document.querySelector("#product-list")

async function load(){
    btnLoad.disabled = true;
      statusEl.textContent = "Loading...";
    try{
   
       const response = await fetch(
  "https://www.themealdb.com/api/json/v1/1/search.php?f=a"
);
   
    if(!response.ok){
        throw new Error("page Error" +response.status)
    }
    const data=await response.json();
    data.meals.forEach(item=>{
        const li= document.createElement("li");
        li.textContent=item.strMeal
        ProductList.append(li)
        statusEl.textContent = "";
    console.log(data)
        
    })

    }
    catch(error){
        statusEl.textContent="page loading error"

    }
    finally{
          btnLoad.disabled = false;
    }
    
}
btnLoad.addEventListener("click", load)