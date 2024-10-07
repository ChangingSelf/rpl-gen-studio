import { Line, LineType } from "../Line";
import { RawLine } from "../RawProject";
import { BubbleParams } from "./components/BubbleParams";
import { Method } from "./components/Method";

/**
 * 常驻气泡行
 */
export class BubbleLine extends Line {
  constructor(
    public bubbleMethod: Method,
    public object: string| BubbleParams | null,
  ) {
    super(LineType.BUBBLE);
  }

  toString(): string {
    let obj = '';
    if(this.object === null){
      obj = 'NA';
    }else if (typeof this.object === 'string') {
      obj = this.object;
    }else{
      obj = this.object.toString();
    }
    
    return `<bubble>${this.bubbleMethod}:${obj}`;
  }

  static override parse(text: string): BubbleLine | null {
    const regex = /^<bubble>(<[\w\=]+>)?:(.+?)(\("([^\\"]*)","([^\\"]*)",?(<[\w\=]+>)?\))?$/m;
    let r = regex.exec(text);
    if (r) {

      const bubbleMethod = Method.parse(r[1]) ?? new Method();
      const bubble = r[2];
      const params = r[3];
      const headText = r[4];
      const mainText = r[5];
      const textMethod = r[6];

      if(params){
        return new BubbleLine(bubbleMethod,new BubbleParams(bubble,headText,mainText,Method.parse(textMethod) ?? new Method()));
      }else if(bubble === 'NA'){
        return new BubbleLine(bubbleMethod,null);
      }else{
        return new BubbleLine(bubbleMethod,bubble);
      }
    } else {
      return null;
    }
  }
  
  toRaw(): RawLine {
    const obj = (this.object === null || typeof this.object === 'string') ? this.object : this.object.toRaw();

    return {
      type: LineType.BUBBLE,
      bb_method: this.bubbleMethod?.toRaw(),
      object: obj,
    };
  }
}
