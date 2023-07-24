import React, { useState } from 'react';
import MagnifyingGlassIcon from "@heroicons/react/24/solid/MagnifyingGlassIcon";
import { Button, Card, InputAdornment, OutlinedInput, SvgIcon } from "@mui/material";

import { store } from './store';

export const OrdersSearch = () => {
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = () => {
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/search-orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ order_number: searchValue }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Response not OK');
        }
        return response.json();
      })
      .then((data) => {
        // Update the orders in the store using setOrders function
        store.setOrders(data);
      })
      .catch((error) => {
        console.log('Error:', error);
      });
  };

  return (
    <Card sx={{ p: 2 }}>
      <OutlinedInput
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        fullWidth
        placeholder="Search Orders"
        startAdornment={
          <InputAdornment position="start">
            <SvgIcon color="action" fontSize="small">
              <MagnifyingGlassIcon />
            </SvgIcon>
          </InputAdornment>
        }
        sx={{ maxWidth: 500 }}
      />
      <Button sx={{ marginLeft: '10px' }} variant="contained"  onClick={handleSearch}>Search</Button>
    </Card>
  );
};

 