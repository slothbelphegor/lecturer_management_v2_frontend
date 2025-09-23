import { useState, useEffect } from "react";
import { Box, CircularProgress, Snackbar, Alert } from "@mui/material";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import MyTextField from "../MyTextField";
import MySelectField from "../MySelectField";
import MyDateTimeField from "../MyDateField";
import MyButton from "../MyButton";

import AxiosInstance from "../../AxiosInstance";

export default function DocumentForm({ document, submission, isSubmitting }) {
  const [documentTypes, setDocumentTypes] = useState([]);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleCloseError = () => setError(null);

  const getData = async () => {
    setIsLoading(true);
    try {
      const response = await AxiosInstance.get(`/document_types`);
      setDocumentTypes(response.data);
    } catch (error) {
      console.error("Error fetching document types:", error);
      setError("Error fetching document types.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getData();
    if (document) {
      const formValues = {
        name: document.name,
        document_type: document.document_type,
        file_link: document.file_link,
        published_at: document.published_at,
        valid_at: document.valid_at,
        published_by: document.published_by,
        signed_by: document.signed_by,
      };
      reset(formValues);
    }
  }, []); // get data on initial load page

  const documentTypeOptions = documentTypes.map((type) => ({
    id: type.id,
    value: type.id,
    showValue: type.name,
  }));

  const schema = yup.object().shape({
    name: yup.string().required("Name is required"),
    document_type: yup.string().required("Document type is required"),
    file_link: yup
      .string()
      .required("File link is required")
      .matches(
        /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/,
        "File link must be a valid URL"
      ),
    published_at: yup
      .date()
      .nullable()
      .transform((value, originalValue) =>
        originalValue === "" ? null : value
      ) // Transform empty string to null
      .max(new Date(), "Published date cannot be in the future"),
    valid_at: yup
      .date("Valid date must be a valid date value")
      .nullable()
      .transform((value, originalValue) =>
        originalValue === "" ? null : value
      ) // Transform empty string to null
      .min(
        yup.ref("published_at"),
        "Valid date cannot be before the published date"
      ),
    published_by: yup.string(),
    signed_by: yup.string(),
  });

  const { handleSubmit, control, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      document_type: "",
      file_link: "",
      published_at: null,
      valid_at: null,
      published_by: "",
      signed_by: "",
    },
  });

  if (isLoading) {
    return (
      <Box sx={{ textAlign: "center", marginTop: "20px" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <form onSubmit={handleSubmit(submission)}>
        <Box
          className="formBox"
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gridTemplateRows: "repeat(1, 1fr)",
            opacity: isSubmitting ? 0.7 : 1,
            pointerEvents: isSubmitting ? "none" : "auto",
          }}
        >
          <Box
            className="formArea"
            sx={{ width: "100%", gridColumn: "span 3" }}
          >
            <MyTextField
              className="formField"
              label={"Document name"}
              name="name"
              control={control}
            />
          </Box>
          <Box
            className="formArea"
            sx={{ gridColumn: "span 1", width: "100%" }}
          >
            <MySelectField
              className="formField"
              label={"Document type"}
              name="document_type"
              control={control}
              options={documentTypeOptions}
            />
          </Box>
          <Box
            className="formArea"
            sx={{ gridColumn: "span 2", width: "100%" }}
          >
            <MyDateTimeField
              className="formField"
              name="published_at"
              control={control}
              label="Published at"
            ></MyDateTimeField>
          </Box>
          <Box
            className="formArea"
            sx={{ gridColumn: "span 2", width: "100%" }}
          >
            <MyDateTimeField
              className="formField"
              label={"Valid at"}
              control={control}
              name="valid_at"
            />
          </Box>
          <Box
            className="formArea"
            sx={{ gridColumn: "span 2", width: "100%" }}
          >
            <MyTextField
              className="formField"
              label={"Published by"}
              control={control}
              name="published_by"
            />
          </Box>
          <Box
            className="formArea"
            sx={{ gridColumn: "span 2", width: "100%" }}
          >
            <MyTextField
              className="formField"
              label={"Signed by"}
              control={control}
              name="signed_by"
            />
          </Box>
          <Box
            className="formArea"
            sx={{ gridColumn: "span 4", width: "100%" }}
          >
            <MyTextField
              className="formField"
              label={"Link to file"}
              name="file_link"
              control={control}
            />
          </Box>
          <Box
            className="formArea"
            sx={{ gridColumn: "span 4", width: "100%" }}
          >
            <MyButton
              type="submit"
              fullWidth
              label={isSubmitting ? "Submitting..." : "Submit"}
              disabled={isSubmitting}
              startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
            />
          </Box>
        </Box>
      </form>
      {/* Error Snackbar */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseError}
          severity="error"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>
    </>
  );
}
