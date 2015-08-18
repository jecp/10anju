'use strict';

// Comments controller
angular.module('comments').controller('CommentsController', ['$scope', '$http', '$stateParams', '$location', 'Authentication', 'Comments',
	function($scope, $http, $stateParams, $location, Authentication, Comments) {
		$scope.authentication = Authentication;

		// Create new Comment
		$scope.create = function() {
			// Create new Comment object
			var comment = new Comments ({
				title: this.title,
				subject: this.subject._id,
				content: $(".editormd-preview-container").html()
			});

			// Redirect after save
			comment.$save(function(response) {
				$location.path('subjects'+response._id);

				// Clear form fields
				$scope.title = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Comment
		$scope.remove = function(comment) {
			if ( comment ) { 
				comment.$remove();

				for (var i in $scope.comments) {
					if ($scope.comments [i] === comment) {
						$scope.comments.splice(i, 1);
					}
				}
			} else {
				$scope.comment.$remove(function() {
					$location.path('comments');
				});
			}
		};

		// Update existing Comment
		$scope.update = function() {
			var comment = $scope.comment;

			comment.$update(function() {
				$location.path('comments/' + comment._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Comments
		$scope.find = function() {
			$scope.comments = Comments.query();
		};

		// User count of Comments
		$scope.userCount = function() {
			$http.get('/comments/userCount').success(function (response){
				$scope.userCommentsCount = response;
			}).error(function(response){
				$scope.error = response.message;
			});
		};

		// Admin list of Comments
		$scope.list = function() {
			$http.get('/comments/admin/list').success(function (response){
				$scope.comments = response;
			}).error(function(response){
				$scope.error = response.message;
			});
		};

		// Find existing Comment
		$scope.findOne = function() {
			$scope.comment = Comments.get({ 
				commentId: $stateParams.commentId
			});
		};
	}
]);
