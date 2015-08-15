'use strict';

//Setting up route
angular.module('collects').config(['$stateProvider',
	function($stateProvider) {
		// Collects state routing
		$stateProvider.
		state('listCollects', {
			url: '/collects',
			templateUrl: 'modules/collects/views/list-collects.client.view.html'
		}).
		state('createCollect', {
			url: '/collects/create',
			templateUrl: 'modules/collects/views/create-collect.client.view.html'
		}).
		state('viewCollect', {
			url: '/collects/:collectId',
			templateUrl: 'modules/collects/views/view-collect.client.view.html'
		}).
		state('editCollect', {
			url: '/collects/:collectId/edit',
			templateUrl: 'modules/collects/views/edit-collect.client.view.html'
		}).
		state('adminListCollects', {
			url: '/collects/admin/list',
			templateUrl: 'modules/collects/views/admin-list-collects.client.view.html'
		});
	}
]);
