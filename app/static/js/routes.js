/***************************************************
	Significance Labs
	Brooklyn, NYC

 	Author: Alexandra Berke (aberke)
 	Written: June 2014


 	AngularJS app

****************************************************/


App.config(function($routeProvider) {

	$routeProvider
		.when('/', {
			templateUrl: '/static/html/partials/index.html',
			controller: IndexCntl,
		})
		.when('/login', {
			templateUrl: '/static/html/partials/login.html',
			controller: LoginCntl,
		})
		.when('/:keeperName', {
			templateUrl: '/html/partials/keeperPage.html',
			controller: KeeperCntl,
			resolve: {
				keeper: function(APIservice, $route) {
						return APIservice.GET($route.current.params.keeperName)
							.then(function(data) { return data; });
					},
				},
		})
		.otherwise({
			redirectTo: '/'
		});
});