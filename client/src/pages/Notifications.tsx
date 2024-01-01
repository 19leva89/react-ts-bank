import { FC, useContext, useEffect, useState } from "react";
import { ButtonBack } from "../components/button-back";
import notificationAnnouncement from "./../img/notification-btn.svg";
import notificationWarning from "./../img/danger-btn.svg";
import { AuthContext } from "../utils/AuthContext";

const NotificationsPage: FC = () => {
  const authContext = useContext(AuthContext);
  const { notifications } = authContext.authState;

  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 60000); // Оновлюємо час кожну хвилину

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const response = await fetch("http://localhost:4000/user-notifications");
        if (response.ok) {
          const data = await response.json();
          // Прийняти отримані дані з сервера і оновити стан за допомогою діспетчера
        } else {
          throw new Error("Failed to fetch notifications");
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    }

    fetchNotifications();
  }, []); // Тригер fetch після завантаження компонента

  const addNotification = async (eventType: string, time: string) => {
    try {
      const response = await fetch("http://localhost:4000/user-notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ eventType, time }),
      });

      if (response.ok) {
        // Відправка була успішною, оновлюємо стан за допомогою діспетчера
      } else {
        throw new Error("Failed to add notification");
      }
    } catch (error) {
      console.error("Error adding notification:", error);
    }
  };

  return (
    <main className="main__container main__container--gray">
      <div className="menu__container">
        <ButtonBack />
        <h1 className="form__title">Notifications</h1>
        <div className="stub"></div>
      </div>

      {notifications.length > 0 && (
        <div className="notifications__container">
          {notifications.map((notification, index) => {
            const notificationTime = new Date(notification.time).getTime();
            const minutesAgo = Math.floor((currentTime - notificationTime) / (1000 * 60));
            return (
              <div key={`login-${index}`} className="notification__wrapper">
                <div className="notification__item">
                  <img src={notificationAnnouncement} alt="Announcement" />
                  <div className="notification__content">
                    <div className="notification__title">New {notification.eventType}</div>
                    <div className="notification__subtitle">
                      <div className="notification__time">{minutesAgo} min. ago</div>
                      <div className="notification__event">Announcement</div>
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
function dispatch(arg0: { type: string; payload: any }) {
  throw new Error("Function not implemented.");
}
