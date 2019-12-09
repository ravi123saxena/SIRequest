//    var connectionStringURL = "https://www.mainstreamsasp.com/LIV00000iMFM/";
//    var checkDBaddress = "https://www.mainstreamsasp.com/LIV0000";
//    var standardAddress = "https://www.mainstreamsasp.com/";
var connectionStringURL = "http://bnet.mainstreamsasp.com/SPN00000iMFM/";
var checkDBaddress = "http://bnet.mainstreamsasp.com/SPN0000";
var standardAddress = "http://bnet.mainstreamsasp.com/";

    // var connectionStringURL = "http://imfm.mainstreamsasp.com/MOB00000iMFM/";
    // var checkDBaddress = "http://imfm.mainstreamsasp.com/MOB0000";
    // var standardAddress = "http://imfm.mainstreamsasp.com/";
//var connectionStringURL = "http://localhost:52919/WEB00111iCRS/";
//var checkDBaddress = "http://localhost:52919/WEB00111iCRS/";
//var standardAddress = "http://localhost:52919/";

var connectionStringURL = "http://localhost:49501/WEB00111iMFM/";
var checkDBaddress = "http://localhost:49501/WEB00111iMFM/";
var standardAddress = "http://localhost:49501/";


var DatabaseConnection = "";
var getActiveLanguagesResponse = null;
var supportedLanguagesTemp = null;

var cannotBeEmptyTranslation = " cannot be empty.";
var noNetworkTranslation = "No network connection. Please try again when network is available.";
var invalidDatabaseTranslation = "Invalid Customer ID.";
var customerIDTranslation = "Customer ID";
var userNameTranslation = "User Name";
var passwordTranslation = "Password";
var languageTranslation = "Language";
var langOptionTranslation = "-Language-";

var loginPageID = "Login";
function LogOnButtonClick() {
    if (navigator.onLine) {

    var userName = $('#userName').val();
    var password = $('#password').val();
    var Databasename = $("#company").val();
    //DatabaseConnection = "";
    var pattern = /[-!$%^#&*()_+|~=`{}\[\]:";'<>?,.\/]/;
    var isUserNameSpecialChar = pattern.test(userName);
    var isPasswordSpecialChar = pattern.test(password);

    if ($('#userName').val().length == 0 && $('#password').val().length == 0 && $("#company").val().length ==0) {
        showError("Database name, username and password cannot be empty.");
    }

    else if ($('#userName').val().length == 0 && $('#password').val().length == 0) {
        showError("UserName and password cannot be empty.");
    }
    else if ($('#userName').val().length == 0) {
        showError("UserName cannot be empty.");
    }
    else if ($('#password').val().length == 0) {
        showError("Password cannot be empty.");
    }
    /*else if ($('#company').val().length == 0) {
        showError("DataBase Name cannot be empty.");
    }*/
    else {
            connectionStringURL = "http://localhost:49501/WEB00111iMFM/";
		    checkDBaddress = "http://localhost:49501/WEB00111iMFM/";
			$.mobile.loading( 'show', {
				text: 'Loading',
				textVisible: true,
				theme: 'a',
				textonly: false,
				html: ""
			});
        getMyLocation();
        var lat = $('#LatitudeHiddenFieldValue').val();
        var long = $('#LongitudeHiddenFieldValue').val();
        DatabaseConnection = Databasename.charAt(0).toUpperCase();

        connectionStringURL = connectionStringURL + "LoginAuthentication.ashx?methodname=GetDatabaseServer";
        var myJSONobject = {
        "Username": userName,
        "Password": password,
        "Databasename": Databasename,
        "Latitude": lat,
        "Longitude": long
    };
    // new method to get path.
    getConnectionString(connectionStringURL, myJSONobject, DatabaseConnection);
    }
    }
    else {
        showError("No network connection. Please try again when network is available.");
    }
}
                
function getConnectionString(connectionStringURL, myJSONobject, DatabaseConnection) {

    if (navigator.onLine) {
        $.postJSON(connectionStringURL, myJSONobject, function (data) {
               loginResponse = data;
               if (data.length == 0) {
                   $.mobile.loading("hide");
                   showError("Invalid Database.");
                   $('#userName').val('');
                   $('#password').val('');
               }
               else {
                   checkDBaddress = checkDBaddress + data + 'imfm/';
                   var loginURL = checkDBaddress + "LoginAuthentication.ashx?methodname=Authenticate";
                   login(loginURL, myJSONobject, DatabaseConnection);
               }
        });
    }
    else {
    showError("No network connection. Please try again when network is available.");
    }
}
                        
function getMyLocation() {
    try {
        function handler(location) {
        messageLatitude = location.coords.latitude;
        messageLongitude = location.coords.longitude;
        document.getElementById('LatitudeHiddenFieldValue').value = messageLatitude.toFixed(6);
        document.getElementById('LongitudeHiddenFieldValue').value = messageLongitude.toFixed(6);
        }
        navigator.geolocation.getCurrentPosition(handler);
    }
    catch (err) {
    }
}

// <summary>
// Method to change login database name.
// </summary>
function LoginSettings_DatabaseNameChanged() {
    if (getActiveLanguagesResponse !== null) {
        getActiveLanguagesResponse.abort();
    }

    var page = $("#" + loginPageID);

    page.find("#SettingsPopUpWaitLabel").show();

    var databaseName = page.find('#DataBaseName');
    var supportedLanguagesDropDown = page.find("#SupportedLanguagesDropDown");

    var settingsPopUpMessageLabel = page.find("#SettingsPopUpMessageLabel");
    settingsPopUpMessageLabel.hide();

    supportedLanguagesDropDown.empty();
    var selectOption = document.createElement("option");
    selectOption.setAttribute("value", "-1");
    selectOption.innerHTML = langOptionTranslation;
    supportedLanguagesDropDown.append(selectOption);

    supportedLanguagesDropDown.children("option:eq(0)").attr("selected", true);
    supportedLanguagesDropDown.selectmenu("disable", true).selectmenu("refresh");
    if (databaseName.val().length == 3 && navigator.onLine) {
        var serverUrl = connectionStringURL + "LoginAuthentication.ashx?methodname=GetDatabaseServer";
        //var loginURL = checkDBaddress + "LoginAuthentication.ashx?methodname=Authenticate";

        var myJSONobject = {
            "Databasename": databaseName.val(),
            "DatabaseID": databaseName.val(),
            "Language": getLocal("Language")
        };

        $.postJSON(serverUrl, myJSONobject, function (data) {
            if (data.length === 0) {
                supportedLanguagesDropDown.selectmenu("enable", true).selectmenu("refresh");
                page.find("#SettingsPopUpWaitLabel").hide();
                settingsPopUpMessageLabel.text(invalidDatabaseTranslation).show();
            }
            else {
                var myJSONobject = {
                    "Databasename": databaseName.val(),
                    "DatabaseID": databaseName.val(),
                    "Language": getLocal("Language")
                };

                //var accessURL = standardAddress + "WEB00" + databaseName.val() + "imfm/LoginAuthentication.ashx?methodname=GetActiveLanguages";
                var accessURL = checkDBaddress + "LoginAuthentication.ashx?methodname=GetActiveLanguages";

                getActiveLanguagesResponse = $.postJSON(accessURL, myJSONobject, function (data) {
                    supportedLanguagesTemp = JSON.stringify(data);

                    for (var arrayCount = 0; arrayCount < data.length; arrayCount++) {
                        var option = document.createElement("option");
                        option.setAttribute("value", data[arrayCount].LangAbbrv);
                        option.innerHTML = data[arrayCount].LangAlias;
                        supportedLanguagesDropDown.append(option);
                    }

                    supportedLanguagesDropDown.selectmenu("enable", true).selectmenu("refresh");
                    page.find("#SettingsPopUpWaitLabel").hide();
                });
            }
        });
    }
    else {
        supportedLanguagesDropDown.selectmenu("enable", true).selectmenu("refresh");
        page.find("#SettingsPopUpWaitLabel").hide();
    }

    //supportedLanguagesDropDown.selectmenu("refresh", true);
}

// <summary>
// Method to login data.
// </summary>
function LoginSettings_SaveButtonClick() {
    var page = $("#Login");
   
    page.find("#DataBaseName").blur();
    page.find("#SupportedLanguagesDropDown").blur();

    if (navigator.onLine) {
        var databaseName = page.find('#DataBaseName');
        alert(databaseName)
        var supportedLanguagesDropDown = page.find("#SupportedLanguagesDropDown");

        if (!IsObjectNullOrUndefined(databaseName) && !IsObjectNullOrUndefined(supportedLanguagesDropDown)) {
            var errorMessage = "";
            var validationSuccess = true;

            if (IsStringNullOrEmpty(databaseName.val())) {
                errorMessage += customerIDTranslation;
                validationSuccess = false;
            }

            if (IsStringNullOrEmpty(supportedLanguagesDropDown.val()) || supportedLanguagesDropDown.val() == "-1") {
                if (!IsStringNullOrEmpty(errorMessage)) {
                    errorMessage += ", ";
                }

                errorMessage += languageTranslation;
                validationSuccess = false;
            }

            if (validationSuccess) {
                page.find("#SettingsPopUpWaitLabel").show();
                page.find("#DataBaseNameValueLabel").text(databaseName.val());
                setLocal("DatabaseID", databaseName.val());
                setLocal("SupportedLanguages", supportedLanguagesTemp);
                setLocal("Language", supportedLanguagesDropDown.val());
                setLocal("LanguageName", supportedLanguagesDropDown.children(":selected").text());

                SyncTranslation(loginPageID, LoginSettings_SyncTranslationComplete);
            }
            else {
                page.find("#SettingsPopUpMessageLabel").text(errorMessage + cannotBeEmptyTranslation).show();
            }
        }
    }
    else {
        page.find("#SettingsPopUpMessageLabel").text(noNetworkTranslation).show();
    }
}

// <summary>
// Method to cancle login settings.
// </summary>
function LoginSettings_CancelButtonClick() {
    alert('here')
    var page = $("#" + loginPageID);
    page.find("#SupportedLanguagesDropDown").blur();
    page.find("#LoginSettingsPopUp").popup("close");
}

// <summary>
// Method to login settings popup.
// </summary>
function LoginSettings_OpenPopUp() {
    var page = $("#" + loginPageID);
    var databaseName = page.find("#DataBaseName");
    var databaseID = getLocal("DatabaseID");

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
    selectOption.innerHTML = langOptionTranslation;
    supportedLanguagesDropDown.append(selectOption);
    supportedLanguagesDropDown.children("option:eq(0)").attr("selected", true);

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
    }

    supportedLanguagesDropDown.val(getLocal("Language"));
    page.find("#LoginSettingsPopUp").popup("open");
    supportedLanguagesDropDown.selectmenu("refresh", true);
}

// <summary>
// Method to sync translations.
// </summary>
function LoginSettings_SyncTranslationComplete() {
    LoadScreenTranslation();
    $("#" + loginPageID).find("#LoginSettingsPopUp").popup("close");
}

// <summary>
// Method to load screen translation.
// </summary>
function LoadScreenTranslation() {
    LoadTranslation(loginPageID, LoginSettings_LoadTranslationComplete);
}

// <summary>
// Method to load translation completely.
// </summary>
function LoginSettings_LoadTranslationComplete() {
    cannotBeEmptyTranslation = GetTranslatedValue("CannotBeEmpty");
    noNetworkTranslation = GetTranslatedValue("NoNetwork");
    invalidDatabaseTranslation = GetTranslatedValue("InvalidDatabase");
    customerIDTranslation = GetTranslatedValue("DataBaseName");
    userNameTranslation = GetTranslatedValue("UserName");
    passwordTranslation = GetTranslatedValue("Password");
    languageTranslation = GetTranslatedValue("Language");
    langOptionTranslation = GetTranslatedValue("SelectLanguage");

    var page = $("#" + loginPageID);

    page.find("#UserNameTextBox").prop("placeholder", userNameTranslation);
    page.find("#PasswordTextBox").prop("placeholder", passwordTranslation);
    page.find("#DataBaseName").prop("placeholder", customerIDTranslation);

    if (!IsStringNullOrEmpty(getLocal("DatabaseID"))) {
        page.find("#DataBaseNameValueLabel").text(getLocal("DatabaseID"));
    }
    else {
        page.find("#DataBaseNameValueLabel").text(notSetTranslation);
    }

    if (!IsStringNullOrEmpty(getLocal("LanguageName"))) {
        page.find("#LanguageNameValueLabel").text(getLocal("LanguageName"));
    }
    else {
        page.find("#LanguageNameValueLabel").text(notSetTranslation);
    }

    //Sync the translations for CommonString all over the application.
    LoadTranslation("Common", null);

}

//function CommonTranslationsSync_Complete() {
//}

// <summary>
// Method to change supported language.
// </summary>
function LoginSettings_SupportedLanguagesChanged() {
    $("#" + loginPageID).find("#SettingsPopUpMessageLabel").hide();
}

                        
