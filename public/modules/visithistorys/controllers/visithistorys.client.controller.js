'use strict';

// Visithistorys controller
angular.module('visithistorys').controller('VisithistorysController', ['$scope', '$stateParams', '$location', 'Authentication', 'Visithistorys',
	function($scope, $stateParams, $location, Authentication, Visithistorys) {
		$scope.authentication = Authentication;

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

		// Find existing Visithistory
		$scope.findOne = function() {
			$scope.visithistory = Visithistorys.get({ 
				visithistoryId: $stateParams.visithistoryId
			});
		};
	}
]);