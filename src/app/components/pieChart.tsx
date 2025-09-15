'use client'
import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { PieChart } from '@mui/x-charts/PieChart';
import { SeriesValueFormatter } from '@mui/x-charts/internals';
// import { mobileAndDesktopOS, valueFormatter } from './webUsageStats';

export default function PieAnimation({branchData,}:any) {
  const [radius, setRadius] = React.useState(50);
  const [itemNb, setItemNb] = React.useState(5);
  const [skipAnimation, setSkipAnimation] = React.useState(false);

  const colors = React.useMemo(() => {
    const onLeave = '#fca029', present = '#7fbc09', absent = '#fc3c29';
    return branchData.map((item: any) => {
      if (item.label === "Present") return present;
      if (item.label === "Absent") return absent;
      if (item.label === "On Leave") return onLeave;
      return '#ccc'; // fallback
    });
  }, [branchData]);

const pieData = branchData.map((item: { value: number; }, index: number) => {  
  const adjustedValue = item.value; // Smaller for even, larger for odd
  return { ...item, value: adjustedValue };
});



  const handleItemNbChange = (event: Event, newValue: number | number[]) => {
    if (typeof newValue !== 'number') {
      return;
    }
    setItemNb(newValue);
  };
  const handleRadius = (event: Event, newValue: number | number[]) => {
    if (typeof newValue !== 'number') {
      return;
    }
    setRadius(newValue);
  };
  // const outerRadiusArray=[155,140,155,140]

  return (
    <Box sx={{ width: '100%'}} > 
      <PieChart
        height={400}
        slotProps={{ legend: { hidden: true } }}
        colors={colors}
        series={[
          {
              data: pieData,
              arcLabel :(item) => `${item.label}`,
              innerRadius: 100,
              outerRadius: 198,
              paddingAngle: 1,
              cornerRadius: 10,
              startAngle: -45,
              // endAngle: 270,
              cx: 195,
              cy: 195,
          },
        ]}
        skipAnimation={false}
      />
    </Box>
  );
}
