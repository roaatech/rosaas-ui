import React, { useEffect, useState } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { Routes } from "../routes";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useSelector } from "react-redux";
import useRequest from "../axios/apis/useRequest";

const HomePage = () => {
  const { userData } = useRequest();
  const [load, setLoad] = useState(false);
  let userRole = useSelector((state) => state.auth.userInfo.role);
  if (userRole == undefined) userRole = "notAuth";
  useEffect(() => {
    (async () => {
      const token = localStorage.getItem("token");
      if (token) {
        await userData();
        // send token to get userData then set it in the store
      }
      setLoad(true);
    })();
  }, []);

  const generateRoutes = ({ component: Component, path, type, roles }) => {
    if (roles.includes(userRole) || roles === "*") {
      return (
        <Route
          exact
          path={path}
          render={(props) => (
            <>
              {type === "noSidebar" ? (
                <>
                  <Component {...props} />
                </>
              ) : (
                <>
                  <Sidebar />
                  <main className="content">
                    <Navbar />
                    <Component {...props} />
                  </main>
                </>
              )}
            </>
          )}
        />
      );
    }
  };

  return (
    <>
      {load && (
        <Switch>
          {[
            ...Object.values(Routes).map((route) => generateRoutes(route)),
            <Redirect
              to={
                userRole == "notAuth"
                  ? Routes.Signin.path
                  : Routes.DashboardOverview.path
              }
            />,
          ]}
        </Switch>
      )}
    </>
  );
};

export default HomePage;
