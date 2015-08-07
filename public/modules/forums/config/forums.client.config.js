'use strict';

// Configuring the Articles module
angular.module('forums').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', '社区论坛', 'forums', 'dropdown', '/forums(/create)?');
		Menus.addSubMenuItem('topbar', 'forums', 'List Forums', 'forums');
		Menus.addSubMenuItem('topbar', 'forums', 'New Forum', 'forums/create');
	}
]);
