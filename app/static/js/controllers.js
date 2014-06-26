/*********************************************************************


	Significance Labs
	Brooklyn, NYC

 	Author: Alexandra Berke (aberke)
 	Written: June 2014




AngularJS controllers 

*********************************************************************/


function MainCntl($scope, $window, $location) {
	/* This controller's scope spans over all views */

	// google analytics -- log every new page view
	$scope.$on('$routeChangeSuccess', function(event) {
		$window.ga('send', 'pageview', { page: $location.path() });
	});
	
}

function IndexCntl($scope) {

	console.log('IndexCntl');
}
function NewCntl($scope, APIservice) {

	$scope.error = {};
	$scope.cleaner = {
		_id: 3,
		pic_url: "/static/img/user_icon.png",
	};
	$scope.stage;
	$scope.next = function() {
		$scope.stage += 1;
	}
	$scope.back = function() {
		$scope.stage -= 1;
	}
	$scope.submitPhonenumber = function() {
		// clear out old error
		$scope.error = {};
		/* ensure that phonenumber is new
			if not: err
			if so: increment stage appropriately
		*/
		var phonenumber = $scope.cleaner.phonenumber;
		if (!phonenumber) {
			console.log('ERROR: TODO');
			return;
		}
		APIservice.GET('/cleaner/lookup/phonenumber/' + phonenumber).then(function(data) {
			console.log('lookup:', data, typeof data);
			if (data != null && data != 'null') {
				console.log('ERROR: TODO');
				$scope.error.phonenumber = true;
				return;
			}
			$scope.stage = 1;
		});
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
		APIservice.POST('/cleaner/profile', $scope.cleaner).then(function(data) {
			console.log('submitted new profile', data)
			$scope.cleaner._id = data._id;
			$scope.stage = 2;
		});
	}

	$scope.uploadPic = function(files) {
	    APIservice.PUTupload('/cleaner/' + $scope.cleaner._id + '/pic/upload', files).then(function(data) {
	    	$scope.cleaner.pic_url = data;
	    });
	}
	$scope.submitProfile = function() {
		APIservice.PUT('/cleaner/profile/' + $scope.cleaner._id, $scope.cleaner).then(function(data) {
			console.log('submitProfile returned', data);
			$scope.next();
		});
	}

	function init() {
		$scope.stage = 0;
	}
	init();
}



function ProfileCntl($scope, APIservice, cleaner) {

	$scope.cleaner = cleaner;
	console.log('KeeperCntl');
}












