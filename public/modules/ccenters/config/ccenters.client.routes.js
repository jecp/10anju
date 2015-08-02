'use strict';

//Setting up route
angular.module('ccenters').config(['$stateProvider',
	function($stateProvider) {
		// Ccenters state routing
		$stateProvider.
		state('listCcenters', {
			url: '/ccenters',
			templateUrl: 'modules/ccenters/views/list-ccenters.client.view.html'
		}).
		state('createCcenter', {
			url: '/ccenters/create',
			templateUrl: 'modules/ccenters/views/create-ccenter.client.view.html'
		}).
		state('viewCcenter', {
			url: '/ccenters/:ccenterId',
			templateUrl: 'modules/ccenters/views/view-ccenter.client.view.html'
		}).
		state('editCcenter', {
			url: '/ccenters/:ccenterId/edit',
			templateUrl: 'modules/ccenters/views/edit-ccenter.client.view.html'
		});
	}
]);