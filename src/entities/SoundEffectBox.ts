
export class SoundEffectBox {
  constructor(
    public file: string = "", //wav文件路径，与obj最多只有一个会取值
    public obj: string = "", //媒体对象，与file最多只有一个会取值
    public second: number = -1, //星标音频时间，单位为秒。负数代表未设置//{file_or_obj;*time}
    public frame: number = -1, //音效延后播放帧数，单位为帧。负数代表未设置//{file_or_obj;frame}
    public isPending: boolean = false, //是否待处理
    public text: string = "", //指定的待合成文本
  ) { }

  public toString() {
    if (this.isPending) {
      /**
      1. `{*}` ：待语音合成的标志，将本对话行的全部发言文本执行语音合成；
      2. `{*speech_text}` ：合成指定文本的语音的标志；指定文本只能包含`，。：？！“”`等中文符号；
      3. `{"./media/voice.wav";*}` ：当需要使用外部音频，而非语音合成时，可以读取音频文件持续时间，并填补到星标之后；这可以使小节的时长和音频时长同步。
       */
      if (this.file === "") {
        return `{*${this.text}}`;
      } else {
        return `{'${this.file}';*}`;
      }
    }
    let fileOrObj = this.file !== "" ? `'${this.file}'` : (this.obj !== "" ? this.obj : "NA");

    let time = "";
    if (this.second >= 0) {
      time = `;*${this.second.toFixed(3)}`;
    } else if (this.frame >= 0) {
      time = `;${this.frame.toFixed(0)}`;
    } else {
      time = "";
    }

    return `{${fileOrObj}${time}}`;
  }
}
