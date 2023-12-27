import { FC } from "react";
import { Link } from "react-router-dom";
import "./style.css";

type ButtonProps = {
  name: string;
  className: string;
  href: string;
  onClick: () => void;
};

export const Button: FC<ButtonProps> = ({ name, className, href, onClick }) => {
  return (
    <Link to={href} type="submit" className={className} onClick={onClick}>
      <span className="button--name">{name}</span>
    </Link>
  );
};
