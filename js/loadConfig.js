/*
 *  This file load the config in the "config.json" file.
 *  DON'T MODIFY THIS FILE UNLESS YOU KNOW WHAT ARE YOU DOING
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
});
