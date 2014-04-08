var directives = angular.module('teddybear.directives', []);
directives.directive('fileUpload', function () {
    return {
        scope: true,        //create a new scope
        link: function (scope, el, attrs) {
            el.bind('change', function (event) {
                var files = event.target.files;
                //iterate files since 'multiple' may be specified on the element
                for (var i = 0;i<files.length;i++) {
                    //emit event upward
                    scope.$emit("fileSelected", { file: files[i] });
                }                                       
            });
        }
    };
});

/*directives.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
        	console.log("hello from file upload");
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            
            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);*/
/*directives.directive('fileupload', function(){
	return {
		restrict : 'A',
		scope : {
			done : '&',
			progress : '&'
		},
		link : function(scope, element, attrs){
			

			var optionsObj = {dataType : 'json'};

			if(scope.done){
				optionsObj.done = function(){
					scope.$apply(function(){
						scope.done({e:e, data:data});
					});
				};
			}

			if(scope.progress){
				optionsObj.progress = function(e, data){
					scope.$apply(function(){
						scope.progress({e:e, data:data});
					});
				};
			}
			console.log('hello from file upload');
			element.on('change',function(e, data){
				console.log(data);
			});
			element.fileupload(optionsObj);
		}

	};

});*/

/*var directives = angular.module('guthub.directives', []);

directives.directive('butterbar',['$rootScope',
		function($rootScope){
			return {
				link : function (scope, element, attrs){
					element.addClass('hide');

					$rootScope.$on('$routeChangeStart', function(){
						element.removeClass('hide');
					});

					$rootScope.$on('$routeChangeSuccess', function(){
						element.addClass('hide');
					});
				}
			};
		}]);

directives.directive('focus',
		function(){
			return {
				link : function(scope, element, attrs){
					element[0].focus();
				}
			};
		});*/