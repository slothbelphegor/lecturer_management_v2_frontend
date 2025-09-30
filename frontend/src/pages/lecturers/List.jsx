import { useMemo, useState, useEffect } from "react";
import { Box, Typography, IconButton, Chip } from "@mui/material";
import { Link } from "react-router-dom";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

import EditIcon from "@mui/icons-material/Edit";
import InfoIcon from "@mui/icons-material/Info";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import DeleteIcon from "@mui/icons-material/Delete";
import AddBoxIcon from "@mui/icons-material/AddBox";
import BookIcon from "@mui/icons-material/Book";
import GroupIcon from "@mui/icons-material/Group";
import MyButton from "../../components/forms/MyButton";
import AxiosInstance from "../../components/AxiosInstance";
import getUserRole from "../../components/GetUserRole";

const ListLecturer = () => {
  const currentRole = getUserRole();

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
        filterFn: (row, columnId, filterValue) => {
          const subjectNames = row.getValue(columnId) || [];
          if (!filterValue) return true;
          // filterValue can be a string or array, depending on your filter UI
          if (Array.isArray(filterValue)) {
            // Multi-select: check if any selected subject is in the row's subjects
            return filterValue.some((val) =>
              subjectNames.some((subject) =>
                subject.toLowerCase().includes(val.toLowerCase())
              )
            );
          }
          // Single string: check if any subject includes the filter string
          return subjectNames.some((subject) =>
            subject.toLowerCase().includes(filterValue.toLowerCase())
          );
        },
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
      const url = new URL("lecturers/", AxiosInstance.defaults.baseURL);

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
    renderRowActions: ({ row, table }) => (
      <Box sx={{ display: "flex", flexWrap: "nowrap", gap: "8px" }}>
        {["it_faculty", "education_department"].includes(currentRole) && (
          <IconButton
            color="primary"
            component={Link}
            to={`/lecturers/edit/${row.original.id}`}
          >
            <InfoIcon />
          </IconButton>
        )}
        {["it_faculty", "supervision_department"].includes(currentRole) && (
          <IconButton
            color="primary"
            component={Link}
            to={`/lecturers/${row.original.id}/evaluations`}
          >
            <ThumbUpIcon />
          </IconButton>
        )}
        <IconButton
          color="primary"
          component={Link}
          to={`/lecturers/${row.original.id}/schedules`}
        >
          <CalendarMonthIcon />
        </IconButton>

        {currentRole === "education_department" && (
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
          <GroupIcon />
          <Typography
            sx={{ marginLeft: "15px", fontWeight: "bold" }}
            variant="subtitle2"
          >
            List of Lecturers
          </Typography>
        </Box>
        {currentRole === "education_department" && (
          <Box>
            <MyButton
              type="button"
              label="Add New Lecturer"
              startIcon={<AddBoxIcon />}
              onClick={() => {
                window.location.href = `/lecturers/create`;
              }}
            />
          </Box>
        )}
      </Box>
      <MaterialReactTable table={table} />
    </>
  );
};

export default ListLecturer;
