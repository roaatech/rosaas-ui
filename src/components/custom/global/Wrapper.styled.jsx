import { createGlobalStyle } from 'styled-components'

const darkBackground = '#676668'
const darkColor = '#414042'
const lightBackground = '#f9f9f9'
const lightColor = '#f5f8fb'
const GlobalStyles = createGlobalStyle`

  ${require('react-toastify/dist/ReactToastify.css')}
  ${require('primereact/resources/themes/lara-light-indigo/theme.css')}
  ${require('primereact/resources/primereact.min.css')}
  ${require('primeicons/primeicons.css')}
 ${require('../../../scss/voltltr.scss')}   
 ${require('../../../scss/custom.scss')}  
 /* ${(props) => {
   props.direction == 'rtl'
     ? require('../../../scss/voltrtl.scss')
     : require('../../../scss/voltltr.scss')
 }}   */
:root{
  --darkBackground:${darkBackground};
  --gray: #f9f9f9;
  --smallFont:12px;
  --defaultFont:14px;
  --normalFont:16px;
  --largeFont:19px;
  --hugeFont:35px;
  --errorColor:red;
  --green:#3bc76f;
  --red:#ff6868;
  --primary-color:#414042;
 

  --primary0:#fdfdfd;
  --primary1:#ECECEC;
  --primary2:#DCDCDC;
  --primary3:#C4C4C4;
  --primary4:#676668;
  --primary5:#414042;
  --primary6:#3B3A3C;
  --primary7:#2E2D2F;
  --second-color:#ffab03;
  --second-color-1:#ffe8b9;
 --table-hover:#eff0f2;
   --themeBackground:${(props) =>
     props.darkMode ? darkBackground : lightBackground};
  --themeColor:${(props) => (props.darkMode ? lightColor : darkColor)};
   --unThemeBackground:${(props) =>
     props.darkMode ? lightBackground : darkBackground};
  --unThemeColor:${(props) => (props.darkMode ? darkColor : lightColor)};
  --themeSecColor:${(props) => (props.darkMode ? darkColor : 'white')};
  --themeGray:${(props) => (props.darkMode ? '#565656' : '#eaedf2')};

/// theme override
--bs-btn-border-color:#ffab03;
--bs-btn-bg:#ffab03



}
 
 

.btn-secondary {
    --bs-btn-color: #414042;
    --bs-btn-bg: #ffab03;
    --bs-btn-border-color: #ffab03;
    --bs-btn-hover-color: #414042;
    --bs-btn-hover-bg: #ffbc35;
    --bs-btn-hover-border-color: #ffbc35;
    --bs-btn-focus-shadow-rgb: 88, 192, 223;
    --bs-btn-active-color: #414042;
    --bs-btn-active-bg: #ffbc35;
    --bs-btn-active-border-color: #ffbc35;
    --bs-btn-active-shadow: inset 0 3px 5px rgba(46, 54, 80, 0.125);
    --bs-btn-disabled-color: #414042;
    --bs-btn-disabled-bg: #ffab03;
    --bs-btn-disabled-border-color: #ffab03;
}
.btn-primary {
    --bs-btn-color: #ffffff;
    --bs-btn-bg: #414042;
    --bs-btn-border-color: #414042;
    --bs-btn-hover-color: #ffffff;
    --bs-btn-hover-bg: #676668;
    --bs-btn-hover-border-color: #414042;
    --bs-btn-focus-shadow-rgb: 71, 75, 93;
    --bs-btn-active-color: #ffffff;
    --bs-btn-active-bg: #414042;
    --bs-btn-active-border-color: #414042;
    --bs-btn-active-shadow: inset 0 3px 5px rgba(46, 54, 80, 0.125);
    --bs-btn-disabled-color: #ffffff;
    --bs-btn-disabled-bg: #414042;
    --bs-btn-disabled-border-color: #414042;
}

.react-switch.react-switch-docusaurus{
  display: none  !important; 
}
.sidebar-inner .addNew {
  width: 100%;
}

.navbar-theme-primary:not(.headroom){
  background-color: var(--primary5);

}
  *{
    font-family: "Nunito Sans", sans-serif;
  }

  img{
    width: max-content;
  }

  body{
    --bs-body-color: var(--primary-color);
    background-color: var(--themeBackground)!important;
    overflow-x: hidden;
  }
  .p-inputtext{
  padding:0.5rem 0.5rem;
 width:100%
 }
 /* .dropdown-item:hover, .dropdown-item:active {
    background: var(--gray)!important;
 
} */
 .dashboard-dropdown.notifications-dropdown.dropdown-menu-lg.dropdown-menu-center.mt-2.py-0.dropdown-menu.show {
    right: 0!important;
    left: unset!important;
    transform: translateX(40px);
}

.p-multiselect-panel{
  z-index: 100000!important;
}
 .error-message {
    color: var(--errorColor);
    font-size: var(--smallFont);
    margin-top: 0.25rem;
    text-align: center;
}
h6, .h6, h5, .h5, h4, .h4, h3, .h3, h2, .h2, h1, .h1{
  color:var(--primary5)
}
.bs-tooltip-top .tooltip-arrow::before, .bs-tooltip-auto[data-popper-placement^=top] .tooltip-arrow::before {
    border-top-color: var(--primary5);
}
.tooltip-inner {
     background-color: var(--primary5);
}

.breadcrumb-item + .breadcrumb-item::before{
  content : var(--bs-breadcrumb-divider, "/") !important
}

.p-paginator .p-dropdown{
  height:2.8rem;
}

#webpack-dev-server-client-overlay{
  display: none;
}
.p-button {
    padding: 0.5rem 1.25rem!important;
    border-radius: 5px!important;
    background-color: var(--primary5);
    border-color: var(--primary5);

    /* &:hover{
      background-color: var(--primary5)!important;
    } */
}

.p-dialog-mask{
  
.p-button:not(.p-button-text) {
    padding: 0.5rem 1.25rem!important;
    border-radius: 5px!important;
    background-color: var(--primary5);
    border-color: var(--primary5);

    &:hover{
      background-color: var(--primary5)!important;
    }
}

.p-button-text{

  color:var(--primary5);
  &:hover{
      color: var(--primary7) !important;
      background-color: var(--primary1);
    }
}
}
 
.p-datatable .p-datatable-thead > tr > th{
  color: var(--themeColor) !important;
  background-color: var(--themeBackground) !important;
 }

 .table thead th {
    text-transform: unset;
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
.p-tabview-nav-link{
  border-width: 0 0 3px 0!important;
}
.content{
  padding:0
} 


.modal-body {
    max-height: calc(100vh - 200px);
    overflow: auto;
}
.p-dropdown {
    width: 100%;
    min-height: 42px;
}

.p-dropdown:not(.p-disabled):hover, .p-dropdown:not(.p-disabled):focus {
  border-color: var(--second-color) !important;
  box-shadow: 0 0 0 0.2rem  var(--second-color-1)!important;
  
}
 .p-dropdown:not(.p-disabled) {
  border-color: none!important;
  box-shadow:  none!important;
  border-color: var(--gray)!important;
}

.p-dropdown-panel .p-dropdown-items .p-dropdown-item.p-highlight {
    color: var(--primary4);
     background: var(--gray);
}

.p-button:focus {
    box-shadow:none;
}

.p-button:enabled:hover, .p-button:not(button):not(a):not(.p-disabled):hover {
    opacity: 90%;
}


.dropdown-item:hover, .dropdown-item:focus{
  background-color: var(--table-hover);
}

.p-inputtext:enabled:hover {
    border-color: var(--primary3);
}

.p-inputtext:focus {
    background-color: #ffffff;
    outline: 0;
    border-color: var(--primary3)!important;
    box-shadow: inset 0 1px 2px rgba(46, 54, 80, 0.075), 0 0 0 0.2rem rgba(38, 43, 64, 0.25) !important;
}
`

export default GlobalStyles
