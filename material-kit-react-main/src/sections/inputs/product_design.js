import { useState, useEffect } from "react";
import axios from "axios";
import {
  Avatar,
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
  Popover,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
  FormControlLabel,
  Switch, // Import the Switch component
} from "@mui/material";

export const DesignProduct = () => {
  const [values, setValues] = useState({
    pic: null, // Set as null initially or provide a default image path if needed
    name: "",
   
    date: "", // Set as an empty string initially
    featured: true, // Set to false by default
  });
  const [isSubmitted, setIsSubmitted] = useState(false);


  //featured
  // Function to handle changes to the featured state
  const handleFeaturedChange = (event) => {
    setValues((prevState) => ({
      ...prevState,
      featured: event.target.checked,
    }));
  };
  //featured
  const handleChange = (event) => {
    setValues((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };

  // Function to handle file upload and set the image to 'pic'
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setValues((prevState) => ({
      ...prevState,
      pic: file,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("pic", values.pic); // Append the pic file
    formData.append("name", values.name);
    formData.append("date", values.date);
    formData.append("featured", values.featured);
   
    

    console.log(formData);
    console.log(formData.get("pic")); // Check the value of the 'pic' property
    console.log(formData.get("name")); // Check the value of the 'name' property
    console.log(formData.get("date")); // Check the value of the 'date' property
    console.log(formData.get("featured")); // Check the value of the 'featured' property
   
    axios
      .post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/designs/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Set the correct content type for file uploads
        },
      })
      .then((response) => {
        console.log("Order created successfully:", response.data);
        // Reset form fields
        resetForm();

        // Show success message
        setIsSubmitted(true);
      })
      .catch((error) => {
        console.error("Error creating order:", error);
      });
  };

  const resetForm = () => {
    setValues({
      pic: null, // Set as null initially or provide a default image path if needed
      name: "",
     
      date: "", // Set as an empty string initially
      featured: false, // Set to false by default
    });
  };
  const userss = {
    avatar: "/assets/avatars/avatar-anika-visser.png",
    city: "Los Angeles",
    country: "USA",
    jobTitle: "Senior Developer",
    name: "Anika Visser",
    timezone: "GTM-7",
  };

  return (
    <form autoComplete="off" noValidate onSubmit={handleSubmit}>
      <Card>
        <CardHeader subheader="The information can be edited" title="Add Home Products" />
        <Card>
          <CardContent>
            <Box
              sx={{
                alignItems: "center",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Avatar
                src={values.pic ? URL.createObjectURL(values.pic) : userss.avatar} // Display the uploaded image or the default avatar
                sx={{
                  height: 80,
                  mb: 2,
                  width: 80,
                }}
              />
            </Box>
          </CardContent>
          <Divider />
          <CardActions>
            <Button component="label" fullWidth variant="text">
              Upload picture
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
            </Button>
          </CardActions>
        </Card>
      </Card>
      <Card>
        <CardContent sx={{ pt: 0 }}>
          <Box sx={{ m: -1.5 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="name"
                  name="name"
                  onChange={handleChange}
                  type="string"
                  value={values.name}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Date"
                  name="date"
                  onChange={handleChange}
                  type="date"
                  value={values.date}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={<Switch checked={values.featured} onChange={handleFeaturedChange} />}
                  label="Featured"
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
