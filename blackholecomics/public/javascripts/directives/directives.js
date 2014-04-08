'use strict';
var directives = angular.module('blackholecomics.directives',['blackholecomics.services']);

directives.directive('sessioncheck',['$rootScope', 'LoggedInService',
	function($rootScope,LoggedInService){
		return {
			link : function(scope, element, attr){
				var notLoggedInPrompt = '<a href="/#/login">Login</a> or <a href="/#/signup">Sign Up!</a>';
				var loggedInPrompt = function(name){
					var string = 'Hello,<a href="/#/account">' + name;
					return string;
				};
			    $rootScope.$on('$routeChangeSuccess', function() {
			        LoggedInService.get({},
			        	function(user){
			        		if (user._id) element.html(loggedInPrompt(user._id))
			        		else element.html(notLoggedInPrompt);
			        });
			    });
			}
		};
	}
])

directives.directive('logoutbutton',['$rootScope', 'LoggedInService',
	function($rootScope, LoggedInService){
		return {
			link: function(scope, element, attrs) {
		      element.addClass('hide');
		      $rootScope.$on('$routeChangeSuccess', function() {
		      	LoggedInService.get({},
			        function(user){
			        	if (user._id) element.removeClass('hide');
			        	else element.addClass('hide');;
			     });
		      });
		    }
		};
	}
]);