import { FC } from "react";

import "./style.css";

type DividerProps = {
  className: string;
};

export const Divider: FC<DividerProps> = ({ className }) => {
  return <div className={className}></div>;
};
