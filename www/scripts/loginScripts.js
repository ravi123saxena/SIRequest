function logOnButtonClick() {
    if (navigator.onLine) {
        var page = $("#" + loginPageID);
        var Databasename = decryptStr(getLocal("DatabaseID"));
        var pattern = /[-!$%^#&*()_+|~=`{}\[\]:";'<>?,.\/]/;
        var isUserNameSpecialChar = pattern.test(userName);
        var isPasswordSpecialChar = pattern.test(password);
        var errorMessage = "";
        var validationSuccess = true;
        setLocal("SSOUser", "false");
        $.constants.STANDARDADDRESS_STRING = getLocal("URL_STANDARDADDRESS_STRING");
        standardAddress = getLocal("URL_STANDARDADDRESS_STRING") + $.constants.DB_STRING + decryptStr(getLocal("DatabaseID")) + "iCRS/";

        if (IsStringNullOrEmpty(getLocal("DatabaseID"))) {
            errorMessage += IsStringNullOrEmpty(getTranslatedValue("CustomerIDLabel")) ? customerIDTranslation : getTranslatedValue("CustomerIDLabel");
            validationSuccess = false;
        }

        if (IsStringNullOrEmpty(getLocal("Language"))) {
            if (!IsStringNullOrEmpty(errorMessage)) {
                errorMessage += ", ";
            }
            errorMessage += IsStringNullOrEmpty(getTranslatedValue("LanguageLabel")) ? languageTranslation : getTranslatedValue("LanguageLabel");
            validationSuccess = false;
        }

        if (IsStringNullOrEmpty($("#UserNameTextBox").val())) {
            if (!IsStringNullOrEmpty(errorMessage)) {
                errorMessage += ", ";
            }
            errorMessage += IsStringNullOrEmpty(getTranslatedValue("UserNamePlaceHolder")) ? userNameTranslation : getTranslatedValue("UserNamePlaceHolder");
            validationSuccess = false;
        }

        if (IsStringNullOrEmpty($("#PasswordTextBox").val())) {
            if (!IsStringNullOrEmpty(errorMessage)) {
                errorMessage += ", ";
            }
            errorMessage += IsStringNullOrEmpty(getTranslatedValue("PasswordPlaceHolder")) ? passwordTranslation : getTranslatedValue("PasswordPlaceHolder");
            validationSuccess = false;
        }

        if (validationSuccess) {
            var securityIdForUserName;
            $('.splash').empty();
            securityIdForUserName = securityError($("#UserNameTextBox"));

            if (securityIdForUserName == "") {
                return false;
            }

            var securityIdForPassword;
            securityIdForPassword = securityError($("#PasswordTextBox"));

            if (securityIdForPassword == "") {
                return false;
            }

            var userName = securityIdForUserName;
            var password = securityIdForPassword;

            setTimeout(function () {
                syncConfig();
                GetCompanyDefaultValues();
                SyncTranslation("Login", LoginSettings_SyncTranslationComplete);
            }, 1500);

            setLocal("userName", encryptStr(userName));
            setLocal("password", getEncryptedValue(password));
            setLocal("password1", encryptStr(password));
            getMyLocation();
            var lat = page.find('#LatitudeHiddenFieldValue').val();
            var long = page.find('#LongitudeHiddenFieldValue').val();
            if (!$('#rememberMe').is(':checked')) {
                setLocal("rememberMe", "0");
            }

            setTimeout(function () {
                splashScreen();
            }, 3000);
        }
        else {
            setLocal("rememberMe", "0");
            setTimeout(function () {
                showErrorPopUp(true, errorMessage + " " + (IsStringNullOrEmpty(getTranslatedValue("CannotBeEmptyLabel")) ? cannotBeEmptyTranslation : getTranslatedValue("CannotBeEmptyLabel")));
            }, 500);
        }
    }
    else {

        setTimeout(function () {
            showErrorPopUp(true, noNetworkTranslation);
        }, 1000);
    }
}

function splashScreen() {
    $.mobile.changePage("#splash", "fade");
}


function hideSplash() {
    var page = $("#" + loginPageID);
    var userName = decryptStr(getLocal("userName"));
    var password = decryptStr(getLocal("password1"));
    var databaseName = decryptStr(getLocal("DatabaseID"));
    var loginURL = '';
    $.constants.STANDARDADDRESS_STRING = getLocal("URL_STANDARDADDRESS_STRING");
    DatabaseConnection = databaseName.charAt(0).toUpperCase();
    standardAddress = $.constants.STANDARDADDRESS_STRING + $.constants.DB_STRING + decryptStr(getLocal("DatabaseID")) + "iCRS/";
    var connectionStringURL = standardAddress + "LoginAuthentication.svc/GetClientDbDetails";
    var logAttempt = IsStringNullOrEmpty(getLocal("LoginAttempts")) ? 0 : getLocal("LoginAttempts");
    if (isNaN(logAttempt)) {
        logAttempt = 0;
    }
    getMyLocation();
    setLocal("PreviousPage", null);
    //getLocationAddress(GetQuickLinkDetails);

    var myJSONobject = {
        "databaseID": databaseName,
        "language": getLocal("Language"),
        "userName": userName,
        "password": password,
        "databaseName": decryptStr(getLocal("databaseName")),
        "loginAttempt": logAttempt,
        "gpsLocation": getLocal("GPSLocation")
    };
    if (getLocal("SSOUser") === "true") {
        myJSONobject = {
            "loginDetails": {
                "DatabaseID": databaseName,
                "Language": getLocal("Language"),
                "DatabaseName": decryptStr(getLocal("databaseName")),
                "AltKey": decryptStr(getLocal("SSOToken")),
                "GPSLocation": getLocal("GPSLocation")
            }
        };
        //console.log(JSON.stringify(myJSONobject));
        //getLocationAddress(testLocation);
        loginURL = standardAddress + "LoginAuthentication.svc/AuthenticateSSOUser";
        loginSSO(loginURL, myJSONobject);

    } else {
        loginURL = standardAddress + "LoginAuthentication.svc/Authenticate";
        login(loginURL, myJSONobject, DatabaseConnection);
    }

}

function getMyLocation() {
    try {
        function handler(location) {
            messageLatitude = location.coords.latitude;
            messageLongitude = location.coords.longitude;
            var page = $("#" + loginPageID);
            page.find('#LatitudeHiddenFieldValue').val(messageLatitude.toFixed(6));
            page.find('#LongitudeHiddenFieldValue').val(messageLongitude.toFixed(6));
            setLocal("GPSLocation", messageLatitude.toFixed(6) + ',' + messageLongitude.toFixed(6));

            // after allow assigning value
            getLocationAddress(testLocation);
        }
        navigator.geolocation.getCurrentPosition(handler);
    }
    catch (err) {
    }
}

function testLocation() {
    console.log("testlocation");
}


function getLanguages() {

    if (getActiveLanguagesResponse !== null) {
        // getActiveLanguagesResponse.abort();
    }

    var page = $("#" + loginPageID);
    //var databaseID = '';
    page.find("#SettingsPopUpWaitLabel").text('').show();


    var databaseName = page.find('#DataBaseName');
    supportedLanguagesDropDown = page.find("#SupportedLanguagesDropDown");

    var settingsPopUpMessageLabel = page.find("#SettingsPopUpMessageLabel");
    settingsPopUpMessageLabel.hide();

    supportedLanguagesDropDown.empty();
    var selectOption = document.createElement("option");
    selectOption.setAttribute("value", "-1");
    selectOption.innerHTML = IsStringNullOrEmpty(getTranslatedValue("LanguageLabel")) ? langOptionTranslation : "-" + getTranslatedValue("LanguageLabel") + "-";
    supportedLanguagesDropDown.append(selectOption);

    supportedLanguagesDropDown.children("option:eq(0)").attr("selected", true);

    supportedLanguagesDropDown.selectmenu("refresh");
    if (databaseName.val().length >= 3 && navigator.onLine) {
        databaseID = databaseName.val();
        $.constants.DB_STRING = $.constants.WEB_OR_MOB00;

        var clientNotation = databaseID.charAt(0);

        if (databaseName.val().length == 4) {
            databaseID = databaseID.substring(1, 4);
            if (databaseID == '540' && isNaN(clientNotation) ? clientNotation.toLowerCase() : clientNotation == 'u') {
                $.constants.DB_STRING = 'USO00';
            }
        }

        var isCharRegex = /^[a-zA-Z]+$/;
        if ((databaseName.val().length == 3 && !isNaN(clientNotation)) || (databaseName.val().length == 4 && clientNotation.match(isCharRegex))) {
            var myJSONobject = {
                "databaseID": databaseID,
                "databaseName": databaseID
            };
            var accessURL = $.constants.STANDARDADDRESS_STRING + $.constants.DB_STRING + databaseID + "iCRS/LoginAuthentication.svc/GetActiveLanguages";

            $("#SettingsPopUpWaitLabel").text(IsStringNullOrEmpty(getTranslatedValue("WaitLabel")) ? "Please wait.." : getTranslatedValue("WaitLabel")).show();
            getActiveLanguages(myJSONobject, accessURL);
        }

    }
    else {
        supportedLanguagesDropDown.selectmenu("enable", true).selectmenu("refresh");
        page.find("#SettingsPopUpWaitLabel").hide();
    }
}

// Method used when Database Id field is changed in Settings popup.
function LoginSettings_DatabaseNameChanged() {

    if (getActiveLanguagesResponse !== null) {
        // getActiveLanguagesResponse.abort();
    }

    var page = $("#" + loginPageID);

    page.find("#SettingsPopUpWaitLabel").text('').show();

    var databaseName = page.find('#DataBaseName');
    supportedLanguagesDropDown = page.find("#SupportedLanguagesDropDown");

    var settingsPopUpMessageLabel = page.find("#SettingsPopUpMessageLabel");
    settingsPopUpMessageLabel.hide();

    supportedLanguagesDropDown.empty();
    var selectOption = document.createElement("option");
    selectOption.setAttribute("value", "-1");
    selectOption.innerHTML = IsStringNullOrEmpty(getTranslatedValue("LanguageLabel")) ? langOptionTranslation : "-" + getTranslatedValue("LanguageLabel") + "-";
    supportedLanguagesDropDown.append(selectOption);

    supportedLanguagesDropDown.children("option:eq(0)").attr("selected", true);

    supportedLanguagesDropDown.selectmenu("refresh");
    if (databaseName.val().length == 3 && navigator.onLine) {
        var connectionStringUrl = $.constants.SETTINGS_STRING + $.constants.USREGIONFIRSTCALL;
        connectionStringUrl = connectionStringUrl + "LoginAuthentication.svc/GetDatabaseServer";
        var myJSONobject = {
            "databaseID": databaseName.val()
        };
        $("#SettingsPopUpWaitLabel").text(IsStringNullOrEmpty(getTranslatedValue("WaitLabel")) ? "Please wait.." : getTranslatedValue("WaitLabel")).show();

        $.ajax({
            url: connectionStringUrl,
            type: "post",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            processData: true,
            data: JSON.stringify(myJSONobject),
            success: function (result, textStatus, jqXHR) {
                $("#SettingsPopUpWaitLabel").text(IsStringNullOrEmpty(getTranslatedValue("WaitLabel")) ? "Please wait.." : getTranslatedValue("WaitLabel")).show();
                data = JSON.parse(result);
                $.constants.STANDARDADDRESS_STRING = data ? data : $.constants.SETTINGS_STRING;
                //setLocal("DatabaseID", databaseName.val());
                var myJSONobject = {
                    "databaseID": databaseName.val()
                };

                setLocal("DatabaseID", databaseName.val());

                if (!data || data.length === 0) {
                    supportedLanguagesDropDown.selectmenu("enable", true).selectmenu("refresh");
                    page.find("#SettingsPopUpWaitLabel").hide();
                    settingsPopUpMessageLabel.text(invalidDatabaseTranslation).show();
                }
                else if (data == "EMPTY_URL") {
                    setLocal("URL_STANDARDADDRESS_STRING", $.constants.SETTINGS_STRING);
                    $.constants.STANDARDADDRESS_STRING = $.constants.SETTINGS_STRING;
                    getLanguages(databaseName.val());
                }
                else {
                    var updated_Url = data ? data : $.constants.SETTINGS_STRING;
                    setLocal("URL_STANDARDADDRESS_STRING", updated_Url);
                    $.constants.STANDARDADDRESS_STRING = updated_Url;
                    getLanguages(databaseName.val());
                }
            },
            error: function (data) {

                hideImage();
                var responseText = data.responseText ? data.responseText : "";
                var errorMessage = responseText["ErrorDetails"];
                if (!errorMessage && errorMessage != '') {
                    page.find("#SettingsPopUpWaitLabel").text(errorMessage).show();
                }
                else {

                    page.find("#SettingsPopUpWaitLabel").text(IsStringNullOrEmpty(getTranslatedValue("InvalidDatabase")) ? errorMessge2 : getTranslatedValue("InvalidDatabase")).show();
                }
                return;
            }
        });
    }
    else {
        supportedLanguagesDropDown.selectmenu("enable", true).selectmenu("refresh");
        page.find("#SettingsPopUpWaitLabel").hide();
    }
}



function getActiveLanguages(myJSONobject, accessURL) {
    var page = $("#" + loginPageID);
    var settingsPopUpMessageLabel = page.find("#SettingsPopUpMessageLabel");

    getActiveLanguagesResponse = $.postJSON(accessURL, myJSONobject, function (data) {
        supportedLanguagesTemp = JSON.stringify(data[0]);

        for (var arrayCount = 0; arrayCount < data[0].length; arrayCount++) {
            var option = document.createElement("option");
            option.setAttribute("value", data[0][arrayCount].LangAbbrv);
            option.innerHTML = data[0][arrayCount].LangAlias;
            supportedLanguagesDropDown.append(option);
        }

        setLocal("Theme", data[1].Theme);
        //setLocal("databaseName", data.databaseName);
        valueImp = CryptoJS.AES.encrypt(data[1].Key, "a1b2c3");
        valueABC = CryptoJS.AES.decrypt(valueImp, "a1b2c3")
        setLocal("valueABC", valueABC);
        setLocal("databaseName", encryptStr(data[1].DatabaseName));

        //SSO related configuration
        setLocal("iCRS_SSOAuthURL", data[1].iCRS_SSOAuthURL);
        if (data[1].iCRS_SSOEnabled != undefined) {
            if (data[1].iCRS_SSOEnabled.toLowerCase() == 'true') {
                setLocal("SSOUser", true);
            } else {
                setLocal("SSOUser", false);
            }
        }

        supportedLanguagesDropDown.selectmenu("enable", true).selectmenu("refresh");
        page.find("#SettingsPopUpWaitLabel").hide();

        standardAddress = $.constants.STANDARDADDRESS_STRING + $.constants.DB_STRING + databaseID + "iCRS/";
    }, function () {
        // Error function
        supportedLanguagesDropDown.selectmenu("enable", true).selectmenu("refresh");
        page.find("#SettingsPopUpWaitLabel").hide();
        settingsPopUpMessageLabel.text(invalidDatabaseTranslation).show();
    });
}

function LoginSettings_SaveButtonClick() {
    var page = $("#" + loginPageID);
    page.find("#DataBaseName").blur();
    page.find("#SupportedLanguagesDropDown").blur();

    if (navigator.onLine) {
        if (getLocal("SSOUser") == "true") {
            $.mobile.activePage.find("#LoginSettingsPopUp").popup("close");
            setTimeout(function () {
                $.mobile.activePage.find("#ssoEnabledPopup").popup("close");
                saveLanguageSettings();
            }, 4000);
            setLocal("iCRSSSOLogoutIsVisible", true);
            showSSOEnabledPopUp(true, "Your company has enabled single sign-on. We're redirecting you to company authentication service.");
        } else {
            saveLanguageSettings();
        }
    }
    else {
        page.find("#SettingsPopUpMessageLabel").text(noNetworkTranslation).show();
        hideImage();
    }
}

function saveLanguageSettings() {
    var page = $("#" + loginPageID);
    loadingImage();
    var databaseName = page.find('#DataBaseName');
    var supportedLanguagesDropDown = page.find("#SupportedLanguagesDropDown");

    if (!IsObjectNullOrUndefined(databaseName) && !IsObjectNullOrUndefined(supportedLanguagesDropDown)) {
        var errorMessage = "";
        var validationSuccess = true;

        if (IsStringNullOrEmpty(databaseName.val())) {
            errorMessage += IsStringNullOrEmpty(getTranslatedValue("CustomerIDLabel")) ? customerIDTranslation : getTranslatedValue("CustomerIDLabel");
            validationSuccess = false;
        }

        if (IsStringNullOrEmpty(supportedLanguagesDropDown.val()) || supportedLanguagesDropDown.val() == "-1") {
            if (!IsStringNullOrEmpty(errorMessage)) {
                errorMessage += ", ";
            }

            errorMessage += IsStringNullOrEmpty(getTranslatedValue("LanguageLabel")) ? languageTranslation : getTranslatedValue("LanguageLabel");
            validationSuccess = false;
        }

        if (validationSuccess) {
            if (getLocal("Theme") === 'Insight') {
                $('link[href="css/style_crossform.css"]').attr('href', 'css/style_insight.css');
            }
            else {
                $('link[href="css/style_insight.css"]').attr('href', 'css/style_crossform.css');
            }
            page.find("#SettingsPopUpWaitLabel").show();
            page.find("#DataBaseNameValueLabel").text(databaseName.val());
            setLocal("SupportedLanguages", supportedLanguagesTemp);
            setLocal("Language", supportedLanguagesDropDown.val());
            setLocal("LanguageName", supportedLanguagesDropDown.children(":selected").text());
            setLocal("DatabaseID", encryptStr(databaseID));
            if (!IsStringNullOrEmpty(getLocal("PreviousDatabase"))) {
                if (decryptStr(getLocal("PreviousDatabase")) != decryptStr(getLocal("DatabaseID"))) {
                    setLocal("SSOToken", '');
                    setLocal("PreviousDatabase", getLocal("DatabaseID"));
                }
            } else {
                setLocal("PreviousDatabase", getLocal("DatabaseID"));
            }

            SyncTranslation("Login", LoginSettings_SyncTranslationComplete);
            //setTimeout( function(){
            GetConfigurationItems(supportedLanguagesDropDown.val());
            //}, 500);
        }
        else {
            setTimeout(function () {
                page.find("#SettingsPopUpMessageLabel").text(errorMessage + " " + (IsStringNullOrEmpty(getTranslatedValue("CannotBeEmptyLabel")) ?
                    cannotBeEmptyTranslation : getTranslatedValue("CannotBeEmptyLabel"))).show();
                hideImage();
            }, 500);
        }
    }
}


function GetConfigurationItems(language) {
    if (!IsStringNullOrEmpty(language)) {

        var dbID = "";
        if (getLocal("DatabaseID") == null || getLocal("DatabaseID") == undefined || getLocal("DatabaseID") == "") {
            dbID = document.getElementById("DataBaseName").value
        }
        else {
            dbID = decryptStr(getLocal("DatabaseID"))
        }

        var myJSONobject = {
            "databaseName": decryptStr(getLocal("databaseName")),
            "language": getLocal("Language"),
            "databaseID": dbID
        };
        // standardAddress = getLocal("standardAddress");
        $.constants.STANDARDADDRESS_STRING = getLocal("URL_STANDARDADDRESS_STRING");
        //DatabaseConnection = databaseName.charAt(0).toUpperCase();
        standardAddress = $.constants.STANDARDADDRESS_STRING + $.constants.DB_STRING + decryptStr(getLocal("DatabaseID")) + "iCRS/";

        var accessURL = standardAddress + "LoginAuthentication.svc/ReadConfigItems";

        if (navigator.onLine) {
            $.postJSON(accessURL, myJSONobject, function (data) {
                debugger;
                if (!IsObjectNullOrUndefined(data)) {
                    openDB();
                    dB.transaction(function (ts) {
                        ts.executeSql('DROP TABLE IF EXISTS ConfigCRS');
                        ts.executeSql('CREATE TABLE IF NOT EXISTS ConfigCRS (Item nvarchar(50),ItemValue nvarchar(1000))');
                    });
                    dB.transaction(function (tx) {
                        var l = data.length;
                        var sql = 'INSERT INTO ConfigCRS (Item,ItemValue) VALUES (?,?)';
                        var b;
                        for (var i = 0; i < l; i++) {
                            b = data[i];
                            var params = [b.Item, encryptStr(b.ItemValue)];
                            tx.executeSql(sql, params);
                        }

                    });

                    dB.transaction(function (ts) {
                        ts.executeSql('SELECT ItemValue FROM ConfigCRS where Item="RememberMe"', [],
                            function (ts, results) {
                                setLocal('rememberMeFlag', results.rows.item(0).ItemValue);
                                if (decryptStr(results.rows.item(0).ItemValue) == '0') {
                                    $(".ui-checkbox").hide();
                                } else {
                                    $(".ui-checkbox").show();
                                }
                            },
                            function (e, m, s) { log(e.status); });
                    });

                    LoadConfigurationItems();
                }
                return;
            });
        }
        else {
            setTimeout(function () {
                showErrorPopUp(true, noNetworkTranslation);
            }, 1000);
        }
    }

}

function DashBoard_SyncTranslationComplete() {
    LoadTranslation("DashBoard", null);
    //Sync the translations for CommonString all over the application.
    LoadTranslation("Common", null);
}

function ExecuteDropQuery(ts, query) {
    ts.executeSql(query, [], function () { }, function (e, m, s) { log(e.status); });
}

function DropandExecute() {
    var queryArray = new Array();
    queryArray.push('DROP TABLE IF EXISTS ConfigCRS');
    openDB();
    CreateTables();
}



function LoginSettings_CancelButtonClick() {
    var page = $("#" + loginPageID);
    page.find("#SupportedLanguagesDropDown").blur();
    page.find("#LoginSettingsPopUp").popup("close");
}

function LoginSettings_OpenPopUp() {

    var page = $("#" + loginPageID);

    var databaseName = page.find("#DataBaseName");
    var databaseID = decryptStr(getLocal("DatabaseID"));

    if (decryptStr(getLocal("DatabaseID")) != null) {
        $("#DataBaseName").text(decryptStr(getLocal("DatabaseID")));
    }

    page.find("#SettingsPopUpMessageLabel").hide();
    page.find("#SettingsPopUpWaitLabel").hide();

    if (!IsObjectNullOrUndefined(databaseName) && !IsStringNullOrEmpty(databaseID)) {
        databaseName.val(databaseID);
    }
    else {
        databaseName.val("");
    }

    var data = [];
    supportedLanguagesTemp = getLocal("SupportedLanguages");
    var supportedLanguagesDropDown = page.find("#SupportedLanguagesDropDown");
    supportedLanguagesDropDown.empty();

    var selectOption = document.createElement("option");
    selectOption.setAttribute("value", "-1");
    selectOption.innerHTML = IsStringNullOrEmpty(getTranslatedValue("LanguageLabel")) ? langOptionTranslation : "-" + getTranslatedValue("LanguageLabel") + "-";
    supportedLanguagesDropDown.append(selectOption);
    //supportedLanguagesDropDown.children("option:eq(0)").attr("selected", true);

    if (!IsStringNullOrEmpty(supportedLanguagesTemp)) {
        data = JSON.parse(supportedLanguagesTemp);

        if (!IsObjectNullOrUndefined(supportedLanguagesDropDown) && !IsObjectNullOrUndefined(data)) {
            for (var arrayCount = 0; arrayCount < data.length; arrayCount++) {
                var option = document.createElement("option");
                option.setAttribute("value", data[arrayCount].LangAbbrv);
                option.innerHTML = data[arrayCount].LangAlias;
                supportedLanguagesDropDown.append(option);
            }
        }
    } else {
        setTimeout(function () {
            $("#SupportedLanguagesDropDown option[value='-1']").attr('selected', 'selected');
            $("#SupportedLanguagesDropDown").selectmenu("refresh");
        }, 200);
    }
    supportedLanguagesDropDown.val(getLocal("Language"));
    setTimeout(function () {
        $("#settingsLabel").text(IsStringNullOrEmpty(getTranslatedValue("SettingsLabel")) ? "Settings" : getTranslatedValue("SettingsLabel"));
        $("#SettingsPopUpWaitLabel").text(IsStringNullOrEmpty(getTranslatedValue("WaitLabel")) ? "Please wait.." : getTranslatedValue("WaitLabel"));
        $("#SaveButton").text(IsStringNullOrEmpty(getTranslatedValue("SaveButton")) ? "Save" : getTranslatedValue("SaveButton"));
        $("#CancelButton").text(IsStringNullOrEmpty(getTranslatedValue("CancelButton")) ? "Cancel" : getTranslatedValue("CancelButton"));
        $("#DataBaseName").attr("placeholder", IsStringNullOrEmpty(getTranslatedValue("CustomerIDLabel")) ? "Customer ID" : getTranslatedValue("CustomerIDLabel"));
        $("#LoginSettingsPopUp").popup("open");
    }, 200);

    supportedLanguagesDropDown.selectmenu("refresh", true);
    setTimeout(function () {
        if (getLocal("SSOUser") == "true") {
            LoginSettings_SyncTranslationComplete();
        }
    }, 500);    
}

/// <summary>
/// Method to load translation completely.
/// </summary>
function LoginSettings_SyncTranslationComplete() {
    LoadScreenTranslation();
    //getMyLocation();
    //LoginSettings_LoadTranslationComplete();
    $("#" + loginPageID).find("#LoginSettingsPopUp").popup("close");
    if (getLocal("SSOUser") == "true") {
        if (!IsStringNullOrEmpty(getLocal("SSOToken"))) {
            if (decryptStr(getLocal("PreviousDatabase")) != decryptStr(getLocal("DatabaseID"))) {
                GetCompanyDefaultValues();
                getSSOToken(splashScreen);
                setLocal("PreviousDatabase", getLocal("DatabaseID"));
            } else {
                var diffDays = getSSODateDiff();
                setLocal("SSOUserClearcahceTrueOrFalse", "no");
                if (diffDays >= parseInt(decryptStr(getLocal("iCRSSSONoOfDaysToExpire"))) && !IsStringNullOrEmpty(getLocal("SSOToken"))) {
                    GetCompanyDefaultValues();
                    setLocal("SSOUserClearcahceTrueOrFalse", "yes");
                    getSSOToken(splashScreen);
                } else {
                    splashScreen();
                }
            }
        } else {
            GetCompanyDefaultValues();
            getSSOToken(splashScreen);
            setLocal("PreviousDatabase", getLocal("DatabaseID"));
        }
    }
}

/// <summary>
/// Method to get the SSO token fron client.
/// </summary>
function getSSOToken(callback) {
    setTimeout(function () {
        //SA - 21st June 2019
        //Reset the sessionid and SSOToken to prevent cached values.
        setLocal("SessionId", '');
        setLocal("SSOToken", null);

        var options = 'location=yes,clearsessioncache=yes,clearcache=yes';
        var ref = cordova.InAppBrowser.open(getLocal("iCRS_SSOAuthURL") + "?d=" + getCurrentDate(), '_blank', options);
        //SA - 21st June 2019
        //Removed as no longer required - ref.executeScript({ code: "localStorage.setItem( 'SSOTokenHiddenField', '' )" });
        ref.addEventListener('loadstart', function (event) {

        });

        ref.addEventListener("loadstop", function (event) {
            //SA - 21st June 2019
            //Tidied up to use the event and capture the value from the SSOTokenHiddenField
            //Only catch here is that only the SSOTokenHiddenField should be on the url otherwise this will fail
            if (event.url.indexOf('SSOTokenHiddenField') > -1) {
                var tokenId = event.url.split('SSOTokenHiddenField')[1].replace('=', '');
                console.log(tokenId);
                if (tokenId && decryptStr(getLocal("SSOToken")) != tokenId) {
                    setLocal("SSOToken", encryptStr(tokenId));
                    setLocal("SSOTokenLastUpdated", getCurrentDate());
                    $.constants.STANDARDADDRESS_STRING = getLocal("URL_STANDARDADDRESS_STRING");
                    standardAddress = getLocal("URadL_STANDARDADDRESS_STRING") + $.constants.DB_STRING + decryptStr(getLocal("DatabaseID")) + "iCRS/";
                    callback();
                    ref.close();
                }
                ref.close;
            }
        });
    }, 500);
}


function getCurrentDate() {
    var currentDate = new Date();
    return currentDate; //(currentDate.getMonth() + 1) + "/" + currentDate.getDate() + "/" + currentDate.getFullYear();
}

function LoadScreenTranslation() {
    getTranslations("Logon");
    LoginSettings_LoadTranslationComplete();
}

function LoginSettings_LoadTranslationComplete() {

    var page = $("#" + loginPageID);

    if (!IsStringNullOrEmpty(getLocal("DatabaseID"))) {
        page.find("#DataBaseNameValueLabel").text(decryptStr(getLocal("DatabaseID")));
    }
    else {
        page.find("#DataBaseNameValueLabel").text(notSetTranslation);
    }

    if (!IsStringNullOrEmpty(getLocal("Language"))) {
        page.find("#LanguageNameValueLabel").text(getLocal("LanguageName"));
    }
    else {
        page.find("#LanguageNameValueLabel").text(notSetTranslation);
    }

    LoadTranslationsForLogonLabels();
    //Sync the translations for CommonString all over the application.
    // LoadTranslation("Common", null);

}

function LoginSettings_SupportedLanguagesChanged() {
    $("#" + loginPageID).find("#SettingsPopUpMessageLabel").hide();
}

// Method called on click of logout button.
function logOut() {
    if (navigator.onLine) {


        document.addEventListener("backbutton", onBackKeyDown, false);
        setTimeout(function () {
            setLocal("logoutFlag", "1");
        }, 500);


        var accessURL = standardAddress + "LoginAuthentication.svc/Logout";
        var myJsonObject = {
            "databaseID": decryptStr(getLocal("DatabaseID")),
            "language": getLocal("Language"),
            "loginUsageIndex": getLocal("LoginUsageIndex"),
            "userEmailId": decryptStr(getLocal("userName")),
            "sessionId": decryptStr(getLocal("SessionId"))
        };

        $.postJSON(accessURL, myJsonObject, function (data) {
            if (getLocal("rememberMe") == "1") {
                setTimeout(function () {
                    $('#UserNameTextBox').val(decryptStr(getLocal("userName")));
                    $('#PasswordTextBox').val(decryptStr(getLocal("password1")));
                    $('#rememberMe').attr('checked', true);
                    SyncTranslation("Login", LoginSettings_SyncTranslationComplete);
                    $.mobile.changePage("index.html", "fade");
                }, 1000);
            }
            else {
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

                // LoadTranslationsForLogonLabels();
                SyncTranslation("Login", LoginSettings_SyncTranslationComplete);

                //SA 25th June 2019 - If a standard non sso user then
                //keep doing what you used to.
                if (getLocal("SSOUser") != 'true') {
                    $.mobile.changePage("index.html", "fade");

                }

                openDB();
                dB.transaction(function (ts) {
                    ts.executeSql('DROP TABLE IF EXISTS Users');
                });

                setLocal("userName", '');
                setLocal("password1", '');
            }
        });



        //var ca = document.cookie.split(";");
        var cookie = document.cookie.split(';');
        for (var i = 0; i < cookie.length; i++) {
            var chip = cookie[i],
                entry = chip.split("="),
                name = entry[0];
            document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        }
        //var cookies = $.cookie();

        var databaseID = getLocal("DatabaseID");
        var databaseName = getLocal("databaseName");
        var language = getLocal("Language");
        var languageName = getLocal("LanguageName");
        var valueABC = getLocal("valueABC");
        //var standardAddress = getLocal("standardAddress");
        var supportedLanguages = getLocal("SupportedLanguages");
        var username = getLocal("userName");
        var password = getLocal("password1");
        var xmlTranslation = getLocal("XmlTranslation");
        var rememberMe = getLocal("rememberMe");
        var ssoUser = getLocal("SSOUser");
        var theme = getLocal("Theme");

        //SA 25th Jun 2019 - Adding SSO related local attributes
        var ssoURL = getLocal("iCRS_SSOAuthURL");
        var daysExpire = getLocal("iCRSSSONoOfDaysToExpire");
        var minsExpire = getLocal("iCRSSSOMinutesToExpire");

        var URL_STANDARDADDRESS_STRING_temp = getLocal("URL_STANDARDADDRESS_STRING");

        localStorage.clear();

        setLocal("URL_STANDARDADDRESS_STRING", URL_STANDARDADDRESS_STRING_temp);
        setLocal("DatabaseID", databaseID);
        setLocal("databaseName", databaseName);
        setLocal("Language", language);
        setLocal("LanguageName", languageName);
        setLocal("valueABC", valueABC);
        setLocal("standardAddress", standardAddress);
        setLocal("SupportedLanguages", supportedLanguages);
        setLocal("userName", username);
        setLocal("password1", password);
        setLocal("XmlTranslation", xmlTranslation);
        setLocal("rememberMe", rememberMe);
        setLocal("SSOUser", ssoUser);
        setLocal("Theme", theme);

        //SA 25th Jun 2019 - Adding SSO related local attributes
        setLocal("iCRS_SSOAuthURL", ssoURL);
        setLocal("iCRSSSONoOfDaysToExpire", daysExpire);
        setLocal("iCRSSSOMinutesToExpire", minsExpire);
        //setLocal("Theme", theme);
        //getTheme();
        //\();

        setTimeout(function () {
            syncConfig();
            GetCompanyDefaultValues();

            //SA 25th June 2019 - Now we have everything tidied and cleared 
            //return the user to the login screen via the same way we do at app launch
            if (getLocal("SSOUser") == 'true') {
                $.mobile.changePage("index.html", "fade");


            }

        }, 100);

    } else {
        setTimeout(function () {
            hideImage();
            showErrorPopUp(true, noNetworkTranslation);
        }, 1000);
    }
}

function onBackKeyDown() {
    // Handle the back button
    navigator.app.exitApp();
}

function syncConfig() {
    var dbID = "";
    if (getLocal("DatabaseID") == null || getLocal("DatabaseID") == undefined || getLocal("DatabaseID") == "") {
        dbID = document.getElementById("DataBaseName").value
    }
    else {
        dbID = decryptStr(getLocal("DatabaseID"))
    }

    var myJSONobject = {
        "databaseName": decryptStr(getLocal("databaseName")),
        "language": getLocal("Language"),
        "databaseID": decryptStr(getLocal("DatabaseID"))
    };

    $.constants.STANDARDADDRESS_STRING = getLocal("URL_STANDARDADDRESS_STRING");
    //DatabaseConnection = databaseName.charAt(0).toUpperCase();
    standardAddress = $.constants.STANDARDADDRESS_STRING + $.constants.DB_STRING + decryptStr(getLocal("DatabaseID")) + "iCRS/";

    var accessURL = standardAddress + "LoginAuthentication.svc/ReadConfigItems";
    if (navigator.onLine) {
        $.postJSON(accessURL, myJSONobject, function (data) {

            if (!IsObjectNullOrUndefined(data)) {
                openDB();
                dB.transaction(function (ts) {
                    ts.executeSql('DROP TABLE IF EXISTS ConfigCRS');
                    ts.executeSql('CREATE TABLE IF NOT EXISTS ConfigCRS (Item nvarchar(50),ItemValue nvarchar(1000))');
                });
                dB.transaction(function (tx) {
                    var l = data.length;
                    var sql = 'INSERT INTO ConfigCRS (Item,ItemValue) VALUES (?,?)';
                    var b;
                    for (var i = 0; i < l; i++) {
                        b = data[i];
                        var params = [b.Item, encryptStr(b.ItemValue)];
                        tx.executeSql(sql, params);
                    }

                });

                dB.transaction(function (ts) {
                    ts.executeSql('SELECT ItemValue FROM ConfigCRS where Item="RememberMe"', [],
                        function (ts, results) {
                            setLocal('rememberMeFlag', results.rows.item(0).ItemValue);
                            if (decryptStr(results.rows.item(0).ItemValue) == '0') {
                                $(".ui-checkbox").hide();
                            } else {
                                $(".ui-checkbox").show();
                            }

                        },
                        function (e, m, s) { log(e.status); });
                });
                LoadConfigurationItems();
            }
        });
    } else {
        setTimeout(function () {
            hideImage();
            showErrorPopUp(true, noNetworkTranslation);
        }, 1000);
    }

}

function GetCompanyDefaultValues() {
    var accessURL = standardAddress + "LoginAuthentication.svc/GetCompanyDefault";
    var myJsonObject =
    {
        "dataBaseID": decryptStr(getLocal("DatabaseID")),
        "language": getLocal("Language")
    };
    if (navigator.onLine) {
        $.postJSON(accessURL, myJsonObject, function (data) {
            if (!IsObjectNullOrUndefined(data)) {
                openDB();
                dB.transaction(function (ts) {
                    ts.executeSql('DROP TABLE IF EXISTS CompanyDefault');
                    ts.executeSql('CREATE TABLE IF NOT EXISTS CompanyDefault (DefaultType nvarchar(200), DefaultValueInt nvarchar(1000), DefaultValueStr nvarchar(8000))');
                });
                dB.transaction(function (tx) {
                    var l = data.length;
                    var sql = 'INSERT INTO CompanyDefault (DefaultType, DefaultValueInt, DefaultValueStr) VALUES (?,?,?)';
                    var b;
                    for (var i = 0; i < l; i++) {
                        b = data[i];
                        var params = [b.DefaultType, encryptStr(b.DefaultValueInt), encryptStr(b.DefaultValueStr)];
                        tx.executeSql(sql, params);
                    }
                });

                dB.transaction(function (ts) {
                    ts.executeSql('SELECT DefaultValueStr,DefaultValueInt FROM CompanyDefault where DefaultType="MSIClientCode"', [],
                        function (ts, results) {
                            setLocal('MSIClientCode', results.rows.item(0).DefaultValueStr);
                        },
                        function (e, m, s) { log(e.status); });
                });

                dB.transaction(function (ts) {
                    ts.executeSql('SELECT DefaultValueStr, DefaultValueInt FROM CompanyDefault where DefaultType="CAS_DefaultCompanyValue"', [],
                        function (ts, results) {
                            setLocal('CAS_DefaultCompanyValue', results.rows.item(0).DefaultValueInt);
                        },
                        function (e, m, s) { log(e.status); });
                });

                dB.transaction(function (ts) {
                    ts.executeSql('SELECT DefaultValueStr, DefaultValueInt FROM CompanyDefault where DefaultType="CompanyCoveredIsBillable"', [],
                        function (ts, results) {
                            setLocal('CompanyCoveredIsBillable', results.rows.item(0).DefaultValueInt);
                        },
                        function (e, m, s) { log(e.status); });
                });

                dB.transaction(function (ts) {
                    ts.executeSql('SELECT DefaultValueStr, DefaultValueInt FROM CompanyDefault where DefaultType="Walgreens_Reference5Regex"', [],
                        function (ts, results) {
                            setLocal('Walgreens_Reference5Regex', results.rows.item(0).DefaultValueStr);
                        },
                        function (e, m, s) { log(e.status); });
                });
                dB.transaction(function (ts) {
                    ts.executeSql('SELECT DefaultValueStr, DefaultValueInt FROM CompanyDefault where DefaultType="PhoneNumberFormat"', [],
                        function (ts, results) {
                            setLocal('PhoneNumberFormat', results.rows.item(0).DefaultValueStr);
                        },
                        function (e, m, s) { log(e.status); });
                });

                dB.transaction(function (ts) {
                    ts.executeSql('SELECT DefaultValueInt FROM CompanyDefault where DefaultType="CRSDynamicDateInterval"', [],
                        function (ts, results) {
                            setLocal('CRSDynamicDateInterval', results.rows.item(0).DefaultValueInt);
                        },
                        function (e, m, s) { log(e.status); });
                });

                dB.transaction(function (ts) {
                    ts.executeSql('SELECT DefaultValueInt FROM CompanyDefault where DefaultType="DefaultPageSize"', [],
                        function (ts, results) {
                            setLocal('DefaultPageSize', results.rows.item(0).DefaultValueInt);
                        },
                        function (e, m, s) { log(e.status); });
                });

                dB.transaction(function (ts) {
                    ts.executeSql('SELECT DefaultValueInt FROM CompanyDefault where DefaultType="AcctFrameCallEntry"', [],
                        function (ts, results) {
                            setLocal('AcctFrameCallEntry', results.rows.item(0).DefaultValueInt);
                        },
                        function (e, m, s) { log(e.status); });
                });

                dB.transaction(function (ts) {
                    ts.executeSql('SELECT DefaultValueInt FROM CompanyDefault where DefaultType="CallEntry_CostCenterDefaultSource"', [],
                        function (ts, results) {
                            setLocal('CallEntryCostCenterDefaultSource', results.rows.item(0).DefaultValueInt);
                        },
                        function (e, m, s) { log(e.status); });
                });

                dB.transaction(function (ts) {
                    ts.executeSql('SELECT DefaultValueStr FROM CompanyDefault where DefaultType="Companies"', [],
                        function (ts, results) {
                            setLocal('Companies', results.rows.item(0).DefaultValueStr);
                        },
                        function (e, m, s) { log(e.status); });
                });

                dB.transaction(function (ts) {
                    ts.executeSql('SELECT DefaultValueInt FROM CompanyDefault where DefaultType="AutoDispatch_UseOnCRS"', [],
                        function (ts, results) {
                            setLocal('AutoDispatchOnCRS', results.rows.item(0).DefaultValueInt);
                        },
                        function (e, m, s) { log(e.status); });
                });

                dB.transaction(function (ts) {
                    ts.executeSql('SELECT DefaultValueInt FROM CompanyDefault where DefaultType="CRS_FilterLevel1DropDown"', [],
                        function (ts, results) {
                            setLocal('FilterLevel1DropDown', results.rows.item(0).DefaultValueInt);
                        },
                        function (e, m, s) { log(e.status); });
                });

                dB.transaction(function (ts) {
                    ts.executeSql('SELECT DefaultValueInt FROM CompanyDefault where DefaultType="AllowUserProblemCodeQuickLink"', [],
                        function (ts, results) {
                            setLocal('AllowUserProblemCodeQuickLink', results.rows.item(0).DefaultValueInt);
                        },
                        function (e, m, s) { log(e.status); });
                });

                dB.transaction(function (ts) {
                    ts.executeSql('SELECT DefaultValueStr,DefaultValueInt FROM CompanyDefault where DefaultType="CAS_DropSource_1"', [],
                        function (ts, results) {
                            setLocal('CAS_DropSource_1', results.rows.item(0).DefaultValueStr);
                        },
                        function (e, m, s) { log(e.status); });
                });

                dB.transaction(function (ts) {
                    ts.executeSql('SELECT DefaultValueStr,DefaultValueInt FROM CompanyDefault where DefaultType="CAS_DropSource_2"', [],
                        function (ts, results) {
                            setLocal('CAS_DropSource_2', results.rows.item(0).DefaultValueStr);
                        },
                        function (e, m, s) { log(e.status); });
                });

                dB.transaction(function (ts) {
                    ts.executeSql('SELECT DefaultValueStr,DefaultValueInt FROM CompanyDefault where DefaultType="CAS_DropSource_3"', [],
                        function (ts, results) {
                            setLocal('CAS_DropSource_3', results.rows.item(0).DefaultValueStr);
                        },
                        function (e, m, s) { log(e.status); });
                });

                dB.transaction(function (ts) {
                    ts.executeSql('SELECT DefaultValueStr,DefaultValueInt FROM CompanyDefault where DefaultType="CAS_DropSource_4"', [],
                        function (ts, results) {
                            setLocal('CAS_DropSource_4', results.rows.item(0).DefaultValueStr);
                        },
                        function (e, m, s) { log(e.status); });
                });

                dB.transaction(function (ts) {
                    ts.executeSql('SELECT DefaultValueStr,DefaultValueInt FROM CompanyDefault where DefaultType="CAS_DropSource_5"', [],
                        function (ts, results) {
                            setLocal('CAS_DropSource_5', results.rows.item(0).DefaultValueStr);
                        },
                        function (e, m, s) { log(e.status); });
                });
            }
        });
    } else {
        setTimeout(function () {
            hideImage();
            showErrorPopUp(true, noNetworkTranslation);
        }, 1000);
    }

}

//function getTheme() {
//    var myJSONobject = {
//        "databaseID": decryptStr(getLocal("DatabaseID"))
//    };

//    var connectionStringUrl = standardAddress + "LoginAuthentication.svc/GetClientDbDetails";

//    //To get client database details
//    getClientDbDetails(connectionStringUrl, myJSONobject, null);
//}

function LoadTranslationsForLogonLabels() {
    getTranslations("CommonStrings");
    setTimeout(function () {
        var page = $("#" + loginPageID);

        if (!IsStringNullOrEmpty(getLocal("DatabaseID"))) {
            page.find("#DataBaseNameValueLabel").text(decryptStr(getLocal("DatabaseID")));
        }
        else {
            page.find("#DataBaseNameValueLabel").text(notSetTranslation);
        }

        if (!IsStringNullOrEmpty(getLocal("Language"))) {
            page.find("#LanguageNameValueLabel").text(getLocal("LanguageName"));
        }
        else {
            page.find("#LanguageNameValueLabel").text(notSetTranslation);
        }

        $("#SettingsLabel").text(IsStringNullOrEmpty(getTranslatedValue("SettingsLabel")) ? "Settings:" : getTranslatedValue("SettingsLabel") + ":");
        $("#UserNameTextBox").attr("placeholder", getTranslatedValue("UserNamePlaceHolder"));
        $("#PasswordTextBox").attr("placeholder", getTranslatedValue("PasswordPlaceHolder"));
        $("#rememberMeLabel").text(IsStringNullOrEmpty(getTranslatedValue("RememberMeLabel")) ? "Remember Me" : getTranslatedValue("RememberMeLabel"));
        $("#logOnButton").text(IsStringNullOrEmpty(getTranslatedValue("LogOnButton")) ? "Login" : getTranslatedValue("LogOnButton"));
        //Added text as quick fix bcoz for index.html it is not reading from xml.
        $("#emailAddresssLabel").text(IsStringNullOrEmpty(getTranslatedValue("emailAddresssLabel")) ? "Email Address:" : getTranslatedValue("emailAddresssLabel"));
        $("#passwordResetButton").text(IsStringNullOrEmpty(getTranslatedValue("passwordResetButton")) ? "Password Reset" : getTranslatedValue("passwordResetButton"));
        $("#forgotPasswordLink").text(IsStringNullOrEmpty(getTranslatedValue("ForgotPasswordLinkButton")) ? "Forgot Password?" : getTranslatedValue("ForgotPasswordLinkButton"));
        $("#passwordPopupHeader").text(IsStringNullOrEmpty(getTranslatedValue("passwordPopupHeader")) ? "Password" : getTranslatedValue("passwordPopupHeader"));
        appName == 'iCRS' ? $("#appHeader").text(appHeaderForiOS) : $("#appHeader").text(appHeaderForAndroid);
        noNetworkTranslation = getTranslatedValue("noNetworkLabel");
        hideImage();
        //        if ($('#ssoUserCheckBox').is(':checked')) {
        //            setLocal("SSOUser", true);
        //            // URL is used for PRD connection. Uncomment this to connect PRD dll's.
        //            //standardAddress = standardAddressSSO + getLocal("DatabaseID") + 'iCRS/'
        //            $.mobile.changePage("#splash", "fade");
        //        } else {
        //            if (IsStringNullOrEmpty(getLocal("SSOToken"))) {
        //                setLocal("SSOUser", false);
        //            }
        //}
        //hideImage();
    }, 1000);
}

function LoadConfigurationItems() {
    if (navigator.onLine) {
        openDB();
        dB.transaction(function (ts) {
            ts.executeSql('SELECT ItemValue FROM ConfigCRS where Item="LoginLogoImage"', [],
                function (ts, results) {
                    setLocal('imageLogo', results.rows.item(0).ItemValue);
                },
                function (e, m, s) { log(e.status); });
        });

        dB.transaction(function (ts) {
            ts.executeSql('SELECT ItemValue FROM ConfigCRS where Item="WOFeedbackGradeThreshold"', [],
                function (ts, results) {
                    setLocal('WOFeedbackGradeThreshold', results.rows.item(0).ItemValue);
                },
                function (e, m, s) { log(e.status); });
        });

        dB.transaction(function (ts) {
            ts.executeSql('SELECT ItemValue FROM ConfigCRS where Item="PromptIfLevelSelectionUnchanged"', [],
                function (ts, results) {
                    setLocal('PromptIfLevelSelectionUnchanged', results.rows.item(0).ItemValue);
                },
                function (e, m, s) { log(e.status); });
        });

        dB.transaction(function (ts) {
            ts.executeSql('SELECT ItemValue FROM ConfigCRS where Item="UpdateLevel3-4FromCRS"', [],
                function (ts, results) {
                    setLocal('UpdateLevelFromCRS', results.rows.item(0).ItemValue);
                },
                function (e, m, s) { log(e.status); });
        });
        dB.transaction(function (ts) {
            ts.executeSql('SELECT ItemValue FROM ConfigCRS where Item="PriorityDefaultAlways"', [],
                function (ts, results) {
                    setLocal('PriorityDefaultAlways', results.rows.item(0).ItemValue);
                },
                function (e, m, s) { log(e.status); });
        });
        dB.transaction(function (ts) {
            ts.executeSql('SELECT ItemValue FROM ConfigCRS where Item="DefaultPriority"', [],
                function (ts, results) {
                    setLocal('DefaultPriority', results.rows.item(0).ItemValue);
                },
                function (e, m, s) { log(e.status); });
        });
        dB.transaction(function (ts) {
            ts.executeSql('SELECT ItemValue FROM ConfigCRS where Item="DefaultEnteredByEmployee"', [],
                function (ts, results) {
                    setLocal('DefaultEnteredByEmployee', results.rows.item(0).ItemValue);
                },
                function (e, m, s) { log(e.status); });
        });
        dB.transaction(function (ts) {
            ts.executeSql('SELECT ItemValue FROM ConfigCRS where Item="WOSource"', [],
                function (ts, results) {
                    setLocal('WOSource', results.rows.item(0).ItemValue);
                },
                function (e, m, s) { log(e.status); });
        });
        dB.transaction(function (ts) {
            ts.executeSql('SELECT ItemValue FROM ConfigCRS where Item="DefaultProblemCode"', [],
                function (ts, results) {
                    setLocal('DefaultProblemCode', results.rows.item(0).ItemValue);
                },
                function (e, m, s) { log(e.status); });
        });
        dB.transaction(function (ts) {
            ts.executeSql('SELECT ItemValue FROM ConfigCRS where Item="AutoDispatchStatus"', [],
                function (ts, results) {
                    setLocal('AutoDispatchStatus', results.rows.item(0).ItemValue);
                },
                function (e, m, s) { log(e.status); });
        });
        dB.transaction(function (ts) {
            ts.executeSql('SELECT ItemValue FROM ConfigCRS where Item="AutoDispatchFailStatus"', [],
                function (ts, results) {
                    setLocal('AutoDispatchFailStatus', results.rows.item(0).ItemValue);
                },
                function (e, m, s) { log(e.status); });
        });
        dB.transaction(function (ts) {
            ts.executeSql('SELECT ItemValue FROM ConfigCRS where Item="UpdateCostCenterFromCRS"', [],
                function (ts, results) {
                    setLocal('UpdateCostCenterFromCRS', results.rows.item(0).ItemValue);
                },
                function (e, m, s) { log(e.status); });
        });
        dB.transaction(function (ts) {
            ts.executeSql('SELECT ItemValue FROM ConfigCRS where Item="AutoContactNotUsedStatus"', [],
                function (ts, results) {
                    setLocal('AutoContactNotUsedStatus', results.rows.item(0).ItemValue);
                },
                function (e, m, s) { log(e.status); });
        });
        dB.transaction(function (ts) {
            ts.executeSql('SELECT ItemValue FROM ConfigCRS where Item="EmailEmployee"', [],
                function (ts, results) {
                    setLocal('EmailEmployee', results.rows.item(0).ItemValue);
                },
                function (e, m, s) { log(e.status); });
        });
        dB.transaction(function (ts) {
            ts.executeSql('SELECT ItemValue FROM ConfigCRS where Item="UseCallLogNumber"', [],
                function (ts, results) {
                    setLocal('UseCallLogNumber', results.rows.item(0).ItemValue);
                },
                function (e, m, s) { log(e.status); });
        });
        dB.transaction(function (ts) {
            ts.executeSql('SELECT ItemValue FROM ConfigCRS where Item="DefaultAssnEmployee"', [],
                function (ts, results) {
                    setLocal('DefaultAssnEmployee', results.rows.item(0).ItemValue);
                },
                function (e, m, s) { log(e.status); });
        });
        dB.transaction(function (ts) {
            ts.executeSql('SELECT ItemValue FROM ConfigCRS where Item="RequestStatus"', [],
                function (ts, results) {
                    setLocal('RequestStatus', results.rows.item(0).ItemValue);
                },
                function (e, m, s) { log(e.status); });
        });
        dB.transaction(function (ts) {
            ts.executeSql('SELECT ItemValue FROM ConfigCRS where Item="ShowPCDropDowns"', [],
                function (ts, results) {
                    setLocal('ShowPCDropDowns', results.rows.item(0).ItemValue);
                },
                function (e, m, s) { log(e.status); });
        });
        dB.transaction(function (ts) {
            ts.executeSql('SELECT ItemValue FROM ConfigCRS where Item="ChangeTheOrderOfProblemCodeDropDown"', [],
                function (ts, results) {
                    setLocal('ChangeTheOrderOfProblemCodeDropDown', results.rows.item(0).ItemValue);
                },
                function (e, m, s) { log(e.status); });
        });
        dB.transaction(function (ts) {
            ts.executeSql('SELECT ItemValue FROM ConfigCRS where Item="ProblemCodeSearch"', [],
                function (ts, results) {
                    setLocal('ProblemCodeSearch', results.rows.item(0).ItemValue);
                },
                function (e, m, s) { log(e.status); });
        });
        dB.transaction(function (ts) {
            ts.executeSql('SELECT ItemValue FROM ConfigCRS where Item="UseName2Field"', [],
                function (ts, results) {
                    setLocal('UseNameField', results.rows.item(0).ItemValue);
                },
                function (e, m, s) { log(e.status); });
        });
        dB.transaction(function (ts) {
            ts.executeSql('SELECT ItemValue FROM ConfigCRS where Item="ShowSiteContact"', [],
                function (ts, results) {
                    setLocal('ShowSiteContact', results.rows.item(0).ItemValue);
                },
                function (e, m, s) { log(e.status); });
        });
        dB.transaction(function (ts) {
            ts.executeSql('SELECT ItemValue FROM ConfigCRS where Item="ShowLevelSearch"', [],
                function (ts, results) {
                    setLocal('ShowLevelSearch', results.rows.item(0).ItemValue);
                },
                function (e, m, s) { log(e.status); });
        });
        dB.transaction(function (ts) {
            ts.executeSql('SELECT ItemValue FROM ConfigCRS where Item="SR-RecentReqStatus"', [],
                function (ts, results) {
                    setLocal('SRRecentReqStatus', results.rows.item(0).ItemValue);
                },
                function (e, m, s) { log(e.status); });
        });
        dB.transaction(function (ts) {
            ts.executeSql('SELECT ItemValue FROM ConfigCRS where Item="SR-RecentReqOpenOnly"', [],
                function (ts, results) {
                    setLocal('SRRecentReqOpenOnly', results.rows.item(0).ItemValue);
                },
                function (e, m, s) { log(e.status); });
        });
        dB.transaction(function (ts) {
            ts.executeSql('SELECT ItemValue FROM ConfigCRS where Item="SRLevelPlugin"', [],
                function (ts, results) {
                    setLocal('SRLevelPlugin', results.rows.item(0).ItemValue);
                },
                function (e, m, s) { log(e.status); });
        });
        dB.transaction(function (ts) {
            ts.executeSql('SELECT ItemValue FROM ConfigCRS where Item="SetLevelsWhenEditProfile"', [],
                function (ts, results) {
                    setLocal('SetLevelsWhenEditProfile', results.rows.item(0).ItemValue);
                },
                function (e, m, s) { log(e.status); });
        });
        dB.transaction(function (ts) {
            ts.executeSql('SELECT ItemValue FROM ConfigCRS where Item="SRIShowRecentRequests"', [],
                function (ts, results) {
                    setLocal('SRIShowRecentRequests', results.rows.item(0).ItemValue);
                },
                function (e, m, s) { log(e.status); });
        });
        dB.transaction(function (ts) {
            ts.executeSql('SELECT ItemValue FROM ConfigCRS where Item="LockTopThreeLevels"', [],
                function (ts, results) {
                    setLocal('LockTopThreeLevels', results.rows.item(0).ItemValue);
                },
                function (e, m, s) { log(e.status); });
        });
        dB.transaction(function (ts) {
            ts.executeSql('SELECT ItemValue FROM ConfigCRS where Item="LockTopTwoLevels"', [],
                function (ts, results) {
                    setLocal('LockTopTwoLevels', results.rows.item(0).ItemValue);
                },
                function (e, m, s) { log(e.status); });
        });
        dB.transaction(function (ts) {
            ts.executeSql('SELECT ItemValue FROM ConfigCRS where Item="LockLevelsForLockedProfile"', [],
                function (ts, results) {
                    setLocal('LockLevelsForLockedProfile', results.rows.item(0).ItemValue);
                },
                function (e, m, s) { log(e.status); });
        });
        dB.transaction(function (ts) {
            ts.executeSql('SELECT ItemValue FROM ConfigCRS where Item="AttachEnable"', [],
                function (ts, results) {
                    setLocal('AttachEnable', results.rows.item(0).ItemValue);
                },
                function (e, m, s) { log(e.status); });
        });
        dB.transaction(function (ts) {
            ts.executeSql('SELECT ItemValue FROM ConfigCRS where Item="WOView-ShowLogHist"', [],
                function (ts, results) {
                    setLocal('ShowLogHist', results.rows.item(0).ItemValue);
                },
                function (e, m, s) { log(e.status); });
        });
        dB.transaction(function (ts) {
            ts.executeSql('SELECT ItemValue FROM ConfigCRS where Item="ViewOrderCallerFilter"', [],
                function (ts, results) {
                    setLocal('ViewOrderCallerFilter', results.rows.item(0).ItemValue);
                },
                function (e, m, s) { log(e.status); });
        });
        dB.transaction(function (ts) {
            ts.executeSql('SELECT ItemValue FROM ConfigCRS where Item="AllowFeedbackToCompletedWOsOnly"', [],
                function (ts, results) {
                    setLocal('AllowFeedbackToCompletedWOsOnly', results.rows.item(0).ItemValue);
                },
                function (e, m, s) { log(e.status); });
        });
        dB.transaction(function (ts) {
            ts.executeSql('SELECT ItemValue FROM ConfigCRS where Item="NegativeFeedbackEmail"', [],
                function (ts, results) {
                    setLocal('NegativeFeedbackEmail', results.rows.item(0).ItemValue);
                },
                function (e, m, s) { log(e.status); });
        });
        dB.transaction(function (ts) {
            ts.executeSql('SELECT ItemValue FROM ConfigCRS where Item="PositiveFeedbackEmail"', [],
                function (ts, results) {
                    setLocal('PositiveFeedbackEmail', results.rows.item(0).ItemValue);
                },
                function (e, m, s) { log(e.status); });
        });
        dB.transaction(function (ts) {
            ts.executeSql('SELECT ItemValue FROM ConfigCRS where Item="Profile-ShowNotes"', [],
                function (ts, results) {
                    setLocal('ProfileShowNotes', results.rows.item(0).ItemValue);
                },
                function (e, m, s) { log(e.status); });
        });
        dB.transaction(function (ts) {
            ts.executeSql('SELECT ItemValue FROM ConfigCRS where Item="LoadCallerLevels"', [],
                function (ts, results) {
                    setLocal('LoadCallerLevels', results.rows.item(0).ItemValue);
                },
                function (e, m, s) { log(e.status); });
        });
        dB.transaction(function (ts) {
            ts.executeSql('SELECT ItemValue FROM ConfigCRS where Item="PasswordSendViaEmail"', [],
                function (ts, results) {
                    setLocal('PasswordSendViaEmail', results.rows.item(0).ItemValue);
                },
                function (e, m, s) { log(e.status); });
        });
        dB.transaction(function (ts) {
            ts.executeSql('SELECT ItemValue FROM ConfigCRS where Item="ShowCostCenter"', [],
                function (ts, results) {
                    setLocal('ShowCostCenter', results.rows.item(0).ItemValue);
                },
                function (e, m, s) { log(e.status); });
        });
        dB.transaction(function (ts) {
            ts.executeSql('SELECT ItemValue FROM ConfigCRS where Item="ShowCreateServiceRequest"', [],
                function (ts, results) {
                    setLocal('ShowCreateServiceRequest', results.rows.item(0).ItemValue);
                },
                function (e, m, s) { log(e.status); });
        });

        dB.transaction(function (ts) {
            ts.executeSql('SELECT ItemValue FROM ConfigCRS where Item="ShowWONeedingAttentionLink"', [],
                function (ts, results) {
                    setLocal('ShowWONeedingAttentionLink', results.rows.item(0).ItemValue);
                },
                function (e, m, s) { log(e.status); });
        });

        dB.transaction(function (ts) {
            ts.executeSql('SELECT ItemValue FROM ConfigCRS where Item="ShowWOReadyForFeedbackLink"', [],
                function (ts, results) {
                    setLocal('ShowWOReadyForFeedbackLink', results.rows.item(0).ItemValue);
                },
                function (e, m, s) { log(e.status); });
        });

        dB.transaction(function (ts) {
            ts.executeSql('SELECT ItemValue FROM ConfigCRS where Item="ShowProvideFeedback"', [],
                function (ts, results) {
                    setLocal('ShowProvideFeedback', results.rows.item(0).ItemValue);
                },
                function (e, m, s) { log(e.status); });
        });

        dB.transaction(function (ts) {
            ts.executeSql('SELECT ItemValue FROM ConfigCRS where Item="ShowAboutUs"', [],
                function (ts, results) {
                    setLocal('ShowAboutUs', results.rows.item(0).ItemValue);
                },
                function (e, m, s) { log(e.status); });
        });

        dB.transaction(function (ts) {
            ts.executeSql('SELECT ItemValue FROM ConfigCRS where Item="ShowType"', [],
                function (ts, results) {
                    setLocal('ShowType', results.rows.item(0).ItemValue);
                },
                function (e, m, s) { log(e.status); });
        });

        dB.transaction(function (ts) {
            ts.executeSql('SELECT ItemValue FROM ConfigCRS where Item="SortingOrderOfWorkOrders"', [],
                function (ts, results) {
                    setLocal('SortingOrderOfWorkOrders', results.rows.item(0).ItemValue);
                },
                function (e, m, s) { log(e.status); });
        });

        dB.transaction(function (ts) {
            ts.executeSql('SELECT ItemValue FROM ConfigCRS where Item="QLServiceRequestProblemCustomLabel"', [],
                function (ts, results) {
                    setLocal('QLServiceRequestProblemCustomLabel', results.rows.item(0).ItemValue);
                },
                function (e, m, s) { log(e.status); });
        });

        dB.transaction(function (ts) {
            ts.executeSql('SELECT ItemValue FROM ConfigCRS where Item="QLSRShowProblemSubLabel"', [],
                function (ts, results) {
                    setLocal('QLSRShowProblemSubLabel', results.rows.item(0).ItemValue);
                },
                function (e, m, s) { log(e.status); });
        });

        dB.transaction(function (ts) {
            ts.executeSql('SELECT ItemValue FROM ConfigCRS where Item="EquipmentCustomLabels"', [],
                function (ts, results) {
                    setLocal('EquipmentCustomLabels', results.rows.item(0).ItemValue);
                },
                function (e, m, s) { log(e.status); });
        });

        dB.transaction(function (ts) {
            ts.executeSql('SELECT ItemValue FROM ConfigCRS where Item="CustomContactPhoneLabel"', [],
                function (ts, results) {
                    setLocal('CustomContactPhoneLabel', results.rows.item(0).ItemValue);
                },
                function (e, m, s) { log(e.status); });
        });

        dB.transaction(function (ts) {
            ts.executeSql('SELECT ItemValue FROM ConfigCRS where Item="CustomPhoneLabelEditProfile"', [],
                function (ts, results) {
                    setLocal('CustomPhoneLabelEditProfile', results.rows.item(0).ItemValue);
                },
                function (e, m, s) { log(e.status); });
        });

        dB.transaction(function (ts) {
            ts.executeSql('SELECT ItemValue FROM ConfigCRS where Item="iCRSSSONoOfDaysToExpire"', [],
                function (ts, results) {
                    setLocal('iCRSSSONoOfDaysToExpire', results.rows.item(0).ItemValue);
                },
                function (e, m, s) { log(e.status); });
        });

        dB.transaction(function (ts) {
            ts.executeSql('SELECT ItemValue FROM ConfigCRS where Item="iCRS_SSOLogoutButton"', [],
                function (ts, results) {
                    setLocal('iCRS_SSOLogoutButton', results.rows.item(0).ItemValue);
                },
                function (e, m, s) { log(e.status); });
        });

        // dB.transaction(function (ts) {
        //     ts.executeSql('SELECT ItemValue FROM ConfigCRS where Item="iCRSSSOMinutesToExpire"', [],
        //         function (ts, results) {
        //             setLocal('iCRSSSOMinutesToExpire', results.rows.item(0).ItemValiCRSSSOMinutesToExpireue);
        //         },
        //         function (e, m, s) { log(e.status); });
        // });


        dB.transaction(function (ts) {
            ts.executeSql('SELECT ItemValue FROM ConfigCRS where Item="ShowSettingsInMenu"', [],
                function (ts, results) {
                    setLocal('ShowSettingsInMenu', results.rows.item(0).ItemValue);
                },
                function (e, m, s) { log(e.status); });
        });
    } else {
        setTimeout(function () {
            hideImage();
            showErrorPopUp(true, noNetworkTranslation);
        }, 1000);
    }
}

// Method to reset the password
function resetPassword() {

    if ($("#emailAddressTextBox").val().length === 0) {
                //Added text as quick fix bcoz for index.html it is not reading from xml.
        $("#errorMessageLabel").text(IsStringNullOrEmpty(getTranslatedValue("provideEmailMessage")) ? "Please provide email address." : getTranslatedValue("provideEmailMessage"));
        return false;
    }
    if (!isValidEmailAddress($("#emailAddressTextBox").val())) {
                //Added text as quick fix bcoz for index.html it is not reading from xml.
        $("#errorMessageLabel").text(IsStringNullOrEmpty(getTranslatedValue("UserNameRegularExpressionValidator")) ? "EmailAddress format should be like : username@domainname.com" : getTranslatedValue("UserNameRegularExpressionValidator"));
        return false;
    }

    var accessURL = standardAddress + "LoginAuthentication.svc/ForgotPassword";
    var myJsonObject = {
        "databaseID": decryptStr(getLocal("DatabaseID")),
        "databaseName": decryptStr(getLocal("databaseName")),
        "language": getLocal("Language"),
        "emailAddress": $("#emailAddressTextBox").val()
    };

    $.postAjaxJSON(accessURL, myJsonObject, function (data) {
        $("#errorMessageLabel").text(data);
    });
}

function isValidEmailAddress(emailAddress) {
    var pattern = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return pattern.test(emailAddress);
};

//Added text as quick fix bcoz for index.html it is not reading from xml.
function showPasswordConfigPopUp(popupafterclose, message) {
    var template = "<div data-role='popup' data-dismissible='false' class='ui-content messagePopup'>"
        + "<div data-role='header' role='banner' class='ui-header ui-bar-inherit'><h1 class='popupHeaderConfirm'>" + IsStringNullOrEmpty(getTranslatedValue("passwordPopupHeader")) ? "Password" : getTranslatedValue("passwordPopupHeader") + "</h1></div> "
        + "<span class='messagePopUpContext'>" + message + " </span><a href='#' class='ui-btn ui-btn-inline newBtn' data-rel='back'>Close</a> </div>";

    popupafterclose = popupafterclose ? popupafterclose : function () { };

    $.mobile.activePage.append(template).trigger("create");

    $.mobile.activePage.find(".messagePopup").popup().popup("open").bind({
        popupafterclose: function () {
            $(this).unbind("popupafterclose").remove();

        }
    });
}

