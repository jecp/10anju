'use strict';

// Admins controller
angular.module('admins').controller('AdminsController', ['$scope', '$http', '$stateParams', '$location', 'Authentication', 'Admins',
	function($scope, $http, $stateParams, $location, Authentication, Admins) {
		$scope.authentication = Authentication;
		
		if($location.path().search('admin') > 0){
			if (!$scope.authentication.user) {
				$location.path('/');
			}
			else if($scope.authentication.user.roles.length < 2){
				$location.path('/');
			}
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
			$http.post('/admins_login', $scope.loginForm).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.admins = response;

				// And redirect to the index page
				$location.path('admins/cp');
			}).error(function(response) {
				$scope.error = response.message;
			});
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

		// Find existing Admin
		$scope.findGds = function() {
			$http.get('/gds').success(function (response){
				$scope.gdss = response;
			})
		};

		// Update existing Gds
		$scope.updateGds = function() {
			var gds = this.gds;
			$http.post('/gds',gds).success(function (response) {
				$scope.success = true;
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// delete Gds From admin list
		$scope.delGds = function() {
			var gdsId = this.gds._id;
			$http.delete('/gds?='+gdsId).success(function (response){
				//$location.path('gdss/'+response._id);
				for (var i in $scope.gdss) {
					if ($scope.gdss [i] === this.gds) {
						$scope.gdss.splice(i, 1);
					}
				}
				$scope.success = true;
			}).error(function(response){
				$scope.error = response.message;
			});
		};
	}
]);
