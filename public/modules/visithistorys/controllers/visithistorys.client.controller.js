'use strict';

// Visithistorys controller
angular.module('visithistorys').controller('VisithistorysController', ['$scope', '$http', '$stateParams', '$location', 'Authentication', 'Visithistorys',
	function($scope, $http, $stateParams, $location, Authentication, Visithistorys) {
		$scope.authentication = Authentication;
		
		if($location.path().search('admin')){
			if (!$scope.authentication.user) {
				$location.path('/');
			}
			else if($scope.authentication.user.roles.length < 2){
				$location.path('/');
			}
		}

		// Create new Visithistory
		$scope.create = function() {
			// Create new Visithistory object
			var visithistory = new Visithistorys ({
				name: this.name
			});

			// Redirect after save
			visithistory.$save(function(response) {
				$location.path('visithistorys/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Visithistory
		$scope.remove = function(visithistory) {
			if ( visithistory ) { 
				visithistory.$remove();

				for (var i in $scope.visithistorys) {
					if ($scope.visithistorys [i] === visithistory) {
						$scope.visithistorys.splice(i, 1);
					}
				}
			} else {
				$scope.visithistory.$remove(function() {
					$location.path('visithistorys');
				});
			}
		};

		// Update existing Visithistory
		$scope.update = function() {
			var visithistory = $scope.visithistory;

			visithistory.$update(function() {
				$location.path('visithistorys/' + visithistory._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Visithistorys
		$scope.find = function() {
			$scope.visithistorys = Visithistorys.query();
		};

		// Admin list of Visithistorys
		$scope.list = function(req,res) {
			$http.get('/visithistorys/admin/list').success(function (response){
				$scope.visithistorys = response;
				// $scope.page = parseInt(response.length/5);
			}).error(function(response){
				$scope.error = response.message;
			});
		};

		// Count of Visithistorys
		$scope.Count = function() {
			$http.get('/visithistorys/count').success(function (response){
				$scope.visithistorysCount = response;
			}).error(function(response){
				$scope.error = response.message;
			});
		};
		
		// Update Visithistory From admin list
		$scope.modify = function() {
			$http.post('/visithistorys/admin/list', this.visithistory).success(function (response){
				$scope.success = true;
			}).error(function(response){
				$scope.error = response.message;
			});
		};

		// Find existing Visithistory
		$scope.findOne = function() {
			$scope.visithistory = Visithistorys.get({ 
				visithistoryId: $stateParams.visithistoryId
			});
		};
	}
]);
