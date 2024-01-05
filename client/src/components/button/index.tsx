import { FC, ReactNode } from "react";
import { Link } from "react-router-dom";
import "./style.css";

type ButtonProps = {
  children: ReactNode;
  className: string;
  link: string;
  onClick?: () => void;
};

export const Button: FC<ButtonProps> = ({ children, className, link, onClick }) => {
  return (
    <Link to={link} type="submit" className={className} onClick={onClick}>
      {children}
    </Link>
  );
};
