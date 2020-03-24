module.exports = {
    'env': {
        'browser': true,
        'es6': true,
        'jquery': true,
        'greasemonkey': true
    },
    'extends': 'eslint:recommended',
    'globals': {
        'Atomics': 'readonly',
        'SharedArrayBuffer': 'readonly',
        'ClipboardItem': 'readonly',
        'EnhancePluginStore_instance': 'readonly',
        'GM_addValueChangeListener': 'readonly'
    },
    'parserOptions': {
        'ecmaVersion': 2018,
        'sourceType': 'module'
    },
    'rules': {
        'indent': [
            'error',
            4
        ],
        'linebreak-style': 'off',
        'quotes': [
            'error',
            'single'
        ],
        'semi': [
            'error',
            'always'
        ]
    }
};