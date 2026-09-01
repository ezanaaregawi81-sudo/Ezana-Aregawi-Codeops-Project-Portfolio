import { func } from "prop-types";
import Dish from "./Dish";
import { useState, useEffect, useRef } from "react";
import CategoryBar from "./CategoryBar";
import OrderForm from "./OrderForm";
import '../../public/menu.json';



function Main(){

    const [category, setCategory] = useState("All");
    const [total, setTotal] = useState(0);
    const [count, setCount] = useState(0);
    const [menu, setMenu] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const searchInputRef = useRef(null);

    
    useEffect(() => {
        if (searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, []);

    useEffect(()=>{

    const controler = new AbortController();
    const signal =controler.signal;

    async function fetchData() {
        setLoading(true);
        setError(null);

        try{
        const response = await fetch("menu.json", { signal });
        if (!response.ok) throw new error ('404 Page not found')
        
        const data = await response.json();
        console.log("The fetched data", data);
        
        const filteredMenu = category === "All"?
        data.items:data.items.filter((item) => item.category === category)
        setMenu(filteredMenu)
            }catch(error){
                if (error.name !== 'AbortError')
                console.error("Fetching data failed", error);
                setError(error)
                
            }
        finally{
            if(!signal.aborted){
            setLoading(false)
        }
    }
}
    fetchData();

    return () => {
        controler.abort();
    };

},[category])


    useEffect(() => {
    document.title = `Addis Eats — ${count} items`;
    }, [count]);


   
    function handleAddBtn(price){    
        setCount(count + 1)
        setTotal(total + Number(price))
        
    };



    return(
        <>
        <h3>Order Total: {total} ETB</h3>
        <h3>Total Orders: {count} Items</h3>

        <div style={{ margin: "1rem 0" }}>
                <input 
                    ref={searchInputRef}
                    type="text" 
                    placeholder="Search menu items..." 
                />
            </div>
        
        <CategoryBar selected={category} onSelect={setCategory} />
        
        <h2>{category}</h2>
        
        <div className="card-container">

            
                        {loading && <p>Loading menu...</p>}
                        {error && <p><strong style={{fontSize: "100px"}}>404</strong> 
                        <em style={{padding:"8px"}}>page not found</em></p> }
                        
                        {!loading &&
                        !error && 
                           menu.map((item) => (
                                <Dish 
                                key={item.id} 
                                {...item}
                                onAddToCart = {handleAddBtn}
                                
                                />
                            ))
                        }
        </div>
        <div className="form">            <OrderForm/>   </div>

       
        


        </>
    )
}

export default Main