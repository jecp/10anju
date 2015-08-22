'use strict';

//Setting up route
angular.module('forums').config(['$stateProvider',
	function($stateProvider) {
		// Forums state routing
		$stateProvider.
		state('listForums', {
			url: '/forums',
			templateUrl: 'modules/forums/views/index-forum.client.view.html'
		}).
		state('createForum', {
			url: '/forums/create',
			templateUrl: 'modules/forums/views/create-forum.client.view.html'
		}).
		state('viewForum', {
			url: '/forums/:forumId',
			templateUrl: 'modules/forums/views/view-forum.client.view.html'
		}).
		state('adminListForums', {
			url: '/forums/admin/list',
			templateUrl: 'modules/forums/views/admin-list-forums.client.view.html'
		});
	}
]);
