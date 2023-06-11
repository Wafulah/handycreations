import React, { useCallback, useMemo, useState } from "react";
import Head from "next/head";
import { subDays, subHours } from "date-fns";
import { useRouter } from "next/router";
import ArrowDownOnSquareIcon from "@heroicons/react/24/solid/ArrowDownOnSquareIcon";
import ArrowUpOnSquareIcon from "@heroicons/react/24/solid/ArrowUpOnSquareIcon";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import { Box, Button, Container, Stack, Typography, TablePagination } from "@mui/material";
import { useSelection } from "src/hooks/use-selection";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { AllOrders } from "src/sections/orders/orders_all";
import { OrdersSearch } from "src/sections/orders/order_search";
import { applyPagination } from "src/utils/apply-pagination";

const now = new Date();

const data = [
  // Order data
];

const useOrders = (page, rowsPerPage) => {
  return useMemo(() => {
    return applyPagination(data, page, rowsPerPage);
  }, [page, rowsPerPage]);
};

const useOrderIds = (orders) => {
  return useMemo(() => {
    return orders.map((order) => order.id);
  }, [orders]);
};

const Page = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const orders = useOrders(page, rowsPerPage);
  const orderIds = useOrderIds(orders);
  const orderSelection = useSelection(orderIds);
  const router = useRouter();

  const handlePageChange = useCallback((event, newPage) => {
    setPage(newPage);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset page to 0 when rows per page is changed
  }, []);

  const handleAddOrder = () => {
    router.push("/orders");
  };

  return (
    <>
      <Head>
        <title>Orders | Handy Creations</title>
      </Head>
      <Box component="main" sx={{ flexGrow: 1, py: 8 }}>
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">Orders</Typography>
                <Stack alignItems="center" direction="row" spacing={1}>
                  <Button color="inherit" startIcon={<ArrowUpOnSquareIcon />}>
                    Import
                  </Button>
                  <Button color="inherit" startIcon={<ArrowDownOnSquareIcon />}>
                    Export
                  </Button>
                </Stack>
              </Stack>
              <div>
                <Button startIcon={<PlusIcon />} variant="contained" onClick={handleAddOrder}>
                  Add
                </Button>
              </div>
            </Stack>
            {/* Order Search component goes here */}
            <OrdersSearch />
            <AllOrders
              sx={{ mt: 3 }}
              count={data.length}
              items={orders}
              onDeselectAll={orderSelection.handleDeselectAll}
              onDeselectOne={orderSelection.handleDeselectOne}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              onSelectAll={orderSelection.handleSelectAll}
              onSelectOne={orderSelection.handleSelectOne}
              page={page}
              rowsPerPage={rowsPerPage}
              selected={orderSelection.selected}
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
