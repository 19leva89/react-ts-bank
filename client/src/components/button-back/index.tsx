import { FC } from "react";

import "./style.css";

export const ButtonBack: FC = () => {
  const handleClick = () => {
    console.log("Button clicked");
    // Ви можете виконати інші дії, що пов'язані з натисканням кнопки тут
  };

  return (
    <div className="back-button" onClick={handleClick}>
      <img src="/svg/back-button.svg" alt="<" width="24" height="24" />
    </div>
  );
};
