class Confirm {
  private static list: Confirm[] = [];

  public code: number;
  public data: any;

  constructor(data: any) {
    this.code = Confirm.generateCode();
    this.data = data;
  }

  private static generateCode = (): number => {
    return Math.floor(Math.random() * 9000) + 1000; // Повернення згенерованого коду
  };

  public static create = (data: any): void => {
    const newConfirm = new Confirm(data);
    Confirm.list.push(newConfirm);

    setTimeout(() => {
      Confirm.delete(newConfirm.code);
    }, 24 * 60 * 60 * 1000); // 24 години у мілісекундах

    console.log(Confirm.list);
  };

  private static delete = (code: number): boolean => {
    const length = Confirm.list.length;

    Confirm.list = Confirm.list.filter((item) => item.code !== code);

    return length > Confirm.list.length;
  };

  public static getData = (code: number): any | null => {
    const obj = Confirm.list.find((item) => item.code === code);

    return obj ? obj.data : null;
  };
}

export { Confirm };
