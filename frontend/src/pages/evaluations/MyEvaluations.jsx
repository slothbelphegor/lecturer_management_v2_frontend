import { useMemo, useState, useEffect } from "react";
import { Box, Typography, IconButton, Chip } from "@mui/material";
import { Link } from "react-router-dom";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { useParams } from "react-router-dom";

import EditIcon from "@mui/icons-material/Edit";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import DeleteIcon from "@mui/icons-material/Delete";
import AddBoxIcon from '@mui/icons-material/AddBox';
import BookIcon from '@mui/icons-material/Book';
import MyButton from "../../components/forms/MyButton";


import getUserRole from "../../components/GetUserRole.jsx";
import AxiosInstance from "../../components/AxiosInstance";

const MyEvaluations = () => {

  const params = useParams();
  const lecturer_id = params.id;
  const role = getUserRole();
  //data and fetching state
  const [currentLecturer, setCurrentLecturer] = useState({});
  const [evaluations, setEvaluations] = useState([]);
 
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
        accessorKey: "title",
        header: "Tiêu đề",
        size: 180,
      },
      {
        accessorKey: "date",
        header: "Ngày đánh giá",
        size: 40,
      },
      {
        accessorKey: "type",
        header: "Loại đánh giá",
        size: 40,
      },
    
    ],
    []
  );

  useEffect(() => {
    const fetchData = async () => {
      if (!evaluations.length) {
        setIsLoading(true);
      } else {
        setIsRefetching(true);
      }
      const url = new URL(`evaluations/me/`, AxiosInstance.defaults.baseURL);

      // Add pagination parameters
      url.searchParams.append("page", pagination.pageIndex + 1); // Django uses 1-based pagination
      url.searchParams.append("page_size", pagination.pageSize);

      // Add sorting parameters
      if (sorting.length) {
        const sort = sorting
          .map((sort) => {
            return sort.desc ? `-${sort.id}` : sort.id;
          })
          .join(",");
        url.searchParams.append("ordering", sort);
      }

      // Add filtering parameters
      if (globalFilter) {
        url.searchParams.append("search", globalFilter);
      }

      // Add column filters
      columnFilters.forEach((filter) => {
        url.searchParams.append(filter.id, filter.value);
      });

      try {
        const response = await AxiosInstance.get(url);
        const json = response.data;
        console.log(json)
        // Handle paginated response from DRF
        if (json.results && json.count !== undefined) {
          setEvaluations(json.results);
          setRowCount(json.count); // Total number of records
        } else {
          setEvaluations(json);
          setRowCount(json.length);
        }
      } catch (error) {
        setIsError(true);
        console.error("Error fetching evaluations:", error);
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
    data: evaluations,
    getRowId: (row) => row.id,
    initialState: {
      showColumnFilters: false,
      columnVisibility: {
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
          children: "Error loading evaluations data",
        }
      : undefined,
    enableExpanding: true,
    renderDetailPanel: ({ row }) => (
      <Box sx={{ padding: 2 }}>
            <Typography variant="h6" gutterBottom>
              {row.original.title || "N/A"}
            </Typography>
            <Typography variant="body2">
              {row.original.content || "N/A"}
            </Typography>
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
            Your Evaluations
          </Typography>
        </Box>
        
      </Box>
      <MaterialReactTable table={table} />
    </>
  );
};

export default MyEvaluations;
