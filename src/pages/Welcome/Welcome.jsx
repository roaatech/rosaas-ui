import React from "react";
import { Wrapper } from "./Welcome.styled";
import { useEffect } from "react";

const Dashboard = () => {
  useEffect(() => {
    document.title = "ROSAS-Dashboard";
  }, []);

  return <Wrapper>Dashboard</Wrapper>;
};

export default Dashboard;
