import { FC } from "react";
import "./style.css";

type AlertProps = {
  status: string;
  message: string | null;
};

export const Alert: FC<AlertProps> = ({ status = "disabled", message }) => {
  return <div className={`alert alert--${status}`}>{message}</div>;
};

export const Loader: FC = () => {
  return <div className="loader"></div>;
};

export const Skeleton: FC = () => {
  return (
    <div className="skeleton">
      <div className="skeleton__item"></div>
      <div className="skeleton__item"></div>
      <div className="skeleton__item"></div>
    </div>
  );
};
