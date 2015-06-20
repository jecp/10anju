'use strict';

// Configuring the Articles module
angular.module('articles').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', '文章', 'articles', 'dropdown', '/articles(/create)?');
		Menus.addSubMenuItem('topbar', 'articles', '文章列表', 'articles');
		Menus.addSubMenuItem('topbar', 'articles', '新建文章', 'articles/create');
	}
]);