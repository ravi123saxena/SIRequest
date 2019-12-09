//***********************************Create Service Request*************************************

// variables of create service request.
//Used to store the translation values
var translatedStrings = new Object();
// textbox fields
var GLAccountText;
var CostCenterText;
var AccountFrameListArray = new Array();
var RecentRequestCollection = new Array();
var requiredCount = 0;
var LevelChanged = false;
var estimationServiceCostRegularExpression = '';
var NumberExpression = "^\d+$";
var PhoneNumberFormat;
var ErrorMessage = '';
var DatabaseId = '';
var Language = '';
var LevelChangedError = "";
var projectFixedCostValue = null;
var woFixedcostValue = null;
var CASInvalidInput = '';
var requiredMessage = '';
var TextBoxFlag = '';
var DefaultEnteredByEmployee = '';
var SourceACBArray = new Array();
var business = '';
var subBusiness = '';
var businessGroup = '';
var IsQuickLinksPage = '';
var businessDropDown = '';
var subbusinessDropDown = '';
var businessgroupDropDown = '';
var validateBusinessRequired = false;
var locationInfo = '';
var fromQuickLinks = '0';
//This variable checks if levels are changed,based on this it resets all levels for the first time since all contracts particular to caller will be loaded and user can change contracts which can mismatch with levels
var isLevelsChanged = false;

if (IsStringNullOrEmpty(getLocal("EmployeeNumber")) || getLocal("EmployeeNumber") === "null") {
    if (!IsStringNullOrEmpty(decryptStr(getLocal("DefaultEnteredByEmployee")))) {
        DefaultEnteredByEmployee = decryptStr(getLocal("DefaultEnteredByEmployee"));
    }
}
else {
    DefaultEnteredByEmployee = getLocal("EmployeeNumber");
}

if (!IsStringNullOrEmpty(getLocal("Language"))) {
    if (getLocal("Language") == "en-US") {
        estimationServiceCostRegularExpression = "[$]?([-][0-9]{1,2}([.][0-9]{1,2})?)$|^[$]?([0-9]{1,13})?([.][0-9]{1,2})$|^[$]?[0-9]{1,13}$";
    }
    else {
        estimationServiceCostRegularExpression = "[$]?([-][0-9]{1,2}([,][0-9]{1,2})?)$|^[$]?([0-9]{1,13})?([,][0-9]{1,2})$|^[$]?[0-9]{1,13}$";
    }
}

/// Function to get the location details and fill the default values to the location dropdowns.
function GetServiceRequestDetails() {

    setTimeout(function () {
        $('#ContractDivCollapsable .ui-collapsible-heading-toggle').text(getTranslatedValue("ContractCollapsible") + " - " + $('#ContractDropDown option:selected').text());
    }, 1000);

    
    var customerNumber = getLocal("PreviousPage") == "Barcode" ? getLocal("BarcodeCustomerNumber") : getLocal("CustomerNumber");
    var customerSiteNumber = getLocal("PreviousPage") == "Barcode" ? getLocal("BarcodeCustomerSiteNumber") : getLocal("CustomerSiteNumber");

    if (navigator.onLine) {
        LockLevels();
        if (decryptStr(getLocal('QLServiceRequestProblemCustomLabel')) === '1') {
            locationInfo = getTranslatedValue("LocationInfoCustomLabel");
        } else {
            locationInfo = getTranslatedValue("LocationInfoLabel");
        }

        var level = '';


        if (!IsStringNullOrEmpty(getLocal("LatLongRegionNumberForServiceReq")) && !IsStringNullOrEmpty(getLocal("LatLongDivisionNumberForServiceReq"))
            && !IsStringNullOrEmpty(getLocal("LatLongDistrictNumberForServiceReq"))) {
            level = "11";
        }
        else {
            level = "10";
        }

        var myJsonObject = {
            "databaseID": decryptStr(getLocal("DatabaseID")),
            "customerNumber": (getLocal("PreviousPage") == "Barcode" ? getLocal("BarcodeCustomerNumber") :
                (IsStringNullOrEmpty(getLocal("LatLongCustNumberForServiceReq")) ? getLocal("CustomerNumber") : getLocal("LatLongCustNumberForServiceReq"))),
            "customerSiteNumber": (getLocal("PreviousPage") == "Barcode" ? getLocal("BarcodeCustomerSiteNumber") :
                (IsStringNullOrEmpty(getLocal("LatLongCustSiteNumberForServiceReq")) ? getLocal("CustomerSiteNumber") : getLocal("LatLongCustSiteNumberForServiceReq"))),
            "databaseName": decryptStr(getLocal("databaseName")),
            "language": getLocal("Language"),
            "regionNumber": getLocal("PreviousPage") == "Barcode" ? getLocal("BarcodeRegionNumber") : getLocal("LatLongRegionNumberForServiceReq"),
            "divisionNumber": getLocal("PreviousPage") == "Barcode" ? getLocal("BarcodeDivisionNumber") : getLocal("LatLongDivisionNumberForServiceReq"),
            "districtNumber": getLocal("PreviousPage") == "Barcode" ? getLocal("BarcodeDistirictNumber") : getLocal("LatLongDistrictNumberForServiceReq"),
            "seq": getLocal("seq"),
            "level": level
        };

        var accessURL = standardAddress + "CreateServiceRequest.svc/GetCallerDefaultLocationDetails";

        $.postJSON(accessURL, myJsonObject, function (data) {

            if (data != null) {
                setLocal("RegionNumber", data[0][0].RegionNumber);
                setLocal("DivisionNumber", data[0][0].DivisionNumber);
                setLocal("DistrictNumber", data[0][0].DistrictNumber);
                //setLocal("Location", data['Location']);
                var level1Dropdown = '';
                for (var i = 0; i < data[1].length; i++) {
                    level1Dropdown = level1Dropdown + '<option value = "' + data[1][i].RegionNumber + '">' + data[1][i].Description + '</option>';
                }
                setLocal("Level1Dropdown", level1Dropdown);
                $('#Level1DropDown').append(level1Dropdown).selectmenu('refresh');
                //$('#Level1DropDown').val(getLocal("RegionNumber")).selectmenu('refresh');
                if (!IsStringNullOrEmpty(getLocal("LatLongRegionNumberForServiceReq")) && getLocal("PreviousPage") != "Barcode") {
                    var status = false;
                    //if (!IsStringNullOrEmpty(getLocal("FilterLevel1DropDown")) ? (decryptStr(getLocal("FilterLevel1DropDown")) === "1") : null) {
                    $('#Level1DropDown option').each(function () {
                        if (this.value == getLocal("LatLongRegionNumberForServiceReq")) {
                            status = true;
                        }
                    });
                    //}
                    //                    else {
                    //                        status = true;
                    //                    }

                    if (status == true) {
                        $('#Level1DropDown').val(getLocal("LatLongRegionNumberForServiceReq")).selectmenu('refresh');
                    }
                    else {
                        if (!IsStringNullOrEmpty(getLocal("RegionNumber"))) {
                            $('#Level1DropDown option').each(function () {
                                if (this.value == getLocal("RegionNumber")) {
                                    status = true;
                                }
                            });

                            if (status == true) {
                                $('#Level1DropDown').val(getLocal("RegionNumber")).selectmenu('refresh');
                            }
                        }
                        else {
                            $('#Level1DropDown').val("0").selectmenu('refresh');
                        }
                    }
                }
                else {
                    var status = false;
                    //if (!IsStringNullOrEmpty(getLocal("FilterLevel1DropDown")) ? (decryptStr(getLocal("FilterLevel1DropDown")) === "1") : null) {
                    $('#Level1DropDown option').each(function () {
                        if (this.value == getLocal("RegionNumber")) {
                            status = true;
                        }
                    });

                    if (status == true) {
                        $('#Level1DropDown').val(getLocal("RegionNumber")).selectmenu('refresh');
                    }
                    else {
                        $('#Level1DropDown').val("0").selectmenu('refresh');
                    }
                    //                    }
                    //                    else {
                    //                        $('#Level1DropDown').val(getLocal("RegionNumber")).selectmenu('refresh');
                    //                    }
                }

                var level2Dropdown = '';
                for (var i = 0; i < data[2].length; i++) {
                    level2Dropdown = level2Dropdown + '<option value = "' + data[2][i].DivisionNumber + '">' + data[2][i].Description + '</option>';
                }
                setLocal("Level2DropDown", level2Dropdown);
                $('#Level2DropDown').append(level2Dropdown).selectmenu('refresh');
                //$('#Level2DropDown').val(getLocal("DivisionNumber")).selectmenu('refresh');
                if (!IsStringNullOrEmpty(getLocal("LatLongDivisionNumberForServiceReq")) && getLocal("PreviousPage") != "Barcode") {
                    var status = false;
                    //if (!IsStringNullOrEmpty(getLocal("FilterLevel1DropDown")) ? (decryptStr(getLocal("FilterLevel1DropDown")) === "1") : null) {
                    $('#Level2DropDown option').each(function () {
                        if (this.value == getLocal("LatLongDivisionNumberForServiceReq")) {
                            status = true;
                        }
                    });
                    //                    }
                    //                    else {
                    //                        status = true;
                    //                    }

                    if (status == true) {
                        $('#Level2DropDown').val(getLocal("LatLongDivisionNumberForServiceReq")).selectmenu('refresh');
                    }
                    else {
                        if (!IsStringNullOrEmpty(getLocal("DivisionNumber"))) {
                            $('#Level2DropDown option').each(function () {
                                if (this.value == getLocal("DivisionNumber")) {
                                    status = true;
                                }
                            });

                            if (status == true) {
                                $('#Level2DropDown').val(getLocal("DivisionNumber")).selectmenu('refresh');
                            }
                        }
                        else {
                            $('#Level2DropDown').val("0").selectmenu('refresh');
                        }
                    }
                }
                else {
                    var status = false;
                    // if (!IsStringNullOrEmpty(getLocal("FilterLevel1DropDown")) ? (decryptStr(getLocal("FilterLevel1DropDown")) === "1") : null) {
                    $('#Level2DropDown option').each(function () {
                        if (this.value == getLocal("DivisionNumber")) {
                            status = true;
                        }
                    });
                    //                    }
                    //                    else {
                    //                        status = true;
                    //                    }

                    if (status == true) {
                        $('#Level2DropDown').val(getLocal("DivisionNumber")).selectmenu('refresh');
                    }
                    else {
                        $('#Level2DropDown').val("0").selectmenu('refresh');
                    }
                }

                var level3Dropdown = '';
                for (var i = 0; i < data[3].length; i++) {
                    level3Dropdown = level3Dropdown + '<option value = "' + data[3][i].DistrictNumber + '">' + data[3][i].Description + '</option>';
                }
                setLocal("Level3DropDown", level3Dropdown);
                $('#Level3DropDown').append(level3Dropdown);
                //$('#Level3DropDown').val(getLocal("DistrictNumber")).selectmenu('refresh');
                if (!IsStringNullOrEmpty(getLocal("LatLongDivisionNumberForServiceReq")) &&
                    !IsStringNullOrEmpty(getLocal("LatLongRegionNumberForServiceReq")) &&
                    !IsStringNullOrEmpty(getLocal("LatLongDistrictNumberForServiceReq")) && getLocal("PreviousPage") != "Barcode") {
                    //                    $("#Level3DropDown option:eq(1)").attr("selected", "selected");
                    var status = false;
                    $('#Level3DropDown option').each(function () {
                        if (this.value == getLocal("LatLongDistrictNumberForServiceReq")) {
                            status = true;
                        }
                    });

                    if (status == true || status == "true") {
                        $("#Level3DropDown option[value='" + parseInt(getLocal("LatLongDistrictNumberForServiceReq")) + "']").attr('selected', 'selected');
                        $("#Level3DropDown").selectmenu('refresh');
                    }
                    else {
                        if (!IsStringNullOrEmpty(getLocal("DistrictNumber")))
                            $('#Level3DropDown option').each(function () {
                                if (this.value == getLocal("DistrictNumber")) {
                                    status = true;
                                }
                            });

                        if (status == true) {
                            $('#Level3DropDown').val(getLocal("DistrictNumber")).selectmenu('refresh');
                        }
                        else {
                            $('#Level3DropDown').val("0").selectmenu('refresh');
                        }
                    }
                }
                else {
                    var status = false;
                    //if (!IsStringNullOrEmpty(getLocal("FilterLevel1DropDown")) ? (decryptStr(getLocal("FilterLevel1DropDown")) === "1") : null) {
                    $('#Level3DropDown option').each(function () {
                        if (this.value == getLocal("DistrictNumber")) {
                            status = true;
                        }
                    });
                    //                    }
                    //                    else {
                    //                        status = true;
                    //                    }

                    if (status == true) {
                        $('#Level3DropDown').val(getLocal("DistrictNumber")).selectmenu('refresh');
                    }
                    else {
                        $('#Level3DropDown').val("0").selectmenu('refresh');
                    }
                }

                var level4Dropdown = '';
                for (var i = 0; i < data[4].length; i++) {
                    //                    var customerSite = data[4][i].CustomerSiteNumber.split("ì");
                    level4Dropdown = level4Dropdown + '<option value = "' + data[4][i].CustomerSiteNumber + '">' + data[4][i].Description + '</option>';
                }
                setLocal("Level4DropDown", level4Dropdown);
                $('#Level4DropDown').append(level4Dropdown);
                //$('#Level4DropDown').val(getLocal("CustomerSiteNumber")).selectmenu('refresh');
                if (!IsStringNullOrEmpty(getLocal("LatLongDivisionNumberForServiceReq")) && !IsStringNullOrEmpty(getLocal("LatLongRegionNumberForServiceReq")) &&
                    getLocal("PreviousPage") != "Barcode") {
                    $("#Level4DropDown option:eq(1)").attr("selected", "selected");
                    $("#Level4DropDown").selectmenu('refresh');
                }
                else {
                    var status = false;
                    $('#Level4DropDown option').each(function () {
                        if (this.value == customerNumber + 'ì' + customerSiteNumber) {
                            status = true;
                        }
                    });

                    if (status == true) {
                        var customerDetails = customerNumber + 'ì' + customerSiteNumber;
                        $('#Level4DropDown').val(customerDetails).selectmenu('refresh');
                    }
                    else {
                        $("#Level4DropDown option:eq(1)").attr("selected", "selected");
                        $("#Level4DropDown").selectmenu('refresh');
                    }
                }                

                if ($.mobile.activePage.attr('id') != "requestService") {
                    bindDefaultCostCenter();
                    if (decryptStr(getLocal("MSIClientCode")).toUpperCase() == "BP") {
                        isProblemCodeBillableForBP();
                    }
                }


                if ($('#Level1DropDown').val() != 0 && $('#Level2DropDown').val() != 0 && $('#Level3DropDown').val() != 0) {
                    $('#Collapsible2 .ui-collapsible-heading-toggle').text(locationInfo + " - " + $('#Level2DropDown option:selected').text() + "/ " + $('#Level3DropDown option:selected').text());
                }
                else if ($('#Level1DropDown').val() != 0 && $('#Level2DropDown').val() != 0) {
                    $('#Collapsible2 .ui-collapsible-heading-toggle').text(locationInfo + " - " + $('#Level2DropDown option:selected').text());
                }
                else {
                    $('#Collapsible2 .ui-collapsible-heading-toggle').text(locationInfo);
                }

                if (decryptStr(getLocal("SRIShowRecentRequests")) != null & decryptStr(getLocal("SRIShowRecentRequests")) != "") {
                    if (decryptStr(getLocal("SRIShowRecentRequests")).toLowerCase() == "true") {
                        RecentRequestsTable();
                    }
                    else {
                        $("#RecentRequestCollapsible").hide();
                        hideImage();
                        checkDisabledDropDowns();
                    }
                }
            }

            if ($.mobile.activePage.attr('id') == "requestService") {
                ProblemCodeSetUp();
            }
            if (getLocal("SERVICEREQUESTSSHOWLOADING") == "TRUE") {
                setLocal("SERVICEREQUESTSSHOWLOADING", "FALSE");
                hideImage();
            }
        });

        if (decryptStr(getLocal("SetLevelsWhenEditProfile")) != null && decryptStr(getLocal("SetLevelsWhenEditProfile")) != "") {
            if (decryptStr(getLocal("SetLevelsWhenEditProfile")).toLowerCase() == "false") {
                // $("#Level1DropDown").attr("readonly", true);
                // $("#Level1DropDown").parent().addClass("ui-select ui-btn-disabled");
                //$("#Level1DropDown").addClass("dropdownDisabled");
                //$("#Level1DropDown").css("opacity", "0.8");

                //                $("#Level2DropDown").attr("readonly", true);
                //                $("#Level2DropDown").parent().addClass("ui-select ui-btn-disabled");
                //                //$("#Level2DropDown").css("opacity", "0.8");

                //                $("#Level3DropDown").attr("readonly", true);
                //                $("#Level3DropDown").parent().addClass("ui-select ui-btn-disabled");
                //                //$("#Level3DropDown").css("opacity", "0.8");

                //                $("#Level4DropDown").attr("readonly", true);
                //                $("#Level4DropDown").parent().addClass("ui-select ui-btn-disabled");
                //                //$("#Level4DropDown").css("opacity", "0.8");
            }
        }

        openDB();
        dB.transaction(function (ts) {

            ts.executeSql('SELECT ItemValue FROM ConfigCRS where Item="IntShowPriority"', [],
                function (ts, results) {
                    if (decryptStr(results.rows.item(0).ItemValue) == "True") {
                        setLocal("PriorityDropdownConfig", "true");
                        setLocal("IntShowPriority", decryptStr(results.rows.item(0).ItemValue));
                        GetPriority(decryptStr(results.rows.item(0).ItemValue));
                        $('#PriorityRow').show();
                    }
                    else {
                        setLocal("PriorityDropdownConfig", "false");
                        $('#PriorityRow').hide();
                        //document.getElementById("#PriorityRow").style.display = "none";
                        //                             $("#PriorityLabel").parent().hide();
                        //                             $("#PriorityLabelMandatoryLabel").parent().hide();
                    }
                },
                function (e, m, s) { log(e.status); });
        });
    }
    else {
        setTimeout(function () {
            showErrorPopUp(true, noNetworkTranslation);
        }, 1000);

    }
}


/// Bind the Level1 data(Country city)
function BindLevel1Data() {
    if (navigator.onLine) {
        var url = standardAddress + "CreateServiceRequest.svc/GetLocationInformation";
        var myJsonObject = {
            "LogOnDataContract": {
                "DataBaseID": decryptStr(getLocal("DatabaseID")),
                "LanguageSelected": getLocal("Language"),
                "DatabaseName": decryptStr(getLocal("databaseName"))
            }
        };

        var getLocationInformation = $.postJSON(url, myJsonObject, function (data) {
            $("#Level1DropDown option:gt(0)").remove();
            if (data != null) {
                for (index = 0; index < data.length; index++) {
                    var dropdown = document.createElement('option');
                    dropdown.setAttribute("value", data[index]['RegionNumber']);
                    dropdown.innerHTML = data[index]['Description'];
                    $('#Level1DropDown').append(dropdown).selectmenu('refresh');
                }
            }

            if ($('#Level1DropDown').val() != $("#hiddenLevel1Dropdown").val()) {
                $('#Level1DropDown').val($("#hiddenLevel1Dropdown").val());
                $('#Level1DropDown').selectmenu('refresh');
                BindLevel2Data();
                if (decryptStr(getLocal("ShowLevelSearch")) != null && decryptStr(getLocal("ShowLevelSearch")) != "") {
                    if (decryptStr(getLocal("ShowLevelSearch")).toLowerCase() == "true") {
                        if (!IsStringNullOrEmpty($("#SearchTextBox").val())) {
                            $("#SearchTextBox").val('');
                            if ($("#CategoryDropDown").val() != "-1" || $("#CategoryDropDown").val() != null) {
                                $("#CategoryDropDown").val("-1");
                                $("#CategoryDropDown").selectmenu("refresh");
                            }
                        }
                    }
                }
            }
            $('#Level1DropDown').selectmenu('refresh');
        });
    }
    else {
        setTimeout(function () {
            showErrorPopUp(true, noNetworkTranslation);
        }, 1000);
    }
}

/// Bind Level2 data(Building)
function BindLevel2Data() {

    if (navigator.onLine) {
        var myJsonObject = '';

        $('#Collapsible2 .ui-collapsible-heading-toggle').text(locationInfo);
        //        if ($('#Level1DropDown').val() != "0" && $('#Level1DropDown').val() != null) {
        if ($('#Level1DropDown').val() != "" && $('#Level1DropDown').val() != null && $('#Level1DropDown').val() != undefined && $("#Level1DropDown option:selected").text() != getTranslatedValue("selectOption")) {

            myJsonObject = {
                "callerObject": {
                    "DataBaseID": decryptStr(getLocal("DatabaseID")),
                    "RegionNumber": $('#Level1DropDown').val(),
                    "Level": 2,
                    "Seq": getLocal("seq"),
                    "DatabaseName": decryptStr(getLocal("databaseName")),
                    "Language": getLocal("Language")
                }
            };

            var url = standardAddress + "CreateServiceRequest.svc/BindDropDownData";
            $.postJSON(url, myJsonObject, function (data) {
                $("#Level2DropDown option:gt(0)").remove();
                $("#Level3DropDown option:gt(0)").remove();
                $('#Level3DropDown').selectmenu('refresh');
                $("#Level4DropDown option:gt(0)").remove();
                $('#Level4DropDown').selectmenu('refresh');
                if (data != null) {
                    for (index = 0; index < data.length; index++) {
                        var dropdown = document.createElement('option');
                        dropdown.setAttribute("value", data[index]['DivisionNumber']);
                        dropdown.innerHTML = data[index]['Description'];
                        $('#Level2DropDown').append(dropdown);
                    }
                }

                $('#Level2DropDown').selectmenu('refresh');
                if (!IsStringNullOrEmpty($("#hiddenLevel2Dropdown").val()) && checkResetinRequestService == true) {
                    setTimeout(function () {
                        $('#Level2DropDown').val($("#hiddenLevel2Dropdown").val());
                        $('#Level2DropDown').selectmenu('refresh');
                        BindLevel3Data();
                    }, 300);
                }
                else {
                    checkResetinRequestService == false;
                }
            });
        }
        else {
            $('#Collapsible2 .ui-collapsible-heading-toggle').text(locationInfo);
            $("#Level2DropDown option:gt(0)").remove();
            $("#Level2DropDown").selectmenu("refresh");
            $("#Level3DropDown option:gt(0)").remove();
            $("#Level3DropDown").selectmenu("refresh");
            $("#Level4DropDown option:gt(0)").remove();
            $("#Level4DropDown").selectmenu("refresh");
        }
    }
    else {
        setTimeout(function () {
            showErrorPopUp(true, noNetworkTranslation);
        }, 1000);
    }
}

/// Bind Contract Dropdown based on level1 changes 
function BindContractForLevel1change() {
    if (navigator.onLine) {
        var url = standardAddress + "CreateServiceRequest.svc/LoadContractForCallerBasedOnBuilding";
        var myJsonObject = {
            "generalObject": {
                "DataBaseID": decryptStr(getLocal("DatabaseID")),
                "LanguageSelected": getLocal("Language"),
                "DatabaseName": decryptStr(getLocal("databaseName")),
                "SessionId": decryptStr(getLocal("SessionId")),
                "CallerSeq": getLocal("seq"),
                "RegionNumber": $('#Level1DropDown').val()
            }
        };

        $.postJSON(url, myJsonObject, function (data) {

            $("#ContractDropDown option:gt(0)").remove();
            if (data != null) {
                for (index = 0; index < data.length; index++) {
                    var dropdown = document.createElement('option');
                    dropdown.setAttribute("value", data[index]['FilterSeq']);
                    dropdown.innerHTML = data[index]['BusUnitName'];
                    $('#ContractDropDown').append(dropdown);
                }

                $('#ContractDropDown').selectmenu('refresh');
                if ($("#ContractDropDown option").length > 1 && getLocal("FilterSeq") != null) {
                    setTimeout(function () {
                        $('#ContractDropDown').val(getLocal("FilterSeq"));
                        $("#ContractDropDown option:gt(0)").remove();
                        $('#ContractDropDown').selectmenu('refresh');
                    }, 300);
                }
                else {
                    setTimeout(function () {
                        $("#ContractDropDown").val($("#ContractDropDown").find('option:eq(0)').val());
                        $("#ContractDropDown option:gt(0)").remove();
                        $('#ContractDropDown').selectmenu('refresh');
                    }, 300);
                }
            }
        });
    }
    else {
        setTimeout(function () {
            showErrorPopUp(true, noNetworkTranslation);
        }, 1000);
    }

}

/// Bind Contract Dropdown on level2 changes 
function BindContractForLevel2change() {

    if (navigator.onLine) {
        var myJsonObject = '';

        $('#Collapsible2 .ui-collapsible-heading-toggle').text(locationInfo);
        //        if ($('#Level1DropDown').val() != "0" && $('#Level1DropDown').val() != null) {
        if ($('#Level1DropDown').val() != "" && $('#Level1DropDown').val() != null && $('#Level1DropDown').val() != undefined && $("#Level1DropDown option:selected").text() != getTranslatedValue("selectOption") && $('#Level2DropDown').val() != "" && $('#Level2DropDown').val() != null && $('#Level2DropDown').val() != undefined && $("#Level2DropDown option:selected").text() != getTranslatedValue("selectOption")) {

            myJsonObject = {
                "generalObject": {
                    "DataBaseID": decryptStr(getLocal("DatabaseID")),
                    "LanguageSelected": getLocal("Language"),
                    "RegionNumber": $('#Level1DropDown').val(),
                    "DivisionNumber": $('#Level2DropDown').val(),
                    "CallerSeq": getLocal("seq"),
                    "DatabaseName": decryptStr(getLocal("databaseName")),
                    "Language": getLocal("Language")
                }
            };

            var url = standardAddress + "CreateServiceRequest.svc/GetContractFilterForLocation";

            $.postJSON(url, myJsonObject, function (data) {
                if (data != null) {
                    $("#ContractDropDown option:gt(0)").remove();
                    for (index = 0; index < data.length; index++) {
                        var dropdown = document.createElement('option');
                        dropdown.setAttribute("value", data[index]['FilterSeq']);
                        dropdown.innerHTML = data[index]['BusUnitName'];
                        $('#ContractDropDown').append(dropdown);
                    }
                }
            });
        }
    }
    else {
        setTimeout(function () {
            showErrorPopUp(true, noNetworkTranslation);
        }, 1000);
    }
}


/// Bind Level3 data (Floor)
function BindLevel3Data() {
    if (navigator.onLine) {
        isLevelsChanged = true;
        var myJsonObject =
        {
            "callerObject": {
                "DataBaseID": decryptStr(getLocal("DatabaseID")),
                "RegionNumber": $('#Level1DropDown').val(),
                "DivisionNumber": $('#Level2DropDown').val(),
                "Level": 3, "Seq": getLocal("seq"),
                "DatabaseName": decryptStr(getLocal("DatabaseID")),
                "Language": getLocal("Language")
            }
        };
        //        if ($('#Level1DropDown').val() != "0" && $('#Level1DropDown').val() != null && $('#Level2DropDown').val() != "0") {
        if ($('#Level1DropDown').val() != "" && $('#Level1DropDown').val() != null && $('#Level1DropDown').val() != undefined && $("#Level1DropDown option:selected").text() != getTranslatedValue("selectOption") &&
            $('#Level2DropDown').val() != "" && $('#Level2DropDown').val() != null && $('#Level2DropDown').val() != undefined && $("#Level2DropDown option:selected").text() != getTranslatedValue("selectOption")) {
            $('#Collapsible2 .ui-collapsible-heading-toggle').text(locationInfo + " - " + $('#Level2DropDown option:selected').text());
        }
        else {
            $('#Collapsible2 .ui-collapsible-heading-toggle').text(locationInfo);
        }

        var url = standardAddress + "CreateServiceRequest.svc/BindDropDownData";
        var getLocationInformation = $.postJSON(url, myJsonObject, function (data) {
            $("#Level3DropDown option:gt(0)").remove();
            $('#Level3DropDown').selectmenu('refresh');
            $("#Level4DropDown option:gt(0)").remove();
            $('#Level4DropDown').selectmenu('refresh');
            if (data != null) {
                for (index = 0; index < data.length; index++) {
                    var dropdown = document.createElement('option');
                    dropdown.setAttribute("value", data[index]['DistrictNumber']);
                    dropdown.innerHTML = data[index]['Description'];
                    $('#Level3DropDown').append(dropdown);
                }
            }

            $('#Level3DropDown').selectmenu('refresh');
            if (!IsStringNullOrEmpty($("#hiddenLevel3Dropdown").val()) && checkResetinRequestService == true) {
                setTimeout(function () {
                    $('#Level3DropDown').val($("#hiddenLevel3Dropdown").val());
                    $('#Level3DropDown').selectmenu('refresh');
                    BindLevel4Data();
                }, 300);
            }
            else {
                checkResetinRequestService == false;
            }
        });
    }
    else {
        setTimeout(function () {
            showErrorPopUp(true, noNetworkTranslation);
        }, 1000);
    }
}

/// Bind Level4 data(Area)
function BindLevel4Data() {
    if (navigator.onLine) {
        var myJsonObject = {
            "callerObject": {
                "DataBaseID": decryptStr(getLocal("DatabaseID")),
                "RegionNumber": $('#Level1DropDown').val(),
                "DivisionNumber": $('#Level2DropDown').val(),
                "DistrictNumber": $('#Level3DropDown').val(),
                "Level": 4, "Seq": getLocal("seq"),
                "DatabaseName": decryptStr(getLocal("DatabaseID")),
                "Language": getLocal("Language"),
                "ContractFilterSeq": $("#ContractDropDown").val()
            }
        };
        if ($('#Level3DropDown').val() != "" && $('#Level3DropDown').val() != null && $('#Level3DropDown').val() != undefined && $("#Level3DropDown option:selected").text() != getTranslatedValue("selectOption")) {
            $('#Collapsible2 .ui-collapsible-heading-toggle').text(locationInfo + " - " + $('#Level2DropDown option:selected').text() + '/' + $('#Level3DropDown option:selected').text());
        } else {
            $('#Collapsible2 .ui-collapsible-heading-toggle').text(locationInfo + " - " + $('#Level2DropDown option:selected').text());
        }

        var url = standardAddress + "CreateServiceRequest.svc/BindDropDownData";
        var getLocationInformation = $.postJSON(url, myJsonObject, function (data) {
            $("#Level4DropDown option:gt(0)").remove();
            if (data != null) {
                for (index = 0; index < data.length; index++) {
                    var dropdown = document.createElement('option');
                    dropdown.setAttribute("value", data[index]['CustomerSiteNumber']);
                    dropdown.innerHTML = data[index]['Description'];
                    $('#Level4DropDown').append(dropdown);
                }
            }

            $('#Level4DropDown').selectmenu('refresh');
            if (!IsStringNullOrEmpty($("#hiddenLevel4Dropdown").val()) && checkResetinRequestService == true) {
                setTimeout(function () {
                    $('#Level4DropDown').val($("#hiddenLevel4Dropdown").val());
                    $('#Level4DropDown').selectmenu('refresh');
                }, 300);
            }
            else {
                checkResetinRequestService == false;
            }

        });
    }
    else {
        setTimeout(function () {
            showErrorPopUp(true, noNetworkTranslation);
        }, 1000);
    }
}

function BindLocationHeader() {
    if (navigator.onLine) {
        //3rd June 2019: On change of Area or Level 4 dropdown values updating recent request list @ end of the screen
        $(".recentRequestListView").empty();
        RecentRequestsTable();
        $('#Collapsible2 .ui-collapsible-heading-toggle').text(locationInfo + " - " + $('#Level2DropDown option:selected').text() + '/' + $('#Level3DropDown option:selected').text());
        if ($.mobile.activePage.attr('id') == "requestService") {
            BindEquipmentDetails("EquipmentGroupDropDownList");
        } else {
            bindDefaultCostCenter();
        }
    }
    else {
        setTimeout(function () {
            showErrorPopUp(true, noNetworkTranslation);
        }, 1000);
    }
}


/// Function to filter the location dropdwon values based on search critirea entered in Category/Search textbox.
function FilterLocationDropdown() {
    if (navigator.onLine) {

        var level;
        var myJsonObject;
        var url = standardAddress + "CreateServiceRequest.svc/BindDropDownData";
        if ($("#SearchTextBox").val().length > 0 && !($("#CategoryDropDown").val() === "-1")) {
            loadingImage();
            switch ($("#CategoryDropDown").val()) {
                case "1":
                    level = 1;
                    myJsonObject = {
                        "callerObject": {
                            "DataBaseID": decryptStr(getLocal("DatabaseID")),
                            "Level": level,
                            "SearchString": $("#SearchTextBox").val(),
                            "DatabaseName": decryptStr(getLocal("DatabaseID")),
                            "Language": getLocal("Language")
                        }
                    };
                    $.postJSON(url, myJsonObject, function (data) {

                        if (data != null) {
                            $("#Level1DropDown option:gt(0)").remove();
                            $("#Level2DropDown option:gt(0)").remove();
                            $('#Level2DropDown').selectmenu('refresh');
                            $("#Level3DropDown option:gt(0)").remove();
                            $('#Level3DropDown').selectmenu('refresh');
                            $("#Level4DropDown option:gt(0)").remove();
                            $('#Level4DropDown').selectmenu('refresh');
                            for (index = 0; index < data.length; index++) {
                                var dropdown = document.createElement('option');
                                dropdown.setAttribute("value", data[index]['RegionNumber']);
                                dropdown.innerHTML = data[index]['Description'];
                                $('#Level1DropDown').append(dropdown);
                            }
                        }

                        $('#Level1DropDown').selectmenu('refresh');
                        hideImage();
                    });
                    break;
                case "2":
                    level = 2;
                    myJsonObject = {
                        "callerObject": {
                            "DataBaseID": decryptStr(getLocal("DatabaseID")),
                            "Level": level,
                            "SearchString": $("#SearchTextBox").val(),
                            "RegionNumber": $('#Level1DropDown').val(),
                            "DatabaseName": decryptStr(getLocal("DatabaseID")),
                            "Language": getLocal("Language")
                        }
                    };
                    $.postJSON(url, myJsonObject, function (data) {
                        if (data != null) {
                            $("#Level2DropDown option:gt(0)").remove();
                            $("#Level3DropDown option:gt(0)").remove();
                            $('#Level3DropDown').selectmenu('refresh');
                            $("#Level4DropDown option:gt(0)").remove();
                            $('#Level4DropDown').selectmenu('refresh');
                            for (index = 0; index < data.length; index++) {
                                var dropdown = document.createElement('option');
                                dropdown.setAttribute("value", data[index]['DivisionNumber']);
                                dropdown.innerHTML = data[index]['Description'];
                                $('#Level2DropDown').append(dropdown);
                            }
                        }

                        $('#Level2DropDown').selectmenu('refresh');
                        hideImage();
                    });
                    break;
                case "3":
                    level = 3;
                    myJsonObject = {
                        "callerObject": {
                            "DataBaseID": decryptStr(getLocal("DatabaseID")),
                            "Level": level,
                            "SearchString": $("#SearchTextBox").val(),
                            "RegionNumber": $('#Level1DropDown').val(),
                            "DivisionNumber": $('#Level2DropDown').val(),
                            "DatabaseName": decryptStr(getLocal("DatabaseID")),
                            "Language": getLocal("Language")
                        }
                    };
                    $.postJSON(url, myJsonObject, function (data) {
                        if (data != null) {
                            $("#Level3DropDown option:gt(0)").remove();
                            $("#Level4DropDown option:gt(0)").remove();
                            $('#Level4DropDown').selectmenu('refresh');
                            for (index = 0; index < data.length; index++) {
                                var dropdown = document.createElement('option');
                                dropdown.setAttribute("value", data[index]['DistrictNumber']);
                                dropdown.innerHTML = data[index]['Description'];
                                $('#Level3DropDown').append(dropdown);
                            }
                        }

                        $('#Level3DropDown').selectmenu('refresh');
                        hideImage();
                    });
                    break;
                case "4":
                    level = 4;
                    myJsonObject = {
                        "callerObject": {
                            "DataBaseID": decryptStr(getLocal("DatabaseID")),
                            "Level": level,
                            "SearchString": $("#SearchTextBox").val(),
                            "RegionNumber": $('#Level1DropDown').val(),
                            "DivisionNumber": $('#Level2DropDown').val(),
                            "DistrictNumber": $('#Level3DropDown').val(),
                            "DatabaseName": decryptStr(getLocal("DatabaseID")),
                            "Language": getLocal("Language")
                        }
                    };
                    $.postJSON(url, myJsonObject, function (data) {
                        if (data != null) {
                            $("#Level4DropDown option:gt(0)").remove();
                            for (index = 0; index < data.length; index++) {
                                var dropdown = document.createElement('option');
                                dropdown.setAttribute("value", data[index]['CustomerNumber'] + 'i' + data[index]['CustomerSiteNumber']);
                                dropdown.innerHTML = data[index]['Description'];
                                $('#Level4DropDown').append(dropdown);
                            }
                        }

                        $('#Level4DropDown').selectmenu('refresh');
                        hideImage();
                    });
                    break;
            }
        }
    }
    else {
        setTimeout(function () {
            hideImage();
            showErrorPopUp(true, noNetworkTranslation);
        }, 1000);
    }
}



/// Function to request the service/create work order.
function CreateWorkOrder() {
    if (navigator.onLine) {
        loadingImage();
        TextBoxFlag = '';
        SaveCASValues();
    }
    else {
        setTimeout(function () {
            showErrorPopUp(true, noNetworkTranslation);
        }, 1000);
    }
}

/// Function to reset the Category/Search critirea for location dropdown filter.
function ResetCategoryDropDown() {
    $('#CategoryDropDown').val('-1')
    $('#CategoryDropDown').selectmenu('refresh');
}

///Function To reset level2,level3 and level4 and selects Level1 "Select" option since contract will be selected and it might mismatch with levels.SO resetting all levels.
function ResetAllLevels() {
    if (!isLevelsChanged) {
        $("#Level1DropDown").val($("#Level1DropDown option:first").val());
        $('#Level1DropDown').selectmenu('refresh');
        $("#Level2DropDown option:gt(0)").remove();
        $('#Level2DropDown').selectmenu('refresh');
        $("#Level3DropDown option:gt(0)").remove();
        $('#Level3DropDown').selectmenu('refresh');
        $("#Level4DropDown option:gt(0)").remove();
        $('#Level4DropDown').selectmenu('refresh');
    }   
}

/// Function to load the priority dropdown.
function GetPriority(boolValue) {
    setTimeout(function () {
        $('#ContractDivCollapsable .ui-collapsible-heading-toggle').text(getTranslatedValue("ContractCollapsible") + " - " + $('#ContractDropDown option:selected').text());
    }, 1000);

      if (navigator.onLine) {
        var url = standardAddress + "CreateServiceRequest.svc/RequestPriority";
        var myJsonObject = {
            "generalObject": {
                "Active": boolValue,
                "DataBaseID": decryptStr(getLocal("DatabaseID")),
                "LanguageSelected": getLocal("Language"),
                "DatabaseName": decryptStr(getLocal("databaseName")),
                "SessionId": decryptStr(getLocal("SessionId")),
                "FilterSeq": $("#ContractDropDown").val()
            }
        };

        $.postJSON(url, myJsonObject, function (data) {
            if (data != null) {
                $("#PriorityDropdown option:gt(0)").remove();
                for (index = 0; index < data.length; index++) {
                    var dropdown = document.createElement('option');
                    dropdown.setAttribute("value", data[index]['PriorityKey']);
                    dropdown.innerHTML = data[index]['Description'];
                    $('#PriorityDropdown').append(dropdown);
                }

                $('#PriorityDropdown').selectmenu('refresh');
                if (decryptStr(getLocal("PriorityDefaultAlways")) != null && decryptStr(getLocal("PriorityDefaultAlways")) != "") {
                    if (decryptStr(getLocal("PriorityDefaultAlways")).toLowerCase() == "true") {
                        if (decryptStr(getLocal("DefaultPriority")) != null && decryptStr(getLocal("DefaultPriority")) != "") {
                            var priority = decryptStr(getLocal("DefaultPriority"));
                            $('#PriorityDropdown').val(priority);
                            $('#PriorityDropdown').selectmenu('refresh');
                        }
                    }
                }


                if (getLocal("ProblemCodeNumber") !== "0") {
                    BindPriorityFromProblemCode(getLocal("ProblemCodeNumber"));
                }

            }
        });
    }
    else {
        setTimeout(function () {
            showErrorPopUp(true, noNetworkTranslation);
        }, 1000);
    }

}


// function to load contract dropdown.

function GetContractForCaller() {
    if (navigator.onLine) {
        var url = standardAddress + "CreateServiceRequest.svc/LoadContractForCaller";
        var myJsonObject = {
            "generalObject": {
                "DataBaseID": decryptStr(getLocal("DatabaseID")),
                "LanguageSelected": getLocal("Language"),
                "DatabaseName": decryptStr(getLocal("databaseName")),
                "SessionId": decryptStr(getLocal("SessionId")),
                "CallerSeq": getLocal("seq")
            }
        };

        $.postJSON(url, myJsonObject, function (data) {

            $("#ContractDropDown option:gt(0)").remove();
            if (data != null) {
                for (index = 0; index < data.length; index++) {
                    var dropdown = document.createElement('option');
                    dropdown.setAttribute("value", data[index]['FilterSeq']);
                    dropdown.innerHTML = data[index]['BusUnitName'];
                    $('#ContractDropDown').append(dropdown);
                }

                $('#ContractDropDown').selectmenu('refresh');
                if ($("#ContractDropDown option").length > 1 && getLocal("FilterSeq") != null) {
                    setTimeout(function () {
                        $('#ContractDropDown').val(getLocal("FilterSeq"));
                        $('#ContractDropDown').selectmenu('refresh');
                    }, 300);
                }
                else {
                    setTimeout(function () {
                        $("#ContractDropDown").val($("#ContractDropDown").find('option:eq(0)').val());
                        $('#ContractDropDown').selectmenu('refresh');
                    }, 300);
                }
            }
        });
    }
    else {
        setTimeout(function () {
            showErrorPopUp(true, noNetworkTranslation);
        }, 1000);
    }

}

/// Function to dynamically build the CAS frame.
function BuildCASFrame() {
    // debugger;
    // alert("here");
    if (navigator.onLine) {
        var myJsonObject;
        var dynamicList = '';
        $('#dynamicCASItemslist').empty();
        var tableRow;
        var tableCell;
        var labelID;
        var mandatoryLabelId = '';
        var labelText;
        var validationMessage;
        var newTableCell;
        var accountFrameListrows;
        var accountFrameListfilter;
        var imageSearchBtnCostcenter;
        var walGreensTablecell = '<td>';
        var count = 1;
        var NumericRegularExpression = "^[0-9]{1,15}([.][0-9]{1,14})?$";
        var url = standardAddress + "CreateServiceRequest.svc/BuildCASFrame";
        var casLang;
        var businessDropDownExists = false;
        var businessAutocompleteExists = false;
        var businessAutoComplete = '';
        CASInvalidInput = '';
        myJsonObject = {
            "generalObject": {
                "DataBaseID": decryptStr(getLocal("DatabaseID")),
                "LanguageSelected": getLocal("Language"),
                "DatabaseName": decryptStr(getLocal("databaseName"))
            }
        };

        //setTimeout(function () {
        $.postJSON(url, myJsonObject, function (data) {

            // alert("CAS");
            if (data != false) {
                if (data != null) {
                    AccountFrameListArray = [];
                    for (indexValue = 0; indexValue < data.length; indexValue++) {
                        AccountFrameListArray.push(data[indexValue]);
                        if (data[indexValue]["Required"]) {
                            setLocal("Count", count);
                            count++;
                        }
                        else {
                            setLocal("Required", null);
                        }
                    }

                    for (index = 0; index < data.length; index++) {
                        accountFrameListrows = new Array();
                        for (i = 0; i < data.length; i++) {
                            if (data[i]["RowNumber"] == index) {
                                accountFrameListrows.push(data[i]);
                            }
                        }

                        //accountFrameListrows[0]["TotalValue"]
                        if (accountFrameListrows.length > 0) {
                            for (index1 = 0; index1 < accountFrameListrows[0]["TotalValue"]; index1++) {
                                tableRow = $('<tr/>');
                                tableCell = $('<td/>');
                                accountFrameListfilter = new Array();
                                for (j = 0; j < accountFrameListrows.length; j++) {
                                    if (accountFrameListrows[j]["ColumnNumber"] == index1) {
                                        accountFrameListfilter.push(accountFrameListrows[j]);
                                    }
                                }

                                if (accountFrameListfilter.length > 0) {
                                    if (accountFrameListfilter[0]["Visible"] == true) {
                                        var casLang;
                                        for (labelindex = 0; labelindex < accountFrameListfilter[0]["Label"].length; labelindex++) {
                                            if (accountFrameListfilter[0]["Label"][labelindex]["LanguageAbbreviation"] == getLocal("Language")) {
                                                casLang = accountFrameListfilter[0]["Label"][labelindex]["LanguageAbbreviation"];
                                                labelText = accountFrameListfilter[0]["Label"][labelindex]["Description"];
                                            }
                                            if (accountFrameListfilter[0]["ValidationMessage"][labelindex]["LanguageAbbreviation"] == getLocal("Language")) {
                                                validationMessage = accountFrameListfilter[0]["ValidationMessage"][labelindex]["Description"];
                                            }
                                            //break;
                                        }
                                        if (casLang == getLocal("Language")) {
                                            //labelText = accountFrameListfilter[0]["Label"][0]["Description"];
                                            //validationMessage = accountFrameListfilter[0]["ValidationMessage"][0]["Description"];
                                            labelID = labelText + 'Label' + index + index1;
                                            if (accountFrameListfilter[0]["Required"]) {
                                                if (accountFrameListfilter[0]["ControlId"] != "CostCenter") {
                                                    mandatoryLabelId = '<label class="custMandatory" id="' + accountFrameListfilter[0]["ControlId"] + "MandatorySymbol" + '" style="color: Red">*</label>';
                                                }
                                                else {
                                                    //                                                    if (decryptStr(getLocal("MSIClientCode")) != null) {
                                                    //                                                        if (decryptStr(getLocal('MSIClientCode')).toUpperCase() != "BP") {
                                                    mandatoryLabelId = '<label class="custMandatory" id="' + accountFrameListfilter[0]["ControlId"] + "MandatorySymbol" + '" style="color: Red">*</label>';
                                                    //                                                        }
                                                    //                                                    }
                                                }

                                                if (validationMessage == null || validationMessage == '') {
                                                    validationMessage = labelText + "is required";
                                                }

                                                labelText = '<label class="custMandatory" id="' + labelID + '">' + labelText + ":" + '</label>';
                                                $(tableCell).append(mandatoryLabelId);
                                                setLocal("Required", "Required");
                                                $('#CASCollapsible .ui-collapsible-heading-toggle').text(getTranslatedValue("CASCollapsible") + " - " + getTranslatedValue("RequiredLabel"));

                                                //                                                if (accountFrameListfilter[0]["ControlId"] == "CostCenter") {
                                                //                                                    if (decryptStr(getLocal("MSIClientCode")) != null) {
                                                //                                                        if (decryptStr(getLocal("MSIClientCode")).toUpperCase() == "BP") {
                                                //                                                            mandatoryLabelId = '<label class="custMandatory" id="' + accountFrameListfilter[0]["ControlId"] + "MandatorySymbol" + '" for="' + labelID + '" style="color: Red">*</label>';
                                                //                                                            $(tableCell).append(mandatoryLabelId);
                                                //                                                        }
                                                //                                                    }
                                                //                                                }
                                            }
                                            else {
                                                if (accountFrameListfilter[0]["ControlId"] == "CostCenter") {
                                                    if (decryptStr(getLocal("MSIClientCode")) != null) {
                                                        if (decryptStr(getLocal("MSIClientCode")).toUpperCase() == "BP") {
                                                            mandatoryLabelId = '<label class="custMandatory" id="' + accountFrameListfilter[0]["ControlId"] + "MandatorySymbol" + '" for="' + labelID + '" style="color: Red">*</label>';
                                                            $(tableCell).append(mandatoryLabelId);
                                                            setLocal("Required", "Required");
                                                        }
                                                    }
                                                }

                                                labelText = '<label class="custMandatory" id="' + labelID + '">' + labelText + ":" + '</label>';
                                                $('#CASCollapsible .ui-collapsible-heading-toggle').text(getTranslatedValue("CASCollapsible"));
                                            }

                                            $(tableCell).append(labelText);

                                            var tableRow1 = '<tr>';
                                            var tableCell1 = '<td>';
                                            if (accountFrameListfilter[0]["Required"]) {
                                                switch (accountFrameListfilter[0]["InputType"]) {
                                                    case "TB":
                                                    case "TA":
                                                    case "TBN":
                                                    case "TBC":
                                                    case "TBP":
                                                        // MSI clientcode need to be implemeted.
                                                        // required field validation message.
                                                        setLocal("Required", "Required");
                                                        $('#CASCollapsible .ui-collapsible-heading-toggle').text(getTranslatedValue("CASCollapsible") + " - " + getTranslatedValue("RequiredLabel"));
                                                        if (accountFrameListfilter[0]["InputType"] == "TB") {
                                                            if (accountFrameListfilter[0]["ControlId"] == "CostCenter") {
                                                                setLocal("CostCenterCRSValidationType", accountFrameListfilter[0]["ValidationType"]);
                                                            }
                                                            //                                                                else {
                                                            //                                                                    setLocal("CostCenterCRSValidationType", null);
                                                            //                                                                }
                                                        }
                                                        break;
                                                    case "DD":
                                                        // required field validation message.
                                                        setLocal("Required", "Required");
                                                        $('#CASCollapsible .ui-collapsible-heading-toggle').text(getTranslatedValue("CASCollapsible") + " - " + getTranslatedValue("RequiredLabel"));
                                                        break;
                                                    case "ACB":
                                                        // required field validation message.
                                                        setLocal("Required", "Required");
                                                        $('#CASCollapsible .ui-collapsible-heading-toggle').text(getTranslatedValue("CASCollapsible") + " - " + getTranslatedValue("RequiredLabel"));
                                                        break;
                                                }
                                            }
                                            else {
                                                switch (accountFrameListfilter[0]["InputType"]) {
                                                    case "TB":
                                                    case "TBN":
                                                    case "TBC":
                                                    case "TBP":
                                                        if (accountFrameListfilter[0]["InputType"] == "TBC") {
                                                            //                                                                CASInvalidInput = getTranslatedValue("CASInvalidInput");

                                                        }
                                                        else if (accountFrameListfilter[0]["InputType"] == "TB") {
                                                            if (accountFrameListfilter[0]["ControlId"] == "CostCenter") {
                                                                setLocal("CostCenterCRSValidationType", accountFrameListfilter[0]["ValidationType"]);
                                                                if (!IsStringNullOrEmpty(decryptStr(getLocal("MSIClientCode")))) {
                                                                    if (decryptStr(getLocal("MSIClientCode")).toUpperCase() == "BP") {
                                                                        if (!IsStringNullOrEmpty(validationMessage)) {
                                                                            validationMessage = labelText + "is required";
                                                                        }

                                                                        requiredMessage = validationMessage;
                                                                    }
                                                                }
                                                            }
                                                            //                                                                else {
                                                            //                                                                    setLocal("CostCenterCRSValidationType", null);
                                                            //                                                                }
                                                        }
                                                        else {
                                                            //                                                                CASInvalidInput = getTranslatedValue("CASInvalidInput");
                                                        }
                                                        break;
                                                }
                                                $('#CASCollapsible .ui-collapsible-heading-toggle').text(getTranslatedValue("CASCollapsible"));
                                                setLocal("Required", null);
                                            }


                                            switch (accountFrameListfilter[0]["InputType"]) {
                                                case "TB":
                                                case "TA":
                                                case "TBN":
                                                case "TBC":
                                                case "TBP":
                                                    var costCentertextBox;
                                                    if (accountFrameListfilter[0]["ControlId"] == "CostCenter") {
                                                        //setTimeout(function () {
                                                        GetDefaultCostCenter();
                                                        //}, 3000);
                                                    }
                                                    var readOnly = !accountFrameListfilter[0]["Editable"];
                                                    var id = accountFrameListfilter[0]["ControlId"] + "TextBox"
                                                    //                                            SaveWorkOrderData(id);
                                                    if (accountFrameListfilter[0]["Required"]) {
                                                        if (accountFrameListfilter[0]["InputType"] == "TBC" || accountFrameListfilter[0]["InputType"] == "TBN") {
                                                            costCentertextBox = '<input type="text" id="' + id + '" onkeyup="RequiredLabel(this);" data-required = "true" data-inline="true" data-input = "' + accountFrameListfilter[0]["InputType"] + '" data-text="' + accountFrameListfilter[0]["Label"][0]["Description"] + '"/>';
                                                        }
                                                        else {
                                                            costCentertextBox = '<input type="text" id="' + id + '" onkeyup="RequiredLabel(this);" data-required = "true" data-inline="true"/>';
                                                        }

                                                        if (decryptStr(getLocal("MSIClientCode")) != null) {
                                                            if (decryptStr(getLocal('MSIClientCode')).toUpperCase() != "BP") {
                                                                $(tableCell).append(costCentertextBox);
                                                                if (readOnly) {
                                                                    $(tableCell).find("#" + id).attr("readonly", true);
                                                                }
                                                            }
                                                        }
                                                    }
                                                    else {
                                                        if (accountFrameListfilter[0]["InputType"] == "TBC" || accountFrameListfilter[0]["InputType"] == "TBN") {
                                                            costCentertextBox = '<input type="text" id="' + id + '" data-input = "' + accountFrameListfilter[0]["InputType"] + '" onkeyup="ValidateRegularExpression(this);" data-text="' + accountFrameListfilter[0]["Label"][0]["Description"] + '"/>';
                                                        }
                                                        else {
                                                            costCentertextBox = '<input type="text" id="' + id + '"/>';
                                                        }

                                                        if (decryptStr(getLocal("MSIClientCode")) != null) {
                                                            if (decryptStr(getLocal('MSIClientCode')).toUpperCase() != "BP") {
                                                                $(tableCell).append(costCentertextBox);
                                                                if (readOnly) {
                                                                    $(tableCell).find("#" + id).attr("readonly", true);
                                                                }
                                                            }
                                                        }
                                                        $('#CASCollapsible .ui-collapsible-heading-toggle').text(getTranslatedValue("CASCollapsible"));
                                                        setLocal("Required", null);
                                                    }

                                                    if (accountFrameListfilter[0]["ControlId"] == "CostCenter") {
                                                        setTimeout(function () {
                                                            if (getLocal("DefaultStringCostCenter") != null) {
                                                                $("#" + id).val(getLocal("DefaultStringCostCenter"));  //7055
                                                            }
                                                            else {
                                                                $("#" + id).val(accountFrameListfilter[0]["DefaultValue"]);
                                                            }
                                                        }, 1000);
                                                    }
                                                    else {
                                                        $("#" + id).html(accountFrameListfilter[0]["DefaultValue"]);
                                                    }

                                                    if (decryptStr(getLocal("MSIClientCode")) != null) {
                                                        if (decryptStr(getLocal('MSIClientCode')).toUpperCase() == "BP") {
                                                            if (accountFrameListfilter[0]["ControlId"].toUpperCase() == "COSTCENTER") {
                                                                CostCenterText = id;
                                                                imageSearchBtnCostcenter = '<div class="ui-block-b"><a href="#" class="custMandatory"><img id="CostCenterSearchImageButton" class="searchIcon" src="css/images/search.png" alt="Search" onclick="BindcostCenter();" data-inline="true" /></a></div>'
                                                                $(tableCell).append('<div class="ui-field-contain"><div class="ui-block-a" style="width:88%;">' + costCentertextBox + '</div>' + imageSearchBtnCostcenter + '</div>');
                                                            }
                                                            else {
                                                                $(tableCell).append(costCentertextBox);
                                                                if (readOnly) {
                                                                    $(tableCell).find("#" + id).attr("readonly", true);
                                                                }
                                                            }
                                                        }
                                                        else if (decryptStr(getLocal('MSIClientCode')).toUpperCase() == "WALGREENS") {
                                                            if (accountFrameListfilter[0]["Label"][0]["LanguageAbbreviation"] == getLocal("Language")) {
                                                                var label = accountFrameListfilter[0]["Label"][0]["Description"];
                                                            }
                                                            if (accountFrameListfilter[0]["ControlId"].toUpperCase() == "REFERENCE4" || accountFrameListfilter[0]["ControlId"].toUpperCase() == "REFERENCE6") {
                                                                if (!accountFrameListfilter[0]["InputType"].match(NumericRegularExpression)) {
                                                                    ErrorMessage = ErrorMessage + ".\r\n" + getTranslatedValue("InvalidNumeric") + ".\r\n";
                                                                }
                                                                else {
                                                                    //                                                            SaveWorkOrderData(id);
                                                                    if (accountFrameListfilter[0]["Required"]) {
                                                                        if (accountFrameListfilter[0]["InputType"] == "TBC" || accountFrameListfilter[0]["InputType"] == "TBN") {
                                                                            costCentertextBox = '<input type="text" id="' + id + '" maxlength= "15" onkeyup="RequiredLabel(this);" data-required = "true" data-input = "' + accountFrameListfilter[0]["InputType"] + '" data-text="' + accountFrameListfilter[0]["Label"][0]["Description"] + '"/>';
                                                                        }
                                                                        else {
                                                                            costCentertextBox = '<input type="text" id="' + id + '" maxlength= "15" onkeyup="RequiredLabel(this);" data-required = "true"/>';
                                                                        }
                                                                    }
                                                                    else {
                                                                        if (accountFrameListfilter[0]["InputType"] == "TBC" || accountFrameListfilter[0]["InputType"] == "TBN") {
                                                                            costCentertextBox = '<input type="text" id="' + id + '" maxlength= "15" data-input = "' + accountFrameListfilter[0]["InputType"] + '" onkeyup="ValidateRegularExpression(this);" data-text="' + accountFrameListfilter[0]["Label"][0]["Description"] + '"/>';
                                                                        }
                                                                        else {
                                                                            costCentertextBox = '<input type="text" id="' + id + '" maxlength= "15"/>';
                                                                        }

                                                                        setLocal("Required", null);
                                                                        $('#CASCollapsible .ui-collapsible-heading-toggle').text(getTranslatedValue("CASCollapsible"));
                                                                    }

                                                                    $(tableCell).append(costCentertextBox);
                                                                    if (readOnly) {
                                                                        $(tableCell).find("#" + id).attr("readonly", true);
                                                                    }
                                                                }
                                                            }
                                                            else if (accountFrameListfilter[0]["ControlId"].toUpperCase() == "REFERENCE5") {
                                                                if (!accountFrameListfilter[0]["InputType"].match(decryptStr(getLocal('Walgreens_Reference5Regex')))) {
                                                                    ErrorMessage = ErrorMessage + ".\r\n" + getTranslatedValue("InvalidFormatValue") + ".\r\n";
                                                                    //                                                                    return;
                                                                    //                                                                }
                                                                    //                                                                else {
                                                                    //                                                                    ErrorMessage = getTranslatedValue("InvalidFormatValue") + "<br/>";
                                                                    //                                                                    return;
                                                                    //                                                                }
                                                                }
                                                                else {
                                                                    //                                                            SaveWorkOrderData(id);
                                                                    if (accountFrameListfilter[0]["Required"]) {
                                                                        if (accountFrameListfilter[0]["InputType"] == "TBC" || accountFrameListfilter[0]["InputType"] == "TBN") {
                                                                            costCentertextBox = '<input type="text" id="' + id + '" maxlength= "30" onkeyup="RequiredLabel(this);" data-required = "true"  data-input = "' + accountFrameListfilter[0]["InputType"] + '" data-text="' + accountFrameListfilter[0]["Label"][0]["Description"] + '"/>';
                                                                        }
                                                                        else {
                                                                            costCentertextBox = '<input type="text" id="' + id + '" maxlength= "30" onkeyup="RequiredLabel(this);" data-required = "true"/>';
                                                                        }
                                                                    }
                                                                    else {
                                                                        if (accountFrameListfilter[0]["InputType"] == "TBC" || accountFrameListfilter[0]["InputType"] == "TBN") {
                                                                            costCentertextBox = '<input type="text" id="' + id + '" maxlength= "30"  data-input = "' + accountFrameListfilter[0]["InputType"] + '" onkeyup="ValidateRegularExpression(this);" data-text="' + accountFrameListfilter[0]["Label"][0]["Description"] + '"/>';
                                                                        }
                                                                        else {
                                                                            costCentertextBox = '<input type="text" id="' + id + '" maxlength= "30" />';
                                                                        }
                                                                        setLocal("Required", null);
                                                                        $('#CASCollapsible .ui-collapsible-heading-toggle').text(getTranslatedValue("CASCollapsible"));
                                                                    }

                                                                    $(tableCell).append(costCentertextBox);
                                                                    if (readOnly) {
                                                                        $(tableCell).find("#" + id).attr("readonly", true);
                                                                    }
                                                                }
                                                            }
                                                            else {
                                                                $(tableCell).append(costCentertextBox);
                                                                if (readOnly) {
                                                                    $(tableCell).find("#" + id).attr("readonly", true);
                                                                }
                                                            }
                                                        }
                                                    }
                                                    else {
                                                        $(tableCell).append(costCentertextBox);
                                                        if (readOnly) {
                                                            $(tableCell).find("#" + id).attr("readonly", true);
                                                        }
                                                    }

                                                    if (accountFrameListfilter[0]["InputType"] == "TB") {
                                                        if (accountFrameListfilter[0]["ControlId"] == "CostCenter") {
                                                            setLocal("CostCenterCRSValidationType", accountFrameListfilter[0]["ValidationType"]);
                                                        }
                                                        //                                                            else {
                                                        //                                                                setLocal("CostCenterCRSValidationType", null);
                                                        //                                                            }
                                                    }

                                                    $(tableRow).append(tableCell);
                                                    $('#dynamicCASItemslist').append(tableRow);

                                                    $("#" + id).textinput();
                                                    //if (getLocal("DefaultStringCostCenter") != null && getLocal("DefaultStringCostCenter") != "") { //7055
                                                    if (accountFrameListfilter[0]["ControlId"].toUpperCase() == "COSTCENTER") {
                                                        $("#" + id).val(getLocal("DefaultStringCostCenter"));
                                                    }
                                                    //}

                                                    if (!IsStringNullOrEmpty(getLocal("GLAccountNumber"))) {
                                                        if (accountFrameListfilter[0]["ControlId"] == "GLAccount") {
                                                            $("#" + id).val(getLocal("GLAccountNumber"));
                                                        }
                                                    }

                                                    break;

                                                case "DD":
                                                    var dropdowndata = '';
                                                    var dropdownId = accountFrameListfilter[0]["ControlId"] + "Dropdown";
                                                    var companyValues = '';
                                                    var dropdown = '';
                                                    var readOnly = !accountFrameListfilter[0]["Editable"];
                                                    //                                            SaveWorkOrderData(dropdownId);

                                                    switch (accountFrameListfilter[0]["SourceName"]) {
                                                        case "CMP":
                                                            if (!IsStringNullOrEmpty(getLocal("companyValues"))) {
                                                                companyValues = getLocal("companyValues").split(';');
                                                            }

                                                            if (accountFrameListfilter[0]["Required"]) {
                                                                dropdown = $('<select  id = ' + dropdownId + ' data-required = "true" onchange = "RequiredLabel(this);"/>');
                                                            }
                                                            else {
                                                                dropdown = $('<select  id = ' + dropdownId + '/>');
                                                                setLocal("Required", null);
                                                                $('#CASCollapsible .ui-collapsible-heading-toggle').text(getTranslatedValue("CASCollapsible"));
                                                            }

                                                            $('<option />', { value: "-1", text: "--" + getTranslatedValue("selectOption") + "--" }).appendTo(dropdown);
                                                            for (var val in companyValues) {
                                                                $('<option />', { value: val, text: companyValues[val] }).appendTo(dropdown);
                                                            }
                                                            setLocal("CMP", dropdownId);
                                                            $(tableCell).append(dropdown);
                                                            if (readOnly) {
                                                                $(tableCell).find("#" + dropdownId).attr("disabled", true);
                                                            }

                                                            if (!IsStringNullOrEmpty(getLocal("CallerCompany")) && parseInt(decryptStr(getLocal("CAS_DefaultCompanyValue"))) == "0") {
                                                                for (var companyvalue in companyValues) {
                                                                    if (companyValues[companyvalue] == getLocal("CallerCompany")) {
                                                                        $('#' + dropdownId).val(companyvalue);
                                                                        setLocal("DropDownValue", companyvalue);
                                                                    }
                                                                }

                                                                $('#' + dropdownId).selectmenu('refresh');
                                                            }
                                                            else if (!IsStringNullOrEmpty(accountFrameListfilter[0]["DefaultValue"])) {
                                                                for (var companyvalue in companyValues) {
                                                                    if (companyValues[companyvalue] == accountFrameListfilter[0]["DefaultValue"]) {
                                                                        $('#' + dropdownId).val(companyValues);
                                                                        setLocal("DropDownValue", companyvalue);
                                                                    }
                                                                }

                                                                $('#' + dropdownId).selectmenu('refresh');
                                                            }

                                                            $('#' + dropdownId).selectmenu('refresh');
                                                            break;
                                                        case "DROP1":
                                                            openDB();
                                                            var companyValues1;
                                                            if (getLocal("CAS_DropSource_1") != null) {
                                                                companyValues1 = getLocal("CAS_DropSource_1").split(';');
                                                            }

                                                            var dropdown1
                                                            if (accountFrameListfilter[0]["Required"]) {
                                                                dropdown1 = $('<select  id = ' + dropdownId + ' data-required = "true" onchange = "RequiredLabel(this);"/>');
                                                            }
                                                            else {
                                                                dropdown1 = $('<select  id = ' + dropdownId + ' />');
                                                                setLocal("Required", null);
                                                            }

                                                            $('<option />', { value: "-1", text: "--" + getTranslatedValue("selectOption") + "--" }).appendTo(dropdown1);
                                                            for (var val in companyValues1) {
                                                                $('<option />', { value: val, text: companyValues1[val] }).appendTo(dropdown1);
                                                            }
                                                            setLocal("DROP1", dropdownId);
                                                            $(tableCell).append(dropdown1);
                                                            if (readOnly) {
                                                                $(tableCell).find("#" + dropdownId).attr("disabled", true);
                                                            }

                                                            if (accountFrameListfilter[0]["DefaultValue"] != null && accountFrameListfilter[0]["DefaultValue"] != '') {
                                                                for (var companyvalue in companyValues1) {
                                                                    if (companyValues1[companyvalue] == accountFrameListfilter[0]["DefaultValue"]) {
                                                                        $('#' + dropdownId).val(companyValues1);
                                                                        setLocal("DropDownValue", companyvalue);
                                                                    }
                                                                }

                                                                $('#' + dropdownId).selectmenu('refresh');
                                                            }

                                                            break;
                                                        case "DROP2":
                                                            openDB();
                                                            var companyValues2;
                                                            if (getLocal("CAS_DropSource_2") != null) {
                                                                companyValues2 = getLocal("CAS_DropSource_2").split(';');
                                                            }

                                                            var dropdown2;
                                                            if (accountFrameListfilter[0]["Required"]) {
                                                                dropdown2 = $('<select  id = ' + dropdownId + 'data-required = "true" onchange = "RequiredLabel(this);"/>');
                                                            }
                                                            else {
                                                                dropdown2 = $('<select  id = ' + dropdownId + '/>');
                                                                setLocal("Required", null);
                                                                $('#CASCollapsible .ui-collapsible-heading-toggle').text(getTranslatedValue("CASCollapsible"));
                                                            }

                                                            $('<option />', { value: "-1", text: "--" + getTranslatedValue("selectOption") + "--" }).appendTo(dropdown2);
                                                            for (var val in companyValues2) {
                                                                $('<option />', { value: val, text: companyValues3[val] }).appendTo(dropdown2);
                                                            }
                                                            setLocal("DROP2", dropdownId);
                                                            $(tableCell).append(dropdown2);
                                                            if (readOnly) {
                                                                $(tableCell).find("#" + dropdownId).attr("disabled", true);
                                                            }

                                                            if (accountFrameListfilter[0]["DefaultValue"] != null && accountFrameListfilter[0]["DefaultValue"] != '') {
                                                                for (var companyvalue in companyValues2) {
                                                                    if (companyValues2[companyvalue] == accountFrameListfilter[0]["DefaultValue"]) {
                                                                        $('#' + dropdownId).val(companyValues2);
                                                                        setLocal("DropDownValue", companyvalue);
                                                                    }
                                                                }

                                                                $('#' + dropdownId).selectmenu('refresh');
                                                            }
                                                            break;
                                                        case "DROP3":
                                                            openDB();
                                                            var companyValues3;
                                                            if (getLocal("CAS_DropSource_3") != null) {
                                                                companyValues3 = getLocal("CAS_DropSource_3").split(';');
                                                            }

                                                            var dropdown3;

                                                            if (accountFrameListfilter[0]["Required"]) {
                                                                dropdown3 = $('<select  id = ' + dropdownId + 'data-required = "true" onchange = "RequiredLabel(this);"/>');
                                                            }
                                                            else {
                                                                dropdown3 = $('<select  id = ' + dropdownId + '/>');
                                                                setLocal("Required", null);
                                                                $('#CASCollapsible .ui-collapsible-heading-toggle').text(getTranslatedValue("CASCollapsible"));
                                                            }

                                                            $('<option />', { value: "-1", text: "--" + getTranslatedValue("selectOption") + "--" }).appendTo(dropdown3);
                                                            for (var val in companyValues3) {
                                                                $('<option />', { value: val, text: companyValues3[val] }).appendTo(dropdown3);
                                                            }
                                                            setLocal("DROP3", dropdownId);
                                                            $(tableCell).append(dropdown3);
                                                            if (readOnly) {
                                                                $(tableCell).find("#" + dropdownId).attr("disabled", true);
                                                            }

                                                            if (accountFrameListfilter[0]["DefaultValue"] != null && accountFrameListfilter[0]["DefaultValue"] != '') {
                                                                for (var companyvalue in companyValues3) {
                                                                    if (companyValues3[companyvalue] == accountFrameListfilter[0]["DefaultValue"]) {
                                                                        $('#' + dropdownId).val(companyValues3);
                                                                        setLocal("DropDownValue", companyvalue);
                                                                    }
                                                                }

                                                                $('#' + dropdownId).selectmenu('refresh');
                                                            }
                                                            break;
                                                        case "DROP4":
                                                            openDB();
                                                            var companyValues4;
                                                            if (getLocal("CAS_DropSource_4") != null) {
                                                                companyValues4 = getLocal("CAS_DropSource_4").split(';');
                                                            }
                                                            var dropdown4;

                                                            if (accountFrameListfilter[0]["Required"]) {
                                                                dropdown4 = $('<select  id = ' + dropdownId + 'data-required = "true" onchange = "RequiredLabel(this);"/>');
                                                            }
                                                            else {
                                                                dropdown4 = $('<select  id = ' + dropdownId + '/>');
                                                                setLocal("Required", null);
                                                                $('#CASCollapsible .ui-collapsible-heading-toggle').text(getTranslatedValue("CASCollapsible"));
                                                            }

                                                            $('<option />', { value: "-1", text: "--" + getTranslatedValue("selectOption") + "--" }).appendTo(dropdown4);
                                                            for (var val in companyValues4) {
                                                                $('<option />', { value: val, text: companyValues4[val] }).appendTo(dropdown4);
                                                            }
                                                            setLocal("DROP4", dropdownId);
                                                            $(tableCell).append(dropdown4);
                                                            if (readOnly) {
                                                                $(tableCell).find("#" + dropdownId).attr("disabled", true);
                                                            }

                                                            if (accountFrameListfilter[0]["DefaultValue"] != null && accountFrameListfilter[0]["DefaultValue"] != '') {
                                                                for (var companyvalue in companyValues4) {
                                                                    if (companyValues4[companyvalue] == accountFrameListfilter[0]["DefaultValue"]) {
                                                                        $('#' + dropdownId).val(companyValues4);
                                                                        setLocal("DropDownValue", companyvalue);
                                                                    }
                                                                }

                                                                $('#' + dropdownId).selectmenu('refresh');
                                                            }
                                                            break;
                                                        case "DROP5":
                                                            openDB();
                                                            var companyValues5;
                                                            if (getLocal("CAS_DropSource_5") != null) {
                                                                companyValues5 = getLocal("CAS_DropSource_5").split(';');
                                                            }
                                                            var dropdown5;
                                                            if (accountFrameListfilter[0]["Required"]) {
                                                                dropdown5 = $('<select  id = ' + dropdownId + 'data-required = "true" onchange = "RequiredLabel(this);"/>');
                                                            }
                                                            else {
                                                                dropdown5 = $('<select  id = ' + dropdownId + '/>');
                                                                setLocal("Required", null);
                                                                $('#CASCollapsible .ui-collapsible-heading-toggle').text(getTranslatedValue("CASCollapsible"));
                                                            }

                                                            $('<option />', { value: "-1", text: "--" + getTranslatedValue("selectOption") + "--" }).appendTo(dropdown5);
                                                            for (var val in companyValues5) {
                                                                $('<option />', { value: val, text: companyValues5[val] }).appendTo(dropdown5);
                                                            }
                                                            setLocal("DROP5", dropdownId);
                                                            $(tableCell).append(dropdown5);
                                                            if (readOnly) {
                                                                $(tableCell).find("#" + dropdownId).attr("disabled", true);
                                                            }

                                                            if (accountFrameListfilter[0]["DefaultValue"] != null && accountFrameListfilter[0]["DefaultValue"] != '') {
                                                                for (var companyvalue in companyValues5) {
                                                                    if (companyValues5[companyvalue] == accountFrameListfilter[0]["DefaultValue"]) {
                                                                        $('#' + dropdownId).val(companyValues5);
                                                                        setLocal("DropDownValue", companyvalue);
                                                                    }
                                                                }

                                                                $('#' + dropdownId).selectmenu('refresh');
                                                            }
                                                            break;
                                                        case "CCEXT":
                                                            var myJsonObject = {
                                                                "costCenterExtEntity": { "CustomerNumber": getLocal("CustomerNumber"), "CustomerSiteNumber": getLocal("CustomerSiteNumber"), "CostCenterDefaultValue": getLocal("DefaultCostCenter") },
                                                                "databaseId": decryptStr(getLocal("DatabaseID")),
                                                                "language": getLocal("Language"),
                                                                "databaseName": decryptStr(getLocal("databaseName"))
                                                            };

                                                            setLocal("CostcenterId", dropdownId);
                                                            var dropdown5;
                                                            if (accountFrameListfilter[0]["Required"]) {
                                                                dropdown5 = $('<select  id = ' + dropdownId + ' data-required = "true" onchange = "RequiredLabel(this);"/>');
                                                            }
                                                            else {
                                                                if (getLocal("MSIClientCode") != null) {
                                                                    if (getLocal("MSIClientCode").toUpperCase() == "BP") {
                                                                        dropdown5 = $('<select  id = ' + dropdownId + ' data-required = "true" onchange = "RequiredLabel(this);"/>');
                                                                    }
                                                                    else {
                                                                        dropdown5 = $('<select  id = ' + dropdownId + '/>');
                                                                    }
                                                                }

                                                                setLocal("Required", null);
                                                                $('#CASCollapsible .ui-collapsible-heading-toggle').text(getTranslatedValue("CASCollapsible"));
                                                            }

                                                            $('<option />', { value: "-1", text: "--" + getTranslatedValue("selectOption") + "--" }).appendTo(dropdown5);
                                                            $(tableCell).append(dropdown5);
                                                            if (readOnly) {
                                                                $(tableCell).find("#" + dropdownId).attr("disabled", true);
                                                            }

                                                            var url = standardAddress + "CreateServiceRequest.svc/LoadCostCenterDropDown";
                                                            $.ajax({
                                                                type: "POST",
                                                                url: url,
                                                                async: 'false',
                                                                data: JSON.stringify(myJsonObject),
                                                                contentType: "application/json; charset=utf-8",
                                                                dataType: "json",
                                                                success: function (data) {
                                                                    //console.log(data);
                                                                    var menuData = JSON.parse(data);
                                                                    if (menuData != null) {
                                                                        for (var val in menuData) {
                                                                            $('<option />', { value: menuData[val]["CostCenter"], text: menuData[val]["CostCenter"] }).appendTo(dropdown5);
                                                                        }

                                                                        if (!IsStringNullOrEmpty(getLocal("DefaultStringCostCenter"))) {
                                                                            for (var companyvalue in menuData) {
                                                                                if (menuData[companyvalue]["CostCenter"] == getLocal("DefaultStringCostCenter")) {
                                                                                    $('#' + getLocal("CostcenterId")).val(getLocal("DefaultStringCostCenter"));
                                                                                    setLocal("DropDownValue", menuData[companyvalue]["CostCenter"]);
                                                                                }
                                                                            }

                                                                            $('#' + getLocal("CostcenterId")).selectmenu('refresh');
                                                                        }
                                                                    }
                                                                },
                                                                error: function (data) {

                                                                    hideImage();
                                                                    var errorMessge = data.responseText.split('See')[0];
                                                                    var errorMessge2 = errorMessge.substr(errorMessge.indexOf("exception") + 23, (errorMessge.length - errorMessge.indexOf("exception") - 27))
                                                                    if (errorMessge2 != '') {
                                                                        if (!isNaN(errorMessge2.substr(0, 1))) {
                                                                            showErrorPopUp(true, errorMessge2.substr(1, errorMessge2.length));
                                                                        }
                                                                        else {
                                                                            showErrorPopUp(true, errorMessge2);
                                                                        }
                                                                    }
                                                                    return;
                                                                }
                                                            });

                                                            break;

                                                        case "BUS":
                                                            businessDropDownExists = true;
                                                            if (accountFrameListfilter[0]["Required"]) {
                                                                businessDropDown = $('<select  id = ' + dropdownId + ' data-required = "true" onchange = "GetSubBusinessDropDown(this);" data-input=' + "SubBusinessDropdown" + '/>');
                                                            }
                                                            else {
                                                                businessDropDown = $('<select  id = ' + dropdownId + ' onchange = "GetSubBusinessDropDown(this);"/>');
                                                                setLocal("Required", null);
                                                                $('#CASCollapsible .ui-collapsible-heading-toggle').text(getTranslatedValue("CASCollapsible"));
                                                            }

                                                            var myJsonObject =
                                                            {
                                                                "databaseID": decryptStr(getLocal("DatabaseID")),
                                                                "language": getLocal("Language"),
                                                                "databaseName": decryptStr(getLocal("databaseName")),
                                                                "businessTransfer": { "LevelType": 4, "SearchString": "CreateWO" }
                                                            };

                                                            $('<option />', { value: "-1", text: "--" + getTranslatedValue("selectOption") + "--" }).appendTo(businessDropDown);
                                                            setLocal("BUS", dropdownId);
                                                            $(tableCell).append(businessDropDown);
                                                            if (readOnly) {
                                                                $(tableCell).find("#" + dropdownId).attr("disabled", true);
                                                            }
                                                            var url = standardAddress + "CreateServiceRequest.svc/GetBusinessDropDown";
                                                            $.ajax({
                                                                type: "POST",
                                                                url: url,
                                                                async: 'false',
                                                                data: JSON.stringify(myJsonObject),
                                                                contentType: "application/json; charset=utf-8",
                                                                dataType: "json",
                                                                success: function (data) {
                                                                    //console.log(data);
                                                                    var menuData = JSON.parse(data);
                                                                    if (menuData != null) {
                                                                        for (var val in menuData) {
                                                                            $('<option />', { value: menuData[val]["BusinessValue"], text: menuData[val]["BusinessValue"] }).appendTo(businessDropDown);
                                                                        }
                                                                    }
                                                                },
                                                                error: function (data) {

                                                                    hideImage();
                                                                    var errorMessge = data.responseText.split('See')[0];
                                                                    var errorMessge2 = errorMessge.substr(errorMessge.indexOf("exception") + 23, (errorMessge.length - errorMessge.indexOf("exception") - 27))
                                                                    if (errorMessge2 != '') {
                                                                        if (!isNaN(errorMessge2.substr(0, 1))) {
                                                                            showErrorPopUp(true, errorMessge2.substr(1, errorMessge2.length));
                                                                        }
                                                                        else {
                                                                            showErrorPopUp(true, errorMessge2);
                                                                        }
                                                                    }
                                                                    return;
                                                                }
                                                            });
                                                            break;
                                                        case "SUBBS":
                                                            if (accountFrameListfilter[0]["Required"]) {
                                                                subbusinessDropDown = $('<select  id = ' + dropdownId + ' data-required = "true" onchange = "GetBusinessGroupDropDown(this);" data-input=' + "BusinessGroupDropdown" + '/>');
                                                            }
                                                            else {
                                                                subbusinessDropDown = $('<select  id = ' + dropdownId + ' onchange = "GetBusinessGroupDropDown(this);"/>');
                                                                setLocal("Required", null);
                                                                $('#CASCollapsible .ui-collapsible-heading-toggle').text(getTranslatedValue("CASCollapsible"));
                                                            }

                                                            $('<option />', { value: "-1", text: "--" + getTranslatedValue("selectOption") + "--" }).appendTo(subbusinessDropDown);
                                                            if (!IsStringNullOrEmpty(getLocal("SubBusiness"))) {

                                                                $('<option />', { value: getLocal("SubBusiness"), text: getLocal("SubBusiness") }).appendTo(subbusinessDropDown);
                                                            }
                                                            setLocal("SUBBS", dropdownId);
                                                            $(tableCell).append(subbusinessDropDown);
                                                            if (readOnly) {
                                                                $(tableCell).find("#" + dropdownId).attr("disabled", true);
                                                            }
                                                            break;
                                                        case "BUSGR":
                                                            if (accountFrameListfilter[0]["Required"]) {
                                                                businessgroupDropDown = $('<select  id = ' + dropdownId + ' data-required = "true" onchange = "BusinessGroupDropDownValue(this);"/>');
                                                            }
                                                            else {
                                                                businessgroupDropDown = $('<select  id = ' + dropdownId + ' onchange = "BusinessGroupDropDownValue(this);"/>');
                                                                setLocal("Required", null);
                                                                $('#CASCollapsible .ui-collapsible-heading-toggle').text(getTranslatedValue("CASCollapsible"));
                                                            }

                                                            $('<option />', { value: "-1", text: "--" + getTranslatedValue("selectOption") + "--" }).appendTo(businessgroupDropDown);
                                                            if (!IsStringNullOrEmpty(getLocal("BusinessGroup"))) {

                                                                $('<option />', { value: getLocal("BusinessGroup"), text: getLocal("BusinessGroup") }).appendTo(businessgroupDropDown);
                                                            }
                                                            setLocal("BUSGR", dropdownId);
                                                            $(tableCell).append(businessgroupDropDown);
                                                            if (readOnly) {
                                                                $(tableCell).find("#" + dropdownId).attr("disabled", true);
                                                            }
                                                            break;
                                                    }

                                                    $(tableRow).append(tableCell);
                                                    $('#dynamicCASItemslist').append(tableRow);
                                                    $('#' + dropdownId).val(getLocal("DropDownValue"));
                                                    $('#' + dropdownId).selectmenu();
                                                    if (getLocal("DefaultCostCenter") != null && getLocal("DefaultCostCenter") != "") {
                                                        if (accountFrameListfilter[0]["ControlId"].toUpperCase() == "COSTCENTER") {
                                                            $("#" + dropdownId).val(getLocal("DefaultCostCenter"));
                                                            $("#" + dropdownId).selectmenu("refresh");
                                                        }
                                                    }
                                                    break;
                                                case "ACB":
                                                    var myJsonObject;
                                                    var url;
                                                    if (accountFrameListfilter[0]["ControlId"] == "CostCenter") {
                                                        // setTimeout(function () {
                                                        GetDefaultCostCenter();
                                                        //  }, 3000);
                                                    }
                                                    var readOnly = !accountFrameListfilter[0]["Editable"];
                                                    var id = accountFrameListfilter[0]["ControlId"] + "TextBox"
                                                    //                                            SaveWorkOrderData(id);
                                                    var autoCompleteTextBox = '<input type="text" id="' + id + '" diasbled="' + readOnly + '" onkeyup="BindAutocomplete(this);"  data-source = "' + accountFrameListfilter[0]["SourceName"] + '" data-input=' + accountFrameListfilter[0]["ControlId"] + "Dropdown" + '>';
                                                    CostCenterText = autoCompleteTextBox;
                                                    var dropdownId = accountFrameListfilter[0]["ControlId"] + "Dropdown";
                                                    setLocal("AutoComplete", dropdownId);
                                                    var dropdownAutocomplete = $('<select  id = ' + dropdownId + ' data-input=' + id + ' onchange="BindAutoCompleteTextbox(this);"/>');
                                                    $('<option />', { value: "-1", text: "--" + getTranslatedValue("selectOption") + "--" }).appendTo(dropdownAutocomplete);

                                                    setLocal("ACB", dropdownId);
                                                    businessAutoComplete = dropdownAutocomplete;

                                                    ////                                                        var dropdownId = accountFrameListfilter[0]["ControlId"] + "Dropdown";
                                                    //                                            SaveWorkOrderData(dropdownId);
                                                    SourceACBArray.push(accountFrameListfilter[0]);
                                                    switch (accountFrameListfilter[0]["SourceName"]) {
                                                        case "BUS":
                                                            businessAutocompleteExists = true;
                                                            if (!IsStringNullOrEmpty(getLocal("BusinessValue"))) {
                                                                $('<option />', { value: getLocal("BusinessValue"), text: getLocal("BusinessValue") }).appendTo(dropdownAutocomplete);
                                                            }
                                                            break;
                                                        case "SUBBS":
                                                            businessAutocompleteExists = true;
                                                            if (!IsStringNullOrEmpty(getLocal("SubBusiness"))) {
                                                                $('<option />', { value: getLocal("SubBusiness"), text: getLocal("SubBusiness") }).appendTo(dropdownAutocomplete);
                                                            }
                                                            break;
                                                        case "BUSGR":
                                                            businessAutocompleteExists = true;
                                                            if (!IsStringNullOrEmpty(getLocal("BusinessGroup"))) {
                                                                $('<option />', { value: getLocal("BusinessGroup"), text: getLocal("BusinessGroup") }).appendTo(dropdownAutocomplete);
                                                            }
                                                            break;
                                                    }

                                                    $(tableCell).append(autoCompleteTextBox);

                                                    // $(tableCell).append(dropdownAutocomplete);
                                                    $(tableRow).append(tableCell);
                                                    var tableRowAct = $('<tr/>');
                                                    var tableCellAct = $('<td/>');
                                                    $('#dynamicCASItemslist').append(tableRow);
                                                    $(tableCellAct).append(dropdownAutocomplete);
                                                    $(tableRowAct).append(tableCellAct);
                                                    $('#dynamicCASItemslist').append(tableRowAct);
                                                    if (readOnly) {
                                                        $(tableCellAct).find("#" + dropdownId).attr("disabled", true);
                                                    }
                                                    $('#' + id).textinput();
                                                    $('#' + dropdownId).selectmenu();
                                                    if (accountFrameListfilter[0]["InputType"] == "ACB") {
                                                        if (accountFrameListfilter[0]["ControlId"] == "CostCenter") {
                                                            setLocal("CostCenterCRSValidationType", accountFrameListfilter[0]["ValidationType"]);
                                                        }
                                                        else {
                                                            setLocal("CostCenterCRSValidationType", null);
                                                        }
                                                    }

                                                    if (accountFrameListfilter[0]["ControlId"] == "CostCenter") {
                                                        setTimeout(function () {
                                                            if (getLocal("DefaultStringCostCenter")) {
                                                                $("#" + id).text(getLocal("DefaultStringCostCenter"));
                                                                $("#" + id).trigger("onkeyup");
                                                            }
                                                            else {
                                                                $("#" + id).text(accountFrameListfilter[0]["DefaultValue"]);
                                                            }
                                                        }, 2500);
                                                    }
                                                    else {
                                                        $("#" + id).text(accountFrameListfilter[0]["DefaultValue"]);
                                                    }

                                                    if (getLocal("DefaultCostCenter") != null && getLocal("DefaultCostCenter") != "") {
                                                        if (accountFrameListfilter[0]["ControlId"].toUpperCase() == "COSTCENTER") {
                                                            $("#" + id).val(getLocal("DefaultCostCenter"));
                                                            BindAutocomplete(getLocal("DefaultCostCenter"));
                                                            $("#" + dropdownId).val(getLocal("DefaultCostCenter"));
                                                            $("#" + dropdownId).selectmenu("refresh");
                                                        }
                                                    }
                                                    break;
                                            }

                                        }

                                    }
                                }


                            }
                        }
                    }

                    setTimeout(function () {
                        if (!IsStringNullOrEmpty(getLocal("BusinessValue")) && !IsStringNullOrEmpty(getLocal("SubBusiness")) && !IsStringNullOrEmpty(getLocal("BusinessGroup"))) {
                            if (businessDropDownExists == true) {
                                $("#BusinessDropdown").val(getLocal("BusinessValue"));
                                $("#BusinessDropdown").selectmenu('refresh');

                                $("#SubBusinessDropdown").val(getLocal("SubBusiness"));
                                $("#SubBusinessDropdown").selectmenu('refresh');

                                $("#BusinessGroupDropdown").val(getLocal("BusinessGroup"));
                                $("#BusinessGroupDropdown").selectmenu('refresh');
                            }
                        }
                    }, 500);

                    setTimeout(function () {
                        if (!IsStringNullOrEmpty(getLocal("BusinessValue")) && !IsStringNullOrEmpty(getLocal("SubBusiness")) && !IsStringNullOrEmpty(getLocal("BusinessGroup"))) {
                            if (businessAutocompleteExists == true) {
                                $("#BusinessTextBox").val(getLocal("BusinessValue"));
                                $("#BusinessDropdown").val(getLocal("BusinessValue"));
                                $("#BusinessDropdown").selectmenu('refresh');

                                $("#SubBusinessTextBox").val(getLocal("SubBusiness"));
                                $("#SubBusinessDropdown").val(getLocal("SubBusiness"));
                                $("#SubBusinessDropdown").selectmenu('refresh');

                                $("#BusinessGroupTextBox").val(getLocal("BusinessGroup"));
                                $("#BusinessGroupDropdown").val(getLocal("BusinessGroup"));
                                $("#BusinessGroupDropdown").selectmenu('refresh');
                            }
                        }
                    }, 500);
                }


                var result = RequiredLabel();
                var pageID = "#" + $.mobile.activePage.attr('id');
                //                    setTimeout(function () {
                //                        if ($(pageID).find("[data-required='true']").length > 0) {
                //                            $('#CASCollapsible .ui-collapsible-heading-toggle').text(getTranslatedValue("CASCollapsible") + " - " + getTranslatedValue("RequiredLabel"));
                //                            if (result == true) {
                //                                $('#CASCollapsible .ui-collapsible-heading-toggle').text(getTranslatedValue("CASCollapsible") + " - " + getTranslatedValue("RequiredCompleteLabel"));
                //                            }
                //                        }
                //                        else {
                //                            $('#CASCollapsible .ui-collapsible-heading-toggle').text(getTranslatedValue("CASCollapsible"));
                //                        }



                //                    }, 3000);
            }
            else {
                $("#Collapsible3").hide();
            }
            // hideImage();
        });

        // }, 5000);


    }
    else {
        setTimeout(function () {
            showErrorPopUp(true, noNetworkTranslation);
        }, 1000);
    }
}

/// Function to get the deafult cost center.
function GetDefaultCostCenter() {
    if (navigator.onLine) {
        //alert(IsQuickLinksPage);
        var problemcodenumber;

        if (IsQuickLinksPage == "true") {
            if (!IsStringNullOrEmpty(getLocal("ProblemCodeNumber"))) {
                problemcodenumber = getLocal("ProblemCodeNumber");
            }
            else {
                if (!IsStringNullOrEmpty(decryptStr(getLocal("DefaultProblemCode")))) {
                    problemcodenumber = decryptStr(getLocal("DefaultProblemCode"));
                }
            }
        }
        else {
            problemcodenumber = $("#ProblemCodeDropDownList").val();
        }



        var myJsonObject = {
            "workOrderTransfer": {
                "ProblemCodeNumber": problemcodenumber,
                "CustomerNumber": getLocal("CustomerNumber"),
                "CustomerSiteNumber": getLocal("CustomerSiteNumber"),
                "CallerSeq": getLocal("seq"),
                "DatabaseId": decryptStr(getLocal("DatabaseID")),
                "Culture": getLocal("Language"),
                "DatabaseName": decryptStr(getLocal("databaseName")),
                "SessionId": decryptStr(getLocal("SessionId"))
            }
        };

        var url = standardAddress + "CreateServiceRequest.svc/GetDefaultCostCenter";
        $.postJSON(url, myJsonObject, function (data) {

            if (data.length > 0) {
                //setLocal("DefaultCostCenter", data);
                setLocal("DefaultStringCostCenter", data);
            }
            else {
                setLocal("DefaultStringCostCenter", "");
            }
        });
    }
    else {
        setTimeout(function () {
            showErrorPopUp(true, noNetworkTranslation);
        }, 1000);
    }
}

/// Function to bind the autocomplete of cost center CAS values.
function BindAutocomplete(value) {
    if (navigator.onLine) {
        var url;

        ////        for (i = 0; i < SourceACBArray.length; i++) {
        switch (value.attributes["data-source"].value) {
            case "COM":
                var id;
                var idValue;

                id = "#" + value.attributes["data-input"].value;
                if (value != null && value != "") {
                    if (value == getLocal("DefaultCostCenter")) {
                        $(value.attributes["id"].value).val(getLocal("DefaultCostCenter"));
                    }
                    else {
                        $(value.attributes["id"].value).val($("#" + value.attributes["id"]["value"]).val());
                    }
                }

                myJsonObject = {
                    "autoCompleteText": value.value,
                    "employeeNumber": DefaultEnteredByEmployee,
                    "dataBaseId": decryptStr(getLocal("DatabaseID")),
                    "language": getLocal("Language"),
                    "customerNumber": getLocal("CustomerNumber"),
                    "customerSiteNumber": getLocal("CustomerSiteNumber"),
                    "validationType": getLocal("CostCenterCRSValidationType"),
                    "databaseName": decryptStr(getLocal("databaseName"))
                };
                url = standardAddress + "CreateServiceRequest.svc/GetCompany";
                if ($("#" + value.id).val().length >= 3) {
                    $.postJSON(url, myJsonObject, function (data) {
                        $(id + " option:gt(0)").remove();
                        if (data != null) {

                            for (index = 0; index < data.length; index++) {
                                var dropdown = document.createElement("option");
                                dropdown.setAttribute("value", data[index]);
                                dropdown.innerHTML = data[index];
                                $(id).append(dropdown);
                            }

                            $(id).selectmenu('refresh');
                            if (getLocal("DefaultCostCenter") != null && getLocal("DefaultCostCenter") != "") {
                                $(id).val(getLocal("DefaultCostCenter"));
                                $(id).selectmenu("refresh");
                            }
                        }
                    });
                }
                else {
                    $(id + " option:gt(0)").remove();
                    $(id).selectmenu('refresh');
                }
                break;
            case "CCEXT":
                var id4;
                var idValue4;

                id4 = "#" + value.attributes["data-input"].value;
                if (value != null && value != "") {
                    if ($("#" + value.attributes["id"].value).text() == getLocal("DefaultStringCostCenter")) {
                        $("#" + value.attributes["id"].value).val(getLocal("DefaultStringCostCenter"));
                    }
                    else {
                        $("#" + value.attributes["id"].value).val($("#" + value.attributes["id"].value).text());
                    }
                }
                myJsonObject = {
                    "autoCompleteText": value.value,
                    "employeeNumber": DefaultEnteredByEmployee,
                    "dataBaseId": decryptStr(getLocal("DatabaseID")),
                    "language": getLocal("Language"),
                    "customerNumber": getLocal("CustomerNumber"),
                    "customerSiteNumber": getLocal("CustomerSiteNumber"),
                    "validationType": getLocal("CostCenterCRSValidationType"),
                    "databaseName": decryptStr(getLocal("databaseName"))
                };


                url = standardAddress + "CreateServiceRequest.svc/GetCostCenterData";
                if ($("#" + value.id).val().length >= 3) {
                    $.postJSON(url, myJsonObject, function (data) {
                        $(id + " option:gt(0)").remove();
                        if (data != null) {
                            for (index = 0; index < data.length; index++) {
                                var dropdown = document.createElement("option");
                                dropdown.setAttribute("value", data[index]["CostCenter"]);
                                dropdown.innerHTML = data[index]["Description"];
                                $(id4).append(dropdown);
                            }

                            $(id4).selectmenu('refresh');
                            if (getLocal("DefaultStringCostCenter") != null && getLocal("DefaultStringCostCenter") != "") {
                                $(id4).val(getLocal("DefaultStringCostCenter"));
                                $(id4).selectmenu("refresh");
                            }
                        }
                    });
                }
                else {
                    $(id4 + " option:gt(0)").remove();
                    $(id4).selectmenu('refresh');
                }
                break;
            case "BUS":
                var id1;
                var idValue1;

                id1 = "#" + value.attributes["data-input"].value;
                myJsonObject =
                    {
                        "prefixText": value.value,
                        "dataBaseID": decryptStr(getLocal("DatabaseID")),
                        "databaseName": decryptStr(getLocal("databaseName")),
                        "language": getLocal("Language"),
                        "employeeNumber": decryptStr(getLocal("DefaultEnteredByEmployee"))
                    };
                url = standardAddress + "CreateServiceRequest.svc/GetBusinessData";
                if ($("#" + value.id).val().length >= 3) {
                    $.postJSON(url, myJsonObject, function (data) {
                        $(id1 + " option:gt(0)").remove();
                        if (data != null) {
                            for (index = 0; index < data.length; index++) {
                                var dropdown = document.createElement("option");
                                dropdown.setAttribute("value", data[index]);
                                dropdown.innerHTML = data[index];
                                $(id1).append(dropdown);
                            }

                            $(id1).selectmenu('refresh');
                        }
                    });
                }

                break;
            case "SUBBS":
                var idValue;
                var id2;

                id2 = "#" + value.attributes["data-input"].value;
                myJsonObject =
                    {
                        "prefixText": value.value,
                        "dataBaseID": decryptStr(getLocal("DatabaseID")),
                        "databaseName": decryptStr(getLocal("databaseName")),
                        "language": getLocal("Language"),
                        "employeeNumber": decryptStr(getLocal("DefaultEnteredByEmployee")),
                        "contextKey": $("#BusinessDropdown").val()
                    };
                url = standardAddress + "CreateServiceRequest.svc/GetSubBusinessData";
                if ($("#" + value.id).val().length >= 3) {
                    $.postJSON(url, myJsonObject, function (data) {
                        $(id2 + " option:gt(0)").remove();
                        if (data != null) {
                            for (index = 0; index < data.length; index++) {
                                var dropdown = document.createElement("option");
                                dropdown.setAttribute("value", data[index]);
                                dropdown.innerHTML = data[index];
                                $(id2).append(dropdown);
                            }

                            $(id2).selectmenu('refresh');
                        }
                    });
                }

                break;
            case "BUSGR":
                var idValue3;
                var id3;
                id3 = "#" + value.attributes["data-input"].value;

                myJsonObject =
                    {
                        "prefixText": $("#SubBusinessDropdown").val(),
                        "dataBaseID": decryptStr(getLocal("DatabaseID")),
                        "databaseName": decryptStr(getLocal("databaseName")),
                        "language": getLocal("Language"),
                        "employeeNumber": decryptStr(getLocal("DefaultEnteredByEmployee")),
                        "contextKey": $("#BusinessDropdown").val()
                    };
                url = standardAddress + "CreateServiceRequest.svc/GetBusinessGroupData";
                if ($("#" + value.id).val().length >= 3) {
                    $.postJSON(url, myJsonObject, function (data) {
                        $(id3 + " option:gt(0)").remove();
                        if (data != null) {
                            for (index = 0; index < data.length; index++) {
                                var dropdown = document.createElement("option");
                                dropdown.setAttribute("value", data[index]);
                                dropdown.innerHTML = data[index];
                                $(id3).append(dropdown);
                            }

                            $(id3).selectmenu('refresh');
                        }
                    });
                }

                break;
        }
        //        }
    }
    else {
        setTimeout(function () {
            showErrorPopUp(true, noNetworkTranslation);
        }, 1000);
    }
}

/// Loads the Cost center value when search icon is clicked(Only when MSIclient code is 'BP').
function BindcostCenter() {
    if (navigator.onLine) {
        var costcenterErrormessage = '';
        var myJsonObject = {
            "databaseId": decryptStr(getLocal("DatabaseID")),
            "language": getLocal("Language"),
            "orderTransfer": {
                "CostCenter": $("#" + CostCenterText).val(),
                "ValidationType": 6
            },
            "databaseName": decryptStr(getLocal("databaseName"))
        };
        if (CostCenterText != null && CostCenterText != "") {

            var url = standardAddress + "CreateServiceRequest.svc/LoadCostCenterAutoCompleteImageClick";
            $.postJSON(url, myJsonObject, function (data) {
                if (data != null) {
                    if (data.length == 1) {
                        $("#" + CostCenterText).val(data[0]["CostCenter"]);
                        setLocal("CostCenter", data[0]["CostCenter"]);
                    }
                    else {
                        //costcenterErrormessage = getTranslatedValue("ValidCostCenterMessage") ;
                        //ErrorMessage = costcenterErrormessage;
                        //setTimeout(function () {
                        showErrorPopUp(true, getTranslatedValue("ValidCostCenterMessage"));
                        //}, 1000);
                        return;
                    }
                }
            });
        }
        else {
            //        if (ErrorMessage != null && ErrorMessage != "") {
            costcenterErrormessage = getTranslatedValue("ValidCostCenterMessage");
            ErrorMessage = costcenterErrormessage;
            setTimeout(function () {
                showErrorPopUp(true, getTranslatedValue("ValidCostCenterMessage"));
            }, 1000);
            return;
        }
    }
    else {
        setTimeout(function () {
            showErrorPopUp(true, noNetworkTranslation);
        }, 1000);
    }
}

/// Function to create service request/Work order.
function SaveCASValues() {
    var canCreate = true;
    if (navigator.onLine) {
        // loadingImage();
        var phoneNumberText = "";
        if (decryptStr(getLocal("PhoneNumberFormat")) != null) {
            if (!IsStringNullOrEmpty($("#PhoneNumberValue").val())) {
                phoneNumberText = securityError($("#PhoneNumberValue"));
                if (phoneNumberText != "") {
                    if (!phoneNumberText.match(decryptStr(getLocal("PhoneNumberFormat")))) {
                        hideImage();
                        ErrorMessage = ErrorMessage + "\r\n" + getTranslatedValue("PhoneNumberRegularExpressionValidator") + ".\r\n";
                        showErrorPopUp(true, ErrorMessage);
                        canCreate = false;
                        ErrorMessage = '';
                        return;
                    }
                }
                else {
                    if (IsStringNullOrEmpty(phoneNumberText)) {
                        $('#Collapsible1 .ui-collapsible-heading-toggle').text(getTranslatedValue("AccountInfoLabel") + "-" + $("#CallerNameValue").val());
                    }
                    return false;
                }
            }
        }
        else if (IsStringNullOrEmpty($("#PhoneNumberValue").val()) || IsStringNullOrEmpty($("#ContactPhoneValue").val())) {
            ErrorMessage = ErrorMessage + "\r\n" + getTranslatedValue("FillRequiredFields");
        }

        if ($("input#CallerNameValue").css('display') != 'none') {
            if (!IsStringNullOrEmpty($("#CallerNameValue").val())) {
                var callernameid = securityError($("#CallerNameValue"));
                if (callernameid == "") {
                    return false;
                }
            }
        }

        if ($("input#ContactNameValue").css('display') != 'none') {
            if (!IsStringNullOrEmpty($("#ContactNameValue").val())) {
                var contactName = securityError($("#ContactNameValue"));
                if (contactName == "") {
                    return false;
                }
            }
        }


        if ($("input#ContactPhoneValue").css('display') != 'none') {
            if (!IsStringNullOrEmpty($("#ContactPhoneValue").val())) {
                var contactPhone = securityError($("#ContactPhoneValue"));
                if (contactPhone == "") {
                    return false;
                }
            }
        }

        if ($("input#LocationTextBox").css('display') != 'none') {
            if (!IsStringNullOrEmpty($("#LocationTextBox").val())) {
                var locationid = securityError($("#LocationTextBox"));
                if (locationid == "") {
                    return false;
                }
            }
        }

        if (!IsStringNullOrEmpty($("#DescriptionText").val())) {
            var descriptionId = securityError($("#DescriptionText"));
            if (descriptionId == "") {
                return false;
            }
        }

        if ($("input#ContactPhoneValue").css('display') != 'none') {
            if (!IsStringNullOrEmpty($("#ContactPhoneValue").val())) {
                var contactphoneId = securityError($("#ContactPhoneValue"));
                if (contactphoneId == "") {
                    return false;
                }
            }
        }

        if ($("input#ContactNameValue").css('display') != 'none') {
            if (!IsStringNullOrEmpty($("#ContactNameValue").val())) {
                var contactNameId = securityError($("#ContactNameValue"));
                if (contactNameId == "") {
                    $('#Collapsible1 .ui-collapsible-heading-toggle').text(getTranslatedValue("AccountInfoLabel") + "-" + $("#PhoneNumberValue").val());
                    return false;
                }
            }
        }

        //Modified below code Because in some environments Level1 has 0 values also(region numnber is 0)
        if ($("#Level1DropDown").val() == '-1') {
            hideImage();
            showErrorPopUp(true, getTranslatedValue("CityRequiredFieldValidator"), '');
            return false;
        }
        
        if ($("#Level2DropDown").val() == '0' || $("#Level2DropDown").val() == '-1') {
            hideImage();
            showErrorPopUp(true, getTranslatedValue("CityRequiredFieldValidator"), '');
            return false;
        }

        if ($("#Level3DropDown").val() == '0' || $("#Level3DropDown").val() == '-1') {
            hideImage();
            showErrorPopUp(true, getTranslatedValue("CityRequiredFieldValidator"), '');
            return false;
        }

        if ($("#Level4DropDown").val() == '0' || $("#Level4DropDown").val() == '-1') {
            hideImage();
            showErrorPopUp(true, getTranslatedValue("CityRequiredFieldValidator"), '');
            return false;
        }

        var accountFrameChildArray = new Array();
        accountFrameChildArray.length = 0;
        var TextBoxValue;
        var DropdownValue;
        var Label;
        var casFieldValue = true;
        for (index = 0; index < AccountFrameListArray.length; index++) {
            if (AccountFrameListArray[index]["Visible"] == true) {
                accountFrameChildArray.push(AccountFrameListArray[index]);
            }
        }

        var textBoxValueValid = "";
        for (i = 0; i < accountFrameChildArray.length; i++) {
            switch (accountFrameChildArray[i]["InputType"]) {
                case "TB":
                case "TA":
                case "TBN":
                case "TBC":
                case "TBP":
                    TextBoxValue = "#" + accountFrameChildArray[i]["ControlId"] + "TextBox";
                    if (!IsStringNullOrEmpty($(TextBoxValue).val())) {
                        textBoxValueValid = securityError($(TextBoxValue));
                        if (textBoxValueValid == "") {
                            CASInvalidInput = "";
                            ErrorMessage = "";
                            return false;
                        }
                        else if (textBoxValueValid != "") {
                            switch (accountFrameChildArray[i]["ControlId"]) {
                                case "GLAccount":
                                    $.trim(textBoxValueValid);
                                    if (!IsStringNullOrEmpty(textBoxValueValid)) {
                                        var myJsonObject = {
                                            "dataBaseId": decryptStr(getLocal("DatabaseID")),
                                            "language": getLocal("Language"),
                                            "glaccountValue": $(TextBoxValue).val(),
                                            "databaseName": decryptStr(getLocal("databaseName"))
                                        };
                                        var tempGLAccountValue = textBoxValueValid;
                                        var url = standardAddress + "CreateServiceRequest.svc/GetGLAccountExists";
                                        $.ajax({
                                            type: "POST",
                                            url: url,
                                            data: JSON.stringify(myJsonObject),
                                            contentType: "application/json; charset=utf-8",
                                            dataType: "json",
                                            processData: true,
                                            //async: true,
                                            success: function (data) {
                                                var menuData = JSON.parse(data);
                                                if (menuData != null) {
                                                    if (menuData == true) {
                                                        setLocal("ExtAccountNumber", tempGLAccountValue);
                                                    }
                                                }
                                            },
                                            error: function (data) {

                                                hideImage();
                                                var responseText = JSON.parse(data.responseText);
                                                var errorMessage = responseText["ErrorDetails"];
                                                if (errorMessage != '') {
                                                    showErrorPopUp(true, errorMessage, errorMessage);
                                                    canCreate = false;
                                                }
                                                else {
                                                    showErrorPopUp(true, getCommonTranslatedValue("ArguementNullException"), '');
                                                    canCreate = false;
                                                }
                                                return;
                                                //                                                var errorMessge = data.responseText.split('See')[0];
                                                //                                                var errorMessge2 = errorMessge.substr(errorMessge.indexOf("exception") + 23, (errorMessge.length - errorMessge.indexOf("exception") - 27))
                                                //                                                if (errorMessge2 != '') {
                                                //                                                    if (!isNaN(errorMessge2.substr(0, 1))) {
                                                //                                                        setTimeout(function () {
                                                //                                                            showErrorPopUp(true, errorMessge2.substr(1, errorMessge2.length));
                                                //                                                        }, 1000);
                                                //                                                        canCreate = false;
                                                //                                                        return false;
                                                //                                                    }
                                                //                                                    else {
                                                //                                                        $("#RequestServiceButton").addClass("ui-disabled");
                                                //                                                        setTimeout(function () {
                                                //                                                            showErrorPopUp(true, errorMessge2);
                                                //                                                        }, 1000);
                                                //                                                        canCreate = false;
                                                //                                                        return false;
                                                //                                                    }
                                                //                                                }
                                                //                                                return;
                                            }
                                        });
                                    }
                                    break;
                                case "CostCenter":
                                    var costCenter;
                                    var company;
                                    setLocal("CostCenter", $.trim(textBoxValueValid));

                                    if (getLocal("CostCenterCRSValidationType") == "4") {
                                        var cost;
                                        if (decryptStr(getLocal("MSIClientCode")) != null) {
                                            if (decryptStr(getLocal("MSIClientCode")).toLowerCase() == "bp") {
                                                if (getLocal("CostCenter") != null && getLocal("CostCenter") != "") {
                                                    cost = getLocal("CostCenter").split(';');
                                                    if (cost.length == 2) {
                                                        costCenter = cost[1];
                                                        company = cost[0];

                                                        var myJsonObject = {
                                                            "costValidate": {
                                                                "CostCenter": costCenter,
                                                                "ValidationType": getLocal("CostCenterCRSValidationType"),
                                                                "CustomerNumber": getLocal("CustomerNumber"),
                                                                "CustomerSiteNumber": getLocal("CustomerSiteNumber"),
                                                                "Company": company
                                                            },
                                                            "dataBaseId": decryptStr(getLocal("DatabaseID")),
                                                            "language": getLocal("Language"),
                                                            "databaseName": decryptStr(getLocal("databaseName"))
                                                        };

                                                        var url = standardAddress + "CreateServiceRequest.svc/ValidateCostCenterForBp";
                                                        $.ajax({
                                                            type: "POST",
                                                            url: url,
                                                            data: JSON.stringify(myJsonObject),
                                                            contentType: "application/json; charset=utf-8",
                                                            dataType: "json",
                                                            processData: true,
                                                            //async: true,
                                                            success: function (data) {
                                                                var menuData = JSON.parse(data);
                                                                if (menuData != null) {
                                                                    setLocal("CostcenterReturnType", menuData["ReturnType"]);
                                                                    setLocal("CostCenterFormat", menuData["CostCenterFormat"]);
                                                                    if (menuData["ReturnType"]) {
                                                                        setLocal("Reference2", "VALID");
                                                                    }
                                                                    else {
                                                                        setLocal("Reference2", "INVALID");
                                                                        $(TextBoxValue).val('');
                                                                        ErrorMessage = ErrorMessage + ".\r\n" + getTranslatedValue("InvalidCostCenterForBP") + ".\r\n";
                                                                    }
                                                                }
                                                            },
                                                            error: function (data) {

                                                                hideImage();
                                                                var responseText = JSON.parse(data.responseText);
                                                                var errorMessage = responseText["ErrorDetails"];
                                                                if (errorMessage != '') {
                                                                    showErrorPopUp(true, errorMessage, errorMessage);
                                                                    canCreate = false;
                                                                }
                                                                else {
                                                                    showErrorPopUp(true, getCommonTranslatedValue("ArguementNullException"), '');
                                                                    canCreate = false;
                                                                }
                                                                return;

                                                                //                                                                var errorMessge = data.responseText.split('See')[0];
                                                                //                                                                var errorMessge2 = errorMessge.substr(errorMessge.indexOf("exception") + 23, (errorMessge.length - errorMessge.indexOf("exception") - 27))
                                                                //                                                                if (errorMessge2 != '') {
                                                                //                                                                    if (!isNaN(errorMessge2.substr(0, 1))) {
                                                                //                                                                        showErrorPopUp(true, errorMessge2.substr(1, errorMessge2.length));
                                                                //                                                                        canCreate = false;
                                                                //                                                                    }
                                                                //                                                                    else {
                                                                //                                                                        showErrorPopUp(true, errorMessge2);
                                                                //                                                                        canCreate = false;
                                                                //                                                                    }
                                                                //                                                                }
                                                                //                                                                return;
                                                            }
                                                        });
                                                    }
                                                    else {
                                                        setLocal("Reference2", "INVALID");
                                                        $(TextBoxValue).val('');
                                                        ErrorMessage = ErrorMessage + ".\r\n" + getTranslatedValue("InvalidCostCenterForBP") + ".\r\n";
                                                    }
                                                }
                                                else {
                                                    setLocal("Reference2", "INVALID");
                                                }
                                            }
                                        }
                                    }
                                    break;
                                case "Reference1":
                                    if (!IsStringNullOrEmpty(textBoxValueValid)) {
                                        if (decryptStr(getLocal("MSIClientCode")) != null) {
                                            if (decryptStr(getLocal("MSIClientCode")).toLowerCase() == "io") {
                                                var myJsonObject = {
                                                    "reference1Val": $.trim(textBoxValueValid),
                                                    "databaseId": decryptStr(getLocal("DatabaseID")),
                                                    "language": getLocal("Language"),
                                                    "dataBaseName": decryptStr(getLocal("databaseName"))
                                                };

                                                var url = standardAddress + "CreateServiceRequest.svc/ValidateReference1";
                                                $.ajax({
                                                    type: "POST",
                                                    url: url,
                                                    data: JSON.stringify(myJsonObject),
                                                    contentType: "application/json; charset=utf-8",
                                                    dataType: "json",
                                                    processData: true,
                                                    //async: true,
                                                    success: function (data) {
                                                        var menuData = JSON.parse(data);
                                                        if (menuData != null) {
                                                            if (menuData == true) {
                                                                setLocal("Reference1", $.trim(textBoxValueValid));
                                                            }
                                                            else {
                                                                ErrorMessage = '';
                                                                ErrorMessage = ErrorMessage + ".\r\n" + getTranslatedValue("Ref1Exists") + ".\r\n";
                                                            }
                                                        }

                                                    },
                                                    error: function (data) {

                                                        hideImage();
                                                        var responseText = JSON.parse(data.responseText);
                                                        var errorMessage = responseText["ErrorDetails"];
                                                        if (errorMessage != '') {
                                                            showErrorPopUp(true, errorMessage, errorMessage);
                                                            canCreate = false;
                                                        }
                                                        else {
                                                            showErrorPopUp(true, getCommonTranslatedValue("ArguementNullException"), '');
                                                            canCreate = false;
                                                        }
                                                        return;
                                                        //                                                        var errorMessge = data.responseText.split('See')[0];
                                                        //                                                        var errorMessge2 = errorMessge.substr(errorMessge.indexOf("exception") + 23, (errorMessge.length - errorMessge.indexOf("exception") - 27))
                                                        //                                                        if (errorMessge2 != '') {
                                                        //                                                            if (!isNaN(errorMessge2.substr(0, 1))) {
                                                        //                                                                showErrorPopUp(true, errorMessge2.substr(1, errorMessge2.length));
                                                        //                                                                canCreate = false;
                                                        //                                                            }
                                                        //                                                            else {
                                                        //                                                                showErrorPopUp(true, errorMessge2);
                                                        //                                                                canCreate = false;
                                                        //                                                            }
                                                        //                                                        }
                                                        //                                                        return;
                                                    }
                                                });
                                            }
                                            else {
                                                setLocal("Reference1", $.trim(textBoxValueValid));
                                            }
                                        }
                                    }

                                    break;
                                case "Reference2":
                                    if (!IsStringNullOrEmpty(textBoxValueValid)) {
                                        setLocal("Reference2", $.trim(textBoxValueValid));
                                    }
                                    break;
                                case "Reference3":
                                    if (!IsStringNullOrEmpty(textBoxValueValid)) {
                                        setLocal("Reference3", $.trim(textBoxValueValid));
                                    }
                                    break;
                                case "Reference4":
                                    if (!IsStringNullOrEmpty(textBoxValueValid)) {
                                        setLocal("Reference4", $.trim(textBoxValueValid));
                                    }
                                    break;
                                case "Reference5":
                                    if (!IsStringNullOrEmpty(textBoxValueValid)) {
                                        setLocal("Reference5", $.trim(textBoxValueValid));
                                    }
                                    break;
                                case "Reference6":
                                    if (!IsStringNullOrEmpty(textBoxValueValid)) {
                                        setLocal("Reference6", $.trim(textBoxValueValid));
                                    }
                                    break;
                                case "Reference7":
                                    if (!IsStringNullOrEmpty(textBoxValueValid)) {
                                        setLocal("Reference7", $.trim(textBoxValueValid));
                                    }
                                    break;
                                case "Reference8":
                                    if (!IsStringNullOrEmpty(textBoxValueValid)) {
                                        setLocal("Reference8", $.trim(textBoxValueValid));
                                    }
                                    break;
                                case "ProjFixedCost":
                                    if (!IsStringNullOrEmpty(textBoxValueValid)) {
                                        var projVal = parseFloat($.trim(textBoxValueValid));
                                        if (parseFloat($.trim(textBoxValueValid))) {
                                            if (parseFloat($.trim(textBoxValueValid)) > 999999999999.99) {
                                                ErrorMessage = ErrorMessage + ".\r\n" + getTranslatedValue("ProjFixedCostExceeds") + ".\r\n";
                                                setLocal("ProjFixedCost", null);
                                            }
                                        }

                                        projectFixedCostValue = $.trim(textBoxValueValid);
                                    }
                                    break;
                                case "WOFixedCost":
                                    if (!IsStringNullOrEmpty(textBoxValueValid)) {
                                        var woFixedVal = parseFloat($.trim(textBoxValueValid));
                                        if (parseFloat($.trim(textBoxValueValid))) {
                                            if (parseFloat($.trim(textBoxValueValid)) > 999999999999.99) {
                                                ErrorMessage = ErrorMessage + ".\r\n" + getTranslatedValue("WOFixedCostExceeds") + ".\r\n";
                                            }
                                        }

                                        woFixedcostValue = $.trim(textBoxValueValid);
                                    }
                                    break;
                            }

                            if (!IsStringNullOrEmpty(textBoxValueValid)) {
                                if (accountFrameChildArray[i]["InputType"] == "TBC") {
                                    if (!parseFloat($.trim(textBoxValueValid))) {
                                        ErrorMessage = getTranslatedValue("InvalidEstimation");
                                        casFieldValue = false;
                                    }
                                }

                                if (casFieldValue) {
                                    // Range Validation when InputType = TextBoxCurrency
                                    if (accountFrameChildArray[i]["MaximumValue"] != null && accountFrameChildArray[i]["MaximumValue"] != "" && accountFrameChildArray[i]["InputType"] == "TBC") {
                                        if (parseFloat($.trim(textBoxValueValid)) > parseFloat(accountFrameChildArray[i]["MaximumValue"])) {
                                            ErrorMessage = ErrorMessage + ".\r\n" + getTranslatedValue("MaxExceeds") + accountFrameChildArray[i]["MaximumValue"] + "." + ".\r\n";
                                            casFieldValue = false;
                                        }
                                    }

                                    if (accountFrameChildArray[i]["MinimumValue"] != null && accountFrameChildArray[i]["MinimumValue"] != "" && accountFrameChildArray[i]["InputType"] == "TBC") {
                                        if (parseFloat($.trim(textBoxValueValid)) < parseFloat(accountFrameChildArray[i]["MinimumValue"])) {
                                            ErrorMessage = ErrorMessage + ".\r\n" + getTranslatedValue("MinExceeds") + accountFrameChildArray[i]["MaximumValue"] + "." + ".\r\n";
                                            casFieldValue = false;
                                        }
                                    }

                                    // Range Validation when InputType = TextBoxNUmber
                                    if (accountFrameChildArray[i]["MaximumValue"] != null && accountFrameChildArray[i]["MaximumValue"] != "" && accountFrameChildArray[i]["InputType"] == "TBN") {
                                        if (parseFloat($.trim(textBoxValueValid)) > parseFloat(accountFrameChildArray[i]["MaximumValue"])) {
                                            ErrorMessage = ErrorMessage + ".\r\n" + getTranslatedValue("MaxExceeds") + accountFrameChildArray[i]["MaximumValue"] + "." + ".\r\n";
                                            casFieldValue = false;
                                        }
                                    }

                                    if (accountFrameChildArray[i]["MinimumValue"] != null && accountFrameChildArray[i]["MinimumValue"] != "" && accountFrameChildArray[i]["InputType"] == "TBN") {
                                        if (parseFloat($.trim(textBoxValueValid)) < parseFloat(accountFrameChildArray[i]["MinimumValue"])) {
                                            ErrorMessage = ErrorMessage + ".\r\n" + getTranslatedValue("MinExceeds") + accountFrameChildArray[i]["MaximumValue"] + "." + ".\r\n";
                                            casFieldValue = false;

                                        }
                                    }
                                }
                            }
                        }
                    }
                    else {
                        if (accountFrameChildArray[i]["Required"]) {
                            hideImage();
                            showErrorPopUp(true, getTranslatedValue("AdditionalInformationRequired"));
                            return false;
                        }
                        else {
                            if (accountFrameChildArray[i]["ControlId"] == "CostCenter" && $("#" + accountFrameChildArray[i]["ControlId"] + "TextBox").attr("data-required") == "true") {
                                hideImage();
                                showErrorPopUp(true, getTranslatedValue("AdditionalInformationRequired"));
                                return false;
                            }
                        }

                        switch (accountFrameChildArray[i]["ControlId"]) {
                            case "GLAccount":
                                break;
                            case "Reference1":
                                setLocal("Reference1", "");
                                break;
                            case "Reference2":
                                setLocal("Reference2", "");
                                break;
                            case "Reference3":
                                setLocal("Reference3", "");
                                break;
                            case "Reference4":
                                setLocal("Reference4", "");
                                break;
                            case "Reference5":
                                setLocal("Reference5", "");
                                break;
                            case "Reference6":
                                setLocal("Reference6", "");
                                break;
                            case "Reference7":
                                setLocal("Reference7", "");
                                break;
                            case "Reference8":
                                setLocal("Reference8", "");
                                break;
                            case "CostCenter":
                                setLocal("CostCenter", "");
                                break;
                            case "ProjFixedCost":
                                setLocal("ProjFixedCost", "");
                                break;
                        }
                    }
                    break;
                case "DD":
                    DropdownValue = "#" + accountFrameChildArray[i]["ControlId"] + "Dropdown";
                    if ($(DropdownValue).val() != null && $(DropdownValue).val() != "-1") {
                        switch (accountFrameChildArray[i]["ControlId"]) {
                            case "BusinessUnit":
                                setLocal("Company", $(DropdownValue + " option:selected").text());
                                break;
                            case "CostCenter":
                                setLocal("CostCenter", $(DropdownValue).val());
                                break;
                            case "Business":
                                business = $(DropdownValue).val();
                                break;
                            case "SubBusiness":
                                subBusiness = $(DropdownValue).val();
                                break;
                            case "BusinessGroup":
                                businessGroup = $(DropdownValue).val();
                                break;
                            default:
                                switch (accountFrameChildArray[i]["SourceName"]) {
                                    case "Drop1":
                                    case "Drop2":
                                    case "Drop3":
                                    case "Drop4":
                                    case "Drop5":
                                        if ($(DropdownValue).val() != null && $(DropdownValue).val() != "-1") {
                                            switch (accountFrameChildArray[i]["ControlId"]) {
                                                case "Reference1":
                                                    setLocal("Reference1", $(DropdownValue).val());
                                                    break;
                                                case "Reference2":
                                                    setLocal("Reference2", $(DropdownValue).val());
                                                    break;
                                                case "Reference3":
                                                    setLocal("Reference3", $(DropdownValue).val());
                                                    break;
                                                case "Reference4":
                                                    setLocal("Reference4", $(DropdownValue).val());
                                                    break;
                                                case "Reference5":
                                                    setLocal("Reference5", $(DropdownValue).val());
                                                    break;
                                                case "Reference6":
                                                    setLocal("Reference6", $(DropdownValue).val());
                                                    break;
                                                case "Reference7":
                                                    setLocal("Reference7", $(DropdownValue).val());
                                                    break;
                                                case "Reference8":
                                                    setLocal("Reference8", $(DropdownValue).val());
                                                    break;
                                                case "CostCenter":
                                                    setLocal("CostCenter", $(DropdownValue).val());
                                                    break;
                                            }
                                        }
                                        break;
                                }
                                break;
                        }
                    }
                    else {
                        if (accountFrameChildArray[i]["ControlId"] == "CostCenter") {
                            setLocal("CostCenter", "");
                        }
                    }
                    break;
                case "ACB":
                    var labelNameAct;
                    var textBoxAct;
                    var acbDropdown;
                    textBoxAct = "#" + accountFrameChildArray[i]["ControlId"] + "TextBox";
                    acbDropdown = "#" + accountFrameChildArray[i]["ControlId"] + "Dropdown";
                    var autoCompleteTextox = securityError($(textBoxAct));
                    if (autoCompleteTextox != "") {
                        if (!IsStringNullOrEmpty(autoCompleteTextox)) {
                            if (getLocal("CostCenterCRSValidationType") != null) {
                                if (accountFrameChildArray[i]["ControlId"].toUpperCase() == "COSTCENTER") {
                                    setLocal("CostCenter", $.trim(autoCompleteTextox));
                                }
                            }
                        }
                    }

                    switch (accountFrameChildArray[i]["SourceName"]) {
                        case "BUS":
                            if (!IsStringNullOrEmpty($(acbDropdown).val()) && $(acbDropdown).val() != "-1") {
                                business = $(acbDropdown).val();
                            }
                            break;
                        case "SUBBS":
                            if (!IsStringNullOrEmpty($(acbDropdown).val()) && $(acbDropdown).val() != "-1") {
                                subBusiness = $(acbDropdown).val();
                            }
                            break;
                        case "BUSGR":
                            if (!IsStringNullOrEmpty($(acbDropdown).val()) && $(acbDropdown).val() != "-1") {
                                businessGroup = $(acbDropdown).val();
                            }
                            break;
                    }
                    break;
            }
        }

        var projectval = null;
        var wofixedcost = null;
        var reg = new RegExp("[$]?([-][0-9]{1,2}([.][0-9]{1,2})?)$|^[$]?([0-9]{1,13})?([.][0-9]{1,2})$|^[$]?[0-9]{1,13}$");

        if (projectFixedCostValue != null || woFixedcostValue != null) {
            if (!IsStringNullOrEmpty(projectFixedCostValue)) {
                if (reg.test(projectFixedCostValue))//validate
                {
                    projectval = parseFloat(projectFixedCostValue);
                }
                else {
                    projectFixedCostValue = 0;
                    ErrorMessage = ErrorMessage + getTranslatedValue("InvalidProjectFixedCostMessage");
                }
            }
            else {
                projectFixedCostValue = 0;
            }

            if (!IsStringNullOrEmpty(woFixedcostValue)) {
                if (reg.test(woFixedcostValue)) {
                    wofixedcost = parseFloat(woFixedcostValue);
                }
                else {
                    woFixedcostValue = 0;
                    ErrorMessage = ErrorMessage + getTranslatedValue("InvalidWOFixedCostMessage");
                }
            }
            else {
                projectFixedCostValue = 0;
            }

            var myJsonObj = {
                "projectCost": projectval, "wocost": wofixedcost, "currencyCode": "USD", "dataBaseId": decryptStr(getLocal("DatabaseID")), "language": getLocal("Language"),
                "databaseName": decryptStr(getLocal("databaseName"))
            };
            var url = standardAddress + "CreateServiceRequest.svc/ValidateFixedCosts";
            $.ajax({
                type: "POST",
                url: url,
                data: JSON.stringify(myJsonObj),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                processData: true,
                //async: true,
                success: function (data) {
                    if (data != "") {
                        var menuData = JSON.parse(data);
                        if (menuData != null && menuData != "") {
                            ErrorMessage = '';
                            ErrorMessage = ErrorMessage + ".\r\n" + menuData + ".\r\n";
                        }
                    }
                },
                error: function (data) {

                    hideImage();

                    var responseText = JSON.parse(data.responseText);
                    var errorMessage = responseText["ErrorDetails"];
                    if (errorMessage != '') {
                        showErrorPopUp(true, errorMessage, errorMessage);
                        canCreate = false;
                    }
                    else {
                        showErrorPopUp(true, getCommonTranslatedValue("ArguementNullException"), '');
                        canCreate = false;
                    }
                    return;

                    //                    var errorMessge = data.responseText.split('See')[0];
                    //                    var errorMessge2 = errorMessge.substr(errorMessge.indexOf("exception") + 23, (errorMessge.length - errorMessge.indexOf("exception") - 27))
                    //                    if (errorMessge2 != '') {
                    //                        if (!isNaN(errorMessge2.substr(0, 1))) {
                    //                            showErrorPopUp(true, errorMessge2.substr(1, errorMessge2.length));
                    //                            ErrorMessage = errorMsg;
                    //                            $("#RequestServiceButton").addClass("ui-disabled");
                    //                            setTimeout(function () {
                    //                                showErrorPopUp(true, errorMessge2);
                    //                                canCreate = false;
                    //                                $("#RequestServiceButton").removeClass("ui-disabled");
                    //                            }, 1000);

                    //                        }
                    //                        else {
                    //                            showErrorPopUp(true, errorMessge2);
                    //                            canCreate = false;
                    //                        }
                    //                    }
                    //                    return;
                }

            });

            //        $.postJSON(url, myJsonObj, function (data) {
            //           
            //        });
        }

        var promtFlag = 0;
        if (getLocal("RegionNumber") === $("#Level1DropDown").val() &&
            getLocal("DivisionNumber") === $("#Level2DropDown").val() &&
            getLocal("DistrictNumber") === $("#Level3DropDown").val() &&
            getLocal("CustomerSiteNumber") == $("#Level4DropDown").val()) {
            setLocal("updateCallerProfile", "false");
            if (!IsStringNullOrEmpty(decryptStr(getLocal("PromptIfLevelSelectionUnchanged")))) {
                if (decryptStr(getLocal("PromptIfLevelSelectionUnchanged")).toLowerCase() == "true" && LevelChanged == false) {
                    LevelChangedError = getTranslatedValue("PromptMessage");
                    //                PromtUser(LevelChangedError);
                    LevelChangedError = confirm(getTranslatedValue("PromptMessage"));
                    if (!LevelChangedError) {
                        hideImage();
                        return false;
                    }
                    LevelChanged = true;
                    promtFlag = 1;
                    SaveCASValues();
                }
                else {
                    LevelChanged = false;
                    promtFlag = 0;
                }
            }
        }
        else {
            //            setLocal("CASInvalidInput", CASInvalidInput);
            if (!IsStringNullOrEmpty(decryptStr(getLocal("UpdateLevelFromCRS")))) {
                if (decryptStr(getLocal("UpdateLevelFromCRS")).toLowerCase() == "true") {
                    if ($("#Level1DropDown").val() != "-1" && $("#Level2DropDown").val() != "-1" && $("#Level3DropDown").val() != "-1" && $("#Level4DropDown").val() != "-1") {
                        setLocal("updateCallerProfile", "true");
                    }
                    else {
                        setLocal("updateCallerProfile", "false");
                    }
                }
                else {
                    setLocal("updateCallerProfile", "false");
                }
            }
            else {
                setLocal("updateCallerProfile", "false");
            }
        }

        if (!IsStringNullOrEmpty($("#PriorityDropdown").val()) && $("#PriorityDropdown").val() != "-1") {
            setLocal("Priority", $("#PriorityDropdown").val());
        }

        if (!IsStringNullOrEmpty(decryptStr(getLocal("PriorityDefaultAlways")))) {
            if (decryptStr(getLocal("PriorityDefaultAlways")).toLowerCase() == "true") {
                if (decryptStr(getLocal("DefaultPriority")) != null) {
                    setLocal("Priority", decryptStr(getLocal("DefaultPriority")));
                }
            }
        }

        var cost;
        var costCenterValidate;
        if (!IsStringNullOrEmpty(getLocal("CostCenterCRSValidationType")) &&
            getLocal("CostCenterCRSValidationType") != "0" &&
            getLocal("CostCenterCRSValidationType") != "1") {
            if (!IsStringNullOrEmpty(getLocal("CostCenter"))) {

                var myJsonObject = {
                    "costValidate": {
                        "CustomerNumber": getLocal("CustomerNumber"),
                        "CustomerSiteNumber": getLocal("CustomerSiteNumber"),
                        "ValidationType": getLocal("CostCenterCRSValidationType")

                    },
                    "costCenter": getLocal("CostCenter"),
                    "dataBaseId": decryptStr(getLocal("DatabaseID")),
                    "dataBaseName": decryptStr(getLocal("databaseName")),
                    "language": getLocal("Language"),
                    "msiClientCode": decryptStr(getLocal("MSIClientCode"))
                };


                var url = standardAddress + "CreateServiceRequest.svc/ValidateCostCenter";
                $.ajax({
                    type: "POST",
                    url: url,
                    data: JSON.stringify(myJsonObject),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    processData: true,
                    //async: true,
                    success: function (data) {
                        if (data == true) {
                            canCreate = true;
                        }
                        else {
                            canCreate = false;
                        }
                    },
                    error: function (data) {

                        hideImage();
                        var responseText = JSON.parse(data.responseText);
                        var errorMessage = responseText["ErrorDetails"];
                        if (errorMessage != '') {
                            showErrorPopUp(true, errorMessage, errorMessage);
                            canCreate = false;
                        }
                        else {
                            showErrorPopUp(true, getCommonTranslatedValue("ArguementNullException"), '');
                            canCreate = false;
                        }
                        return;
                        //                        var errorMessge = data.responseText.split('See')[0];
                        //                        var errorMessge2 = errorMessge.substr(errorMessge.indexOf("exception") + 23, (errorMessge.length - errorMessge.indexOf("exception") - 27))
                        //                        if (errorMessge2 != '') {
                        //                            if (!isNaN(errorMessge2.substr(0, 1))) {
                        //                                showErrorPopUp(true, errorMessge2.substr(1, errorMessge2.length));
                        //                                ErrorMessage = errorMsg;
                        //                                $("#RequestServiceButton").addClass("ui-disabled");
                        //                                setTimeout(function () {
                        //                                    showErrorPopUp(true, errorMessge2);
                        //                                    canCreate = false;
                        //                                    $("#RequestServiceButton").removeClass("ui-disabled");
                        //                                }, 1000);

                        //                            }
                        //                            else {
                        //                                showErrorPopUp(true, errorMessge2);
                        //                                canCreate = false;
                        //                            }
                        //                        }
                        //                        return;
                    }

                });
            }
        }

        var result = RequiredLabel();
        if (($("#PriorityDropdown").val() == "-1" && getLocal("PriorityDropdownConfig") ==  "true") || ($("#PhoneNumberValue").val() == null && $("#PhoneNumberValue").val() == "") || $("#ContractDropDown").val() == "-1") {
            
            hideImage();
            ErrorMessage = ErrorMessage + "\r\n" + getTranslatedValue("EnterRequiredFields") + ".\r\n";
            $("#RequestServiceButton").addClass("ui-disabled");
            setTimeout(function () {
                showErrorPopUp(true, ErrorMessage);
                ErrorMessage = '';
                canCreate = false;
                $("#RequestServiceButton").removeClass("ui-disabled");
            }, 1000);
            return;
        }
        else if (IsStringNullOrEmpty($("#PhoneNumberValue").val())) {
            hideImage();
            ErrorMessage = ErrorMessage + "\r\n" + getTranslatedValue("PhoneRequiredFieldValidator") + ".\r\n";
            //        ErrorMessage = '';
            $("#RequestServiceButton").addClass("ui-disabled");
            setTimeout(function () {
                showErrorPopUp(true, ErrorMessage);
                ErrorMessage = '';
                canCreate = false;
                $("#RequestServiceButton").removeClass("ui-disabled");
            }, 1000);
            return;
        }

        else if (($("#ProblemCodeCollapsible").is(':visible')) && ($("#EquipmentGroupDropDownList").val() == "-1" || $("#EquipmentSubgroupDropDownList").val() == "-1" || $("#ProblemCodeDropDownList").val() == "-1")) {
            hideImage();
            $("#RequestServiceButton").addClass("ui-disabled");
            setTimeout(function () {
                showErrorPopUp(true, getTranslatedValue("ProblemCodeDetailsRequired"));
                $("#RequestServiceButton").removeClass("ui-disabled");
                canCreate = false;
            }, 1000);
            return;
        }
        else if (result == false) {
            hideImage();
            $("#RequestServiceButton").addClass("ui-disabled");
            setTimeout(function () {
                showErrorPopUp(true, getTranslatedValue("AdditionalInformationRequired"));
                $("#RequestServiceButton").removeClass("ui-disabled");
                canCreate = false;
            }, 1000);
            return;
        }
        else if (!IsStringNullOrEmpty(ErrorMessage)) {
            hideImage();
            if (!IsStringNullOrEmpty(CASInvalidInput)) {
                ErrorMessage = ErrorMessage + ".\r\n" + CASInvalidInput;
                setLocal("CASInvalidInput", CASInvalidInput);
                canCreate = false;
                CASInvalidInput = '';
            }
            else if (!IsStringNullOrEmpty(getLocal("CASInvalidInput")) && promtFlag == 0) {
                ErrorMessage = ErrorMessage + ".\r\n" + getLocal("CASInvalidInput");
            }

            var errorMessage = ErrorMessage;

            $("#RequestServiceButton").addClass("ui-disabled");
            setTimeout(function () {
                showErrorPopUp(true, errorMessage);
                ErrorMessage = '';
                CASInvalidInput = '';
                $("#RequestServiceButton").removeClass("ui-disabled");
                canCreate = false;
            }, 1000);
            return;
        }
        else if (!IsStringNullOrEmpty(CASInvalidInput)) {
            hideImage();
            $("#RequestServiceButton").addClass("ui-disabled");
            setTimeout(function () {
                showErrorPopUp(true, CASInvalidInput);
                CASInvalidInput = '';
                $("#RequestServiceButton").removeClass("ui-disabled");
                canCreate = false;
            }, 1000);
            return;
        }
        else if (IsStringNullOrEmpty($("#DescriptionText").val())) {
            hideImage();
            $("#RequestServiceButton").addClass("ui-disabled");
            setTimeout(function () {
                showErrorPopUp(true, getTranslatedValue("DescriptionRequired"));
                $("#RequestServiceButton").removeClass("ui-disabled");
                canCreate = false;
            }, 1000);
            return;
        }
        else if ($('#addAttachmentCheckBox').is(":checked") && IsStringNullOrEmpty($("#smallImage").attr('src'))) {
            hideImage();
            $("#RequestServiceButton").addClass("ui-disabled");
            setTimeout(function () {
                showErrorPopUp(true, getTranslatedValue("imageRequired"));
                $("#RequestServiceButton").removeClass("ui-disabled");
                canCreate = false;
            }, 1000);
            return;
        }
        ////        else if (validateBusinessRequired == false) {
        ////            hideImage();
        ////            $("#RequestServiceButton").addClass("ui-disabled");
        ////            setTimeout(function () {
        ////                showErrorPopUp(true, "Business, SubBusiness and BusinessGroup is required");
        ////                $("#RequestServiceButton").removeClass("ui-disabled");
        ////                canCreate = false;
        ////            }, 1000);
        ////            return;
        ////        }
        else {
            var company;
            var problemCodeNumber;
            var problemDesc;
            if (IsStringNullOrEmpty(getLocal("Company"))) {
                company = getLocal("CallerCompany");
            }
            else {
                company = getLocal("Company");
            }

            if (IsStringNullOrEmpty(getLocal("ProblemCodeNumber")) && IsStringNullOrEmpty(getLocal("ProblemCodeDescription"))) {
                if ($("#ProblemCodeCollapsible").css("display") != "none") {
                    problemDesc = $("#ProblemCodeDropDownList option:selected").text();
                    problemCodeNumber = $("#ProblemCodeDropDownList").val();
                }
            }
            else {
                problemDesc = getLocal("ProblemCodeDescription");
                problemCodeNumber = getLocal("ProblemCodeNumber");
            }

            var custDetails = ''
            if ($('#Level4DropDown').val() != null && $('#Level4DropDown').val() != '' && $('#Level4DropDown').val() != undefined) {
                custDetails = $('#Level4DropDown').val().split('ì');
            }
            if (promtFlag == 0) {
                ErrorMessage = '';
                setTimeout(function () {
                    if (canCreate) {
                        if ($("#Level1DropDown").val() != "-1" && $("#Level2DropDown").val() != "-1" && $("#Level3DropDown").val() != "-1" && $("#Level4DropDown").val() != "-1" && $("#ContractDropDown").val() != "-1") {
                            var myJsonObject = {
                                "callerObject": {
                                    "CustomerNumber": (custDetails != '' && custDetails.length > 0) ? custDetails[0] : getLocal("CustomerNumber"),
                                    "CustomerSiteNumber": (custDetails != '' && custDetails.length > 1) ? custDetails[1] : getLocal("CustomerSiteNumber"),
                                    "Priority": $("#PriorityDropdown").val(),
                                    "Level1": $("#Level1DropDown").val(),
                                    "Level2": $("#Level2DropDown").val(),
                                    "Level3": $("#Level3DropDown").val(),
                                    "Level4": $("#Level4DropDown option:selected").text(),
                                    "Priority": $("#PriorityDropdown").val(),
                                    "CallerName": callernameid,
                                    "PhoneNumber": phoneNumberText,
                                    "Location": locationid,
                                    "SiteContactName": contactName,
                                    "SitePhone": contactPhone,
                                    "Seq": getLocal("seq"),
                                    "SessionId": decryptStr(getLocal("SessionId")),
                                    "UpdateCallerProfile": getLocal("updateCallerProfile"),
                                    "DatabaseID": decryptStr(getLocal("DatabaseID")),
                                    "Language": getLocal("Language"),
                                    "DatabaseName": decryptStr(getLocal("databaseName"))
                                },
                                "cfgWebSiteObject": {
                                    "PromptIfLevelSelectionUnchanged": decryptStr(getLocal("PromptIfLevelSelectionUnchanged")),
                                    "UpdateLevel34FromCRS": decryptStr(getLocal("UpdateLevelFromCRS")),
                                    "PriorityDefaultAlways": decryptStr(getLocal("PriorityDefaultAlways")),
                                    "DefaultPriority": decryptStr(getLocal("DefaultPriority")),
                                    "DefaultEnteredByEmployee": decryptStr(getLocal("DefaultEnteredByEmployee")),
                                    "WOSource": decryptStr(getLocal("WOSource")),
                                    "DefaultProblemCode": decryptStr(getLocal("DefaultProblemCode")),
                                    "AutoDispatchStatus": decryptStr(getLocal("AutoDispatchStatus")),
                                    "AutoDispatchFailStatus": decryptStr(getLocal("AutoDispatchFailStatus")),
                                    "UpdateCostCenterFromCRS": decryptStr(getLocal("UpdateCostCenterFromCRS")),
                                    "AutoContactNotUsedStatus": decryptStr(getLocal("AutoContactNotUsedStatus")),
                                    "AutoContactSubject": getLocal("AutoContactSubject"),
                                    "EmailEmployee": decryptStr(getLocal("EmailEmployee")),
                                    "UseCallLogNumber": decryptStr(getLocal("UseCallLogNumber")),
                                    "DefaultAssnEmployee": decryptStr(getLocal("DefaultAssnEmployee")),
                                    "RequestStatus": decryptStr(getLocal("RequestStatus")),
                                    "AutoDispatchOnCRS": decryptStr(getLocal("AutoDispatchOnCRS"))
                                },
                                "workOrderAccount": {
                                    "Company": company,
                                    "ExtAccountNumber": getLocal("ExtAccountNumber"),
                                    "CostCenter": getLocal("CostCenter"),
                                    "Business": business,
                                    "SubBusiness": subBusiness,
                                    "BusinessGroup": businessGroup
                                },
                                "workOrderBE": {
                                    "ProblemDescription": problemDesc,
                                    "ProblemCodeNumber": problemCodeNumber,
                                    "SitePhone": contactphoneId,
                                    "Location": locationid,
                                    "LocationPhone": phoneNumberText,
                                    "CallerSeq": getLocal("seq"),
                                    "Originator": getLocal("TypeOfCaller"),
                                    "Reference": getLocal("Reference1"),
                                    "Reference2": getLocal("Reference2"),
                                    "Reference3": getLocal("Reference3"),
                                    "Reference4": getLocal("Reference4"),
                                    "Reference5": getLocal("Reference5"),
                                    "Reference6": getLocal("Reference6"),
                                    "Reference7": getLocal("Reference7"),
                                    "Reference8": getLocal("Reference8"),
                                    "CurrencyCode": "USD",
                                    "ProjectFixedCost": projectFixedCostValue,
                                    "WOFixedCost": woFixedcostValue,
                                    "EmployeeNumber": decryptStr(getLocal("DefaultEnteredByEmployee")),
                                    "ApprovedBy": decryptStr(getLocal("DefaultEnteredByEmployee")),
                                    "GPSLocation": getLocal("GPSLocation"),
                                    "ProblemDescByUser": descriptionId,
                                    "FilterSeq": $("#ContractDropDown").val()
                                },
                                "uploadedFileData": {
                                    "FileObjectInBase64": $("#smallImage").attr('src'),
                                    "FileName": "image.jpg"
                                }
                            };
                            var url = standardAddress + "CreateServiceRequest.svc/CreateWorkOrder";

                            $.ajax({
                                type: "POST",
                                url: url,
                                data: JSON.stringify(myJsonObject),
                                contentType: "application/json; charset=utf-8",
                                dataType: "json",
                                processData: true,
                                //async: true,
                                success: function (data) {
                                    hideImage();
                                    if ($("#ProblemCodeCollapsible").css("display") != "none") {
                                        setLocal("ProblemCodeDescription", "");
                                        setLocal("ProblemCodeNumber", "");
                                    }
                                    setLocal("CostCenterCRSValidationType", "")
                                    setLocal("CASInvalidInput", "");
                                    localStorage.setItem("PhoneNumber", $("#PhoneNumberValue").val());
                                    localStorage.setItem("LocationDetail", $("#LocationTextBox").val());
                                    var menuData = JSON.parse(data);
                                    if (menuData != null && menuData != "") {
                                        setLocal("woID", menuData.WorkOrderNumber);
                                        setLocal("PreviousPage", '');
                                        if (getLocal("updateCallerProfile") != null && getLocal("updateCallerProfile") != "" && getLocal("updateCallerProfile") != undefined) {
                                            if (getLocal("updateCallerProfile").toLowerCase() == "true") {
                                                setLocal("CustomerNumber", menuData.CustomerNumber);
                                                setLocal("CustomerSiteNumber", menuData.CustomerSiteNumber);
                                            }
                                        }

                                        $.mobile.changePage("serviceReqConfirm.html");
                                    }
                                },
                                async: true,
                                error: function (data) {
                                    hideImage();

                                    var responseText = JSON.parse(data.responseText);
                                    var errorMessage = responseText["ErrorDetails"];
                                    if (errorMessage != '') {
                                        showErrorPopUp(true, errorMessage, errorMessage);
                                    }
                                    else {
                                        showErrorPopUp(true, getCommonTranslatedValue("ArguementNullException"), '');
                                    }
                                    return;
                                }
                            });
                        }
                        else {
                            if (getLocal("EditProfileFromWeb") != null && getLocal("EditProfileFromWeb") != "") {
                                if (getLocal("EditProfileFromWeb").toLowerCase() == "true") {
                                    hideImage();
                                    $("#RequestServiceButton").addClass("ui-disabled");
                                    setTimeout(function () {
                                        showErrorPopUp(true, getTranslatedValue("LocationDropdownsRequired"));
                                        $("#RequestServiceButton").removeClass("ui-disabled");
                                    }, 1000);
                                    return;
                                }
                            }
                            return;
                        }

                    }
                    else {
                        hideImage();
                        $("#RequestServiceButton").addClass("ui-disabled");
                        setTimeout(function () {
                            showErrorPopUp(true, getTranslatedValue("EnterRequiredFields"));
                            $("#RequestServiceButton").removeClass("ui-disabled");
                        }, 1000);
                        return;
                    }
                }, 6000);
            }
        }
    }
    else {
        setTimeout(function () {
            showErrorPopUp(true, noNetworkTranslation);
        }, 1000);
    }
}


/// Load Business unit CAS values/Company dropdown CAS values.
function FetchWorkOrderDetail(option) {
    if (navigator.onLine) {
        var myJsonObject = {
            "dataBaseId": decryptStr(getLocal("DatabaseID")),
            "language": getLocal("Language"),
            "codeType": option,
            "databaseName": decryptStr(getLocal("databaseName")),
            "sessionId": decryptStr(getLocal("SessionId"))
        };

        var url = standardAddress + "CreateServiceRequest.svc/FetchWorkOrderDetail";
        $.postJSON(url, myJsonObject, function (data) {
            if (data != null) {
                setLocal("companyValues", data);
            }
        });
    }
    else {
        setTimeout(function () {
            showErrorPopUp(true, noNetworkTranslation);
        }, 1000);
    }
}

/// Function to check for CAS mandatory fields entry completion.
function RequiredLabel(value) {
    if (navigator.onLine) {
        var returnvalue = true;
        var required = false;
        var pageID = "#" + $.mobile.activePage.attr('id');
        $(pageID).find("[data-required='true']").each(function () {
            required = true;
            switch (this.tagName.toUpperCase()) {
                case "SELECT":
                    if (this.value == "-1" || this.value == "-3") {
                        returnvalue = false;
                    }
                    break;
                case "INPUT":
                    if (this.value.length === 0) {
                        returnvalue = false;
                    }
                    break;
                case "TEXTAREA":
                    if (this.value.length === 0) {
                        returnvalue = false;
                    }
                    break;
            }
        });

        if (!IsStringNullOrEmpty(value)) {
            if (!IsStringNullOrEmpty(value.attributes)) {
                if (!IsStringNullOrEmpty(value.attributes["data-input"])) {
                    switch (value.attributes["data-input"].value.toUpperCase()) {
                        case "TBC":
                            if (!IsStringNullOrEmpty($("#" + value.id).val())) {
                                if (!$("#" + value.id).val().match(estimationServiceCostRegularExpression)) {
                                    if (IsStringNullOrEmpty(TextBoxFlag) || TextBoxFlag != value.id) {
                                        TextBoxFlag = value.id;
                                        CASInvalidInput = CASInvalidInput + value.attributes["data-text"].value + " " + getTranslatedValue("CASInvalidInput") + ".\r\n";
                                    }
                                }
                                else {
                                    CASInvalidInput = "";
                                }
                            }
                            break;
                        case "TBN":
                            if (!IsStringNullOrEmpty($("#" + value.id).val())) {
                                if (!$("#" + value.id).val().match(NumberExpression)) {
                                    if (IsStringNullOrEmpty(TextBoxFlag) || TextBoxFlag != value.id) {
                                        TextBoxFlag = value.id;
                                        CASInvalidInput = CASInvalidInput + value.attributes["data-text"].value + " " + getTranslatedValue("CASInvalidInput") + ".\r\n";
                                    }
                                }
                                else {
                                    CASInvalidInput = "";
                                }
                            }
                            break;
                    }
                }
            }
        }

        if (returnvalue == false && required == true) {
            setLocal("Required", "Required");
            //setTimeout(function () {
            $('#CASCollapsible .ui-collapsible-heading-toggle').text(getTranslatedValue("CASCollapsible") + " - " + getTranslatedValue("RequiredLabel"));
            //}, 500);
        }
        else if (returnvalue == true && required == true) {
            setLocal("Required", "Required(Completed)");
            // setTimeout(function () {
            $('#CASCollapsible .ui-collapsible-heading-toggle').text(getTranslatedValue("CASCollapsible") + " - " + getTranslatedValue("RequiredCompleteLabel"));
            //}, 500);
        }
        else {
            // setTimeout(function () {
            $('#CASCollapsible .ui-collapsible-heading-toggle').text(getTranslatedValue("CASCollapsible"));
            //}, 500);
        }

        return returnvalue;
    }
    else {
        setTimeout(function () {
            showErrorPopUp(true, noNetworkTranslation);
        }, 1000);
    }
}

function ValidateRegularExpression(value) {

    switch (value.attributes["data-input"].value.toUpperCase()) {
        case "TBC":
            if (!IsStringNullOrEmpty($("#" + value.id).val())) {
                if (!$("#" + value.id).val().match(estimationServiceCostRegularExpression)) {
                    if (IsStringNullOrEmpty(TextBoxFlag) || TextBoxFlag != value.id) {
                        TextBoxFlag = value.id;
                        CASInvalidInput = CASInvalidInput + value.attributes["data-text"].value + " " + getTranslatedValue("CASInvalidInput") + ".\r\n";
                    }
                }
            }
            break;
        case "TBN":
            if (!IsStringNullOrEmpty($("#" + value.id).val())) {
                if (!$("#" + value.id).val().match(NumberExpression)) {
                    if (IsStringNullOrEmpty(TextBoxFlag) || TextBoxFlag != value.id) {
                        TextBoxFlag = value.id;
                        CASInvalidInput = CASInvalidInput + value.attributes["data-text"].value + " " + getTranslatedValue("CASInvalidInput") + ".\r\n";
                    }
                }
            }
            break;
    }
}


/// Function to load the problem codes.
function GetProbleCodes() {
    if (navigator.onLine) {
        var myJsonObject = {
            "workOrderBE": {
                "DatabaseID": decryptStr(getLocal("DatabaseID")),
                "Language": getLocal("Language"),
                "DatabaseName": decryptStr(getLocal("databaseName")),
                "Mode": "ProblemCodeAutoCompleteDDL",
                "SearchString": $("#ProblemCodeTextBox").val(),
                "ScreenName": IsStringNullOrEmpty(getLocal("CRSForm")) ? "7" : getLocal("CRSForm"),
                //                "RegionNumber": IsStringNullOrEmpty($("#Level1DropDown").val()) ? "0" : $("#Level1DropDown").val(),
                //                "DivisionNumber": IsStringNullOrEmpty($("#Level2DropDown").val()) ? "0" : $("#Level2DropDown").val(),
                //                "DistrictNumber": IsStringNullOrEmpty($("#Level3DropDown").val()) ? "0" : $("#Level3DropDown").val(),
                "CustomerNumber": $("#Level4DropDown").val() == "0" ? "0" : $("#Level4DropDown").val().split('ì')[0],
                "CustomerSiteNumber": $("#Level4DropDown").val() == "0" ? "0" : $("#Level4DropDown").val().split('ì')[1],
                "ID": getLocal("seq"),
                "ContractID": $("#ContractDropDown").val() == "-1" ? "-1" : $("#ContractDropDown").val()
            }
        };

        if ($("#ProblemCodeTextBox").val().length >= 3) {
            var url = standardAddress + "CreateServiceRequest.svc/GetProbleCodes";
            $.postJSON(url, myJsonObject, function (data) {
                if (data != null) {
                    $("#ProblemCodeAutoComplete option:gt(0)").remove();
                    for (index = 0; index < data.length; index++) {
                        var dropdown = document.createElement("option");
                        dropdown.setAttribute("value", data[index]["ProblemCodeNumber"]);
                        dropdown.innerHTML = data[index]["ProblemDescription"];
                        $("#ProblemCodeAutoComplete").append(dropdown);
                    }

                    $("#ProblemCodeAutoComplete").selectmenu("refresh");
                }
            });
        }
    }
    else {
        setTimeout(function () {
            showErrorPopUp(true, noNetworkTranslation);
        }, 1000);
    }
}

/// Binds problem code and equip group and sub group data to dropdown.
function ProblemCodeSetUp() {
    if (navigator.onLine) {
        if (getLocal("EditProfileFromWeb") != null && getLocal("EditProfileFromWeb") != "") {
            if (getLocal("EditProfileFromWeb").toLowerCase() != "true") {
                // setTimeout(function () {
                $("#ProfileNameValue").addClass('ui-disabled');
                $("#CallerNameValue").parent().addClass('ui-disabled');
                $("#ContactNameValue").parent().addClass('ui-disabled');
                $("#ContactPhoneValue").parent().addClass('ui-disabled');
                $("#PhoneNumberValue").parent().addClass('ui-disabled');

                DisableDropDowns();
                //}, 3000);
            }
        }
        if (decryptStr(getLocal("ShowPCDropDowns")).toLowerCase() != "true") {
            $("#ProblemCodeCollapsible").hide();
            setLocal("ProblemCodeNumber", decryptStr(getLocal("DefaultProblemCode")));
            setLocal("ProblemCodeDescription", '');
        }
        else {
            if (decryptStr(getLocal("ProblemCodeSearch")).toLowerCase() == "true") {
                $("#ProblemCodeAutocompleteTD").show();
            }
            else {
                $("#ProblemCodeAutocompleteTD").hide();
            }
            setLocal("ProblemCodeNumber", '');
            setLocal("ProblemCodeDescription", '');
            $("#ProblemCodeCollapsible").show();
            BindEquipmentDetails("EquipmentGroupDropDownList");
        }
    }
    else {
        setTimeout(function () {
            showErrorPopUp(true, noNetworkTranslation);
        }, 1000);
    }
}

/// Function to load the equipment group details.
function BindEquipmentDetails(dropdownId) {

    if (navigator.onLine) {
        var myJsonObject;
        var url;
        var dropdownVal = dropdownId;
        $.mobile.activePage.find("#selfHelpLabel").remove();
        $.mobile.activePage.find("#selfhelpurl").remove();
        $("#RequestServiceButton").removeClass("ui-disabled");


        // Check if it is from Quick Links.
        if (getLocal("NavigationFromQuickLinks") == "1") {
            setLocal("NavigationFromQuickLinks", "0");
            fromQuickLinks = "1";
        }

        if (dropdownVal.id != null && dropdownVal.id != "" && dropdownVal.id != undefined) {
            dropdownVal = dropdownId.id;
            switch (dropdownId.id) {
                case "EquipmentGroupDropDownList":
                    dropdownVal = "EquipmentSubgroupDropDownList";
                    break;
                case "EquipmentSubgroupDropDownList":
                    dropdownVal = "ProblemCodeDropDownList";
                    break;
                case "ProblemCodeDropDownList":
                    if (decryptStr(getLocal("ProblemCodeSearch")).toLowerCase() == "true") {
                        if (decryptStr(getLocal("ChangeTheOrderOfProblemCodeDropDown")) == "1") {
                            if ($("#EquipmentGroupDropDownList").val() == "-1") {
                                dropdownVal = "EquipmentGroupDropDownList";
                            }
                        }
                    }
                    break;
            }
        }

        switch (dropdownVal) {
            case "EquipmentGroupDropDownList":
                $("#ProblemCodeTextBox").val('');
                if ($("#ProblemCodeAutoComplete option").size() > 1) {
                    $("#ProblemCodeAutoComplete option:gt(0)").remove();
                    $("#ProblemCodeAutoComplete").selectmenu("refresh");
                }

                if ($("#EquipmentSubgroupDropDownList option").size() > 1) {
                    $("#EquipmentSubgroupDropDownList option:gt(0)").remove();
                    $("#EquipmentSubgroupDropDownList").selectmenu("refresh");
                }

                if ($("#ProblemCodeDropDownList option").size() > 1) {
                    $("#ProblemCodeDropDownList option:gt(0)").remove();
                    $("#ProblemCodeDropDownList").selectmenu("refresh");
                }


                myJsonObject = {
                    "workOrderBE": {
                        "DatabaseID": decryptStr(getLocal("DatabaseID")),
                        "Language": getLocal("Language"),
                        "DatabaseName": decryptStr(getLocal("databaseName")),
                        "Mode": "EquipmentGroupDropDownList",
                        "ScreenName": IsStringNullOrEmpty(getLocal("CRSForm")) ? "7" : getLocal("CRSForm"),
                        "CustomerNumber": $("#Level4DropDown").val() == "0" ? "0" : $("#Level4DropDown").val().split('ì')[0],
                        "CustomerSiteNumber": $("#Level4DropDown").val() == "0" ? "0" : $("#Level4DropDown").val().split('ì')[1],
                        "ID": getLocal("seq"),
                        "ContractID": $("#ContractDropDown").val() == "-1" ? "-1" : $("#ContractDropDown").val()
                    }
                };
                url = standardAddress + "CreateServiceRequest.svc/GetProbleCodes";
                $.postJSON(url, myJsonObject, function (data) {

                    if (data != null) {
                        if ($("#EquipmentGroupDropDownList option").size() > 1) {
                            $("#EquipmentGroupDropDownList option:gt(0)").remove();
                        }
                        for (index = 0; index < data.length; index++) {
                            var dropdown = document.createElement("option");
                            dropdown.setAttribute("value", data[index]["EquipGroupNumber"]);
                            dropdown.innerHTML = data[index]["EquipGroupDescription"];
                            $("#EquipmentGroupDropDownList").append(dropdown);
                        }

                        if ($("#EquipmentGroupDropDownList option").length === 2) {
                            $("#EquipmentGroupDropDownList").val($("#EquipmentGroupDropDownList").find('option:eq(1)').val());
                        }

                        if (fromQuickLinks == "1") {
                            if (!IsStringNullOrEmpty(getLocal("EquipGroupNumberQL"))) {
                                $("#EquipmentGroupDropDownList").val(getLocal("EquipGroupNumberQL"));
                                $("#EquipmentGroupDropDownList").selectmenu("refresh");
                                BindEquipmentDetails($("#EquipmentGroupDropDownList")[0]);

                                $("#EquipmentSubgroupDropDownList").addClass('ui-state-disabled');
                                $("#EquipmentGroupDropDownList").addClass('ui-state-disabled');
                                $('#ProblemCodeAutocompleteTD').hide();
                            }
                        }

                        $("#EquipmentGroupDropDownList").selectmenu("refresh");

                        if (data.length == 1) {

                            // Load equipsub group dropdownlist.
                            if ($("#EquipmentGroupDropDownList").val() != "-1") {
                                myJsonObject = {
                                    "workOrderBE": {
                                        "DatabaseID": decryptStr(getLocal("DatabaseID")),
                                        "Language": getLocal("Language"),
                                        "DatabaseName": decryptStr(getLocal("databaseName")),
                                        "Mode": "EquipmentSubgroupDropDownList",
                                        "EquipGroupNumberString": $("#EquipmentGroupDropDownList").val(),
                                        "ScreenName": IsStringNullOrEmpty(getLocal("CRSForm")) ? "7" : getLocal("CRSForm"),
                                        "CustomerNumber": $("#Level4DropDown").val() == "0" ? "0" : $("#Level4DropDown").val().split('ì')[0],
                                        "CustomerSiteNumber": $("#Level4DropDown").val() == "0" ? "0" : $("#Level4DropDown").val().split('ì')[1],
                                        "ID": getLocal("seq"),
                                        "ContractID": $("#ContractDropDown").val() == "-1" ? "-1" : $("#ContractDropDown").val()
                                    }
                                };
                                url = standardAddress + "CreateServiceRequest.svc/GetProbleCodes";
                                $.postJSON(url, myJsonObject, function (data) {
                                    if (data != null) {
                                        if ($("#EquipmentSubgroupDropDownList option").size() > 1) {
                                            $("#EquipmentSubgroupDropDownList option:gt(0)").remove();
                                            $("#ProblemCodeDropDownList option:gt(0)").remove();
                                            $("#ProblemCodeDropDownList").selectmenu("refresh");
                                        }
                                        for (index = 0; index < data.length; index++) {
                                            var dropdown = document.createElement("option");
                                            dropdown.setAttribute("value", data[index]["EquipStyleSeq"]);
                                            dropdown.innerHTML = data[index]["EquipStyleDescription"];
                                            $("#EquipmentSubgroupDropDownList").append(dropdown);
                                        }

                                        if ($("#EquipmentSubgroupDropDownList option").length === 2) {
                                            $("#EquipmentSubgroupDropDownList").val($("#EquipmentSubgroupDropDownList").find('option:eq(1)').val());
                                        }

                                        $("#EquipmentSubgroupDropDownList").selectmenu("refresh");

                                        if (data.length == 1) {
                                            // Load the problemcode dropdownlist.
                                            if ($("#EquipmentGroupDropDownList").val() != "-1" && $("#EquipmentSubgroupDropDownList").val() != "-1") {
                                                myJsonObject = {
                                                    "workOrderBE": {
                                                        "DatabaseID": decryptStr(getLocal("DatabaseID")),
                                                        "Language": getLocal("Language"),
                                                        "DatabaseName": decryptStr(getLocal("databaseName")),
                                                        "Mode": "ProblemCodeDropDownList",
                                                        "EquipGroupNumberString": $("#EquipmentGroupDropDownList").val(),
                                                        "EquipStyleSeqString": $("#EquipmentSubgroupDropDownList").val(),
                                                        "ScreenName": IsStringNullOrEmpty(getLocal("CRSForm")) ? "7" : getLocal("CRSForm"),
                                                        "CustomerNumber": $("#Level4DropDown").val() == "0" ? "0" : $("#Level4DropDown").val().split('ì')[0],
                                                        "CustomerSiteNumber": $("#Level4DropDown").val() == "0" ? "0" : $("#Level4DropDown").val().split('ì')[1],
                                                        "ID": getLocal("seq"),
                                                        "ContractID": $("#ContractDropDown").val() == "-1" ? "-1" : $("#ContractDropDown").val()
                                                    }
                                                };
                                                url = standardAddress + "CreateServiceRequest.svc/GetProbleCodes";
                                                $.postJSON(url, myJsonObject, function (data) {
                                                    if (data != null) {
                                                        if ($("#ProblemCodeDropDownList").val() == "-1") {
                                                            if ($("#ProblemCodeDropDownList option").size() > 1) {
                                                                $("#ProblemCodeDropDownList option:gt(0)").remove();
                                                            }
                                                            for (index = 0; index < data.length; index++) {
                                                                var dropdown = document.createElement("option");
                                                                dropdown.setAttribute("value", data[index]["ProblemCodeNumber"]);
                                                                dropdown.innerHTML = data[index]["ProblemDescription"];
                                                                $("#ProblemCodeDropDownList").append(dropdown);
                                                            }

                                                            if ($("#ProblemCodeDropDownList option").length === 2) {
                                                                $("#ProblemCodeDropDownList").val($("#ProblemCodeDropDownList").find('option:eq(1)').val());
                                                            }

                                                            $("#ProblemCodeDropDownList").selectmenu("refresh");

                                                            if ($("#ProblemCodeDropDownList").val() != "-1") {
                                                                checkForSelfHelp($("#ProblemCodeDropDownList").val());
                                                            }
                                                        }
                                                    }
                                                });
                                            }
                                        }
                                    }
                                });
                            }
                        }
                    }
                });

                if ($("#ProblemCodeDropDownList").val() != null && $("#ProblemCodeDropDownList").val() != "-1") {
                    LoadGLAccountOnProblemCode();
                }

                break;
            case "EquipmentSubgroupDropDownList":
                if ($("#EquipmentGroupDropDownList").val() != "-1") {
                    myJsonObject = {
                        "workOrderBE": {
                            "DatabaseID": decryptStr(getLocal("DatabaseID")),
                            "Language": getLocal("Language"),
                            "DatabaseName": decryptStr(getLocal("databaseName")),
                            "Mode": "EquipmentSubgroupDropDownList",
                            "EquipGroupNumberString": $("#EquipmentGroupDropDownList").val(),
                            "ScreenName": IsStringNullOrEmpty(getLocal("CRSForm")) ? "7" : getLocal("CRSForm"),
                            "CustomerNumber": $("#Level4DropDown").val() == "0" ? "0" : $("#Level4DropDown").val().split('ì')[0],
                            "CustomerSiteNumber": $("#Level4DropDown").val() == "0" ? "0" : $("#Level4DropDown").val().split('ì')[1],
                            "ID": getLocal("seq"),
                            "ContractID": $("#ContractDropDown").val() == "-1" ? "-1" : $("#ContractDropDown").val()
                        }
                    };
                    url = standardAddress + "CreateServiceRequest.svc/GetProbleCodes";
                    $.postJSON(url, myJsonObject, function (data) {
                        if (data != null) {
                            if ($("#EquipmentSubgroupDropDownList option").size() > 1) {
                                $("#EquipmentSubgroupDropDownList option:gt(0)").remove();
                                $("#ProblemCodeDropDownList option:gt(0)").remove();
                                $("#ProblemCodeDropDownList").selectmenu("refresh");
                            }
                            for (index = 0; index < data.length; index++) {
                                var dropdown = document.createElement("option");
                                dropdown.setAttribute("value", data[index]["EquipStyleSeq"]);
                                dropdown.innerHTML = data[index]["EquipStyleDescription"];
                                $("#EquipmentSubgroupDropDownList").append(dropdown);
                            }

                            if ($("#EquipmentSubgroupDropDownList option").length === 2) {
                                $("#EquipmentSubgroupDropDownList").val($("#EquipmentSubgroupDropDownList").find('option:eq(1)').val());
                            }

                            if (fromQuickLinks == "1") {
                                if (!IsStringNullOrEmpty(getLocal("EquipStyleNumberQL"))) {
                                    $("#EquipmentSubgroupDropDownList").val(getLocal("EquipStyleNumberQL"));
                                    $("#EquipmentSubgroupDropDownList").selectmenu("refresh");
                                    BindEquipmentDetails($("#EquipmentSubgroupDropDownList")[0]);
                                }
                            }

                            $("#EquipmentSubgroupDropDownList").selectmenu("refresh");
                            if (!IsStringNullOrEmpty(getLocal("AutocompleteProblemCode"))) {
                                $("#EquipmentSubgroupDropDownList").val(getLocal("AutocompleteEquipSubGroup"));
                                $("#EquipmentSubgroupDropDownList").selectmenu("refresh");
                                //BindEquipmentDetails("ProblemCodeDropDownList");
                            }
                            setLocal("AutocompleteEquipSubGroup", null);

                            if (data.length == 1 || !IsStringNullOrEmpty(getLocal("AutocompleteProblemCode"))) {
                                if ($("#EquipmentGroupDropDownList").val() != "-1" && $("#EquipmentSubgroupDropDownList").val() != "-1") {
                                    myJsonObject = {
                                        "workOrderBE": {
                                            "DatabaseID": decryptStr(getLocal("DatabaseID")),
                                            "Language": getLocal("Language"),
                                            "DatabaseName": decryptStr(getLocal("databaseName")),
                                            "Mode": "ProblemCodeDropDownList",
                                            "EquipGroupNumberString": $("#EquipmentGroupDropDownList").val(),
                                            "EquipStyleSeqString": $("#EquipmentSubgroupDropDownList").val(),
                                            "ScreenName": IsStringNullOrEmpty(getLocal("CRSForm")) ? "7" : getLocal("CRSForm"),
                                            "CustomerNumber": $("#Level4DropDown").val() == "0" ? "0" : $("#Level4DropDown").val().split('ì')[0],
                                            "CustomerSiteNumber": $("#Level4DropDown").val() == "0" ? "0" : $("#Level4DropDown").val().split('ì')[1],
                                            "ID": getLocal("seq"),
                                            "ContractID": $("#ContractDropDown").val() == "-1" ? "-1" : $("#ContractDropDown").val()
                                        }
                                    };
                                    url = standardAddress + "CreateServiceRequest.svc/GetProbleCodes";
                                    $.postJSON(url, myJsonObject, function (data) {
                                        if (data != null) {
                                            if ($("#ProblemCodeDropDownList option").size() > 1) {
                                                $("#ProblemCodeDropDownList option:gt(0)").remove();
                                            }
                                            for (index = 0; index < data.length; index++) {
                                                var dropdown = document.createElement("option");
                                                dropdown.setAttribute("value", data[index]["ProblemCodeNumber"]);
                                                dropdown.innerHTML = data[index]["ProblemDescription"];
                                                $("#ProblemCodeDropDownList").append(dropdown);
                                            }

                                            if ($("#ProblemCodeDropDownList option").length === 2) {
                                                $("#ProblemCodeDropDownList").val($("#ProblemCodeDropDownList").find('option:eq(1)').val());
                                            }
                                            $("#ProblemCodeDropDownList").selectmenu("refresh");
                                            if (!IsStringNullOrEmpty(getLocal("AutocompleteProblemCode"))) {
                                                $("#ProblemCodeDropDownList").val(getLocal("AutocompleteProblemCode"));
                                                $("#ProblemCodeDropDownList").selectmenu("refresh");
                                            }

                                            setLocal("AutocompleteProblemCode", null);

                                            if ($("#ProblemCodeDropDownList").val() != "-1") {
                                                checkForSelfHelp($("#ProblemCodeDropDownList").val());
                                            }
                                        }
                                    });

                                    if ($("#ProblemCodeDropDownList").val() != null && $("#ProblemCodeDropDownList").val() != "-1") {
                                        LoadGLAccountOnProblemCode();
                                    }
                                }
                            }
                        }
                    });
                }
                break;
            case "ProblemCodeDropDownList":
                if ($("#EquipmentGroupDropDownList").val() != "-1" && $("#EquipmentSubgroupDropDownList").val() != "-1") {
                    myJsonObject = {
                        "workOrderBE": {
                            "DatabaseID": decryptStr(getLocal("DatabaseID")),
                            "Language": getLocal("Language"),
                            "DatabaseName": decryptStr(getLocal("databaseName")),
                            "Mode": "ProblemCodeDropDownList",
                            "EquipGroupNumberString": $("#EquipmentGroupDropDownList").val(),
                            "EquipStyleSeqString": $("#EquipmentSubgroupDropDownList").val(),
                            "ScreenName": IsStringNullOrEmpty(getLocal("CRSForm")) ? "7" : getLocal("CRSForm"),
                            "CustomerNumber": $("#Level4DropDown").val() == "0" ? "0" : $("#Level4DropDown").val().split('ì')[0],
                            "CustomerSiteNumber": $("#Level4DropDown").val() == "0" ? "0" : $("#Level4DropDown").val().split('ì')[1],
                            "ID": getLocal("seq"),
                            "ContractID": $("#ContractDropDown").val() == "-1" ? "-1" : $("#ContractDropDown").val()
                        }
                    };
                    url = standardAddress + "CreateServiceRequest.svc/GetProbleCodes";
                    $.postJSON(url, myJsonObject, function (data) {
                        if (data != null) {
                            if ($("#ProblemCodeDropDownList").val() == "-1") {
                                if ($("#ProblemCodeDropDownList option").size() > 1) {
                                    $("#ProblemCodeDropDownList option:gt(0)").remove();
                                }
                                for (index = 0; index < data.length; index++) {
                                    var dropdown = document.createElement("option");
                                    dropdown.setAttribute("value", data[index]["ProblemCodeNumber"]);
                                    dropdown.innerHTML = data[index]["ProblemDescription"];
                                    $("#ProblemCodeDropDownList").append(dropdown);
                                }
                            }

                            if ($("#ProblemCodeDropDownList option").length === 2) {
                                $("#ProblemCodeDropDownList").val($("#ProblemCodeDropDownList").find('option:eq(1)').val());
                            }
                            $("#ProblemCodeDropDownList").selectmenu("refresh");

                            if (!IsStringNullOrEmpty(getLocal("AutocompleteProblemCode"))) {
                                $("#ProblemCodeDropDownList").val(getLocal("AutocompleteProblemCode"));
                                $("#ProblemCodeDropDownList").selectmenu("refresh");
                            }
                            setLocal("AutocompleteProblemCode", null);

                            if ($("#ProblemCodeDropDownList").val() != null && $("#ProblemCodeDropDownList").val() != "-1") {
                                LoadGLAccountOnProblemCode();
                                //GetDefaultCostCenter();
                                setTimeout(function () {
                                    CheckForCASValues();
                                }, 2000);
                                checkForSelfHelp($("#ProblemCodeDropDownList").val());
                            }
                            //                    $("#ProblemCodeDropDownList").selectmenu("refresh");
                        }
                    });
                }
                break;
        }

        $('#ProblemCodeDropDownList').selectmenu();
        $('#EquipmentSubgroupDropDownList').selectmenu();
        $('#EquipmentGroupDropDownList').selectmenu();
    }
    else {
        setTimeout(function () {
            showErrorPopUp(true, noNetworkTranslation);
        }, 1000);
    }
}

//Method used to checking for self help.
function checkForSelfHelp(problemCodeNumber) {
    $.mobile.activePage.find("#selfHelpLabel").remove();
    $.mobile.activePage.find("#selfhelpurl").remove();
    $("#RequestServiceButton").removeClass("ui-disabled");

    if (problemCodeNumber != "-1") {
        var connectionStringURL = standardAddress + "GetMenuItems.svc/CheckForSelpHelp";
        var myJSONobject = {
            "workOrderTransfer": {
                "DatabaseId": decryptStr(getLocal("DatabaseID")),
                "Language": getLocal("Language"),
                "ProblemCodeNumber": problemCodeNumber,
                "CallerSeq": getLocal("seq"),
                "SessionId": decryptStr(getLocal("SessionId"))
            }
        };

        $.postJSON(connectionStringURL, myJSONobject, function (data) {
            if (!IsStringNullOrEmpty(data) && data.IsSelfHelp) {
                $("#trProblemCodes").append('<label id="selfHelpLabel" style="color:red;padding:7px;white-space: normal !important;">' + getTranslatedValue("SelfHelpLabel") + '</label>');
                $("#trProblemCodes").append('<a href="#" id="selfhelpurl" class="ui-link" style="padding:7px;" onclick="openURLInBrowser(\'' + data.SelfHelpURL + '\')">' + data.SelfHelpURL + '</a>');
                $("#RequestServiceButton").addClass("ui-disabled");
            }
        });
    }

    bindDefaultCostCenter();
    BindPriorityFromProblemCode(problemCodeNumber);
}


function BindPriorityFromProblemCode(problemCodeNumber) {

    if (navigator.onLine) {
        var myJSONobject = '';

        var connectionStringURL = standardAddress + "CreateServiceRequest.svc/GetPriorityForProblemCodeNew";

        if (problemCodeNumber != "-1") {

            myJSONobject =
                {
                    "workOrderTransfer":
                    {
                        "DatabaseId": decryptStr(getLocal("DatabaseID")),
                        "Language": getLocal("Language"),
                        "ProblemCodeNumber": problemCodeNumber,
                        "SessionId": decryptStr(getLocal("SessionId"))
                    }
                };

            $.postJSON(connectionStringURL, myJSONobject, function (data) {
                if (!IsStringNullOrEmpty(data)) {
                    var optionExists = ($("#PriorityDropdown option[value='" + data + "']").length > 0);

                    if (optionExists) {
                        $("#PriorityDropdown").val(data);
                    }
                    $("#PriorityDropdown").selectmenu("refresh");
                }
            });
        }
    }
}


function bindDefaultCostCenter() {
    if (navigator.onLine) {
        //alert(IsQuickLinksPage);
        var problemcodenumber;
        var customerNumber;
        var customerSiteNumber;

        if ($.mobile.activePage.attr("id") != "requestService") {
            if (!IsStringNullOrEmpty(getLocal("ProblemCodeNumber"))) {
                problemcodenumber = getLocal("ProblemCodeNumber");
            }
            else {
                if (!IsStringNullOrEmpty(decryptStr(getLocal("DefaultProblemCode")))) {
                    problemcodenumber = decryptStr(getLocal("DefaultProblemCode"));
                }
            }
        }
        else {
            problemcodenumber = $("#ProblemCodeDropDownList").val();
        }

        if (!IsStringNullOrEmpty($("#Level4DropDown").val()) && $("#Level4DropDown").val() != "0") {
            customerNumber = $("#Level4DropDown").val().split('ì')[0];
            customerSiteNumber = $("#Level4DropDown").val().split('ì')[1];
        } else {
            customerNumber = getLocal("CustomerNumber");
            customerSiteNumber = getLocal("CustomerSiteNumber");
        }

        var myJsonObject = {
            "workOrderTransfer": {
                "ProblemCodeNumber": problemcodenumber,
                "CustomerNumber": customerNumber,
                "CustomerSiteNumber": customerSiteNumber,
                "CallerSeq": getLocal("seq"),
                "DatabaseId": decryptStr(getLocal("DatabaseID")),
                "Culture": getLocal("Language"),
                "DatabaseName": decryptStr(getLocal("databaseName")),
                "SessionId": decryptStr(getLocal("SessionId"))
            }
        };

        var url = standardAddress + "CreateServiceRequest.svc/GetDefaultCostCenter";
        $.postJSON(url, myJsonObject, function (data) {

            if (!IsStringNullOrEmpty(data)) {
                if ($.mobile.activePage.find("#CostCenterTextBox")) {
                    $.mobile.activePage.find("#CostCenterTextBox").val(data);
                } else if ($.mobile.activePage.find("#CostCenterDropdown")) {
                    $.mobile.activePage.find("#CostCenterDropdown").val(data);
                    $("#CostCenterDropdown").selectmenu("refresh");
                }
            } else {
                if ($.mobile.activePage.find("#CostCenterTextBox")) {
                    $.mobile.activePage.find("#CostCenterTextBox").val('');
                } else if ($.mobile.activePage.find("#CostCenterDropdown")) {
                    $.mobile.activePage.find("#CostCenterDropdown").val("-1");
                    $("#CostCenterDropdown").selectmenu("refresh");
                }
            }

            //isProblemCodeBillableForBP();
        });
    }
    else {
        setTimeout(function () {
            showErrorPopUp(true, noNetworkTranslation);
        }, 1000);
    }
}


function isProblemCodeBillableForBP() {
    var problemcodenumber;
    var customerNumber;
    var customerSiteNumber;

    if ($.mobile.activePage.attr("id") != "requestService") {
        if (!IsStringNullOrEmpty(getLocal("ProblemCodeNumber"))) {
            problemcodenumber = getLocal("ProblemCodeNumber");
        }
        else {
            if (!IsStringNullOrEmpty(decryptStr(getLocal("DefaultProblemCode")))) {
                problemcodenumber = decryptStr(getLocal("DefaultProblemCode"));
            }
        }
    }
    else {
        problemcodenumber = $("#ProblemCodeDropDownList").val();
    }

    if (!IsStringNullOrEmpty($("#Level4DropDown").val()) && $("#Level4DropDown").val() != "0") {
        customerNumber = $("#Level4DropDown").val().split('ì')[0];
        customerSiteNumber = $("#Level4DropDown").val().split('ì')[1];
    } else {
        customerNumber = getLocal("CustomerNumber");
        customerSiteNumber = getLocal("CustomerSiteNumber");
    }

    var myJsonObject = {
        "dataBaseId": decryptStr(getLocal("DatabaseID")),
        "language": getLocal("Language"),
        "callerObject": {
            "CustomerNumber": customerNumber,
            "CustomerSiteNumber": customerSiteNumber
        },
        "workorderBE": { "ProblemCodeNumber": problemcodenumber, "Priority": $("#PriorityDropdown").val() },
        "cfgWebSiteObject": {
            "DefaultProblemCode": decryptStr(getLocal("DefaultProblemCode")),
            "DefaultAssnEmployee": decryptStr(getLocal("DefaultAssnEmployee")),
            "RequestStatus": decryptStr(getLocal("RequestStatus"))
        },
        "companyCoveredIsBillable": parseInt(decryptStr(getLocal("CompanyCoveredIsBillable"))),
        "databaseName": decryptStr(getLocal("databaseName"))
    };


    var url = standardAddress + "CreateServiceRequest.svc/IsProblemCodeBillable";
    $.postJSON(url, myJsonObject, function (data) {
        if (data != null) {
            if (!data) {
                if ($.mobile.activePage.find("#CostCenterTextBox")) {
                    $.mobile.activePage.find("#CostCenterTextBox").attr("data-required", "true");
                    $.mobile.activePage.find("#CostCenterMandatorySymbol").show();
                    $.mobile.activePage.find("#CostCenterMandatorySymbol").addClass("custMandatory");

                } else if ($.mobile.activePage.find("#CostCenterDropdown")) {
                    $.mobile.activePage.find("#CostCenterDropdown").attr("data-required", "true");
                    $.mobile.activePage.find("#CostCenterMandatorySymbol").show();
                    $.mobile.activePage.find("#CostCenterMandatorySymbol").addClass("custMandatory");
                }

                if ($.mobile.activePage.attr("id") == "requestService") {
                    showBillablePopUp(true, getTranslatedValue("ProblemCodeBillable"));
                }
            } else {
                if ($.mobile.activePage.find("#CostCenterTextBox")) {
                    $.mobile.activePage.find("#CostCenterTextBox").attr("data-required", "false");
                    $.mobile.activePage.find("#CostCenterMandatorySymbol").hide();
                    $.mobile.activePage.find("#CostCenterMandatorySymbol").removeClass("custMandatory");

                } else if ($.mobile.activePage.find("#CostCenterDropdown")) {
                    $.mobile.activePage.find("#CostCenterDropdown").attr("data-required", "false");
                    $.mobile.activePage.find("#CostCenterMandatorySymbol").hide();
                    $.mobile.activePage.find("#CostCenterMandatorySymbol").removeClass("custMandatory");
                }
            }
        }
    });
}


/// Function to load the problem code details.
function BindProblemCodeDetails(value) {
    if (navigator.onLine) {
        if ($("#ProblemCodeTextBox").val() != null && $("#ProblemCodeTextBox").val() != "") {
            if ($("#ProblemCodeAutoComplete").val() != null && $("#ProblemCodeAutoComplete").val() != "-1") {
                var myJsonObject = {
                    "databaseId": decryptStr(getLocal("DatabaseID")),
                    "workOrderBE": {
                        "ProblemCodeNumber": $("#ProblemCodeAutoComplete").val(),
                        "ScreenName": IsStringNullOrEmpty(getLocal("CRSForm")) ? "7" : getLocal("CRSForm")
                    },
                    "language": getLocal("Language"),
                    "databaseName": decryptStr(getLocal("databaseName"))
                };

                var url = standardAddress + "CreateServiceRequest.svc/GetProblemCodeDetails";
                $.postJSON(url, myJsonObject, function (data) {
                    if (data != null) {
                        if ($("#ProblemCodeAutoComplete option").size() > 1) {
                            //                        $("#ProblemCodeAutoComplete option:gt(0)").remove();
                        }
                        if (data.length > 0) {
                            if (data.length == 1) {
                                $("#EquipmentGroupDropDownList").val(data[0]["EquipGroupNumber"]);
                                $("#EquipmentGroupDropDownList").selectmenu("refresh");

                                BindEquipmentDetails("EquipmentSubgroupDropDownList");
                                setLocal("AutocompleteEquipSubGroup", data[0]["EquipStyleSeq"]);

                                setLocal("AutocompleteProblemCode", data[0]["ProblemCodeNumber"]);
                            }
                        }
                    }
                });
            }
        }
    }
    else {
        setTimeout(function () {
            showErrorPopUp(true, noNetworkTranslation);
        }, 1000);
    }
}

/// Function to change the problem code order based on configuration values.
function ChangeDropDownOrder(changeOrder) {
    if (navigator.onLine) {
        var groupDropDown = $("#EquipmentGroupDropDownList");
        var subGroupDropDown = $("#EquipmentSubgroupDropDownList");
        var problemDropDown = $("#ProblemCodeDropDownList");
        for (i = 0; i < $("#EquipmentList li").length; i++) {
            if (i == 3) {
                var firstRow = $('#EquipmentList li')[1];
                if ($('#EquipmentList li')[3].id == "trProblemCodes") {
                    var secondRow = $('#EquipmentList li')[3];
                    firstRow.parentNode.insertBefore(secondRow, firstRow);
                }
                $("#EquipmentSubgroupDropDownList").addClass('ui-state-disabled');
                $("#EquipmentGroupDropDownList").addClass('ui-state-disabled');
                break;
            }
        }
    }
    else {
        setTimeout(function () {
            showErrorPopUp(true, noNetworkTranslation);
        }, 1000);
    }
}

/// Loads the GL account CAS values associated with problem code on problem code selection.
function LoadGLAccountOnProblemCode() {
    if (navigator.onLine) {
        var AccountFrameGLAccountArray = new Array();
        var Label;
        for (index = 0; index < AccountFrameListArray.length; index++) {
            if (AccountFrameListArray[index]["Visible"] == true) {
                AccountFrameGLAccountArray.push(AccountFrameListArray[index]);
            }
        }

        for (i = 0; i < AccountFrameGLAccountArray.length; i++) {
            switch (AccountFrameGLAccountArray[i]["InputType"]) {
                case "TB":
                case "TA":
                case "TBN":
                case "TBC":
                case "TBP":
                    ////                if (accountFrameChildArray[i]["Label"].length - 1 != i - 1) {
                    ////                    if (AccountFrameGLAccountArray[i]["Label"][i]["LanguageAbbreviation"] == getLocal("Language")) {
                    ////                        Label = AccountFrameGLAccountArray[i]["Label"][i]["Description"];
                    ////                    }
                    ////                }

                    TextBoxValue = "#" + AccountFrameGLAccountArray[i]["ControlId"] + "TextBox";
                    switch (AccountFrameGLAccountArray[i]["ControlId"]) {
                        case "GLAccount":
                            GLAccountText = "#" + AccountFrameGLAccountArray[i]["ControlId"] + "TextBox";
                            var myJsonObject = {
                                "dataBaseId": decryptStr(getLocal("DatabaseID")),
                                "language": getLocal("Language"),
                                "callEntryTransferObject": { "ProblemCode": $("#ProblemCodeDropDownList").val() },
                                "databaseName": decryptStr(getLocal("databaseName"))
                            };

                            var url = standardAddress + "CreateServiceRequest.svc/GetGLAccount";
                            $.postJSON(url, myJsonObject, function (data) {
                                if (data != null) {
                                    $(GLAccountText).val(data["AltKey"]);
                                }
                            });
                    }
            }
        }
    }
    else {
        setTimeout(function () {
            showErrorPopUp(true, noNetworkTranslation);
        }, 1000);
    }
}

/// Validated the CAS value entry.
function CheckForCASValues() {
    if (navigator.onLine) {
        var AccountFrameCASArray1 = new Array();
        var Label;
        var TextBoxValue;
        var DropDownList;
        for (index = 0; index < AccountFrameListArray.length; index++) {
            if (AccountFrameListArray[index]["Visible"] == true) {
                AccountFrameCASArray1.push(AccountFrameListArray[index]);
            }
        }

        for (i = 0; i < AccountFrameCASArray1.length; i++) {
            switch (AccountFrameCASArray1[i]["InputType"]) {
                case "TB":
                case "TA":
                case "TBN":
                case "TBC":
                case "TBP":
                    TextBoxValue = "#" + AccountFrameCASArray1[i]["ControlId"] + "TextBox";
                    switch (AccountFrameCASArray1[i]["ControlId"]) {
                        case "GLAccount":
                            if (TextBoxValue != null && TextBoxValue != "") {
                                $(TextBoxValue).val($(GLAccountText).val());
                            }
                            break;
                        case "CostCenter":
                            TextBoxValue = "#" + AccountFrameCASArray1[i]["ControlId"] + "TextBox";
                            if (TextBoxValue != null && TextBoxValue != "") {
                                if (decryptStr(getLocal("MSIClientCode")) != null && decryptStr(getLocal("MSIClientCode")) != "") {
                                    if (decryptStr(getLocal("MSIClientCode")).toUpperCase() == "BP") {
                                        setTimeout(function () {
                                            //IsProblemCodeBillable
                                            isProblemCodeBillableForBP();
                                        }, 1000);
                                    }
                                    else {
                                        //if (getLocal("DefaultStringCostCenter") != null && getLocal("DefaultStringCostCenter") != "") {
                                        //$(TextBoxValue).val(getLocal("DefaultCostCenter"));
                                        $(TextBoxValue).val(getLocal("DefaultStringCostCenter"));
                                        //}
                                    }
                                }
                            }
                            break;
                    }
                case "DD":
                    DropDownList = "#" + AccountFrameCASArray1[i]["ControlId"] + "Dropdown";
                    switch (AccountFrameCASArray1[i]["ControlId"]) {
                        case "CostCenter":
                            if (DropDownList != null && DropDownList != "") {
                                if (decryptStr(getLocal("MSIClientCode")) != null && decryptStr(getLocal("MSIClientCode")) != "") {
                                    if (decryptStr(getLocal("MSIClientCode")).toUpperCase() == "BP") {
                                        //IsProblemCodeBillable();
                                        isProblemCodeBillableForBP();
                                    }
                                }

                                //LoadCostCenterDropDown(getLocal("DefaultCostCenter"), DropDownList)
                                (LoadCostCenterDropDown(getLocal("DefaultStringCostCenter"), DropDownList));
                            }
                            break;
                    }
                    break;
                case "ACB":
                    TextBoxValue = "#" + AccountFrameCASArray1[i]["ControlId"] + "TextBox";
                    if (TextBoxValue != null && TextBoxValue != "") {
                        if (decryptStr(getLocal("MSIClientCode")) != null && decryptStr(getLocal("MSIClientCode")) != "") {
                            if (decryptStr(getLocal("MSIClientCode")).toUpperCase() == "BP") {
                                setTimeout(function () {
                                    //IsProblemCodeBillable();
                                    isProblemCodeBillableForBP();
                                }, 1000);
                            }
                            else {
                                if (getLocal("DefaultCostCenter") != null && getLocal("DefaultCostCenter") != "") {
                                    $(TextBoxValue).val(getLocal("DefaultCostCenter"));
                                    $("#" + getLocal("AutoComplete")).val(getLocal("DefaultCostCenter"));
                                    $("#" + getLocal("AutoComplete")).selectmenu("refresh");
                                }
                            }
                        }

                    }
                    break;
            }
        }
    }
    else {
        setTimeout(function () {
            showErrorPopUp(true, noNetworkTranslation);
        }, 1000);
    }
}

/// Function to load the costcenter if CAS cost center control is dropdown.
function GetCostCenterDropdown() {
    if (navigator.onLine) {
        var problemCodeNumber;
        var url;
        if (getLocal("ProblemCodeNumber") != null && getLocal("ProblemCodeNumber") != "") {
            problemCodeNumber = getLocal("ProblemCodeNumber");
        }
        else {
            if ($("#ProblemCodeDropDownList").val() != null && $("#ProblemCodeDropDownList").val() != "-1") {
                problemCodeNumber = $("#ProblemCodeDropDownList").val();
            }
            else {
                if (decryptStr(getLocal("DefaultProblemCode")) != null && decryptStr(getLocal("DefaultProblemCode")) != "") {
                    problemCodeNumber = decryptStr(getLocal("DefaultProblemCode"));
                }
            }
        }
        var myJsonObject = {
            "databaseId": decryptStr(getLocal("DatabaseID")),
            "language": getLocal("Language"),
            "workOrderTransfer": {
                "ProblemCodeNumber": problemCodeNumber,
                "CustomerNumber": getLocal("CustomerNumber"),
                "CustomerSiteNumber": getLocal("CustomerSiteNumber"),
                "CallerSeq": getLocal("seq")
            },
            "databaseName": decryptStr(getLocal("databaseName"))
        };

        url = standardAddress + "CreateServiceRequest.svc/GetCostCenterDropdown";
        $.postJSON(url, myJsonObject, function (data) {
            if (data != null) {
                setLocal("DefaultStringCostCenter", data);
            }
        });
    }
    else {
        setTimeout(function () {
            showErrorPopUp(true, noNetworkTranslation);
        }, 1000);
    }
}

/// Loads cost center dropdown.
function LoadCostCenterDropDown(value, DropDownList) {
    if (navigator.onLine) {
        var myJsonObject = {
            "costCenterExtEntity": {
                "CustomerNumber": getLocal("CustomerNumber"),
                "CustomerSiteNumber": getLocal("CustomerSiteNumber"),
                "CostCenterDefaultValue": value
            },
            "databaseId": decryptStr(getLocal("DatabaseID")),
            "language": getLocal("Language"),
            "databaseName": decryptStr(getLocal("databaseName"))
        };

        var url = standardAddress + "CreateServiceRequest.svc/LoadCostCenterDropDown";
        $.postJSON(url, myJsonObject, function (data) {
            if (data != null) {
                var dropdown = document.createElement('option');
                dropdown.setAttribute("value", "-1");
                dropdown.innerHTML = "--Select--";
                $(DropDownList).empty();
                $(DropDownList).append(dropdown);
                for (index = 0; index < data.length; index++) {
                    var dropdown1 = document.createElement('option');
                    dropdown1.setAttribute("value", data[index]["CostCenter"]);
                    dropdown1.innerHTML = data[index]["CostCenter"];
                    $(DropDownList).append(dropdown1);
                }

                $(DropDownList).selectmenu("refresh");
                if (value != null && value != "") {
                    $(DropDownList).val(value);
                    $(DropDownList).selectmenu("refresh");
                }
                else {
                    $(DropDownList).val("-1");
                    $(DropDownList).selectmenu("refresh");
                }
            }
        });
    }
    else {
        setTimeout(function () {
            showErrorPopUp(true, noNetworkTranslation);
        }, 1000);
    }
}

/// Binds the cost center autocomplete box with default value.
function BindAutoCompleteTextbox(value) {
    $("#" + value.attributes["data-input"].value).val(value.value);
}

/// Disables the location dropdown based on configuration.
function DisableDropDowns() {
    if (navigator.onLine) {
        $("#SearchLabel").addCalss('ui-disabled');
        $("#SearchTextBox").addCalss('ui-disabled');
        $("#CategoryLabel").addCalss('ui-disabled');
        $("#CategoryDropDown").addCalss('ui-disabled');
        $("#Level1DropDownMandatorySymbol").hide();
        $("#Level1DropDown").addClass('ui-disabled');
        $("#Level2DropDownMandatorySymbol").hide();
        $("#Level2DropDown").addClass('ui-disabled');
        $("#Level3DropDownMandatorySymbol").hide();
        $("#Level3DropDown").addClass('ui-disabled');
        $("#Level4DropDownMandatorySymbol").hide();
        $("#Level4DropDown").addClass('ui-disabled');
        $("#LocationTextBox").addClass('ui-disabled');
    }
    else {
        setTimeout(function () {
            showErrorPopUp(true, noNetworkTranslation);
        }, 1000);
    }
}

/// Binds the recently created orders.
function RecentRequestsTable() {
    if (navigator.onLine) {
        var filterStatus;
        var selectview;
        if (decryptStr(getLocal("SRRecentReqStatus")) != null && decryptStr(getLocal("SRRecentReqStatus")) != "") {
            filterStatus = decryptStr(getLocal("SRRecentReqStatus"));
        }

        selectview = 0;

        if (!IsStringNullOrEmpty(decryptStr(getLocal("SRRecentReqOpenOnly")))) {
            if (decryptStr(getLocal("SRRecentReqOpenOnly")).toLowerCase() == "true") {
                selectview = 1;
            }
        }

        var myJsonObject = {
            "databaseId": decryptStr(getLocal("DatabaseID")),
            "language": getLocal("Language"),
            "workorderTransferBE": {
                "SelectedView": selectview,
                "RegionNumber": $("#Level1DropDown").val(),
                "DivisionNumber": $("#Level2DropDown").val(),
                "DistrictNumber": $("#Level3DropDown").val(),
                "CustomerSiteNumber": IsStringNullOrEmpty($("#Level4DropDown").val()) ? "" : $("#Level4DropDown").val().split('ì')[1],
                "Status": filterStatus
            },
            "databaseName": decryptStr(getLocal("databaseName"))
        };

        var url = standardAddress + "CreateServiceRequest.svc/GetRecentRequests";

        $.ajax({
            type: "POST",
            url: url,
            data: JSON.stringify(myJsonObject),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {

                if (data != null) {
                    if (data.length > 0) {
                        var menuData = JSON.parse(data);
                        for (var i = 0; i < menuData.length; i++) {
                            $(".recentRequestListView").append('<li>'
                                + '<h2 class="custMargin">' + menuData[i].WorkOrderNumber + ' </h2>'
                                + '<p><strong>' + getTranslatedValue("StatusGridHeader") + ' - ' + (IsStringNullOrEmpty(menuData[i].Status) ? "" : menuData[i].Status) + '</strong></p>'
                                + '<p><strong>' + getTranslatedValue("CallLogGridHeader") + ': ' + (IsStringNullOrEmpty(menuData[i].CallLogNumber) ? "" : menuData[i].CallLogNumber) + '</strong></p>'
                                + '<p>' + getTranslatedValue("DateGridHeader") + ': ' + (IsStringNullOrEmpty(menuData[i].DateEnteredSiteString) ? "" : menuData[i].DateEnteredSiteString) + ' ' + (IsStringNullOrEmpty(data[i].TimeZone) ? "" : data[i].TimeZone) + '</p>'
                                + '<p>' + getTranslatedValue("PriorityGridHeader") + ': ' + (IsStringNullOrEmpty(menuData[i].Priority) ? "" : menuData[i].Priority) + '</p>'
                                + '<p><font style="white-space:normal !important;">' + getTranslatedValue("ProblemGridHeader") + ': ' + (IsStringNullOrEmpty(menuData[i].ProblemDescription) ? "" : (menuData[i].ProblemDescription.length > 100 ? menuData[i].ProblemDescription.substring(0, 100) : menuData[i].ProblemDescription)) + '</font></p>'
                                + '</li>').listview('refresh');
                        }
                    }
                    else {
                        $(".recentRequestListView").append('<li>' +
                            '<label>' + ((decryptStr(getLocal("MSIClientCode")) === "IO") ? getTranslatedValue("noRecentRequestLabelIO") : getTranslatedValue("noRecentRequestLabel")) + '</label>' + '</li>').listview('refresh');
                    }
                }
                checkDisabledDropDowns();
                hideImage();
            },
            error: function (data) {

                hideImage();
                var errorMessge = data.responseText.split('See')[0];
                var errorMessge2 = errorMessge.substr(errorMessge.indexOf("exception") + 23, (errorMessge.length - errorMessge.indexOf("exception") - 27))
                if (errorMessge2 != '') {
                    if (!isNaN(errorMessge2.substr(0, 1))) {
                        showErrorPopUp(true, errorMessge2.substr(1, errorMessge2.length));
                    }
                    else {
                        showErrorPopUp(true, errorMessge2);
                    }
                }
                return;
            }
        });
    } else {
        setTimeout(function () {
            showErrorPopUp(true, noNetworkTranslation);
        }, 1000);
    }
}
//<a href="#" onclick="woDetail(\'' + data[i].WorkOrderNumber + '\')" data-corners="false" id="menu' + i + '">'</a>
/// Stores the location dropdown values.
function StoreDropDownValues() {
    $("#hiddenLevel1Dropdown").val($("#Level1DropDown").val());
    $("#hiddenLevel2Dropdown").val($("#Level2DropDown").val());
    $("#hiddenLevel3Dropdown").val($("#Level3DropDown").val());
    $("#hiddenLevel4Dropdown").val($("#Level4DropDown").val());
    $("#hiddenLocation").val($("#LocationTextBox").val());
    $("#hiddenPriorityValue").val($("#PriorityDropdown").val());
}

/// Loacks the location dropdown levels for users based on configuration item.
function LockLevels() {
    if (decryptStr(getLocal("LockTopThreeLevels")) != null && decryptStr(getLocal("LockTopThreeLevels")) != "") {
        if (decryptStr(getLocal("LockTopThreeLevels")).toLowerCase() == "true") {
            $("#Level1DropDown").attr('readonly', true);
            $("#Level1DropDown").parent().addClass("ui-select ui-btn-disabled");
            //$("#Level1DropDown").addClass("ui-select ui-btn dropdownDisabled");
            //$("#Level1DropDown").css("opacity", "0.8");

            $("#Level2DropDown").attr("readonly", true);
            $("#Level2DropDown").parent().addClass("ui-select ui-btn-disabled");
            //$("#Level2DropDown").css("opacity", "0.8");

            $("#Level3DropDown").attr("readonly", true);
            $("#Level3DropDown").parent().addClass("ui-select ui-btn-disabled");
            //$("#Level3DropDown").css("opacity", "0.8");

        }
    }

    if (decryptStr(getLocal("LockTopTwoLevels")) != null && decryptStr(getLocal("LockTopTwoLevels")) != "") {
        if (decryptStr(getLocal("LockTopTwoLevels")).toLowerCase() == "true") {
            $("#Level1DropDown").attr("readonly", true);
            $("#Level1DropDown").parent().addClass("ui-select ui-btn-disabled");
            //$("#Level1DropDown").css("opacity", "0.8");

            $("#Level2DropDown").attr("readonly", true);
            $("#Level2DropDown").parent().addClass("ui-select ui-btn-disabled");
            //$("#Level2DropDown").css("opacity", "0.8");
        }
    }

    if (decryptStr(getLocal("LockLevelsForLockedProfile")) != null && decryptStr(getLocal("LockLevelsForLockedProfile")) != "") {
        if (decryptStr(getLocal("LockLevelsForLockedProfile")).toLowerCase() == "true") {
            $("#Level1DropDown").attr("readonly", true);
            $("#Level1DropDown").parent().addClass("ui-select ui-btn-disabled");
            //$("#CategoryDropDown").parent().parent().addClass('ui-disabled');

            $("#Level1DropDown").attr("readonly", true);
            $("#Level1DropDown").parent().addClass("ui-select ui-btn-disabled");
            //$("#Level1DropDown").css("opacity", "0.8");

            $("#Level2DropDown").attr("readonly", true);
            $("#Level2DropDown").parent().addClass("ui-select ui-btn-disabled");
            //$("#Level2DropDown").css("opacity", "0.8");

            $("#Level3DropDown").attr("readonly", true);
            $("#Level3DropDown").parent().addClass("ui-select ui-btn-disabled");
            //$("#Level3DropDown").css("opacity", "0.8");

            $("#Level4DropDown").attr("readonly", true);
            $("#Level4DropDown").parent().addClass("ui-select ui-btn-disabled");
            //$("#Level4DropDown").css("opacity", "0.8");
        }
    }

}


/// Gets the site label values for loaction dropdowns.
function SetSiteLabels() {
    if (navigator.onLine) {
        $("#Level1Label").html('<label id="Level1DropDownMandatorySymbol" class="custMandatory" style="color:red">*</label>' + getLocal("Level1") + ":");
        $("#Level2Label").html('<label id="Level2DropDownMandatorySymbol" class="custMandatory" style="color:red">*</label>' + getLocal("Level2") + ":");
        $("#Level3Label").html('<label id="Level3DropDownMandatorySymbol" class="custMandatory" style="color:red">*</label>' + getLocal("Level3") + ":");
        $("#Level4Label").html('<label id="Level4DropDownMandatorySymbol" class="custMandatory" style="color:red">*</label>' + getLocal("Level4") + ":");

        var categoryDropdown = '<option value = "-1">' + getTranslatedValue("selectOption") + '</option><option value = "1">' + getLocal("Level1") + '</option>' +
            '<option value = "2">' + getLocal("Level2") + '</option><option value = "3">' + getLocal("Level3") + '</option><option value = "4">' + getLocal("Level4") + '</option>';

        $("#CategoryDropDown").append(categoryDropdown);
        $("#CategoryDropDown").selectmenu("refresh");

        if (decryptStr(getLocal("LockTopThreeLevels")) != null && decryptStr(getLocal("LockTopThreeLevels")) != "") {
            if (decryptStr(getLocal("LockTopThreeLevels")).toLowerCase() == "true") {
                $("#CategoryDropDown option[value='0']").remove();
                $('#CategoryDropDown').selectmenu('refresh');
                $("#CategoryDropDown option[value='1']").remove();
                $('#CategoryDropDown').selectmenu('refresh');
                $("#CategoryDropDown option[value='2']").remove();
                $('#CategoryDropDown').selectmenu('refresh');
                $("#CategoryDropDown").val('3');
                $('#CategoryDropDown').selectmenu('refresh');
            }
        }

        if (decryptStr(getLocal("LockTopTwoLevels")) != null && decryptStr(getLocal("LockTopTwoLevels")) != "") {
            if (decryptStr(getLocal("LockTopTwoLevels")).toLowerCase() == "true") {
                $("#CategoryDropDown option[value='0']").remove();
                $('#CategoryDropDown').selectmenu('refresh');
                $("#CategoryDropDown option[value='1']").remove();
                $('#CategoryDropDown').selectmenu('refresh');
                $("#CategoryDropDown").val('2');
                $('#CategoryDropDown').selectmenu('refresh');
            }
        }
    }
    else {
        setTimeout(function () {
            showErrorPopUp(true, noNetworkTranslation);
        }, 1000);
    }
}


/// Function to check if problem code seleted is billable or not.
function IsProblemCodeBillable() {
    if (navigator.onLine) {
        var problemcodenumber;
        var required = false;
        if (!IsStringNullOrEmpty($("#ProblemCodeAutoComplete").val())) {
            problemcodenumber = $("#ProblemCodeAutoComplete").val();
        }
        else {
            if (!IsStringNullOrEmpty(getLocal("ProblemCodeNumber"))) {
                problemcodenumber = getLocal("ProblemCodeNumber");
            }
        }

        var isBillableMessage = getTranslatedValue("ProblemCodeBillable");
        var levelsChanged = false;
        var allowLevelsUpdate = decryptStr(getLocal("UpdateLevelFromCRS"));
        if (getLocal("RegionNumber") == $("#Level1DropDown").val() &&
            getLocal("DivisionNumber") == $("#Level2DropDown").val() &&
            getLocal("DistrictNumber") == $("#Level3DropDown").val() &&
            (getLocal("CustomerNumber") + 'ì' + getLocal("CustomerSiteNumber")) == $("#Level4DropDown").val() &&
            getLocal("LocationDetail") == $("#LocationTextBox").text()) {
            levelsChanged = false;
        }
        else {
            levelsChanged = true;
        }

        //    setTimeout(function () {
        if (allowLevelsUpdate && levelsChanged) {
            var myJsonObject = {
                "dataBaseId": decryptStr(getLocal("DatabaseID")),
                "language": getLocal("Language"),
                "callerObject": {
                    "Level1": $("#Level1DropDown").val(),
                    "Level2": $("#Level2DropDown").val(),
                    "Level3": $("#Level3DropDown").val(),
                    "Level4": $("#Level4DropDown").val(),
                    "CustomerNumber": getLocal("CustomerNumber"),
                    "CustomerSiteNumber": getLocal("CustomerSiteNumber"),
                    "Seq": getLocal("seq")
                },
                "databaseName": decryptStr(getLocal("databaseName"))
            };

            var url = standardAddress + "CreateServiceRequest.svc/GetLevelChanges";
            $.postJSON(url, myJsonObject, function (data) {
                if (data != null) {
                    if (data["Description"] == $("#Level4DropDown").text() || data["DistrictNumber"] == $("#Level3DropDown").val()) {
                        if (getLocal("updateCallerProfile") != null && getLocal("updateCallerProfile") != "" && getLocal("updateCallerProfile") != undefined) {
                            if (getLocal("updateCallerProfile").toLowerCase() == "true") {
                                setLocal("CustomerNumber") = data["CustomerNumber"];
                                setLocal("CustomerSiteNumber") = data["CustomerSiteNumber"];
                            }
                        }
                    }
                }
            });
        }
        else if (!allowLevelsUpdate && levelsChanged) {
            isBillableMessage = getTranslatedValue("LevelsUpdateNotAllowed");
            showErrorPopUp(true, isBillableMessage);
            return false;
        }
        //    }, 4000);

        var myJsonObject = {
            "dataBaseId": decryptStr(getLocal("DatabaseID")),
            "language": getLocal("Language"),
            "callerObject": {
                "CustomerNumber": getLocal("CustomerNumber"),
                "CustomerSiteNumber": getLocal("CustomerSiteNumber")
            },
            "workorderBE": { "ProblemCodeNumber": problemcodenumber, "Priority": $("#PriorityDropdown").val() },
            "cfgWebSiteObject": {
                "DefaultProblemCode": decryptStr(getLocal("DefaultProblemCode")),
                "DefaultAssnEmployee": decryptStr(getLocal("DefaultAssnEmployee")),
                "RequestStatus": decryptStr(getLocal("RequestStatus"))
            },
            "companyCoveredIsBillable": parseInt(decryptStr(getLocal("CompanyCoveredIsBillable"))),
            "databaseName": decryptStr(getLocal("databaseName"))
        };

        var AccountFrameCASArray = new Array();
        for (index = 0; index < AccountFrameListArray.length; index++) {
            if (AccountFrameListArray[index]["Visible"] == true) {
                AccountFrameCASArray.push(AccountFrameListArray[index]);
            }
        }

        var CostCenterTextValue;
        var Label;
        var index;
        var TextBoxValue;
        for (i = 0; i < AccountFrameCASArray.length; i++) {
            switch (AccountFrameCASArray[i]["InputType"]) {
                case "TB":
                case "TA":
                case "TBN":
                case "TBC":
                case "TBP":
                    if (AccountFrameCASArray[i]["ControlId"] == "CostCenter") {
                        index = i;
                        if (AccountFrameCASArray[index]["Required"] == true) {
                            required = true;
                            Label = "#" + AccountFrameCASArray[index]["ControlId"] + "MandatorySymbol";
                        }

                        TextBoxValue = "#" + AccountFrameCASArray[i]["ControlId"] + "TextBox";
                    }

                    break;
            }
        }

        var url = standardAddress + "CreateServiceRequest.svc/IsProblemCodeBillable";
        $.postJSON(url, myJsonObject, function (data) {
            if (data != null) {
                if (data == true) {
                    if (index != null) {
                        if (required == true) {
                            if (Label != null) {
                                $(Label).show();
                                $(TextBoxValue).attr("data-required", "true");
                                isBillableMessage = getTranslatedValue("ProblemCodeBillable");
                                showErrorPopUp(true, isBillableMessage);
                                return false;
                            }
                            else {
                                $(Label).hide();
                                $(TextBoxValue).attr("data-required", "false");
                            }
                        }
                    }
                }
            }
        });
    }
    else {
        setTimeout(function () {
            showErrorPopUp(true, noNetworkTranslation);
        }, 1000);
    }
}

function ResetData() {
    if (navigator.onLine) {
        loadingImage();
        GetCostCenterDropdown();
        BuildCASFrame();

        setTimeout(function () {
            $('#ContractDropDown').val(getLocal("FilterSeq"));
            $('#ContractDropDown').selectmenu('refresh');
            $('#ContractDivCollapsable .ui-collapsible-heading-toggle').text(getTranslatedValue("ContractCollapsible") + " - " + $('#ContractDropDown option:selected').text());
        }, 300);
        
        $('#dynamicCASItemslist').empty();
        $("#DescriptionText").val("");
        $.mobile.activePage.find("#selfHelpLabel").remove();
        $.mobile.activePage.find("#selfhelpurl").remove();
        $("#RequestServiceButton").removeClass("ui-disabled");
        checkResetinRequestService = true;
        //    $('#Collapsible2 .ui-collapsible-heading-toggle').text(getTranslatedValue("LocationInfoLabel"));
        if (!IsStringNullOrEmpty(decryptStr(localStorage.getItem("EmailAddress")))) {
            $("#ProfileNameValue").html(decryptStr(localStorage.getItem("EmailAddress")));
        }
        else {
            $("#ProfileNameValue").html("");
        }

        if (!IsStringNullOrEmpty(decryptStr(localStorage.getItem("Username")))) {
            $("#CallerNameValue").val(decryptStr(localStorage.getItem("Username")));
            $("#ContactNameValue").val(decryptStr(localStorage.getItem("Username")));
            if (!IsStringNullOrEmpty($("#PhoneNumberValue").val())) {
                $('#Collapsible1 .ui-collapsible-heading-toggle').text(getTranslatedValue("AccountInfoLabel") + "-" + $("#CallerNameValue").val() + "," + $("#PhoneNumberValue").val());
            }
            else {
                $('#Collapsible1 .ui-collapsible-heading-toggle').text(getTranslatedValue("AccountInfoLabel") + "-" + $("#CallerNameValue").val());
            }
        }
        else {
            $("#CallerNameValue").val("");
            $("#ContactNameValue").val("");
        }

        if (!IsStringNullOrEmpty(localStorage.getItem("SitePhone"))) {
            $("#ContactPhoneValue").val(localStorage.getItem("SitePhone"));
        }
        else {
            $("#ContactPhoneValue").val("");
        }

        if (!IsStringNullOrEmpty(localStorage.getItem("PhoneNumber"))) {
            $("#PhoneNumberValue").val(localStorage.getItem("PhoneNumber"));
            if (!IsStringNullOrEmpty($("#ContactNameValue").val())) {
                $('#Collapsible1 .ui-collapsible-heading-toggle').text(getTranslatedValue("AccountInfoLabel") + "-" + $("#CallerNameValue").val() + "," + $("#PhoneNumberValue").val());
            }
            else {
                $('#Collapsible1 .ui-collapsible-heading-toggle').text(getTranslatedValue("AccountInfoLabel") + "-" + $("#PhoneNumberValue").val());
            }
        }
        else {
            $("#PhoneNumberValue").val("");
            if (!IsStringNullOrEmpty($("#ContactNameValue").val())) {
                $('#Collapsible1 .ui-collapsible-heading-toggle').text(getTranslatedValue("AccountInfoLabel") + "-" + $("#CallerNameValue").val());
            }
            else {
                $('#Collapsible1 .ui-collapsible-heading-toggle').text(getTranslatedValue("AccountInfoLabel"));
            }
        }

        if (!IsStringNullOrEmpty(localStorage.getItem("LocationDetail"))) {
            $("#LocationTextBox").val(localStorage.getItem("LocationDetail"));
        }
        else {
            $("#LocationTextBox").val("");
        }

        if (!IsStringNullOrEmpty($("#hiddenPriorityValue").val())) {
            $("#PriorityDropdown").val($("#hiddenPriorityValue").val());
            $("#PriorityDropdown").selectmenu('refresh');
        }

        if (!IsStringNullOrEmpty(getLocal("RegionNumber"))) {
            if (!IsStringNullOrEmpty(getLocal("LatLongRegionNumberForServiceReq"))) {
                var status = false;
                if (getLocal("FilterLevel1DropDown") === "1") {
                    $('#Level1DropDown option').each(function () {
                        if (this.value == getLocal("LatLongRegionNumberForServiceReq")) {
                            status = true;
                        }
                    });
                }
                else {
                    status = true;
                }

                if (status == true) {
                    $('#Level1DropDown').val(getLocal("LatLongRegionNumberForServiceReq")).selectmenu('refresh');
                }
                else {
                    $('#Level1DropDown').val("-1").selectmenu('refresh');
                }
            }
            else {
                var status = false;
                if (getLocal("FilterLevel1DropDown") === "1") {
                    $('#Level1DropDown option').each(function () {
                        if (this.value == getLocal("RegionNumber")) {
                            status = true;
                        }
                    });
                    if (status == true) {
                        $('#Level1DropDown').val(getLocal("RegionNumber")).selectmenu('refresh');
                    }
                    else {
                        //$('#Level1DropDown').val("0").selectmenu('refresh');
                        $("#Level1DropDown option:eq(1)").attr("selected", "selected");
                        $("#Level1DropDown").selectmenu('refresh');
                    }
                }
                else {
                    $('#Level1DropDown').val(getLocal("RegionNumber")).selectmenu('refresh');
                }
            }

            //$('#Level1DropDown').empty();
            //$('#Level1DropDown').append(getLocal("Level1DropDown"));           
        }

        if (!IsStringNullOrEmpty(getLocal("DivisionNumber"))) {
            $('#Level2DropDown').empty();
            $('#Level2DropDown').append(getLocal("Level2DropDown"));
            if (!IsStringNullOrEmpty(getLocal("LatLongDivisionNumberForServiceReq"))) {
                var status = false;
                if (getLocal("FilterLevel1DropDown") === "1") {
                    $('#Level2DropDown option').each(function () {
                        if (this.value == getLocal("LatLongDivisionNumberForServiceReq")) {
                            status = true;
                        }
                    });
                }
                else {
                    status = true;
                }

                if (status == true) {
                    $('#Level2DropDown').val(getLocal("LatLongDivisionNumberForServiceReq")).selectmenu('refresh');
                }
                else {
                    $("#Level2DropDown option:eq(1)").attr("selected", "selected");
                    $("#Level2DropDown").selectmenu('refresh');
                }
            }
            else {
                var status = false;
                if (getLocal("FilterLevel1DropDown") === "1") {
                    $('#Level2DropDown option').each(function () {
                        if (this.value == getLocal("DivisionNumber")) {
                            status = true;
                        }
                    });
                }
                else {
                    status = true;
                }

                if (status == true) {
                    $('#Level2DropDown').val(getLocal("DivisionNumber")).selectmenu('refresh');
                }
                else {
                    $('#Level2DropDown').val("-1").selectmenu('refresh');
                    //                    $("#Level2DropDown option:eq(1)").attr("selected", "selected");
                    //                    $("#Level2DropDown").selectmenu('refresh');
                }
            }
        }

        if (!IsStringNullOrEmpty(getLocal("DistrictNumber"))) {
            $('#Level3DropDown').empty();
            $('#Level3DropDown').append(getLocal("Level3DropDown"));
            if (!IsStringNullOrEmpty(getLocal("LatLongDivisionNumberForServiceReq")) && !IsStringNullOrEmpty(getLocal("LatLongRegionNumberForServiceReq"))) {
                $("#Level3DropDown option:eq(1)").attr("selected", "selected");
                $("#Level3DropDown").selectmenu('refresh');
            }
            else {
                var status = false;
                if (getLocal("FilterLevel1DropDown") === "1") {
                    $('#Level3DropDown option').each(function () {
                        if (this.value == getLocal("DistrictNumber")) {
                            status = true;
                        }
                    });
                }
                else {
                    status = true;
                }

                if (status == true) {
                    $('#Level3DropDown').val(getLocal("DistrictNumber")).selectmenu('refresh');
                }
                else {
                    //$('#Level3DropDown').val("0").selectmenu('refresh');
                    $("#Level3DropDown option:eq(1)").attr("selected", "selected");
                    $("#Level3DropDown").selectmenu('refresh');
                }
            }
        }

        if (!IsStringNullOrEmpty(getLocal("CustomerSiteNumber"))) {
            $('#Level4DropDown').empty();
            $('#Level4DropDown').append(getLocal("Level4DropDown"));
            if (!IsStringNullOrEmpty(getLocal("LatLongDivisionNumberForServiceReq")) && !IsStringNullOrEmpty(getLocal("LatLongRegionNumberForServiceReq"))) {
                $("#Level4DropDown option:eq(1)").attr("selected", "selected");
                $("#Level4DropDown").selectmenu('refresh');
            }
            else {
                var status = false;
                if (getLocal("FilterLevel1DropDown") === "1") {
                    $('#Level4DropDown option').each(function () {
                        if (this.value == getLocal("CustomerSiteNumber")) {
                            status = true;
                        }
                    });
                }
                else {
                    status = true;
                }

                if (status == true) {
                    $('#Level4DropDown').val(getLocal("CustomerSiteNumber")).selectmenu('refresh');
                }
                else {
                    $("#Level4DropDown option:eq(1)").attr("selected", "selected");
                    $("#Level4DropDown").selectmenu('refresh');
                }
            }
        }

        // GetServiceRequestDetails();

        if ($("#EquipmentGroupDropDownList").val() != "-1" || $("#EquipmentSubgroupDropDownList").val() != "-1" || $("#ProblemCodeDropDownList").val() != "-1") {
            $("#EquipmentGroupDropDownList").val("-1").selectmenu('refresh');
            $("#EquipmentSubgroupDropDownList").val("-1").selectmenu('refresh');
            $("#ProblemCodeDropDownList").val("-1").selectmenu('refresh');
            $("#ProblemCodeAutoComplete").val("-1").selectmenu('refresh');
            $("#ProblemCodeTextBox").val('');
        }
        if ($('#Level1DropDown').val() != 0 && $('#Level2DropDown').val() != 0 && $('#Level3DropDown').val() != 0) {
            $('#Collapsible2 .ui-collapsible-heading-toggle').text(locationInfo + " - " + $('#Level2DropDown option:selected').text() + "/ " + $('#Level3DropDown option:selected').text());
        }
        else if ($('#Level1DropDown').val() != 0 && $('#Level2DropDown').val() != 0) {
            $('#Collapsible2 .ui-collapsible-heading-toggle').text(locationInfo + " - " + $('#Level2DropDown option:selected').text());
        }
        else {
            $('#Collapsible2 .ui-collapsible-heading-toggle').text(locationInfo);
        }
        setTimeout(function () {
            hideImage();
        }, 1000);
    }
    else {
        setTimeout(function () {
            showErrorPopUp(true, noNetworkTranslation);
        }, 1000);
    }
}

function BindLevel2DataDropDown() {
    if (navigator.onLine) {
        checkResetinRequestService = false;
        isLevelsChanged = true;
        BindLevel2Data();
    }
    else {
        setTimeout(function () {
            showErrorPopUp(true, noNetworkTranslation);
        }, 1000);
    }
}

function PromtUser(value) {
    hideImage();
    $("#AlertMessageLabel").text(getTranslatedValue("PromptMessage"));
    LevelChangedError = confirm(getTranslatedValue("PromptMessage"));
    return false;
}


/******Service Request Detail page ***/
function serviceReqDetail() {
    getLocal("woID");
    console.log(getLocal("woID"));
    $("#serviceDetailTable").html('');
    var woID = getLocal("woID");
    var dbID = decryptStr(getLocal("DatabaseID"));
    var dbName = decryptStr(getLocal("databaseName"));
    var seqID = getLocal("seq");
    var connectionStringURL = standardAddress + "ViewWorkOrderDetail.svc/ViewWorkOrder";
    var myJSONobject = {
        "worderNum": woID,
        "databaseID": dbID,
        "intFilter": "0",
        "seq": seqID,
        "databaseName": dbName,
        "language": getLocal("Language"),
        "sessionId": decryptStr(getLocal("SessionId"))
    };
    var woID = getLocal("woID");
    $("#FeedbackSuccessfulLabel").text(woID);
    if (navigator.onLine) {
        $.ajax({
            type: "POST",
            url: connectionStringURL,
            data: JSON.stringify(myJSONobject),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                $('#serviceDetailTable').html('');
                var menuData = JSON.parse(data);

                var genInfo = '<tr><td class="left-block">' + getTranslatedValue("iCRSNameLabel") + '</td><td class="right-block">' + (IsStringNullOrEmpty(menuData.WorkOrderDetailsCollection[0].RequestedBy) ? "" : menuData.WorkOrderDetailsCollection[0].RequestedBy) + '</td></tr>' +
                    '<tr><td class="left-block">' + getTranslatedValue("iCRSPhoneLabel") + '</td><td class="right-block">' + (IsStringNullOrEmpty(menuData.WorkOrderDetailsCollection[0].LocationPhone) ? "" : menuData.WorkOrderDetailsCollection[0].LocationPhone) + '</td></tr>' +
                    '<tr><td class="left-block">' + getLocal("Level1") + '</td><td class="right-block">' + (IsStringNullOrEmpty(menuData.CountryCity) ? "" : menuData.CountryCity) + '</td></tr>' +
                    '<tr><td class="left-block">' + getLocal("Level2") + '</td><td class="right-block">' + (IsStringNullOrEmpty(menuData.Building) ? "" : menuData.Building) + '</td></tr>' +
                    '<tr><td class="left-block">' + getLocal("Level3") + '</td><td class="right-block">' + (IsStringNullOrEmpty(menuData.Floor) ? "" : menuData.Floor) + '</td></tr>' +
                    '<tr><td class="left-block">' + getLocal("Level4") + '</td><td class="right-block">' + (IsStringNullOrEmpty(menuData.Area) ? "" : menuData.Area) + '</td></tr>' +
                    '<tr><td class="left-block">' + getTranslatedValue("iCRSLocationLabel") + '</td><td class="right-block">' + (IsStringNullOrEmpty(menuData.WorkOrderDetailsCollection[0].LocationDetails) ? "" : menuData.WorkOrderDetailsCollection[0].LocationDetails) + '</td></tr>' +
                    '<tr><td class="left-block">' + getTranslatedValue("iCRSProblemLabel") + '</td><td class="right-block">' + (IsStringNullOrEmpty(menuData.WorkOrderDetailsCollection[0].ProblemDescription) ? "" : menuData.WorkOrderDetailsCollection[0].ProblemDescription) + '</td></tr>';

                $("#serviceDetailTable").append(genInfo);
                hideImage();
            },
            error: function (data) {

                hideImage();
                var errorMessge = data.responseText.split('See')[0];
                var errorMessge2 = errorMessge.substr(errorMessge.indexOf("exception") + 23, (errorMessge.length - errorMessge.indexOf("exception") - 27))
                if (errorMessge2 != '') {
                    if (!isNaN(errorMessge2.substr(0, 1))) {
                        showErrorPopUp(true, errorMessge2.substr(1, errorMessge2.length));
                    }
                    else {
                        showErrorPopUp(true, errorMessge2);
                    }
                }
                return;
            }
        });
    } else {
        setTimeout(function () {
            showErrorPopUp(true, noNetworkTranslation);
        }, 1000);
    }
}


function checkAddAttachemnt() {
    if ($('#addAttachmentCheckBox').is(":checked")) {
        $('#addAttachemntContainer').show();
    }
    else {
        $('#addAttachemntContainer').hide();
        $('#clearAttachmentSource').hide();
        $('#smallImage').attr("src", "");
        $("#selectedImageDiv").hide();
    }
}

function GetSubBusinessDropDown(value) {
    var businessControlID = "#" + value.id;
    if ($(businessControlID).is('[data-required]')) {
        if (value.attributes["data-required"].value == "true") {
            validateBusinessRequired = true;
        }
    }

    business = $(businessControlID).val();
    var url = standardAddress + "CreateServiceRequest.svc/GetBusinessDropDown";
    var myJsonObject = {
        "databaseID": decryptStr(getLocal("DatabaseID")), "language": getLocal("Language"), "databaseName": decryptStr(getLocal("databaseName")),
        "businessTransfer": { "LevelType": 5, "SearchString": $(businessControlID).val() }
    };

    $("#SubBusinessDropdown").val("-1");
    $("#SubBusinessDropdown").selectmenu('refresh');

    $.ajax({
        type: "POST",
        url: url,
        async: 'false',
        data: JSON.stringify(myJsonObject),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            //console.log(data);
            var menuData = JSON.parse(data);
            if (menuData != null) {
                $("#SubBusinessDropdown option:gt(0)").remove();
                for (var val in menuData) {
                    $('<option />', { value: menuData[val]["SubBusiness"], text: menuData[val]["SubBusiness"] }).appendTo(subbusinessDropDown);
                }
            }
        },
        error: function (data) {

            hideImage();
            var errorMessge = data.responseText.split('See')[0];
            var errorMessge2 = errorMessge.substr(errorMessge.indexOf("exception") + 23, (errorMessge.length - errorMessge.indexOf("exception") - 27))
            if (errorMessge2 != '') {
                if (!isNaN(errorMessge2.substr(0, 1))) {
                    showErrorPopUp(true, errorMessge2.substr(1, errorMessge2.length));
                }
                else {
                    showErrorPopUp(true, errorMessge2);
                }
            }
            return;
        }
    });
}

function GetBusinessGroupDropDown(value) {
    var subBusinessControlID = "#" + value.id;
    if ($(subBusinessControlID).is('[data-required]')) {
        if (value.attributes["data-required"].value == "true") {
            validateBusinessRequired = true;
        }
    }

    subBusiness = $(subBusinessControlID).val();
    var url = standardAddress + "CreateServiceRequest.svc/GetBusinessDropDown";
    var myJsonObject = {
        "databaseID": decryptStr(getLocal("DatabaseID")), "language": getLocal("Language"), "databaseName": decryptStr(getLocal("databaseName")),
        "businessTransfer": { "LevelType": 11, "SearchString": $(subBusinessControlID).val(), "SearchStringValue": business }
    };

    $("#BusinessGroupDropdown").val("-1");
    $("#BusinessGroupDropdown").selectmenu('refresh');

    $.ajax({
        type: "POST",
        url: url,
        async: 'false',
        data: JSON.stringify(myJsonObject),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            //console.log(data);
            var menuData = JSON.parse(data);
            if (menuData != null) {
                $("#BusinessGroupDropdown option:gt(0)").remove();
                for (var val in menuData) {
                    $('<option />', { value: menuData[val]["BusinessGroup"], text: menuData[val]["BusinessGroup"] }).appendTo(businessgroupDropDown);
                }
            }
        },
        error: function (data) {

            hideImage();
            var errorMessge = data.responseText.split('See')[0];
            var errorMessge2 = errorMessge.substr(errorMessge.indexOf("exception") + 23, (errorMessge.length - errorMessge.indexOf("exception") - 27))
            if (errorMessge2 != '') {
                if (!isNaN(errorMessge2.substr(0, 1))) {
                    showErrorPopUp(true, errorMessge2.substr(1, errorMessge2.length));
                }
                else {
                    showErrorPopUp(true, errorMessge2);
                }
            }
            return;
        }
    });
}

function BusinessGroupDropDownValue(value) {
    if (value.attributes["data-required"].value == "true") {
        validateBusinessRequired = true;
    }

    var businessGroupControlID = "#" + value.id;
    businessGroup = $(businessGroupControlID).val();
}

function BindEquipment(dropdownId) {
    $("#ProblemCodeDropDownList").val("-1").selectmenu("refresh");
    BindEquipmentDetails(dropdownId);
}

function checkDisabledDropDowns() {
    if ($("#" + getLocal("CostcenterId")).length) {
        if ($("#" + getLocal("CostcenterId")).attr("disabled") === "disabled") {
            $("#" + getLocal("CostcenterId")).parent().addClass("ui-select ui-btn-disabled");
        }
    }
    if ($("#" + getLocal("ACB")).length) {
        if ($("#" + getLocal("ACB")).attr("disabled") === "disabled") {
            $("#" + getLocal("ACB")).parent().addClass("ui-select ui-btn-disabled");
        }
    }
    if ($("#" + getLocal("BUSGR")).length) {
        if ($("#" + getLocal("BUSGR")).attr("disabled") === "disabled") {
            $("#" + getLocal("BUSGR")).parent().addClass("ui-select ui-btn-disabled");
        }
    }
    if ($("#" + getLocal("SUBBS")).length) {
        if ($("#" + getLocal("SUBBS")).attr("disabled") === "disabled") {
            $("#" + getLocal("SUBBS")).parent().addClass("ui-select ui-btn-disabled");
        }
    }
    if ($("#" + getLocal("BUS")).length) {
        if ($("#" + getLocal("BUS")).attr("disabled") === "disabled") {
            $("#" + getLocal("BUS")).parent().addClass("ui-select ui-btn-disabled");
        }
    }
    if ($("#" + getLocal("DROP5")).length) {
        if ($("#" + getLocal("DROP5")).attr("disabled") === "disabled") {
            $("#" + getLocal("DROP5")).parent().addClass("ui-select ui-btn-disabled");
        }
    }
    if ($("#" + getLocal("DROP4")).length) {
        if ($("#" + getLocal("DROP4")).attr("disabled") === "disabled") {
            $("#" + getLocal("DROP4")).parent().addClass("ui-select ui-btn-disabled");
        }
    }
    if ($("#" + getLocal("DROP3")).length) {
        if ($("#" + getLocal("DROP3")).attr("disabled") === "disabled") {
            $("#" + getLocal("DROP3")).parent().addClass("ui-select ui-btn-disabled");
        }
    }
    if ($("#" + getLocal("DROP2")).length) {
        if ($("#" + getLocal("DROP2")).attr("disabled") === "disabled") {
            $("#" + getLocal("DROP2")).parent().addClass("ui-select ui-btn-disabled");
        }
    }
    if ($("#" + getLocal("DROP1")).length) {
        if ($("#" + getLocal("DROP1")).attr("disabled") === "disabled") {
            $("#" + getLocal("DROP1")).parent().addClass("ui-select ui-btn-disabled");
        }
    }
    if ($("#" + getLocal("CMP")).length) {
        if ($("#" + getLocal("CMP")).attr("disabled") === "disabled") {
            $("#" + getLocal("CMP")).parent().addClass("ui-select ui-btn-disabled");
        }
    }
}
