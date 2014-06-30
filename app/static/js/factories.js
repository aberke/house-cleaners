/***************************************************
	Significance Labs
	Brooklyn, NYC

 	Author: Alexandra Berke (aberke)
 	Written: June 2014


 	AngularJS app

****************************************************/


// NOT USED
var UserFactory = function($http, $q, $rootScope, $location, APIservice) {
	console.log('UserFactory')
	/* consumers call 
						UserFactory.then(function(userData) {
							check userData isn't null
						})
	*/

	var deferred = $q.defer();
	$http({method: 'GET', url: '/auth/user'})
	.success(function(data) {
		if (!data.twitter_id) { data = null; }
		deferred.resolve(data);
	})
	.error(function(errData) {
		console.log('GET USER ERROR', errData);
		deferred.reject(errData);
	});

	return deferred.promise;
}