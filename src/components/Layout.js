import { useProSidebar } from "react-pro-sidebar";

import { Navigate } from "react-router-dom";
import MenuBox from "./Menu";
import { useEffect } from "react";

function Layout({ authInfo, children, requiredRole }) {
  const { collapseSidebar } = useProSidebar();

  useEffect(() => {
    if (window.innerWidth < 768) {
      collapseSidebar();
    }
  }, []);

  if (authInfo?.isAuthenticated === false) {
    console.log("Redirecting to login");
    return <Navigate to="/login" />;
  }

  return (
    <div
      id="app"
      style={{
        height: "100vh",
        display: "flex",
        width: "100vw",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "end",
            alignItems: "center",
            height: "64px",
            backgroundColor: "#FBFBFB",
            borderBottom: "1px solid #F0F0F0",
            width: "100%",
          }}
        >
          <div
            style={{
              padding: "0 20px",
              cursor: "pointer",
            }}
          >
            <MenuBox />
          </div>
        </div>
        <div
          style={{
            padding: "20px",
            overflow: "auto",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export default Layout;
