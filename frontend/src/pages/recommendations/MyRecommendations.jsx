import { useMemo, useState, useEffect } from "react";
import { Box, Typography, IconButton, Chip } from "@mui/material";
import { Link } from "react-router-dom";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

import ArticleIcon from "@mui/icons-material/Article";
import EditIcon from "@mui/icons-material/Edit";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import DeleteIcon from "@mui/icons-material/Delete";
import AddBoxIcon from "@mui/icons-material/AddBox";
import RecommendIcon from "@mui/icons-material/Recommend";

import MyButton from "../../components/forms/MyButton";
import AxiosInstance from "../../components/AxiosInstance";
import URLWithFilters from "../../components/URLWithFilters";

const MyRecommendations = () => {
  //data and fetching state
  const [recommendations, setRecommendations] = useState([]);
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
        header: "Họ tên",
        size: 180,
      },
      {
        accessorKey: "workplace",
        header: "Nơi công tác ",
        size: 40,
      },
      {
        accessorKey: "recommender_details.name",
        header: "Người đề xuất",
      },
      {
        accessorKey: "course_names",
        header: "Môn học",
        Cell: ({ cell }) => (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {cell.getValue()?.map((char, index) => (
              <Chip key={index} label={char} />
            ))}
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: "Trạng thái",
        size: 40,
      },
    ],
    []
  );

  useEffect(() => {
    const fetchData = async () => {
      if (!recommendations.length) {
        setIsLoading(true);
      } else {
        setIsRefetching(true);
      }

      const url = URLWithFilters({
        baseURL: "recommendations/me/",
        globalFilter,
        columnFilters,
        pagination,
        sorting,
      });

      try {
        const response = await AxiosInstance.get(url);
        const json = response.data;
        console.log(url);
        // Handle paginated response from DRF
        if (json.results && json.count !== undefined) {
          setRecommendations(json.results);
          setRowCount(json.count); // Total number of records
        } else {
          setRecommendations(json);
          setRowCount(json.length);
        }
      } catch (error) {
        setIsError(true);
        console.error("Error fetching recommendations:", error);
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
    data: recommendations,
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
          children: "Error loading recommendations",
        }
      : undefined,
    enableExpanding: true,
    renderDetailPanel: ({ row }) => (
      <Box sx={{ padding: 2 }}>
        <Typography variant="h6" gutterBottom>
          {"Lecturer Description:"}
        </Typography>
        <Typography variant="body2">{row.original.content}</Typography>
      </Box>
    ),
    enableRowActions: true,
    positionActionsColumn: "last",
    renderRowActions: ({ row, table }) => (
      <Box sx={{ display: "flex", flexWrap: "nowrap", gap: "8px" }}>
        <>
          <IconButton
            color="primary"
            component={Link}
            to={`/my_recommendations/edit/${row.original.id}`}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            color="error"
            component={Link}
            to={`/my_recommendations/delete/${row.original.id}`}
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
          <RecommendIcon />
          <Typography
            sx={{ marginLeft: "15px", fontWeight: "bold" }}
            variant="subtitle2"
          >
            Your Lecturer Recommendations
          </Typography>
        </Box>
        <Box>
          <MyButton
            type="button"
            label="Thêm đề xuất"
            startIcon={<AddBoxIcon />}
            onClick={() => {
              window.location.href = `/my_recommendations/create`;
            }}
          />
        </Box>
      </Box>
      <MaterialReactTable table={table} />
    </>
  );
};

export default MyRecommendations;
