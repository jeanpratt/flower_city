angular.module('flowerCity.services', [])

.factory('places', ['$http', function($http){
	return $http.get("js/places.json")
	
	.success(function(data){
		return data;
	})
	.error(function(err){
		return err;
	});
}]);