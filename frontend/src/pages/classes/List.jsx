import { useMemo, useState, useEffect } from "react";
import { Box, Typography, IconButton, Grid } from "@mui/material";
import { Link } from "react-router-dom";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

import ArticleIcon from "@mui/icons-material/Article";
import EditIcon from "@mui/icons-material/Edit";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import DeleteIcon from "@mui/icons-material/Delete";
import AddBoxIcon from '@mui/icons-material/AddBox';
import SchoolIcon from '@mui/icons-material/School';

import MyButton from "../../components/forms/MyButton";
import AxiosInstance from "../../components/AxiosInstance";
import URLWithFilters from "../../components/URLWithFilters";

const ListClass = () => {

  //data and fetching state
  const [classes, setClasses] = useState([]);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);
  const [rowCount, setRowCount] = useState(0);

  //table state
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });

  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        size: 250,
      },
      {
        accessorKey: "course_name",
        header: "Course",
      },
      {
        accessorKey: "lecturer_name",
        header: "Lecturer",
      },
      {
        accessorKey: "year",
        header: "Year",
      },
      {
        accessorKey: "semester",
        header: "Semester",
      },
      
    ],
    []
  );

  

  useEffect(() => {
    const fetchData = async () => {
      if (!classes.length) {
        setIsLoading(true);
      } else {
        setIsRefetching(true);
      }

      const url = URLWithFilters({
        baseURL: "classes/",
        globalFilter,
        columnFilters,
        pagination,
        sorting,
      });

      try {
        const response = await AxiosInstance.get(url);
        const json = response.data;
        console.log(url)
        // Handle paginated response from DRF
        if (json.results && json.count !== undefined) {
          setClasses(json.results);
          setRowCount(json.count); // Total number of records
        } else {
          setClasses(json);
          setRowCount(json.length);
        }
      } catch (error) {
        setIsError(true);
        console.error("Error fetching classes:", error);
        return;
      }
      setIsError(false);
      setIsLoading(false);
      setIsRefetching(false);
    };

    fetchData();
  }, [
    columnFilters, //re-fetch when column filters change
    globalFilter, //re-fetch when global filter changes
    pagination.pageIndex, //re-fetch when page index changes
    pagination.pageSize, //re-fetch when page size changes
    sorting, //re-fetch when sorting changes
  ]);

  const table = useMaterialReactTable({
    columns,
    data: classes,
    getRowId: (row) => row.id,
    initialState: {
      showColumnFilters: false,
      columnVisibility: {
        published_at: false,
        valid_at: false,
        published_by: false,
        signed_by: false,
      },
    },
    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    rowCount: rowCount,
    muiToolbarAlertBannerProps: isError
      ? {
          color: "error",
          children: "Error loading classes",
        }
      : undefined,
    // enableExpanding: true,
    // renderDetailPanel: ({ row }) => (
    //   <Box sx={{ padding: 2 }}>
    //     <Grid container spacing={2}>
    //       <Grid item xs={6}>
    //         <Typography variant="body2">
    //           <strong>Published at:</strong>{" "}
    //           {row.original.published_at
    //             ? new Date(row.original.published_at).toDateString()
    //             : "N/A"}
    //         </Typography>
    //         <Typography variant="body2">
    //           <strong>Valid at:</strong>{" "}
    //           {row.original.valid_at
    //             ? new Date(row.original.valid_at).toDateString()
    //             : "N/A"}
    //         </Typography>
    //       </Grid>
    //       <Grid item xs={6}>
    //         <Typography variant="body2">
    //           <strong>Published by:</strong>{" "}
    //           {row.original.published_by ? row.original.published_by : "N/A"}
    //         </Typography>
    //         <Typography variant="body2">
    //           <strong>Signed by:</strong>{" "}
    //           {row.original.signed_by ? row.original.signed_by : "N/A"}
    //         </Typography>
    //       </Grid>
    //     </Grid>
    //   </Box>
    // ),
    enableRowActions: true,
    positionActionsColumn: "last",
    renderRowActions: ({ row, table }) => (
      <Box sx={{ display: "flex", flexWrap: "nowrap", gap: "8px" }}>
      
            
            <>
            <IconButton
              color="primary"
              component={Link}
              to={`/classes/edit/${row.original.id}`}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              color="error"
              component={Link}
              to={`/classes/delete/${row.original.id}`}
            >
              <DeleteIcon />
            </IconButton>
            </>
            
          </Box>
    ),
    state: {
      columnFilters,
      globalFilter,
      isLoading,
      isRefetching,
      pagination,
      showAlertBanner: isError,
      showProgressBars: isRefetching,
      sorting,
    },
  });
  
  return (
    <>
      <Box
        className="topbar"
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <SchoolIcon />
          <Typography
            sx={{ marginLeft: "15px", fontWeight: "bold" }}
            variant="subtitle2"
          >
            List of Classes
          </Typography>
        </Box>
        <Box>
            <MyButton
              type="button"
              label="Add Class"
              startIcon={<AddBoxIcon />}
              onClick={() => {
                window.location.href = `/classes/create`;
              }}
            />
          </Box>
      </Box>
      <MaterialReactTable table={table} />
    </>
  );
};

export default ListClass;
