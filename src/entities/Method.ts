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
    const regex = /^<(\w+)(=\d+)?>$/m;
    let r = regex.exec(text);
    if (r) {
      return new Method(r[1],Number(r[2]));
    } else {
      return null;
    }
  }
}