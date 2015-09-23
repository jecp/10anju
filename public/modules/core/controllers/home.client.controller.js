'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication','Home',
	function($scope, Authentication, Home) {
		// This provides Authentication context.
		$scope.authentication = Authentication;

		Home.Summary().success(function (data){
			$scope.data = data;
		});
	}
]);
