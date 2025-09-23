import * as React from 'react';
import {Grid, Box} from '@mui/material';

export default function MyChartBox(props) {
  const {icon1, title1, chart1, icon2, title2, chart2, icon3, title3, chart3} = props;
  return (
    <>
    <Grid container
        sx={{width: "100%", display: "flex", minHeight: "200px", boxShadow: 3, justifyContent: "space-evenly"}}>
            {chart1 ? 
            <Grid 
              item xs={12} sm={12} md={6} lg={4}
              sx={{
                minHeight: "200px",
                padding: "20px",
                width: "100%",
              }}>
                <Box sx={{
                  marginBottom: "20px",
                  fontWeight: "bold",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: "10px"
                }}>
                  <Box>{icon1}</Box>
                  <Box>{title1}</Box>
                </Box>
                <Box>{chart1}</Box>

            </Grid>
            : null}
            {chart2 ? 
            <Grid 
              item xs={12} sm={12} md={6} lg={4}
              sx={{
                minHeight: "200px",
                padding: "20px",
              }}>
                <Box sx={{
                  marginBottom: "20px",
                  fontWeight: "bold",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: "10px"
                }}>
                  <Box>{icon2}</Box>
                  <Box>{title2}</Box>
                </Box>
                <Box>{chart2}</Box>

            </Grid>
            : null}
            {chart3 ? 
            <Grid 
              item xs={12} sm={12} md={6} lg={4}
              sx={{
                minHeight: "200px",
                padding: "20px",
              }}>
                <Box sx={{
                  marginBottom: "20px",
                  fontWeight: "bold",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: "10px"
                }}>
                  <Box>{icon3}</Box>
                  <Box>{title3}</Box>
                </Box>
                <Box>{chart3}</Box>

            </Grid>
            : null}
            
    </Grid>
    </>
  );
}
