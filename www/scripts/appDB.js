/// <reference path="_references.js" />

////==============Local Storage================////

function setLocal(key, value) {
    try {
        localStorage.setItem(key, value);
    }
    catch (e) {
        log(e);
    }
}


function getLocal(key) {
    try {
        return localStorage.getItem(key);
    }
    catch (e) {
        log(e);
    }
}

//=============This function will opens the DataBase if it already exits in the cache, else it will create DataBase=============//
var dB = null;
function openDB() {
    if (dB === null) {
        //dB = openDatabase('iMFMDB', '1.0', 'iMFM DataBase', 5 * 1024 * 1024, function () { log("Success DB"); });
        dB = openDatabase('iCRSDB', '1.0', 'iCRS DataBase', 5 * 1024 * 1024, function () { log("Success DB"); });  /// "iCRS", "1.0", "iCRS Database", 200000
    }
}
var count = 0;
function executeQuery(query, success, error) {
    openDB();
    dB.transaction(function (ts) {
        ts.executeSql(query, [], success, error);
    });
}

function executeArrayQuery(queries, success, error) {
    openDB();
    dB.transaction(function (ts) {
        for (var i = 0; i < queries.length; i++) {

            ts.executeSql(queries[i], [], success, error);
        }
    });
}

function executeInsertQuery(query, array) {
    openDB();
    dB.transaction(function (ts) {
        log(count++);
        ts.executeSql(query, array, success, error);
    });
}

function CreateTables() {

    var createConfigCRSTableQuery = 'CREATE TABLE IF NOT EXISTS ConfigCRS' +
        '(Item nvarchar(50),' +
        'ItemValue nvarchar(MAX))';

    //    
    var queries = [];
    queries.push(createConfigCRSTableQuery);
    executeArrayQuery(queries, CreateTableSuccess, CreateTableError);
}

function CreateInsertQuery(tableName, columnName, values) {
    var insertQuery = 'INSERT INTO ' + tableName + ' (' + columnName + ') VALUES (' + values + ')';
    return insertQuery;
}

function CreateTableSuccess(event, result) {
}

function InsertError(ts, error) {
}

function InsertSuccess(ts, result) {
}

function CreateTableError(event, result) {
    //console.log("CreateTableError");
}

function splashConfig() {
    setTimeout(function () {
        if (getLocal("rememberMe") == '1') {
            $('#rememberMeLabel').removeClass('ui-checkbox-off').addClass('ui-checkbox-on');
            $('#rememberMe').attr('data-cacheval', 'false');
            hideSplash();
        } else if (getLocal("SSOUser") == "true") {
            var diffDays = getSSODateDiff();
            setLocal("SSOUserClearcahceTrueOrFalse", "no");
            if (diffDays >= parseInt(decryptStr(getLocal("iCRSSSONoOfDaysToExpire")))) {
                setLocal("SSOUserClearcahceTrueOrFalse", "yes");
                getSSOToken(hideSplash);
            } else {
                hideSplash();
            }
        } else {
            hideSplash();
        }
    }, 500);
    var theme = getLocal('Theme');
    //customerLogoPath = "css/images/logolocal.png";//getLocal("URL_STANDARDADDRESS_STRING") + "QuickLinksImages/iCRSCustomerLogo/";
    if (theme == 'Insight') {
        if (getLocal("URL_STANDARDADDRESS_STRING") == "https://tst.mainstreamsasp.com/" ||
            getLocal("URL_STANDARDADDRESS_STRING") == "https://icrs.mainstreamsasp.com/") {
            $('.splash').append('<img class="imageCenter" src="' + customerLogoPath + decryptStr(getLocal("DatabaseID")) + '/' + decryptStr(getLocal('imageLogo')) + '"/>');
        }
        // $('.splash').append('<img class="imageCenter" src= "' + customerLogoPath +'"/>');
        $('div#splash').addClass('backGroundInsight');
    }
    else {
        if (getLocal("URL_STANDARDADDRESS_STRING") == "https://tst.mainstreamsasp.com/" ||
            getLocal("URL_STANDARDADDRESS_STRING") == "https://icrs.mainstreamsasp.com/") {
            $('.splash').append('<img class="imageCenter" src= "' + customerLogoPath + decryptStr(getLocal("DatabaseID")) + '/' + decryptStr(getLocal('imageLogo')) + '"/>');
            // $('.splash').append('<img class="imageCenter" src= "' + customerLogoPath +'"/>');
        }
        $('div#splash').addClass('backGround');
    }
}

function loginSettings() {
    if (IsStringNullOrEmpty(getLocal("DatabaseID")) || IsStringNullOrEmpty(getLocal("Language"))) {
        //                IsStringNullOrEmpty(getLocal("LanguageName")) ||
        //                IsStringNullOrEmpty(getLocal("SupportedLanguages")) ||
        //                IsStringNullOrEmpty(getLocal("XmlTranslation")) ||
        //                IsStringNullOrEmpty(getLocal("XmlLastSyncDate")) ||
        //                IsStringNullOrEmpty(getLocal("XmlLastSyncLanguage"))) {
        localStorage.removeItem("DatabaseID");
        localStorage.removeItem("SupportedLanguages");
        localStorage.removeItem("Language");
        localStorage.removeItem("LanguageName");
        setTimeout(function () {
            LoginSettings_OpenPopUp();
        }, 500);
        loginPage.find("#LoginSettingsPopUp").popup({ history: false });

        localStorage.removeItem("XmlTranslation");
        localStorage.removeItem("XmlLastSyncDate");
        localStorage.removeItem("XmlLastSyncLanguage");
    } else if (getLocal("SSOUser") == "true") {
        LoginSettings_OpenPopUp();
    }

    //LoadScreenTranslation();
}        
