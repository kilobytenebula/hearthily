import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../css/UpdateInventory.css';

export default function UpdateInventory() {
    const { inventoryId } = useParams();
    const [ingredient, setIngredient] = useState('');
    const [qty, setQty] =useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchInventoryItem = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`http://localhost:3500/inventory/${inventoryId}`);
                const inventoryData = response.data;

                setIngredient(inventoryData.inventory.ingredient);
                setQty(inventoryData.inventory.qty);
            } catch (error) {
                console.error('Error fetching inventory item:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchInventoryItem();
    }, [inventoryId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if(!ingredient || !qty){
            alert('Please fill in all fields');
            return;
        }
        try {
            await axios.put(`http://localhost:3500/inventory/update/${inventoryId}`, {
                ingredient,
                qty
            });
            alert('Inventory item updated successfully');
            navigate(`/inventory-record/`);
        } catch (error) {
            console.error('Error updating inventory item:', error);
        }
    };

    const handleCancel = () => {
        navigate(`/inventory-record/`);
    }

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className='inventory-main'>
        <div className='update-inventory-container'>
            <div className='title-container'>Update Inventory</div>
            <div className="form-container">
                {isLoading ? (
                    <div>Loading...</div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className='update-item-container'>
                            <div className='form-label'><label htmlFor="ingredient">Ingredient</label></div>
                            <div className='input-item'>
                                <input
                                    type="text"
                                    id="ingredient"
                                    name="ingredient"
                                    value={ingredient || ''}
                                    onChange={e => setIngredient(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className='update-item-container'>
                            <div className='form-label'><label htmlFor="qty" className='form-label'>Quantity</label></div>
                            <div className='input-item'>
                                <input
                                    type="number"
                                    id="qty"
                                    name="qty"
                                    value={qty || ''}
                                    min={0}
                                    onChange={e => setQty(e.target.value)}
                                />
                            </div>    
                        </div>
                        {error && <div className="error">{error}</div>}
                        <div className='btn-container'>
                            <button type="submit">Update Inventory</button>
                            <button type="button" onClick={handleCancel}>Cancel</button>
                        </div>
                        
                    </form>
                )}
            </div>
            
        </div>
        </div>
    );
    
}
