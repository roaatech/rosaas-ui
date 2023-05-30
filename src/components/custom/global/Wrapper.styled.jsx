import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`

  ${require("react-toastify/dist/ReactToastify.css")}
  ${require("primereact/resources/themes/lara-light-indigo/theme.css")}
  ${require("primereact/resources/primereact.min.css")}
  ${(props) => {
    props.direction == "rtl"
      ? require("../../../scss/voltrtl.scss")
      : require("../../../scss/voltltr.scss");
  }}

:root{
  --gray: #d1d5db;
  --smallFont:12px;
  --normalFont:16px;
  --largeFont:19px;
  --errorColor:red
}
  *{
    font-family: "Nunito Sans", sans-serif;
  }

  .p-inputtext{
  padding:0.5rem 0.5rem;
 width:100%
 }

 .error-message {
    color: var(--errorColor);
    font-size: var(--smallFont);
    margin-top: 0.25rem;
    text-align: center;
}


`;

export default GlobalStyles;
