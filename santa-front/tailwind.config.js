/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./src/**/*.{js,jsx,ts,tsx}",
		'node_modules/flowbite-react/lib/esm/**/*.js',
	],
	theme: {
		extend: {
			colors: {
				dark: '#171922',
				light: '#E1E1E6',
				primary: '#ff7e7e',
				secondary: '#b5a3e4',
			}
		},
	},
	plugins: [
		require("daisyui"),
		require('flowbite/plugin')
	],
	daisyui: {
		themes: [
			"nord"
		]
	}
};

