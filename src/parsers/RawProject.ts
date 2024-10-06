/* eslint-disable @typescript-eslint/naming-convention */
/**
 * 原始项目文件接口定义
 * 
 * 原始项目文件中的剧本文件数据被称为log，本扩展中将其称为script，便于区分
 */

/**
 * 项目配置
 * TODO
 */
interface RawProjectConfig {
  Name: string;
  Cover: string;
  Width: number;
  Height: number;
  frame_rate: number;
  Zorder: string[];
}
/**
 * 媒体定义
 * TODO
 */
interface RawMediaDefine {

}

/**
 * 角色定义表
 * TODO
 */
interface RawCharacterTable {

}

/**
 * 切换方式
 */
export interface RawMethod {
  method: string;
  method_dur: number | string;
}

/**
 * 角色
 */
export interface RawCharacter {
  name: string;
  subtype: string;
  alpha: number | null;
}

export interface RawCharacters{
  [key:string]:RawCharacter
}

/**
 * 音效
 */
interface RawSound {
  sound: string;//音效地址
  time?: number;//持续时间
  delay?: number;//延迟时间
}

/**
 * 音效集
 */
export interface RawSoundSet {
  [key: string]: RawSound
}


/**
 * 剧本行（项目文件中原始定义结构）
 */
export interface RawLine {
  type: string;//行类型

  //注释行
  content?: string;//对话行或者注释行内容

  //异常行
  info?: string;//异常信息

  //设置行
  target?: string;//设置项
  value_type?: string;//设置项值的类型
  value?: number | string | RawMethod;//设置值

  //背景行
  bg_method?: RawMethod;
  object?: string;//媒体对象

  //对话行
  charactor_set?: RawCharacters;
  ab_method?: RawMethod;
  tx_method?: RawMethod;
  sound_set?: RawSoundSet;

  //停顿行
  time?: number;
}

/**
 * 原始剧本文件对象（单个）
 * 
 * 注意：这是单个文件的对象，并不对应项目文件的文件列表
 */
export interface RawScript {
  [lineNum: string]: RawLine
}

/**
 * 原始剧本文件对象
 */
export interface RawScripts {
  [fileName: string]: RawScript
}

/**
 * 项目文件
 */
export interface RawProject {
  config?: RawProjectConfig;
  mediadef?: RawMediaDefine;
  chartab?: RawCharacterTable;
  logfile?: RawScripts;
}