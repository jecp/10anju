'use strict';

angular.module('core').service('Home', ['$http',
	function ($http){
		return {
			Summary: function() {
				var url = '/core/summary';
				var returnResults = function (data,headers){
					return data;
				};
				var request = $http.get(url);
				request.success(function (data){
					return data;
				});
				request.error(function (data){
					console.log('error');
				});
				return request;
			}
		};
	}
]);
