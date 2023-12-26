import { FC } from "react";
import "./style.css";

type ButtonProps = {
  name: string;
  className: string;
  onClick?: () => void;
};

export const Button: FC<ButtonProps> = ({ name, className, onClick }) => {
  const handleClick = () => {
    console.log("Button clicked");
    // Ви можете виконати інші дії, що пов'язані з натисканням кнопки тут
  };

  return (
    <button type="submit" className={className} onClick={onClick || handleClick}>
      <span className="header__btn--info">{name}</span>
    </button>
  );
};
