import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import PropTypes from 'prop-types';
import ArrowRightIcon from '@heroicons/react/24/solid/ArrowRightIcon';
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
  TableRow
} from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';
import { SeverityPill } from 'src/components/severity-pill';
import { useRouter } from 'next/router';

const statusMap = {
  DELIVERED: 'success',
  PENDING: 'warning',
  REFUNDED: 'error'
};

const paymentStatusMap = {
  PAID_FULL: 'success',
  PAID_PARTIAL: 'warning',
  NOT_PAID: 'error'
};

export const OverviewLatestOrders = (props) => {
  const { sx } = props;
  const [orders, setOrders] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8000/backend/api/orders/');
        const data = await response.json();
        setOrders(data.slice(0, 12)); // Limit the orders to twelve
      } catch (error) {
        console.log('Error:', error);
      }
    };

    fetchData();
  }, []);

  const handleViewAll = () => {
    router.push('/all_orders');
  };

  return (
    <Card sx={sx}>
      <CardHeader title="Latest Orders" />
      <Scrollbar sx={{ flexGrow: 1 }}>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  Order
                </TableCell>
                <TableCell>
                  Customer
                </TableCell>
                <TableCell sortDirection="desc">
                  Date
                </TableCell>
                <TableCell>
                  Status
                </TableCell>
                <TableCell>
                  Payment Status
                </TableCell>
                <TableCell>
                  Amount Paid
                </TableCell>
                <TableCell>
                  Cost
                </TableCell>
                <TableCell>
                  Price
                </TableCell>
                <TableCell>
                  Profit
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => {
                const createdAt = format(new Date(order.date), 'dd/MM/yyyy');

                return (
                  <TableRow
                    hover
                    key={order.order_number}
                  >
                    <TableCell>
                      {order.order_number}
                    </TableCell>
                    <TableCell>
                      {order.customer}
                    </TableCell>
                    <TableCell>
                      {createdAt}
                    </TableCell>
                    <TableCell>
                      <SeverityPill color={statusMap[order.status]}>
                        {order.status}
                      </SeverityPill>
                    </TableCell>
                    <TableCell>
                      <SeverityPill color={paymentStatusMap[order.payment_status]}>
                        {order.payment_status}
                      </SeverityPill>
                    </TableCell>
                    <TableCell>
                      {order.amount_paid}
                    </TableCell>
                    <TableCell>
                      {order.cost}
                    </TableCell>
                    <TableCell>
                      {order.price}
                    </TableCell>
                    <TableCell>
                      {order.profit}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
      <Divider />
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Button
          color="inherit"
          endIcon={(
            <SvgIcon fontSize="small">
              <ArrowRightIcon />
            </SvgIcon>
          )}
          size="small"
          variant="text"
          onClick={handleViewAll} // Call handleViewAll function on button click
        >
          View all
        </Button>
      </CardActions>
    </Card>
  );
};

OverviewLatestOrders.propTypes = {
  sx: PropTypes.object
};
