'use strict';

// Subjects controller
angular.module('subjects').controller('SubjectsController', ['$scope', '$http', '$stateParams', '$location', 'Authentication', 'Subjects',
	function($scope, $http, $stateParams, $location, Authentication, Subjects) {
		$scope.authentication = Authentication;

		// Create new Subject
		$scope.create = function() {
			// Create new Subject object
			var subject = new Subjects ({
				name: this.name,
				f: $('.forum').html(),
				title: this.title,
				subcat: this.subcat,
				content: this.content
			});

			// Redirect after save
			subject.$save(function(response) {
				$location.path('subjects/' + response._id);

				// Clear form fields
				$scope.name = '';
				$scope.title = '';
				$scope.subcat = '';
				$scope.content = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Subject
		$scope.remove = function(subject) {
			if ( subject ) { 
				subject.$remove();

				for (var i in $scope.subjects) {
					if ($scope.subjects [i] === subject) {
						$scope.subjects.splice(i, 1);
					}
				}
			} else {
				$scope.subject.$remove(function() {
					$location.path('subjects');
				});
			}
		};

		// Update existing Subject
		$scope.update = function() {
			var subject = $scope.subject;

			subject.$update(function (response) {
				$scope.subject = response;
				$location.path('subjects');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Subjects
		$scope.find = function() {
			$scope.subjects = Subjects.query();
		};

		// Admin list of Subjects
		$scope.list = function() {
			$http.get('/subjects/admin/list').success(function (response){
				$scope.subjects = response;
			}).error(function(response){
				$scope.error = response.message;
			});
		};

		// Count of Subjects
		$scope.Count = function() {
			$http.get('/subjects/count').success(function (response){
				$scope.subjectsCount = response;
			}).error(function(response){
				$scope.error = response.message;
			});
		};

		// User count of Subjects
		$scope.userCount = function() {
			$http.get('/subjects/userCount').success(function (response){
				$scope.userSubjectsCount = response;
			}).error(function(response){
				$scope.error = response.message;
			});
		};

		// Update Subject From admin list
		$scope.modify = function() {
			$http.post('/subjects/admin/list', this.subject).success(function (response){
				$scope.success = true;
			}).error(function(response){
				$scope.error = response.message;
			});
		};

		// Find existing Subject
		$scope.findOne = function() {
			$scope.subject = Subjects.get({ 
				subjectId: $stateParams.subjectId
			});
			$scope.userObj = Authentication;
		};

		// like
		$scope.like = function (subject) {
			var _subject = $scope.subject;
			$http.post('/subjects_like', _subject).success(function (response){
				$scope.like += 1;
				$scope.success = true;
				$location.path('subjects');
			}).error(function(response){
				$scope.error = response.message;
			});
		};

		// Collect
		$scope.collect = function (subject) {
			var _subject = $scope.subject;

			$http.post('/subjects_collect', _subject).success(function (response){
				$scope.collect += 1;
				$scope.success = true;
				$location.path('subjects/' + _subject._id);
			}).error(function(response){
				$scope.error = response.message;
			});
		};
	}
]);
