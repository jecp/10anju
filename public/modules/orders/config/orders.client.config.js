'use strict';

// Configuring the Articles module
angular.module('orders').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', '订单', 'orders', 'dropdown', '/orders(/create)?');
		Menus.addSubMenuItem('topbar', 'orders', '订单列表', 'orders');
		Menus.addSubMenuItem('topbar', 'orders', '新建订单', 'orders/create');
	}
]);