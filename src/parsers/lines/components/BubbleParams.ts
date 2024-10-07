import { Method } from "./Method";

export class BubbleParams {
  
  constructor(
    public bubble: string,
    public headerText: string,
    public mainText: string,
    public textMethod: Method,
  ) {

  }
  
  toString(): string {
    let methodStr = '';
    if(this.textMethod){
      methodStr = ','+this.textMethod.toString();
    }

    return `${this.bubble}("${this.headerText}","${this.mainText}"${methodStr})`;
  }

  toRaw() {
    return {
      bubble: this.bubble,
      header_text: this.headerText,
      main_text: this.mainText,
      tx_method: this.textMethod.toRaw(),
    }
  }
}