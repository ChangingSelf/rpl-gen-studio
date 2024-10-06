
export class Dice {
  public title: string = "";
  public face: number = 100; //骰子面数
  public check: number | null = null; //检定值
  public random: number = 1; //骰子出目
  constructor(
    title: string,
    face: string,
    check: string,
    random: string
  ) {
    this.title = title;
    this.face = Number.parseInt(face);
    if (check === "NA") {
      this.check = null;
    } else {
      this.check = Number.parseInt(check);
    }
    this.random = Number.parseInt(random);
  }

  toString() {
    return `(${this.title},${this.face},${this.check ?? "NA"},${this.random})`;
  }

  toRaw(): any {
    return {
      content: this.title,
      dicemax: this.face,
      face: this.random,
      check: this.check,
    }
  }
}
