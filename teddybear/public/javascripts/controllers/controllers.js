var app = angular.module('teddybear', ['ngRoute','teddybear.directives','teddybear.services']);

app.config(['$routeProvider', function ($routeProvider) {
	$routeProvider
	.when('/',{
		templateUrl: 'partials/list',
		controller: 'ListAvailableComicsInInventory',
		resolve:{
			availableComics : ['ResolveAvailableComicsInInventory', function(ResolveAvailableComicsInInventory){
				return ResolveAvailableComicsInInventory();
			}]
		}
	})
	.when('/comics/:id',{
		templateUrl: 'partials/comic',
		controller: 'ListAvailableComicInInventory',
		resolve:{
			availableComic : ['ResolveAvailableComicInInventory', function(ResolveAvailableComicInInventory){
				return ResolveAvailableComicInInventory();
			}]
		}
	})
	.when('/new',{
		templateUrl: 'partials/comic-form',
		controller: 'CreateComic',
		resolve:{
			availableComics : ['ResolveAvailableComicsInInventory', function(ResolveAvailableComicsInInventory){
				return ResolveAvailableComicsInInventory();
			}]
		}
	})
	.when('/update/:id',{
		templateUrl: 'partials/comic-form',
		controller: 'UpdateComic',
		resolve:{
			availableComic : ['ResolveAvailableComicInInventory', function(ResolveAvailableComicInInventory){
				return ResolveAvailableComicInInventory();
			}]
		}
	})
	.otherwise({ redirectTo: '/' });
}]);

app.controller('ListAvailableComicsInInventory',['$scope', 'availableComics',
	function($scope, availableComics){
		$scope.comics = availableComics;
	}
]);

app.controller('ListAvailableComicInInventory',['$scope', 'availableComic',
	function($scope, availableComic){
		$scope.comic = availableComic;
	}
]);

app.controller('UpdateComic',['$scope', '$location', 'availableComic', 'AvailableComicsInInventory',
	function($scope, $location, availableComic, AvailableComicsInInventory){
		$scope.comic = availableComic;
		$id = $scope.comic._id;

		$scope.save = function(){
			$location.path('/comics/' + $id);
			AvailableComicsInInventory.update({id:$id}, $scope.comic);			
		};

		$scope.delete = function(){
			$location.path('/');
			AvailableComicsInInventory.delete({}, $scope.comic);		
		};
	}
]);

app.controller('CreateComic',['$scope', '$location', '$http', 'availableComics' ,'AvailableComicsInInventory', 'UploadImageToServer',
	function($scope, $location, $http, availableComics, AvailableComicsInInventory, UploadImageToServer){
		//$scope.comic = new AvailableComicsInInventory({});

		$scope.files = [];

		//listen for the file selected event
	    $scope.$on("fileSelected", function (event, args) {
	        $scope.$apply(function () {            
	            //add the file object to the scope's files collection
	            $scope.files.push(args.file);
	        });
	        console.log(args.file);
	    });

	    $scope.uploadImage = function(){
	    	$http({
	    		method : 'POST',
	    		url : '/upload',
	    		headers: { 'Content-Type': false },
	    		transformRequest: function (data) {
	    			var formData = new FormData();
	    			formData.append("model", angular.toJson(data.files));
	    			console.log('DATA ' + angular.toJson(data.files));
	    			return formData;
	    		},
	    		data : {files: '$scope.files'}
	    	})
	    	.success(function (data, status, headers, config) {
	            console.log("success!");
	            console.log(data);
	            console.log(status);
	            console.log(headers);
	            console.log(config);
	        })
	        .error(function (data, status, headers, config) {
	            console.log("failed!");
	        });;
	    };

	    $scope.upload = function(){
	    	var formData = new FormData();
	    	var file = document.getElementById('myFile').files[0];
	    	formData.append('myFile', file);

	    	var xhr = new XMLHttpRequest();

	    	xhr.open('post', '/upload', true);

	    	xhr.onerror = function(e) {
		      console.log('An error occurred while submitting the form. Maybe your file is too big');
		    };
		    
		    xhr.upload.onprogress = function(e) {
		      if (e.lengthComputable) {
		        var percentage = (e.loaded / e.total) * 100;
		        $('div.progress div.bar').css('width', percentage + '%');
		        console.log(percentage);
		      }
		    };
		    
		    xhr.onerror = function(e) {
		      showInfo('An error occurred while submitting the form. Maybe your file is too big');
		    };

		    xhr.onload = function() {
		      console.log(this.statusText);
		    };
		    
		    xhr.send(formData);
	    	
	    };
		/*$scope.uploadImage = function(){
			var files = $scope.files;
			console.log(files);
			var form = new FormData();
			form.append('test', angular.toJson(files[0]));
			console.log("FORM " + form);
			UploadImageToServer.save(form);


		};*/

		$scope.save = function(){
			
			//$scope.comic._id = availableComics.length + 1;
			//$scope.comic.releaseDate = Date.now();
			//$location.path('/');
			//AvailableComicsInInventory.save($scope.comic);			
		};

		/*$scope.uploadImage = function() {
			//var files = $scope.files;
			//console.log(files);
	        $http({
	            method: 'POST',
	            url: "/upload",
	            //IMPORTANT!!! You might think this should be set to 'multipart/form-data' 
	            // but this is not true because when we are sending up files the request 
	            // needs to include a 'boundary' parameter which identifies the boundary 
	            // name between parts in this multi-part request and setting the Content-type 
	            // manually will not set this boundary parameter. For whatever reason, 
	            // setting the Content-type to 'false' will force the request to automatically
	            // populate the headers properly including the boundary parameter.
	            headers: { 'Content-Type': false },
	            //This method will allow us to change how the data is sent up to the server
	            // for which we'll need to encapsulate the model data in 'FormData'
	            transformRequest: function (data) {
	            	//console.log('hello from transform ' + angular.toJson(data));
	                var formData = new FormData();
	                //need to convert our json object to a string version of json otherwise
	                // the browser will do a 'toString()' on the object which will result 
	                // in the value '[Object object]' on the server.
	                formData.append("model", angular.toJson(data.model));
	                //now add all of the assigned files
	                for (var i = 0; i < data.files; i++) {
	                    //add each file to the form data and iteratively name them
	                    formData.append("file" + i, data.files[i]);
	                }
	                return formData;
	            },
	            //Create an object that contains the model and files which will be transformed
	            // in the above transformRequest method
	            data: { model: $scope.model, files: $scope.files }
	        }).
	        success(function (data, status, headers, config) {
	            console.log("success!");
	            console.log(data);
	            console.log(status);
	            console.log(headers);
	            console.log(config);
	        }).
	        error(function (data, status, headers, config) {
	            console.log("failed!");
	        });
	    };*/

		
	}
]);
