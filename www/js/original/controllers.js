angular.module('flowerCity.controllers', [])

.controller('AppCtrl', function($scope, places) {
	
	// Load data for menu.html
	places.success(function(data) {
		$scope.places = data;
	});
	
	$scope.$on('$ionicView.loaded', function() {
    	ionic.Platform.ready( function() {
       	 	if(navigator && navigator.splashscreen) navigator.splashscreen.hide();
        });
    });
})

.controller('HomeCtrl', function($scope, $ionicScrollDelegate, $location) {
	
	// On-click, scroll to section
	$scope.scrollTo = function(target) {
		$location.hash(target);
		var handle = $ionicScrollDelegate.$getByHandle('homeDelegate');
		handle.anchorScroll(true);
	};
})

.controller('MapCtrl', function($scope, places) {
	
	// Initiate map
	var myLatLng = {lat: 43.133635, lng: -77.608627};
	var mapOptions = {
		zoom: 			14,
		center: 		myLatLng,
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		
		// Adapted from personal Snazzy Maps style "Mostly Shapes"
		styles: [
			{
				"elementType":"geometry.stroke",
				"stylers":[{"visibility":"off"}]
			},
			{
				"elementType":"labels.icon",
				"stylers":[{"visibility":"off"}]
			},
			{
				"featureType":"administrative",
				"elementType":"labels.text.fill",
				"stylers":[{"color":"#8A55AA"},{"lightness":"20"},{"saturation":"-63"}]
			},
			{
				"featureType":"poi",
				"elementType":"geometry.fill",
				"stylers":[{"color":"#7FC28C"},{"lightness":"20"}]
			},
				{
					"featureType":"poi.business",
					"elementType":"geometry.fill",
					"stylers":[{"lightness":"50"}]
				},
				{
					"featureType":"poi.medical",
					"elementType":"geometry.fill",
					"stylers":[{"lightness":"30"}]
				},
				{
					"featureType":"poi.park",
					"elementType":"labels.text.fill",
					"stylers":[{"color":"#82b0a5"},{"lightness":"-20"}]
				},
				{
					"featureType":"poi.school",
					"elementType":"geometry.fill",
					"stylers":[{"lightness":"60"}]
				},
				{
					"featureType":"poi.school",
					"elementType":"labels.text.fill",
					"stylers":[{"lightness":"-16"}]
				},
				{
					"featureType":"poi.sports_complex",
					"elementType":"geometry.fill",
					"stylers":[{"lightness":"40"}]
				},
			{
				"featureType":"road",
				"elementType":"labels",
				"stylers":[{"visibility":"off"}]
			},
			{
				"featureType":"water",
				"elementType":"geometry.fill",
				"stylers":[{"color":"#083259"},{"lightness":"70"}]
			},
			{
				"featureType":"water",
				"elementType":"labels.text.fill",
				"stylers":[{"lightness":"69"}]
			}
		]
	};
	
	var map = new google.maps.Map(document.getElementById("map"), mapOptions);
	$scope.map = map;
	
	// Declare global InfoWindow
	$scope.infowindow = new google.maps.InfoWindow();
	
	// InfoWindow customization
	google.maps.event.addListener($scope.infowindow, 'domready', function(){
		var closeButton = document.getElementById("closeBtn");
		function closeWindow(){
			$scope.infowindow.close();
		}
		closeBtn.addEventListener("click", closeWindow, false);
		var infoWrapper = document.getElementsByClassName('gm-style-iw');
		
		for(i = 0; i < infoWrapper.length; i++) {
			var thisWrapper = infoWrapper[i],
			thisBackground = thisWrapper.previousElementSibling;
				
			// Get rid of default shadow and background
			thisBackground.childNodes[1].style.display = "none";
			thisBackground.childNodes[3].style.display = "none";
			
			// Allow content to span width of window
			thisWrapper.firstChild.style.overflow = 'visible';
			thisWrapper.firstChild.firstChild.style.overflow = 'visible';
			
			// Move InfoWindow tail
			thisBackground.childNodes[0].setAttribute("class", 'moveTail');
			thisBackground.childNodes[2].setAttribute("class", 'moveTail');
			
			// Move and style close button
			thisWrapper.nextElementSibling.setAttribute("class", "closebutton");
		}
	});
	
	// Function for InfoWindow events and styles
	function getInfoWindowEvent(marker, content) {
		$scope.infowindow.close();
		$scope.infowindow.setContent(content);
		$scope.infowindow.open($scope.map, marker);
	}
	
	// Re-size map (solves map distortion issue if users open the image modal)
    $scope.$on( "$ionicView.enter", function( scopes, states ) {
    	$scope.infowindow.close();
		google.maps.event.trigger( map, 'resize' );
   	});
	
	places.success(function(data) {
		$scope.geodata = data;
		
		$scope.markers = [];
		var infoWindow = new google.maps.InfoWindow();
		var createMarker = function(info){
			
			// Custom marker icon
			var pin = {
				path: 'M444.2,222.1C444.2,99.4,344.8,0,222.1,0S0,99.4,0,222.1c0,45.6,13.8,88,37.3,123.3h-0.1l1.2,1.5 c4.2,6.2,8.7,12.1,13.5,17.8l170.3,225l170.3-225c4.8-5.7,9.3-11.6,13.5-17.8l1.2-1.5h-0.1C430.5,310.1,444.2,267.7,444.2,222.1z M222.1,327.6c-67.1,0-121.6-54.4-121.6-121.6S155,84.4,222.1,84.4c67.1,0,121.6,54.4,121.6,121.6S289.2,327.6,222.1,327.6z',
				fillColor: "#8A55AA",
				fillOpacity: 1,
				scale: 0.07,
				strokeColor: '#8A72CC',
				strokeWeight: 0.5
			};
			
			// Create marker
			var marker = new google.maps.Marker({
				position: new google.maps.LatLng(info.lat, info.lng),
				icon: pin,
				map: $scope.map,
				animation: google.maps.Animation.DROP,
				title: info.title
			});
			
			// Custom InfoWindow Content
			marker.content = 
			"<div class='infoContainer'>" +
				"<h4 class='infoTitle'>" + marker.title + "</h4>" +
				 "<button id='closeBtn'>&times;</button>" +
				"<div class='infoContent'>" +
					"<img src='" + info.thumb + "'/>" +
					"<p>" + info.heading + "</p>" +
					"<div class='button-bar'>" +
						"<a class='button button-small button-balanced' href='#/app/map/" + info.id + "'>" +
							"Learn More" +
						"</a>"
					"</div>" +
				"</div>" +
			"</div>";
			
			// On-click, show InfoWindow
			google.maps.event.addListener(marker, 'click', function(){
				getInfoWindowEvent(marker, marker.content);
			});
			
			$scope.markers.push(marker);
		};
		
		for (i = 0; i < $scope.geodata.length; i++){
			createMarker($scope.geodata[i]);
		}
	});
})

.controller('PlaceCtrl', ['$scope', '$location', '$sce', 'places', '$ionicModal',
function($scope, $location, $sce, places, $ionicModal) {
	places.success(function(data){
		
		// Create url
		$scope.places = data;
		var url = $location.url();
		var id = parseInt(url.slice(-1)) - 1;
		$scope.place = $scope.places[id];
		
		// HTML audio variables from places.json
		$scope.audioUrl0 = $scope.place.tracks[0].src;
		$scope.audioUrl1 = $scope.place.tracks[1].src;
		$scope.audioUrl2 = $scope.place.tracks[2].src;
		
		// Create <audio> element for each track
		$scope.audioCall = function (id) {
		    if (id == 0) {
		        return $sce.trustAsHtml("<audio controls='controls'> <source src='" + $scope.audioUrl0 + "' type='audio/mpeg'/></audio>");
		    }
			else if (id == 1) {
				return $sce.trustAsHtml("<audio controls='controls'> <source src='" + $scope.audioUrl1 + "' type='audio/mpeg'/></audio>");
			}
			else if (id == 2) {
				return $sce.trustAsHtml("<audio controls='controls'> <source src='" + $scope.audioUrl2 + "' type='audio/mpeg'/></audio>");
			} else {
		        return "";
		    }
		};
		
		// Display image lightbox and caption
		$scope.showImage = function(image, caption, source) {
			$scope.image = image;
			$scope.caption = caption;
			$scope.source = source;
			$scope.showModal('templates/modal.html');
		}
		
		$scope.showModal = function(templateUrl) {
			$ionicModal.fromTemplateUrl(templateUrl, {
				scope: $scope,
				animation: 'slide-in-up'
			}).then(function(modal) {
				$scope.modal = modal;
				$scope.modal.show();
			});
		}
		
		$scope.closeModal = function() {
			$scope.modal.hide();
		};
		
		$scope.$on('$destroy', function() {
			$scope.modal.remove();
		});
		
		// Accordion for image caption and source
		$scope.info = false;
		
		$scope.toggleInfo = function() {
			if($scope.info == true) {
				$scope.info = false;
				console.log($scope.info);
			} else {
				$scope.info = true;
				console.log($scope.info + " :false");
			}
		}
		
	});
}]);