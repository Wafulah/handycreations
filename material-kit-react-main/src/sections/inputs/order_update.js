import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  MenuItem,
  Grid,
  Typography,
} from "@mui/material";

const statusChoices = [
  { value: "PENDING", label: "Pending" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "REFUNDED", label: "Refunded" },
];

const paymentChoices = [
  { value: "PAID_FULL", label: "Paid in Full" },
  { value: "PAID_PARTIAL", label: "Paid Partially" },
  { value: "NOT_PAID", label: "Not Paid" },
];

export const Order = ({ orderNumber }) => {
  const [values, setValues] = useState({
    order_number: 0,
    customer: 0,
    service: 0,
    date: "",
    status: "",
    payment_status: "",
    amount_paid: "",
    cost: "",
    price: "",
    profit: "",
  });

  // Function to send the POST request when the orderNumber prop changes
  useEffect(() => {
    if (orderNumber) {
      fetch(`http://localhost:8000/backend/api/update_order/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ order_number: orderNumber }),
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Response not OK");
          }
        })
        .then((data) => {
          // Use the response data to set the initial state
          setValues(data);
        })
        .catch((error) => {
          console.log("Error:", error);
        });
    }
  }, [orderNumber]);

  const [isSubmitted, setIsSubmitted] = useState(false);
  const router = useRouter();

  const handleChange = (event) => {
    setValues((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    axios
      .post("http://localhost:8000/backend/api/update/", values)
      .then((response) => {
        console.log("Order created successfully:", response.data);

        // Reset form fields
        resetForm();

        // Show success message
        setIsSubmitted(true);
        // Navigate to /all_orders after successful form submission
        router.push("/all_orders");
      })
      .catch((error) => {
        console.error("Error creating order:", error);
      });
  };

  const resetForm = () => {
    setValues({
      order_number: 0,
      customer: 0,
      service: 0,
      date: "",
      status: "",
      payment_status: "",
      amount_paid: "",
      cost: "",
      price: "",
      profit: "",
    });
  };

  return (
    <form autoComplete="off" noValidate onSubmit={handleSubmit}>
      <Card>
        <CardHeader subheader="The information can be edited" title="Order Details" />
        <CardContent sx={{ pt: 0 }}>
          <Box sx={{ m: -1.5 }}>
            <Grid container spacing={3}>
             
             
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Status"
                  name="status"
                  onChange={handleChange}
                  required
                  select
                  SelectProps={{ native: true }}
                  value={values.status}
                >
                  {statusChoices.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Payment Status"
                  name="payment_status"
                  onChange={handleChange}
                  required
                  select
                  SelectProps={{ native: true }}
                  value={values.payment_status}
                >
                  {paymentChoices.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Amount Paid"
                  name="amount_paid"
                  onChange={handleChange}
                  type="number"
                  value={values.amount_paid}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Cost"
                  name="cost"
                  onChange={handleChange}
                  type="number"
                  value={values.cost}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Price"
                  name="price"
                  onChange={handleChange}
                  type="number"
                  value={values.price}
                />
              </Grid>
              
            </Grid>
          </Box>
        </CardContent>
        <Divider />
        <CardActions>
          <Button color="primary" type="submit" variant="contained">
            Save details
          </Button>
        </CardActions>
      </Card>
      {isSubmitted && (
        <Typography variant="body1" sx={{ marginTop: "1rem" }}>
          Success! Your order has been submitted.
        </Typography>
      )}
    </form>
  );
};