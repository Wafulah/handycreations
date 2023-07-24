import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import ListBulletIcon from "@heroicons/react/24/solid/ListBulletIcon";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  LinearProgress,
  Stack,
  SvgIcon,
  Typography,
} from "@mui/material";

export const OverviewTasksProgress = (props) => {
  const { sx } = props;
  const [value, setValue] = useState(0);

  useEffect(() => {
    const fetchData = () => {
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/aggregated-data/`)
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Response not OK");
          }
        })
        .then((data) => {
          setValue(parseFloat(data[0]?.percentage_delivered) || 0);
        })
        .catch((error) => {
          console.log("Error:", error);
        });
    };
  
    fetchData();
  }, []);
  

  return (
    <Card sx={sx}>
      <CardContent>
        <Stack alignItems="flex-start" direction="row" justifyContent="space-between" spacing={3}>
          <Stack spacing={1}>
            <Typography color="text.secondary" gutterBottom variant="overline">
              Task Progress
            </Typography>
            <Typography variant="h4">{value}%</Typography>
          </Stack>
          <Avatar sx={{ backgroundColor: "warning.main", height: 56, width: 56 }}>
            <SvgIcon>
              <ListBulletIcon />
            </SvgIcon>
          </Avatar>
        </Stack>
        <Box sx={{ mt: 3 }}>
          <LinearProgress value={value} variant="determinate" />
        </Box>
      </CardContent>
    </Card>
  );
};

OverviewTasksProgress.propTypes = {
  sx: PropTypes.object,
};
