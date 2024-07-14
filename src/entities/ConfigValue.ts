import { Method } from "./Method";

/**
 * 设置行的数值
 */
export enum ValueType{
  FUNCTION= "function",
  ENUM= "enumerate",
  PROTOCOL= "protocol",
  METHOD= "method",
  DIGIT= "digit",
}


export class ConfigValue{
  
  constructor(
    public valueType: ValueType,
    public value: Method | number | string,
  ) {
    
  }

  static parse(target: string, value: string): ConfigValue | null{
    //类型1：整数型
    const digitTypeList = ['am_dur_default', 'bb_dur_default', 'bg_dur_default', 'tx_dur_default', 'speech_speed', 'asterisk_pause', 'secondary_alpha', 'secondary_brightness'];
    if (digitTypeList.some(x => x === target)) {
      return new ConfigValue(ValueType.DIGIT,Number(value));
    }
    //类型2：method
    const methodTypeList = ['am_method_default', 'bb_method_default', 'bg_method_default', 'tx_method_default'];
    if (methodTypeList.some(x => x === target)) {
      const method = Method.parse(value);
      if (!method) {
        return null;
      }
      return new ConfigValue(ValueType.METHOD, method);
    }

    //类型3：BGM （已禁用）

    //类型4：函数
    if (target === 'formula') {
      return new ConfigValue(ValueType.FUNCTION, value);//TODO:解析函数的参数
    }

    //类型5：枚举
    if (target === 'inline_method_apply') {
      return new ConfigValue(ValueType.ENUM, value);
    }

    if (target === 'method_protocol') {
      return new ConfigValue(ValueType.PROTOCOL, value);
    }

    return null;
  }

  toString() {
    switch (this.valueType) {
      case ValueType.DIGIT: case ValueType.FUNCTION: case ValueType.ENUM: case ValueType.PROTOCOL:
        return String(this.value);
      case ValueType.METHOD:
        return (this.value as Method).toString();
    }  
  }
}