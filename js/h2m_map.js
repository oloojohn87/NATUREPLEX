
/*	REQUIRED FILES

<script src="//ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
<script src="https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false">	</script>
<script src="js/h2m_map.js"></script> */

var geocoder;
var map;
var address;
/* TODO : I think this could be much simpler ... */		
function setAddress (city, region, country, lat, long){
	
	address = city+', '+region+', '+country;
	//console.log(address);
	//console.log("LAT & LONG : "+lat + " "+ long);
	geocoder = new google.maps.Geocoder();

    var mapProp = {
        //center: new google.maps.LatLng(51.508742,-0.120850),
		center: new google.maps.LatLng(parseInt(lat), parseInt(long)),
        zoom:3,
        disableDefaultUI:true,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    map = new google.maps.Map(document.getElementById("googleMap"), mapProp);
    geocoder.geocode({ 'address': address }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
 			map.setCenter({lat: parseInt(lat), lng: parseInt(long)});
            // To add a marker:
            var marker = new google.maps.Marker({
                map: map,
				position: {lat: parseInt(lat), lng: parseInt(long)},
				fillColor:"#0000FF",
                fillOpacity:1,
				place: {lat: parseInt(lat), lng: parseInt(long)}
            });
        } else {
            alert("Geocode was not successful for the following reason: " + status);
        }
    });
}		
function initialize(ip)
{

	var lat="";
	var long="";
	//get info based on the ip address
	//navigator.geolocation.getCurrentPosition(success, error, options);
	$.get("http://ipinfo.io/"+ip, function(response) {
    	console.log(response.loc);
		console.log(response.city);
		console.log(response.region);
		console.log(response.country);
		city 	= response.city;
		region  = response.region;
		country = response.country;
		var loc = response.loc.split(",");	
		lat = loc[0];
		long = loc[1];

		address = city+', '+region+', '+country;
		setAddress(city, region, country, lat, long);
	}, "jsonp");

    
}
ip_address = "80.94.68.10";
google.maps.event.addDomListener(window, 'load', initialize(ip_address));