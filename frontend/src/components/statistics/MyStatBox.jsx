import * as React from 'react';
import {Grid, Box} from '@mui/material';

export default function MyStatBox(props) {
  const {icon1, title1, stat1, icon2, title2, stat2, icon3, title3, stat3} = props;
  return (
    <>
    <Grid container
        sx={{width: "100%", display: "flex", flexDirection: "row", minHeight: "200px", boxShadow: 3, justifyContent: "space-evenly"}}>
            {stat1 ? 
            <Grid 
              item xs={12} sm={12} md={6} lg={4}
              sx={{
                minHeight: "200px",
                padding: "20px",
                display: "flex",
                flexDirection: "column"
                
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
                <Box sx={{
                    fontSize: "2rem", // Larger font
                    fontWeight: "bold",
                    color: "#1976d2", // Optional: accent color
                    marginTop: "5px",
                    marginBottom: "10px",
                    alignSelf: "center"
                  }}>
                    {stat1}
                </Box>

            </Grid>
            : null}
            {stat2 ? 
            <Grid 
              item xs={12} sm={12} md={6} lg={4}
              sx={{
                minHeight: "200px",
                padding: "20px",
                flexDirection: "column",
                display: "flex"
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
                <Box sx={{
                    fontSize: "2rem", // Larger font
                    fontWeight: "bold",
                    color: "#1976d2", // Optional: accent color
                    marginTop: "5px",
                    marginBottom: "10px",
                    alignSelf: "center"
                  }}>
                    {stat2}
                </Box>

            </Grid>
            : null}
            {stat3 ? 
            <Grid 
              item xs={12} sm={12} md={6} lg={4}
              sx={{
                minHeight: "200px",
                padding: "20px",
                flexDirection: "column",
                display: "flex"
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
                <Box sx={{
                    fontSize: "2rem", // Larger font
                    fontWeight: "bold",
                    color: "#1976d2", // Optional: accent color
                    marginTop: "5px",
                    marginBottom: "10px",
                    alignSelf: "center"
                  }}>
                    {stat3}
                </Box>

            </Grid>
            : null}
            
    </Grid>
    </>
  );
}
