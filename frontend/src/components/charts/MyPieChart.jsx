import { React, useEffect, useState } from "react";
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';
import { cheerfulFiestaPaletteLight, mangoFusionPalette, rainbowSurgePaletteLight } from "@mui/x-charts";

export default function MyPieChart({myData}) {

  return (
    <>
        <PieChart
            series={[
              {
                arcLabel: (item) => `${item.value}%`,
                data: myData || []
                ,
              },
            ]}
            sx={{
              [`& .${pieArcLabelClasses.root}`]: {
                fill: 'white',
                fontSize: 14,
              },
            }}
            width={200}
            height={200}
            colors={mangoFusionPalette}
          />
    </>
    
  );
}
