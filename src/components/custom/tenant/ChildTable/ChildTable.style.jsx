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

  .accordion-item > * {
    transition: 0.5s;
  }
  .accordion-body {
    padding: 0;
    border-radius: 0;
  }
`;

export { Wrapper };
