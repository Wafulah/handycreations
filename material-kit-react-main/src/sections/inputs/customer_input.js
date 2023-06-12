import React, { useState } from "react";
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

const topTenCounties = [
  { value: "Nairobi", label: "County" },
  { value: "Nairobi", label: "Nairobi" },
  { value: "Mombasa", label: "Mombasa" },
  { value: "Kisumu", label: "Kisumu" },
  { value: "Nakuru", label: "Nakuru" },
  { value: "Eldoret", label: "Eldoret" },
  { value: "Nanyuki", label: "Nanyuki" },
  { value: "Naivasha", label: "Naivasha" },
  { value: "Kakamega", label: "Kakamega" },
  { value: "Machakos", label: "Machakos" },
  { value: "Meru", label: "Meru" },
];

export const AddCustomer = () => {
  const [values, setValues] = useState({
    name: "",
    email: "",
    location: "",
    phone: "",
    signed_up: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (event) => {
    setValues((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post("https://handycreations.co.ke/backend/api/customers/", values);
      // console.log("Customer created successfully:", response.data);

      // Reset form fields
      resetForm();

      // Show success message
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error creating customer:", error);
    }
  };

  const resetForm = () => {
    setValues({
      name: "",
      email: "",
      location: topTenCounties[0].value,
      phone: "",
      signed_up: "",
    });
  };

  return (
    <form autoComplete="off" noValidate onSubmit={handleSubmit}>
      <Card>
        <CardHeader subheader="The information can be edited" title="Customer Details" />
        <CardContent sx={{ pt: 0 }}>
          <Box sx={{ m: -1.5 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  onChange={handleChange}
                  required
                  value={values.name}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  onChange={handleChange}
                  required
                  type="email"
                  value={values.email}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Location"
                  name="location"
                  onChange={handleChange}
                  required
                  select
                  SelectProps={{ native: true }}
                  value={values.location}
                >
                  {topTenCounties.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  name="phone"
                  onChange={handleChange}
                  required
                  value={values.phone}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Signed Up"
                  name="signed_up"
                  onChange={handleChange}
                  type="date"
                  value={values.signed_up}
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
          Success! The customer has been added.
        </Typography>
      )}
    </form>
  );
};
