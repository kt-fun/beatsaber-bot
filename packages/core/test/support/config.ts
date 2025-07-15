import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { configSchema } from "@/config";

function isObject(item: any): item is Record<string, any> {
  return item && typeof item === 'object' && !Array.isArray(item);
}

function deepMerge<T>(...objects: T[]): T {
  const result: any = {};
  for (const obj of objects) {
    if (!isObject(obj)) continue;
    for (const key of Object.keys(obj)) {
      const val = obj[key];
      if (isObject(val) && isObject(result[key])) {
        result[key] = deepMerge(result[key], val);
      } else {
        result[key] = val;
      }
    }
  }
  return result;
}

const DEFAULT_CONFIG_BASENAME = 'config';


function loadFile(filePath: string) {
  if (!fs.existsSync(filePath)) return {};
  const ext = path.extname(filePath).toLowerCase();
  const content = fs.readFileSync(filePath, 'utf-8');
  if (ext === '.json') return JSON.parse(content);
  if (ext === '.yaml' || ext === '.yml') return yaml.load(content) as object;
  return {};
}

const DEFAULT_CONFIG_PATH = path.resolve(process.cwd(), 'config.json');

export function loadConfigFromFile(customPath?: string) {
  const env = process.env.NODE_ENV || 'development';
  let fileConfig = {};
  let defaultConfig = {};
  for (const ext of ['json', 'yaml', 'yml']) {
    const file = path.resolve(process.cwd(), `${DEFAULT_CONFIG_BASENAME}.${ext}`);
    Object.assign(defaultConfig, loadFile(file));
  }
  let envConfig = {};
  for (const ext of ['json', 'yaml', 'yml']) {
    const file = path.resolve(process.cwd(), `${DEFAULT_CONFIG_BASENAME}.${env}.${ext}`);
    Object.assign(envConfig, loadFile(file));
  }
  if (fs.existsSync(DEFAULT_CONFIG_PATH)) {
    defaultConfig = JSON.parse(fs.readFileSync(DEFAULT_CONFIG_PATH, 'utf-8'));
  }

  if (customPath && fs.existsSync(customPath)) {
    fileConfig = JSON.parse(fs.readFileSync(customPath, 'utf-8'));
  }

  const res = deepMerge(defaultConfig, fileConfig, envConfig);
  const {data, success} = configSchema.safeParse(res)
  if (!success) {
    return null;
  }
  return data;
}
