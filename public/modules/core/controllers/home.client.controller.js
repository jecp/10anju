'use strict';

angular.module('core').controller('HomeController', ['$scope', '$http', 'Authentication','Home',
	function($scope, $http, Authentication, Home) {
		// This provides Authentication context.
		$scope.authentication = Authentication;

		Home.Summary().success(function (data){
			$scope.data = data;
		});

		// Weather Api from web
		$scope.TodayWeather = function(){
		    $.ajax({
				url: 'http://op.juhe.cn/onebox/weather/query?cityname=%E6%B7%B1%E5%9C%B3&key=3904327f0cddc28bfeb75d115050d620',
				type: 'get',
				dataType: 'jsonp',
				crossDomain: true,
				success: function(data) {
					$scope.weather = data.result.data;
				}
		    });
		};
	}
]);
