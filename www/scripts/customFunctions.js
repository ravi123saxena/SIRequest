//This method is used to validate the data sent via AJAX.
$.postJSON = function (url, data, func, errorFunc) {
    var Logurl = url;
    var currentRequest = new Object();
    currentRequest.URL = url;
    currentRequest.Data = data;
    currentRequest.Func = func;
    currentRequest.Request = $.ajax(
        {
            url: url,
            type: "post",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            processData: true,
            data: JSON.stringify(data),
            success: function (result, textStatus, jqXHR) {

                RemoveRequest(jqXHR.ID);
                if (result[0] == "(" && result[result.length - 1] == ")") {
                    result = result.substring(1, result.length - 1);

                }

                result = IsStringNullOrEmpty(result) ? result : parseJson(result);
                func(result);
            },
            error: function (data) {
                hideImage();
                if (!IsStringNullOrEmpty(data.responseText)) {
                    var responseText = JSON.parse(data.responseText);
                    var errorMessage = IsStringNullOrEmpty(responseText["ErrorDetails"]) ? '' : responseText["ErrorDetails"];
                    if (errorMessage != '') {
                        showErrorPopUp(true, errorMessage, errorMessage);
                    }
                    else {
                        showErrorPopUp(true, getCommonTranslatedValue("ArguementNullException"), '');
                    }
                } else {
                    if (errorFunc) {
                        errorFunc();
                    } else {
                        showErrorPopUp(true, getCommonTranslatedValue("ArguementNullException"), '');
                    }

                }
                return;
            }
        });
    currentRequest.Request.ID = GenerateGuid();
    ajaxCalls.push(currentRequest);
};

/**
* To handle special characters in the json string.
*/
function parseJson(value) {
    value = value.replace(/\\n/g, "\\n")
        .replace(/\\'/g, "\\'")
        .replace(/\\"/g, '\\"')
        .replace(/\\&/g, "\\&")
        .replace(/\\r/g, "\\r")
        .replace(/\\t/g, "\\t")
        .replace(/\\b/g, "\\b")
        .replace(/\\f/g, "\\f");

    // remove non-printable and other non-valid JSON chars
    value = value.replace(/[\u0000-\u0019]+/g, "");
    var res = JSON.parse(value);
    return res;
}

//This method is used to validate the data sent via AJAX in Splash screen.
$.postJSONSplash = function (url, data, func) {
        var Logurl = url;
        var currentRequest = new Object();
        currentRequest.URL = url;
        currentRequest.Data = data;
        currentRequest.Func = func;
        currentRequest.Request = $.ajax(
            {
                url: url,
                type: "post",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                processData: true,
                data: JSON.stringify(data),
                success: function (result, textStatus, jqXHR) {
                    RemoveRequest(jqXHR.ID);
                    if (result[0] == "(" && result[result.length - 1] == ")") {
                        result = result.substring(1, result.length - 1);

                    }
                    result = JSON.parse(result);
                    func(result);
                },
                error: function (data) {
                    hideImage();
                    var responseText = (data || data != "") ? JSON.parse(data.responseText) : "";
                    var errorMessage = "";
                    if (responseText != "") {
                        errorMessage = responseText["ErrorDetails"];
                    }
                    if (errorMessage != '') {
                        if (!isNaN(errorMessage.substr(0, 1))) {
                            var item = errorMessage.substr(0, 1);
                            setLocal("LoginAttempts", item);
                            showErrorPopUpSplash(true, errorMessage, errorMessage);
                        }
                        else {
                            showErrorPopUpSplash(true, errorMessage, errorMessage);
                        }
                    }
                    else {
                        showErrorPopUpSplash(true, getCommonTranslatedValue("ArguementNullException"), '');
                    }
                    return;
                }

            });
        currentRequest.Request.ID = GenerateGuid();
        ajaxCalls.push(currentRequest);
};

//This method is used to validate the login authentication.
function login(loginURL, myJSONobject, DatabaseConnection) {
    if (navigator.onLine) {
        $.postJSONSplash(loginURL, myJSONobject, function (data) {
            loginResponse = data;
            if (data.Authentic == 5) {
                setLocal("logoutFlag", "0");
                localStorage.setItem("dbId", data.DatabaseID);
                localStorage.setItem("Username", encryptStr(data.CallerName));
                localStorage.setItem("Password", encryptStr(data.Password));
                localStorage.setItem("passwordText", encryptStr($("#PasswordTextBox").val()));
                localStorage.setItem("EmployeeNumber", IsStringNullOrEmpty(data.EmployeeNumber) ? 0 : data.EmployeeNumber);
                localStorage.setItem("seq", data.Seq);
                localStorage.setItem("CallerTypeSeq", data.CallerTypeSeq);
                localStorage.setItem("CustomerNumber", data.CustomerNumber);
                localStorage.setItem("CustomerSiteNumber", data.CustomerSiteNumber);
                localStorage.setItem("EmailAddress", encryptStr(data.EmailAddress));
                localStorage.setItem("FaxPhone", data.FaxPhone);
                localStorage.setItem("PhoneNumber", data.PhoneNumber);
                localStorage.setItem("SitePhone", data.SitePhone);
                localStorage.setItem("CallerCompany", data.Company);
                localStorage.setItem("TypeOfCaller", data.TypeOfCaller);
                localStorage.setItem("BusinessValue", data.Business);
                localStorage.setItem("SubBusiness", data.SubBusiness);
                localStorage.setItem("BusinessGroup", data.BusinessGroup);
                localStorage.setItem("FilterSeq", data.FilterSeq);
                if (!IsStringNullOrEmpty(data.Location)) {
                    localStorage.setItem("LocationDetail", data.Location);
                }
                else {
                    localStorage.setItem("LocationDetail", '');
                }

                localStorage.setItem("EditProfileFromWeb", data.EditProfileFromWeb);
                //localStorage.setItem("CustomerNumber", data.CustomerNumber);
                //localStorage.setItem("CustomerSiteNumber", data.CustomerSiteNumber);
                localStorage.setItem("Company", data.Company);
                localStorage.setItem("CostCenter", data.CostCenter);
                localStorage.setItem("CostCenterProfile", data.CostCenter);
                
                //localStorage.setItem("passwordEncrpt", encodePlain(data.Password));
                //localStorage.setItem("passwordText", $("#PasswordTextBox").val());
                //localStorage.setItem("passwordText", encodePlain($("#PasswordTextBox").val()));
                localStorage.setItem("EditProfileFromWeb", data.EditProfileFromWeb);
                setLocal("LoginAttempts", "");
                setLocal("LoginUsageIndex", data.LoginUsageIndex);
                setLocal("ProfileNotesForEditProf", data.Notes);
                setLocal("NotifyUser", data.NotifyUser);
                setLocal("NoOfDays", data.NoOfDays);
                profileNote = '';
                setLocal("SessionId", encryptStr(data.SessionId));

                if (decryptStr(getLocal("MSIClientCode")) === "IO" && getLocal("Language") === "fr-FR") {
                    getTranslations("FrenchIO");
                }

                FetchWorkOrderDetail(5);

                if ($('#rememberMe').is(':checked')) {
                    openDB();
                    dB.transaction(createRecords, errorCB, successCB);
                }
                $.mobile.loading('show', {
                    text: 'Loading',
                    textVisible: true,
                    theme: 'b',
                    textonly: false,
                    html: ""
                });
                loadMenu();
                getSiteLabels("Main");
                //$.mobile.changePage("quickLinks.html");
                setLocal("PreviousPage", null);
                getLocationAddress(GetQuickLinkDetails);
            }
            else if (data.Authentic == 4) {
                localStorage.setItem("Username", encryptStr(data.CallerName));
                localStorage.setItem("EmailAddress", encryptStr(data.EmailAddress));
                localStorage.setItem("seq", data.Seq);
                localStorage.setItem("EmployeeNumber", IsStringNullOrEmpty(data.EmployeeNumber) ? 0 : data.EmployeeNumber);
                localStorage.setItem("passwordText", encryptStr($("#PasswordTextBox").val()));
                localStorage.setItem("FromIndexPage", "true");
                localStorage.setItem("NotifyUser", data.NotifyUser);
                localStorage.setItem("SessionId", encryptStr(data.SessionId));
                $.mobile.changePage("changePassword.html");
            }
            else {
                setLocal("rememberMe", "0");
                $.mobile.loading("hide");
                showErrorPopUpSplash(true, data.Message, "");
                $('#UserNameTextBox').val('');
                $('#PasswordTextBox').val('');
            }
        });
    }
    else {

        setTimeout(function () {
            showErrorPopUp(true, noNetworkTranslation);
        }, 1000);
    }
}

//This method is used to validate the SSO login authentication.
function loginSSO(loginURL, myJSONobject) {
    if (navigator.onLine) {
        $.postJSONSplash(loginURL, myJSONobject, function (data) {
            var loginMessage = data.Valid.split(';');
            if (loginMessage[0].toLowerCase() === "valid") {
                localStorage.setItem("dbId", data.DatabaseID);
                localStorage.setItem("Username", encryptStr(data.CallerName));
                //                localStorage.setItem("Password", encryptStr(data.Password));
                //localStorage.setItem("passwordText", encryptStr($("#PasswordTextBox").val()));
                localStorage.setItem("EmployeeNumber", IsStringNullOrEmpty(data.EmployeeNumber) ? 0 : data.EmployeeNumber);
                localStorage.setItem("seq", data.Seq);
                localStorage.setItem("CallerTypeSeq", data.CallerTypeSeq);
                localStorage.setItem("CustomerNumber", data.CustomerNumber);
                localStorage.setItem("CustomerSiteNumber", data.CustomerSiteNumber);
                localStorage.setItem("EmailAddress", encryptStr(data.EmailAddress));
                localStorage.setItem("FaxPhone", data.FaxPhone);
                localStorage.setItem("PhoneNumber", data.PhoneNumber);
                localStorage.setItem("SitePhone", data.SitePhone);
                localStorage.setItem("CallerCompany", data.Company);
                localStorage.setItem("TypeOfCaller", data.TypeOfCaller);
                localStorage.setItem("BusinessValue", data.Business);
                localStorage.setItem("SubBusiness", data.SubBusiness);
                localStorage.setItem("BusinessGroup", data.BusinessGroup);
                if (!IsStringNullOrEmpty(data.Location)) {
                    localStorage.setItem("LocationDetail", data.Location);
                }
                else {
                    localStorage.setItem("LocationDetail", '');
                }

                localStorage.setItem("EditProfileFromWeb", data.EditProfileFromWeb);
                localStorage.setItem("Company", data.Company);
                localStorage.setItem("CostCenter", data.CostCenter);
                localStorage.setItem("CostCenterProfile", data.CostCenter);

                localStorage.setItem("EditProfileFromWeb", data.EditProfileFromWeb);
                profileNote = '';
                setLocal("SessionId", encryptStr(data.SessionId));

                if (decryptStr(getLocal("MSIClientCode")) === "IO" && getLocal("Language") === "fr-FR") {
                    getTranslations("FrenchIO");
                }

                FetchWorkOrderDetail(5);

                $.mobile.loading('show', {
                    text: 'Loading',
                    textVisible: true,
                    theme: 'b',
                    textonly: false,
                    html: ""
                });
                loadMenu();
                getSiteLabels("Main");
                //$.mobile.changePage("quickLinks.html");
                setLocal("PreviousPage", null);
                getLocationAddress(GetQuickLinkDetails);
            }
            else if (loginMessage[0].toLowerCase() === "invalid") {
                getSSOToken(splashScreen);
            }
            else {
                $.mobile.loading("hide");
                showErrorPopUpSplash(true, loginMessage[1], "");
            }
        });
    }
    else {

        setTimeout(function () {
            showErrorPopUp(true, noNetworkTranslation);
        }, 1000);
    }
}

//function showClaimsPopup(popupafterclose, url, myJSONobject) {
//    if (navigator.onLine) {
//        $.postJSONSplash(url, myJSONobject, function (data) {
//            var template = "<div data-role='popup' class='custAttachment claimsPopup' data-history='false'>"
//                    + "<div data-role='header' data-history='false'><h4 class='popupHeader'>"
//                    + "Claims Details" + "</h4></div>"
//                    + "<span class='claimsPopupText'>AltKey: " + data.AltKey + " </span> <span class='claimsPopupText'>Caller Name: " + data.CallerName + " </span>"
//                    + "<span class='claimsPopupText'>EmailAddress: " + data.EmailAddress + " </span> <span class='claimsPopupText'>PhoneNumber: " + data.PhoneNumber + " </span>"
//                    + "<span class='claimsPopupText'>Customer Number: " + data.CustomerNumber + " </span> <span class='claimsPopupText'>Customer Site Number: " + data.CustomerSiteNumber + " </span>"
//                    + "<a href='#' class='ui-btn ui-btn-inline newBtn' data-rel='back'>Ok </a></div>";

//            popupafterclose = popupafterclose ? popupafterclose : function () { };

//            $.mobile.activePage.append(template).trigger("create");

//            $.mobile.activePage.find(".claimsPopup").popup().popup("open").bind({
//                popupafterclose: function () {

//                    $(this).unbind("popupafterclose").remove();
//                    closeClaimsPopup(data);
//                }
//            });
//        });
//    }
//    else {
//        setTimeout(function () {
//            showErrorPopUp(true, noNetworkTranslation);
//        }, 1000);
//    }
//}

// Method invoked on closing of Claims popup 
//function closeClaimsPopup(data) {
//    var myJSONobject = { "loginDetails": { "DatabaseID": decryptStr(getLocal("DatabaseID")),
//        "Language": getLocal("Language"),
//        "DbaseName": decryptStr(getLocal("databaseName")),
//        "gpsLocation": getLocal("GPSLocation"),
//        "ShowClaimsPopup": decryptStr(getLocal("ShowClaimsPopup")),
//        "URLIdentifier": getLocal("URLIdentifier")
//    },
//        "callerDetails": { "AltKey": data.AltKey,
//            "CallerName": data.CallerName,
//            "EmailAddress": data.EmailAddress,
//            "PhoneNumber": data.PhoneNumber,
//            "CustomerNumber": data.CustomerNumber,
//            "CustomerSiteNumber": data.CustomerSiteNumber
//        }
//    };

//    var loginURL = standardAddress + "SSOLoginAuthentication.svc/ConfirmClaims";
//    loginSSO(loginURL, myJSONobject);
//}

//This method is used to create users details.
function createRecords(tx) {
    var username = $("#UserNameTextBox").val();
    var password = $("#PasswordTextBox").val();
    var dbId = $("#DataBaseName").val();
    var language = getLocal("Language");

    var remember = '1';
    setLocal("rememberMe", remember);
    tx.executeSql('CREATE TABLE Users (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, username TEXT NOT NULL, password TEXT NOT NULL, databaseId INTEGER NOT NULL, language TEXT NOT NULL, remember BOOLEAN NOT NULL)');
    tx.executeSql('INSERT INTO Users (username, password, databaseId, language, remember) VALUES ("' + encryptStr(username) + '", "' + encryptStr(password) + '", "' + dbId + '", "' + language + '", "' + remember + '")');

}
function successCB() {
    //alert("Success");
}
function errorCB(error) {
    //alert("Error processing SQL: "+error.code);
}

// The Menu items and links
function loadMenu() {
    var menuOption = new Object();

    getTranslations("Menus");

    menu = new Array();

    menuOption = {
        title: (IsStringNullOrEmpty(getTranslatedValue("HomeLabel")) ? "" : getTranslatedValue("HomeLabel")),
        url: "dashboard.html"
    };
    menu.push(menuOption);

    menuOption = {
        title: (IsStringNullOrEmpty(getTranslatedValue("quickLinksLabel")) ? "" : getTranslatedValue("quickLinksLabel")),
        url: "quickLinks.html"
    };
    menu.push(menuOption);

    if (decryptStr(getLocal("ShowCreateServiceRequest")).toLowerCase() === "true") {
        menuOption = {
            title: ((decryptStr(getLocal("MSIClientCode")) === "IO") ? getTranslatedValue("requestServiceLabelIO") : getTranslatedValue("requestServiceLabel")),
            url: "RequestService.html"
        };

        menu.push(menuOption);
    }

    menuOption = {
        title: ((decryptStr(getLocal("MSIClientCode")) === "IO") ? getTranslatedValue("historyLabelIO") : getTranslatedValue("historyLabel")),
        url: "serviceHistory.html"
    };
    menu.push(menuOption);

    menuOption = {
        title: ((decryptStr(getLocal("MSIClientCode")) === "IO") ? getTranslatedValue("viewServiceRequestLabelIO") : getTranslatedValue("viewServiceRequestLabel")),
        url: "viewServiceRequest.html"
    };
    menu.push(menuOption);

    if (decryptStr(getLocal("ShowProvideFeedback")).toLowerCase() === "true") {
        menuOption = {
            title: (IsStringNullOrEmpty(getTranslatedValue("feedbackLabel")) ? "" : getTranslatedValue("feedbackLabel")),
            url: "feedback.html"
        };
        menu.push(menuOption);
    }

    menuOption = {
        title: (IsStringNullOrEmpty(getTranslatedValue("profileLabel")) ? "" : getTranslatedValue("profileLabel")),
        url: "editProfile.html"
    };
    menu.push(menuOption);

    if (getLocal("SSOUser") != "true") {
        menuOption = {
            title: (IsStringNullOrEmpty(getTranslatedValue("changePasswordLabel")) ? "" : getTranslatedValue("changePasswordLabel")),
            url: "changePassword.html"
        };
        menu.push(menuOption);
    }

    if (decryptStr(getLocal("ShowAboutUs")) == "1") {
        menuOption = {
            title: (IsStringNullOrEmpty(getTranslatedValue("aboutUsLabel")) ? "" : getTranslatedValue("aboutUsLabel")),
            url: "aboutUs.html"
        };
        menu.push(menuOption);
    }

    if (getLocal("SSOUser") == "true" && decryptStr(getLocal("ShowSettingsInMenu")) == "1") {
        menuOption = {
            title: (IsStringNullOrEmpty(getTranslatedValue("SettingsLabel")) ? "Settings" : getTranslatedValue("SettingsLabel")),
            url: "#",
            id: "Settings"
        };
        menu.push(menuOption);
    }

    var text = $('#myDiv .myClass a').text();
    $(document).on("pageshow", function (event) {
        var items = '', // menu items list
            ul = $(".mainMenu:empty");  // get "every" mainMenu that has not yet been processed
        for (var i = 0; i < menu.length; i++) {
            items += '<li><a href="' + menu[i].url + '" id="' + menu[i].id + '" onclick="navigateTo(this.id);">' + menu[i].title + '</a></li>';
        }

        ul.append(items);
        ul.listview('refresh'); // use cache, as ".mainMenu:empty" will no longer work (append called!)
    });
}


function navigateTo(id) {
    if (id.toLowerCase() == "settings") {
        logOut();
        //        $.mobile.activePage.find("#menu").removeClass("ui-panel-open").addClass("ui-panel-closed");
        //        $.mobile.activePage.find(".page-fixed-footer").removeClass("ui-panel-animate ui-panel-page-content-position-left ui-panel-page-content-display-push ui-panel-page-content-open");
        //        $.mobile.activePage.find(".ms-inner-header").removeClass("ui-panel-animate ui-panel-page-content-position-left ui-panel-page-content-display-push ui-panel-page-content-open");

        //        var template = "<div data-role='popup' id='LoginSettingsPopUp' data-overlay-theme='a' data-theme='c' data-dismissible='false' class='custSettings' data-history='false'>"
        //      + "<div data-role='header' class='ms-inner-header'><h2 id='settingsLabel'>Settings</h1></div> "
        //      + "<div role='main' class='ui-content'><input type='text' id='DataBaseName' name='DataBaseName' min='100' max='999'"
        //      + " maxlength='3' onkeyup='LoginSettings_DatabaseNameChanged();' /> <select id='SupportedLanguagesDropDown' onchange='LoginSettings_SupportedLanguagesChanged();'></select>"
        //      + "<label id='SettingsPopUpWaitLabel' style='display: none;'></label><label id='SettingsPopUpMessageLabel' style='display: none;'></label>"      
        //      + "<div class='text-align-center btn-panel'><a href='#' data-role='button' id='SaveButton' class='custSaveBtn' onclick='LoginSettings_SaveButtonClick();' data-theme='b' data-inline='true'>"
        //      + "</a><a href='#' data-role='button' id='CancelButton' class='custSaveBtn' onclick='LoginSettings_closeButtonClick();' data-inline='true' data-theme='b' data-rel='back'></a></div></div></div>"

        //        //popupafterclose = popupafterclose ? popupafterclose : function () { };

        //        $.mobile.activePage.append(template).trigger("create");

        //        var page = $("#" + $.mobile.activePage.attr('id'));

        //        if (decryptStr(getLocal("DatabaseID")) != null) {
        //            page.find("#DataBaseName").val(decryptStr(getLocal("DatabaseID")));
        //        }
        //        page.find("#SettingsPopUpMessageLabel").hide();
        //        page.find("#SettingsPopUpWaitLabel").hide();

        //        supportedLanguagesTemp = getLocal("SupportedLanguages");
        //        var supportedLanguagesDropDown = page.find("#SupportedLanguagesDropDown");
        //        supportedLanguagesDropDown.empty();

        //        var selectOption = document.createElement("option");
        //        selectOption.setAttribute("value", "-1");
        //        selectOption.innerHTML = IsStringNullOrEmpty(getTranslatedValue("LanguageLabel")) ? langOptionTranslation : "-" + getTranslatedValue("LanguageLabel") + "-";
        //        supportedLanguagesDropDown.append(selectOption);
        //        supportedLanguagesDropDown.children("option:eq(0)").attr("selected", true);

        //        if (!IsStringNullOrEmpty(supportedLanguagesTemp)) {
        //            data = JSON.parse(supportedLanguagesTemp);

        //            if (!IsObjectNullOrUndefined(supportedLanguagesDropDown) && !IsObjectNullOrUndefined(data)) {
        //                for (var arrayCount = 0; arrayCount < data.length; arrayCount++) {
        //                    var option = document.createElement("option");
        //                    option.setAttribute("value", data[arrayCount].LangAbbrv);
        //                    option.innerHTML = data[arrayCount].LangAlias;
        //                    supportedLanguagesDropDown.append(option);
        //                }
        //            }
        //        } else {
        //            //setTimeout(function () {
        //                $("#SupportedLanguagesDropDown option[value='-1']").attr('selected', 'selected');
        //                $("#SupportedLanguagesDropDown").selectmenu("refresh");
        //            //}, 200);
        //        }
        //        supportedLanguagesDropDown.val(getLocal("Language")).attr('selected', 'selected');
        //        //setTimeout(function () {
        //        page.find("#settingsLabel").text(IsStringNullOrEmpty(getTranslatedValue("SettingsLabel")) ? "Settings" : getTranslatedValue("SettingsLabel"));
        //        page.find("#SettingsPopUpWaitLabel").text(IsStringNullOrEmpty(getTranslatedValue("WaitLabel")) ? "Please wait.." : getTranslatedValue("WaitLabel"));
        //        page.find("#SaveButton").text(IsStringNullOrEmpty(getTranslatedValue("SaveButton")) ? "Save" : getTranslatedValue("SaveButton"));
        //        page.find("#CancelButton").text(IsStringNullOrEmpty(getTranslatedValue("CancelButton")) ? "Cancel" : getTranslatedValue("CancelButton"));
        //        //page.find("#DataBaseName").attr("placeholder", IsStringNullOrEmpty(getTranslatedValue("CustomerIDLabel")) ? "Customer ID" : getTranslatedValue("CustomerIDLabel"));
        //            //$("#LoginSettingsPopUp").popup("open");
        //        //}, 200);

        //        supportedLanguagesDropDown.selectmenu("refresh", true);

        //        $.mobile.activePage.find("#LoginSettingsPopUp").popup().popup("open").bind({
        //            popupafterclose: function () {
        //                $(this).unbind("popupafterclose").remove();
        //            }
        //        });

        //        //$.mobile.changePage("index.html", "fade");
    }
    //alert("SSO Settings");
    setLocal("QuickLinkRequestService", "true");
    setLocal("NavigationFromQuickLinks", "0");
    setLocal("CRSForm", "7");
}

/*********************************Attachment************************************/

/////////////Camera Ios///////////////////////`
// Called when a photo is successfully retrieved
//
function onWorkOrderAttachmentPhotoDataSuccess(imageData) {
    // Uncomment to view the base64 encoded image data
    // Get image handle
    setLocal("Attachment", imageData);
    $("#smallImage").attr("src", "data:image/jpeg;base64," + imageData);
    $("#selectedImageDiv").show();
    $('#clearAttachmentSource').show();
}

// Called when a photo is successfully retrieved
//
function onWorkOrderAttachmentPhotoURISuccess(imageURI) {
    // Uncomment to view the image file URI
    // Get image handle
    // Show the captured photo
    // The inline CSS rules are used to resize the image
    setLocal("Attachment", imageURI);
    $("#smallImage").attr("src", "data:image/jpeg;base64," + imageURI);
    $("#selectedImageDiv").show();
    $('#clearAttachmentSource').show();
}

// A button will call this function
//
function captureWorkOrderAttachmentPhoto() {
    ////console.log('inside capturePhoto');
    // Take picture using device camera and retrieve image as base64-encoded string
    navigator.camera.getPicture(onWorkOrderAttachmentPhotoDataSuccess, onWorkOrderAttachFail, {
        quality: 20, encodingType: Camera.EncodingType.JPEG,
        destinationType: 0,
        sourceType: 1,
        targetWidth: 600,
        targetHeight: 700
    });
}

// A button will call this function
function getWorkOrderPhotoAttachment() {
    ////console.log('inside getPhoto');
    // Retrieve image file location from specified source
    navigator.camera.getPicture(onWorkOrderAttachmentPhotoURISuccess, onWorkOrderAttachFail, {
        quality: 20, encodingType: Camera.EncodingType.JPEG,
        destinationType: 0,
        sourceType: 0,
        targetWidth: 600,
        targetHeight: 700
    });
}

// Called if something bad happens.
//
function onWorkOrderAttachFail(message) {
    //    setTimeout(function () {
    //        showErrorPopUpAttachment(true, message);
    //    }, 500);
}

// Method to get attachments
function getAttachments() {
    $("#noAttachemnt").hide();
    $("#attachmentList").empty();
    var accessURL = standardAddress + "Attachements.svc/GetAttachedFiles";
    var myJsonObject = {
        "attachmentContract": {
            "DatabaseID": decryptStr(getLocal("DatabaseID")),
            "WorkOrderNumber": getLocal("woID"),
            "Language": getLocal("Language"),
            "DatabaseName": decryptStr(getLocal("databaseName")),
            "SessionId": decryptStr(getLocal("SessionId"))
        }
    };

    $.postJSON(accessURL, myJsonObject, function (data) {
        var attachmentList = '';
        if (data.length != 0) {
            $("#attachmentListDiv").show();
            for (var i = 0; i < data.length; i++) {
                attachmentList = attachmentList + '<li><a id="attachment' + i + '" href="#imagePopup" class="ui-link-inherit" onclick="showImage(\'' + data[i].FileName + '\',\'' + data[i].FileSeq + '\')">'
                    + '<p style="font-size: 0.9em">' + getTranslatedValue("imageLabel") + ': ' + (IsStringNullOrEmpty(data[i].FileName) ? "" : data[i].FileName) + '</p>'
                    + '<p style="font-size: 0.9em">' + getTranslatedValue("imageDescriptionLabel") + ': ' + (IsStringNullOrEmpty(data[i].Description) ? "" : data[i].Description) + '</p>'
                    + '</a></li>';
            }

            $("#attachmentList").append(attachmentList).listview("refresh");
            hideImage();
        }
        else {
            $("#noAttachemnt").show();
            hideImage();
        }
    });
}

// Method to display the selected image
//@fileName- Image name
//@fileSeq- File sequence
function showImage(fileName, fileSeq) {
    loadingImage();
    $("#attachmentImage").attr('src', '');
    var fileExtension = fileName.substr((fileName.length - 3), 3);
    fileExtension = fileExtension.toLowerCase();
    switch (fileExtension) {
        case "jpg":
        case "bmp":
        case "ico":
        case "gif":
        case "png":
        case "jpg":
        case "bmp":
        case "ico":
        case "gif":
        case "png":
        case "pdf":
            var myJSONobject = {
                "attachmentContract": {
                    "DatabaseID": decryptStr(getLocal("DatabaseID")),
                    "WorkOrderNumber": getLocal("woID"),
                    "FileSeq": fileSeq,
                    "Language": getLocal("Language"),
                    "DatabaseName": decryptStr(getLocal("databaseName")),
                    "SessionId": decryptStr(getLocal("SessionId"))
                }
            };
            var getImageURL = standardAddress + "Attachements.svc/GetFileObject";
            getImage(getImageURL, myJSONobject, fileExtension);
            break;
        default:
            hideImage();
            setTimeout(function () {
                showErrorPopUpAttachment(true, getTranslatedValue("fileNotSupportedMessage"));
            }, 1000);
            break;
    }
}

//Method to get the image
//@getImageURL- Service URL
//@myJSONobject- json object
//@fileExtension- Attachment extension
function getImage(getImageURL, myJSONobject, fileExtension) {

    if (navigator.onLine) {
        $.postJSON(getImageURL, myJSONobject, function (data) {
            hideImage();
            loadImage(data, fileExtension);
        });
    }
    else {
        hideImage();
        showErrorPopup(true, "NoNetworkCommon");
    }
}

//Method to load the image  on screen
//@imageData- Image data
//@fileExtension- File Extension
function loadImage(imageData, fileExtension) {

    if (fileExtension == "pdf") {
        var ref = window.open(imageData, '_blank', 'location=no');
        ref.close();
    }
    else {
        $("#attachmentImage").attr('src', imageData);
    }
}


//Method to add the image
//@form- It contains the form contents
function addAttachment(form) {
    var connectionStringURL = standardAddress + "Attachements.svc/AddAttachment";

    if ($("#smallImage").attr('src') !== '') {
        if ($("#attachmentDescriptionTextarea").val().length !== 0) {
            var myJSONobject = {
                "uplodedFile": {
                    "DatabaseID": decryptStr(getLocal("DatabaseID")),
                    "EmployeeNumber": getLocal("EmployeeNumber"),
                    "Seq": getLocal("seq"),
                    "WorkOrderNumber": getLocal("woID"),
                    "FileName": "image.jpg",
                    "FileObjectInBase64": $("#smallImage").attr('src'),
                    "Description": $("#attachmentDescriptionTextarea").val(),
                    "DatabaseName": decryptStr(getLocal("databaseName")),
                    "Language": getLocal("Language"),
                    "GPSLocation": getLocal("GPSLocation"),
                    "SessionId": decryptStr(getLocal("SessionId"))
                }
            };
            loadingImage();
            $.postAjaxJSON(connectionStringURL, myJSONobject, function (data) {
                $("#" + $.mobile.activePage.attr('id')).prop('disabled', 'disabled');
                $("#" + $.mobile.activePage.attr('id')).addClass("ui-disabled");
                $("#" + $.mobile.activePage.attr('id')).addClass("ui-state-disabled");
                $("#errorMessageLabel").hide();
                setTimeout(function () {
                    hideImage();
                    showAttachmentSuccessPopUp(true, data);
                    $("#" + $.mobile.activePage.attr('id')).prop('enabled', 'enabled');
                    $("#" + $.mobile.activePage.attr('id')).removeClass("ui-disabled");
                    $("#" + $.mobile.activePage.attr('id')).removeClass("ui-state-disabled");
                }, 2000);

                $("#popup_Add").popup("close");
            });
        }
        else {
            $("#attachmentErrorMessageLabel").show();
            $("#attachmentErrorMessageLabel").text(getTranslatedValue("enterDescriptionLabel"));
        }
    }
    else {
        $("#attachmentErrorMessageLabel").show();
        $("#attachmentErrorMessageLabel").text(getTranslatedValue("selectFileLabel"));
    }
}


function showAttachmentSuccessPopUp(popupafterclose, message) {

    var template = "<div data-role='popup' data-dismissible='false' class='ui-content messagePopup' data-history='false'>"
        + "<div data-role='header' role='banner' class='ui-header ui-bar-inherit'><h1 class='popupHeaderConfirm'>" + getTranslatedValue("successLabel") + "</h1></div> "
        + "<span class='messagePopUpContext'>" + message + " </span><a href='#' class='ui-btn ui-btn-inline newBtn' data-rel='back'>" + getTranslatedValue("closeLabel") + "</a> </div>";

    popupafterclose = popupafterclose ? popupafterclose : function () { };

    $.mobile.activePage.append(template).trigger("create");

    $.mobile.activePage.find(".messagePopup").popup().popup("open").bind({
        popupafterclose: function () {
            $(this).unbind("popupafterclose").remove();
            getAttachments();
        }
    });
}

function openAttachmentPopup() {
    $("#attachmentErrorMessageLabel").hide();
    $("#selectedImageDiv").hide();
    $("#smallImage").attr('src', '');
    $("#attachmentDescriptionTextarea").val('');
    $("#popup_Add").popup("open");

}

/*********************************Attachment End************************************/


/******************************Get Translations*************************/
//Method to load the translation for the screen
//@screenName- Screen Name which needs the translation
function getTranslations(screenName) {
    translatedStrings = new Object();

    var xmlString = getLocal("XmlTranslation");
    var language = getLocal("Language");
    var page = $("#" + screenName);

    if (!IsStringNullOrEmpty(screenName) && !IsStringNullOrEmpty(language)) {
        $(xmlString).find("major[MajorKey='" + screenName + "']").find("minor[MinorKey='" + language + "']").find("code").each(function () {
            if (!IsObjectNullOrUndefined($(this))) {
                var dataNode = $(this).find("data");
                var data = emptyString;
                if (!IsObjectNullOrUndefined(dataNode)) {
                    data = $(dataNode).text();
                }

                var valueNode = $(this).find("value");
                var value = emptyString;
                if (!IsObjectNullOrUndefined(valueNode)) {
                    value = $(valueNode).text();
                }

                // If the screen name is not FrenchIO then load it to TranslatedStrings. 
                if (screenName === 'FrenchIO') {
                    translatedFrenchStrings[data] = value;
                }
                else if (screenName === 'CommonStrings') {
                    translatedCommonStrings[data] = value;
                }
                else {
                    translatedStrings[data] = value;
                }

                if (!IsStringNullOrEmpty(data)) {
                    var element = page.find("#" + data);

                    if (element.length > 0) {
                        //if (data.length > 6 && data.substring(data.length - 6, data.length) == "Button" && element.get(0).tagName == "A") {
                        if (element.get(0).tagName == "A" && element.attr("data-role") == "button") {
                            element.find(".ui-btn-text").text(value);
                        }
                        else if (element.attr('type') == "checkbox") {
                            element.siblings('label').find(".ui-btn-text").text(value);
                        }
                        else if (element.get(0).tagName == "H3" && element.attr("class").indexOf("ui-collapsible") > -1) {
                            element.find(".ui-btn-text").text(value);
                        }
                        else {
                            element.text(value);
                        }
                    }
                }
            }
        });
        return;
    }
}

function getTranslatedValue(key) {
    var value = emptyString;
    if (decryptStr(getLocal("MSIClientCode")) === "IO" && getLocal("Language") === "fr-FR") {
        if (!IsObjectNullOrUndefined(translatedFrenchStrings)) {
            value = translatedFrenchStrings[key];
        }

        if (value === undefined) {
            if (!IsObjectNullOrUndefined(translatedStrings)) {
                value = translatedStrings[key];
            }
        }
    }
    else {
        if (!IsObjectNullOrUndefined(translatedStrings)) {
            value = translatedStrings[key];
        }
    }

    return value;
}

function getCommonTranslatedValue(key) {
    if (!IsObjectNullOrUndefined(translatedCommonStrings)) {
        value = translatedCommonStrings[key];
    }

    return value;
}

function getTranslatedValueMenu(key) {
    for (var i = 0; i < translatedStringsMenu.length; i++) {
        if (translatedStringsMenu[i].data == key) {
            return translatedStringsMenu[i].value;
        }
    }
}

/******************************End Get Translations*************************/



/*********************** Common functions ************************/

var sort_by = function (field, reverse, primer) {
    var key = function (x) {
        return primer ? primer(x[field]) : x[field];
    };
    return function (a, b) {
        if (a === null || a === "null") { a = "No string"; }
        if (b === null || b === "null") { b = "No string"; }
        var A = key(a), B = key(b);
        return ((A > B) ? -1 : ((A < B) ? 1 : 0)) * [-1, 1][+!!reverse];
    };
};

var sort_priority = function (field, reverse, primer) {
    var key = function (x) {
        return primer ? primer(x[field]) : x[field];
    };
    return function (a, b) {
        var reA = /^[a-zA-Z]$/;
        var re = new RegExp(reA);

        var A = key(a), B = key(b);

        A = A.replace("P", "");
        B = B.replace("P", "");
        A = parseInt(A);
        B = parseInt(B);
        return ((A > B) ? -1 : ((A < B) ? 1 : 0)) * [-1, 1][+!!reverse];
    };
};

function sort_Orders(field, reverse, primer, sortby) {
    var key;
    if (sortby === "Priority") {
        key = function (x) {
            return primer ? primer(x[field]) : x[field];
        };
        return function (a, b) {
            var reA = /^[a-zA-Z]$/;
            var re = new RegExp(reA);
            var A = key(a), B = key(b);
            A = A.replace("P", "");
            B = B.replace("P", "");
            A = parseInt(A);
            B = parseInt(B);
            return ((A > B) ? -1 : ((A < B) ? 1 : 0)) * [-1, 1][+!!reverse];
        };
    }
    else if (sortby === "Building") {
        key = function (x) { return primer ? primer(x[field]) : x[field]; };
        return function (a, b) {
            var L1 = key(a), L2 = key(b);
            L1 = L1.split("/");
            L2 = L2.split("/");
            var A = L1[1].trim();
            var B = L2[1].trim();
            return ((A > B) ? -1 : ((A < B) ? 1 : 0)) * [-1, 1][+!!reverse];
        };
    }
    else {
        key = function (x) { return primer ? primer(x[field]) : x[field]; };
        return function (a, b) {
            if (a === null || a === "null") { a = "No string"; }
            if (b === null || b === "null") { b = "No string"; }
            var A = key(a), B = key(b);
            return ((A > B) ? -1 : ((A < B) ? 1 : 0)) * [-1, 1][+!!reverse];
        };
    }
}

function CheckOnline(screenName, htmlpage) {
    if (!navigator.online) {
        ////showError("No network connection. Please try again when network is available.");
        //showError(GetCommonTranslatedValue("NoNetworkCommon"));
        return false;
    }
    else {
        localStorage.setItem("ScreenName", screenName);
        $.mobile.changePage(htmlpage);
    }
}


function SetDB() {
    if (decryptStr(getLocal("DatabaseID")) !== undefined || decryptStr(getLocal("DatabaseID")) !== '') {
        $("#DataBaseName").val(decryptStr(getLocal("DatabaseID")));
    }
}


// *****************************************************************
// Function to Log the errors from the Client Side into the offline DB
function LogErrors(message) {
    try {
        if (isDebugMode == true) {
            var values = [];
            values.push(message);
            values.push(new Date());
            values.push(localStorage.getItem("EmployeeNumber"));
            var insertQuery = 'INSERT INTO ErrorLogTable(Error,CurrentDateTime,EmployeeNumber) VALUES (?,?,?)';
            openDB();
            dB.transaction(function (ts) {
                ts.executeSql(insertQuery, values, function () {
                });
            });
        }
    }
    catch (ex) {
        console.log(ex.message);
    }
}
// *****************************************************************


/////*************************** code to Log exception ************************///////////
function fillExceptionTable(Message) {
    var values = [];
    values.push(Message);
    values.push(new Date);

    var logInsertQuery = 'INSERT INTO ExceptionLogTable (ErrorMessage,CurrentDateTime) VALUES(?,?)';
    openDB();
    dB.transaction(function (ts) {
        ts.executeSql(logInsertQuery, values, function () { }, function (ts, error) { console.log(data.WorkOrderNumber + " " + error.message); });
    });
}

/////*************************** code to Log exception ************************///////////


function log(msg) {
}

function findPopupName(pageID) {
    var myPopupName = "";
    if ($("#" + pageID + "loadingPopup").parent().hasClass("ui-popup-active")) {
        myPopupName = "loading";
    }
    else if ($("#" + pageID + "actionLoadingPopup").parent().hasClass("ui-popup-active")) {
        myPopupName = "processing";
    }
    else {
        myPopupName = "NoPopup";
    }
    return myPopupName;
}

function IsNetworkAlive() {
    setInterval(function () {
        data = {
            "DatabaseID": localStorage.getItem("DatabaseID"),
            "language": localStorage.getItem("Language")
        };
        if (navigator.onLine) {
            $.ajax(
                {
                    url: standardAddress + "Inspection.ashx?methodname=Connectivity",
                    type: "post",
                    jsonp: "callback",
                    dataType: "json",
                    timeout: 15000,
                    data: data,
                    success: function (result) {
                        if (result[0] == "(" && result[result.length - 1] == ")") {
                            result = result.substring(1, result.length - 1);

                        }
                        result = JSON.parse(result);
                    },
                    error: function (xhr, textStatus, jqXHR) {
                        if (textStatus == 'timeout') {
                        }
                    }
                });
        }
    }, 8000);
}

function PostDone(data, textStatus, jqXHR) {
    RemoveRequest(jqXHR.ID);
}

function RemoveRequest(id) {
    for (var index = 0; index < ajaxCalls.length; index++) {
        if (ajaxCalls[index].Request.ID == id) {
            ajaxCalls.splice(index, 1);
            return true;
        }
    }
    return false;
}

function GenerateGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

document.addEventListener("deviceready", init, false);

function init() {
    pictureSource = navigator.camera.PictureSourceType;
    destinationType = navigator.camera.DestinationType;
    document.addEventListener("online", checkConnection, false);
    document.addEventListener("offline", checkConnection, false);
}


function handleErrorRequest(flag) {
    if (flag === true) {
        while (ajaxCalls.length > 0) {
            var currentTemp = ajaxCalls[0];
            ajaxCalls.splice(0, 1);
            $.postJSON(currentTemp.URL, currentTemp.Data, currentTemp.Func);
        }
    }
    else {
        ajaxCalls = [];
    }
}

function handleRequest(flag) {
    if (flag === true) {
        while (tempCalls.length > 0) {
            var currentTemp = tempCalls[0];
            tempCalls.splice(0, 1);
            $.postJSON(currentTemp.URL, currentTemp.Data, currentTemp.Func);
        }
    }
    else {
        ajaxCalls = [];
        tempCalls = [];
    }
}




$(document).on("pagebeforeshow", function () {
    if (!IsStringNullOrEmpty(getLocal("Language"))) {
        Globalize.culture(getLocal("Language"));
    }
});

function NumberSortHelper(a, b) {
    return a - b;
}

function IsStringNullOrEmpty(value) {
    if (value === null || value == "null" || value === emptyString || value === undefined) {
        return true;
    }

    return false;
}

function IsObjectNullOrUndefined(value) {
    if (value === null || value === undefinedString || value === undefined) {
        return true;
    }

    return false;
}

function GetInvariantDateString(date) {
    if (date instanceof Date) {
        return Globalize.format(date, "yyyy-MM-dd");
    }

    return emptyString;
}

function GetInvariantTimeString(date, isMilitaryTime) {
    if (!IsStringNullOrEmpty(date) && (date instanceof Date)) {
        if (isMilitaryTime) {
            return Globalize.format(date, "HH:mm");
        }
        else {
            return Globalize.format(date, "hh:mm tt");
        }
    }

    return emptyString;
}

function GetInvariantDateTimeString_T(date) {
    if (!IsStringNullOrEmpty(date) && (date instanceof Date)) {
        return GetInvariantDateString(date) + "T" + GetInvariantTimeString(date, true);
    }

    return emptyString;
}

function GetDateText(date) {
    if (date instanceof Date) {
        return date.toDateString();
    }

    return emptyString;
}

function GetDateTimeText(date, isMilitaryTime) {
    if (date instanceof Date) {
        return date.toDateString() + " " + GetInvariantTimeString(date, isMilitaryTime);
    }

    return emptyString;
}

function GetDateObjectFromInvariantDateString(value) {
    if (!IsStringNullOrEmpty(value)) {
        var date = NaN;
        var splitValue = value.split(/[^0-9]/);

        if (!IsObjectNullOrUndefined(splitValue)) {
            if (splitValue.length == 3) {
                //date = new Date(Date.UTC(splitValue[0], splitValue[1] - 1, splitValue[2], 0, 0, 0, 0));
                date = new Date(splitValue[0], splitValue[1] - 1, splitValue[2], 0, 0, 0, 0);
            }
            else if (splitValue.length == 5 || splitValue.length == 6 || splitValue.length == 7) {
                date = new Date(splitValue[0], splitValue[1] - 1, splitValue[2], splitValue[3], splitValue[4], 0, 0);
            }
        }

        if (!isNaN(date.valueOf())) {
            return date;
        }
    }

    return null;
}

function ValidateInvariantDateString(date) {
    var dateObj = GetDateObjectFromInvariantDateString(date);

    if (!IsObjectNullOrUndefined(dateObj)) {
        year = dateObj.getFullYear();

        if (year >= MinYear && year <= MaxYear) {
            return true;
        }
    }

    return false;
}

function SetSelectedDateForLink(dateTextBoxID, dateLinkID) {
    var page = $("#" + $.mobile.activePage.attr("id"));
    var tempDate = GetDateObjectFromInvariantDateString(page.find("#" + dateTextBoxID).val());
    var tempDateText = GetDateText(tempDate);

    if (IsStringNullOrEmpty(tempDateText)) {
        tempDateText = notSetTranslation;
    }

    page.find("#" + dateLinkID).text(tempDateText);
}

function SetSelectedDateTimeForLink(dateTextBoxID, dateLinkID) {
    var page = $("#" + $.mobile.activePage.attr("id"));
    var tempDate = GetDateObjectFromInvariantDateString(page.find("#" + dateTextBoxID).val());
    var tempDateText = GetDateTimeText(tempDate, false);

    if (IsStringNullOrEmpty(tempDateText)) {
        tempDateText = notSetTranslation;
    }

    page.find("#" + dateLinkID).text(tempDateText);
}

function GetDecimal(number, decimalDigits, isLocalFormat) {
    number = parseFloat(number);

    if (!isNaN(number)) {
        if (typeof number === 'number') {
            if (isLocalFormat) {
                return Globalize.format(number, "n" + decimalDigits);
            }
            else {
                return number.toFixed(decimalDigits);
            }
        }
    }

    return emptyString;
}

function GetUniqueElements(array) {
    if (array instanceof Array) {
        return array.filter(function (el, index, arr) {
            return index == arr.indexOf(el);
        });
    }
    return [];
}

function FormatDecimalInTextBox(textbox) {
    textbox.value = GetDecimal(textbox.value, 2, false);
}

function BlockNonNumbersInTextBox(obj, e, allowDecimal, allowNegative) {
    var key;
    var isCtrl = false;
    var keychar;
    var reg;
    if (window.event) {
        key = e.keyCode;
        isCtrl = window.event.ctrlKey;
    }
    else if (e.which) {
        key = e.which;
        isCtrl = e.ctrlKey;
    }

    if (isNaN(key)) return true;

    keychar = String.fromCharCode(key);

    // check for backspace or delete, or if Ctrl was pressed
    if (key == 8 || isCtrl) {
        return true;
    }

    reg = /\d/;
    var isFirstN = allowNegative ? keychar == '-' && obj.value.indexOf('-') == -1 : false;
    var isFirstD = allowDecimal ? keychar == '.' && obj.value.indexOf('.') == -1 : false;
    var isFirstC = allowDecimal ? keychar == ',' && obj.value.indexOf(',') == -1 : false;
    return isFirstN || isFirstD || isFirstC || reg.test(keychar);
}

function GetCommonTranslatedValue(key) {
    if (!IsObjectNullOrUndefined(commonStrings)) {
        var value = commonStrings[key];

        if (!IsStringNullOrEmpty(value)) {
            return value;
        }
    }

    return emptyString;
}

/*************************Help********************/
function navigateToHelp() {
    $.mobile.changePage("Help.html");
}
function navigateToHome() {
    $.mobile.changePage("dashboard.html");
}
function showErrorPopUpAttachment(popupafterclose, message) {

    var template = "<div data-role='popup' data-dismissible='false' class='ui-content messagePopup' data-history='false'>"
        + "<div data-role='header' role='banner' class='ui-header ui-bar-inherit'><h1 class='popupHeader'>! " + getCommonTranslatedValue("errorInformationLabel") + "</h1></div> "
        + "<span class='messagePopUpContext'>" + message + " </span><a href='#' class='ui-btn ui-btn-inline newBtn' data-rel='back'>" + getCommonTranslatedValue("closeLabel") + "</a> </div>";

    popupafterclose = popupafterclose ? popupafterclose : function () { };

    $.mobile.activePage.append(template).trigger("create");

    $.mobile.activePage.find(".messagePopup").popup().popup("open").bind({
        popupafterclose: function () {
            $(this).unbind("popupafterclose").remove();

        }
    });
}
/***********************Help End********************/
function showErrorPopUp(popupafterclose, message) {
    var template = "<div data-role='popup' id='errorPopup' data-dismissible='false' class='ui-content messagePopup' data-history='false'>"
        + "<div data-role='header' role='banner' class='ui-header ui-bar-inherit error'><h1 class='popupHeader'>! " + getCommonTranslatedValue("errorInformationLabel") + "</h1></div> "
        + "<span class='messagePopUpContext'>" + message + " </span><a href='#' class='ui-btn ui-btn-inline newBtn' data-rel='back'>" + getCommonTranslatedValue("closeLabel") + "</a> </div>";

    popupafterclose = popupafterclose ? popupafterclose : function () { };

    $.mobile.activePage.append(template).trigger("create");

    $.mobile.activePage.find("#errorPopup").popup().popup("open").bind({
        popupafterclose: function () {
            $(this).unbind("popupafterclose").remove();

        }
    });
}

function showSuccessPopUp(popupafterclose, message) {

    var template = "<div data-role='popup' id='successPopup' data-dismissible='false' class='ui-content messagePopup' data-history='false'>"
        + "<div data-role='header' role='banner' class='ui-header ui-bar-inherit success'><h1 class='popupHeaderConfirm'>" + getCommonTranslatedValue("successLabel") + "</h1></div> "
        + "<span class='messagePopUpContext'>" + message + " </span><a href='#' class='ui-btn ui-btn-inline newBtn' data-rel='back'>" + getCommonTranslatedValue("okLabel") + "</a> </div>";

    popupafterclose = popupafterclose ? popupafterclose : function () { };

    $.mobile.activePage.append(template).trigger("create");

    $.mobile.activePage.find("#successPopup").popup().popup("open").bind({
        popupafterclose: function () {
            $(this).unbind("popupafterclose").remove();
        }
    });
}

function showBarcodeSuccessPopUp(popupafterclose, message) {

    var template = "<div data-role='popup' id='successPopup' data-dismissible='false' class='ui-content messagePopup' data-history='false'>"
        + "<div data-role='header' role='banner' class='ui-header ui-bar-inherit success'><h1 class='popupHeaderConfirm'>" + getCommonTranslatedValue("successLabel") + "</h1></div> "
        + "<span class='messagePopUpContext'>" + message + " </span><a href='#' class='ui-btn ui-btn-inline newBtn' onClick='navigateToQuickLinks();'>" + getCommonTranslatedValue("okLabel") + "</a> </div>";

    popupafterclose = popupafterclose ? popupafterclose : function () { };

    $.mobile.activePage.append(template).trigger("create");

    $.mobile.activePage.find("#successPopup").popup().popup("open").bind({
        popupafterclose: function () {
            $(this).unbind("popupafterclose").remove();

        }
    });
}

function showErrorPopUpSplash(popupafterclose, message, isValid) {
    var template = "<div data-role='popup' data-dismissible='false' class='ui-content messagePopupSplash' data-history='false'>"
        + "<div data-role='header' role='banner' class='ui-header ui-bar-inherit custHeaderSplash'><h1 class='popupHeader'>!" + getCommonTranslatedValue("errorInformationLabel") + "</h1></div> "
        + "<span class='messagePopUpContextSplash'>" + message + " </span><a href='#' class='ui-btn ui-btn-inline newBtn' data-rel='back'>" + getCommonTranslatedValue("closeLabel") + "</a> </div>";


    popupafterclose = popupafterclose ? popupafterclose : function () { };

    $.mobile.activePage.append(template).trigger("create");

    $.mobile.activePage.find(".messagePopupSplash").popup().popup("open").bind({
        popupafterclose: function () {

            $(this).unbind("popupafterclose").remove();
            //closeSplashError(message);
            closeSplashError(isValid);

        }
    });
}

function showBillablePopUp(popupafterclose, message) {

    var template = "<div data-role='popup' id='billablePopup' data-dismissible='false' class='ui-content messagePopup' data-history='false'>"
        + "<div data-role='header' role='banner' class='ui-header ui-bar-inherit success'><h1 class='popupHeaderConfirm'>Billable</h1></div> "
        + "<span class='messagePopUpContext'>" + message + " </span><a href='#' class='ui-btn ui-btn-inline newBtn' data-rel='back'>" + getCommonTranslatedValue("okLabel") + "</a> </div>";

    popupafterclose = popupafterclose ? popupafterclose : function () { };

    $.mobile.activePage.append(template).trigger("create");

    $.mobile.activePage.find("#billablePopup").popup().popup("open").bind({
        popupafterclose: function () {
            $(this).unbind("popupafterclose").remove();

        }
    });
}

function closeSplashError(message) {

    //if (message == 'Invalid Email Address. Please enter correct Email Address. ') {
    if (message == 'Invalid ') {
        $("#UserNameTextBox").val('');
        $("#UserNameTextBox").textinput({
            clearBtn: true
        });

        var clearBtn = $("#UserNameTextBox").textinput("option", "clearBtn");
        $("#UserNameTextBox").textinput("option", "clearBtn", true);

        $("#PasswordTextBox").val('');
        $("#PasswordTextBox").textinput({
            clearBtn: true
        });
        var clearBtn = $("#PasswordTextBox").textinput("option", "clearBtn");
        $("#PasswordTextBox").textinput("option", "clearBtn", true);

    }
    //if (message == 'Invalid Password. ') {
    if (message == 'InvalidP') {
        $("#PasswordTextBox").val('');
        $("#PasswordTextBox").textinput({
            clearBtn: true
        });
        var clearBtn = $("#PasswordTextBox").textinput("option", "clearBtn");
        $("#PasswordTextBox").textinput("option", "clearBtn", true);
    }
    $(".messagePopupSplash").popup("close");
    $(".messagePopupSplash").html('');

    setTimeout(function () {
        if (getLocal("SSOUser") === "true") {
            window.location.href = window.location.href.replace("#splash", '');
        } else {
            $.mobile.changePage("index.html", "fade");
        }
    }, 500);
}


function showSSOEnabledPopUp(popupafterclose, message) {

    var template = "<div data-role='popup' id='ssoEnabledPopup' data-dismissible='false' class='ui-content messagePopup' data-history='false'>"
        // + "<div data-role='header' role='banner' class='ui-header ui-bar-inherit success'><h1 class='popupHeaderConfirm'>" + getCommonTranslatedValue("successLabel") + "</h1></div> "
        + "<span class='messagePopUpContext'>" + message + " </span></div>";

    //popupafterclose = popupafterclose ? popupafterclose : function () { };

    $.mobile.activePage.append(template).trigger("create");
    $.mobile.pageContainer.pagecontainer('getActivePage').find("> div").not(".ui-popup-container").addClass('blur-filter');

    $.mobile.activePage.find("#ssoEnabledPopup").popup().popup("open").bind({
        popupafterclose: function () {
            $(this).unbind("popupafterclose").remove();
            $('.blur-filter').removeClass('blur-filter');
        }
    });
}

////$("#ssoEnabledPopup").on("popupbeforeposition", function () {
////    $.mobile.pageContainer.pagecontainer("getActivePage")
////        .not(this) /* exclude popup */
////        .addClass("blur-filter");
////}).on("popupafterclose", function () {
////    $(".blur-filter")
////        .removeClass("blur-filter");
////});

/**************end common popup *************/

/*******************Site Labels*****************/

function getSiteLabels(source) {
    var myJsonObject = {
        "databaseId": decryptStr(getLocal("DatabaseID")),
        "language": getLocal("Language"),
        "databaseName": decryptStr(getLocal("databaseName")),
        "source": source
    };

    var connectionString = standardAddress + "CreateServiceRequest.svc/SetSiteLabels";
    $.postJSON(connectionString, myJsonObject, function (data) {
        if (data != null) {
            if (source === "Main") {
                setLocal("Level1", data["Level_1"]);
                setLocal("Level2", data["Level_2"]);
                setLocal("Level3", data["Level_3"]);
                setLocal("Level4", data["Level_4"]);

                if (decryptStr(getLocal("MSIClientCode")) === "IO" && getLocal("Language") === "fr-FR") {
                    setLocal("Level1", getTranslatedValue("Level_1"));
                    setLocal("Level2", getTranslatedValue("Level_2"));
                    setLocal("Level3", getTranslatedValue("Level_3"));
                    setLocal("Level4", getTranslatedValue("Level_4"));
                }
            }
            if (source === "Ref_1") {
                setLocal("Ref1", data["AltCustLbl"]);
            }
            if (source === "Ref_2") {
                setLocal("Ref2", data["AltCustLbl"]);
            }
        }
    });
}
/*****************Site Labels End***************/

/*************************Help********************/
function navigateToHelp() {
    $.mobile.changePage("Help.html");
}
/***********************Help End********************/

/****** loading image ******************/
function loadingImage() {
    $("div").addClass('ui-disabled');
    $.mobile.loading('show', {
        text: 'Loading',
        textVisible: true,
        theme: 'b',
        textonly: false,
        html: ""
    });
}
function hideImage() {
    var interval = setTimeout(function () {
        $("div").removeClass('ui-disabled');
        $.mobile.loading('hide');
        clearInterval(interval);
    }, 500);
}
/*****************end load ***************/


/**** Phone Number Validation *************/
// Declaring required variables
var digits = "0123456789";
// non-digit characters which are allowed in phone numbers
var phoneNumberDelimiters = "()- ";
// characters which are allowed in international phone numbers
// (a leading + is OK)
var validWorldPhoneChars = phoneNumberDelimiters + "+";
// Minimum no of digits in an international phone no.
var minDigitsInIPhoneNumber = 10;

function isInteger(s) {
    var i;
    for (i = 0; i < s.length; i++) {
        // Check that current character is number.
        var c = s.charAt(i);
        if (((c < "0") || (c > "9"))) return false;
    }
    // All characters are numbers.
    return true;
}
function trim(s) {
    var i;
    var returnString = "";
    // Search through string's characters one by one.
    // If character is not a whitespace, append to returnString.
    for (i = 0; i < s.length; i++) {
        // Check that current character isn't whitespace.
        var c = s.charAt(i);
        if (c != " ") returnString += c;
    }
    return returnString;
}
function stripCharsInBag(s, bag) {
    var i;
    var returnString = "";
    // Search through string's characters one by one.
    // If character is not in bag, append to returnString.
    for (i = 0; i < s.length; i++) {
        // Check that current character isn't whitespace.
        var c = s.charAt(i);
        if (bag.indexOf(c) == -1) returnString += c;
    }
    return returnString;
}

function checkInternationalPhone(strPhone) {
    var bracket = 3
    strPhone = trim(strPhone)
    if (strPhone.indexOf("+") > 1) return false
    if (strPhone.indexOf("-") != -1) bracket = bracket + 1
    if (strPhone.indexOf("(") != -1 && strPhone.indexOf("(") > bracket) return false
    var brchr = strPhone.indexOf("(")
    if (strPhone.indexOf("(") != -1 && strPhone.charAt(brchr + 2) != ")") return false
    if (strPhone.indexOf("(") == -1 && strPhone.indexOf(")") != -1) return false
    s = stripCharsInBag(strPhone, validWorldPhoneChars);
    return (isInteger(s) && s.length >= minDigitsInIPhoneNumber);
}

/****/
function securityError(textId) {
    var str = textId.val();
    if (str != undefined) {
        str = str.replace(/<br>/gi, "\n");
        str = str.replace(/<p.*>/gi, "\n");
        str = str.replace(/<a.*href="(.*?)".*>(.*?)<\/a>/gi, " $2 (Link->$1) ");
        str = str.replace(/<(?:.|\s)*?>/g, "");
        //    str = str.replace(/<b>/, "");
        //    str = str.replace("&lt;/b&gt;", "");
        //    str = str.replace("&lt;i&gt;", "");
        //    str = str.replace("&lt;/i&gt;", "");
        //    str = str.replace("&lt;", "");
        //    str = str.replace("&gt;", "");
        //    str = str.replace("&#39;", "");
        //    str = str.replace("&quot;", "");

        if ($.trim(str) == '' && textId.val().length > 0) {
            setTimeout(function () {
                hideImage();
                showErrorPopUp(true, "Please Enter Valid Information");
                textId.val('');
            }, 1000);
        }
    }
    return $.trim(str);
}

/**
*To close settings popup
**/

function LoginSettings_closeButtonClick() {
    $('#DataBaseName').blur();
    $("#LoginSettingsPopUp").popup("close");
}



if (typeof String.prototype.startsWith != 'function') {
    // see below for better implementation!
    String.prototype.startsWith = function (str) {
        return this.indexOf(str) === 0;
    };
}
if (typeof String.prototype.endsWith != 'function') {
    String.prototype.endsWith = function (str) {
        return this.slice(-str.length) == str;
    };
}

/**
* Converting Date string to YYYY-MM-DD Format
*/
function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

/**
*
*/
function Dateformat(date) {
    Globalize.culture(getLocal("Language"));

    var day = date.split("-");

    //var dateString = Date(date.replace(/(\d{2}).(\d{2}).(\d{4})/, "$2/$1/$3"));
    var newDate = new Date(date.replace(/(\d{2}).(\d{2}).(\d{4})/, "$2/$1/$3"));
    //var newDate = new Date(date);

    var dateDiff = parseInt(day[2]) - newDate.getDate();

    if (dateDiff != 0) {
        if (parseInt(day[2]) === 1) {
            dateDiff = 1;
        }
        newDate.setDate(newDate.getDate() + dateDiff);
    }
    var formattedDate = Globalize.format(newDate, Globalize.culture().calendar.patterns.d); // Sat Feb 01 2003
    return formattedDate;
}

function DefaultDateformat(date) {
    if (getLocal("Language").toLowerCase() != "en-us") {
        Globalize.culture("en-US");

        var day = date.split("-");
        //var dateString = Date(date.replace(/(\d{2}).(\d{2}).(\d{4})/, "$2/$1/$3"));
        var newDate = new Date(date.replace(/(\d{2}).(\d{2}).(\d{4})/, "$2/$1/$3"));
        //var newDate = new Date(date);

        var dateDiff = parseInt(day[2]) - newDate.getDate();

        if (dateDiff != 0) {
            if (parseInt(day[2]) === 1) {
                dateDiff = 1;
            }
            newDate.setDate(newDate.getDate() + dateDiff);
        }
        var formattedDate = Globalize.format(newDate, Globalize.culture().calendar.patterns.d); // Sat Feb 01 2003
        return formattedDate;
    }
    return date;
}

function textareaLimit(max) {

    var maxLength = max;
    $('textarea').keyup(function () {
        var length = $(this).val().length;
        var length = maxLength - length;
        $('#AddCommentCharLimitNos').text(length);
    });
}
function textareaLimitCR(max) {

    var maxLength = max;
    $('textarea').keyup(function () {
        var length = $(this).val().length;
        var length = maxLength - length;
    });
}

function SyncTranslation(screenName, callBack) {
    if (!IsStringNullOrEmpty(getLocal("Language")) && !IsStringNullOrEmpty(getLocal("DatabaseID"))) {
        var myJSONobject = {
            "userData": {
                "Language": getLocal("Language"),
                "DatabaseID": decryptStr(getLocal("DatabaseID"))
            },
            "xmlLastSyncDate": getLocal("XmlLastSyncDate"),
            "xmlLastSyncLanguage": getLocal("XmlLastSyncLanguage")
        };

        var dbID = ""
        if (getLocal("DatabaseID") == undefined || getLocal("DatabaseID") == null || getLocal("DatabaseID") == "") {
            dbID = document.getElementById("DataBaseName").value
            setLocal("DatabaseID", encryptStr(dbID));
        }
        else {
            dbID = decryptStr(getLocal("DatabaseID"));
        }

        if (standardAddress == undefined || standardAddress == null || standardAddress == "") {
            standardAddress = $.constants.STANDARDADDRESS_STRING + $.constants.DB_STRING + dbID + "iCRS/";
        }

        var accessURL = standardAddress;

        accessURL += "LoginAuthentication.svc/SyncTranslation";

        if (navigator.onLine) {
            $.postJSON(accessURL, myJSONobject, function (data) {
                if (!IsObjectNullOrUndefined(data) && data.isSyncRequired === true && !IsStringNullOrEmpty(data.xml)) {
                    setLocal("XmlTranslation", data.xml);
                    setLocal("XmlLastSyncDate", data.syncDate);
                    setLocal("XmlLastSyncLanguage", data.syncLanguage);

                    if (decryptStr(getLocal("MSIClientCode")) === "IO" && getLocal("Language") === "fr-FR") {
                        getTranslations("FrenchIO");
                    }

                    // To load the common strings used in application
                    getTranslations("CommonStrings");
                }

                if (callBack != null) {
                    callBack();
                }

                return;
            });
        }
    }
}

/******************************** Panel events***************************************/

$("#menu").panel({
    beforeopen: function (event, ui) {
        $(".lSAction").hide();
    }
});

$("#menu").panel({
    beforeclose: function (event, ui) {
        $(".lSAction").show();
    }
});
/******************************** Panel events***************************************/

// Method used to get the quicklinks details
function GetQuickLinkDetails() {
    var dbID = getLocal("DatabaseID");
    var dbName = getLocal("databaseName");
    var seqID = getLocal("seq");
    var callerType = getLocal("CallerTypeSeq");
    var JSONObject = {
        "quickLinksTransfer": {
            "CallerTypeSeq": callerType,
            "DatabaseID": decryptStr(getLocal("DatabaseID")),
            "DatabaseName": decryptStr(getLocal("databaseName")),
            "Language": getLocal("Language"),
            "Urlidentifier": getLocal("URLIdentifier"),
            "SeqID": seqID,
            "CustomerNumber": (getLocal("PreviousPage") == "Barcode" ? getLocal("BarcodeCustomerNumber") :
                (IsStringNullOrEmpty(getLocal("LatLongCustNumberForServiceReq")) ? getLocal("CustomerNumber") : getLocal("LatLongCustNumberForServiceReq"))),
            "CustomerSiteNumber": (getLocal("PreviousPage") == "Barcode" ? getLocal("BarcodeCustomerSiteNumber") :
                (IsStringNullOrEmpty(getLocal("LatLongCustSiteNumberForServiceReq")) ? getLocal("CustomerSiteNumber") : getLocal("LatLongCustSiteNumberForServiceReq")))
            //"CustomerNumber": IsStringNullOrEmpty(getLocal("LatLongCustNumberForServiceReq")) ? getLocal('CustomerNumber') : getLocal("LatLongCustNumberForServiceReq"),
            //"CustomerSiteNumber": IsStringNullOrEmpty(getLocal("LatLongCustSiteNumberForServiceReq")) ? getLocal('CustomerSiteNumber') : getLocal("LatLongCustSiteNumberForServiceReq")

        }
    };
    var accessURL = standardAddress + "LoadICRSQuickLinks.svc/LoadQuickLinks";

    $.postJSON(accessURL, JSONObject, function (data) {
        quickLinksData = data;
        if (!IsStringNullOrEmpty(getLocal("PreviousPage")) && getLocal("PreviousPage") != "splash") {
            quickLinksDashboard();
        } else {
            $.mobile.changePage("quickLinks.html");
        }
    });

}


///************** Function to Decrypt and Encrypt values

/**
* Method to encrypt the passed string.
* @param [string] encryptVal - The string value which needs to be decrypted.
*/
function decryptStr(encryptVal) {
    if (!IsStringNullOrEmpty(encryptVal)) {
        return CryptoJS.AES.decrypt(encryptVal, getLocal("valueABC").toString(CryptoJS.enc.Utf8)).toString(CryptoJS.enc.Utf8);
    }
    else {
        return "";
    }
}

/**
* Method to encrypt the passed string.
* @param [string] plainValue - The string value which needs to be encrypted.
*/
function encryptStr(plainValue) {
    if (!IsStringNullOrEmpty(plainValue)) {
        if (!isNaN(plainValue)) {
            return CryptoJS.AES.encrypt(String(plainValue), getLocal("valueABC").toString(CryptoJS.enc.Utf8));
        }
        else {
            return CryptoJS.AES.encrypt(plainValue, getLocal("valueABC").toString(CryptoJS.enc.Utf8));
        }
    }
    else {
        return "";
    }
}

function getEncryptedValue(plainText) {
    var key = CryptoJS.enc.Utf8.parse('8080808080808080');
    var iv = CryptoJS.enc.Utf8.parse('8080808080808080');

    var encryptedlogin = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(plainText), key,
        {
            keySize: 128 / 8,
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
    return encryptedlogin;
}

/*
* This file contains script to get lattitude and longitude
* 
*/
function getLocationAddress(callBack) {
    //Lat long will be fetched and stored in session variables
    //These variables will be used while storing data in local database

    if (!IsStringNullOrEmpty(getLocal("GPSLocation"))) {
        var coordinates = getLocal("GPSLocation").split(',');
        setLocal('latnew', coordinates[0]);
        setLocal('longnew', coordinates[1]);
        // For SSO user first time login gps location is not loading.
        setTimeout(function () {
            getLocationDetails(callBack);
        }, 500);

    } else {
        if (!IsStringNullOrEmpty(callBack)) {
            callBack();
        }
    }
}

/**
* Method to get the lcoation details based on current GPS location.
*/
function getLocationDetails(callBack) {
    if (navigator.onLine) {

        var myJsonObj = {
            "databaseID": decryptStr(getLocal("DatabaseID")),
            "databaseName": decryptStr(getLocal("databaseName")),
            "language": getLocal("Language"),
            "latitude": getLocal('latnew'),
            "longitude": getLocal('longnew')
        };
        var strURL = standardAddress + "LoadICRSQuickLinks.svc/GetLatLongDetails";
        $.postJSON(strURL, myJsonObj, function (data) {

            if (data.length > 0) {
                var presentLocationDetails = '';
                if (!IsStringNullOrEmpty(data[0].Description)) {
                    presentLocationDetails = data[0].Description;
                }
                if (!IsStringNullOrEmpty(data[0].City)) {
                    presentLocationDetails = IsStringNullOrEmpty(presentLocationDetails) ? '' : presentLocationDetails + ', ' + data[0].City;
                }
                if (!IsStringNullOrEmpty(data[0].State)) {
                    presentLocationDetails = IsStringNullOrEmpty(presentLocationDetails) ? '' : presentLocationDetails + ', ' + data[0].State;
                }
                if (!IsStringNullOrEmpty(data[0].PostalCode)) {
                    presentLocationDetails = IsStringNullOrEmpty(presentLocationDetails) ? '' : presentLocationDetails + ', ' + data[0].PostalCode;
                }
                setLocal("CurrentLocationDetails", presentLocationDetails);
                setLocal("LatLongRegionNumber", data[0].RegionNumber);
                setLocal("LatLongDivisionNumber", data[0].DivisionNumber);
                setLocal("LatLongDistrictNumber", data[0].DistrictNumber);
                setLocal("LatLongCustNumber", data[0].CustomerNumber);
                setLocal("LatLongCustSiteNumber", data[0].CustomerSiteNumber);
                setLocal("LatLongRegionNumberForServiceReq", data[0].RegionNumber);
                setLocal("LatLongDivisionNumberForServiceReq", data[0].DivisionNumber);
                setLocal("LatLongDistrictNumberForServiceReq", data[0].DistrictNumber);
                setLocal("LatLongCustNumberForServiceReq", data[0].CustomerNumber);
                setLocal("LatLongCustSiteNumberForServiceReq", data[0].CustomerSiteNumber);

                var qlPage = $.mobile.activePage.attr('id');
                if ("quickLinks" == qlPage) {
                    document.getElementById("currentLocation").innerHTML = getTranslatedValue("localtionLabel") + ": "
                        + (IsStringNullOrEmpty(getLocal("CurrentLocationDetails")) ? (IsStringNullOrEmpty(getLocal("Level2DescriptionOfCaller")) ? (IsStringNullOrEmpty(getLocal("currentLocationAddress")) ? "(" + getTranslatedValue("gpsNotActive") + ")" : getLocal("currentLocationAddress")) : getLocal("Level2DescriptionOfCaller")) : getLocal("CurrentLocationDetails"));
                }
            }
            else {
                setLocal("CurrentLocationDetails", "");
                setLocal("LatLongRegionNumber", "");
                setLocal("LatLongDivisionNumber", "");
                setLocal("LatLongDistrictNumber", "");
                setLocal("LatLongCustNumber", "");
                setLocal("LatLongCustSiteNumber", "");
                setLocal("LatLongRegionNumberForServiceReq", "");
                setLocal("LatLongDivisionNumberForServiceReq", "");
                setLocal("LatLongDistrictNumberForServiceReq", "");
                setLocal("LatLongCustNumberForServiceReq", "");
                setLocal("LatLongCustSiteNumberForServiceReq", "");
            }
            if (!IsStringNullOrEmpty(callBack)) {
                callBack(); // GetQuickLinkDetails();
            }
        });

        var myJsonObj = {
            "databaseID": decryptStr(getLocal("DatabaseID")),
            "databaseName": decryptStr(getLocal("databaseName")),
            "language": getLocal("Language"),
            "customerNumber": getLocal('CustomerNumber'),
            "customerSiteNumber": getLocal('CustomerSiteNumber')
        };

        var strURL = standardAddress + "LoadICRSQuickLinks.svc/GetCallerLevel2Value";
        $.postJSON(strURL, myJsonObj, function (data) {
            setLocal("Level2DescriptionOfCaller", data["Description"]);

        });

        var latdegrees = getLocal('latnew');
        var londegrees = getLocal('longnew');
        var url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + latdegrees + "," + londegrees;
        $.getJSON(url, function (data, textStatus) {
            var streetaddress = data.results[1] ? data.results[1].formatted_address : "";
            setLocal("currentLocationAddress", streetaddress);
        });
    } else {
        setTimeout(function () {
            hideImage();
            showErrorPopUp(true, noNetworkTranslation);
        }, 1000);
    }
}


function countDown() {
    var seconds_left = 10;
    var interval = setInterval(function () {
        document.getElementById('timer_div').innerHTML = --seconds_left;

        if (seconds_left <= 0) {
            document.getElementById('timer_div').innerHTML = "You are Ready!";
            clearInterval(interval);
        }
    }, 1000);
}

/**
* Method to record the speech.
*/
function recordVoice() {
    // Verify if recognition is available
    if (window.plugins.speechRecognition) {
        window.plugins.speechRecognition.isRecognitionAvailable(function (available) {
            if (!available) {
                showErrorPopUp(true, "Sorry, not available");
            }

            // Check if has permission to use the microphone
            window.plugins.speechRecognition.hasPermission(function (isGranted) {
                if (isGranted) {
                    startRecognition();
                } else {
                    // Request the permission
                    window.plugins.speechRecognition.requestPermission(function () {
                        // Request accepted, start recognition
                        startRecognition();
                    }, function (err) {
                        showErrorPopUp(true, err);
                    });
                }
            }, function (err) {
                showErrorPopUp(true, err);
            });
        }, function (err) {
            showErrorPopUp(true, err);
        });
    }
}

/**
* Method used to capture the speech.
*/
function startRecognition() {
    $("#recordVoiceLabel").show();
    window.plugins.speechRecognition.startListening(function (result) {
        // Show results in the console
        //alert(result);
        //$("#recordVoiceLabel").hide();
        $("#DescriptionText").val($("#DescriptionText").val() + " " + result);
        //console.log(result);
    }, function (err) {
        //showErrorPopUp(true, err);
    }, {
            language: "en-US",
            matches: 1,
            showPartial: false
        });

    setTimeout(function () {
        window.plugins.speechRecognition.stopListening(function () {
            $("#recordVoiceLabel").hide();
        }, function (err) {

        });

    }, 10000);
}

/**
* Method to scan QR code.
*/
function scanBarcode() {
    cordova.plugins.barcodeScanner.scan(
        function (result) {

            setLocal("BarcodeCustomerNumber", JSON.parse(result.text).CustomerNumber);
            setLocal("BarcodeCustomerSiteNumber", JSON.parse(result.text).CustomerSiteNumber);

            var myJsonObject = {
                "locationDetails": {
                    "DataBaseID": decryptStr(getLocal("DatabaseID")),
                    "CustomerNumber": getLocal("BarcodeCustomerNumber"),
                    "CustomerSiteNumber": getLocal("BarcodeCustomerSiteNumber"),
                    "DatabaseName": decryptStr(getLocal("databaseName")),
                    "Language": getLocal("Language"),
                    "Seq": getLocal("seq"),
                    "Level": 0
                }
            };

            var accessURL = standardAddress + "CreateServiceRequest.svc/GetLocationDetails";

            $.postJSON(accessURL, myJsonObject, function (data) {
                if (!IsStringNullOrEmpty(data)) {
                    var locationDetails = data;
                    setLocal("BarcodeRegionNumber", locationDetails.RegionNumber);
                    setLocal("BarcodeDivisionNumber", locationDetails.DivisionNumber);
                    setLocal("BarcodeDistirictNumber", locationDetails.DistrictNumber);
                    setLocal("PreviousPage", "Barcode");
                    showBarcodeSuccessPopUp(true, "Location detected successfully. Continue creating work order using Quick links.");
                } else {
                    showErrorPopUp(true, "Could not find the location. Please try again or scan the valid QR code.");
                }
            });
        },
        function (error) {
            alert("Scanning failed: " + error);
        },
        {
            preferFrontCamera: false, // iOS and Android
            showFlipCameraButton: true, // iOS and Android
            showTorchButton: true, // iOS and Android
            torchOn: false, // Android, launch with the torch switched on (if available)
            saveHistory: false, // Android, save scan history (default false)
            prompt: "Place a barcode inside the scan area", // Android
            resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
            formats: "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
            //orientation: "", // Android only (portrait|landscape), default unset so it rotates with the device
            disableAnimations: true, // iOS
            disableSuccessBeep: false // iOS and Android
        }
    );
}

/**
* Method to configure back button.
*/
function configureBackButton() {
    //var devicePlatform = device.platform;
    var devicePlatform = "android";
    if (devicePlatform.toLowerCase() == "android") {
        $("#backButton").hide();
    } else if (devicePlatform.toLowerCase() == "ios") {
        $("#menuBar").addClass("menuBarWithBackiOS");
        $("#scanButton").addClass("scanBarcodeWithBackiOS");
    }
}

/**
* Method used to navugate to Quivk link screen.
*/
function navigateToQuickLinks() {
    if ($.mobile.activePage.attr('id') != "quickLinks") {
        $.mobile.changePage("quickLinks.html", "fade");
    }

    $("#successPopup").popup("close");
}

/**
* To get the date difference - related to SSO.
*/
function getSSODateDiff() {

    var lastUpdated = new Date(getLocal("SSOTokenLastUpdated"));
    var currentDate = new Date(getCurrentDate());
    //var timeDiff = Math.abs(currentDate.getTime() - lastUpdated.getTime());
    var timeDiff = Math.abs(currentDate.getDate() - lastUpdated.getDate());
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    //var timeDiff = Math.abs(currentDate - lastUpdated);
    //var diffDays = Math.ceil((timeDiff / 1000)/60);
    return diffDays;
}

/**
* This is a base object constructor for all json objects in the application to extend so
* they don't need to manually add all required params for ajax calls. It includes
* all common params that should be added to every json object for an ajax call.
* @param {Object} newParams - the new params that are being extended into the new json object.
* @returns {Object} - JSON object with required params.
*/
function iCRSJsonObject(newParams) {
    return $.extend({}, newParams, {
        "DatabaseID": decryptStr(getLocal("DatabaseID")),
        "Language": getLocal("Language"),
        "EmployeeNumber": decryptStr(getLocal("EmployeeNumber")),
        "SessionID": decryptStr(getLocal("SessionID")),
        "Application": getLocal("Module")
    });
};
