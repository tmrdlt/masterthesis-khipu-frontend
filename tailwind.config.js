const colors  = require('tailwindcss/colors')
module.exports = {
    content: [
        './pages/**/*.tsx',
        './components/**/*.tsx',
        './utils/*.ts'
        /**
         * if you decided to add more tsx files outsides this 2 folders,
         * don't forget to list it here,
         * or else those styles won't be produced in the production
         */
    ],
    theme: {
        container: {
            center: true, // https://tailwindcss.com/docs/container#centering-by-default
        },
        extend: {},
        colors: { ...colors,
            'khipu-bg-1' : '#010408',
            'khipu-bg-2' : '#0e1116',
            'khipu-bg-3' : '#171b21',
            'khipu-border-1': '#21252b',
            'khipu-border-2': '#31363c',
            'khipu-text': '#cad1d8'
        }
    },
    plugins: [
        require('@tailwindcss/forms'),
    ],
}
