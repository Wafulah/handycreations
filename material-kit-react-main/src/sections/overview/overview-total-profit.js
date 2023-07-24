import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import CurrencyDollarIcon from '@heroicons/react/24/solid/CurrencyDollarIcon';
import { Avatar, Card, CardContent, Stack, SvgIcon, Typography } from '@mui/material';

export const OverviewTotalProfit = (props) => {
  const { sx } = props;
  const [value, setValue] = useState('');

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
          setValue((data[0]?.total_profit / 1000).toFixed(2));
        })
        .catch((error) => {
          console.log('Error:', error);
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
              Total Profit
            </Typography>
            <Typography variant="h4">{value}</Typography>
          </Stack>
          <Avatar sx={{ backgroundColor: 'primary.main', height: 56, width: 56 }}>
            <SvgIcon>
              <CurrencyDollarIcon />
            </SvgIcon>
          </Avatar>
        </Stack>
      </CardContent>
    </Card>
  );
};

OverviewTotalProfit.propTypes = {
  sx: PropTypes.object,
};
