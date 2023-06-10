import React from "react";
import { Wrapper } from "./Preloader.styled";

export default (props) => {
  const { show } = props;

  return (
    <>
      {show && (
        <Wrapper>
          <div className="loader">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </Wrapper>
      )}
    </>
  );
};
