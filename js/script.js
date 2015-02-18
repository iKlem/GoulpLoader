/*
*  DON'T MODIFY THIS FILE UNLESS YOU KNOW WHAT YOU ARE DOING!
*  This file is important for the script to work.
*
*  @author: iKlem <iklem.d@gmail.com>
*  @version: 1.2.1
*/

//Number of files to download and counter of files remaining
var filesNeeded = filesRemaining = 0;
//Number of total files
var filesTotal = 0;
//Number of files already downloaded or currently in download
var filesDL = 0;
//Number of workshops files checked
var filesChecked = 0;
//Boolean value to know if you're in a download
var isDownload = false;
//Percentage of the progress bar
var percentage = 0;
//Get the progress bar values and the element itself.
var progressbar = $('#loadBar-width'),
max = percentage,
value = 0;
//Value for the interval clearing function
var animationFunction;
var isAnimate = false;

//Array of gamemodes names, "shorts" names will be changed into respective "Title" names.
var gamemodesShorts = ["terrortown", "prop_hunt", "elevator", "murder", "cinema"];
var gamemodesTitle = ["Trouble in Terrorist Town", "Prop Hunt", "Elevator: Source", "Murder", "Cinema"];

/* IMAGE SVGs */
var dlFile = "./img/dl.svg"
var theGear = "./img/gear.svg"

/* DEBUG VALUES */
/* --- */

//Update of all elements in the page
function RefreshFileBox() {
  if(percentage < 100 || ((filesDL + filesChecked) == filesNeeded)) {
    percentage = Math.floor((100 / filesNeeded) * (filesDL + filesChecked));
  }

  if(filesRemaining < 0) {
    filesRemaining = 0;
  }

  if(isAnimate) {
    animationFunction = setInterval(animationBar, 15);
  } else {
    clearInterval(animationFunction);
  }

  if(filesNeeded > 0) {
    if(percentage == 100 || ((filesDL + filesChecked) == filesNeeded)) {
      $("#progressInfoWS").html("Done !");
    }
  }
  $("#progressInfo").html("Files downloaded : " + filesDL + " | Files checked : " + filesChecked + "<br>Files to download/check : " + filesRemaining);
}
//Animation when page is loaded.
$("body").ready(function() {
  $("body").animate({opacity: 1, marginTop: "0px"}, 500);
});
// Called when the number of files to download changes.
function SetFilesNeeded(needed) {
  if(filesNeeded == 0)
    filesNeeded = filesRemaining = needed;
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
    filesRemaining--;
    isDownload = false;
    isAnimate = true;
  }
  isDownload = true;
  $("#stateLoad").html("Downloading " + fileName);
  $("#noBorder").attr("src", dlFile);
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
// Called when the load status changes. This might be "Initializing Game Data", "Sending Client Info", etc.
function SetStatusChanged(status) {
  var statusSTR = status.split(" ");
  for (var i = 0; i < statusSTR.length; i++) {
    if(statusSTR[i] == "Sending") {
      percentage = 100;
      setTimeout(function() { animateFinal(); $("#serverInfo").html("<div id='status'>" + status + "<br><div id='spinner'></div></div>"); }, 1000);
    } else if(statusSTR[i] == "Found") {
      filesChecked++;
      filesRemaining--;
      isAnimate= true;
    } else if(statusSTR[i] == "Extracting" || statusSTR[i] == "Extracted") {
      isDownload = false;
    }
  }

  if(isDownload) {
    filesDL++;
    filesRemaining--;
    isDownload = false;
    isAnimate = true;
  }

  $("#stateLoad").html(status);
  $("#noBorder").attr("src", theGear);
  $("#noBorder").attr("class", "walk");
  RefreshFileBox();
}
// Called when the loading screen finishes loading all assets.
function GameDetails(servername, serverurl, mapname, maxplayers, steamid, gamemode) {
  $("#servName").html(servername);
  for(index = 0; index < gamemodesShorts.length; index++) {
    if(gamemode == gamemodesShorts[index]) {
      $("#gameMode").html(gamemodesTitle[index]);
      $("#imgLeft").attr("src", "img/gamemodesIcons/" + gamemode + ".svg");
      break;
    } else {
      $("#gameMode").html(gamemode);
    }
  }
  $("#map").html(mapname);
  $("#serverBanner img").attr("alt", servername + " - IMAGE MISSING");
}
// Animate the progress of the progress bar.
function animationBar() {
  if(percentage > value) {
    value += 1;
    progressbar.css({"width":value+"%", "visibility":"visible"});
  } else if (percentage == 100) {
    $("#loadBar-width").animate({backgroundColor:"green"}, 500, "easeOutExpo");
  }
}
// Animate the panels when the message "Sending Client Info" is sent.
function animateFinal() {
  $("#leftPanel").animate({left:"-55%"}, 500, "easeOutExpo");
  $("#rules").animate({left:"175%"}, 500, "easeOutExpo");
  $("#rightPanel").animate({right:"25%"}, 500, "easeOutExpo", function() {
    $("#serverBanner").animate({top:"20px"}, 500, "easeOutExpo");
    $("#serverInfo").animate({opacity:"0.8", top:"50%"}, 500, "easeOutExpo");
  });
  clearInterval(animationFunction);
}
