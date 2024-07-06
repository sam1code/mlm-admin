import React from "react";
import Login from "./Login";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import Dashboard from "./Home";
import Layout from "./components/Layout";
import Loader from "./components/Loader";

const App = () => {
  const { authInfo } = React.useContext(AuthContext);

  if (authInfo.isLoading) {
    return <Loader open={true} />;
  }

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <Layout authInfo={authInfo}>
              <Dashboard />
            </Layout>
          }
        />

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </>
  );
};

export default App;
