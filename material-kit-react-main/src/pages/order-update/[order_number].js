import Head from "next/head";
import { useRouter } from "next/router";
import { Box, Container, Stack, Typography, Unstable_Grid2 as Grid } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { Order } from "src/sections/inputs/order_update";

const Page = () => {
  const router = useRouter();
  const { order_number } = router.query;

  return (
    <>
      <Head>
        <title>Orders | Handy Creations</title>
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
              <Typography variant="h4">Update Order</Typography>
            </div>
            <div>
              <Grid container spacing={3}>
                <Grid xs={12} md={6} lg={4}></Grid>
                <Grid xs={12} md={6} lg={8}>
                  {/* Pass the order_number as a prop to the Order component */}
                  <Order orderNumber={order_number} />
                </Grid>
              </Grid>
            </div>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
