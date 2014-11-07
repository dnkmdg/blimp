<!doctype html>
<html>
  <head>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.css" />
    <link rel="stylesheet" href="assets/css/blimp.min.css" />
    <link href="//maxcdn.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css" rel="stylesheet">
    <script src="http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.js"></script>
    
    <title>Blimp</title>
  </head>
  <body>
    <div class="loading">
      <div class="cell">
        <h1 class="logo">blimp <small>BLIND MAPS FTW!</small></h1>
        <h2><i class="fa fa-circle-o-notch fa-spin"></i> <span>Very loading</span>...</h2>
        <div class="big-load hidden">
          Load previous game? <br>
          <a href="#" class="load-yes">Very yes!</a> <a href="#" class="load-no">Much no!</a>
        </div>
      </div>
    </div>
    <div class="header">
      <h1 class="logo">blimp <small>BLIND MAPS FTW!</small></h1>
      <h2 class="about"><a href="#">!?</a></h2>
      <h2 class="score">Score: <span class="points-ratio">0</span><!--<span class="points-total">0</span>/<span class="points-max">0</span>--></h2>
    </div>
    <div id="map"></div>
    <div class="control-panel">
      <div class="info hidden" style="text-align: center;">
        <img src="doge.jpeg" style="border-radius: 200px; max-width: 200px; margin: 0 auto;">
        <h2>About blimp</h2>
        <p>
          So far <strong>blimp</strong> is a proof-of-concept application, built as a christmas present for my girlfriend <b>chr</b>. She's absolutely nuts about blind maps. 
          Next for blimp is to make it to GitHub as a shared repository, and maybe get some further development in order to allow better gameplay. 
        </p>
        <p>
          For now the memory takes a hit when too many countries are involved (due to the detailed vectors), but hopefully I'll be able to sort it out. Other quirks to be solved are loading-indicators, saving, entering of name, share result, doge-graphics and so on.
        </p>
        <h3>Sources</h3>
        <p>
          Most of the actual data here comes from the astonishing <em>Mohammed Le Doze</em>'s repository <a href="https://mledoze.github.io/countries/">https://mledoze.github.io/countries/</a>. The map is built with <a href="http://leafletjs.com">Leaflet</a> with amazing tiles from <a href="http://mapbox.com">mapbox.com</a> and the new approximative spellchecking is straightly from <a href="http://glench.github.com/fuzzyset.js/">fuzzyset.js</a>-repository.
        </p>
        <p>
          /foag (<a href="mailto:daniel@ikoncept.se">daniel@ikoncept.se</a>)
        </p>
      </div>
      <div class="question">
        <h2><a href="#" class="re-center"><i class="fa fa-map-marker"></i></a> What country is it? <a href="#" class="big-skip">Skip >></a></h2>
        <fieldset>
          <div class="points">
            <form action="" method="post" class="answer-form">
              <label for="answer-input"><strong>For <span class="points-text">a full 10</span> points, write the english name:</strong></label>
              <input type="text" id="answer-input" name="answer-input" placeholder="Want those 10, yes?"><button type="submit">Go!</button>
            </form>
            <p class="support-text"></p> 
            <button class="big-correct hidden">Next plz! >></button>
          </div>
          
          <div class="hints">
            <ul class="hint-list list-unstyled">
              <li class="flag"><a href="#" data-fn="show_flag" data-value="6" data-text="mere 6"><span class="badge">-4 points</span> Show flag</a></li>
              <li class="capital"><a href="#" data-fn="show_capital" data-value="4" data-text="slightly awkward 4"><span class="badge">-6 points</span> Show capital</a></li>
              <li class="options"><a href="#" data-fn="show_options" data-value="2" data-text="much disappoint 2"><span class="badge">-8 points</span> Show neighbours</a></li>
              <li><a href="#" data-fn="show_all" data-value="0" data-text="BIG 0"><span class="badge">-10 points</span> I give up, what's the answer?</a></li>
            </ul>
          </div>
          
        </fieldset>
      </div>
    </div>
    <script src="http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.js"></script>
    <script src="https://code.jquery.com/jquery-2.1.1.min.js"></script>
    <script src="assets/js/simpleStorage.js"></script>
    <script src="assets/js/fuzzyset.js"></script>
    <?php if(isset($_GET['isDaniel'])): ?>
    <script src="assets/js/blimp.0.1.js"></script>
    <?php else: ?>
    <script src="assets/js/blimp.0.1.js"></script>
    <?php endif; ?>
    <script>
      $(document).ready(function(){

      });
    </script>
  </body>
</html>
<!--
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
-->