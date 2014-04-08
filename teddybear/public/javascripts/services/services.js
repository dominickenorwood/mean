var services = angular.module('teddybear.services', ['ngResource']);

services.factory('AvailableComicsInInventory', ['$resource',
	function($resource){
		return $resource('http://localhost\\:3000/database/comics/:id',{id: '@_id'},{'update':{method:'PUT'}});
	}
]);

services.factory('UploadImageToServer', ['$resource',
	function($resource){
		return $resource('http://localhost\\:3000/upload');
	}
]);

services.factory('ResolveAvailableComicsInInventory', ['AvailableComicsInInventory', '$q',
	function(AvailableComicsInInventory, $q){
		return function(){
			var delay = $q.defer();
			AvailableComicsInInventory.query(function(comics){
				delay.resolve(comics);
			}, function(){
				delay.reject('Unable to fetch items');
			});
			return delay.promise;
		}
	}
]);

services.factory('ResolveAvailableComicInInventory', ['AvailableComicsInInventory', '$route', '$q',
	function(AvailableComicsInInventory, $route, $q){
		return function(){
			var delay = $q.defer();
			AvailableComicsInInventory.get({ id: $route.current.params.id},
				function(comic){
					delay.resolve(comic);
				}, function(){
					delay.reject('Unable to fectch comic ' + $route.current.params.id)
				});
			return delay.promise;
		};
	}
]);

services.factory('notificationsArchiveTest', function(){

	var archivedNotifications = [];
	return{
		archive:function (notification){
			archivedNotifications.push(notification);
		},
		getArchived:function(){
			return archivedNotifications;
		}
	}
});
/*services.factory('Item', ['$resource',
	function($resource){
		//return $resource('/comics/:id',{id: '@id'});
		return $resource('http://localhost:3000/comics/:id',{id: '@id'},{'update':{method:'PUT'}});
	}
]);

services.factory('MultiItemLoader', ['Item', '$q',
	function(Item, $q){
		return function(){
			var delay = $q.defer();
			Item.query(function(items){
				delay.resolve(items);
			}, function(){
				delay.reject('Unable to fetch items');
			});
			return delay.promise;
		}
	}
]);

services.factory('ItemLoader', ['Item', '$route', '$q',
	function(Item, $route, $q){
		return function(){
			var delay = $q.defer();
			Item.get({ id: $route.current.params.id},
				function(item){
					delay.resolve(item);
				}, function(){
					delay.reject('Unable to fectch comic ' + $route.current.params.id)
				});
			return delay.promise;
		};
	}
]);*/