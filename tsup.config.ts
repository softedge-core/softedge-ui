// tsup.config.ts
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/components/FormWizard/index.ts',
    'src/components/Form/index.ts',
    'src/components/Form/types.ts',
  ],
  format: ['esm'],
  dts: true,
  outDir: 'dist',
  clean: true,
});