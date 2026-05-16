name 'pefcl'
author 'projecterror <info@projecterror.dev>'
version '1.0.0'
license 'MIT'
fx_version 'cerulean'
game 'gta5'
ui_page 'dist/web/index.html'
node_version '22'

files {
	'dist/web/index.html',
	'dist/web/assets/AccountCard.js',
	'dist/web/assets/Mobile.js',
	'dist/web/assets/Layout.js',
	'dist/web/assets/vendor_ui.js',
	'dist/web/assets/Transactions.js',
	'dist/web/assets/InvoiceItem.js',
	'dist/web/assets/TotalBalance.js',
	'dist/web/assets/AccountSelect.js',
	'dist/web/assets/MobileInvoicesView.js',
	'dist/web/assets/CardsView.js',
	'dist/web/assets/NewBalance.js',
	'dist/web/assets/Accounts.js',
	'dist/web/assets/index.js',
	'dist/web/assets/Deposit.js',
	'dist/web/assets/index.css',
	'dist/web/assets/AccountCards.js',
	'dist/web/assets/Withdraw.js',
	'dist/web/assets/vendor.js',
	'dist/web/assets/useMutation.js',
	'dist/web/assets/currency.js',
	'dist/web/assets/MobileDashboardView.js',
	'dist/web/assets/Invoices.js',
	'dist/web/assets/Errors.js',
	'dist/web/assets/BankCard.js',
	'dist/web/assets/Count.js',
	'dist/web/assets/TransactionItem.js',
	'dist/web/assets/Base.js',
	'dist/web/assets/Summary.js',
	'dist/web/assets/Dashboard.js',
	'dist/web/assets/Transfer.js',
	'dist/web/assets/Modal.js',
	'dist/web/assets/MobileTransferView.js',
	'dist/web/assets/MobileAccountsView.js',
	'dist/web/assets/ATM.js',
	'web/media/app.png',
	'web/media/appstore/tablet_4.png',
	'web/media/appstore/tablet_3.png',
	'web/media/appstore/tablet_2.png',
	'web/media/appstore/tablet_1.png',
	'web/media/appstore/phone_4.png',
	'web/media/appstore/phone_1.png',
	'web/media/appstore/phone_2.png',
	'web/media/appstore/phone_3.png',
	'config.json',
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
