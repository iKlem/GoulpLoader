/*
 *  DO NOT MODIFY THIS FILE UNLESS IF YOU KNOW WHAT ARE YOU DOING !!!
 *  This file is important for the script to work.
 *
 *  @author: iKlem <iklem.d@gmail.com>
 *  @version: 1.0
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
var progressbar = $('#loadBar'),
    max = percentage,	
    value = progressbar.val();
//Value for the interval clearing function.
var animationFunction = null;

/* DEBUG VALUES */
/* --- */

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
    isDownload = true;
    $("#stateLoad").html("Downloading " + fileName);
    $("#noBorder").attr("src", "./img/dl.png");
    $("#noBorder").attr("class", "NOPE");
    var test = fileName.split(" ");
    for (var i = 0; i<test.length; i++) {
        if(test[i] == "Workshop") {
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
    }
    var statusSTR = status.split(" ");
    for (var i = 0; i < statusSTR.length; i++) {
        if(statusSTR[i] == "Sending") {
            percentage = 100;
            animateFinal();
            $("#serverInfo").html(status + "<br><div id='spinner'></div>");
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

//Mise à jour des différents éléments présent dans la page
function RefreshFileBox() {
    if(percentage < 100) {
        percentage = Math.floor((100 / filesNeeded) * filesDL);
    }

    if(percentage <= 100 && percentage > 0 && percentage != value) {
        console.log("BAR++");
        animationFunction = setInterval(function() { animationBar(); }, 10);
    } else {
        console.log("CLEAR INTERVAL");
        clearInterval(animationFunction);
    }

    if(filesNeeded > 0) {
        if(percentage == 100) {
            $("#progressInfoWS").html("Done !");
        } else { 
            $("#progressInfo").html("Files donwloaded : " + filesDL + "<br>Files remaining : " + filesNeeded);
        }
    }
}

function animationBar() {
    if(percentage > value) {
        value += 1;
        addValue = progressbar.val(value);
    } else if (percentage >= 100) {
        $("#loadBar").animate({backgroundColor:"green", padding:"10px", borderWidth:"0px"}, 500, "easeOutExpo");
        percentage = percentage + 1;
        clearInterval(animationFunction);
    }
}

//Animate the panels when the message "Sending Clien Info" is sended.
function animateFinal() {
    $("header").animate({left:"-55%"}, 500, "easeOutExpo");

    $("#rules").animate({right:"-55%"}, 500, "easeOutExpo", function() {
        $(this).remove();
    });
    $("#serverBanner, #serverInfo").animate({right:"25%"}, 500, "easeOutExpo", function() {
        $("#serverBanner").animate({top:"15%"}, 500, "easeOutExpo");
        $("#serverInfo").animate({opacity:1, top:"45%"}, 500, "easeOutExpo");
    });

}