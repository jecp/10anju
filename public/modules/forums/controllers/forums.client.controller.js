'use strict';

// Forums controller
angular.module('forums').controller('ForumsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Forums',
	function($scope, $stateParams, $location, Authentication, Forums) {
		$scope.authentication = Authentication;

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

		// Find existing Forum
		$scope.findOne = function() {
			$scope.forum = Forums.get({ 
				forumId: $stateParams.forumId
			});
		};
	}
]);
