import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';

const config = [
  ...nextCoreWebVitals,
  { ignores: ['.next/**', '.next-*/**', 'node_modules/**', 'assets-src/**', 'public/**', 'test-results/**', 'playwright-report/**'] },
];

export default config;
