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
		})
		.when('/new', {
			templateUrl: '/static/html/partials/new.html',
			controller: NewCntl,
		})
		.when('/test', {
			templateUrl: '/static/html/partials/test.html',
			controller: NewCntl,
		})
		.when('/sign-in', {
			templateUrl: '/static/html/partials/sign-in.html',
			controller: LoginCntl,
		})
		.when('/reset-password', {
			templateUrl: '/static/html/partials/reset-password.html',
			controller: ResetPasswordCntl,
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
							.then(function(data) { return data; }
						);
					},
				},
		})
		.otherwise({
			redirectTo: '/'
		});
});

