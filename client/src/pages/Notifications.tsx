import { FC, useContext, useEffect } from "react";
import { AuthContext } from "../utils/authProvider";

import { ButtonBack } from "../components/button-back";
import notificationAnnouncement from "./../img/notification-btn.svg";
import notificationWarning from "./../img/danger-btn.svg";

const NotificationsPage: FC = () => {
  const authContext = useContext(AuthContext);
  const { authState, loadNotification } = authContext;
  const { notifications } = authState;
  const currentTime = Date.now();

  useEffect(() => {
    loadNotification();
  }, []);

  return (
    <main className="main__container main__container--gray">
      <div className="menu__container">
        <ButtonBack />
        <h1 className="form__title">Notifications</h1>
        <div className="stub"></div>
      </div>

      {notifications.length > 0 && (
        <div className="notifications__container">
          {notifications.reverse().map((notify, i) => {
            const notificationTime = new Date(notify.eventTime).getTime();
            const minutesAgo = Math.floor((currentTime - notificationTime) / (1000 * 60));
            const getImageByEventType = (eventType: string) => {
              if (eventType === "Announcement") {
                return notificationAnnouncement;
              } else if (eventType === "Warning") {
                return notificationWarning;
              } else {
                // Якщо eventType не співпадає з жодним з очікуваних значень
                return undefined; // Або верніть значення за замовчуванням
              }
            };

            return (
              <div key={`login-${i}`} className="notification__wrapper">
                <div className="notification__item">
                  <img src={getImageByEventType(notify.eventType)} alt={notify.eventType} />
                  <div className="notification__content">
                    <div className="notification__title">New {notify.eventTitle}</div>
                    <div className="notification__subtitle">
                      <div className="notification__time">{minutesAgo} min. ago</div>
                      <div className="notification__event">{notify.eventType}</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
};

export default NotificationsPage;
