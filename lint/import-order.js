const { ERROR } = require('./constants')
const assetFiles = '*.{svg,png,jpg,jpeg,webp,json}'
const styleFiles = '*.{css,sass,scss,less,styl}'

module.exports = {
  rules: {
    '@typescript-eslint/padding-line-between-statements': [
      ERROR,
      {
        blankLine: 'always',
        prev: '*',
        next: ['interface', 'type'],
      },
    ],
    'import/order': [
      ERROR,
      {
        alphabetize: {
          order: 'asc',
        },
        'newlines-between': 'always',
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'type'],
        pathGroups: [
          {
            pattern: assetFiles,
            patternOptions: {
              dot: true,
              nocomment: true,
              matchBase: true,
            },
            group: 'type',
            position: 'after',
          },
          {
            pattern: styleFiles,
            patternOptions: {
              dot: true,
              nocomment: true,
              matchBase: true,
            },
            group: 'type',
            position: 'after',
          },
        ],
        pathGroupsExcludedImportTypes: [assetFiles, styleFiles, 'react'],
        warnOnUnassignedImports: true,
      },
    ],
  },
}
