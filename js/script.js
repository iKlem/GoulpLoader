/*
*  DO NOT MODIFY THIS FILE UNLESS IF YOU KNOW WHAT ARE YOU DOING !!!
*  This file is important for the script to work.
*
*  @author: iKlem <iklem.d@gmail.com>
*  @version: 1.1
*/

//Number of files to download
var filesNeeded = 0;
//Number of total files
var filesTotal = 0;
//Number of files already downloaded or in download
var filesDL = 0;
//Boolean value to know if you're in a download
var isDownload = false;
//Percentage of the progress bar
var percentage = 0;
//Get the progress bar values and the element itself.
var progressbar = $('#loadBar-width'),
max = percentage,
value = 0;
//Value for the interval clearing function.
var animationFunction;
var isAnimate = false;


/* IMAGE SVG */
var dlFile = "<svg class='dlImg' xmlns='http://www.w3.org/2000/svg' width='90px' height='90px' viewBox='0 0 128 128'><path id='dlSVG' fill='black' stroke='black' stroke-width='1' d='M 110.00,116.00 C 110.00,116.00 110.00,124.00 110.00,124.00 110.00,124.00 20.00,124.00 20.00,124.00 20.00,124.00 20.00,116.00 20.00,116.00 20.00,116.00 110.00,116.00 110.00,116.00 Z M 83.00,3.00 C 83.00,3.00 83.00,65.00 83.00,65.00 83.00,65.00 110.00,65.00 110.00,65.00 110.00,65.00 97.63,78.88 97.63,78.88 97.63,78.88 76.63,99.88 76.63,99.88 76.63,99.88 64.88,111.13 64.88,111.13 64.88,111.13 53.13,99.63 53.13,99.63 53.13,99.63 32.38,79.00 32.38,79.00 32.38,79.00 20.00,65.00 20.00,65.00 20.00,65.00 47.00,65.00 47.00,65.00 47.00,65.00 47.00,3.00 47.00,3.00 47.00,3.00 83.00,3.00 83.00,3.00 Z' /></svg>"

/* DEBUG VALUES */
/* --- */

//Update of all elements in the page
function RefreshFileBox() {
  if(percentage < 100 || (filesDL == filesNeeded)) {
    percentage = Math.floor((100 / filesNeeded) * filesDL);
  }

  if(isAnimate) {
    animationFunction = setInterval(animationBar, 15);
  } else {
    clearInterval(animationFunction);
  }

  if(filesNeeded > 0) {
    if(percentage == 100 || (filesDL == filesNeeded)) {
      $("#progressInfoWS").html("Done !");
      $("#progressInfo").html("Files donwloaded : " + filesDL + "<br>Files remaining : " + filesNeeded);
    } else {
      $("#progressInfo").html("Files donwloaded : " + filesDL + "<br>Files remaining : " + filesNeeded);
    }
  }
}
//Animation when page is loaded.
$("body").ready(function() {
  $("body").animate({opacity: 1, marginTop: "0px"}, 500);
});
// Called when the number of files to download changes.
function SetFilesNeeded(needed) {
  filesNeeded = needed;
  RefreshFileBox();
}
// Called at the start, tells us how many files need to be downloaded in total.
function SetFilesTotal(total) {
  filesTotal = total;
  RefreshFileBox();
}
// Called when a file starts downloading. The filename includes the entire path of the file;
// for example "materials/models/bobsModels/car.mdl".
function DownloadingFile(fileName) {
  if(isDownload) {
    filesDL++;
    isDownload = false;
    isAnimate = true;
  }
  $("#loadBar-width").css({"visibility": "visible"});
  isDownload = true;
  $("#stateLoad").html("Downloading " + fileName);
  $("#imgLoad").html(dlFile);
  $("#noBorder").attr("class", "NOPE");
  var splitSTR = fileName.split(" ");
  for (var i = 0; i<splitSTR.length; i++) {
    if(splitSTR[i] == "Workshop") {
      $("#progressInfoWS").html("Download addon from Workshop...");
    } else {
      $("#progressInfoWS").html(" - - - ");
    }
  }
  RefreshFileBox();
}
// Called when something happens. This might be "Initialising Game Data", "Sending Client Info", etc.
function SetStatusChanged(status) {
  if(isDownload) {
    filesDL++;
    isDownload = false;
    isAnimate = true;
  }
  var statusSTR = status.split(" ");
  for (var i = 0; i < statusSTR.length; i++) {
    if(statusSTR[i] == "Sending") {
      percentage = 100;
      setTimeout(function() { animateFinal(); $("#serverInfo").html(status + "<br><div id='spinner'></div>"); }, 1000);
    }
  }
  $("#stateLoad").html(status);
  $("#noBorder").attr("src", "./img/gear.png");
  $("#noBorder").attr("class", "walk");
  RefreshFileBox();
}
// Called when the loading screen finishes loading all assets.
function GameDetails(servername, serverurl, mapname, maxplayers, steamid, gamemode) {
  $("#servName").html(servername);
  $("#gameMode").html(gamemode);
  $("#map").html(mapname);
  $("#serverBanner img").attr("alt", servername + " - IMAGE MISSING");
}
// Animate the progress of the Progress bar.
function animationBar() {
  if(percentage > value) {
    value += 1;
    progressbar.width(value+"%");
  } else if (percentage == 100) {
    $("#loadBar-width").animate({backgroundColor:"green"}, 500, "easeOutExpo");
  }
}
//Animate the panels when the message "Sending Clien Info" is sended.
function animateFinal() {
  $("header").animate({left:"-55%"}, 500, "easeOutExpo");
  $("#rules").animate({right:"-55%"}, 500, "easeOutExpo");
  $("#serverBanner, #serverInfo").animate({right:"25%"}, 500, "easeOutExpo", function() {
    $("#serverBanner").animate({top:"15%"}, 500, "easeOutExpo");
    $("#serverInfo").animate({opacity:1, top:"45%"}, 500, "easeOutExpo");
  });
  clearInterval(animationFunction);
}
