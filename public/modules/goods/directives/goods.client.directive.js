'use strict';

angular.module('goods').directive('whenScrolled', 
	function() {
		return function(scope, elm, attr){
			$(window).scroll(function(){
				var scrollTop = $(this).scrollTop();
				var scrollHeight = $(document).height();
				var windowHeight = $(this).height();

				if(scrollTop + windowHeight === scrollHeight){
					scope.$apply(attr.whenScrolled);
				}
			});
		};
	}
);
