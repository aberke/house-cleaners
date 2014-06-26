/***************************************************
	Significance Labs
	Brooklyn, NYC

 	Author: Alexandra Berke (aberke)
 	Written: June 2014


 	AngularJS app

****************************************************/

var AuthService = function() {};

var APIservice = function($rootScope, $http, $q){
  /* $rootScope broadcasts errors */

  function HTTP(method, endpoint, data, params, options) {

    var config = {
      method:  method,
      url:    endpoint,
      data:   (data || {}),
      params: (params || {}),
    };
    options = (options || {})
    for (var opt in options) { config[opt] = options[opt]; }
    
    var deferred = $q.defer();
    $http(config)
    .success(function(returnedData){
      deferred.resolve(returnedData);
    })
    .error(function(errData, status) {
      var e = new APIserviceError(errData, status);
      deferred.reject(e);
    });
    return deferred.promise;
  };
  function upload(method, endpoint, files) {
    var fd = new FormData();
    fd.append("file", files[0]); //Take the first selected file

    var options = {
        withCredentials: true,
        headers: {'Content-Type': undefined },
        transformRequest: angular.identity
    };
    return HTTP(method, endpoint, fd, null, options);
  }
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
  
  this.PUTupload = function(endpoint, files) {
    return upload('PUT', endpoint, files);
  }
  this.POSTupload = function(endpoint, files) {
    return upload('POST', endpoint, files);
  }

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


