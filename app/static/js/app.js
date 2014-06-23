/***************************************************
	Significance Labs
	Brooklyn, NYC

 	Author: Alexandra Berke (aberke)
 	Written: June 2014


 	AngularJS app

****************************************************/




var App = angular.module('App', ['ngRoute'])

	.config(function($locationProvider) {

		$locationProvider.html5Mode(true);

	})

	.config(function($provide, $compileProvider, $filterProvider) {

		// register services
		$provide.service('APIservice', APIservice);
		$provide.service('AuthService', AuthService);

		// register directives
		// $compileProvider.directive('error', error);
		
		// register factories
		// $provide.factory('UserFactory', UserFactory);
	});