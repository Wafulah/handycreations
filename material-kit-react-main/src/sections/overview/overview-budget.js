import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import ArrowDownIcon from "@heroicons/react/24/solid/ArrowDownIcon";
import ArrowUpIcon from "@heroicons/react/24/solid/ArrowUpIcon";
import CurrencyDollarIcon from "@heroicons/react/24/solid/CurrencyDollarIcon";
import { Avatar, Card, CardContent, Stack, SvgIcon, Typography } from "@mui/material";

export const OverviewBudget = (props) => {
  const { difference, positive = false, sx } = props;
  const [value, setValue] = useState("");

  useEffect(() => {
    const fetchData = () => {
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/aggregated-data/`)
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Response not OK');
          }
        })
        .then((data) => {
          setValue((data[0].total_budget / 1000).toFixed(2));
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
            <Typography color="text.secondary" variant="overline">
              Budget
            </Typography>
            <Typography variant="h4">{value} </Typography>
          </Stack>
          <Avatar
            sx={{
              backgroundColor: "error.main",
              height: 56,
              width: 56,
            }}
          >
            <SvgIcon>
              <CurrencyDollarIcon />
            </SvgIcon>
          </Avatar>
        </Stack>
        {/* {difference && (
          <Stack
            alignItems="center"
            direction="row"
            spacing={2}
            sx={{ mt: 2 }}
          >
            <Stack
              alignItems="center"
              direction="row"
              spacing={0.5}
            >
              <SvgIcon
                color={positive ? 'success' : 'error'}
                fontSize="small"
              >
                {positive ? <ArrowUpIcon /> : <ArrowDownIcon />}
              </SvgIcon>
              <Typography
                color={positive ? 'success.main' : 'error.main'}
                variant="body2"
              >
                {difference}%
              </Typography>
            </Stack>
            <Typography
              color="text.secondary"
              variant="caption"
            >
              Since last month
            </Typography>
          </Stack>
        )} */}
      </CardContent>
    </Card>
  );
};

OverviewBudget.propTypes = {
  difference: PropTypes.number,
  positive: PropTypes.bool,
  sx: PropTypes.object,
};
