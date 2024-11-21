import { Backdrop, CircularProgress } from "@mui/material";
import { createContext, useContext, useState } from "react";

export const BackdropContext = createContext();
export const BackdropProvider = ({ children }) => {
  const [open, setOpen] = useState(false);

  function handleClose() {
    setOpen(false);
  }
  function handleOpen() {
    setOpen(true);
  }
  return (
    <BackdropContext.Provider value={{ open, handleOpen, handleClose }}>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      {children}
    </BackdropContext.Provider>
  );
};

export const useBackdrop = () => useContext(BackdropContext);