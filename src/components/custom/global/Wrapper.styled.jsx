import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`

  ${require("react-toastify/dist/ReactToastify.css")}
  ${require("primereact/resources/themes/lara-light-indigo/theme.css")}
  ${require("primereact/resources/primereact.min.css")}
  ${require("primeicons/primeicons.css")}
  ${(props) => {
    props.direction == "rtl"
      ? require("../../../scss/voltrtl.scss")
      : require("../../../scss/voltltr.scss");
  }}

:root{
  --primaryBackground:#262b40;
  --gray: #d1d5db;
  --smallFont:12px;
  --normalFont:16px;
  --largeFont:19px;
  --errorColor:red;
  --primary-color:#262b40!important;
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

.breadcrumb-item + .breadcrumb-item::before{
  content : var(--bs-breadcrumb-divider, "/") !important
}

.p-paginator .p-dropdown{
  height:2.8rem;
}

.p-button {
    padding: 0.5rem 1.25rem!important;
    border-radius: 5px!important;
    background-color: var(--primaryBackground);
    border-color: var(--primaryBackground);

    &:hover{
      background-color: var(--primaryBackground)!important;
    }
}

.p-dialog-header {
    padding-bottom: 0 !important;
  }
  
`;

export default GlobalStyles;
