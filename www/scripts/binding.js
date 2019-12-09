

//------------Dynamic Error Poup----------//
function BinderrorPopup(pageId) {

    if ($("#" + pageId + "errorPopup").length > 0) {
        $("#" + pageId + "errorPopup").remove();
    }
    /*$(document).on('click', '#create', function(){     
    $('<div>').attr({'data-role':'popup','id':'popupBasic','data-dismissible':'false',
    'data-theme':'a','data-transition':'pop'}).appendTo('[data-role="content"]');
    $('<div>').attr({'data-role':'header','data-theme':'b','id':'popup-header'}).*/


    /*var popupdiv = document.createElement('div');
    alert(popupdiv);
    popupdiv.setAttribute('id', pageId + 'errorPopup');
    popupdiv.setAttribute('data-role', 'popup');
    popupdiv.setAttribute('data-dismissible', 'false');
    popupdiv.setAttribute('data-overlay-theme', 'a');
    popupdiv.setAttribute('data-theme', 'c');
    popupdiv.setAttribute('style', 'width: 300px');
    popupdiv.setAttribute('data-transition', 'pop');
    //class="ui-popup ui-body-a ui-overlay-shadow ui-corner-all" aria-disabled="false"
    //popupdiv.addClass('ui-popup');
    //popupdiv.addClass('ui-body-a');
    var contentDiv = document.createElement('div');
    contentDiv.setAttribute('data-role', 'content');
    ////contentDiv.innerHTML = "<h4 style='text-align:center'>Alert</h4>";
    var errortext = document.createElement('div');
    errortext.setAttribute('style', 'text-align:center');
    errortext.setAttribute('id', pageId + 'errortext');
    contentDiv.appendChild(errortext);

    var errorcloseBtn = document.createElement('a');
    errorcloseBtn.setAttribute('id', 'errorcloseBtn');
    errorcloseBtn.setAttribute('data-role', 'button');
    errorcloseBtn.setAttribute('data-theme', 'b');
    //errorcloseBtn.setAttribute('href', 'javascript:closeError()');
    errorcloseBtn.setAttribute('href', '#');
    errorcloseBtn.innerHTML = "OK";
    contentDiv.appendChild(errorcloseBtn);

    popupdiv.appendChild(contentDiv);
    $('#' + pageId).find('[data-role=content]').append(popupdiv);*/
    setTimeout(function () {
        $("#errorPopup").popup("open");
    }, 1000);
}

function touchHandler(event) {
    var touches = event.changedTouches,
               first = touches[0],
               type = "";
    switch (event.type) {
        case "touchstart": type = "mousedown"; break;
        case "touchmove": type = "mousemove"; break;
        case "touchend": type = "mouseup"; break;
        default: return;
    }
    var simulatedEvent = document.createEvent("MouseEvent");
    simulatedEvent.initMouseEvent(type, true, true, window, 1,
                                      first.screenX, first.screenY,
                                      first.clientX, first.clientY, false,
                                      false, false, false, 0/*left*/, null);

    first.target.dispatchEvent(simulatedEvent);
    event.preventDefault();
}

function closeErrors() {
    $("#errorPopup").popup("close");
    $("#ErrorMsg").html('');
}


function showError(errorMessage, callback) {
    var pageID = $.mobile.activePage.attr('id');
    if (pageID == 'splash') {
        $("#splashErrorMsg").html('');
        $("#splashErrorMsg").append(errorMessage);
        $("#splashErrorMsg").append('<a href="#" class="ui-btn" onclick="closeSplashError();">Close</a>');
        setTimeout(function () {
            $("#splashErrorPopup").popup("open");
        }, 2000);
    }
    else {
        $("#errorMsg").html('');
        $("#errorMsg").append(errorMessage);
        $("#errorMsg").append('<a href="#" class="ui-btn" onclick="closeErrors();">OK</a>');
        setTimeout(function () {
            $("#errorPopup").popup("open");
        }, 2000);
    }

    //document.getElementById(pageID + "errorPopup-screen").on("touchstart", touchHandler, false);
    /*$("#LoginerrorPopup-screen").on("touchstart", touchHandler, false);
    $("#LoginerrorPopup-screen").on("touchmove", touchHandler, false);
    $("#LoginerrorPopup-screen").on("touchend", touchHandler, false);
    $("#LoginerrorPopup-screen").on("touchcancel", touchHandler, false);
    $("#LoginerrorPopup-screen").on("touchmove", touchHandler, false);
    /*document.getElementById(pageID + "errorPopup-screen").on("touchmove", touchHandler, false);
    document.getElementById(pageID + "errorPopup-screen").on("touchend", touchHandler, false);
    document.getElementById(pageID + "errorPopup-screen").on("touchcancel", touchHandler, false);
    document.getElementById(pageID + "errorPopup-popup").on("touchmove", touchHandler, false);*/

    //$("#" + pageID).find("#errorcloseBtn").attr('onclick', 'closeError(' + callback + ')');
}

function showConfirmation(ConfirmationMessage, PrimaryConfirmText, SecondaryConfirmText, callback) {
    var pageID = $.mobile.activePage.attr('id');
    document.getElementById(pageID + "ConfirmationText").innerHTML = ConfirmationMessage;
    $("#" + pageID + 'confirmYesButton .ui-btn-inner .ui-btn-text').text(PrimaryConfirmText);
    $("#" + pageID + 'confirmNoButton .ui-btn-inner .ui-btn-text').text(SecondaryConfirmText);
    $("#" + pageID + 'confirmYesButton').attr('onclick', 'closeConfirmation(true, ' + callback + ')');
    $("#" + pageID + 'confirmNoButton').attr('onclick', 'closeConfirmation(false, ' + callback + ')');
    $("#" + pageID + "ConfirmationPopup").popup("open");
    document.getElementById(pageID + "ConfirmationPopup-screen").addEventListener("touchstart", touchHandler, false);
    document.getElementById(pageID + "ConfirmationPopup-screen").addEventListener("touchmove", touchHandler, false);
    document.getElementById(pageID + "ConfirmationPopup-screen").addEventListener("touchend", touchHandler, false);
    document.getElementById(pageID + "ConfirmationPopup-screen").addEventListener("touchcancel", touchHandler, false);
    document.getElementById(pageID + "ConfirmationPopup-popup").addEventListener("touchmove", touchHandler, false);
}

function closeError(callback) {
    var pageID = $.mobile.activePage.attr('id');
    $("#" + pageID + "errorPopup").popup("close");

    setTimeout(function () {
        if (callback != null) {
            callback();
        }
    }, 500);
}

function closeConfirmation(value, callback) {
    var pageID = $.mobile.activePage.attr('id');
    $("#" + pageID + "ConfirmationPopup").popup("close");

    setTimeout(function () {
        if (callback != null) {
            callback(value);
        }
    }, 500);
}

//------Function to Dynamically bind the Loading Popup in all the screens------//
function popupBinding(pageId) {
    if ($("#" + pageId + "loadingPopup").length > 0) {
        $("#" + pageId + "loadingPopup").remove();
    }
    var popupdiv = document.createElement('div');
    popupdiv.setAttribute('id', pageId + 'loadingPopup');
    popupdiv.setAttribute('data-role', 'popup');
    popupdiv.setAttribute('data-dismissible', 'false');
    popupdiv.setAttribute('data-overlay-theme', 'a');
    popupdiv.setAttribute('style', 'padding-left: 10px; padding-right: 10px;');

    var h1tag = document.createElement('h1');
    h1tag.innerHTML = "Loading...";
    popupdiv.appendChild(h1tag);

    $("#" + pageId).find('[data-role=content]').append(popupdiv);
}

//------Function to Dynamically bind the synchronizing Popup in all the screens------//
function synchronizBinding(pageId) {
    if ($("#" + pageId + "synchronizingPopup").length > 0) {
        $("#" + pageId + "synchronizingPopup").remove();
    }
    var popupdiv = document.createElement('div');
    popupdiv.setAttribute('id', pageId + 'synchronizingPopup');
    popupdiv.setAttribute('data-role', 'popup');
    popupdiv.setAttribute('data-dismissible', 'false');
    popupdiv.setAttribute('data-overlay-theme', 'a');
    popupdiv.setAttribute('style', 'padding-left: 10px; padding-right: 10px;');

    var h1tag = document.createElement('h1');
    h1tag.innerHTML = "synchronizing...";
    popupdiv.appendChild(h1tag);

    $("#" + pageId).find('[data-role=content]').append(popupdiv);
}

function showLoading() {
    var pageID = $.mobile.activePage.attr('id');
    $("#" + pageID + "loadingPopup").popup("open");
}

function closeLoading() {
    var pageID = $.mobile.activePage.attr('id');
    $("#" + pageID + "loadingPopup").popup("close");
}


function showsynchronizing() {
    var pageID = $.mobile.activePage.attr('id');
    $("#" + pageID + "synchronizingPopup").popup("open");
    //    setTimeout(function () {
    //        if ($(".ui-page-active #DashBoardsynchronizingPopup-popup").hasClass('ui-popup-active')) {
    //            var set = 'sync';
    //            forcePopupClose(set);
    //        }
    //    }, parseInt(syncTime));
}

function closesynchronizing() {
    var pageID = $.mobile.activePage.attr('id');
    $("#" + pageID + "synchronizingPopup").popup("close");
}


