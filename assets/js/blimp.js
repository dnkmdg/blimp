var countries = null;

vex.defaultOptions.className = 'vex-theme-default';
var geo_url = "https://rawgit.com/Pimentoso/GeoJSON-Attribute-Cleaner/master/geojson_output.json";
var mapboxTiles = L.tileLayer('http://api.tiles.mapbox.com/v4/foag.iop9pgcj/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZm9hZyIsImEiOiIzd3g1VVRVIn0.ycNwNVN7_cCtDOfr1sjvIg', {
    attribution: '<a href="http://www.mapbox.com/about/maps/" target="_blank">Terms &amp; Feedback</a>'
});

var group = new L.featureGroup;

var map = L.map('map')
    .addLayer(mapboxTiles)
    .setView([0,0], 1);

var map_style = {
  default: {
    "color": "#ff7800",
    "weight": 1,
    "opacity": 0.65
  },
  highlight: {
    "color": "#bada55",
    "weight": 1,
    "opacity": 0.65
  },
  success: {
    "color": "#00ff00",
    "weight": 1,
    "opacity": 0.65
  },
  fail: {
    "color": "#ff0000",
    "weight": 1,
    "opacity": 0.65
  }
};

function get_options(correct){
  var options = shuffle([getObjects(correct),getObjectsRand(correct),getObjectsRand(correct)]);
  var html = "";
  $.each(options, function(i,n){
    html += '<label><input type="radio" name="country" value="'+n.id+'"> '+n.properties.name+'</label><br>';
  });
  return html;
}

function clickFeature(e) {
  var layer = e.target;
  var correct = layer.feature.id;
  layer.setStyle(map_style.highlight);

  if(countries !== null){
    options = get_options(correct);
  }

  vex.dialog.open({
    message: '<strong>Country:</strong>',
    input: options,
    callback: function(data) {
      if (data === false) {
        layer.setStyle(map_style.default);
      } else{
        if(data.country == correct){
          layer.setStyle(map_style.success);
          $('.correct').text(parseInt($('.correct').text())+1);
        } else {
          layer.setStyle(map_style.fail);
        }
      }
    }
  });
}



function onEachFeature(feature, layer) {
  group.addLayer(layer);
  layer.on({click: clickFeature})
}

$.getJSON(geo_url, function(data) {
  countries = data;
  $('.total').text(countries.features.length);
  L.geoJson(data,{
    style: map_style.default,
    onEachFeature: onEachFeature,
  }).addTo(map);
  map.fitBounds(group.getBounds());
});

function getObjects(val) {
    var obj = countries.features;
    var match = null;
    for (var i in obj) {
      if(obj[i].id == val){
        match = obj[i];
      }
    }
    return match;
}

function shuffle(o){ //v1.0
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};

function getObjectsRand(val) {
    var obj = countries.features;
    var match = null;
    var rand = Math.floor(Math.random()*obj.length);

    if(obj[rand].id !== val){
      match = obj[rand];
    }

    return match;
}
