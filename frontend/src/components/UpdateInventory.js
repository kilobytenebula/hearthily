import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../UpdateInventory.css';

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
                const response = await axios.get(`http://localhost:8070/inventory/${inventoryId}`);
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
            await axios.put(`http://localhost:8070/inventory/update/${inventoryId}`, {
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
        <div className='inventory-container'>
            <div className='title-container'>Update Inventory</div>
            {isLoading ? (
                <div>Loading...</div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div className='inventory-item-container'>
                        <label htmlFor="ingredient">Ingredient:</label>
                        <input
                            type="text"
                            id="ingredient"
                            name="ingredient"
                            value={ingredient || ''}
                            onChange={e => setIngredient(e.target.value)}
                        />

                    </div>
                    <div className='inventory-item-container'>
                        <label htmlFor="qty">Quantity:</label>
                        <input
                            type="number"
                            id="qty"
                            name="qty"
                            value={qty || ''}
                            min={0}
                            onChange={e => setQty(e.target.value)}
                        />
                    </div>
                    {error && <div className="error">{error}</div>}
                    <button type="submit">Update Inventory</button>
                    <button type="button" onClick={handleCancel}>Cancel</button>
                </form>
            )}
        </div>
    );
    
}
