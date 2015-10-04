'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$location', 'Authentication', 'Menus', 
	function($scope, $location, Authentication, Menus) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');
		
		console.log('如果你有胸怀有热忱有激情，加入我们吧，小伙伴们携手创辉煌〜');
		
		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});		
	}
]);
