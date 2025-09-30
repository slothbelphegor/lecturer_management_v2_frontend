import { useMemo, useState, useEffect } from "react";
import { Box, Typography, IconButton, Chip } from "@mui/material";
import { Link } from "react-router-dom";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

import QueueIcon from "@mui/icons-material/Queue";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import AddBoxIcon from "@mui/icons-material/AddBox";
import BookIcon from "@mui/icons-material/Book";
import MyButton from "../../components/forms/MyButton";
import AxiosInstance from "../../components/AxiosInstance";
import getUserRole from "../../components/GetUserRole";

const ListPotentialLecturer = () => {
  const role = getUserRole();
  //data and fetching state
  const [lecturers, setLecturers] = useState([]);
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
        header: "Tên",
      },
      {
        accessorKey: "date",
        header: "Ngày đăng ký",
      },
      {
        accessorKey: "degree",
        header: "Học vị",
      },
      {
        accessorKey: "title",
        header: "Học hàm",
      },
      {
        accessorKey: "workplace",
        header: "Nơi công tác",
        // max length of 10 characters
        Cell: ({ cell }) => {
          const value = cell.getValue();
          return value?.length > 10 ? value.slice(0, 50) + "..." : value;
        },
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
        header: "Tình trạng hồ sơ",
      },

      {
        accessorKey: "recommender_details.full_name",
        header: "Người giới thiệu",
        // max length of 10 characters
        Cell: ({ cell }) => {
          const value = cell.getValue();
          return value?.length > 10 ? value.slice(0, 50) + "..." : value;
        },
      },
    ],
    []
  );

  useEffect(() => {
    const fetchData = async () => {
      if (!lecturers.length) {
        setIsLoading(true);
      } else {
        setIsRefetching(true);
      }
      const url = new URL(
        "/lecturers/potential_lecturers/",
        AxiosInstance.defaults.baseURL
      );

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
        // Handle paginated response from DRF
        if (json.results && json.count !== undefined) {
          setLecturers(json.results);
          setRowCount(json.count); // Total number of records
        } else {
          setLecturers(json);
          setRowCount(json.length);
        }
      } catch (error) {
        setIsError(true);
        console.error("Error fetching lecturers:", error);
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
    data: lecturers,
    getRowId: (row) => row.id,
    initialState: {
      showColumnFilters: false,
      columnVisibility: {
        "recommender_details.full_name": false,
        title: false,
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
      <Box sx={{ padding: 2, display: "flex", flexDirection: "column" }}>
        <Typography variant="h6">Thông tin liên lạc</Typography>
        <Typography variant="body1">
          <strong>Tên:</strong> {row.original.name}
        </Typography>
        <Typography variant="body1">
          <strong>Email:</strong> {row.original.email}
        </Typography>
        <Typography variant="body1">
          <strong>Số điện thoại:</strong> {row.original.phone_number}
        </Typography>
        <Typography variant="body1">
          <strong>Nơi công tác:</strong> {row.original.workplace}
        </Typography>
      </Box>
    ),
    enableRowActions: true,
    positionActionsColumn: "last",
    renderRowActions: ({ row }) => (
      <Box sx={{ display: "flex", flexWrap: "nowrap", gap: "8px" }}>
        {["it_faculty", "education_department"].includes(role) && (
          <IconButton
            color="primary"
            component={Link}
            to={`/lecturers/check/${row.original.id}`}
          >
            <CheckCircleIcon />
          </IconButton>
        )}

        {role === "education_department" && (
          <IconButton
            color="error"
            component={Link}
            to={`/lecturers/delete/${row.original.id}`}
          >
            <DeleteIcon />
          </IconButton>
        )}
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
          <QueueIcon />
          <Typography
            sx={{ marginLeft: "15px", fontWeight: "bold" }}
            variant="subtitle2"
          >
            List of Registrations
          </Typography>
        </Box>
      </Box>
      <MaterialReactTable table={table} />
    </>
  );
};

export default ListPotentialLecturer;
