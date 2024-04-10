import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/GetDeliveryInfo.css";
import copy from "clipboard-copy";
const copyicon = require("../icons/copyicon.png");

export default function GetDeliveryInfo() {
  const [delivery, setDelivery] = useState({});
  const [order, setOrder] = useState({});
  const [user, setUser] = useState({});
  const { deliveryId } = useParams();
  const [copyDeliveryId, setCopyDeliveryId] = useState("Copy to clipboard");
  const [undoTimer, setUndoTimer] = useState(15);
  const [tempStatus, setTempStatus] = useState("");
  const timerRef = useRef(null);

  const DELIVERY_STATUS = {
    OF_DELIVERY: "of-delivery",
    ON_DELIVERY: "on-delivery",
    COMPLETED: "completed",
  };

  const navigate = useNavigate();

  const updateOrder = (orderId, status) => {
    axios
      .put(`http://localhost:8070/order/update/${orderId}`, { status })
      .then((response) => {
        console.log(`Order status updated to ${status}`);
      })
      .catch((error) => {
        console.error("Error updating order:", error);
      });
  };

  const addCompletedDelivery = (completedDelivery) => {
    axios
      .post("http://localhost:8070/completeddelivery/add", completedDelivery)
      .then((response) => {
        console.log("Delivery added to completed deliveries:", response.data);
      })
      .catch((error) => {
        console.error("Error adding delivery to completed deliveries:", error);
      });
  };

  const useDeliveryAction = () => {
    const deliveryAction = (deliveryId, action) => {
      const handleError = (error) => {
        console.error("Error updating delivery:", error);
      };

      const updateDeliveryAndFetch = (status) => {
        axios
          .put(`http://localhost:8070/delivery/${deliveryId}`, {
            deliveryStatus: status,
          })
          .then(() => {
            console.log(`Delivery status updated to ${status}`);
            navigate(`/delivery/job/${deliveryId}`);

            // Re-fetch delivery details
            axios
              .get(`http://localhost:8070/delivery/${deliveryId}`)
              .then((response) => {
                setDelivery(response.data.delivery);
              })
              .catch(handleError);
          })
          .catch(handleError);
      };

      if (action === "accept") {
        updateDeliveryAndFetch(DELIVERY_STATUS.ON_DELIVERY);
        updateOrder(delivery.orderId, DELIVERY_STATUS.ON_DELIVERY);
        alert("You accepted a job :)");
      } else if (action === "cancel") {
        updateDeliveryAndFetch(DELIVERY_STATUS.OF_DELIVERY);
        updateOrder(delivery.orderId, DELIVERY_STATUS.OF_DELIVERY);
        alert("You cancelled the job :(");
      } else if (action === "countdown") {
        alert("Congratulations! You completed the job :)");
        setTempStatus("completed");
        startUndoTimer();
      } else if (action === "completed") {
        updateDeliveryAndFetch(DELIVERY_STATUS.COMPLETED);
        updateOrder(delivery.orderId, DELIVERY_STATUS.COMPLETED);
        const completedDelivery = {
          deliveryId: delivery._id,
          userId: delivery.userId,
        };
        addCompletedDelivery(completedDelivery);
      } else if (action === "undo") {
        clearInterval(timerRef.current);
        setTempStatus("");
        setUndoTimer(15); // Reset timer
        alert("You undid the action :(");
      } else {
        console.error("Invalid action:", action);
      }
    };

    return deliveryAction;
  };

  const deliveryAction = useDeliveryAction();

  function handleCopyClick() {
    copy(delivery._id)
      .then(() => {
        setCopyDeliveryId("Copied!");
        setTimeout(() => setCopyDeliveryId(""), 1000);
      })
      .catch(() => {
        setCopyDeliveryId("Error copying!");
      });
  }

  useEffect(() => {
    axios
      .get(`http://localhost:8070/delivery/${deliveryId}`)
      .then((response) => {
        const deliveryData = response.data.delivery;
        setDelivery(deliveryData);
        if (deliveryData.deliveryStatus === DELIVERY_STATUS.COMPLETED) {
          setTempStatus("completed");
          startUndoTimer();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    const fetchOrdersAndUsers = async () => {
      axios
        .get(`http://localhost:8070/order/${delivery.orderId}`)
        .then((response) => {
          const orderData = response.data.order;
          setOrder(orderData);
        })
        .catch((error) => {
          console.log(error);
        });

      axios
        .get(`http://localhost:8070/user/${delivery.userId}`)
        .then((response) => {
          const userData = response.data.user;
          setUser(userData);
        })
        .catch((error) => {
          console.log(error);
        });
    };

    fetchOrdersAndUsers();
  }, [delivery]);

  const startUndoTimer = () => {
    timerRef.current = setInterval(() => {
      setUndoTimer((prevTimer) => prevTimer - 1);
    }, 1000);
  };

  useEffect(() => {
    if (undoTimer === 0) {
      clearInterval(timerRef.current);
      deliveryAction(delivery._id, "completed");
    }
  }, [undoTimer]);

  return (
    <div>
      <div className="top-bar">
        <div className="container-title-text">Delivery Details</div>
      </div>
      {delivery._id ? (
        <div className="delivery-info">
          <div className="delivery-info-container">
            <div className="delivery-header">
              <div className="delivery-id">
                <div>Delivery ID :</div> {delivery._id}
                <div className="copy-container" onClick={handleCopyClick}>
                  <img src={copyicon} alt="copy"></img>
                  <span className="tooltiptext">{copyDeliveryId}</span>
                </div>
              </div>
              <div className="date-time">
                {delivery.date ? (
                  <div>{delivery.date.substring(0, 10)}</div>
                ) : (
                  <div>Beep boop boop...</div>
                )}
              </div>
            </div>
            <div className="user-details">
              <div className="user-name">
                <div>
                  {user.firstname} {user.lastname}
                </div>
              </div>
            </div>
            <div className="delivery-payment-info">
              {delivery.paymentMethod === "Paid" ? (
                <div className="delivery-info-row">
                  <div className="delivery-paid">Paid</div>
                </div>
              ) : (
                <div className="delivery-payment-row">
                  <div>Amount to be Collected :</div>{" "}
                  <div>{order.total_amount}.00 LKR</div>
                </div>
              )}
            </div>
            <div className="action-row">
              {delivery.deliveryStatus === "of-delivery" ? (
                <div
                  className="accept-btn"
                  onClick={() => deliveryAction(delivery._id, "accept")}
                >
                  Accept
                </div>
              ) : (
                delivery.deliveryStatus === "on-delivery" && (
                  <div className="on-delivery-btns">
                    {tempStatus !== "completed" && (
                      <>
                        <div
                          className="cancel-btn"
                          onClick={() => deliveryAction(delivery._id, "cancel")}
                        >
                          Cancel
                        </div>
                        <div
                          className="complete-btn"
                          onClick={() =>
                            deliveryAction(delivery._id, "countdown")
                          }
                        >
                          Mark as Completed
                        </div>
                      </>
                    )}
                    {tempStatus === "completed" && (
                      <div
                        className="undo-btn"
                        onClick={() => deliveryAction(delivery._id, "undo")}
                      >
                        Undo ({undoTimer})
                      </div>
                    )}
                  </div>
                )
              )}
            </div>
          </div>
          <div className="address-container"></div>
        </div>
      ) : (
        <div className="delivery-info-container-info">
          <div className="loading-text">Beep boop boop...</div>
        </div>
      )}
    </div>
  );
}
