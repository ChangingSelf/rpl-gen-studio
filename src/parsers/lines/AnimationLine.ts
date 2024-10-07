import { Line, LineType } from "../Line";
import { RawLine, RawMediaObjectGroup } from "../RawProject";
import { Method } from "./components/Method";

/**
 * 常驻立绘行
 */
export class AnimationLine extends Line {
  constructor(
    public method: Method | null,
    public object: string| string[] | null,
  ) {
    super(LineType.ANIMATION);
  }

  toString(): string {
    let obj = '';
    if(this.object === null){
      obj = 'NA';
    }else if (typeof this.object === 'string') {
      obj = this.object;
    }else{
      obj = `(${this.object.join(',')})`;
    }

    return `<animation>${this.method}:${obj}`;
  }

  static override parse(text: string): AnimationLine | null {
    
    const regex = /^<animation>(<[\w\=]+>)?:(.+)$/m;
    let r = regex.exec(text);
    if (r) {
      const method = Method.parse(r[1]) ?? new Method();
      const content = r[2];
      if (content.includes('(') && content.endsWith(')')) {
        const mediaNamesStr = content.slice(1, -1).trim();
        const mediaNames = mediaNamesStr.split(',').map(name => name.trim());
        return new AnimationLine(method,mediaNames);
      }else{
        return new AnimationLine(method,content); 
      }
    } else {
      return null;
    }
  }
  
  toRaw(): RawLine {
    let obj:{[key: string]: any;}| string | null = {};
    if(this.object === null || this.object === 'NA'){
      obj = null;
    }else if(typeof this.object === 'string'){
      obj = this.object;
    }else{
      for(let i=0;i<this.object.length;i++){
        obj[String(i)] = this.object[i];
      }
    }

    return {
      type: LineType.ANIMATION,
      am_method: this.method?.toRaw(),
      object: obj,
    };
  }
}
