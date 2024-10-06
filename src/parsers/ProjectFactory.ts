import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { RawProject } from './RawProject';
import { Project } from './Project';
import { ScriptParser } from './ScriptParser';

export class ProjectFactory {
  static tempFolderName = 'temp';
  static backupFolderName = 'backup';

  /**
   * 加载原始项目
   * @returns
   */
  static loadRawProject(): RawProject | null {
    const projectPath = ProjectFactory.getProjectFilePath();
    if (!projectPath) {return null;}
    return JSON.parse(fs.readFileSync(projectPath, { encoding: 'utf8' }));
  }

  static getProjectFilePath(): string | null {
    // 获取当前工作区根目录
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders || workspaceFolders.length === 0) {
      vscode.window.showErrorMessage('请在回声工坊2项目文件夹中打开vscode');
      return null;
    }

    const rootPath = workspaceFolders[0].uri.fsPath;

    // 查找 .rgpj 文件
    const files = fs.readdirSync(rootPath);
    const projectFiles = files.filter(file => path.extname(file) === ".rgpj");
    if (!projectFiles || projectFiles.length === 0) {
      vscode.window.showErrorMessage('当前文件夹中不存在回声工坊2项目文件(*.rgpj)');
      return null;
    }
    return path.join(rootPath, projectFiles[0]);
  }

  /**
   * 加载当前工作区中的项目
   */
  static loadCurProject(): Project | null {
    const project = new Project();
    project.rawProject = ProjectFactory.loadRawProject();
    if (project.rawProject !== null) {
      project.scripts = ScriptParser.parseScripts(project.rawProject);
      
      //TODO:待解析项目配置、媒体定义和角色表
      project.config = project.rawProject.config;
      project.media = project.rawProject.mediadef;
      project.characters = project.rawProject.chartab;
      
      return project;
    } else {
      return null;
    }
  }

  static saveProject(project:Project,savePath:string) {
    fs.writeFile(savePath, JSON.stringify(project.toRaw(), null, 4), 'utf-8',
      (err) => {
        if (err) {
          vscode.window.showErrorMessage('保存失败！', err.message);
        } else {
          vscode.window.showInformationMessage('保存成功！');
        }
      }
    );
  }

  static saveWithBackup(project: Project, backupFullPath: string) {
    

    //先将原有的文件复制到备份文件夹
    const projectPath = ProjectFactory.getProjectFilePath();
    

    if (!projectPath) {
      vscode.window.showErrorMessage('因找不到路径而保存失败');
      return;
    }
    fs.copyFile(projectPath,backupFullPath,
      (err) => {
        if (err) {
          vscode.window.showErrorMessage('保存失败！', err.message);
          return;
        }
        //再覆写原有的文件
        ProjectFactory.saveProject(project, projectPath);
      });
  }
}
