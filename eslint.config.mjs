import { FlatCompat } from '@eslint/eslintrc';
import { globalIgnores } from 'eslint/config';

const compat = new FlatCompat({ baseDirectory: import.meta.dirname });

const config = [...compat.extends('next/core-web-vitals'), { rules: { '@next/next/no-img-element': 'off' } }, globalIgnores(['.next/**', '**/.next/**', '.next-dev/**', '**/.next-dev/**', 'node_modules/**'])];
export default config;
