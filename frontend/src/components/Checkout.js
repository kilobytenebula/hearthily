import React, {useEffect} from "react";
import { useParams } from "react-router-dom";

export default function Checkout(){
    const {baseName, basePrice, selectedPortions, total} = useParams();
    const parsedPortions = JSON.parse(selectedPortions);

    return(
        <div className="container">
            <div className="content">
                <h4>Main Dish: {baseName} </h4>
                <h4>Price: {basePrice} </h4>
                <h4>Portions: </h4>
                <ul>
                    {parsedPortions.map((portion, index) => (
                    <li key={index}>
                        <p>Name: {portion.name}</p>
                        <p>Price: {portion.price}</p>
                    </li>
                    ))}
                </ul>
                <h4>Total: {total}</h4>
            </div>
        </div>
    )
}