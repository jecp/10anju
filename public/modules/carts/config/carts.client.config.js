'use strict';

// Configuring the Articles module
angular.module('carts').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', '购物篮', 'carts', 'dropdown', '/carts(/create)?');
		Menus.addSubMenuItem('topbar', 'carts', '我的购物篮', 'carts');
		Menus.addSubMenuItem('topbar', 'carts', '新建菜篮子', 'carts/create');
	}
]);