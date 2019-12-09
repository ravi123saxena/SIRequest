
/*************************Customer logo URL for UAT connection****************************/
//var customerLogoPath = 'https://tst.mainstreamsasp.com/QuickLinksImages/iCRSCustomerLogo/';
/***********************URL for UAT connection End**************************/

/*************************URL for PRD connection****************************/
var customerLogoPath = 'https://www.mainstreamsasp.com/QuickLinksImages/iCRSCustomerLogo/';
/************************URL for PRD connectionEnd**************************/

$.constants = {};

// Constant for identifying the host of the backend services. PROD:icrs. and UAT:tst. for bwlow 2 ursl
//$.constants.STANDARDADDRESS_STRING = "http://ezukherosbsiticrs.azurewebsites.net/";
$.constants.STANDARDADDRESS_STRING = "http://herouaticrs.azurewebsites.net/";
//$.constants.STANDARDADDRESS_STRING = "http://localhost:57345/" ;
$.constants.SETTINGS_STRING = "http://herouaticrs.azurewebsites.net/";
//$.constants.SETTINGS_STRING = "http://ezukherosbsiticrs.azurewebsites.net/";
//$.constants.SETTINGS_STRING = "http://localhost:57345/" ;
// Identifies the database/platform that iMFM connects to. PROD:MOB00 UAT:WEB00
$.constants.DB_STRING = "TST00";
// PROD:MOB00 UAT:WEB00
$.constants.WEB_OR_MOB00 = "TST00";
// Identifies first call to US region. for PROD "MOB00000iCRS/" for UAT : WEB00000iCRS/
$.constants.USREGIONFIRSTCALL = "TST00432iCRS/";

var standardAddress = '';
var quickLinksData;
var translatedStrings = new Object();
var translatedStringsMenu = new Object();
var translatedFrenchStrings = new Object();
var translatedCommonStrings = new Object();
var invalidDatabaseTranslation = "Invalid Customer ID.";

// textbox fields
var GLAccountText;
var CostCenterText;
var Reference1Text;
var Reference2Text;
var Reference3Text;
var Reference4Text;
var Reference5Text;
var Reference6Text;
var Reference7Text;
var Reference8Text;
var ProjFixedCost;
var WOFixedCost;
// dropdown fields
var BusinessUnitDropdown;
var CostCenterDropDown;
var Reference1DropDown;
var Reference2DropDown;
var Reference3DropDown;
var Reference4DropDown;
var Reference5DropDown;
var Reference6DropDown;
var Reference7DropDown;
var Reference8DropDown;
var AccountFrameListArray = new Array();
var requiredCount = 0;
var LevelChanged = false;
var promtFlag;
var ajaxCalls = [];
var tempCalls = [];
var MasterID = null;
var GlobalLat;
var GlobalLong;
var databaseID = '';


var undefinedString = 'undefined';
var emptyString = '';
var commonStrings = [];
var MinYear = 1940;
var MaxYear = 2099;
var notSetTranslation = "-Not Set-";
var syncTime = 60000;
var processTime = 30000;
var pictureSource;
var destinationType;

// added after merging from V2.6
var allCallsComplete = 0;
var isDebugMode = true;
var isAlreadySynced;
var createWorkOrderFlag = false;
var newWorkOrderData;

var noNetworkTranslation = "No network connection. Please try again when network is available.";

var DatabaseConnection = "";
var getActiveLanguagesResponse = null;
var supportedLanguagesTemp = null;

var cannotBeEmptyTranslation = "cannot be empty.";
var invalidDatabaseTranslation = "Invalid Customer ID.";
var customerIDTranslation = "Customer ID";
var userNameTranslation = "User Name";
var passwordTranslation = "Password";
var languageTranslation = "Language";
var langOptionTranslation = "-Language-";

var loginPageID = "Login";

var intFilter;
var checkResetinRequestService = false;
var menu = new Array()
var key = 'a1b2c3';
var quickLinksData; // Used to store quicklinks data locally.
var appName = 'aCRS' // Used to change the App header with repect to the OS(iOS or Android)
var appHeaderForiOS = ':: iCRS ::';
var appHeaderForAndroid = ':: aCRS ::';

//Used in roldexGrid method(dashboard.js)
var canAccessHomeMenuData = '';
var supportedLanguagesDropDown;
