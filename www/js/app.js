angular.module('flowerCity', ['ionic', 'flowerCity.controllers', 'flowerCity.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

	.state('app', {
		url: '/app',
		abstract: true,
		templateUrl: 'templates/menu.html',
		controller: 'AppCtrl'
	})
		.state('home', {
			url: '/',
			views: {
				'': {
					templateUrl: 'templates/home.html',
					controller: 'HomeCtrl'
				}
			}
		})
		.state('app.map', {
			url: '/map',
			views: {
				'menuContent': {
					templateUrl: 'templates/map.html',
					controller: 'MapCtrl'
				}
			}
		})
		.state('app.place', {
			url: '/map/:placeId',
			views: {
				'menuContent': {
					templateUrl: 'templates/place.html',
					controller: 'PlaceCtrl'
				}
			}
		})
	
	$urlRouterProvider.otherwise('/');
});
