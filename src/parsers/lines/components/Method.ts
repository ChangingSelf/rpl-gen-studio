import { RawMethod } from "../../RawProject";

/**
 * 效果函数
 * 
 */
export class Method{
  constructor(
    public method: string = 'default',
    public methodDuration: string | number = 'default',//可能取值为“default”或者数值
  ) {
    
  }

  static parse(text: string): Method | null{
    const regex = /^<(\w+)(=(\d+))?>$/m;
    let r = regex.exec(text);
    if (r) {
      if (r[2]) {
        return new Method(r[1],Number(r[3]));
      } else {
        return new Method(r[1]);
      }
    } else {
      return null;
    }
  }
  
  toString(): string {
    if (this.method === 'default') {
      return '';
    } else {
      if (this.methodDuration === 'default') {
        return `<${this.method}>`;
      } else {
        return `<${this.method}=${this.methodDuration}>`;
      }
    }
  }

  toRaw(): RawMethod {
    return {
      method: this.method ?? "default",
      method_dur: this.methodDuration ?? "default",
    };
  }
}