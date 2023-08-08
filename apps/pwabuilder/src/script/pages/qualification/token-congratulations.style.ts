import { css } from 'lit';
import {
  largeBreakPoint,
  mediumBreakPoint,
  smallBreakPoint,
} from '../../utils/css/breakpoints';

export default css`
  #congrats-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 80px 101px;
  }
  #header h1 {
    font-size: 30px;
    line-height: 36px;
    font-weight: 600;
    text-align: center;
  }
  #header h2 {
    font-size: 16px;
    line-height: 22px;
    text-align: center;
    color: #292c3a;
    font-weight: 400;
  }
  .strike-through {
    text-decoration: line-through;
  }
  .username {
    color: #4f3fb6;
  }
  #content-holder {
    flex-direction: column;
    justify-content: center;
    display: flex;
    padding: 0 52px;
  }
  #token-id {
    display: grid;
    grid-auto-rows: 165px;
    grid-auto-columns: 82px;
    grid-row-gap: 95px;
    width: 719px;
    height: 691px;
    margin: 20px 0;
    background-image: url(/assets/token_code_bg_image.png);
    background-repeat: no-repeat;
    background-position: center;
    background-size: 100% 100%;
  }
  .site-card {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
    width: 256px;
    height: 86px;
    background: #ffffff;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);
    border-radius: 6px;
    margin: 26px 0 0 25px;
  }
  .site-icon {
    display: grid;
    width: 62px;
    height: 62px;
    background: #ffffff;
    box-shadow: 2px 2px 15px rgba(0, 0, 0, 0.15);
    border-radius: 4px;
  }
  .site-icon img {
    width: 38.26px;
    height: 36.65px;
    place-self: center;
  }
  .site-desc {
    font-weight: bold;
    color: #292c3a;
  }
  .title {
    font-size: 24px;
    width: 145px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .url {
    font-size: 14px;
    width: 145px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .token-input-container {
    display: flex;
    align-items: center;
    grid-row-start: 2;
    grid-column-start: 3;
    width: 402px;
    height: 68px;
    background: rgba(255, 255, 255, 0.4);
    border: 1px solid #4f3fb6;
    box-shadow: 2px 2px 20px rgba(79, 63, 182, 0.4);
    border-radius: 4px;
  }
  .token-input-container sl-input::part(base) {
    width: 100%;
    height: 50px;
    background: #ffffff;
    border: 1px;
    border-radius: 4px;
    background: #ffffff;
    border: 1px dashed #000000;
    border-radius: 4px;

  }

  #code::part(input){
    height: 50px;
  }
  
  .copy-button {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 50px;
    height: 50px;
    background: #ffffff;
    border: 1px solid #4f3fb6;
    border-radius: 4px;
    margin-left: 5px;
  }
  #next-steps {
    width: 719px;
    height: 325px;
    border-radius: 10px;
    background-color: #fff;
    align-self: center;
    font-size: 14px;
  }
  #next-steps h3 {
    font-family: Hind;
    font-size: 20px;
    font-weight: 700;
    line-height: 24px;
    letter-spacing: 0em;
    text-align: left;
    color: #4f3fb6;
    margin: 0;
    padding: 15px 0px 0px 10px;
  }
  #next-steps h4 {
    color: #4f3fb6;
  }
  .steps-list {
    padding: 0px 25px 0px 30px;
    margin-bottom: 0;
  }
  .steps-list li {
    padding: 10px 0;
  }
  .steps-list a {
    color: black;
    text-decoration: underline;
  }
  .steps-list a:hover,
  .steps-list a:hover {
    cursor: pointer;
    color: #4f3fb6;
  }
  #publishing-instructions {
    padding: 0px 0px 10px 20px;
  }

  @media screen and (max-width: 479px) {
    .token-input-container {
      height: 50px;
    }
    #code {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    .token-input-container sl-input::part(base) {
      height: 40px;
    }
    .copy-button {
      width: 45px;
      height: 40px;
    }
    .title {
      width: 100px;
    }
    .url {
      width: 100px;
      font-size: 11px;
    }
  }

  @media screen and (min-width: 1199px) {
    #header h1 {
      max-width: 900px;
    }
  }
  /* screen at pixels 479 and 639 seem to not take breakpoint styling -- bug */
  ${smallBreakPoint(css`
    #congrats-wrapper {
      padding: 30px;
    }
    #content-holder {
      padding: 0;
    }
    #token-id {
      width: 345px;
      height: 519px;
      background-image: url(/assets/congrats-manny-mobile.png);
      background-repeat: no-repeat;
      background-position: center;
      background-size: 100% 100%;
      grid-auto-rows: 100px;
      grid-auto-columns: 22px;
      row-gap: 108px;
      align-self: center;
    }
    .token-input-container {
      width: 300px;
      height: 60px;
      grid-column-start: 2;
    }
    .token-input-container sl-input::part(input) {
      text-align: center;
    }
    .site-card {
      width: 185px;
      height: 60px;
      margin: 10px 0 0 10px;
    }
    .title {
      font-size: 18px;
    }
    .url {
      font-size: 11px;
    }
    .site-icon {
      width: 45px;
      height: 45px;
    }
    #next-steps {
      width: 345px;
      height: 593px;
      font-size: 16px;
    }
  `)}
  ${mediumBreakPoint(css`
    #congrats-wrapper {
      padding: 40px 50px;
    }
    #content-holder {
      padding: 0 25px;
    }
    #token-id {
      width: 469px;
      height: 447px;
      grid-auto-rows: 125px;
      grid-auto-columns: 35px;
      row-gap: 30px;
    }
    .token-input-container {
      width: 392px;
      height: 68px;
      grid-column-start: 2;
    }
    .site-card {
      width: 215px;
      height: 72px;
      margin: 10px 0px 0px 10px;
    }
    .title {
      font-size: 18px;
    }
    .url {
      width: 125px;
      font-size: 11px;
    }
    .site-icon {
      width: 50px;
      height: 50px;
    }
    #next-steps {
      width: 469px;
      height: 430px;
    }
  `)}
${largeBreakPoint(css`
    #congrats-wrapper {
      padding: 50px 32px;
    }
    #token-id {
      width: 570px;
      height: 548px;
      grid-auto-rows: 150px;
      align-self: center;
      grid-auto-columns: 82px;
      row-gap: 45px;
    }
    .site-card {
      width: 248px;
      height: 78px;
    }
    .token-input-container {
      grid-column-start: 2;
    }
    #next-steps {
      width: 570px;
      height: 370px;
      align-self: center;
    }
  `)}
`;
