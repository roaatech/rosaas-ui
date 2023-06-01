import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { Routes } from "../routes";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useSelector } from "react-redux";

const HomePage = () => {
  let userRole = useSelector((state) => state.auth.userInfo.role);
  if (userRole == undefined) userRole = "notAuth";
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
  );
};

export default HomePage;
