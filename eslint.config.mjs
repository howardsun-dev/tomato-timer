import react from 'eslint-plugin-react'
import tseslint from '@electron-toolkit/eslint-config-ts'
import prettier from '@electron-toolkit/eslint-config-prettier'

export default [
  {
    ignores: ['node_modules/**', 'dist/**', 'out/**', '.gitignore']
  },
  ...tseslint.configs.recommended,
  react.configs.flat.recommended,
  react.configs.flat['jsx-runtime'],
  {
    settings: {
      react: {
        version: 'detect'
      }
    }
  },
  prettier
]
