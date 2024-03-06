import styled from 'styled-components'

export const Wrapper = styled.div`
  .credit-card {
    border-radius: 15px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    margin: 10% auto;
    margin-top: 0;
    background-color: #ffc9666a;
    max-height: 160px;
  }
  .credit-card-hover:hover {
    border-radius: 15px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    margin: 10% auto;
    margin-top: 0;
    background-color: #ffc966bb;
  }
  .right {
    font-size: 26px;
  }
  .left {
    margin-top: 8px;
  }
  .group {
    margin-top: 8px;
  }
  .icon-second {
    color: var(--second-color);
  }
  .card-number {
    text-align: center;
    margin-bottom: 20px;
    /* white-space: nowrap; */
  }

  .digit {
    margin-right: 1%;
  }

  .dot {
    margin-right: 1%;
    color: gray;
  }

  .bottom-row {
    display: flex;
    justify-content: space-between;
  }

  .digit:nth-child(4n) {
    margin-right: 3%;
  }
  .dot {
    font-size: 28px;
    font-weight: bold;
    color: gray;
  }
`
