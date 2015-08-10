'use strict';

//Setting up route
angular.module('goods').config(['$stateProvider',
	function($stateProvider) {
		// Goods state routing
		$stateProvider.
		state('listGoods', {
			url: '/goods',
			templateUrl: 'modules/goods/views/list-index-goods.client.view.html'
		}).
		state('listSubcat',{
			url: '/goods/subcat/:subcat',
			templateUrl: 'modules/goods/views/list-subcats.client.view.html'
		}).
		state('createGood', {
			url: '/goods/create',
			templateUrl: 'modules/goods/views/create-good.client.view.html'
		}).
		state('viewGood', {
			url: '/goods/:goodId',
			templateUrl: 'modules/goods/views/view-good.client.view.html'
		}).
		state('editGood', {
			url: '/goods/:goodId/edit',
			templateUrl: 'modules/goods/views/edit-good.client.view.html'
		}).
		state('adminList',{
			url: '/goods/admin/list',
			templateUrl: 'modules/goods/views/admin-list-goods.client.view.html'
		});
	}
]);
