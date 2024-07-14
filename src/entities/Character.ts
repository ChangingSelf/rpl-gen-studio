export class Character {
  constructor(
    public name: string = '',//角色名
    public alpha: number | null = null,//不透明度
    public subtype: string = 'default',//差分名
  ) {

  }

  public toString() {
    let str = this.name;
    if (this.alpha !== -1 && !this.alpha) {
      str += `(${this.alpha})`;
    }
    if (this.subtype !== "default") {
      str += `.${this.subtype}`;
    }
    return str;
  }
}

