/***************************************************
	Significance Labs
	Brooklyn, NYC

 	Author: Alexandra Berke (aberke)
 	Written: June 2014


 	AngularJS error directive

****************************************************/

var error = function($rootScope) {
	console.log('error directive')

	return {
		restrict: 'E',
		templateUrl: '/static/directives/error.html',
		link: function(scope, element, attrs) {

			scope.error = null;


			$rootScope.$on('$routeChangeStart', function(next, current) {
				scope.error = null;
			});
			$rootScope.$on('error', function(name, error) {
				console.log('on error')
				scope.error = error;
			})
		}
	}
}