import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import PropTypes from "prop-types";
import Link from "next/link";
import Image from "next/image";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardHeader,
  Divider,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  TablePagination,
} from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import { SeverityPill } from "src/components/severity-pill";
import { useSnapshot } from "valtio";
import { store } from "./store";

const statusMap = {
  DELIVERED: "success",
  PENDING: "warning",
  REFUNDED: "error",
};

const paymentStatusMap = {
  PAID_FULL: "success",
  PAID_PARTIAL: "warning",
  NOT_PAID: "error",
};

export const AllOrders = (props) => {
  const { sx } = props;
  // const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const snapshot = useSnapshot(store);

  const fetchData = () => {
    fetch("http://localhost:8000/backend/api/orders/")
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Response not OK");
        }
      })
      .then((data) => {
        // Update the orders in the store using setOrders function
        store.setOrders(data);
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset page to 0 when rows per page is changed
  };

  return (
    <Card sx={sx}>
      <Button color="inherit" onClick={fetchData}>
        <CardHeader title="All Orders" />
      </Button>
      <Scrollbar sx={{ flexGrow: 1 }}>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Edit</TableCell>
                <TableCell>Order</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Payment Status</TableCell>
                <TableCell>Amount Paid</TableCell>
                <TableCell>Cost</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Profit</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {snapshot.orders
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((order) => {
                  const createdAt = format(new Date(order.date), "dd/MM/yyyy");

                  return (
                    <TableRow hover key={order.order_number}>
                      <TableCell sx={{
                            
                            backgroundColor: "#4ddbff", // Light blue background color
                           
                          }}>
                        <Link
                          href={`/order-update/${order.order_number}`}
                          
                        >   
                          <Image src="/pencile.svg" width={20} height={20} alt="edit"  />
                          
                        </Link>
                      </TableCell>
                      <TableCell>{order.order_number}</TableCell>
                      <TableCell>{order.customer}</TableCell>
                      <TableCell>{createdAt}</TableCell>
                      <TableCell>
                        <SeverityPill color={statusMap[order.status]}>{order.status}</SeverityPill>
                      </TableCell>
                      <TableCell>
                        <SeverityPill color={paymentStatusMap[order.payment_status]}>
                          {order.payment_status}
                        </SeverityPill>
                      </TableCell>
                      <TableCell>{order.amount_paid}</TableCell>
                      <TableCell>{order.cost}</TableCell>
                      <TableCell>{order.price}</TableCell>
                      <TableCell>{order.profit}</TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
      <Divider />
      <CardActions sx={{ justifyContent: "flex-end" }}>
        <TablePagination
          component="div"
          count={snapshot.orders.length}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </CardActions>
    </Card>
  );
};

AllOrders.propTypes = {
  sx: PropTypes.object,
};
