import { defineConfig, Options } from 'tsup'
import { globby } from 'globby'
import path from 'path'
import fs from 'fs'

const copyJsonAssets = async () => {
  const jsonFiles = await globby(['src/**/*.json'], { absolute: false });
  const outDirs = ['dist/cjs', 'dist/esm'];

  for (const file of jsonFiles) {
    for (const outDir of outDirs) {
      const destPath = path.join(outDir, file.substring('src/'.length));
      await fs.promises.mkdir(path.dirname(destPath), { recursive: true });
      await fs.promises.copyFile(file, destPath);
    }
  }
  console.log('JSON assets copied.');
};

export default defineConfig((options) => {
  const commonOptions: Partial<Options> = {
    entry: [
      'src/**/*.[jt]s',
      'src/**/*.[jt]sx',
      '!./src/**/*.d.ts',
      '!./src/**/*.test.[jt]s',
      '!./src/**/*.spec.[jt]s',
      '!./src/**/*.mock.[jt]s',
      '!./src/**/*.stories.[jt]s',
      '!./src/**/*.test.[jt]sx',
      '!./src/**/*.spec.[jt]sx',
      '!./src/**/*.mock.[jt]sx',
      '!./src/**/*.stories.[jt]sx',
    ],
    platform: 'node',
    target: 'es6',
    splitting: false,
    bundle: false, // Keep this false to avoid inlining
    sourcemap: false,
    clean: true,
    ...options,
  }

  return [
    // types
    {
      ...commonOptions,
      format: ['esm'],
      entry: ["src/index.ts"],
      outDir: './dist/types/',
      outExtension: (ctx) => {
        return { dts: '.d.ts' };
      },
      dts: {
        only: true,
      },
    },
    {
      ...commonOptions,
      format: ['esm'],
      outDir: './dist/esm/',
      outExtension: (ctx) => {
        return { js: '.js', dts: '.d.ts' };
      },
      dts: false,
      async onSuccess() {
        await copyJsonAssets();
      }
    },
    {
      ...commonOptions,
      format: ['cjs'],
      outDir: './dist/cjs/',
      outExtension: (ctx) => {
        return { js: '.cjs' };
      },
      dts: false,
    },
  ]
})
