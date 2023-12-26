import { FC } from "react";
import "./style.css";
import btnImg from "./btn-ua-parcels.svg";

type ButtonProps = {
  name: string;
  className: string;
  btnHeight: string;
  onClick?: () => void;
};

export const Button: FC<ButtonProps> = ({ name, className, btnHeight, onClick }) => {
  const handleClick = () => {
    console.log("Button clicked");
    // Ви можете виконати інші дії, що пов'язані з натисканням кнопки тут
  };

  return (
    <button
      type="submit"
      className={className}
      style={{ height: btnHeight }}
      onClick={onClick || handleClick}
    >
      {btnImg && <img height="15px" src={btnImg} alt="Button" />}
      <span className="header__btn--info">{name}</span>
    </button>
  );
};
