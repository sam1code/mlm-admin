import React, { createContext, useState } from "react";
import Loader from "../components/Loader";
import { Alert, Snackbar } from "@mui/material";

export const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "",
  });

  return (
    <LoadingContext.Provider
      value={{ loading, setLoading, snackbar, setSnackbar }}
    >
      <Loader open={loading} handleClose={() => setLoading(false)} />
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ open: false, message: "", severity: "" })}
      >
        <Alert
          onClose={() =>
            setSnackbar({ open: false, message: "", severity: "" })
          }
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      {children}
    </LoadingContext.Provider>
  );
};
export default LoadingProvider;
