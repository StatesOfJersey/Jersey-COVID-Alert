const alias = require('./aliases.config.js');

module.exports = api => {
  api.cache(false);
  return {
    presets: ['module:metro-react-native-babel-preset'],
    env: {
      production: {
        plugins: ['transform-remove-console']
      }
    },
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          alias
        }
      ],
      [
        'module:react-native-dotenv',
        {
          moduleName: '@env',
          path: '.env',
          safe: false,
          allowUndefined: false
        }
      ]
    ]
  };
};
