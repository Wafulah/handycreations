import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";

export const OverviewTraffic = (props) => {
  const { labels, sx } = props;
  const [chartSeries, setChartSeries] = useState([]);
  const theme = useTheme();

  useEffect(() => {
    const fetchServices = () => {
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/services/`)
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Response not OK');
          }
        })
        .then((data) => {
          setChartSeries(data);
        })
        .catch((error) => {
          console.error("Error fetching services:", error);
        });
    };
  
    fetchServices();
  }, []);
  

  return (
    <Card sx={sx}>
      <CardHeader title="Traffic Source" />
      <CardContent>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography variant="h6">Service</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6">Percentage</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6">Amount</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {chartSeries.map((label) => (
                <TableRow key={label.id}>
                  <TableCell>
                    <Typography>{label.name}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{label.percentage}%</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{label.amount}</Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

OverviewTraffic.propTypes = {
  labels: PropTypes.array.isRequired,
  sx: PropTypes.object,
};
