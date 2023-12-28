export const SESSION_KEY = "sessionAuth";

export interface Session {
  // Додайте поля вашого об'єкту сесії тут
  token: string;
  // інші поля...
}

export const saveSession = (session: Session): void => {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch (err) {
    console.log(err);
  }
};

export const loadSession = (): Session | null => {
  try {
    const session = JSON.parse(localStorage.getItem(SESSION_KEY) || "") as Session;
    return session || null;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const getTokenSession = (): string | null => {
  try {
    const session = loadSession();
    return session ? session.token : null;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const getSession = (): Session | null => {
  try {
    const sessionData = localStorage.getItem(SESSION_KEY);
    const session = sessionData ? (JSON.parse(sessionData) as Session) : null;

    return session;
  } catch (err) {
    console.error(err);
    return null;
  }
};
