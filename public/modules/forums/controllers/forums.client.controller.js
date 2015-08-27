'use strict';

// Forums controller
angular.module('forums').controller('ForumsController', ['$scope', '$http', '$stateParams', '$location', 'Authentication', 'Forums',
	function($scope, $http, $stateParams, $location, Authentication, Forums) {
		$scope.authentication = Authentication;
		if($location.path().search('admin') && !Authentication && $scope.authentication.user.roles.length < 2){
			$location.path('forums');
		}

		// Create new Forum
		$scope.create = function() {
			// Create new Forum object
			var forum = new Forums ({
				name: this.name,
				title: this.title,
				subcat: this.subcat,
				content: this.content
			});

			// Redirect after save
			forum.$save(function(response) {
				$location.path('forums/' + response._id);

				// Clear form fields
				$scope.name = '';
				$scope.subcat = '';
				$scope.content = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Forum
		$scope.remove = function(forum) {
			if ( forum ) { 
				forum.$remove();

				for (var i in $scope.forums) {
					if ($scope.forums [i] === forum) {
						$scope.forums.splice(i, 1);
					}
				}
			} else {
				$scope.forum.$remove(function() {
					$location.path('forums');
				});
			}
		};

		// Update existing Forum
		$scope.update = function() {
			var forum = $scope.forum;

			forum.$update(function() {
				$location.path('forums/' + forum._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Forums
		$scope.find = function() {
			$scope.forums = Forums.query();
		};

		// Admin list of Forums
		$scope.list = function() {
			$http.get('/forums/admin/list').success(function (response){
				$scope.forums = response;
			}).error(function(response){
				$scope.error = response.message;
			});
		};
		
		// Update Forum From admin list
		$scope.modify = function() {
			$http.post('/forums/admin/list', this.forum).success(function (response){
				$scope.success = true;
			}).error(function(response){
				$scope.error = response.message;
			});
		};

		// Find existing Forum
		$scope.findOne = function() {
			$scope.forum = Forums.get({ 
				forumId: $stateParams.forumId
			});
		};
	}
]);
