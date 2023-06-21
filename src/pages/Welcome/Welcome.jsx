import React from "react";
import { Wrapper } from "./Welcome.styled";
import { useEffect } from "react";
import env from "react-dotenv";

const Dashboard = () => {
  useEffect(() => {
    // document.title = env.API_URL;
    // document.title = "ROSAS-Dashboard";
  }, []);

  return <Wrapper>Dashboard</Wrapper>;
};

export default Dashboard;
