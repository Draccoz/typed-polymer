import * as dynamicFunctions from "./hooks/dynamicFunctions";

export interface TemplateHook {
  pattern: string;
  callback: (match: string, p: string, i?: number) => string;
}

export var templateHooks: TemplateHook[] = [
  dynamicFunctions
];
