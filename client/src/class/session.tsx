class Session {
  private static list: Session[] = [];

  public token: string;
  public user: {
    email: string;
    isConfirm: boolean;
    id: string;
  };

  private constructor(user: { email: string; isConfirm: boolean; id: string }) {
    this.token = Session.generateToken();
    this.user = {
      email: user.email,
      isConfirm: user.isConfirm,
      id: user.id,
    };
  }

  private static generateToken = (): string => {
    const length = 6;
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    let result = "";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters[randomIndex];
    }

    return result;
  };

  public static create = (user: { email: string; isConfirm: boolean; id: string }): Session => {
    const session = new Session(user);

    Session.list.push(session);

    return session;
  };

  public static get = (token: string): Session | null => {
    return Session.list.find((item) => item.token === token) || null;
  };

  public static main = () => {
    console.log(`Створений токен: ${Session.generateToken()}`);
  };
}

Session.main(); // Виклик статичного методу при запуску скрипту

export { Session };
