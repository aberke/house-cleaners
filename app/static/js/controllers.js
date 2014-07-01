/*********************************************************************


	Significance Labs
	Brooklyn, NYC

 	Author: Alexandra Berke (aberke)
 	Written: June 2014




AngularJS controllers 

*********************************************************************/

// TODO: have JSON files for each set and load in
var extras = ['Ironing', 'Dishes (by hand)', 
	'Laundry', 'Organizing', 'Bringing own cleaning products',
];

console.log('extras', extras);



function MainCntl($scope, $window, $location, APIservice, UserService) {
	/* This controller's scope spans over all views */
	$scope.domain = $window.location.origin;
	$scope.user = null;

	var setupGoogleAnalytics = function() {
		// log every new page view in production
		console.log('domain', $scope.domain)

		if ($scope.domain == "http://clean-slate.herokuapp.com") {
			$scope.$on('$routeChangeSuccess', function(event) {
				console.log('pushing to google-analytics')
				$window.ga('send', 'pageview', { page: $location.path() });
			});
		}
	}
	$scope.logout = function(){
		console.log('logout')
		UserService.logout();
		$scope.user = null;
	}
	var resetUser = function() {
		$scope.user = null;
		UserService.GETuser().then(function(user) {
			if (user && user != "null") {
				$scope.user = user;
			}
		});
	}
	var init = function() {
		setupGoogleAnalytics();
		$scope.$on('$routeChangeSuccess', function(event) {
			resetUser()
		});
	}
	init();
}

// TODO: move
var busy = function(t) {
	if (t.className == 'busy') {
		t.className = "";
	} else {
		t.className = "busy";
	}
}

function NewCntl($scope, APIservice) {

	//$scope.showAll = true; // true iff testing

	$scope.error = {};
	$scope.waiting = false;
	$scope.cleaner = {
		_id: 3,
		pic_url: "/static/img/user_icon.png",
	};
	$scope.stage;
	$scope.next = function() {
		$scope.stage += 1;
	}
	$scope.back = function() {
		if ($scope.stage < 3) { return; }
		$scope.stage -= 1;
	}
	$scope.submitPhonenumber = function() {
		// clear out old error
		$scope.error = {};
		// show waiting
		$scope.waiting = true;
		/* ensure that phonenumber is new and valid (sends SMS message via twilio)
			if not: err
			if so: increment stage appropriately
		*/
		var phonenumber = $scope.cleaner.phonenumber;
		if (!phonenumber) {
			$scope.waiting = false;
			$scope.error.phonenumber = true;
			return;
		}

		var successCallback = function() {
			$scope.waiting = false;
			$scope.stage = 1;
		}
		var errorCallback = function(message) {
			$scope.waiting = false;
			$scope.error.message = message;
			$scope.error.phonenumber = true;
		}
		APIservice.GET('/cleaner/validate-new-phonenumber/' + phonenumber, null)
				.then(successCallback, errorCallback);
	}

	$scope.submitPassword = function() {
		/* POSTs new user */

		// clear old error
		$scope.error = {};

		if (!$scope.cleaner.password) {
			$scope.error.password = true;
		}
		if (!$scope.cleaner.confirmPassword || $scope.cleaner.confirmPassword != $scope.cleaner.password) {
			$scope.error.confirmPassword = true;
		}
		if ($scope.error.phonenumber||$scope.error.password||$scope.error.confirmPassword) {
			console.log('error',$scope.error)
			return false;
		}
		var successCallback = function(data) {
			$scope.cleaner._id = data._id;
			$scope.stage = 2;
			console.log('submitted new profile', data)
		}
		var errorCallback = function(message) {
			$scope.error.message = message;
		}
		APIservice.POST('/cleaner/profile', $scope.cleaner).then(successCallback, errorCallback);
	}

	$scope.uploadPic = function(files) {
		// URL to image won't change so much clear out to refresh
		$scope.cleaner.pic_url = '';

		var successCallback = function(data) {
			console.log('uploadedpic', data)
			$scope.cleaner.pic_url = data;
		}
		var errorCallback = function(message) { console.log('TODO: HANDLE ERROR'); };	
	    APIservice.PUTupload('/cleaner/' + $scope.cleaner._id + '/pic/upload', files)
	    		.then(successCallback, errorCallback);
	}
	$scope.submitProfile = function() {
		var successCallback = function(data) {
			console.log('submitProfile returned', data);
			$scope.next();
		}
		var errorCallback = function(message) { console.log('TODO: HANDLE ERROR'); };
		APIservice.PUT('/cleaner/profile/' + $scope.cleaner._id, $scope.cleaner)
				.then(successCallback, errorCallback);
	}

	function init() {
		$scope.stage = 0;
	}
	init();
}

function LoginCntl($scope, $rootScope, $location, APIservice, UserService) {

	$scope.cleaner = {};
	$scope.error = {};

	$scope.login = function() {
		$scope.error = {};
		var errorCallback = function(message) {
			$scope.error.message = message;
		}
		var successCallback = function(data) {
			$rootScope.user = data;
			$location.path('/profile/' + $scope.cleaner.phonenumber); 
		}
		UserService.login($scope.cleaner).then(successCallback, errorCallback);
	}
	console.log('LoginCntl')
}

function ResetPasswordCntl($scope, $timeout, $location, APIservice) {

	$scope.error = {};
	$scope.stage = 0;
	$scope.cleaner = {};
	$scope.sendAgainEnabled = true;

	$scope.sendResetCode = function() {
		/* send the reset code and hide send-again button for enough seconds to recieve SMS */
		$scope.error = {};
		$scope.sendAgainEnabled = false;
		$timeout(function() {
			$scope.sendAgainEnabled = true;
		}, 6000);

		var errorCallback = function(message) {
			$scope.error.message = message;
		}
		var successCallback = function(data) {
			console.log('sendResetCode onSuccess')
			$scope.stage = 1;
		}
		APIservice.POST("/cleaner/send-reset-code", $scope.cleaner).then(successCallback, errorCallback);
	}
	$scope.submitNewPassword = function() {
		// clear old error
		$scope.error = {};

		if (!$scope.cleaner.reset_code) {
			$scope.error.reset_code = true;
		}
		if (!$scope.cleaner.password) {
			$scope.error.password = true;
		}
		if (!$scope.cleaner.confirmPassword || $scope.cleaner.confirmPassword != $scope.cleaner.password) {
			$scope.error.confirmPassword = true;
		}
		if ($scope.error.password||$scope.error.confirmPassword) {
			return false;
		}

		var errorCallback = function(message) {
			$scope.error.message = message;
		}
		var successCallback = function(data) {
			console.log('successCallback', data)
			$location.path('/profile/' + $scope.cleaner.phonenumber);
		}
		APIservice.PUT("/cleaner/reset-password", $scope.cleaner).then(successCallback, errorCallback);
	}

	console.log('ResetPasswordCntl')
}


// TODO: move
var activate = function(elt) {
	// can't activate a busy cell
	if (elt.className == "busy") {
		return;
	}
	if (elt.className == "active") {
		elt.className = "";
	} else {
		elt.className = "active";
	}
}
function ProfileCntl($scope, APIservice, cleaner) {

	$scope.error = {};
	$scope.stage = 0;
	$scope.booking = {};
	$scope.cleaner = cleaner;
	console.log('ProfileCntl - cleaner', cleaner);
	$scope.editEnabled = false;

	$scope.next = function() {
		$scope.stage += 1;
		if ($scope.stage == 4) {
			postBooking(); // complete!
		}
	}
	$scope.back = function() {
		$scope.stage -= 1;
	}

	var postBooking = function() {
		var data = {
			'cleaner': $scope.cleaner,
			'booking': $scope.booking,
		}
		var errorCallback = function(message) {
			$scope.error.message = message;
		}
		var successCallback = function(data) {
			console.log('successCallback', data)
		}
		APIservice.POST('/cleaner/booking', data).then(successCallback, errorCallback);
	}

	$scope.enableEdit = function() {
		$scope.editEnabled = true;
	}
	$scope.save = function() {
		/* save changes made while editEnabled was true */
		$scope.error = {};
		var errorCallback = function(message) {
			$scope.error.message = message;
		}
		var successCallback = function(data) {
			console.log('successCallback')
			$scope.editEnabled = false;
		}
		APIservice.PUT('/cleaner/profile/' + $scope.cleaner._id, $scope.cleaner).then(successCallback, errorCallback);
	}




}












