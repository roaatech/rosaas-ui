import styled from 'styled-components'
export const Wrapper = styled.div`
  .description {
    max-width: 410px;
    white-space: normal;
  }
  span.label {
    font-size: var(--normalFont);
    cursor: pointer;
  }
  .green {
    color: var(--green);
  }
  .gray {
    color: var(--gray-500);
  }
  .green:hover {
    color: #006400; /* Darker shade of green */
  }

  .gray:hover {
    color: #4d4d4d; /* Darker shade of gray */
  }
  .card .table td:not(:first-child),
  .card .table th:not(:first-child) {
    text-align: center; /* Center the text in all columns except the first */
    vertical-align: middle; /* Vertically center content */
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }

  .red {
    color: var(--red);
  }
  .red:hover {
    color: #b30000; /* Darker shade of red */
  }
  .dynamicButtons {
    margin-left: auto;
    width: fit-content;
    margin-bottom: 1.25rem;
  }
  .lock-active {
    color: var(--second-color);
  }
  .lock-passive {
    color: var(--passive-color);
  }
`
