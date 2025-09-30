import AxiosInstance from "../components/AxiosInstance";
import { React, useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import PotentialHome from "./home/PotentialHome.jsx";
import StaffHome from "./home/StaffHome.jsx";
import getUserRole from "../components/GetUserRole";

const Home = () => {
  const role = getUserRole();
  return (
    <div>
      <Box
        className="topbar"
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography
            sx={{ marginLeft: "15px", fontWeight: "bold" }}
            variant="heading"
          >
            Chào mừng bạn đến với hệ thống quản lý giảng viên!
          </Typography>
        </Box>
        <Box></Box>
      </Box>
      {[
        "it_faculty",
        "education_department",
        "supervision_department",
        "lecturer",
      ].includes(role) && <StaffHome />}
      {role === "potential_lecturer" && <PotentialHome />}
    </div>
  );
};

export default Home;
