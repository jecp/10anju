'use strict';

// Configuring the Articles module
angular.module('goods').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', '商品', 'goods', 'dropdown', '/goods(/create)?');
		Menus.addSubMenuItem('topbar', 'goods', '商品列表', 'goods');
		Menus.addSubMenuItem('topbar', 'goods', '新建商品', 'goods/create');
	}
]);