import styled from "styled-components";
const Wrapper = styled.div`
  thead.p-datatable-thead {
    display: none;
  }

  .status {
    padding: 1rem 0;
    display: flex;
    justify-content: space-between;

    span.statusTitle {
      /* text-transform: capitalize; */
    }
  } 
  .accordion-item { 
    background-color: #fcfcfc !important; 
}
.accordion-item .card-body {
  background-color: #fcfcfc !important; 
}
.accordion-item tr >* {
  color: #787878 !important;
}
  .accordion-item > * {
    transition: 0.5s;
  }
 
.accordion-item tr .fw-bold {
   width: 25%
}
  
  .accordion-body {
    padding: 10px 20px 10px 20px;
    border-radius: 0;
  }
`;

export { Wrapper };
