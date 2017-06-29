var countries_url = 'data/countries.json';
var maps_url = 'data/countries/#.geo.json';
var flag_url = 'data/countries/#.svg';


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

var blimp = {
  init : function(){
    blimp.hints.bind();
    blimp.answer.bind();
    blimp.data.hint_model = $('.hint-list').html();
    blimp.load(countries_url,function(d){
      blimp.data.countries = d;
      blimp.start();
    });
  },
  reset: function(){
    $(".answer-form").trigger("reset");
    $(".big-correct,.answer-form").toggleClass("hidden");
    $(".support-text").html('');
    $(".points-text").html("a full 10");
    $('.hint-list').html(blimp.data.hint_model);
    blimp.scoring.current = 10;
    blimp.start();
  },
  start : function(){
    this.country.get();
  },
  data : {
    countries : null,
    used : [],
    dictionary: {
      adjectives: ['adaptable', 'adventurous', 'affable', 'affectionate', 'agreeable', 'ambitious', 'amiable', 'amicable', 'amusing', 'brave', 'bright', 'broad-minded', 'calm', 'care