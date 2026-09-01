import {useState} from 'react';

function OrderForm() {
    const [form, setForm] = useState({
        name: "",
        phone: "",
        area: "Ayat",
    });

function handeleChange(e){
    const{name, value} = e.target;
        setForm({
            ...form, //SPREAD
            [name]: value,
        })
    }
const isValid = !/^\d{10}$/.test(form.phone)
function handleSubmit(e){
    e.preventDefault();
    alert(`Delivery on the way for ${form.name}`)

}

  return (
    <div>
        <h2>Delivery Details</h2>
        <form onSubmit={handleSubmit}>
        <label>Full-name: </label>
        <input
        name='name' 
        type="text"
        value={form.name}
        onChange={handeleChange}
        placeholder='Your Name'
        required
        />
        <br />
        <label>Phone: </label>
        <input 
        name='phone'
        type="text"
        value={form.price}
        onChange={handeleChange}
        placeholder='Your Phone'
        required
        />
        <br />
       <select name='area' value={form.area} onChange={handeleChange}>
        <option value="Ayat">Ayat</option>
        <option value="Summit">Summit</option>
        <option value="Gerji">Gerji</option>
        <option value="Bole">Bole</option>
       </select>
       <br />
       <button type='submit' disabled= {isValid}>Submit</button>
        </form>
        
    </div>
  )
}
export default OrderForm