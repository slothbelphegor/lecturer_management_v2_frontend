import { useMemo, useState, useEffect } from "react";
import { Box, Typography, IconButton, Grid } from "@mui/material";
import { Link } from "react-router-dom";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddBoxIcon from "@mui/icons-material/AddBox";
import BookIcon from "@mui/icons-material/Book";
import MyButton from "../../components/forms/MyButton";
import AxiosInstance from "../../components/AxiosInstance";
import URLWithFilters from "../../components/URLWithFilters";
import getUserRole from "../../components/GetUserRole";

const ListCourse = () => {
  const role = getUserRole();
  //data and fetching state
  const [documents, setDocuments] = useState([]);
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
        size: 150,
      },
      {
        accessorKey: "code",
        header: "Code",
        size: 40,
      },
      {
        accessorKey: "credits",
        header: "Credits",
        size: 40,
      },
    ],
    []
  );

  useEffect(() => {
    const fetchData = async () => {
      if (!documents.length) {
        setIsLoading(true);
      } else {
        setIsRefetching(true);
      }

      const url = URLWithFilters({
        baseURL: "courses/",
        globalFilter,
        columnFilters,
        pagination,
        sorting,
      });

      try {
        const response = await AxiosInstance.get(url);
        const json = response.data;
        // Handle paginated response from DRF
        if (json.results && json.count !== undefined) {
          setDocuments(json.results);
          setRowCount(json.count); // Total number of records
        } else {
          setDocuments(json);
          setRowCount(json.length);
        }
      } catch (error) {
        setIsError(true);
        console.error("Error fetching courses:", error);
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
    data: documents,
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
          children: "Error loading courses",
        }
      : undefined,
    enableExpanding: true,
    renderDetailPanel: ({ row }) => (
      <Box sx={{ padding: 2 }}>
        <Grid container spacing={2}>
          <Grid size={6}>
            <Typography variant="body2">
              {row.original.description || "No description available"}
            </Typography>
          </Grid>
        </Grid>
      </Box>
    ),
    enableRowActions: true,
    positionActionsColumn: "last",
    renderRowActions: ({ row }) =>
      role === "education_department" && (
        <Box sx={{ display: "flex", flexWrap: "nowrap", gap: "8px" }}>
          <IconButton
            color="primary"
            component={Link}
            to={`/courses/edit/${row.original.id}`}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            color="error"
            component={Link}
            to={`/courses/delete/${row.original.id}`}
          >
            <DeleteIcon />
          </IconButton>
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
          <BookIcon />
          <Typography
            sx={{ marginLeft: "15px", fontWeight: "bold" }}
            variant="subtitle2"
          >
            Course List
          </Typography>
        </Box>
        {role === "education_department" && (
          <Box>
            <MyButton
              type="button"
              label="Add New Course"
              startIcon={<AddBoxIcon />}
              onClick={() => {
                window.location.href = `/courses/create`;
              }}
            />
          </Box>
        )}
      </Box>
      <MaterialReactTable table={table} />
    </>
  );
};

export default ListCourse;
