import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import '../css/GetOrder.css';

export default function GetInventory(){
    const [inventory, setInventory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchInventory = async () => {
            setIsLoading(true);
            try{
                const response = await axios.get('http://localhost:8070/inventory/');
                setInventory(response.data);
            }catch (error) {
                console.error('Error fetching orders:', error);
            }finally{
                setIsLoading(false);
            }
        };

        fetchInventory();
    }, []);

    return (
        <div className="order-history">
          <div className="top-bar">
            <div className="container-title-text">Inventory</div>
            {/* <div className="search-container">
              <input type="text" className="search" placeholder='Search..' onChange={Filter} />
            </div> */}
          </div>
          {isLoading ? (
            <div className='loading-orders'>Beep boop boop...</div>
          ) : (
            <div>
              <div className="fields">
                <ul>
                  <li className='meal'>Item ID</li>
                  <li className='meal'>Ingredient</li>
                  <li className='date'>Quantity</li>
                </ul>
              </div>
              <div className="order-container">
                {inventory.length > 0 ? (
                  inventory.map((inventoryItem) => (
                    <div className="item" key={inventoryItem._id}>
                      <Link to={`/inventory-record/inventory/${inventoryItem._id}`} className="item"> 
                        <ul>
                          <li className='meal'>{inventoryItem._id}</li>
                          <li className="meal">{inventoryItem.ingredient}</li>
                          <li className="date">{inventoryItem.qty}kg</li>
                        </ul>
                      </Link>
                    </div>
                  ))
                ) : (
                  <div>No inventory record found.</div>
                )}
              </div>
            </div>
          )}
        </div>
      );
}