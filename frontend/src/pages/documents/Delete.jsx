import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography } from "@mui/material";

import CircularProgress from "@mui/material/CircularProgress";

import DeleteIcon from "@mui/icons-material/Delete";
import MyButton from "../../components/forms/MyButton";

import AxiosInstance from "../../components/AxiosInstance";

export default function DeleteDocument() {
  const [currentDocument, setCurrentDocument] = useState({});
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const { id } = useParams();

  const getData = async () => {
    if (!currentDocument.id) {
      setIsLoading(true);
    }
    
    try {
      const response = await AxiosInstance.get(`/documents/${id}`);
      setCurrentDocument(response.data);
    } catch (error) {
      setIsError(true);
      setMessage("Error fetching document details.");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);

  const deleteRecord = (event) => {
    event.preventDefault();
    console.log(currentDocument)
    setIsLoading(true);
    AxiosInstance.delete(`documents/${id}/`)
      .then(() => {
        setIsError(false);
        alert("Document deleted successfully. Redirect to the list");
        window.location.href = "/documents";
      })
      .catch((error) => {
        alert("An error occurred while deleting the document.");
        setIsError(true);
        setMessage(error.message);
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  if (isError) {
    return (
      <Box sx={{ textAlign: "center", marginTop: "20px" }}>
        <Typography color="error">{message}</Typography>
      </Box>
    );
  }

  if (isLoading) {
    return <Box sx={{ textAlign: "center", marginTop: "20px" }}><CircularProgress /></Box>;
  }

  return (
    <>
      <Box className="topbar">
        <DeleteIcon />
        <Typography
          sx={{ marginLeft: "15px", fontWeight: "bold" }}
          variant="subtitle2"
        >
          Are you sure that you want to delete this document?
        </Typography>
      </Box>
      <form onSubmit={deleteRecord}>
        <Box className="formBox" sx={{display: "flex", flexDirection: "column"}} onSubmit={deleteRecord}>
          <Box className="formArea">
            <Typography>
              You will delete <strong>{currentDocument.name}.</strong>{" "} of type{" "}
              <strong>{currentDocument.document_type_name}</strong>.
            </Typography>
          </Box>
          <Box sx={{ marginTop: "30px" }}>
            <MyButton type="submit" fullWidth label={"Delete"}></MyButton>
          </Box>
        </Box>
      </form>
    </>
  );
}
