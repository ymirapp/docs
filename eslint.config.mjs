import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';

const eslintConfig = defineConfig([
  ...nextVitals,
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    '.source/**',
    // Legacy VuePress sources are kept on disk but are no longer part of the project.
    'docs/**',
    'images/**',
  ]),
]);

export default eslintConfig;
