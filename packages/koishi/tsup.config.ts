import { defineConfig, Options } from 'tsup'

export default defineConfig((options) => {
  const commonOptions: Partial<Options> = {
    entry: [
      'src/**/*.[jt]s',
      'src/**/*.[jt]sx',
      '!./src/**/*.d.ts',
      '!./src/**/*.test.[jt]s',
      '!./src/**/*.spec.[jt]s',
      '!./src/**/*.mock.[jt]s',
      '!./src/**/*.test.[jt]sx',
      '!./src/**/*.spec.[jt]sx',
      '!./src/**/*.mock.[jt]sx'
    ],
    platform: 'node',
    target: 'es6',
    splitting: false,
    bundle: false, // Keep this false to avoid inlining
    sourcemap: true,
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
