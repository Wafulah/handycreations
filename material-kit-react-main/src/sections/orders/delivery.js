import ArrowUpOnSquareIcon from "@heroicons/react/24/solid/ArrowUpOnSquareIcon";
import React, { useState } from "react";
import { Button, Popover, List, ListItem, ListItemButton } from "@mui/material";

import { store } from "./store";

export const Delivery = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  const deliveryOptions = ["PENDING", "DELIVERED", "REFUNDED"];

  const handleDeliveryButtonClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDeliveryOptionClick = (delivery) => {
    setAnchorEl(null);
    // Send the post request to fetch orders with the selected delivery
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/delivery_status/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: delivery }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Response not OK");
        }
        return response.json();
      })
      .then((data) => {
        // Update the orders in the store using setOrders function from valtio
        store.setOrders(data);
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        color="inherit"
        startIcon={<ArrowUpOnSquareIcon />}
        onClick={handleDeliveryButtonClick}
      >
        delivery
      </Button>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <List>
          {deliveryOptions.map((delivery) => (
            <ListItem key={delivery}>
              <ListItemButton onClick={() => handleDeliveryOptionClick(delivery)}>
                {delivery}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Popover>
    </div>
  );
};
