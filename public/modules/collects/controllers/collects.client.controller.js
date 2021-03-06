'use strict';

// Collects controller
angular.module('collects').controller('CollectsController', ['$scope', '$http', '$stateParams', '$location', 'Authentication', 'Collects',
	function($scope, $http, $stateParams, $location, Authentication, Collects) {
		$scope.authentication = Authentication;
		
		if($location.path().search('admin') > 0){
			if (!$scope.authentication.user) {
				$location.path('/');
			}
			else if($scope.authentication.user.roles.length < 2){
				$location.path('/');
			}
		}

		// Create new Collect
		$scope.create = function() {
			// Create new Collect object
			var obj = $location.url().split('/')[1];
			var value = $location.url().split('/')[2];
			var collect = new Collects ({
				obj:obj,
				value:value
			});

			// Redirect after save
			collect.$save(function(response) {
				$location.path(obj);
				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Collect
		$scope.remove = function(collect) {
			if ( collect ) { 
				collect.$remove();

				for (var i in $scope.collects) {
					if ($scope.collects [i] === collect) {
						$scope.collects.splice(i, 1);
					}
				}
			} else {
				$scope.collect.$remove(function() {
					$location.path('collects');
				});
			}
		};

		// Update existing Collect
		$scope.update = function() {
			var collect = $scope.collect;

			collect.$update(function() {
				$location.path('collects/' + collect._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Collects
		$scope.find = function() {
			$scope.collects = Collects.query();
		};

		// Admin list of Collects
		$scope.list = function() {
			$http.get('/collects/admin/list').success(function (response){
				$scope.collects = response;
			}).error(function(response){
				$scope.error = response.message;
			});
		};

		// Find User Collect
		$scope.myCollect = function() {
			var _collectId = $scope.user.collect;
			$http.post('/mycollect',{collect:_collectId}).success(function (response){
				$scope.success = true;
				$scope.collect = response;
			}).error(function (response){
				$scope.error = response.message;
			});
		};

		// Find existing Collect
		$scope.findOne = function() {
			$scope.collect = Collects.get({ 
				collectId: $stateParams.collectId
			});
		};
	}
]);
