import * as vscode from 'vscode';
import * as fs from 'fs';
import { LogNode,LogProvider } from './providers/LogProvider';

export function activate(context: vscode.ExtensionContext) {


  let logProvider = new LogProvider();
  vscode.window.createTreeView('log', {
    treeDataProvider: logProvider,
    showCollapseAll: true,
  });
  context.subscriptions.push(vscode.commands.registerCommand('rpl-gen-studio.refreshTreeView',
    () => {
      logProvider.refresh();
    })
  );

  //打开文档
  context.subscriptions.push(vscode.commands.registerCommand('rpl-gen-studio.openLogFile',
    (log:LogNode) => {
      log.show();
    })
  );

}

export function deactivate() { }
