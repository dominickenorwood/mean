var services = angular.module('blackholecomics.services',['ngResource']);

services.factory('LoginService',['$resource',
	function($resource){
		return $resource('http://localhost\\:3000/login');
	}
]);

services.factory('LoggedInService',['$resource',
	function($resource){
		return $resource('http://localhost\\:3000/loggedin');
	}
]);

services.factory('LogOutService',['$resource',
	function($resource){
		return $resource('http://localhost\\:3000/logout');
	}
]);

services.factory('SignUpService',['$resource',
	function($resource){
		return $resource('http://localhost\\:3000/signup');
	}
]);

services.factory('LoggedIn', ['LoggedInService', '$q',
	function(LoggedInService, $q){
		/*var delay = $q.defer();
		LoggedInService.get({},
			function(user){
				delay.resolve(user);
			}, function(){
				delay.reject('You are not logged in :*(')
			});
		return delay.promise;*/
		/*LoggedInService.get({'name':'admin'},
			function(user){
				var test = user !== 0 ? 'loggedin' : 'not loggedin'
				console.log(user)
				console.log(test);
			}, function(){
				console.log('who the hell')
			});
		return function(){return 'hello';};*/
	}
]);