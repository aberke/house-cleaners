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

function LoginCntl($scope, AuthService, APIservice) {

	$scope.error = {};
	$scope.user = {}; // if new user, user.new=true

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

	console.log('LoginCntl');
}

function KeeperCntl($scope) {

	console.log('KeeperCntl');
}












