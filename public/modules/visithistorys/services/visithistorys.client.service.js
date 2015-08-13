'use strict';

//Visithistorys service used to communicate Visithistorys REST endpoints
angular.module('visithistorys').factory('Visithistorys', ['$resource',
	function($resource) {
		return $resource('visithistorys/:visithistoryId', { visithistoryId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);