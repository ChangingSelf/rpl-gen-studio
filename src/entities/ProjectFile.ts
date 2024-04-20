/* eslint-disable @typescript-eslint/naming-convention */
/**
 * 项目文件接口定义
 */



/**
 * 项目配置
 * TODO
 */
interface ProjectConfig {
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
interface MediaDefine {

}

/**
 * 角色定义表
 * TODO
 */
interface CharacterTable {

}

/**
 * 切换方式
 */
interface Method {
  method: string;
  method_dur: number;
}

/**
 * 角色
 */
interface Character {
  name: string;
  subtype: string;
  alpha: number | null;
}

/**
 * 音效
 */
interface Sound {
  sound: string;//音效地址
  time: number;//持续时间
}

/**
 * 音效集
 */
interface SoundSet {
  [key: string]: Sound
}


/**
 * 剧本行（项目文件中原始定义结构）
 */
export interface LogLine {
  type: string;//行类型

  //注释行
  content?: string;//对话行或者注释行内容

  //异常行
  info?: string;//异常信息

  //设置行
  target?: string;//设置项
  value_type?: string;//设置项值的类型
  value?: number | string | Method;//设置值

  //背景行
  bg_method?: Method;
  object?: string;//媒体对象

  //对话行
  charactor_set?: Character;
  ab_method?: Method;
  tx_method?: Method;
  sound_set?: SoundSet;

}

/**
 * 剧本文件对象（单个）
 * 
 * 注意：这是单个文件的对象，并不对应项目文件的文件列表
 */
export interface LogFile {
  [lineNum: string]: LogLine
}

/**
 * 剧本文件对象
 */
interface LogFiles {
  [fileName: string]: LogFile
}

/**
 * 项目文件
 */
export interface ProjectFile {
  config: ProjectConfig;
  mediadef: MediaDefine;
  chartab: CharacterTable;
  logfile: LogFiles;
}