import React, { useState } from "react";
import Head from "next/head";
import { Button, Box, Container, Stack, Typography, Unstable_Grid2 as Grid } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { HomeProduct } from "src/sections/inputs/product_home";
import { DesignProduct } from "src/sections/inputs/product_design";
import { InteriorProduct } from "src/sections/inputs/product_interior";

const PageContent = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  return (
    <>
      <Head>
        <title>Products | Handy Creations</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={3}>
            <div>
              <Typography variant="h4">Add Product</Typography>
              <Grid xs={12} md={6} lg={4}>
                {/* Buttons for each category */}
                <Button variant="contained" onClick={() => handleCategoryClick("Home")}>
                  Home
                </Button>
                <Button variant="contained" onClick={() => handleCategoryClick("Design")}>
                  Design
                </Button>
                <Button variant="contained" onClick={() => handleCategoryClick("Interior")}>
                  Interior
                </Button>
              </Grid>
            </div>
            <div>
              <Grid container spacing={3}>
                <Grid xs={12} md={6} lg={4}></Grid>
                <Grid xs={12} md={6} lg={8}>
                  {selectedCategory === "Home" && <HomeProduct />}
                  {selectedCategory === "Design" && <DesignProduct />}
                  {selectedCategory === "Interior" && <InteriorProduct />}
                </Grid>
              </Grid>
            </div>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

const Page = () => (<PageContent />);
Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
