# 回声工坊2扩展

这是文字视频（例如TRPG replay、视觉小说）制作软件「回声工坊」的辅助扩展，围绕整理剧本文件（跑团Log文件）提供了很多便利功能。

你可以在扩展商店搜索[“回声工坊扩展”](https://marketplace.visualstudio.com/items?itemName=yxChangingSelf.trpg-replay-generator-log)来获取适用于回声工坊1的扩展，目前本扩展还未完善，可以与其搭配使用。

目前核心的功能是读写回声工坊项目文件，以便使用回声工坊1的扩展。

# 使用方法

1. 使用vscode打开存在回声工坊项目文件（文件后缀名为.rgpj）的文件夹
2. 点开侧边栏上的回声工坊图标，这里列出了项目中所有的剧本文件
3. 点开剧本文件会自动生成临时的rgl文件（回声工坊1扩展可识别），在此处ctrl+s保存时可以保存到项目文件中

# 自动备份

在你保存文件的时候，本扩展会自动将当前项目文件备份到同目录的backup文件夹下，和回声工坊本体软件的自动备份功能保持一致，只不过为了保险起见，暂不删除旧的备份文件，后续视情况可能会做配置项用于配置备份文件超过多少自动删除。

