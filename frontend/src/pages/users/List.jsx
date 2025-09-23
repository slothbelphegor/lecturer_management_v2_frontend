import { React, useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";

import AxiosInstance from "../../components/AxiosInstance";

import { Box, Chip, IconButton, Typography } from "@mui/material";
import CalendarViewMonthIcon from "@mui/icons-material/CalendarViewMonth";
import InfoIcon from '@mui/icons-material/Info';
import DeleteIcon from "@mui/icons-material/Delete";
import AddBoxIcon from '@mui/icons-material/AddBox';
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import MyButton from "../../components/forms/MyButton";
import { MaterialReactTable } from "material-react-table";

const ListUser = () => {
  const [users, setUsers] = useState([]);
  const [lecturers, setLecturers] = useState([])
  const [groups, setGroups] = useState([])
  // Su dung Axios lay du lieu tu backend
  const getData = () => {
    AxiosInstance.get("users/").then((res) => {
      setUsers(res.data);
    });
    AxiosInstance.get("groups/").then((res) => {
      setGroups(res.data)
      console.log(res.data)
    })
    
  };
  // Lay du lieu ngay khi tai trang
  useEffect(() => {
    getData();
  }, []); 
  // Khai bao cac cot của bang
  const columns = useMemo(
    () => [
      {
        accessorKey: "username",
        header: "Tên tài khoản",
      },
      {
        accessorKey: "email",
        header: "Email",
      },
      {
        accessorKey: "groups",
        header: "Loại tài khoản",
        Cell: ({ cell }) => {
          const groupIds = cell.getValue();
          if (!groupIds || !Array.isArray(groupIds)) return "—";
          const groupNames = groupIds
            .map(id => groups.find(g => g.id === id)?.name)
            .filter(Boolean);
          return groupNames.length ? groupNames.join(", ") : "—";
        }
      },
      {
      accessorKey: "lecturer_str",
      header: "Thuộc về giảng viên",
      Cell: ({ cell }) => cell.getValue() || "—",
    }
    ],
    [groups]
  );

  

  return (
    <div>
      <Box
        className="topbar"
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <CalendarViewMonthIcon />
          <Typography
            sx={{ marginLeft: "15px", fontWeight: "bold" }}
            variant="subtitle2"
          >
            Account List
          </Typography>
        </Box>
        <Box>
          <MyButton
            type="button"
            startIcon={<AddBoxIcon/>}
            label="Add New Account"
            onClick={() => {
              window.location.href = `/users/create`;
            }}
          />
        </Box>
      </Box>
      <MaterialReactTable
        columns={columns}
        data={users} // Nap du lieu vao bang
        initialState={{
          columnVisibility: {
            email: false,
          },
        }}
        enableRowActions
        positionActionsColumn={"last"}
        renderRowActions={({ row }) => (
          <Box sx={{ display: "flex", flexWrap: "nowrap", gap: "8px" }}>
            <IconButton
              color="primary"
              component={Link}
              to={`/users/edit/${row.original.id}`}
            >
              <InfoIcon />
            </IconButton>
            <IconButton
              color="error"
              component={Link}
              to={`/users/delete/${row.original.id}`}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        )}
        enableExpanding
        renderDetailPanel={({ row }) => (
          <Box sx={{ padding: 2, display: "flex", flexDirection: "column" }}>
            <Typography variant="h6">Thông tin chi tiết</Typography>
            <Typography variant="body1">
              <strong>Tên tài khoản:</strong> {row.original.username}
            </Typography>
            <Typography variant="body1">
              <strong>Email:</strong> {row.original.email}
            </Typography>
            <Typography variant="body1">
              <strong>Loại tài khoản:</strong> {groups.find((group) => group.id == row.original.groups)?.name}
            </Typography>
            {row.original.lecturer_str && 
            <Typography variant="body1">
              <strong>Thuộc về giảng viên:</strong> {row.original.lecturer_str}
            </Typography>}
            
          </Box>
        )}
      />
    </div>
  );
};

export default ListUser;
