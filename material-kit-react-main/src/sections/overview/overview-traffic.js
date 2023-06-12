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
    const fetchServices = async () => {
      try {
        const response = await fetch("https://handycreations.co.ke/backend/api/services/");
        const data = await response.json();
        // const series = data.map((service) => service.percentage);
        
        setChartSeries(data);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
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
