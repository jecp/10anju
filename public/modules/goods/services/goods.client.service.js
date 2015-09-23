'use strict';

//Goods service used to communicate Goods REST endpoints
angular.module('goods').factory('Goods', ['$resource',
 	function($resource) {
		return $resource('goods/:goodId', { goodId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});	
	}
]);
