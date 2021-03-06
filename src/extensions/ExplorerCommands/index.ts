import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { _editor, window } from "../../services";
import { CommandKeys, IFinalTemplate, Key, StoreTemplateKeys } from "./types";

import nativeComponentsTemplates from "./NativeComponentsTemplates";
import webComponentsTemplates from "./WebDumbComponentTemplates";
import reduxStoreTemplates from "./ReduxStoreTemplates";
import containerComponentTemplates from "./ContainerComponentTemplates";

String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

String.prototype.uncapitalize = function() {
  return this.charAt(0).toLowerCase() + this.slice(1);
};

function filterPath(input: string, uncapitalize: boolean = true): string {
  if (uncapitalize) {
    return input
      .replace(/-/g, "_")
      .replace(/\W+/g, "")
      .uncapitalize();
  }
  return input.replace(/-/g, "_").replace(/\W+/g, "");
}

function createFile(source: string, fileName: string, content: string) {
  const editor = _editor.getEditor();
  if (editor) {
    const filePath = path.join(source, fileName);
    fs.writeFileSync(filePath, content, "utf8");
  }
}

function createNewDirectory(dir: string): boolean {
  if (fs.existsSync(dir)) return false;
  try {
    fs.mkdirSync(dir, { recursive: true });
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}

function handleTemplateCreation(
  source: string,
  folderName: string,
  templates: IFinalTemplate[]
) {
  const newSource = path.join(source, folderName);
  if (createNewDirectory(newSource)) {
    templates.forEach((template: IFinalTemplate) => {
      const { fileName, content } = template;
      window.show(`Creating file ${fileName}`);
      createFile(newSource, fileName, content);
    });
  } else {
    _editor.error(`Failed creating directory ${newSource}`);
  }
}

/**
 * Generates an array of Final Templates for a ReduxStore
 * @param folderName
 * @param template
 */
function generateReduxTemplate(
  folderName: string,
  template: any
): IFinalTemplate[] {
  const lowerCamelCase = folderName.uncapitalize(); //folderName.charAt(0).toLowerCase() + folderName.slice(1);
  const upperCamelCase = folderName.capitalize(); //folderName.charAt(0).toUpperCase() + folderName.slice(1);
  const keys: StoreTemplateKeys[] = [
    "actions",
    "operations",
    "selectors",
    "reducers",
    "types"
  ];
  const contentOfEachFile: IFinalTemplate[] = keys.map((key: Key) => {
    // const upperKey = key.charAt(0).toUpperCase() + key.slice(1);
    const upperKey = key.capitalize();
    return {
      fileName: `${lowerCamelCase}${upperKey}.ts`,
      content: template[key as string]({ lowerCamelCase, upperCamelCase })
    };
  });
  return contentOfEachFile;
}

function generateContainerTemplate(
  folderName: string,
  template: any
): IFinalTemplate[] {
  const lowerCamelCase =
    folderName.charAt(0).toLowerCase() + folderName.slice(1);
  const upperCamelCase =
    folderName.charAt(0).toUpperCase() + folderName.slice(1);
  const contentOfEachFile: IFinalTemplate[] = [
    {
      fileName: "index.ts",
      content: template.index({ lowerCamelCase, upperCamelCase })
    },
    {
      fileName: `${lowerCamelCase}.tsx`,
      content: template.container({ lowerCamelCase, upperCamelCase })
    },
    {
      fileName: `${lowerCamelCase}Types.ts`,
      content: template.types({ lowerCamelCase, upperCamelCase })
    }
  ];
  return contentOfEachFile;
}

/**
 * Generates an array of Final Templates for a Component
 * @param folderName
 * @param template
 */
function generateComponentTemplate(
  folderName: string,
  template: any
): IFinalTemplate[] {
  const lowerCamelCase =
    folderName.charAt(0).toLowerCase() + folderName.slice(1);
  const upperCamelCase =
    folderName.charAt(0).toUpperCase() + folderName.slice(1);
  const contentOfEachFile: IFinalTemplate[] = [
    {
      fileName: "index.tsx",
      content: template.index({ lowerCamelCase, upperCamelCase })
    },
    {
      fileName: `${lowerCamelCase}Styles.ts`,
      content: template.styles({ lowerCamelCase, upperCamelCase })
    },
    {
      fileName: `${lowerCamelCase}Types.ts`,
      content: template.types({ lowerCamelCase, upperCamelCase })
    }
  ];
  return contentOfEachFile;
}

async function command(context: vscode.ExtensionContext, dirPath: vscode.Uri) {
  const optionsKeys: CommandKeys[] = [
    "Native Component",
    "Web Component",
    "Container",
    "Redux-Store Directory"
  ];
  const options: string[] = [
    ...optionsKeys.map(option => `Create Awesome ${option}`),
    "Cancel"
  ];
  const selectedDirectory = dirPath.fsPath;
  const selected = (await _editor.dropdown(options)) as CommandKeys;
  const selectedKey = selected.replace(
    /^Create Awesome (.+)/,
    "$1"
  ) as CommandKeys;
  // window.show(vscode.Uri.file);
  switch (selectedKey) {
    case "Native Component": {
      window.show(`Running: ${selected}`);
      const dirName = await _editor.getInput("Name your Awesome Component");
      if (dirName && dirName.length > 0) {
        const cfn = filterPath(dirName);
        const templates: IFinalTemplate[] = generateComponentTemplate(
          cfn,
          nativeComponentsTemplates
        );
        handleTemplateCreation(selectedDirectory, cfn, templates);
      } else {
        window.show(`Awesomefication Cancelled`);
      }
      break;
    }
    case "Web Component": {
      window.show(`Running ${selected}`);
      const dirName = await _editor.getInput("Name your Awesome Component");
      if (dirName && dirName.length > 0) {
        const cfn = filterPath(dirName);
        const templates: IFinalTemplate[] = generateComponentTemplate(
          cfn,
          webComponentsTemplates
        );
        handleTemplateCreation(selectedDirectory, cfn, templates);
      } else {
        window.show(`Awesomefication Cancelled`);
      }
      break;
    }
    case "Container": {
      window.show(`Running ${selected}`);
      const dirName = await _editor.getInput("Name your Awesome Container");
      if (dirName && dirName.length > 0) {
        const cfn = filterPath(dirName);
        const templates: IFinalTemplate[] = generateContainerTemplate(
          cfn.replace(/Container$/, "") + "Container",
          containerComponentTemplates
        );
        handleTemplateCreation(selectedDirectory, cfn, templates);
      } else {
        window.show(`Awesomefication Cancelled`);
      }
      break;
    }
    case "Redux-Store Directory": {
      window.show(`Running ${selected}`);
      const dirName = await _editor.getInput("Name your Awesome Store");
      if (dirName && dirName.length > 0) {
        const cfn = filterPath(dirName);
        const templates: IFinalTemplate[] = generateReduxTemplate(
          cfn,
          reduxStoreTemplates
        );
        const chdir = path.join(selectedDirectory, cfn);
        createNewDirectory(chdir);
        handleTemplateCreation(chdir, "store", templates);
      } else {
        window.show(`Awesomefication Cancelled`);
      }
      break;
    }
    case "Cancel": {
      window.show(`Awesomefication Cancelled`);
      break;
    }
    default: {
      if (selected === undefined) {
        window.show(`Awesomefication Cancelled`);
      } else {
        _editor.error(`Invalid Option ${selected}.\nAwesomefication Cancelled`);
      }
    }
  }
}

function deactivate() {}

const exp: IExtension = {
  name: "extension.awesomifyExplorer",
  command: command,
  deactivate
};

export default exp;
