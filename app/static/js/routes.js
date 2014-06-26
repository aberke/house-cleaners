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
		.when('/new', {
			templateUrl: '/static/html/partials/new.html',
			controller: NewCntl,
		})
		.when('/login', {
			templateUrl: '/static/html/partials/login.html',
		})
		.when('/profile', {
			templateUrl: '/static/html/partials/profile.html',
		})
		.when('/profile/:phonenumber', {
			templateUrl: '/static/html/partials/profile.html',
			controller: ProfileCntl,
			resolve: {
				cleaner: function(APIservice, $route) {
						return APIservice.GET("/cleaner/lookup/phonenumber/" + $route.current.params.phonenumber)
							.then(function(data) { 
								console.log('cleaner', data)
								return data; });
					},
				},
		})
		.otherwise({
			redirectTo: '/'
		});
});

