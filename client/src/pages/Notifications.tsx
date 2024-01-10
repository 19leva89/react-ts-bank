import { FC, useEffect, useReducer } from "react";
import { AUTH_ACTION_TYPE, authInitialState, authReducer } from "../utils/authReducer";
import { REQUEST_ACTION_TYPE, requestInitialState, requestReducer } from "../utils/requestReducer";
import { getTokenSession } from "../script/session";

import { ButtonBack } from "../components/button-back";
import { Alert, Loader, Skeleton } from "../components/load";
import notificationAnnouncement from "./../img/notification-btn.svg";
import notificationWarning from "./../img/danger-btn.svg";

const NotificationsPage: FC = () => {
  const [authState, dispatchAuth] = useReducer(authReducer, authInitialState);
  const [requestState, dispatchRequest] = useReducer(requestReducer, requestInitialState);
  const { notifications } = authState;
  const currentTime = Date.now();

  useEffect(() => {
    const loadNotification = async () => {
      try {
        dispatchRequest({ type: REQUEST_ACTION_TYPE.PROGRESS });

        const token = getTokenSession();
        if (!token) {
          dispatchRequest({ type: REQUEST_ACTION_TYPE.ERROR, payload: "Session token not found" });
          return;
        }

        const res = await fetch("http://localhost:4000/user-notifications", {
          headers: {
            Authorization: token, // Додавання токену до заголовків
          },
        });

        if (res.ok) {
          const data = await res.json();

          dispatchRequest({
            type: REQUEST_ACTION_TYPE.SUCCESS,
            payload: data.message,
          });

          dispatchAuth({
            type: AUTH_ACTION_TYPE.UPD_NOTIFICATION,
            payload: { notifications: data.notifications },
          });
        } else {
          dispatchRequest({
            type: REQUEST_ACTION_TYPE.ERROR,
            payload: "Failed to fetch notifications",
          });
        }
      } catch (err) {
        dispatchRequest({
          type: REQUEST_ACTION_TYPE.ERROR,
          payload: `Error fetching notifications: ${err}`,
        });
      }
    };

    loadNotification();
  }, []);

  return (
    <main className="main__container main__container--gray">
      <div className="menu__container">
        {requestState.status === REQUEST_ACTION_TYPE.PROGRESS && <Loader />}

        <ButtonBack />
        <h1 className="form__title">Notifications</h1>
        <div className="stub"></div>
      </div>

      {requestState.status === REQUEST_ACTION_TYPE.PROGRESS && (
        <section className="notification__wrapper">
          <Skeleton />
        </section>
      )}

      {requestState.status === REQUEST_ACTION_TYPE.ERROR && (
        <section className="notification__wrapper">
          <Alert status={requestState.status} message={requestState.message} />
        </section>
      )}

      {notifications.length > 0 && (
        <div className="notifications__container">
          {notifications
            .reverse()
            .slice(0, 20)
            .map((notify, i) => {
              const notificationTime = new Date(notify.eventTime).getTime();
              const minutesAgo = Math.floor((currentTime - notificationTime) / (1000 * 60));
              const getImageByEventType = (eventType: string) => {
                if (eventType === "Announcement") {
                  return notificationAnnouncement;
                } else if (eventType === "Warning") {
                  return notificationWarning;
                } else {
                  // Якщо eventType не співпадає з жодним з очікуваних значень
                  return undefined;
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
