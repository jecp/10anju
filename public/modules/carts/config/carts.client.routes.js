'use strict';

//Setting up route
angular.module('carts').config(['$stateProvider',
	function($stateProvider) {
		// Carts state routing
		$stateProvider.
		state('listCarts', {
			url: '/carts',
			templateUrl: 'modules/carts/views/list-carts.client.view.html'
		}).
		state('createCart', {
			url: '/carts/create',
			templateUrl: 'modules/carts/views/create-cart.client.view.html'
		}).
		state('viewCart', {
			url: '/carts/:cartId',
			templateUrl: 'modules/carts/views/view-cart.client.view.html'
		}).
		state('myCart', {
			url: '/my/cart',
			templateUrl: 'modules/carts/views/my-cart.client.view.html'
		}).
		state('adminListCarts', {
			url: '/carts/admin/list',
			templateUrl: 'modules/carts/views/admin-list-carts.client.view.html'
		});
	}
]);
