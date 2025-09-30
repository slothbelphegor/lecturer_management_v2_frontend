import { React, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AxiosInstance from "../../components/AxiosInstance";
import getUserRole from "../../components/GetUserRole";

import {
  Box,
  Typography,
  Alert,
  CircularProgress,
  Snackbar,
} from "@mui/material";
import MyMultiSelectField from "../../components/forms/MyMultiSelectField";
import MyDateField from "../../components/forms/MyDateField";
import MyModal from "../../components/utils/MyModal";
import ScheduleInfoForm from "../../components/forms/full_forms/ScheduleInfoForm";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import { useForm } from "react-hook-form";
// import { format } from "date-fns-tz";
import { format, set } from "date-fns";
import {
  isSameDay,
  addDays,
  isAfter,
  isBefore,
  getDay,
  isEqual,
} from "date-fns";

const MySchedules = () => {
  const params = useParams();
  const [schedules, setSchedules] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [selectedDate, setSelectedDate] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [showEditSuccess, setShowEditSuccess] = useState(false);
  const [showCreateSuccess, setShowCreateSuccess] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);

  const [error, setError] = useState(null);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [open, setOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState();
  const [modalContent, setModalContent] = useState();
  const role = getUserRole();

  const handleOpen = (info) => {
    setOpen(true);
    setSelectedDate(info?.dateStr);
  };
  const handleClose = () => setOpen(false);

  const handleCloseError = () => setError(null);
  const handleCloseEditSuccess = () => {
    setShowEditSuccess(false);
    window.location.reload();
  };
  const handleCloseCreateSuccess = () => {
    setShowCreateSuccess(false);
    window.location.reload();
  };
  const handleCloseDeleteSuccess = () => {
    setShowDeleteSuccess(false);
    window.location.reload();
  };

  const fromDateChange = (newDate) => {
    setFromDate(newDate);
  };

  const toDateChange = (newDate) => {
    setToDate(newDate);
  };

  const { control, setValue } = useForm({});

  const getData = async () => {
    setIsLoading(true);
    try {
      const schedulesResponse = await AxiosInstance.get(`schedules/me`);
      setSchedules(
        Array.isArray(schedulesResponse.data) ? schedulesResponse.data : []
      );
      const selectedCourseIds = [
        ...new Set(schedulesResponse.data.map((schedule) => schedule.course)),
      ];
      setSelectedCourses(selectedCourseIds);

      // Set the initial value for the form field
      setValue("course", selectedCourseIds);

      const coursesResponse = await AxiosInstance.get("courses/all_courses/");
      setCourses(
        Array.isArray(coursesResponse.data) ? coursesResponse.data : []
      );
    } catch (error) {
      setError("Error fetching data.");
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }

    // AxiosInstance.get(`schedules/by-lecturer/${lecturer_id}`).then((res) => {
    //   setSchedules(Array.isArray(res.data) ? res.data : []);
    //   const selectedCourseIds = [
    //     ...new Set(res.data.map((schedule) => schedule.course)),
    //   ];
    //   setSelectedCourses(selectedCourseIds);
    //   // Set the initial value for the form field
    //   setValue("course", selectedCourseIds);
    // });
    // AxiosInstance.get("courses/all_courses/").then((res) => {
    //   setCourses(Array.isArray(res.data) ? res.data : []);
    // });
  };

  useEffect(() => {
    getData();
  }, []); // get data on initial load page

  const filteredSchedules = schedules.filter(
    (schedule) =>
      selectedCourses.includes(schedule.course) &&
      (!fromDate ||
        isAfter(schedule.start, fromDate) ||
        isEqual(schedule.start, fromDate)) &&
      (!toDate ||
        isBefore(schedule.end, toDate) ||
        isEqual(schedule.end, fromDate))
  );

  // Hàm tạo màu từ tên
  const stringToColor = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = `hsl(${hash % 360}, 70%, 30%)`; // sáng, dễ nhìn
    return color;
  };

  const courseOptions = Array.isArray(courses)
    ? courses.map((course) => ({
        id: course.id,
        value: course.id,
        name: course.name,
      }))
    : [];

  const scheduleClickAction = (info) => {
    handleOpen(info);
    setModalTitle("Schedule Details");
    const formattedStartTime = format(info.event.start, "HH:mm");
    const formattedEndTime = format(info.event.end, "HH:mm");
    setModalContent(
      <ScheduleInfoForm
        courses={courses}
        startTime={formattedStartTime}
        endTime={formattedEndTime}
        fromDate={format(info.event.start, "yyyy-MM-dd")}
        courseId={info.event.extendedProps.course}
        place={info.event.extendedProps.place}
        notes={info.event.extendedProps.notes}
        readOnly={true}
      />
    );
  };

  const selectTimeAction = (info) => {
    handleOpen(info);
    setModalTitle("New Schedule");
    const formattedStartTime = format(new Date(info.start), "HH:mm");
    const formattedEndTime = format(new Date(info.end), "HH:mm");
    setModalContent(
      <ScheduleInfoForm
        courses={courses}
        startTime={formattedStartTime}
        endTime={formattedEndTime}
        fromDate={format(info.start, "yyyy-MM-dd")}
        submission={createSubmission}
      />
    );
  };

  if (isLoading) {
    return (
      <Box sx={{ textAlign: "center", marginTop: "20px" }}>
        <CircularProgress />
      </Box>
    );
  }

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
          <CalendarMonthIcon />
          <Typography
            sx={{ marginLeft: "15px", fontWeight: "bold" }}
            variant="subtitle2"
          >
            Your Schedules
          </Typography>
        </Box>
        <Box></Box>
      </Box>
      <MyModal
        open={open}
        handleClose={handleClose}
        title={modalTitle}
        content={modalContent}
      />
      <Box
        sx={{
          padding: "20px",
          display: "flex",
          justifyContent: "space-evenly",
        }}
      >
        <Box sx={{ width: "33%", margin: "12px", marginTop: 0 }}>
          <MyMultiSelectField
            label={"Môn học"}
            control={control}
            name={"course"}
            options={courseOptions}
            selectedValues={selectedCourses}
            value={selectedCourses}
            onChange={(e) => {
              setSelectedCourses(e.target.value);
            }}
          />
        </Box>
        <Box sx={{ width: "33%", margin: "12px" }}>
          <MyDateField
            label={"Từ"}
            type="date"
            control={control}
            name="from"
            onChange={(e) => {
              fromDateChange(e);
            }}
          />
        </Box>
        <Box sx={{ width: "33%", margin: "12px" }}>
          <MyDateField
            label={"Đến"}
            type="date"
            control={control}
            name="to"
            sx={{ height: "85px" }}
            onChange={(e) => {
              toDateChange(e);
            }}
          />
        </Box>
      </Box>
      <Box sx={{ padding: "20px" }}>
        <FullCalendar
          plugins={[
            dayGridPlugin,
            timeGridPlugin,
            listPlugin,
            interactionPlugin,
          ]}
          initialView="timeGridWeek"
          headerToolbar={{
            left: "prev,today,next",
            center: "title",
            right: "listDay,timeGridWeek,dayGridMonth",
          }}
          events={filteredSchedules}
          eventDidMount={(info) => {
            const className = info.event.classNames[0];
            if (className) {
              const color = stringToColor(className);
              info.el.style.backgroundColor = color;
            }
          }}
          eventClick={scheduleClickAction}
          slotDuration="00:15:00"
          snapDuration="00:15:00"
          slotLabelInterval="01:00"
          slotMinTime="07:00:00"
          validRange={{
            start: fromDate,
            end: toDate,
          }}
        />
      </Box>
    </div>
  );
};

export default MySchedules;
