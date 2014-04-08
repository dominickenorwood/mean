var app = angular.module('blackholecomics', ['ngRoute','blackholecomics.services', 'blackholecomics.directives']);

app.config(['$routeProvider', function($routeProvider){
	$routeProvider
	.when("/",{
		templateUrl : 'partials/home'
	})
	.when("/login",{
		templateUrl : 'partials/login',
		controller : 'LoginToBlackHoleComics'/*,
		resolve:{
			loggedIn : ['LoggedIn',function(LoggedIn){
				return LoggedIn();
				//return 'hello authentication';
			}]
		}*/
	})
	.when("/signup",{
		templateUrl : 'partials/signup',
		controller : 'SignUpNewUser'/*,
		resolve:{
			loggedIn : ['LoggedIn',function(LoggedIn){
				return LoggedIn();
				//return 'hello authentication';
			}]
		}*/
	})
	.when("/account",{
		templateUrl : 'partials/account'
	})
	.otherwise({ redirectTo: '/' })

}])

app.controller('SessionBar',['$scope', '$route', 'LogOutService',
	function($scope, $route, LogOutService){
		$scope.logout = function(){
	      	LogOutService.save({}, function(){
	      		$route.reload();
	      	});
	    };	
	}
]);

app.controller('SignUpNewUser',['$scope', '$location', 'SignUpService',
	function($scope, $location, SignUpService){
		$scope.save = function(){
			var user = {
				username : $scope.username,
				password : $scope.password
			};
			SignUpService.save(user,
				function(){
					console.log('signup success');
					$location.path('/account');
				},
				function(){
					console.log('signup failed');
				});
		}
	}
]);

app.controller('LoginToBlackHoleComics',['$scope', '$location', 'LoginService',
	function($scope, $location, LoginService){
		$scope.user = {};
		$scope.userLogin = function(){
			$scope.user = {
				username : $scope.user.username,
				password : $scope.user.password
			};
			LoginService.save($scope.user,
				function(){
					console.log('Successfully logged in!');
					$location.path('/');
				},
				function(){
					console.log('Could not Login :(')
				});
		};
		
	}
]);