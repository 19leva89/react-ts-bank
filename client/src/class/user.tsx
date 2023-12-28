class User {
  private static list: User[] = [];
  private static count = 1;

  public id: number;
  public email: string;
  public password: string;
  public isConfirm: boolean;

  constructor({ email, password }: { email: string; password: string }) {
    this.id = User.count++;
    this.email = String(email).toLowerCase();
    this.password = String(password);
    this.isConfirm = false;
  }

  public static create(data: { email: string; password: string }): User {
    const user = new User(data);
    console.log(user);

    this.list.push(user);
    console.log(this.list);

    return user;
  }

  public static getByEmail(email: string): User | null {
    return this.list.find((user) => user.email === String(email).toLowerCase()) || null;
  }
}

export { User };
