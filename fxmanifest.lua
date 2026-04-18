name 'pefcl'
author 'projecterror <info@projecterror.dev>'
version '1.0.0'
license 'MIT'
fx_version 'cerulean'
game 'gta5'
ui_page 'dist/web/index.html'
node_version '22'

files {
	'static/**/*',
	'locales/*.json',
	'locales/pl/default.json',
	'locales/sv/default.json',
	'locales/da/default.json',
	'locales/it/default.json',
	'locales/cs/default.json',
	'locales/pt/default.json',
	'locales/hr/default.json',
	'locales/pt-BR/default.json',
	'locales/hu/default.json',
	'locales/nl/default.json',
	'locales/bg/default.json',
	'locales/nb/default.json',
	'locales/de/default.json',
	'locales/fi/default.json',
	'locales/it-MT/default.json',
	'locales/index.ts',
	'locales/fr/default.json',
	'locales/es/default.json',
	'locales/en/default.json',
	'locales/lt/default.json',
	'locales/tr/default.json',
}

dependencies {
	'/server:13068',
	'/onesync',
}

client_scripts {
	'dist/client.js',
	'interaction.lua',
}

server_scripts {
	'dist/server.js',
}
