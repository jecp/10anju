'use strict';

//Setting up route
angular.module('porders').config(['$stateProvider',
	function($stateProvider) {
		// Porders state routing
		$stateProvider.
		state('listPorders', {
			url: '/porders',
			templateUrl: 'modules/porders/views/list-porders.client.view.html'
		}).
		state('createPorder', {
			url: '/porders/create',
			templateUrl: 'modules/porders/views/create-porder.client.view.html'
		}).
		state('viewPorder', {
			url: '/porders/:porderId',
			templateUrl: 'modules/porders/views/view-porder.client.view.html'
		}).
		state('editPorder', {
			url: '/porders/:porderId/edit',
			templateUrl: 'modules/porders/views/edit-porder.client.view.html'
		}).
		state('adminListPorders', {
			url:'/porders/admin/list',
			templateUrl: 'modules/porders/views/admin-list-porders.client.view.html'
		});
	}
]);
