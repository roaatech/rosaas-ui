import styled from 'styled-components'
import bg from '../../assets/img/pages/login/bg.svg'

export const Wrapper = styled.div`
  background-image: url(${bg});
  background-size: cover;

  .form-check-input:checked {
    background-color: var(--second-color);
    border-color: var(--second-color);
  }
  .tab-header {
    transform: rotate(22deg);
  }
  .form-check-input {
    cursor: pointer;
  }
  .tab-header.rtl {
    transform: rotate(-30deg) !important;
  }
  .main-container {
    margin: 0 auto;
  }
  .text-seamlessly {
    font-size: var(--largeFont);
  }

  .rtl .form-check {
    direction: rtl;
    text-align: right;
    display: flex;
  }
  .rtl .form-check-input {
    margin-left: 0;
  }

  .align-start-alone {
    margin-right: ${(props) =>
      props.direction == 'ltr' ? 'auto !important' : ''};
    margin-left: ${(props) =>
      props.direction == 'rtl' ? 'auto !important' : ''};
  }
  .check-circle {
    color: green;
  }
  .rtl .form-check-label {
    margin-right: 3px; /* Increase space between checkbox and label */
  }
`
export const RibbonWrapper = styled.div`
  .ribbon-container {
    /* margin-top: -30px; */
    position: absolute;
    z-index: 999;
    /* transform: translate(-50%, -50%); */
  }
  .ribbon {
    position: relative;
    display: inline-block; /* Adjust as needed */
    padding: 10px 20px; /* Adjust for text padding */
    background-color: var(--second-color);
    color: white; /* Adjust text color */
    font-weight: bold; /* Optional for better readability */
    text-align: center; /* Center the text */
    min-width: 50%;
    left: 100%;
    margin-top: -15px !important;
  }

  .ribbon::before,
  .ribbon::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    width: 0;
    border-style: solid;
  }

  .ribbon::before {
    left: -10px; /* Adjust size of the triangle */
    border-width: 15px 10px 15px 0; /* Adjust triangle shape */
    border-color: transparent var(--second-color) transparent transparent;
  }

  .ribbon::after {
    right: -10px; /* Adjust size of the triangle */
    border-width: 15px 0 15px 10px; /* Adjust triangle shape */
    border-color: transparent transparent transparent var(--second-color);
  }
  .custom-ribbon {
    position: relative;
    display: inline-block; /* لضبط العرض حسب النص */
    padding: 10px 20px; /* لضبط المسافة الداخلية */
    background-color: var(--second-color); /* اللون الرئيسي */
    color: white; /* لون النص */
    font-weight: bold; /* لجعل النص واضحاً */
    text-align: center; /* محاذاة النص في المنتصف */
    clip-path: polygon(10% 0%, 90% 0%, 100% 50%, 90% 100%, 10% 100%, 0% 50%);
  }

  .custom-ribbon::before,
  .custom-ribbon::after {
    content: '';
    position: absolute;
    top: 0;
    height: 100%;
    width: 20px;
    background-color: var(--second-color); /* نفس لون الخلفية */
  }

  .custom-ribbon::before {
    left: -20px; /* المسافة البادئة من الجهة اليسرى */
    clip-path: polygon(100% 0%, 0% 50%, 100% 100%);
  }

  .custom-ribbon::after {
    right: -20px; /* المسافة البادئة من الجهة اليمنى */
    clip-path: polygon(0% 0%, 100% 50%, 0% 100%);
  }
`
