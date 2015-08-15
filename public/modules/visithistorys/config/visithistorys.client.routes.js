'use strict';

//Setting up route
angular.module('visithistorys').config(['$stateProvider',
	function($stateProvider) {
		// Visithistorys state routing
		$stateProvider.
		state('listVisithistorys', {
			url: '/visithistorys',
			templateUrl: 'modules/visithistorys/views/list-visithistorys.client.view.html'
		}).
		state('createVisithistory', {
			url: '/visithistorys/create',
			templateUrl: 'modules/visithistorys/views/create-visithistory.client.view.html'
		}).
		state('viewVisithistory', {
			url: '/visithistorys/:visithistoryId',
			templateUrl: 'modules/visithistorys/views/view-visithistory.client.view.html'
		}).
		state('editVisithistory', {
			url: '/visithistorys/:visithistoryId/edit',
			templateUrl: 'modules/visithistorys/views/edit-visithistory.client.view.html'
		}).
		state('adminListVisithistorys', {
			url: '/visithistorys/admin/list',
			templateUrl: 'modules/visithistorys/views/admin-list-visithistorys.client.view.html'
		});
	}
]);
