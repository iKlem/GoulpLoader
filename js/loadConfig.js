/*
*  This file loads the config in the "config.json" file.
*  DON'T MODIFY THIS FILE UNLESS YOU KNOW WHAT YOU ARE DOING!
*
*  @author: iKlem <iklem.d@gmail.com>
*  @version: 1.0.1
*/

$.getJSON('./config.json', function (data) {
  $("title").append(data.server.name);
  $("#serverBanner img").attr("src", data.server.banner);
  $("#serverBanner img").attr("alt", data.server.banner);
  for(var i = 0; i < data.rules.length; i++) {
    $("#rules p").append(data.rules[i].line + "<br>");
  }

  //SlideShow Plugin
  var slideshow = data.plugins.slideshow;
  if(slideshow.active) {
    for(var i = 0; i < slideshow.image.length; i++) {
      $(".rslides").append("<li><img src='" + slideshow.image[i] +"' /></li>")
    }
  }

  //Music Plugin
  var music = data.plugins.music;
  if(music.active) {
    if(music.title != "") {
      $("#musicTitle").append(music.title);
    } else {
      $("#musicContainer").css("background-color", "transparent");
    }
    $("#musicPlayer").attr("src", music.file);
    musicPlayer.volume = music.volume;
    musicPlayer.play();
  } else {
    $("#musicContainer").css("background-color", "transparent");
  }

  //Slideshow using ResponsiveSlides
  $(".rslides").responsiveSlides({
    auto: true,
    speed: slideshow.speed,
    timeout: slideshow.time,
    random: slideshow.random
  });
});
