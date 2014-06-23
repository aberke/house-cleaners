/***************************************************
	Significance Labs
	Brooklyn, NYC

 	Author: Alexandra Berke (aberke)
 	Written: June 2014


 	AngularJS app

****************************************************/

var APIservice = function($rootScope, $http, $q){
  /* $rootScope broadcasts errors */

  function HTTP(method, endpoint, data, params) {
    
    var deferred = $q.defer();
    $http({
      method:  method,
      url:    ('/api' + endpoint),
      data:   (data || {}),
      params: (params || {}),
    })
    .success(function(returnedData){
      deferred.resolve(returnedData);
    })
    .error(function(errData, status) {
      var e = new APIserviceError(errData, status);
      deferred.reject(e);
    });
    return deferred.promise;
  };
  /* when there is an $http error, service rejects promise with a custom Error */
  function APIserviceError(err, status) {
    console.log('API Error', status, err)
    var error = (err || {});
    this.type = "APIserviceError";
    this.data = err;
    this.message = (err.message || status + " Error");
    this.status = status;
    $rootScope.$broadcast('error', this);
  }
  APIserviceError.prototype = Error.prototype;


  /* ---------- below functions return promises --------------------------- */
  

  this.GET = function(endpoint, data) { // if there's data, send it as params
    return HTTP('GET', endpoint, null, data);
  };
  this.POST = function(endpoint, data) {
    return HTTP('POST', endpoint, data);
  };
  this.PUT = function(endpoint, data) {
    return HTTP('PUT', endpoint, data);
  };
  this.DELETE = function(endpoint) {
    return HTTP('DELETE', endpoint, null);
  };

};

var AuthService = function($rootScope, $http, $q){
  /* $rootScope broadcasts errors */

  function HTTP(method, endpoint, data, params) {
    
    var deferred = $q.defer();
    $http({
      method:  method,
      url:    ('/auth' + endpoint),
      data:   (data || {}),
      params: (params || {}),
    })
    .success(function(returnedData){
      deferred.resolve(returnedData);
    })
    .error(function(errData, status) {
      var e = new AuthServiceError(errData, status);
      deferred.reject(e);
    });
    return deferred.promise;
  };
  /* when there is an $http error, service rejects promise with a custom Error */
  function AuthServiceError(err, status) {
    console.log('Authentication Error', status, err)
    var error = (err || {});
    this.type = "AuthServiceError";
    this.data = err;
    this.message = (err.message || status + " Error");
    this.status = status;
    $rootScope.$broadcast('error', this);
  }
  AuthServiceError.prototype = Error.prototype;


  /* ---------- below functions return promises --------------------------- */
  

  this.GET = function(endpoint, data) { // if there's data, send it as params
    return HTTP('GET', endpoint, null, data);
  };
  this.POST = function(endpoint, data) {
    return HTTP('POST', endpoint, data);
  };
  this.PUT = function(endpoint, data) {
    return HTTP('PUT', endpoint, data);
  };
  this.DELETE = function(endpoint) {
    return HTTP('DELETE', endpoint, null);
  };

  this.cleanUserData = function(user) {
  	// returns error object
  }





};

