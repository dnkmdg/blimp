/*
 * -------------------------------------------------------------------------------
 * "THE BEER-WARE LICENSE":
 * This code, and some of the associated files where written and put together
 * by @foag (Daniel Modig), daniel@ikoncept.se in 2014. If you like this code
 * and find it useful, feel free to use it any way you seem fit as long as this
 * notice is intact. I'm not to be held responsible for anything related to the 
 * usage of this code, and should we meet someday and you think the code is worth 
 * it to you, feel free to buy me a beer :) If you're on a budget a hug is good 
 * enough.
 * -------------------------------------------------------------------------------
 */

var countries_url = 'data/countries.json';
var maps_url = 'data/countries/#.geo.json';
var flag_url = 'data/countries/#.svg';

var stamenLayer = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.png', {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.'
});

var bordersWMS = L.tileLayer.wms("http://www.opengis.uab.cat/cgi-bin/world/MiraMon.cgi?", {
    layers: 'admin_level0-world',
    format: 'png',
    transparent: true
});

var group = new L.featureGroup;
var blimp = {
  active : false,
  answer : {
    bind : function(){
      $('body').on('submit','.answer-form',function(e){
        e.preventDefault();
        $('.big-skip').addClass("hidden");
        blimp.answer.is_match($("#answer-input").val());
      });
      $('body').on('click','.big-correct',function(e){
        e.preventDefault();
        blimp.reset();
      });
    },
    is_match : function(input){
      isMatch = false,
      input = input.toLowerCase(),
      results = blimp.country.prox.get(input);
      
      if(results){
        $.each(results,function(i,n){
          if(n[0] > 0.7) isMatch = true;
        });
      }
      
      if(!isMatch){ //Wrong answer
        $(".support-text").html('<h3 class="fail">'+blimp.data.random(blimp.data.dictionary.wrong_answer)+'</h3>');
      } else { //Correct answer!
        blimp.scoring.set();
        blimp.data.used.push(blimp.country.current);
        blimp.save();
        blimp.country.layer.setStyle(map_style.success);
        $(".support-text").html('<h3 class="success">'+blimp.data.random(blimp.data.dictionary.correct_answer)+'</h3>');
        $(".big-correct,.answer-form").toggleClass("hidden");
        $(".hints a").click();
        $(".big-correct").focus();
      }
    }
  },
  country : {
    layer : null,
    current : null,
    names : null,
    get : function(id){
      id = id || false;
      var c = null;
      if(!id){
        c = blimp.data.random(blimp.data.countries);
        while(blimp.data.used_short().indexOf(c.cca3) > -1){
          c = blimp.data.random(blimp.data.countries);          
        }
      } else {
        var obj = blimp.data.countries;
        for (var i in obj) {
          if(obj[i].cca3 == id){
            c = obj[i];
          }
        }
      }
      
      if(!id){
        blimp.country.current = c;
        blimp.country.geo(c.cca3);
        blimp.country.get_names();
      } else {
        return c;
      }
    },
    geo : function(id){
      var url = maps_url.replace("#",id);
      blimp.load(url ,function(d){
        blimp.country.current.geo = d;
        blimp.country.plot_to_map();
      },blimp.country.get);
    },
    plot_to_map : function(geo){
      try {
        blimp.country.layer = L.geoJson(blimp.country.current.geo,{
          style: map_style.highlight,
          //onEachFeature: onEachFeature,
        });
        map.addLayer(blimp.country.layer);
        map.fitBounds(blimp.country.layer.getBounds());
        blimp.loading(false);
      } catch(err){
        //console.log(err);
        blimp.start();
      }
    },
    get_names : function(){
      var country = blimp.country.current;
      var names = [];
      $.each(_i.flatten(country.name), function(i,n){
        names.push(n.toLowerCase());
      });
      $.each(_i.flatten(country.translations), function(i,n){
        names.push(n.toLowerCase());
      });
      
      blimp.country.current.names = names;
      blimp.country.prox = FuzzySet(names);
    }
    
  },
  data : {
    countries : null,
    used : [],
    used_s : [],
    dictionary: {
      adjectives: ['adaptable', 'adventurous', 'affable', 'affectionate', 'agreeable', 'ambitious', 'amiable', 'amicable', 'amusing', 'brave', 'bright', 'broad-minded', 'calm', 'careful', 'charming', 'communicative', 'compas