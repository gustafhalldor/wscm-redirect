module.exports = {
    "extends": "airbnb",
    "plugins": [
      "import",
      "react"
    ],
    "parser": "babel-eslint",
    "env": {
      "es6": true
    },
    "rules": {
      "linebreak-style": 0,
      "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
      "arrow-body-style": ["error", "always"]
    }
};
