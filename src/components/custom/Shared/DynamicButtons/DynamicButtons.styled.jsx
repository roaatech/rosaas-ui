import styled from 'styled-components'
export const Wrapper = styled.div`
  width: fit-content;

  
    

  .dynamicAction  .tog-btn-on.light-tog-btn {  
    background-color: var(--second-color) !important;
    border-color: #dd9811;
  }
  .dynamicAction  .tog-btn-on.dark-tog-btn { 
    color: var(--bs-btn-color) !important;  
    border-color: var(--bs-btn-border-color);
  }

  .dynamicAction  .tog-btn-on { 
    color: var(--bs-btn-color) !important;  
  }
  .dynamicAction  .tog-btn-off { 
    background-color: var(--bs-btn-color);
    color: var(--bs-btn-bg);
    border: 1px solid var(--bs-btn-border-color);
  }
  .dynamicAction  .first-tog-btn { 
    border-radius: 0.5rem 0rem 0rem 0.5rem;
    border-width: 1px 0 1px 1px !important;
  }
  .dynamicAction  .last-tog-btn { 
    border-radius: 0rem 0.5rem 0.5rem 0rem;
    border-width: 1px 1px 1px 0px !important;
  }
 

.dynamicAction  .tog-btn-on:active,  .dynamicAction  .tog-btn-off:active, {
    color: var(--bs-btn-active-color);
    background-color: var(--bs-btn-active-bg);
    border-color: var(--bs-btn-active-border-color);
    box-shadow: var(--bs-btn-active-shadow);
}
  
.dynamicAction .tog-btn-off:hover {
    color: var(--bs-btn-hover-color);
    background-color: var(--bs-btn-hover-bg);
    border-color: var(--bs-btn-hover-border-color);
}

.dynamicAction .tog-btn-on.light-tog-btn:hover {
    color: var(--bs-btn-hover-color);
    background-color: #ffbc35 !important;
    border-color: #ffbc35;
    }


 


  button {
    padding: 0.4rem 1rem;
  }
  .dynamicAction {
    overflow: hidden;
  }
  .dynamicAction button {
    border-radius: 0;
    border-left: 1px solid var(--primary3);
    margin: 0;
    &:first-child {
      /* border-left: 0px; */
    }
  }
  .redColor {
    color: var(--red);
  }

  .dropdown-item svg {
    position: relative;
    top: -2px;
  }

  .dropdown > button {
    border-radius: ${(props) =>
      props.direction == 'rtl' ? ' 8px 0 0 8px ' : '0 8px 8px 0'};
  }


  
`
