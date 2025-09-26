import * as React from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import getUserRole from "../GetUserRole";

import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import PeopleIcon from "@mui/icons-material/People";
import HomeIcon from "@mui/icons-material/Home";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ArchiveIcon from "@mui/icons-material/Archive";
import ScheduleIcon from "@mui/icons-material/Schedule";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import QueueIcon from "@mui/icons-material/Queue";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import BookIcon from "@mui/icons-material/Book";
import GroupIcon from "@mui/icons-material/Group";
import ArticleIcon from "@mui/icons-material/Article";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import PersonIcon from "@mui/icons-material/Person";
import InfoIcon from "@mui/icons-material/Info";
import RecommendIcon from "@mui/icons-material/Recommend";
import SchoolIcon from "@mui/icons-material/School";

export default function Menu() {
  const [open, setOpen] = React.useState("");
  const location = useLocation();
  const currentRole = getUserRole();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const handleClick = (section) => {
    setOpen(open === section ? "" : section);
  };

  const handleLogout = () => {
    localStorage.removeItem("Token");
    localStorage.removeItem("RefreshToken");
    navigate("/login"); // Redirect to login page after logout
  };

  return (
    <List
      sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
      component="nav"
      aria-labelledby="nested-list-subheader"
    >
      <ListItemButton selected={"/" === currentPath} to={"/"} component={Link}>
        <ListItemIcon>
          <HomeIcon />
        </ListItemIcon>
        <ListItemText primary="Home" />
      </ListItemButton>
      <ListItemButton onClick={() => handleClick("me")}>
        <ListItemIcon>
          <PersonIcon />
        </ListItemIcon>
        <ListItemText primary={"About Self"} />
        {open == "me" ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open == "me"} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {["lecturer", "potential_lecturer"].includes(currentRole) && (
            <>
              <ListItemButton
                component={Link}
                to="/my_info"
                selected={"/my_info" === currentPath}
                sx={{ pl: 4 }}
              >
                <ListItemIcon>
                  <InfoIcon />
                </ListItemIcon>
                <ListItemText primary="Information" />
              </ListItemButton>
            </>
          )}
          {["lecturer"].includes(currentRole) && (
            <>
              <ListItemButton
                component={Link}
                to="/my_evaluations"
                selected={"/my_evaluations" === currentPath}
                sx={{ pl: 4 }}
              >
                <ListItemIcon>
                  <ThumbUpIcon />
                </ListItemIcon>
                <ListItemText primary="Evaluations" />
              </ListItemButton>

              <ListItemButton
                component={Link}
                to="/my_schedules"
                selected={"/my_schedules" === currentPath}
                sx={{ pl: 4 }}
              >
                <ListItemIcon>
                  <ScheduleIcon />
                </ListItemIcon>
                <ListItemText primary="Schedule" />
              </ListItemButton>

              <ListItemButton
                component={Link}
                to="/my_recommendations"
                selected={"/my_recommendations" === currentPath}
                sx={{ pl: 4 }}
              >
                <ListItemIcon>
                  <RecommendIcon />
                </ListItemIcon>
                <ListItemText primary="Recommendations" />
              </ListItemButton>
            </>
          )}

          <ListItemButton
            component={Link}
            to="/my_account"
            selected={"/my_account" === currentPath}
            sx={{ pl: 4 }}
          >
            <ListItemIcon>
              <AccountCircleIcon />
            </ListItemIcon>
            <ListItemText primary="Account" />
          </ListItemButton>
        </List>
      </Collapse>
      {(["it_faculty", "education_department"].includes(currentRole) && (
        <>
          <ListItemButton
            onClick={() => handleClick("lecturers")}
            component={Link}
            to="/lecturers"
            selected={"/lecturers" === currentPath}
          >
            <ListItemIcon>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary="Lecturers" />
            {open == "lecturers" ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={open == "lecturers"} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {
                /* {['lecturer', 'potential_lecturer'].includes(currentRole) &&  */
                <>
                  <ListItemButton
                    component={Link}
                    to="/lecturers/registrations"
                    selected={"/lecturers/registrations" === currentPath}
                    sx={{ pl: 4 }}
                  >
                    <ListItemIcon>
                      <QueueIcon />
                    </ListItemIcon>
                    <ListItemText primary="Registrations" />
                  </ListItemButton>
                  {currentRole === "it_faculty" && (
                    <ListItemButton
                      component={Link}
                      to="/lecturers/recommendations"
                      selected={"/lecturers/recommendations" === currentPath}
                      sx={{ pl: 4 }}
                    >
                      <ListItemIcon>
                        <RecommendIcon />
                      </ListItemIcon>
                      <ListItemText primary="Recommendations" />
                    </ListItemButton>
                  )}
                </>
              }
            </List>
          </Collapse>
        </>
      )) || (
        <>
          {currentRole !== "potential_lecturer" && (
            <ListItemButton
              onClick={() => handleClick("lecturers")}
              component={Link}
              to="/lecturers"
              selected={"/lecturers" === currentPath}
            >
              <ListItemIcon>
                <PeopleIcon />
              </ListItemIcon>
              <ListItemText primary="Lecturers" />
            </ListItemButton>
          )}
        </>
      )}

      {currentRole !== "potential_lecturer" && (
        <ListItemButton
          selected={"/courses" === currentPath}
          to={"/courses"}
          component={Link}
        >
          <ListItemIcon>
            <BookIcon />
          </ListItemIcon>
          <ListItemText primary="Courses" />
        </ListItemButton>
      )}
      <ListItemButton
        selected={"/documents" === currentPath}
        to={"/documents"}
        component={Link}
      >
        <ListItemIcon>
          <ArticleIcon />
        </ListItemIcon>
        <ListItemText primary="Documents" />
      </ListItemButton>
      {["education_department"].includes(currentRole) && (
        <>
          <ListItemButton
            selected={"/users" === currentPath}
            to={"/users"}
            component={Link}
          >
            <ListItemIcon>
              <AccountBoxIcon />
            </ListItemIcon>
            <ListItemText primary="Users" />
          </ListItemButton>
        </>
      )}

      <ListItemButton onClick={(event) => handleLogout(event)}>
        <ListItemIcon>
          <LogoutIcon />
        </ListItemIcon>
        <ListItemText primary="Logout" />
      </ListItemButton>
    </List>
  );
}
