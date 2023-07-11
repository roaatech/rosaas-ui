import { createGlobalStyle } from "styled-components";

const darkBackground = "#373d58";
const darkColor = "#262b40";
const lightBackground = "#f5f8fb";
const lightColor = "#f5f8fb";
const GlobalStyles = createGlobalStyle`

  ${require("react-toastify/dist/ReactToastify.css")}
  ${require("primereact/resources/themes/lara-light-indigo/theme.css")}
  ${require("primereact/resources/primereact.min.css")}
  ${require("primeicons/primeicons.css")}
 ${require("../../../scss/voltltr.scss")}  
 /* ${(props) => {
   props.direction == "rtl"
     ? require("../../../scss/voltrtl.scss")
     : require("../../../scss/voltltr.scss");
 }}   */
:root{
  --darkBackground:${darkBackground};
  --gray: #d1d5db;
  --smallFont:12px;
  --normalFont:16px;
  --largeFont:19px;
  --errorColor:red;
  --green:#3bc76f;
  --red:#ff6868;
  --primaryBackground:#262b40;
  --primaryColor:#262b40;
  --primary-color:#262b40;
   --themeBackground:${(props) =>
     props.darkMode ? darkBackground : lightBackground};
  --themeColor:${(props) => (props.darkMode ? lightColor : darkColor)};
   --unThemeBackground:${(props) =>
     props.darkMode ? lightBackground : darkBackground};
  --unThemeColor:${(props) => (props.darkMode ? darkColor : lightColor)};
  --themeSecColor:${(props) => (props.darkMode ? darkColor : "white")};
  --themeGray:${(props) => (props.darkMode ? "#565656" : "#eaedf2")};

}



.sidebar-inner .addNew {
  width: 100%;
}


  *{
    font-family: "Nunito Sans", sans-serif;
  }

  img{
    width: max-content;
  }

  body{
    background-color: var(--themeBackground)!important;
    overflow-x: hidden;
  }
  .p-inputtext{
  padding:0.5rem 0.5rem;
 width:100%
 }
 .dropdown-item:hover, .dropdown-item:active {
    background: var(--gray)!important;
 
}
 .dashboard-dropdown.notifications-dropdown.dropdown-menu-lg.dropdown-menu-center.mt-2.py-0.dropdown-menu.show {
    right: 0!important;
    left: unset!important;
    transform: translateX(40px);
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

    /* &:hover{
      background-color: var(--primaryBackground)!important;
    } */
}

.p-datatable .p-datatable-thead > tr > th{
  color: var(--themeColor) !important;
  background-color: var(--themeBackground) !important;
 }

 .p-datatable .p-datatable-tbody > tr {
    background: var(--themeBackground);
    color: var(--themeColor);
}


 .p-paginator {
    background: var(--themeBackground);
    color: var(--themeColor);

    .p-paginator-pages .p-paginator-page.p-highlight {
    background: var(--themeBackground);
    border-color: var(--themeColor);
    color: var(--themeColor);
    
  }
  
      .p-paginator-pages {
      display: flex;
  }
.p-dropdown {
    background: var(--themeBackground);
    .p-inputtext{
      color: var(--themeColor);
    }
}
 }

 .p-dropdown-panel, .p-datatable-wrapper {
    background: var(--themeBackground)!important;
}
.card,.dropdown-menu-center.mt-2.py-0.dropdown-menu.show{
  overflow-y: hidden;
}
.p-dropdown-panel .p-dropdown-items .p-dropdown-item{
 color: var(--themeColor);
    border-bottom: 1px solid white;
}
.p-float-label .p-inputwrapper-focus ~ label,.p-float-label .p-inputwrapper-filled ~ label, .p-float-label input:focus ~ label,
 .p-float-label textarea:focus ~ label, .p-float-label textarea.p-filled ~ label ,  .p-float-label input.p-filled ~ label{
    top: 0rem!important;
    background: white!important;
    padding: 0 10px;
}

.list-group-flush.list-group > a {
    color: gray;
    background: var(--themeBackground)!important;
}
.list-group-flush.list-group > a h4, .list-group-flush.list-group > a:first-child, .list-group-flush.list-group > a:last-child{
  color: var(--themeColor) !important;
}

nav svg.svg-inline--fa.fa-bell {
    color: var(--themeColor);
}

.user-dropdown.dropdown-menu-right.mt-2.dropdown-menu.show svg, .user-dropdown.dropdown-menu-right.mt-2.dropdown-menu.show a {
    color: var(--themeColor)!important;
}

.user-dropdown.dropdown-menu-right.mt-2.dropdown-menu.show {
    background: var(--themeBackground);
    color: var(--themeColor)!important;
}

.email{
  color: var(--themeColor)!important;
}

/* width */
::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}

/* Track */
::-webkit-scrollbar-track {
  background: var(--themeBackground);

}

/* Handle */
::-webkit-scrollbar-thumb {
  background: var(--unThemeBackground);
  border-radius: 10px;

}
.p-tabview .p-tabview-nav li .p-tabview-nav-link:not(.p-disabled):focus{
  box-shadow:unset
}

.content{
  padding:0
}

.mainContainer{
  padding:1rem
}


.p-dropdown {
    width: 100%;
    min-height: 42px;
}
`;

export default GlobalStyles;
