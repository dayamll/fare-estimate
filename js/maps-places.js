function initMap() {
  const containerMap = document.getElementById('map');
  const directionsService = new google.maps.DirectionsService();
  const directionsDisplay = new google.maps.DirectionsRenderer();
  const geocoder = new google.maps.Geocoder();
  // Punto de muestra en el mapa al carga la pagina
  const losOlivos = {
    lat: -11.9594,
    lng: -77.0760
  };

  // Caracteristicas del mapa 
  const mapOptions = {
    zoom: 15,
    center: losOlivos,
  };

  // Creamos el mapa con las constantes containerMap y caracteristicas
  const map = new google.maps.Map(containerMap, mapOptions);
  directionsDisplay.setMap(map);

  // Aqui indicamos el efecto que tendra el marcador  
  const markerMap = new google.maps.Marker({
    position: {
      lat: losOlivos.lat,
      lng: losOlivos.lng
    },
    animation: google.maps.Animation.DROP,
    map: map
  });
/////////////////////////////////////
  var infowindow = new google.maps.InfoWindow();
  var service = new google.maps.places.PlacesService(map);
////////////////////////////////////
  var positionInitial = document.getElementById('btn-geolocation');

  // Realizamos el llamado al evento load para que pueda ubicarme al momento que carge la pagina
  positionInitial.addEventListener('click', function() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(getCoords, errorFound);
    } else {
      alert('Tu navegador no soporta el API de Geolocation');
    }
  });

  function errorFound(error) {
    alert('Un error ocurrió: ' + error.code);
  };

  function getCoords(position) {
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;

    let myLocation = new google.maps.Marker({
      position: {
        lat: lat,
        lng: lon
      },
      animation: google.maps.Animation.DROP,
      map: map
    });
    // Al mapa creado le agrego mi ubicación
    map.setCenter({
      lat: lat,
      lng: lon
    });
  };

  // Autocompletamos las direcciones de origen y destino
  let originPoint = document.getElementById('input-origin');
  let destinationPoint = document.getElementById('input-destination');

  // Usando la libraría Autocomplete para el autocompletado de los lugares
  var autocomplete_star = new google.maps.places.Autocomplete(originPoint);
  var autocomplete_end = new google.maps.places.Autocomplete(destinationPoint);
  // Usando la libraría Autocomplete para el autocompletado de los lugares
  autocomplete_star.bindTo('bounds', map);
  autocomplete_end.bindTo('bounds', map);

  console.log(google.maps.places.Autocomplete());

  // Evento que traza la ruta y obtiene información de lo ruta,
  let btnRoute = document.getElementById('trace-route');
  btnRoute.addEventListener('click', traceRoute);

  function traceRoute(e) {
    e.preventDefault();
    let request = {
      origin: originPoint.value,
      destination: destinationPoint.value,
      travelMode: 'DRIVING',
    }

    console.log(request);
    console.log(request.origin);
    console.log(request.destination);

    function callback(result, status) {

      if (status === 'OK') {
        directionsDisplay.setDirections(result);
        let distance = result.routes[0].legs[0].distance.value;
      } else {
        window.alert('No encontramos la ruta');
      }
    }

    directionsService.route(request, callback);
  }
}