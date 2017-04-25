module.exports = {
    "env": {
        "es6": true,
        "node": true
    },
    "extends": "standard",
    "parser": "babel-eslint",
    "parserOptions": {
        "sourceType": "module"
    },
    "rules": {
        // allow paren-less arrow functions
        "arrow-parens": 0,
        // allow async-await
        "generator-star-spacing": 0,
        // allow debugger during development
        "no-debugger": process.env.NODE_ENV === 'production' ? 2 : 0
    }
}
