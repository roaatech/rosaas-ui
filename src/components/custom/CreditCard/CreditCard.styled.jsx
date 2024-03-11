import styled from 'styled-components'

export const Wrapper = styled.div`
  .credit-card {
    border-radius: 15px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    /* margin: 10% auto; */
    margin-top: 0;
    background-color: #ffc9666a;
    max-height: 150px;
    max-width: 350px;
  }
  .credit-card-view {
    max-height: 140px;
    min-height: 140px;
  }
  .credit-card-hover:hover {
    border-radius: 15px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    margin-top: 0;
    background-color: #ffc966bb;
  }
  .right {
    font-size: 20px;
  }
  .left {
    /* margin-top: 8px; */
  }
  .group {
    margin-top: 8px;
  }
  .icon-second {
    color: var(--second-color);
  }
  .card-number {
    text-align: center;
    margin-bottom: 0px;
    margin-top: 0px;
    padding: 0px;
    /* white-space: nowrap; */
  }
  .top-row {
    margin-bottom: 0px;
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
    margin: 0px;
  }

  .digit:nth-child(4n) {
    margin-right: 3%;
  }
  .dot {
    font-size: 28px;
    font-weight: bold;
    color: gray;
  }
  .payment-info-not-available {
    color: #ff0000;
    font-style: italic;
    font-size: 14px;
    margin-top: auto;
    margin-bottom: auto;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .not-available {
    background-color: var(--primary0);
  }
`
