import { FC } from "react";
import { useNavigate } from "react-router-dom";

import buttonBack from "./button-back.svg";
import "./style.css";

export const ButtonBack: FC = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    // console.log("Button clicked");
    navigate(-1); // Повернення на попередню сторінку
  };

  return (
    <div className="button button__back" onClick={handleClick}>
      <img src={buttonBack} alt="<" width="24" height="24" />
    </div>
  );
};
