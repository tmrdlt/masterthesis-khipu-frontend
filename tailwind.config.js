const colors  = require('tailwindcss/colors')
module.exports = {
    mode: 'jit',
    purge: [
        './pages/**/*.tsx',
        './components/**/*.tsx',
        './utils/*.ts'
        /**
         * if you decided to add more tsx files outsides this 2 folders,
         * don't forget to list it here,
         * or else those styles won't be produced in the production
         */
    ],
    darkMode: false, // or 'media' or 'class'
    theme: {
        container: {
            center: true, // https://tailwindcss.com/docs/container#centering-by-default
        },
        extend: {},
        colors: {...colors,
        hypeGray: '#EFF2F7'}
    },
    variants: {
        extend: {
            opacity: ['disabled'],
            cursor: ['disabled'],
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
    ],
}
