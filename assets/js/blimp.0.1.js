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

var mapboxTiles = L.tileLayer('http://api.tiles.mapbox.com/v4/foag.iop9pgcj/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZm9hZyIsImEiOiIzd3g1VVRVIn0.ycNwNVN7_cCtDOfr1sjvIg', {
    attribution: '<a href="http://www.mapbox.com/about/maps/" target="_blank">Terms &amp; Feedback</a>'
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
          if(n[0] > 0.8) isMatch = true;
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
          style: map_style.default,
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
    dictionary: {
      adjectives: ['adaptable', 'adventurous', 'affable', 'affectionate', 'agreeable', 'ambitious', 'amiable', 'amicable', 'amusing', 'brave', 'bright', 'broad-minded', 'calm', 'careful', 'charming', 'communicative', 'compassionate', 'conscientious', 'considerate', 'convivial', 'courageous', 'courteous', 'creative', 'decisive', 'determined', 'diligent', 'diplomatic', 'discreet', 'dynamic', 'easygoing', 'emotional', 'energetic', 'enthusiastic', 'exuberant', 'fair-minded', 'faithful', 'fearless', 'forceful', 'frank', 'friendly', 'funny', 'generous', 'gentle', 'good', 'gregarious', 'hard-working', 'helpful', 'honest', 'humorous', 'imaginative', 'impartial', 'independent', 'intellectual', 'intelligent', 'intuitive', 'inventive', 'kind', 'loving', 'loyal', 'modest', 'neat', 'nice', 'optimistic', 'passionate', 'patient', 'persistent', 'pioneering', 'philosophical', 'placid', 'plucky', 'polite', 'powerful', 'practical', 'pro-active', 'quick-witted', 'quiet', 'rational', 'reliable', 'reserved', 'resourceful', 'romantic', 'self-confident', 'self-disciplined', 'sensible', 'sensitive', 'shy', 'sincere', 'sociable', 'straightforward', 'sympathetic', 'thoughtful', 'tidy', 'tough', 'unassuming', 'understanding', 'versatile', 'warmhearted', 'willing', 'witty'],
      adjectives_heroic : ['bold', 'courageous', 'dauntless', 'doughty', 'fearless', 'gallant', 'greathearted', 'gutsy', 'gutty', 'brave', 'heroical', 'intrepid', 'lionhearted', 'manful', 'stalwart', 'stout', 'stouthearted', 'undaunted', 'valiant', 'valorous'],
      verb_live : ['resides','abides', 'dwells', 'lives'],
      wrong_answer : ["Sorry, I meant the REAL name..","Really, you think THAT's the name?","HAHA. No.","Say what?","Did you ever go to school?","My dog knows the right answer, why don't you?","Have you met Mr. Wrong?","For realz?","That's ridiculous","Are you even trying?"],
      correct_answer : ["Yay!","Correctamundo!","Right you are, my dear Watson!","How did you.. Wait a minute.. Alright, have your points..","Spot on!","Are you cheating?","For realz!","Indeed it is!","You're right!","Much right, very success!"]
    },
    random : function(obj,len,not){
      len = len || 1;
      not = not || [];
      not = (not instanceof Array ? not : [not]);
      
      var ret = [];
      for(i = 0; i < len; i++){
        var ran = obj[Math.floor(Math.random()*obj.length)];
        while(not.indexOf(ran) > -1 && ret.indexOf(ran) > -1){
          ran = (obj[Math.floor(Math.random()*obj.length)]); 
        } 
        ret.push(ran);
      }
      return (ret.length == 1 ? ret[0] : ret);
    },
    used_short : function(){
      var used = [];
      $.each(this.used,function(i,n){
        used.push(n.cca3);
      });
      return used;
    },
    hint_model : null,
    set_used : function(countries){
      $.each(countries,function(i,n){
        console.log(n);
        blimp.data.used.push(blimp.country.get(n));
        blimp.country.geo(n);
      });
    }
  },
  hints : {
    bind : function(){
      $("body").on("click",".hints a",function(e){
        blimp.scoring.set_current($(e.currentTarget).attr('data-value'));
        $(e.currentTarget).parent().addClass('hint-used');
        blimp.hints.fn[$(e.currentTarget).attr('data-fn')](e);
        $('.big-skip').addClass("hidden");
        $(".points-text").text($(e.currentTarget).attr('data-text'));
        return false;
      });
    },
    fn : {
      show_flag : function(e){
        $(e.currentTarget).parent().html('<img class="flag" src="'+flag_url.replace("#",blimp.country.current.cca3)+'">');
      },
      show_capital : function(e){
        $(e.currentTarget).parent().html('The capital is <strong>'+blimp.country.current.capital+'</strong>.');
      },
      show_options : function(e){
        var html = 'This country borders to:<ul class="list-unstyled">';
        if(blimp.country.current.borders.length > 0){
          $.each(blimp.country.current.borders,function(i,n){
            var neighbour = blimp.country.get(n);
            html += "<li><strong>" + neighbour.name.common + "</strong></li>";
          });
        } else {
          var html = 'This country is sadly forever alone :(.<br> It has the awesome TLD <strong><em>'+blimp.country.current.tld+'</strong></em>.';
        }
        $(e.currentTarget).parent().html(html);
      },
      show_all : function(e){
        var ad1,adh1,translations = "";
        ad1 = blimp.data.random(blimp.data.dictionary.adjectives);
        adh1 = blimp.data.random(blimp.data.dictionary.adjectives_heroic,3);
        $.each(blimp.country.current.translations,function(i,n){
          translations += n+', ';
        });
        translations = translations.replace(/,\s*$/, "");
        var html = '<h2><span class="thin">This of course, is the '+ad1 +' country of</span> '+blimp.country.current.name.common+' <span class="thin">where the '+adh1[0]+', '+adh1[1]+' and '+adh1[2]+' '+blimp.country.current.demonym+'s '+blimp.data.random(blimp.data.dictionary.verb_live)+'!<br><br><small>When traveling, you might hear other names, such as <code>'+translations+'</code></small>';
        $(e.currentTarget).parent().html(html);        
      },
    }
  },
  init : function(){
    blimp.hints.bind();
    blimp.answer.bind();
    blimp.nav();
    blimp.data.hint_model = $('.hint-list').html();
    blimp.load(countries_url,function(d){
      blimp.loading("Wow, such data crunch");
      blimp.data.countries = d;
      blimp.poll();
    });
  },
  loading : function(input){
    if(input === false){
      $(".loading").fadeOut(100);
    } else {
      $(".loading h2 span").text(input);
      $(".loading").fadeIn(100);
    }
  },
  load : function(url, callback, failback){
    failback = failback || function(jqXHR, textStatus, errorThrown){console.log("error " + textStatus)};
    $.getJSON(url, function(){})
      .success(callback)
      .error(failback);
  },
  load_saved :{
    has : function(){
      if (simpleStorage.canUse()) {
        data = simpleStorage.get("blimp");
        return data;
      }
    },
    load : function(){
      if (simpleStorage.canUse()) {
        data = simpleStorage.get("blimp");
        blimp.scoring.total = data.score[0];
        blimp.scoring.questions = data.score[1];
        blimp.data.set_used(data.used);
      }
    }
  }, 
  nav : function(){
    $('.about a').click(function(e){
      e.preventDefault();
      $(".question,.info").toggleClass("hidden");
      $(this).toggleClass("active");
    });
    $('.re-center').click(function(e){
      e.preventDefault();
      map.fitBounds(blimp.country.layer.getBounds());
    });
    $('.big-skip').click(function(e){
      e.preventDefault();
      map.removeLayer(blimp.country.layer);
      blimp.start();
    });
    $('.load-no').click(function(e){
      e.preventDefault();
      blimp.start();
      blimp.loading(false);
    });
    $('.load-yes').click(function(e){
      e.preventDefault();
      //blimp.load_saved.load();
    });
  },
  poll : function(){
    /*var data = blimp.load_saved.has();
    if(data === undefined){*/
      blimp.start();
      blimp.loading(false);      
    /*} else {
      $('.loading h2, .loading .big-load').toggleClass("hidden");
    }*/
  },
  reset: function(){
    $(".answer-form").trigger("reset");
    $(".big-correct,.answer-form").toggleClass("hidden");
    $(".support-text").html('');
    $(".points-text").html("a full 10");
    $('.hint-list').html(blimp.data.hint_model);
    $('.big-skip').removeClass("hidden");
    blimp.scoring.current = 10;
    blimp.start();
  },
  save: function(){
    if (simpleStorage.canUse()) {  
      var save = {
        score : [blimp.scoring.total,blimp.scoring.questions],
        used : blimp.data.used_short()
      }
      simpleStorage.set("blimp",save);     
    }
  },
  scoring : {
    total :0,
    max : 0,
    current:10,
    ratio: 0,
    questions : 0,
    set_current: function(score){
      if(this.current > parseInt(score)) this.current = parseInt(score);
    },
    set: function(){
      this.questions += 1;
      this.max = 10*this.questions;
      this.total = this.total + this.current;
      
      $('.points-ratio').text(this.total * 1000);
      $('.points-total').text(this.total);
      $('.points-max').text(this.max);
    }
  },
  start : function(){
    this.country.get();
  }
}
var map = L.map('map')
    .addLayer(mapboxTiles)
    .addLayer(bordersWMS)
    .on('load',function(){
      blimp.init();
    })
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

_i = {
  flatten : function(o) {
    var prefix = arguments[1] || "", out = arguments[2] || {}, name;
    for (name in o) {
      if (o.hasOwnProperty(name)) {
        typeof o[name] === "object" ? _i.flatten(o[name], prefix + name + '.', out) : 
                                      out[prefix + name] = o[name];
      }
    }
    return out;
  }
}