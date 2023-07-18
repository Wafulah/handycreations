import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { format } from "date-fns";
import {
  Avatar,
  Box,
  Card,
  Checkbox,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import { getInitials } from "src/utils/get-initials";

export const CustomersTable = (props) => {
  const {
    onDeselectAll,
    onDeselectOne,
    onPageChange = () => {},
    onRowsPerPageChange,
    onSelectAll,
    onSelectOne,
    page = 0,
    rowsPerPage = 0,
    selected = [],
  } = props;

  const [customers, setCustomers] = useState([]);
  const [totalCustomers, setTotalCustomers] = useState(0);

  useEffect(() => {
    const fetchCustomers = () => {
      fetch("https://handycreations.co.ke/api/customers/")
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Response not OK");
          }
        })
        .then((data) => {
          setCustomers(data);
          setTotalCustomers(data.length);
        })
        .catch((error) => {
          console.log("Error:", error);
        });
    };

    fetchCustomers();
  }, []);

  const selectedSome = selected.length > 0 && selected.length < customers.length;
  const selectedAll = customers.length > 0 && selected.length === customers.length;

  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedAll}
                    indeterminate={selectedSome}
                    onChange={(event) => {
                      if (event.target.checked) {
                        onSelectAll?.();
                      } else {
                        onDeselectAll?.();
                      }
                    }}
                  />
                </TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Signed Up</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {customers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((customer) => {
                  const isSelected = selected.includes(customer.id);
                  const createdAt = format(new Date(customer.signed_up), "dd/MM/yyyy");

                  return (
                    <TableRow hover key={customer.id} selected={isSelected}>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isSelected}
                          onChange={(event) => {
                            if (event.target.checked) {
                              onSelectOne?.(customer.id);
                            } else {
                              onDeselectOne?.(customer.id);
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Stack alignItems="center" direction="row" spacing={2}>
                          <Avatar src={customer.avatar}>{getInitials(customer.name)}</Avatar>
                          <Typography variant="subtitle2">{customer.name}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>{customer.email}</TableCell>
                      <TableCell>{customer.location}</TableCell>
                      <TableCell>{customer.phone}</TableCell>
                      <TableCell>{createdAt}</TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
      <TablePagination
        component="div"
        count={totalCustomers}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

CustomersTable.propTypes = {
  onDeselectAll: PropTypes.func,
  onDeselectOne: PropTypes.func,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  onSelectAll: PropTypes.func,
  onSelectOne: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  selected: PropTypes.array,
};
