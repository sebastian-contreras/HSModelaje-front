import { createContext, useContext, useState } from "react";

export const SidebarContext = createContext();
export const SidebarProvider = ({ children }) => {
  const [openSidebar, setOpenSidebar] = useState(true);

  function handleClose() {
    setOpenSidebar(false);
  }
  function handleOpen() {
    setOpenSidebar(true);
  }
  function toggle() {
    setOpenSidebar(!openSidebar);
  }

  return (
    <SidebarContext.Provider value={{openSidebar ,setOpenSidebar,toggle }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useHandlerSidebar = () => useContext(SidebarContext);