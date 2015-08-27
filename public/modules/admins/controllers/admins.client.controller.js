'use strict';

// Admins controller
angular.module('admins').controller('AdminsController', ['$scope', '$http', '$stateParams', '$location', 'Authentication', 'Admins',
	function($scope, $http, $stateParams, $location, Authentication, Admins) {
		$scope.authentication = Authentication;
		if($location.path().search('admin') && !Authentication && $scope.authentication.user.roles.length < 2){
			$location.path('/');
		}

		// Create new Admin
		$scope.create = function() {
			// Create new Admin object
			var admin = new Admins ({
				name: this.name
			});

			// Redirect after save
			admin.$save(function(response) {
				$location.path('admins/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Admin Login
		$scope.login = function() {
			$scope.admin = Admins.query({
				method: 'POST',
				params:{adminName: this.username,adminPwd: this.password},
				isArray:true				
			});
			console.log($scope.admin);
		};

		// Remove existing Admin
		$scope.remove = function(admin) {
			if ( admin ) { 
				admin.$remove();

				for (var i in $scope.admins) {
					if ($scope.admins [i] === admin) {
						$scope.admins.splice(i, 1);
					}
				}
			} else {
				$scope.admin.$remove(function() {
					$location.path('admins');
				});
			}
		};

		// Update existing Admin
		$scope.update = function() {
			var admin = $scope.admin;

			admin.$update(function() {
				$location.path('admins/' + admin._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Admins
		$scope.find = function() {
			$scope.admins = Admins.query();
		};

		// Admin list of Admins
		$scope.list = function() {
			$http.get('/admins/admin/list').success(function (response){
				$scope.admins = response;
			}).error(function(response){
				$scope.error = response.message;
			});
		};

		// Find existing Admin
		$scope.findOne = function() {
			$scope.admin = Admins.get({ 
				adminId: $stateParams.adminId
			});
		};
	}
]);
