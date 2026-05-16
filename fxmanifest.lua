name 'pefcl'
author 'projecterror <info@projecterror.dev>'
version '1.0.0'
license 'MIT'
fx_version 'cerulean'
game 'gta5'
ui_page 'dist/web/index.html'
node_version '22'

files {
	'dist/web/assets/index.css',
	'dist/web/assets/index.js',
	'dist/web/assets/vendor.js',
	'dist/web/assets/vendor_ui.js',
	'dist/web/index.html',
	'web/media/app.png',
	'web/media/appstore/phone_1.png',
	'web/media/appstore/phone_2.png',
	'web/media/appstore/phone_3.png',
	'web/media/appstore/phone_4.png',
	'web/media/appstore/tablet_1.png',
	'web/media/appstore/tablet_2.png',
	'web/media/appstore/tablet_3.png',
	'web/media/appstore/tablet_4.png',
	'static/config.json',
}

dependencies {
	'/server:13068',
	'/onesync',
	'qbx_pefcl',
}

client_scripts {
	'dist/client.js',
	'interaction.lua',
}

server_scripts {
	'dist/server.js',
}
