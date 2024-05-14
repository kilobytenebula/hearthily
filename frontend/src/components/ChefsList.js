import React, { useEffect, useState } from "react";
import DocumentTitle from "./DocumentTitle";
import "../css/chefsList.css";
import ChefsListReport from "./ChefsListReport";

export default function ChefsList() {
  const [allChefs, setAllChefs] = useState([]);
  
  DocumentTitle("Chefs List");

  const fetchChefs = async () => {
    try {
      const response = await fetch("http://localhost:3500/kitchenChef/chefs");
      const data = await response.json();
      setAllChefs(data);
    } catch (error) {
      console.error("Error fetching chefs:", error);
    }
  };

  useEffect(() => {
    fetchChefs();
  }, []);

  return (
    <div className="delivery-container-main">
      <div className="top-bar">
        <div className="container-title-text">Chefs List</div>
      </div>
      <ChefsListReport chefs={allChefs} />
        <div className="chef-container">
        <div className="fields-chef">
                <ul>
                  <li className="chef-id">Chef ID</li>
                  <li className="chef-name">Chef Name</li>
                  <li className="orders-comp">Orders Completed</li>
                </ul>
              </div>
        <div className="delivery-container">
          {allChefs.map((chef, index) => (
            <div className="item-delivery" key={index}>
              <ul>
                <li className="chef-id">{chef.chef_id}</li>
                <li className="chef-name">{chef.chef_name}</li>
                <li className="orders-comp">{chef.orders_completed}</li>
              </ul>
            </div>
          ))}
        </div>
        </div>
      </div>
  );
}
