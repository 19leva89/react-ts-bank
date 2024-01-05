export const SESSION_KEY = "sessionAuth";

export interface Session {
  token: string;
  user: { email: string; isConfirm: boolean; id: number };
}

export const saveSession = (session: Session): void => {
  try {
    const sessionString = JSON.stringify(session);
    localStorage.setItem(SESSION_KEY, sessionString);
  } catch (err) {
    console.log(err);
  }
};

export const loadSession = (): Session | null => {
  try {
    const sessionData = localStorage.getItem(SESSION_KEY);
    if (!sessionData) return null;

    const session = JSON.parse(sessionData) as Session;
    return session;
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
