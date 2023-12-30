import { FC } from "react";
import { ButtonBack } from "../components/button-back";
import notificationAnnouncement from "./../img/notification-btn.svg";
import notificationWarning from "./../img/danger-btn.svg";

const NotificationsPage: FC = () => {
  return (
    <main className="main__container main__container--gray">
      <div className="menu__container">
        <ButtonBack />
        <h1 className="form__title">Notifications</h1>
        <div className="stub"></div>
      </div>

      <div className="notifications__container">
        <div className="notification__wrapper">
          <div className="notification__item">
            <img src={notificationAnnouncement} alt="Announcement" />
            <div className="notification__content">
              <div className="notification__title">New reward system</div>
              <div className="notification__subtitle">
                <div className="notification__time">10 min. ago</div>
                <div className="notification__event">Announcement</div>
              </div>
            </div>
          </div>
        </div>

        <div className="notification__wrapper">
          <div className="notification__item">
            <img src={notificationWarning} alt="Announcement" />
            <div className="notification__content">
              <div className="notification__title">New login</div>
              <div className="notification__subtitle">
                <div className="notification__time">20 min. ago</div>
                <div className="notification__event">Warning</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default NotificationsPage;
