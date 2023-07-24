import ArrowUpOnSquareIcon from "@heroicons/react/24/solid/ArrowUpOnSquareIcon";
import React, { useState } from 'react';
import { Button, Popover, List, ListItem, ListItemButton } from '@mui/material';

import { store } from './store';



export const Payment = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  const paymentOptions = [
    'PAID_FULL',
    'PAID_PARTIAL',
    'NOT_PAID',
  ];

  const handlePaymentButtonClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePaymentOptionClick = (payment) => {
    setAnchorEl(null);
    // Send the post request to fetch orders with the selected payment
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/payment-orders/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ payment_status: payment }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Response not OK');
        }
        return response.json();
      })
      .then((data) => {
        // Update the orders in the store using setOrders function from valtio
        store.setOrders(data);
      })
      .catch((error) => {
        console.log('Error:', error);
      });
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button color="inherit" startIcon={<ArrowUpOnSquareIcon />} onClick={handlePaymentButtonClick}>
        Payment
      </Button>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <List>
          {paymentOptions.map((payment) => (
            <ListItem key={payment}>
              <ListItemButton onClick={() => handlePaymentOptionClick(payment)}>
                {payment}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Popover>
    </div>
  );
};
