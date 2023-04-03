const prettier = {
  singleQuote: true,
  semi: true,
  trailingComma: 'es5',
  arrowParens: 'avoid',
  printWidth: 140,
  tabWidth: 2,
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      options: {
        trailingComma: 'all',
        parser: 'typescript',
      },
    },
  ],
};

module.exports = prettier;
