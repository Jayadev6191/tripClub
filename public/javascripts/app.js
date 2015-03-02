var tripClub=angular.module('tripClub',['ngRoute']);


tripClub.service('authCheckService',function(){
			  // This is called with the results from from FB.getLoginStatus().
	  function statusChangeCallback(response) {
	    console.log('statusChangeCallback');
	    console.log(response);
	    // The response object is returned with a status field that lets the
	    // app know the current login status of the person.
	    // Full docs on the response object can be found in the documentation
	    // for FB.getLoginStatus().
		    if (response.status === 'connected') {
		      // Logged into your app and Facebook.
		      testAPI(response.status);
		    } else if (response.status === 'not_authorized') {
		      // The person is logged into Facebook, but not your app.
		      document.getElementById('status').innerHTML = 'Please log ' +
		        'into this app.';
		    } else {
		      // The person is not logged into Facebook, so we're not sure if
		      // they are logged into this app or not.
		      document.getElementById('status').innerHTML = 'Please log ' +
		        'into Facebook.';
		    }
	  }

	  // This function is called when someone finishes with the Login
	  // Button.  See the onlogin handler attached to it in the sample
	  // code below.
	  var checkLoginState=function() {
	    FB.getLoginStatus(function(response) {
	      statusChangeCallback(response);
	    });
	  }

	  window.fbAsyncInit = function() {
	  FB.init({
	    appId      : '626644994145572',
	    cookie     : true,  // enable cookies to allow the server to access 
	                        // the session
	    xfbml      : true,  // parse social plugins on this page
	    version    : 'v2.2' // use version 2.2
	  });

	  // Now that we've initialized the JavaScript SDK, we call 
	  // FB.getLoginStatus().  This function gets the state of the
	  // person visiting this page and can return one of three states to
	  // the callback you provide.  They can be:
	  //
	  // 1. Logged into your app ('connected')
	  // 2. Logged into Facebook, but not your app ('not_authorized')
	  // 3. Not logged into Facebook and can't tell if they are logged into
	  //    your app or not.
	  //
	  // These three cases are handled in the callback function.
		  FB.getLoginStatus(function(response) {
		    statusChangeCallback(response);
		  });
	  };

	  // Load the SDK asynchronously
	  (function(d, s, id) {
	    var js, fjs = d.getElementsByTagName(s)[0];
	    if (d.getElementById(id)) return;
	    js = d.createElement(s); js.id = id;
	    js.src = "//connect.facebook.net/en_US/sdk.js";
	    fjs.parentNode.insertBefore(js, fjs);
	  }(document, 'script', 'facebook-jssdk'));

	  // Here we run a very simple test of the Graph API after login is
	  // successful.  See statusChangeCallback() for when this call is made.
	  function testAPI(status) {
	    	// console.log('Welcome!  Fetching your information.... ');
		    FB.api('/me', function(response) {
		      	console.log(response.email);
		      	if (status==="connected") {
		      		location.href="#/main";	
		      	};
		      	
		    });
	  }
});


tripClub.config(["$routeProvider",function($routeProvider){
	$routeProvider
		.when('/',{
			templateUrl:'/pages/login.html',
			controller:'loginController'
		})

		.otherwise({
			templateUrl:'/pages/main.html',
			controller:'mainController'
		})
		

}]);

tripClub.controller('loginController',['$scope','authCheckService', '$http',function($scope,authCheckService,$http){
		authCheckService.checkLoginState;
		// var d=authCheckService.abc
		// console.log(d);
}]);


tripClub.controller('mainController',['$scope','$filter','$http',function($scope,$filter,$http){
	var expedia_key = 'jtsBNOzl4b1SuVD2aD8KO5GfHCul7AJb';

   $scope.interests = [
	    'Adventure Sports', 
	    'Restaurants', 
	    'Shopping', 
	    'Hiking',
	    'Picnic'
   ];

    $scope.user_interests=[];
	
	// toggle selection for a given fruit by name
  $scope.toggleSelection = function toggleSelection(interests) {
    var index = $scope.user_interests.indexOf(interests);

    // is currently selected
    if (index > -1) {
      $scope.user_interests.splice(index, 1);
    }

    // is newly selected
    else {
      $scope.user_interests.push(interests);
    }
    console.log($scope.user_interests);
  };

	//var twitter_key =
	$scope.region="";

	$scope.from=function(){
		$scope.$watch('region',function(newValue,oldValue){
				$http.get('http://terminal2.expedia.com/suggestions/regions?query='+newValue+'&apikey='+expedia_key,'').
					success(function(res){
						$scope.options=res;
					})
				});
		}

	$scope.to_region="";
	$scope.to=function(){
		$scope.$watch('to_region',function(newValue,oldValue){
				$http.get('http://terminal2.expedia.com/suggestions/regions?query='+newValue+'&apikey='+expedia_key,'').
					success(function(res){
						$scope.to_options=res;
					})
				});
		}

	$scope.search_plan=function(){
		var search_obj={
			'from_region':$scope.region,
			'to_region':$scope.to_region,
			'to_date':$scope.to_date,
			'from_date':$scope.from_date,
			'trip_purpose':$scope.purpose,
			'interests':$scope.user_interests
		};
		console.log(search_obj);
	}
}]);
