'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$http', '$location', 'Authentication', 'Menus', 
	function($scope, $http, $location, Authentication, Menus) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});

		// Home.doRequest(){
		// 	console.log(333);
		// };

		// Weather Api from web
		$scope.TodayWeather = function(city){
			$scope.weather = $http.get('http://m.weather.com.cn/atad/101280601.html').success(function (response){
				console.log(response);
				$scope.weather = response;
			}).error(function (response){
				$scope.error = response;
			});
		};
	}
]);
