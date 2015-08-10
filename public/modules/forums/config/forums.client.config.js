'use strict';

// Configuring the Articles module
angular.module('forums').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', '业主论坛', 'forums', 'dropdown', '/forums(/create)?');
		Menus.addSubMenuItem('topbar', 'forums', '论坛首页', 'forums');
		Menus.addSubMenuItem('topbar', 'forums', '新的主题', 'subjects/create');
	}
]);
