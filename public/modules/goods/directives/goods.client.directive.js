'use strict';

angular.module('goods').directive('goods', [
	function() {
		return {
			template: '<div></div>',
			restrict: 'E',
			link: function postLink(scope, element, attrs) {
				// Goods directive logic
				// ...
				// element.bind('like', function() {
				// 	Goods.like({'like'});
				// })

				// element.text('this is the goods directive');
			}
		};
	}
]);
