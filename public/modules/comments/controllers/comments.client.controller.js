'use strict';

// Comments controller
angular.module('comments').controller('CommentsController', ['$scope', '$http', '$stateParams', '$location', 'Authentication', 'Comments',
	function($scope, $http, $stateParams, $location, Authentication, Comments) {
		$scope.authentication = Authentication;
		if($location.path().search('admin') && !Authentication && $scope.authentication.user.roles.length < 2){
			$location.path('/');
		}

		// Create new Comment
		$scope.create = function() {
			// Create new Comment object
			var obj = $location.url().split('/')[1];
			var value = $location.url().split('/')[2];

			var comment = new Comments ({
				title: this.title,
				obj: obj,
				value:value,
				content: this.content
			});

			// Redirect after save
			comment.$save(function(response) {
				$location.path(obj);
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

		// Find the comments from an article or subject
		$scope.findByObj = function() {
			var obj = $location.url().split('/')[1];
			var value = $location.url().split('/')[2];
			$scope.comments = Comments.query({
				obj:obj,
				value:value
			});
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

		// Count of Comments
		$scope.Count = function() {
			$http.get('/comments/count').success(function (response){
				$scope.commentsCount = response;
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
