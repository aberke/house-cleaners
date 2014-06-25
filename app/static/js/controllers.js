/*********************************************************************


	Significance Labs
	Brooklyn, NYC

 	Author: Alexandra Berke (aberke)
 	Written: June 2014




AngularJS controllers 

*********************************************************************/


function MainCntl($scope) {
	//$scope.controller = "MainCntl";

	console.log('MainCntl');
}

function IndexCntl($scope) {

	console.log('IndexCntl');
}
function NewCntl($scope, APIservice) {

	$scope.servicesOptions = [
		'SURFACES',
		'LAUNDRY',
		'ORGANIZING',
		'RESIDENTIAL',
		'OFFICES',
		'GARDENING',
		'PROVIDES OWN SUPPLIES',
		'WINDOWS',
	];

	$scope.cleaner = {
		_id: 3,
		pic_url: "/static/img/user_icon.png",
	};
	$scope.uploadPic = function(files) {
	    APIservice.PUTupload('/cleaner/2/pic/upload', files).then(function(data) {
	    	$scope.cleaner.pic_url = data;
	    });
	}	
}

function UploadCntl($scope, $http, APIservice) {
	$scope.pic_url = "/static/img/user_icon.png";


	$scope.uploadPic = function(files) {
	    APIservice.PUTupload('/cleaner/2/pic/upload', files).then(function(data) {
	    	$scope.pic_url = data;
	    });
	}	
}

function LoginCntl($scope, AuthService, APIservice, newLogin) {

	$scope.error = {};
	$scope.user = {exists: false}; // if existing user, user.exists=true

	$scope.submitUsername = function() {
		//APIservice.GET('/cleaner/auth/')
	}

	$scope.submitNew = function() {
		APIservice.POST('/cleaner/new', $scope.user).then(function(data) {
			console.log('submitted new', data)
		});
	}

	$scope.submitLogin = function() {
		APIservice.POST('/cleaner/login', $scope.user).then(function(data) {
			console.log('login returned', data);
		});
	}

	$scope.submit = function() {
		$scope.error = {};
		if (!$scope.user.phonenumber) {
			$scope.error.phonenumber = true;
		}
		if (!$scope.user.password) {
			$scope.error.password = true;
		}

		if ($scope.user.new) {
			if (!$scope.user.name) {
				$scope.error.name = true;
			}
			if (!$scope.user.confirmPassword || $scope.user.confirmPassword != $scope.user.password) {
				$scope.error.confirmPassword = true;
			}
		}

		if ($scope.error.phonenumber||$scope.error.password||$scope.error.name||$scope.error.confirmPassword) {
			console.log('error',$scope.error)
			return false;
		}
		// login/create new user
		console.log('submit', $scope.user)
		if ($scope.user.new) {
			APIService.POST('/user', $scope.user).then(function(data) {

			});
		}
	}

	console.log('LoginCntl user', $scope.user);
}

function KeeperCntl($scope) {

	console.log('KeeperCntl');
}












