var ArrayOfCASValues = new Array();
var ArrayOfCASValues1 = new Array();
var ArrayOfCASValues2 = new Array();


/**
* Get all the dashbaord menus
*
*/
function dashboardMenu() {
    //loadingImage();
    var dbID = decryptStr(getLocal("DatabaseID"));
    var dbName = decryptStr(getLocal("databaseName"));
    var seqID = getLocal("seq");
    var JSONObject = { "databaseID": dbID,
        "databaseName": dbName,
        "seq": seqID,
        "language": getLocal("Language"),
        "clientCode": decryptStr(getLocal("MSIClientCode"))
    };
    var strurl = standardAddress + "GetMenuItems.svc/GetRoldexMenu";
    if (navigator.onLine) {
        $.postJSON(strurl, JSONObject, function (data) {
            //hideImage();

            if (data !== null) {
                $(".ms-norecords-info").hide();
                bindDashboardMenus(data);
            }
            hideImage();
        });
    } else {
        setTimeout(function () {
            hideImage();
            showErrorPopUp(true, noNetworkTranslation);
        }, 1000);
    }

}
/**
* @data - Ajax Response data as Result
* bindDashboardMenus()
*/
function bindDashboardMenus(data) {
    if (navigator.onLine) {
        $('.gridLayout').html('');
        for (var i = 0; i < data.length; i++) {
            $(".gridLayout").append('<li><a href="#" onclick="roldexGrid(' + data[i].SystemProjectID + ',' + data[i].ProjectID + ',\'' + data[i].ScreenName + '\')" data-corners="false" id="menu' + i + '"><img width="30" height="30" src="css/images/sepg.png"><span>' + data[i].ScreenName + (isCountZero(data[i].TotalRecords) ? '' : '(' + data[i].TotalRecords + ')') + ' </span></a></li>');
        }
    } else {
        setTimeout(function () {
            hideImage();
            showErrorPopUp(true, noNetworkTranslation);
        }, 1000);
    }
}

function isCountZero(TotalRecords) {
    var result = false;
    if (TotalRecords == '0') {
        result = true;
    }
    return result;
}
/**
* @id - id of the systemProjectId of the menu item
* @projectId - the projectId of the menu item
* @screenName - Name to be displayed in menu
*/
function roldexGrid(id, projectId, screenName) {
    loadingImage();
    setLocal("selectedScreen", screenName);
    setLocal("systemProjectId", id);
    setLocal("projectId", projectId);
    setLocal("woNeedingAttentionFrom", $.mobile.activePage.attr('id'));

    if (canAccessHomeMenuData === '') {
        var dbID = decryptStr(getLocal("DatabaseID"));
        var dbName = decryptStr(getLocal("databaseName"));
        var seqID = getLocal("seq");
        var JSONObject = { "databaseID": dbID,
            "databaseName": dbName,
            "seq": seqID,
            "language": getLocal("Language"),
            "clientCode": decryptStr(getLocal("MSIClientCode"))
        };
        var strurl = standardAddress + "GetMenuItems.svc/GetRoldexMenu";
        if (navigator.onLine) {
            $.postJSON(strurl, JSONObject, function (data) {
                //hideImage();
                if (data !== null) {
                    canAccessHomeMenuData = data;
                    checkForAccess(id, screenName);
                }
                //hideImage();
            });
        } else {
            setTimeout(function () {
                hideImage();
                showErrorPopUp(true, noNetworkTranslation);
            }, 1000);
        }
    }
    else {
        checkForAccess(id, screenName);
    }

}

function checkForAccess(id, screenName) {
    var accessFlag = false;
    if (canAccessHomeMenuData != null) {
        for (var i = 0; i < canAccessHomeMenuData.length; i++) {
            if (screenName == canAccessHomeMenuData[i].ScreenName) {
                accessFlag = true;
                break;
            }
        }
    }

    if (accessFlag) {
        switch (id) {
            case 1: $.mobile.changePage("woNeedingAttention.html", "fade");
                break;
            case 6: $.mobile.changePage("openOrders.html", "fade");
                break;
            case 4: $.mobile.changePage("woPreApproval.html", "fade");
                break;
            case 3: $.mobile.changePage("recentServicedOrders.html", "fade");
                break;
            case 5: $.mobile.changePage("woInvoiceApproval.html", "fade");
                break;
            case 2: $.mobile.changePage("expBudget.html", "fade");
                break;
            case 7: $.mobile.changePage("quickLinks.html", "fade");
                break;
            default:
                $.mobile.changePage("dynamicMenus.html", "fade");
                break;
        }
    } else {
        hideImage();
    }
}

/**
* Get the List of Dynamic Menus in Dashbaord
*/
function dynamicMenus() {
    loadingImage();
    var connectionStringURL = standardAddress + "GetMenuItems.svc/LoadRoldexMenuData";
    var connectionStringURLCount = standardAddress + "GetMenuItems.svc/GetRecordsCount";
    var dbID = decryptStr(getLocal("DatabaseID"));
    var dbName = decryptStr(getLocal("databaseName"));
    var seqID = getLocal("seq");
    var myJSONobject = {
        "databaseID": dbID,
        "screenType": getLocal("systemProjectId"),
        "seq": seqID,
        "pageNum": "1",
        "projectID": getLocal("projectId"),
        "databaseName": decryptStr(getLocal("databaseName")),
        "language": getLocal("Language"),
        "screenName": getLocal("selectedScreen"),
        "clientId": decryptStr(getLocal("MSIClientCode"))
    };
    if (navigator.onLine) {
        $.postAjaxJSON(connectionStringURLCount, myJSONobject, function (data) {
            hideImage();
            if (data !== null) {
                setLocal("dynamicMenuCount", data);
            }
        });
    } else {
        setTimeout(function () {
            hideImage();
            showErrorPopUp(true, noNetworkTranslation);
        }, 1000);
    }
    setTimeout(function () {
        $.postJSON(connectionStringURL, myJSONobject, function (data) {
            hideImage();
            if (data !== null) {
                bindDynamicMenusData(data);
            }
        });
    }, 1000);
}
function bindDynamicMenusData(data) {
    if (navigator.onLine) {
        $('.dynamicWorkOrderList').html('');
        if (data.length > 0) {
            $(".ms-nodynamicworkorders-info").hide();
            for (var i = 0; i < data.length; i++) {
                var keyvalues = '';
                for (var prop in data[i]) {
                    if (data[i].hasOwnProperty(prop)) {
                        var key = prop;
                        keyvalues = keyvalues + '<span class="dynamicMenuTitle">' + (IsStringNullOrEmpty(key) ? "" : key) + ': </span><span><strong>' + (IsStringNullOrEmpty(data[i][key]) ? "" : data[i][key]) + '</strong></span><br>';
                    }
                }
                $(".dynamicWorkOrderList").append('<li>' + (IsStringNullOrEmpty(keyvalues) ? "" : keyvalues) + '</li>').listview('refresh');
            }
            if (parseInt(getLocal("dynamicMenuCount")) - (1 * 10) > 0) {
                $("#moreDynamicWOButton").show();
            }
        }
        else {
            $(".ms-nodynamicworkorders-info").show();
            $("#moreDynamicWOButton").hide();
        }
    } else {
        setTimeout(function () {
            hideImage();
            showErrorPopUp(true, noNetworkTranslation);
        }, 1000);
    }
}

/**
* To display More WorkOrders
* @obj - current object to be passed for loadMore workorders
*/
function loadMoreDynamicWorkOrders(obj) {
    loadingImage();
    var pageNumber = parseInt($("#dynamicMenuPage").find("#" + obj.id).attr('data-nextPage')) + 1;
    var connectionStringURL = standardAddress + "GetMenuItems.svc/LoadRoldexMenuData";
    var dbID = decryptStr(getLocal("DatabaseID"));
    var dbName = getLocal("databaseName");
    var seqID = getLocal("seq");
    var myJSONobject = {
        "databaseID": dbID,
        "screenType": getLocal("systemProjectId"),
        "seq": seqID,
        "pageNum": pageNumber,
        "projectID": getLocal("projectId"),
        "databaseName": decryptStr(getLocal("databaseName")),
        "language": getLocal("Language"),
        "screenName": getLocal("selectedScreen"),
        "clientId": decryptStr(getLocal("MSIClientCode"))
    };
    if (navigator.onLine) {

        $.postJSON(connectionStringURL, myJSONobject, function (data) {
            hideImage();
            $("#dynamicMenuPage").find("#" + obj.id).attr('data-nextPage', pageNumber);

            if (data !== null) {
                for (var i = 0; i < data.length; i++) {
                    var keyvalues = '';
                    for (var prop in data[i]) {
                        if (data[i].hasOwnProperty(prop)) {
                            var key = prop;
                            keyvalues = keyvalues + '<span class="dynamicMenuTitle">' + (IsStringNullOrEmpty(key) ? "" : key) + ': </span><span><strong>' + (IsStringNullOrEmpty(data[i][key]) ? "" : data[i][key]) + '</strong></span><br>';
                        }
                    }
                    $(".dynamicWorkOrderList").append('<li>' + (IsStringNullOrEmpty(keyvalues) ? "" : keyvalues) + '</li>').listview('refresh');
                }

                if (parseInt(getLocal("dynamicMenuCount")) - (pageNumber * 10) > 0) {
                    $("#moreDynamicWOButton").show();
                }
                else if (parseInt(getLocal("dynamicMenuCount")) - (pageNumber * 10) == -10) {
                    $(".ms-nodynamicworkorders-info").show();
                    $("#moreDynamicWOButton").hide();
                }
                else {
                    $("#moreDynamicWOButton").hide();
                }
            }
        });
    } else {
        setTimeout(function () {
            hideImage();
            showErrorPopUp(true, noNetworkTranslation);
        }, 1000);
    }
}

/******************End Of Dynamic Menus*****************************/

/**
* Display Open Orders
*/
function openOrders() {
    loadingImage();
    var connectionStringURL = standardAddress + "GetMenuItems.svc/LoadRoldexMenuData";
    var dbID = getLocal("DatabaseID");
    var dbName = decryptStr(getLocal("databaseName"));
    var seqID = getLocal("seq");
    var myJSONobject = {
        "databaseID": decryptStr(dbID),
        "screenType": getLocal("systemProjectId"),
        "seq": seqID,
        "pageNum": "1",
        "projectID": "-1",
        "databaseName": decryptStr(getLocal("databaseName")),
        "language": getLocal("Language"),
        "screenName": getLocal("selectedScreen"),
        "clientId": decryptStr(getLocal("MSIClientCode"))
    };
    if (navigator.onLine) {
        $.postJSON(connectionStringURL, myJSONobject, function (data) {

            if (data !== null) {
                $('.openOrderList').html('');
                for (var i = 0; i < data.length - 1; i++) {
                    $(".openOrdersList").append('<li><a href="#" onclick="woDetail(\'' + data[i].WorkOrderNumber + '\')" data-corners="false" id="menu' + i + '">'
                                               + '<h2 class="custMargin">' + data[i].WorkOrderNumber + ' </h2>'
                                               + '<p><strong>' + getTranslatedValue("AssignedName") + ': ' + (IsStringNullOrEmpty(data[i].AssignedName) ? "" : data[i].AssignedName) + '</strong></p>'
                                               + '<p class="ui-li-aside"><strong>' + getTranslatedValue("Status") + ': ' + (IsStringNullOrEmpty(data[i].Status) ? "" : data[i].Status) + '</strong></p>'
                                               + '<p>' + (decryptStr(getLocal("MSIClientCode")) === "IO" ? getTranslatedValue("BuildingNameLabelIO") : getTranslatedValue("BuildingNameLabel"))
                                               + ': ' + (IsStringNullOrEmpty(data[i].Building) ? "" : data[i].Building) + '</strong></p>'
                                               + '<p>' + getTranslatedValue("DateEntered") + ': ' + (IsStringNullOrEmpty(data[i].DateEntered) ? "" : data[i].DateEntered + ' ' + (IsStringNullOrEmpty(data[i].TimeZone) ? "" : data[i].TimeZone)) + '</strong></p>'
                                               + '<p>' + getTranslatedValue("DateTargetCompleteSite") + ': ' + (IsStringNullOrEmpty(data[i].DateTargetCloseSite) ? "" : data[i].DateTargetCloseSite + ' ' + (IsStringNullOrEmpty(data[i].TimeZone) ? "" : data[i].TimeZone)) + '</strong></p>'
                                               + '<p><font style="white-space:normal !important;">' + (decryptStr(getLocal("MSIClientCode")) === "IO" ? getTranslatedValue("ProblemDescriptionIO") : getTranslatedValue("ProblemDescription"))
                                               + ': ' + (IsStringNullOrEmpty(data[i].ProblemDescription) ? "" : (data[i].ProblemDescription.length > 100 ? data[i].ProblemDescription.substring(0, 100) : data[i].ProblemDescription)) + '</strong></font></p>'
                                               + '</a></li>').listview('refresh');
                }
                //                var countList = $('.openOrdersList li').size() - $('.openOrdersList li.ui-screen-hidden').size();

                //                if (countList > 10) {
                //                    $("#moreOpenWorkOrdersButton").show();
                //                } else {
                //                    $("#moreOpenWorkOrdersButton").hide();
                //                }

                if (parseInt(data[data.length - 1].TotalNumberOfRecords) - (1 * 10) > 0) {
                    $("#moreOpenWorkOrdersButton").show();
                }
                else if (parseInt(data[data.length - 1].TotalNumberOfRecords) - (1 * 10) == -10) {
                    $(".ms-norecords-info").show();
                    $("#moreOpenWorkOrdersButton").hide();
                }
                else {
                    $("#moreOpenWorkOrdersButton").hide();
                }
                hideImage();
            }
        });
    } else {
        setTimeout(function () {
            hideImage();
            showErrorPopUp(true, noNetworkTranslation);
        }, 1000);
    }
}

/**
* To display More WorkOrders
* @obj - current object to be passed for loadMore workorders
*/
function loadMoreOpenWorkOrders(obj) {
    loadingImage();
    var pageNumber = parseInt($("#openOrder").find("#" + obj.id).attr('data-nextPage')) + 1;
    var connectionStringURL = standardAddress + "GetMenuItems.svc/LoadRoldexMenuData";
    var dbID = getLocal("DatabaseID");
    var dbName = getLocal("databaseName");
    var seqID = getLocal("seq");
    var myJSONobject = {
        "databaseID": decryptStr(dbID),
        "screenType": getLocal("systemProjectId"),
        "seq": seqID,
        "pageNum": pageNumber,
        "projectID": getLocal("projectId"),
        "databaseName": decryptStr(getLocal("databaseName")),
        "language": getLocal("Language"),
        "screenName": getLocal("selectedScreen"),
        "clientId": decryptStr(getLocal("MSIClientCode"))
    };
    if (navigator.onLine) {
        $.postJSON(connectionStringURL, myJSONobject, function (data) {
            hideImage();
            $("#openOrder").find("#" + obj.id).attr('data-nextPage', pageNumber);
            if (data != null) {
                for (var i = 0; i < data.length - 1; i++) {
                    $(".openOrdersList").append('<li><a href="#" onclick="woDetail(\'' + data[i].WorkOrderNumber + '\')" data-corners="false" id="menu' + i + '">'
                                               + '<h2 class="custMargin">' + data[i].WorkOrderNumber + ' </h2>'
                                               + '<p><strong>' + getTranslatedValue("AssignedName") + ': ' + (IsStringNullOrEmpty(data[i].AssignedName) ? "" : data[i].AssignedName) + '</strong></p>'
                                               + '<p class="ui-li-aside"><strong>' + getTranslatedValue("Status") + ': ' + (IsStringNullOrEmpty(data[i].Status) ? "" : data[i].Status) + '</strong></p>'
                                               + '<p>' + (decryptStr(getLocal("MSIClientCode")) === "IO" ? getTranslatedValue("BuildingNameLabelIO") : getTranslatedValue("BuildingNameLabel"))
                                               + ': ' + (IsStringNullOrEmpty(data[i].Building) ? "" : data[i].Building) + '</strong></p>'
                                               + '<p>' + getTranslatedValue("DateEntered") + ': ' + (IsStringNullOrEmpty(data[i].DateEntered) ? "" : data[i].DateEntered + ' ' + (IsStringNullOrEmpty(data[i].TimeZone) ? "" : data[i].TimeZone)) + '</strong></p>'
                                               + '<p>' + getTranslatedValue("DateTargetCompleteSite") + ': ' + (IsStringNullOrEmpty(data[i].DateTargetCloseSite) ? "" : data[i].DateTargetCloseSite + ' ' + (IsStringNullOrEmpty(data[i].TimeZone) ? "" : data[i].TimeZone)) + '</strong></p>'
                                               + '<p> <font style="white-space:normal !important;">' + (decryptStr(getLocal("MSIClientCode")) === "IO" ? getTranslatedValue("ProblemDescriptionIO") : getTranslatedValue("ProblemDescription"))
                                               + ': ' + (IsStringNullOrEmpty(data[i].ProblemDescription) ? "" : (data[i].ProblemDescription.length > 100 ? data[i].ProblemDescription.substring(0, 100) : data[i].ProblemDescription)) + '</strong></font></p>'
                                               + '</a></li>').listview('refresh');
                    //$(".openOrdersList").append('<li><a href="#" onclick="woDetail(\'' + data[i].WorkOrderNumber + '\')" data-corners="false" id="menu' + i + '"><h2>' + data[i].WorkOrderNumber + ' </h2><p><strong>Assigned Name:' + data[i].AssignedName + '</strong></p></a></li>').listview('refresh');
                }
            }
            if (parseInt(data[data.length - 1].TotalNumberOfRecords) - (pageNumber * 10) > 0) {
                $("#moreOpenWorkOrdersButton").show();
            }
            else {
                $("#moreOpenWorkOrdersButton").hide();
            }
        });
    } else {
        setTimeout(function () {
            hideImage();
            showErrorPopUp(true, noNetworkTranslation);
        }, 1000);
    }
}

/**
* Get the details of an Work Order
* @id - work order id
*/
function woDetail(id) {
    loadingImage();
    setLocal("woID", id);
    var woID = getLocal("woID");
    $("#woID").html('');
    $("#woID").append(woID);
    var dbID = getLocal("DatabaseID");
    var dbName = getLocal("databaseName");
    var seqID = getLocal("seq");
    var connectionStringURL = standardAddress + "ViewWorkOrderDetail.svc/ViewWorkOrder";
    var myJSONobject = {
        "worderNum": woID,
        "databaseID": decryptStr(dbID),
        "intFilter": decryptStr(getLocal("ViewOrderCallerFilter")),
        "seq": seqID,
        "databaseName": decryptStr(getLocal("databaseName")),
        "language": getLocal("Language"),
        "sessionId": decryptStr(getLocal("SessionId"))
    };
    if (navigator.onLine) {
        $.ajax({
            type: "POST",
            url: connectionStringURL,
            data: JSON.stringify(myJSONobject),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                //hideImage();
                if (data != woID + ": The work order number entered could not be found or is not in your filter.") {
                    $.mobile.changePage("woDetails.html", "fade");
                }
                else {
                    showErrorPopUp(true, data);
                }
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
    } else {
        setTimeout(function () {
            hideImage();
            showErrorPopUp(true, noNetworkTranslation);
        }, 1000);
    }
}

/**
* Get the full details of work order
*/
function workOrderDetail() {
    var woID = getLocal("woID");
    $("#woID").html('');
    $("#woID").append(woID);
    var dbID = getLocal("DatabaseID");
    var dbName = getLocal("databaseName");
    var seqID = getLocal("seq");
    var connectionStringURL = standardAddress + "ViewWorkOrderDetail.svc/ViewWorkOrder";
    var strUrlLogHistory = standardAddress + "ViewWorkOrderDetail.svc/WorkOrderLogHistory";
    var myJSONobject = {
        "worderNum": woID,
        "databaseID": decryptStr(dbID),
        "intFilter": decryptStr(getLocal("ViewOrderCallerFilter")),
        "seq": seqID,
        "databaseName": decryptStr(getLocal("databaseName")),
        "language": getLocal("Language"),
        "sessionId": decryptStr(getLocal("SessionId"))
    };

    postJSONOpenOrderDetail(connectionStringURL, myJSONobject);
    postJSONOpenOrderLogHistory(strUrlLogHistory, myJSONobject);
    //    setTimeout(function () {
    //    FillCASData();
    //    }, 2000);
}

/**
* @connectionStringURL - the url to get details of work order
* @myJSONobject - the data is passing as JSONObject
*/
function postJSONOpenOrderDetail(connectionStringURL, myJSONobject) {
    //loadingImage();
    var woID = getLocal("woID");
    if (navigator.onLine) {
        $.ajax({
            type: "POST",
            url: connectionStringURL,
            data: JSON.stringify(myJSONobject),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {

                //setTimeout(function () {
                // For custom Contact Phone label
                var contactPhone = '';
                if (decryptStr(getLocal('CustomContactPhoneLabel')) === '1') {
                    contactPhone = getTranslatedValue("CustomPhoneNumberLabel");
                } else {
                    contactPhone = getTranslatedValue("ContactPhoneLabel");
                }

                var pageID = $.mobile.activePage.attr('id');
                appName == 'iCRS' ? $("#" + pageID + " #appHeader").text(appHeaderForiOS) : $("#" + pageID + " #appHeader").text(appHeaderForAndroid);
                $("#WorkOrderLocationLabel .ui-collapsible-heading-toggle").text(getTranslatedValue("WorkOrderLocationLabel"));
                $("#ImportantDatesLabel .ui-collapsible-heading-toggle").text(getTranslatedValue("ImportantDatesLabel"));
                $("#WorkOrderFeedbackLabel .ui-collapsible-heading-toggle").text(getTranslatedValue("WorkOrderFeedbackLabel"));
                $("#ProblemDescriptionLabel .ui-collapsible-heading-toggle").text(getTranslatedValue("ProblemDescriptionLabel"));
                $("#CompletionDescriptionLabel .ui-collapsible-heading-toggle").text(getTranslatedValue("CompletionDescriptionLabel"));
                $("#GeneralInformationLabel .ui-collapsible-heading-toggle").text(getTranslatedValue("GeneralInformationLabel"));
                $("#AssignmentLabel .ui-collapsible-heading-toggle").text(getTranslatedValue("AssignmentLabel"));
                $("#CASLabel .ui-collapsible-heading-toggle").text(getTranslatedValue("CASLabel"));
                $("#WorkOrderLogHistoryLabel .ui-collapsible-heading-toggle").text(getTranslatedValue("WorkOrderLogHistoryLabel"));
                //    }, 2000);
                //console.log(data);
                //hideImage();
                $('#locationDetails').html('');
                $("#importantDates").html('');
                $("#locationDetails").html('');
                $("#woNumber").html('');
                $("#probDesc").html('');
                $("#complDesc").html('');
                $("#genInfo").html('');
                $("#assignmentID").html('');
                $("#casID").html('');
                $(".woLog").html('');
                var menuData = JSON.parse(data);
                setLocal("WOStatus", menuData.WorkOrderDetailsCollection[0].Status);
                var tableData = '<tr><td class="left-block"><label>' + getLocal("Level1") + '</label></td><td class="right-block"><label>' + (IsStringNullOrEmpty(menuData.CountryCity) ? "" : menuData.CountryCity) + '</label></td></tr><tr><td class="left-block"><label>' + getLocal("Level2") + '</label></td><td class="right-block">' + (IsStringNullOrEmpty(menuData.Building) ? "" : menuData.Building) + '</label></td></tr>' +
               '<tr><td class="left-block"><label>' + getLocal("Level3") + '</label></td><td class="right-block"><label>' + (IsStringNullOrEmpty(menuData.Floor) ? "" : menuData.Floor) + '</label></td></tr>' +
               '<tr><td class="left-block"><label>' + getLocal("Level4") + '</label></td><td class="right-block"><label>' + (IsStringNullOrEmpty(menuData.Area) ? "" : menuData.Area) + '</label></td></tr>' +
               '<tr><td class="left-block"><label>' + getTranslatedValue("LocationwithinAreaLabel") + '</label></td><td class="right-block"><label>' + (IsStringNullOrEmpty(menuData.WorkOrderDetailsCollection[0].LocationDetails) ? "" : menuData.WorkOrderDetailsCollection[0].LocationDetails) + '</label></td></tr>' +
               '<tr><td class="left-block"><label>' + getTranslatedValue("LocationPhoneLabel") + '</label></td><td class="right-block"><label>' + (IsStringNullOrEmpty(menuData.WorkOrderDetailsCollection[0].LocationPhone) ? "" : menuData.WorkOrderDetailsCollection[0].LocationPhone) + '</label></td></tr>' +
               '<tr><td class="left-block"><label>' + getTranslatedValue("ContactNameLabel") + '</label></td><td class="right-block"><label>' + (IsStringNullOrEmpty(menuData.WorkOrderDetailsCollection[0].SiteContactName) ? "" : menuData.WorkOrderDetailsCollection[0].SiteContactName) + '</label></td></tr>' +
               '<tr><td class="left-block"><label>' + contactPhone + '</label></td><td class="right-block"><label>' + (IsStringNullOrEmpty(menuData.WorkOrderDetailsCollection[0].SiteContactPhone) ? "" : menuData.WorkOrderDetailsCollection[0].SiteContactPhone) + '</label></td></tr>' +
               '<tr><td class="left-block"><label>' + getTranslatedValue("ContractFilterLabel") + '</label></td><td class="right-block"><label>' + (IsStringNullOrEmpty(menuData.WorkOrderDetailsCollection[0].BusUnitName) ? "" : menuData.WorkOrderDetailsCollection[0].BusUnitName) + '</label></td></tr>';
                var impDates = '<tr><td class="left-block"><label>' + getTranslatedValue("EnteredLabel") + '</label></td><td class="right-block"><label>' + (IsStringNullOrEmpty(menuData.WorkOrderDetailsCollection[0].Dateentered) ? "" : menuData.WorkOrderDetailsCollection[0].Dateentered + ' ' + (IsStringNullOrEmpty(menuData.WorkOrderDetailsCollection[0].TimeZone) ? "" : menuData.WorkOrderDetailsCollection[0].TimeZone)) + '</label></td></tr>' +
                '<tr><td class="left-block"><label>' + getTranslatedValue("ResponseTargetLabel") + '</label></td><td class="right-block"><label>' + (IsStringNullOrEmpty(menuData.WorkOrderDetailsCollection[0].DatetargetCompleteSite) ? "" : menuData.WorkOrderDetailsCollection[0].DatetargetCompleteSite + ' ' + (IsStringNullOrEmpty(menuData.WorkOrderDetailsCollection[0].TimeZone) ? "" : menuData.WorkOrderDetailsCollection[0].TimeZone)) + '</label></td></tr>' +
                '<tr><td class="left-block"><label>' + getTranslatedValue("DispatchedTargetLabel") + '</label></td><td class="right-block"><label>' + (IsStringNullOrEmpty(menuData.WorkOrderDetailsCollection[0].DatedispatchedSite) ? "" : menuData.WorkOrderDetailsCollection[0].DatedispatchedSite + ' ' + (IsStringNullOrEmpty(menuData.WorkOrderDetailsCollection[0].TimeZone) ? "" : menuData.WorkOrderDetailsCollection[0].TimeZone)) + '</label></td></tr>' +
                '<tr><td class="left-block"><label>' + getTranslatedValue("TargetAttendLbl") + '</label></td><td class="right-block"><label>' + (IsStringNullOrEmpty(menuData.WorkOrderDetailsCollection[0].Dateattendtargetsite) ? "" : menuData.WorkOrderDetailsCollection[0].Dateattendtargetsite + ' ' + (IsStringNullOrEmpty(menuData.WorkOrderDetailsCollection[0].TimeZone) ? "" : menuData.WorkOrderDetailsCollection[0].TimeZone)) + '</label></td></tr>' +
                '<tr><td class="left-block"><label>' + getTranslatedValue("ContainSLALbl") + '</label></td><td class="right-block"><label>' + (IsStringNullOrEmpty(menuData.WorkOrderDetailsCollection[0].DatecontainclatargetSite) ? "" : menuData.WorkOrderDetailsCollection[0].DatecontainclatargetSite + ' ' + (IsStringNullOrEmpty(menuData.WorkOrderDetailsCollection[0].TimeZone) ? "" : menuData.WorkOrderDetailsCollection[0].TimeZone)) + '</label></td></tr>' +
                '<tr><td class="left-block"><label>' + getTranslatedValue("CompleteLabel") + '</label></td><td class="right-block"><label>' + (IsStringNullOrEmpty(menuData.WorkOrderDetailsCollection[0].DatetargetCloseSite) ? "" : menuData.WorkOrderDetailsCollection[0].DatetargetCloseSite + ' ' + (IsStringNullOrEmpty(menuData.WorkOrderDetailsCollection[0].TimeZone) ? "" : menuData.WorkOrderDetailsCollection[0].TimeZone)) + '</label></td></tr>' +
                '<tr><td class="left-block"><label>' + getTranslatedValue("SLAVersionLbl") + '</label></td><td class="right-block"><label>' + (IsStringNullOrEmpty(menuData.WorkOrderDetailsCollection[0].SLAVersion) ? "" : menuData.WorkOrderDetailsCollection[0].SLAVersion) + '</label></td></tr>' +
                '<tr><td class="left-block"><label>' + getTranslatedValue("NextArrivalLabel") + '</label></td><td class="right-block"><label>' + (IsStringNullOrEmpty(menuData.WorkOrderDetailsCollection[0].DatenextArrivalSite) ? "" : menuData.WorkOrderDetailsCollection[0].DatenextArrivalSite + ' ' + (IsStringNullOrEmpty(menuData.WorkOrderDetailsCollection[0].TimeZone) ? "" : menuData.WorkOrderDetailsCollection[0].TimeZone)) + '</label></td></tr>' +
                '<tr><td class="left-block"><label>' + getTranslatedValue("CompletedLabel") + '</label></td><td class="right-block"><label>' + (IsStringNullOrEmpty(menuData.WorkOrderDetailsCollection[0].DatecompleteSite) ? "" : menuData.WorkOrderDetailsCollection[0].DatecompleteSite + ' ' + (IsStringNullOrEmpty(menuData.WorkOrderDetailsCollection[0].TimeZone) ? "" : menuData.WorkOrderDetailsCollection[0].TimeZone)) + '</label></td></tr>';
                var woNumber = '<tr><td class="left-block"><label>' + getTranslatedValue("WorkOrderFeedbackLabel") + '</label></td><td class="right-block" id="WOFeedBackLink"><a href="#" onclick="reqFeedbackWO(\'' + woID + '\')" data-corners="false">' + woID + ' ' + getTranslatedValue("WorkorderFeedbackHyperlink") + '</a></td></tr>';
                var probDescription = '<tr><td class="left-block"><label>' + getTranslatedValue("ProblemDescriptionLabel") + '</label></td><td class="right-block"><label>' + (IsStringNullOrEmpty(menuData.WorkOrderDetailsCollection[0].ProblemDescription) ? "" : menuData.WorkOrderDetailsCollection[0].ProblemDescription) + '</label></td></tr>';
                var compDescription = '<tr><td class="left-block"><label>' + getTranslatedValue("CompletionDescriptionLabel") + '</label></td><td class="right-block"><label>' + (IsStringNullOrEmpty(menuData.WorkOrderDetailsCollection[0].CompletionDescription) ? "" : menuData.WorkOrderDetailsCollection[0].CompletionDescription) + '</label></td></tr>';
                var genInfo = '<tr><td class="left-block"><label>' + getTranslatedValue("PriorityLabel") + '</label></td><td class="right-block"><label>' + (IsStringNullOrEmpty(menuData.WorkOrderDetailsCollection[0].Priority) ? "" : menuData.WorkOrderDetailsCollection[0].Priority) + '</label></td></tr>' +
               '<tr><td class="left-block"><label>' + getTranslatedValue("RequestedByLabel") + '</label></td><td class="right-block"><label>' + (IsStringNullOrEmpty(menuData.WorkOrderDetailsCollection[0].RequestedBy) ? "" : menuData.WorkOrderDetailsCollection[0].RequestedBy) + '</label></td></tr>' +
               '<tr><td class="left-block"><label>' + getTranslatedValue("StatusLabel") + '</label></td><td class="right-block"><label>' + (IsStringNullOrEmpty(menuData.WorkOrderDetailsCollection[0].Status) ? "" : menuData.WorkOrderDetailsCollection[0].Status) + '</label></td></tr>';
                var assignments = '<tr><td class="left-block"><label>' + getTranslatedValue("TypeLabel") + '</label></td><td class="right-block"><label>' + (IsStringNullOrEmpty(menuData.AssignType) ? "" : menuData.AssignType) + '</label></td></tr>' +
               '<tr><td class="left-block"><label>' + getTranslatedValue("NameLabel") + '</label></td><td class="right-block"><label>' + (IsStringNullOrEmpty(menuData.WorkOrderDetailsCollection[0].AssignedName) ? "" : menuData.WorkOrderDetailsCollection[0].AssignedName) + '</label></td></tr>' +
               '<tr><td class="left-block"><label>' + getTranslatedValue("EmpNumberLabel") + '</label></td><td class="right-block"><label>' + (IsStringNullOrEmpty(menuData.AssignNumber) ? "" : menuData.AssignNumber) + '</label></td></tr>' +
               '<tr><td class="left-block"><label>' + getTranslatedValue("helpdesklabl") + '</label></td><td class="right-block"><label>' + (IsStringNullOrEmpty(menuData.HelpDeskAssignName) ? "" : menuData.HelpDeskAssignName) + '</label></td></tr>';
              
                //                var casInfo = '<tr><td class="left-block"><label>'+ getTranslatedValue("BusinessUnitLabel") +'</label></td><td class="right-block"><label>' + (IsStringNullOrEmpty(menuData.BusinessUnit) ? "" : menuData.BusinessUnit) + '</label></td></tr>' +
                //            '<tr><td class="left-block"><label>'+ getTranslatedValue("CostCenterLabel") +'</label></td><td class="right-block"><label>' + (IsStringNullOrEmpty(menuData.CostCenter) ? "" : menuData.CostCenter) + '</label></td></tr>' +
                //            '<tr><td class="left-block"><label>'+ getTranslatedValue("GLAccountLabel") +'</label></td><td class="right-block"><label>' + (IsStringNullOrEmpty(menuData.GLAccount) ? "" : menuData.GLAccount) + '</label></td></tr>' +
                //            '<tr><td class="left-block"><label>'+ getTranslatedValue("ProjectFixedCostLabel") +'</label></td><td class="right-block"><label>' + (IsStringNullOrEmpty(menuData.WorkOrderDetailsCollection[0].ProjectFixedCost) ? "" : menuData.WorkOrderDetailsCollection[0].ProjectFixedCost) + '</label></td></tr>' +
                //            '<tr><td class="left-block"><label>'+ getTranslatedValue("Reference1Label") +'</label></td><td class="right-block"><label>' + (IsStringNullOrEmpty(menuData.WorkOrderDetailsCollection[0].Reference) ? "" : menuData.WorkOrderDetailsCollection[0].Reference) + '</label></td></tr>' +
                //            '<tr><td class="left-block"><label>'+ getTranslatedValue("Reference2Label") +'</label></td><td class="right-block"><label>' + (IsStringNullOrEmpty(menuData.WorkOrderDetailsCollection[0].Reference2) ? "" : menuData.WorkOrderDetailsCollection[0].Reference2) + '</label></td></tr>' +
                //            '<tr><td class="left-block"><label>'+ getTranslatedValue("Reference3Label") +'</label></td><td class="right-block"><label>' + (IsStringNullOrEmpty(menuData.WorkOrderDetailsCollection[0].Reference3) ? "" : menuData.WorkOrderDetailsCollection[0].Reference3) + '</label></td></tr>' +
                //            '<tr><td class="left-block"><label>'+ getTranslatedValue("Reference4Label") +'</label></td><td class="right-block"><label>' + (IsStringNullOrEmpty(menuData.WorkOrderDetailsCollection[0].Reference4) ? "" : menuData.WorkOrderDetailsCollection[0].Reference4) + '</label></td></tr>' +
                //            '<tr><td class="left-block"><label>'+ getTranslatedValue("Reference5Label") +'</label></td><td class="right-block"><label>' + (IsStringNullOrEmpty(menuData.WorkOrderDetailsCollection[0].Reference5) ? "" : menuData.WorkOrderDetailsCollection[0].Reference5) + '</label></td></tr>' +
                //            '<tr><td class="left-block"><label>'+ getTranslatedValue("Reference6Label") +'</label></td><td class="right-block"><label>' + (IsStringNullOrEmpty(menuData.WorkOrderDetailsCollection[0].Reference6) ? "" : menuData.WorkOrderDetailsCollection[0].Reference6) + '</label></td></tr>' +
                //            '<tr><td class="left-block"><label>'+ getTranslatedValue("Reference7Label") +'</label></td><td class="right-block"><label>' + (IsStringNullOrEmpty(menuData.WorkOrderDetailsCollection[0].Reference7) ? "" : menuData.WorkOrderDetailsCollection[0].Reference7) + '</label></td></tr>' +
                //            '<tr><td class="left-block"><label>'+ getTranslatedValue("Reference8Label") +'</label></td><td class="right-block"><label>' + (IsStringNullOrEmpty(menuData.WorkOrderDetailsCollection[0].Reference8) ? "" : menuData.WorkOrderDetailsCollection[0].Reference8) + '</label></td></tr>' +
                //            '<tr><td class="left-block"><label>'+ getTranslatedValue("FixedCostLabel") +'</label></td><td class="right-block"><label>' + (IsStringNullOrEmpty(menuData.WorkOrderDetailsCollection[0].WOFixedCost) ? "" : menuData.WorkOrderDetailsCollection[0].WOFixedCost) + '</label></td></tr>';

                var attachments = '<tr><td class="left-block"><a href="#" onclick="navigateToAttachment()" data-corners="false">' + getTranslatedValue("AttachmentLinkLabel") + '</a></td></tr>';

                if (menuData != null) {
                    ArrayOfCASValues1.push(menuData);
                    if (menuData.WorkOrderDetailsCollection[0] != null) {
                        ArrayOfCASValues = [];
                        ArrayOfCASValues.push(menuData.WorkOrderDetailsCollection[0]);
                    }

                    ArrayOfCASValues2 = [];
                    ArrayOfCASValues2.push(menuData);
                }
                if (ArrayOfCASValues != null) {
                    setTimeout(function () {
                        BindCASForWODetails();
                    }, 500);
                    //                    setTimeout(function () {
                    //                        FillCASData();
                    //                    }, 500);

                }

                $("#importantDates").append(impDates);
                $("#locationDetails").append(tableData);
                $("#woNumber").append(woNumber);
                $("#probDesc").append(probDescription);
                $("#complDesc").append(compDescription);
                $("#genInfo").append(genInfo);
                $("#assignmentID").append(assignments);
                $("#attachmentTable").append(attachments);
                $("#AttachmentLabel .ui-collapsible-heading-toggle").text(getTranslatedValue("AttachmentsButton") + '(' + (IsStringNullOrEmpty(menuData.AttachmentCount) ? "" : menuData.AttachmentCount) + ')');
                //                $("#casID").append(casInfo);

                if (decryptStr(getLocal("AllowFeedbackToCompletedWOsOnly")) != null) {
                    if (decryptStr(getLocal("AllowFeedbackToCompletedWOsOnly")).toLowerCase() == "true") {
                        if (getLocal("WOStatus") != null) {
                            if (!getLocal("WOStatus").startsWith("C")) {

                                //$("#WOFeedBackLink").addClass('ui-state-disabled');
                                $("#WOFeedBackLink").prop('disabled', 'disabled');
                                $("#WOFeedBackLink").addClass('ui-disabled');
                                $("#WOFeedBackLink").addClass('ui-state-disabled');



                            }
                            else if (getLocal("WOStatus").startsWith("CAN") || getLocal("WOStatus").startsWith("CMP")) {

                                //$("#WOFeedBackLink").addClass('ui-state-disabled');
                                $("#WOFeedBackLink").prop('disabled', 'disabled');
                                $("#WOFeedBackLink").addClass('ui-disabled');
                                $("#WOFeedBackLink").addClass('ui-state-disabled');

                            }
                            else {

                                //$("#WOFeedBackLink").removeClass('ui-state-disabled');
                                $("#WOFeedBackLink").prop('enabled', 'enabled');
                                $("#WOFeedBackLink").removeClass('ui-disabled');
                                $("#WOFeedBackLink").removeClass('ui-state-disabled');
                            }
                        }
                    }
                }
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
            hideImage();
            showErrorPopUp(true, noNetworkTranslation);
        }, 1000);
    }
}

function BindCASForWODetails() {
    var myJsonObject;
    var dynamicList = '';
    $('#dynamicCASWOViewItemslist').empty();
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
    myJsonObject = {
        "generalObject": {
            "ProblemCodeNumber": "",
            "ProblemCodeDescription": "",
            "DataBaseID": decryptStr(getLocal("DatabaseID")),
            "LanguageSelected": getLocal("Language"),
            "DatabaseName": decryptStr(getLocal("databaseName"))
        }
    };

    $.postJSON(url, myJsonObject, function (data) {

        if (data != false) {
            if (data != null) {
                for (indexValue = 0; indexValue < data.length; indexValue++) {
                    AccountFrameListArray.push(data[indexValue]);
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
                                    }

                                    if (casLang == getLocal("Language")) {
                                        //                                        labelText = accountFrameListfilter[0]["Label"][0]["Description"];
                                        //                                        validationMessage = accountFrameListfilter[0]["ValidationMessage"][0]["Description"];
                                        labelID = labelText + 'Label' + index + index1;
                                        labelText = '<label class="custMandatory" id="' + labelID + '">' + labelText + ":" + '</label>';

                                        $(tableCell).append(labelText);

                                        var tableRow1 = '<tr>';
                                        var tableCell1 = '<td>';
                                        var textbox;
                                        var companyValues = '';
                                        var dropdown = '';
                                        var dropdownId;
                                        var dropdowndata = '';
                                        switch (accountFrameListfilter[0]["InputType"]) {
                                            case "TB":
                                            case "TA":
                                            case "TBN":
                                            case "TBC":
                                            case "TBP":
                                                var id = accountFrameListfilter[0]["ControlId"] + "TextBox";
                                                var readOnly = !accountFrameListfilter[0]["Editable"];
                                                var defaultValue = accountFrameListfilter[0]["DefaultValue"];
                                                textbox = '<input type="text" id="' + id + '"/>';
                                                $(tableCell).append(textbox);
                                                $(tableRow).append(tableCell);
                                                $('#dynamicCASWOViewItemslist').append(tableRow);
                                                //                                                $("#" + id).prop('disabled', 'disabled');
                                                //                                                $("#" + id).addClass('ui-disabled');
                                                //                                                $("#" + id).addClass('ui-state-disabled');
                                                //                                                $("#" + id).textinput();

                                                $("#" + id).attr("readonly", true);
                                                //                                                $("#" + id).addClass("ui-disabled");
                                                //                                                $("#" + id).css("opacity", "0.8");
                                                $("#" + id).textinput();
                                                break;
                                            case "DD":
                                                dropdownId = accountFrameListfilter[0]["ControlId"] + "Dropdown";
                                                switch (accountFrameListfilter[0]["SourceName"]) {
                                                    case "CMP":
                                                        if (getLocal("companyValues") != null) {
                                                            companyValues = getLocal("companyValues").split(';');
                                                        }
                                                        dropdown = $('<select  id = ' + dropdownId + '/>');
                                                        $('<option />', { value: "-1", text: "--select--" }).appendTo(dropdown);
                                                        for (var val in companyValues) {
                                                            $('<option />', { value: companyValues[val], text: companyValues[val] }).appendTo(dropdown);
                                                        }

                                                        $(tableCell).append(dropdown);
                                                        $('#' + dropdownId).selectmenu('refresh');
                                                        $(tableRow).append(tableCell);
                                                        $('#dynamicCASWOViewItemslist').append(tableRow);
                                                        //                                                        $("#" + dropdownId).prop('disabled', 'disabled');
                                                        //                                                        $("#" + dropdownId).addClass('ui-disabled');
                                                        //$("#" + dropdownId).addClass('ui-state-disabled');

                                                        $("#" + dropdownId).attr("readonly", true);
                                                        $("#" + dropdownId).parent().addClass("ui-select ui-btn-disabled");
                                                        //$("#" + dropdownId).css("opacity", "0.8");
                                                        //$("#" + dropdownId).attr("disabled", "disabled");                                                    
                                                        $('#' + dropdownId).selectmenu();
                                                        break;
                                                    case "CCEXT":
                                                        var CostCenterDropDown = $('<select  id = ' + dropdownId + '/>');
                                                        $('<option />', { value: "-1", text: "--select--" }).appendTo(CostCenterDropDown);
                                                        $(tableCell).append(CostCenterDropDown);
                                                        $(tableRow).append(tableCell);
                                                        $('#dynamicCASWOViewItemslist').append(tableRow);
                                                        //                                                        $("#" + dropdownId).prop('disabled', 'disabled');
                                                        //                                                        $("#" + dropdownId).addClass('ui-disabled');
                                                        //                                                        $("#" + dropdownId).addClass('ui-state-disabled');
                                                        $("#" + dropdownId).attr("readonly", true);
                                                        $("#" + dropdownId).parent().addClass("ui-select ui-btn-disabled");
                                                        //$("#" + dropdownId).css("opacity", "0.8");
                                                        //$("#" + dropdownId).attr("disabled", true);
                                                        $("#" + dropdownId).selectmenu();
                                                        break;
                                                    case "DROP1":
                                                        openDB();
                                                        var companyValues1;
                                                        if (getLocal("CAS_DropSource_1") != null) {
                                                            companyValues1 = getLocal("CAS_DropSource_1").split(';');
                                                        }
                                                        var dropdown1 = $('<select  id = ' + dropdownId + ' />');
                                                        $('<option />', { value: "-1", text: "--select--" }).appendTo(dropdown1);
                                                        for (var val in companyValues1) {
                                                            $('<option />', { value: val, text: companyValues1[val] }).appendTo(dropdown1);
                                                        }

                                                        $(tableCell).append(dropdown1);
                                                        if (accountFrameListfilter[0]["DefaultValue"] != null && accountFrameListfilter[0]["DefaultValue"] != '') {
                                                            for (var companyvalue in companyValues1) {
                                                                if (companyValues1[companyvalue] == accountFrameListfilter[0]["DefaultValue"]) {
                                                                    $('#' + dropdownId).val(companyValues1);
                                                                    setLocal("DropDownValue", companyvalue);
                                                                }
                                                            }


                                                        }
                                                        $('#' + dropdownId).selectmenu('refresh');
                                                        $(tableRow).append(tableCell);

                                                        //                                                        $("#" + dropdownId).prop('disabled', 'disabled');
                                                        //                                                        $("#" + dropdownId).addClass('ui-disabled');
                                                        //                                                        $("#" + dropdownId).addClass('ui-state-disabled');
                                                        $("#" + dropdownId).attr("readonly", true);
                                                        $("#" + dropdownId).parent().addClass("ui-select ui-btn-disabled");
                                                        //                                                        $("#" + dropdownId).css("opacity", "0.8");
                                                        $('#dynamicCASWOViewItemslist').append(tableRow);
                                                        $('#' + dropdownId).selectmenu();
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
                                                        }

                                                        $('<option />', { value: "-1", text: "--select--" }).appendTo(dropdown2);
                                                        for (var val in companyValues2) {
                                                            $('<option />', { value: val, text: companyValues3[val] }).appendTo(dropdown2);
                                                        }

                                                        $(tableCell).append(dropdown2);

                                                        if (accountFrameListfilter[0]["DefaultValue"] != null && accountFrameListfilter[0]["DefaultValue"] != '') {
                                                            for (var companyvalue in companyValues2) {
                                                                if (companyValues2[companyvalue] == accountFrameListfilter[0]["DefaultValue"]) {
                                                                    $('#' + dropdownId).val(companyValues2);
                                                                    setLocal("DropDownValue", companyvalue);
                                                                }
                                                            }

                                                            $('#' + dropdownId).selectmenu('refresh');
                                                        }
                                                        $(tableRow).append(tableCell);
                                                        $('#dynamicCASWOViewItemslist').append(tableRow);
                                                        //                                                        $("#" + dropdownId).prop('disabled', 'disabled');
                                                        //                                                        $("#" + dropdownId).addClass('ui-disabled');
                                                        //                                                        $("#" + dropdownId).addClass('ui-state-disabled');
                                                        $("#" + dropdownId).attr("readonly", true);
                                                        $("#" + dropdownId).parent().addClass("ui-select ui-btn-disabled");
                                                        //                                                        $("#" + dropdownId).css("opacity", "0.8");
                                                        $('#' + dropdownId).selectmenu();
                                                        break;
                                                    case "DROP3":
                                                        openDB();
                                                        var companyValues3;
                                                        if (getLocal("CAS_DropSource_3") != null) {
                                                            companyValues3 = getLocal("CAS_DropSource_3").split(';');
                                                        }
                                                        var dropdown3 = $('<select  id = ' + dropdownId + '/>');
                                                        $('<option />', { value: "-1", text: "--select--" }).appendTo(dropdown3);
                                                        for (var val in companyValues3) {
                                                            $('<option />', { value: val, text: companyValues3[val] }).appendTo(dropdown3);
                                                        }

                                                        $(tableCell).append(dropdown3);

                                                        if (accountFrameListfilter[0]["DefaultValue"] != null && accountFrameListfilter[0]["DefaultValue"] != '') {
                                                            for (var companyvalue in companyValues3) {
                                                                if (companyValues3[companyvalue] == accountFrameListfilter[0]["DefaultValue"]) {
                                                                    $('#' + dropdownId).val(companyValues3);
                                                                    setLocal("DropDownValue", companyvalue);
                                                                }
                                                            }

                                                            $('#' + dropdownId).selectmenu('refresh');
                                                        }
                                                        $(tableRow).append(tableCell);
                                                        $('#dynamicCASWOViewItemslist').append(tableRow);
                                                        //                                                        $("#" + dropdownId).prop('disabled', 'disabled');
                                                        //                                                        $("#" + dropdownId).addClass('ui-disabled');
                                                        //                                                        $("#" + dropdownId).addClass('ui-state-disabled');
                                                        $("#" + dropdownId).attr("readonly", true);
                                                        $("#" + dropdownId).parent().addClass("ui-select ui-btn-disabled");
                                                        //                                                        $("#" + dropdownId).css("opacity", "0.8");
                                                        $('#' + dropdownId).selectmenu();
                                                        break;
                                                    case "DROP4":
                                                        openDB();
                                                        var companyValues4;
                                                        if (getLocal("CAS_DropSource_4") != null) {
                                                            companyValues4 = getLocal("CAS_DropSource_4").split(';');
                                                        }
                                                        var dropdown4 = $('<select  id = ' + dropdownId + '/>');
                                                        $('<option />', { value: "-1", text: "--select--" }).appendTo(dropdown4);
                                                        for (var val in companyValues4) {
                                                            $('<option />', { value: val, text: companyValues4[val] }).appendTo(dropdown4);
                                                        }

                                                        $(tableCell).append(dropdown4);

                                                        if (accountFrameListfilter[0]["DefaultValue"] != null && accountFrameListfilter[0]["DefaultValue"] != '') {
                                                            for (var companyvalue in companyValues4) {
                                                                if (companyValues4[companyvalue] == accountFrameListfilter[0]["DefaultValue"]) {
                                                                    $('#' + dropdownId).val(companyValues4);
                                                                    setLocal("DropDownValue", companyvalue);
                                                                }
                                                            }

                                                            $('#' + dropdownId).selectmenu('refresh');
                                                        }
                                                        $(tableRow).append(tableCell);
                                                        $('#dynamicCASWOViewItemslist').append(tableRow);
                                                        //                                                        $("#" + dropdownId).prop('disabled', 'disabled');
                                                        //                                                        $("#" + dropdownId).addClass('ui-disabled');
                                                        //                                                        $("#" + dropdownId).addClass('ui-state-disabled');
                                                        $("#" + dropdownId).attr("readonly", true);
                                                        $("#" + dropdownId).parent().addClass("ui-select ui-btn-disabled");
                                                        //                                                        $("#" + dropdownId).css("opacity", "0.8");
                                                        $('#' + dropdownId).selectmenu();
                                                        break;
                                                    case "DROP5":
                                                        openDB();
                                                        var companyValues5;
                                                        if (getLocal("CAS_DropSource_5") != null) {
                                                            companyValues5 = getLocal("CAS_DropSource_5").split(';');
                                                        }
                                                        var dropdown5 = $('<select  id = ' + dropdownId + '/>');
                                                        $('<option />', { value: "-1", text: "--select--" }).appendTo(dropdown5);
                                                        for (var val in companyValues5) {
                                                            $('<option />', { value: val, text: companyValues5[val] }).appendTo(dropdown5);
                                                        }

                                                        $(tableCell).append(dropdown5);

                                                        if (accountFrameListfilter[0]["DefaultValue"] != null && accountFrameListfilter[0]["DefaultValue"] != '') {
                                                            for (var companyvalue in companyValues5) {
                                                                if (companyValues5[companyvalue] == accountFrameListfilter[0]["DefaultValue"]) {
                                                                    $('#' + dropdownId).val(companyValues5);
                                                                    setLocal("DropDownValue", companyvalue);
                                                                }
                                                            }

                                                            $('#' + dropdownId).selectmenu('refresh');
                                                        }
                                                        $(tableRow).append(tableCell);
                                                        $('#dynamicCASWOViewItemslist').append(tableRow);
                                                        //                                                        $("#" + dropdownId).prop('disabled', 'disabled');
                                                        //                                                        $("#" + dropdownId).addClass('ui-disabled');
                                                        //                                                        $("#" + dropdownId).addClass('ui-state-disabled');
                                                        $("#" + dropdownId).attr("readonly", true);
                                                        $("#" + dropdownId).parent().addClass("ui-select ui-btn-disabled");
                                                        //                                                        $("#" + dropdownId).css("opacity", "0.8");
                                                        $('#' + dropdownId).selectmenu();
                                                        break;
                                                    case "BUS":
                                                        var businessDropDown = $('<select  id = ' + dropdownId + '/>');
                                                        $('<option />', { value: "-1", text: "--Select--" }).appendTo(businessDropDown);
                                                        $(tableCell).append(businessDropDown);
                                                        $(tableRow).append(tableCell);
                                                        $('#dynamicCASWOViewItemslist').append(tableRow);
                                                        $("#" + dropdownId).attr("readonly", true);
                                                        $('#' + dropdownId).parent().addClass("ui-select ui-btn-disabled");
                                                        //// $("#" + dropdownId).addClass("ui-disabled");
                                                        ////  $("#" + dropdownId).css("opacity", "0.8");
                                                        $('#' + dropdownId).selectmenu();
                                                        break;
                                                    case "SUBBS":
                                                        var subBusinessDropDown = $('<select  id = ' + dropdownId + '/>');
                                                        $('<option />', { value: "-1", text: "--Select--" }).appendTo(subBusinessDropDown);
                                                        $(tableCell).append(subBusinessDropDown);
                                                        $(tableRow).append(tableCell);
                                                        $('#dynamicCASWOViewItemslist').append(tableRow);
                                                        $("#" + dropdownId).attr("readonly", true);
                                                        $('#' + dropdownId).parent().addClass("ui-select ui-btn-disabled");
                                                        ////  $("#" + dropdownId).addClass("ui-disabled");
                                                        ////  $("#" + dropdownId).css("opacity", "0.8");
                                                        $('#' + dropdownId).selectmenu();
                                                        break;
                                                    case "BUSGR":
                                                        var businessGroupDropDown = $('<select  id = ' + dropdownId + '/>');
                                                        $('<option />', { value: "-1", text: "--Select--" }).appendTo(businessGroupDropDown);
                                                        $(tableCell).append(businessGroupDropDown);
                                                        $(tableRow).append(tableCell);
                                                        $('#dynamicCASWOViewItemslist').append(tableRow);
                                                        $("#" + dropdownId).attr("readonly", true);
                                                        $('#' + dropdownId).parent().addClass("ui-select ui-btn-disabled");
                                                        //// $("#" + dropdownId).addClass("ui-disabled");
                                                        //// $("#" + dropdownId).css("opacity", "0.8");
                                                        $('#' + dropdownId).selectmenu();
                                                        break;
                                                }
                                                break;
                                            case "ACB":
                                                var readOnly = !accountFrameListfilter[0]["Editable"];
                                                var id = accountFrameListfilter[0]["ControlId"] + "TextBox"
                                                var autoCompleteTextBox = '<input type="text" id="' + id + '" diasbled="' + readOnly + '">';
                                                CostCenterText = "#" + autoCompleteTextBox;
                                                //                                                var dropdownId = accountFrameListfilter[0]["ControlId"] + "Dropdown";
                                                //                                                var dropdownAutocomplete = $('<select  id = ' + dropdownId + ' data-input=' + id + ' onchange="BindAutoCompleteTextbox(this);"/>');
                                                //                                                $('<option />', { value: "-1", text: "--select--" }).appendTo(dropdownAutocomplete);
                                                $(tableCell).append(autoCompleteTextBox);
                                                $(tableRow).append(tableCell);
                                                var tableRowAct = $('<tr/>');
                                                var tableCellAct = $('<td/>');
                                                $('#dynamicCASWOViewItemslist').append(tableRow);
                                                //$(tableCellAct).append(dropdownAutocomplete);                                                
                                                $(tableRowAct).append(tableCellAct);
                                                $('#dynamicCASWOViewItemslist').append(tableRowAct);

                                                $("#" + id).attr("readonly", true);
                                                $("#" + id).attr("disabled", true);
                                                //$("#" + id).addClass("ui-disabled");
                                                //$("#" + id).css("opacity", "0.8");
                                                $("#" + id).textinput();

                                                //                                                $("#" + dropdownId).prop('disabled', 'disabled');
                                                //                                                $("#" + dropdownId).addClass('ui-disabled');
                                                //                                                $("#" + dropdownId).addClass('ui-state-disabled');
                                                $("#" + dropdownId).attr("readonly", true);
                                                $("#" + dropdownId).parent().addClass("ui-select ui-btn-disabled");
                                                //$("#" + dropdownId).css("opacity", "0.8");
                                                $('#' + dropdownId).attr('disabled', true);
                                                $('#' + dropdownId).selectmenu();
                                                break;

                                            //                                                $("#" + id).prop('disabled', 'disabled');          
                                            //                                                $("#" + id).addClass('ui-disabled');          
                                            //                                                $("#" + id).addClass('ui-state-disabled');          
                                            //                                                $('#' + id).textinput();           
                                            //                                                $("#" + id).attr("readonly", true);          
                                            //                                                $("#" + id).addClass("ui-disabled");          
                                            //                                                $("#" + id).css("opacity", "0.8");          
                                                $("#" + id).textinput();

                                                //                                                $("#" + dropdownId).prop('disabled', 'disabled');
                                                //                                                $("#" + dropdownId).addClass('ui-disabled');
                                                //                                                $("#" + dropdownId).addClass('ui-state-disabled');
                                                //                                                $("#" + dropdownId).attr("readonly", true);
                                                //                                                $("#" + dropdownId).addClass("ui-disabled");
                                                //                                                $("#" + dropdownId).css("opacity", "0.8");
                                                $('#' + dropdownId).selectmenu();
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            else {
                $("#CASCollapsible").hide();
            }
        }
        else {
            $("#CASCollapsible").hide();
        }

        setTimeout(function () {
            FillCASData();
        }, 1000);
    });
}

function FillCASData() {
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
            case "ACB":
                TextBoxValue = "#" + AccountFrameCASArray1[i]["ControlId"] + "TextBox";
                if (TextBoxValue != null) {
                    switch (AccountFrameCASArray1[i]["ControlId"]) {
                        case "GLAccount":
                            if (!IsStringNullOrEmpty(ArrayOfCASValues2[0]["GLAccount"])) {
                                $(TextBoxValue).val(ArrayOfCASValues2[0]["GLAccount"]);
                            }
                            else {
                                $(TextBoxValue).val('');
                            }
                            break;
                        case "CostCenter":
                            if (!IsStringNullOrEmpty(ArrayOfCASValues2[0]["CostCenter"])) {
                                $(TextBoxValue).val(ArrayOfCASValues2[0]["CostCenter"]);
                            }
                            else {
                                $(TextBoxValue).val('');
                            }
                            break;
                        case "CompanyCode":
                            //No value
                            break;
                        case "CompanyCostCenter":
                            // No Value
                            break;
                        case "Reference1":
                            if (!IsStringNullOrEmpty(ArrayOfCASValues[0]["Reference"])) {
                                $(TextBoxValue).val(ArrayOfCASValues[0]["Reference"]);
                            }
                            else {
                                $(TextBoxValue).val('');
                            }
                            break;
                        case "Reference2":
                            if (!IsStringNullOrEmpty(ArrayOfCASValues[0]["Reference2"])) {
                                $(TextBoxValue).val(ArrayOfCASValues[0]["Reference2"]);
                            }
                            else {
                                $(TextBoxValue).val('');
                            }
                            break;
                        case "Reference3":
                            if (!IsStringNullOrEmpty(ArrayOfCASValues[0]["Reference3"])) {
                                $(TextBoxValue).val(ArrayOfCASValues[0]["Reference3"]);
                            }
                            else {
                                $(TextBoxValue).val('');
                            }
                            break;
                        case "Reference4":
                            if (!IsStringNullOrEmpty(ArrayOfCASValues[0]["Reference4"])) {
                                $(TextBoxValue).val(ArrayOfCASValues[0]["Reference4"]);
                            }
                            else {
                                $(TextBoxValue).val('');
                            }
                            break;
                        case "Reference5":
                            if (!IsStringNullOrEmpty(ArrayOfCASValues[0]["Reference5"])) {
                                $(TextBoxValue).val(ArrayOfCASValues[0]["Reference5"]);
                            }
                            else {
                                $(TextBoxValue).val('');
                            }
                            break;
                        case "Reference6":
                            if (!IsStringNullOrEmpty(ArrayOfCASValues[0]["Reference6"])) {
                                $(TextBoxValue).val(ArrayOfCASValues[0]["Reference6"]);
                            }
                            else {
                                $(TextBoxValue).val('');
                            }
                            break;
                        case "Reference7":
                            if (!IsStringNullOrEmpty(ArrayOfCASValues[0]["Reference7"])) {
                                $(TextBoxValue).val(ArrayOfCASValues[0]["Reference7"]);
                            }
                            else {
                                $(TextBoxValue).val('');
                            }
                            break;
                        case "Reference8":
                            if (!IsStringNullOrEmpty(ArrayOfCASValues[0]["Reference8"])) {
                                $(TextBoxValue).val(ArrayOfCASValues[0]["Reference8"]);
                            }
                            else {
                                $(TextBoxValue).val('');
                            }
                            break;
                        case "ProjFixedCost":
                            if (!IsStringNullOrEmpty(ArrayOfCASValues[0]["ProjectFixedCost"])) {
                                $(TextBoxValue).val(ArrayOfCASValues[0]["ProjectFixedCost"]);
                            }
                            else {
                                $(TextBoxValue).val('');
                            }
                            break;
                        case "WOFixedCost":
                            if (!IsStringNullOrEmpty(ArrayOfCASValues[0]["WOFixedCost"])) {
                                $(TextBoxValue).val(ArrayOfCASValues[0]["WOFixedCost"]);
                            }
                            else {
                                $(TextBoxValue).val('');
                            }
                            break;
                    }
                }

                //                $(TextBoxValue).prop('disabled', 'disabled');
                //                $(TextBoxValue).addClass('ui-disabled');
                //                $(TextBoxValue).addClass('ui-state-disabled');
                $(TextBoxValue).attr("readonly", true);
                $(TextBoxValue).addClass("ui-disabled");
                $(TextBoxValue).css("opacity", "0.8");
                break;
            case "DD":
                DropDownList = "#" + AccountFrameCASArray1[i]["ControlId"] + "Dropdown";
                switch (AccountFrameCASArray1[i]["ControlId"]) {
                    case "BusinessUnit":
                        if (!IsStringNullOrEmpty(ArrayOfCASValues2[0]["BusinessUnit"])) {
                            //$(DropDownList + " option:selected").val(ArrayOfCASValues2[0]["BusinessUnit"]);
                            $('select>option[value="' + ArrayOfCASValues2[0]["BusinessUnit"] + '"]').prop('selected', true);
                            $(DropDownList).selectmenu('refresh');
                        }
                        else {
                            $(DropDownList + " option:selected").text("select");
                            $(DropDownList).selectmenu('refresh');
                        }

                        //                        $(DropDownList).prop('disabled', 'disabled');
                        //                        $(DropDownList).addClass('ui-disabled');
                        //                        $(DropDownList).addClass('ui-state-disabled');
                        $(DropDownList).attr("readonly", true);
                        //$(DropDownList).addClass("ui-disabled");
                        //$(DropDownList).css("opacity", "0.8");
                        $(DropDownList).parent().addClass("ui-select ui-btn-disabled");
                        $(DropDownList).selectmenu('refresh');
                        break;
                    case "GIPCostCenter":
                        // no value.
                        //                        $(DropDownList).prop('disabled', 'disabled');
                        //                        $(DropDownList).addClass('ui-disabled');
                        //                        $(DropDownList).addClass('ui-state-disabled');

                        $(DropDownList).attr("readonly", true);
                        $(DropDownList).parent().addClass("ui-select ui-btn-disabled");
                        $(DropDownList).css("opacity", "0.8");
                        break;
                    case "CostCenter":
                        if (!IsStringNullOrEmpty(ArrayOfCASValues2[0]["CostCenter"])) {
                            $(DropDownList + " option:selected").text(ArrayOfCASValues2[0]["CostCenter"]);
                            $(DropDownList).selectmenu('refresh');
                        }
                        else {
                            $(DropDownList + " option:selected").text("select");
                            $(DropDownList).selectmenu('refresh');
                        }
                        //                        $(DropDownList).prop('disabled', 'disabled');
                        //                        $(DropDownList).addClass('ui-disabled');
                        //                        $(DropDownList).addClass('ui-state-disabled');

                        $(DropDownList).attr("readonly", true);
                        //$(DropDownList).addClass("ui-disabled");
                        //$(DropDownList).css("opacity", "0.8");
                        $(DropDownList).parent().addClass("ui-select ui-btn-disabled");
                        $(DropDownList).selectmenu('refresh');
                        break;
                    case "Business":
                        if (!IsStringNullOrEmpty(ArrayOfCASValues2[0]["Business"])) {
                            $(DropDownList + " option:selected").text(ArrayOfCASValues2[0]["Business"]);
                            $(DropDownList).selectmenu('refresh');
                        }
                        else {
                            $(DropDownList + " option:selected").text("select");
                            $(DropDownList).selectmenu('refresh');
                        }

                        $(DropDownList).attr("readonly", true);
                        $(DropDownList).parent().addClass("ui-select ui-btn-disabled");
                        $(DropDownList).selectmenu('refresh');
                        break;
                    case "SubBusiness":
                        if (!IsStringNullOrEmpty(ArrayOfCASValues2[0]["SubBusiness"])) {
                            $(DropDownList + " option:selected").text(ArrayOfCASValues2[0]["SubBusiness"]);
                            $(DropDownList).selectmenu('refresh');
                        }
                        else {
                            $(DropDownList + " option:selected").text("select");
                            $(DropDownList).selectmenu('refresh');
                        }

                        $(DropDownList).attr("readonly", true);
                        $(DropDownList).parent().addClass("ui-select ui-btn-disabled");
                        $(DropDownList).selectmenu('refresh');
                        break;
                    case "BusinessGroup":
                        if (!IsStringNullOrEmpty(ArrayOfCASValues2[0]["BusinessGroup"])) {
                            $(DropDownList + " option:selected").text(ArrayOfCASValues2[0]["BusinessGroup"]);
                            $(DropDownList).selectmenu('refresh');
                        }
                        else {
                            $(DropDownList + " option:selected").text("select");
                            $(DropDownList).selectmenu('refresh');
                        }

                        $(DropDownList).attr("readonly", true);
                        $(DropDownList).parent().addClass("ui-select ui-btn-disabled");
                        $(DropDownList).selectmenu('refresh');
                        break;
                    default:
                        switch (AccountFrameCASArray1[i]["SourceName"]) {
                            case "DROP1":
                                var companyValues1;
                                var dropdata1;
                                if (getLocal("CAS_DropSource_1") != null) {
                                    companyValues1 = getLocal("CAS_DropSource_1").split(';');
                                }
                                if (AccountFrameCASArray1[i]["ControlId"] == "Reference1") {
                                    dropdata1 = ArrayOfCASValues[0]["Reference"];
                                }
                                else if (AccountFrameCASArray1[i]["ControlId"] == "Reference2") {
                                    dropdata1 = ArrayOfCASValues[0]["Reference2"];
                                }
                                else if (AccountFrameCASArray1[i]["ControlId"] == "Reference3") {
                                    dropdata1 = ArrayOfCASValues[0]["Reference3"];
                                }
                                else if (AccountFrameCASArray1[i]["ControlId"] == "Reference4") {
                                    dropdata1 = ArrayOfCASValues[0]["Reference4"];
                                }
                                else if (AccountFrameCASArray1[i]["ControlId"] == "Reference5") {
                                    dropdata1 = ArrayOfCASValues[0]["Reference5"];
                                }
                                else if (AccountFrameCASArray1[i]["ControlId"] == "Reference6") {
                                    dropdata1 = ArrayOfCASValues[0]["Reference6"];
                                }
                                else if (AccountFrameCASArray1[i]["ControlId"] == "Reference7") {
                                    dropdata1 = ArrayOfCASValues[0]["Reference7"];
                                }
                                else if (AccountFrameCASArray1[i]["ControlId"] == "Reference8") {
                                    dropdata1 = ArrayOfCASValues[0]["Reference8"];
                                }

                                var dropsource1 = new Array();
                                for (var dropvalue in companyValues1) {
                                    if (dropvalue == dropdata1) {
                                        dropsource1.push(dropvalue);
                                        if (dropsource1.length > 0) {
                                            $(DropDownList + " option:selected").text(dropdata1);
                                            $(DropDownList).selectmenu('refresh');
                                        }
                                        else {
                                            $(DropDownList + " option:selected").text("select");
                                            $(DropDownList).selectmenu('refresh');
                                        }
                                    }
                                }
                                //                                $(DropDownList).prop('disabled', 'disabled');
                                //                                $(DropDownList).addClass('ui-disabled');
                                //                                $(DropDownList).addClass('ui-state-disabled');
                                $(DropDownList).attr("readonly", true);
                                $(DropDownList).parent().addClass("ui-select ui-btn-disabled");
                                $(DropDownList).selectmenu('refresh');
                                break;
                            case "DROP2":
                                var companyValues2;
                                var dropdata2;
                                if (getLocal("CAS_DropSource_2") != null) {
                                    companyValues2 = getLocal("CAS_DropSource_2").split(';');
                                }
                                if (AccountFrameCASArray1[i]["ControlId"] == "Reference1") {
                                    dropdata2 = ArrayOfCASValues[0]["Reference"];
                                }
                                else if (AccountFrameCASArray1[i]["ControlId"] == "Reference2") {
                                    dropdata2 = ArrayOfCASValues[0]["Reference2"];
                                }
                                else if (AccountFrameCASArray1[i]["ControlId"] == "Reference3") {
                                    dropdata2 = ArrayOfCASValues[0]["Reference3"];
                                }
                                else if (AccountFrameCASArray1[i]["ControlId"] == "Reference4") {
                                    dropdata2 = ArrayOfCASValues[0]["Reference4"];
                                }
                                else if (AccountFrameCASArray1[i]["ControlId"] == "Reference5") {
                                    dropdata2 = ArrayOfCASValues[0]["Reference5"];
                                }
                                else if (AccountFrameCASArray1[i]["ControlId"] == "Reference6") {
                                    dropdata2 = ArrayOfCASValues[0]["Reference6"];
                                }
                                else if (AccountFrameCASArray1[i]["ControlId"] == "Reference7") {
                                    dropdata2 = ArrayOfCASValues[0]["Reference7"];
                                }
                                else if (AccountFrameCASArray1[i]["ControlId"] == "Reference8") {
                                    dropdata2 = ArrayOfCASValues[0]["Reference8"];
                                }

                                var dropsource2 = new Array();
                                for (var dropvalue in companyValues2) {
                                    if (dropvalue == dropdata2) {
                                        dropsource2.push(dropvalue);
                                        if (dropsource2.length > 0) {
                                            $(DropDownList + " option:selected").text(dropdata2);
                                            $(DropDownList).selectmenu('refresh');
                                        }
                                        else {
                                            $(DropDownList + " option:selected").text("select");
                                            $(DropDownList).selectmenu('refresh');
                                        }
                                    }
                                }
                                //                                $(DropDownList).prop('disabled', 'disabled');
                                //                                $(DropDownList).addClass('ui-disabled');
                                //                                $(DropDownList).addClass('ui-state-disabled');
                                $(DropDownList).attr("readonly", true);
                                $(DropDownList).parent().addClass("ui-select ui-btn-disabled");
                                $(DropDownList).selectmenu('refresh');
                                break;
                            case "DROP3":
                                var companyValues3;
                                var dropdata3;
                                if (getLocal("CAS_DropSource_3") != null) {
                                    companyValues3 = getLocal("CAS_DropSource_3").split(';');
                                }
                                if (AccountFrameCASArray1[i]["ControlId"] == "Reference1") {
                                    dropdata3 = ArrayOfCASValues[0]["Reference"];
                                }
                                else if (AccountFrameCASArray1[i]["ControlId"] == "Reference2") {
                                    dropdata3 = ArrayOfCASValues[0]["Reference2"];
                                }
                                else if (AccountFrameCASArray1[i]["ControlId"] == "Reference3") {
                                    dropdata3 = ArrayOfCASValues[0]["Reference3"];
                                }
                                else if (AccountFrameCASArray1[i]["ControlId"] == "Reference4") {
                                    dropdata3 = ArrayOfCASValues[0]["Reference4"];
                                }
                                else if (AccountFrameCASArray1[i]["ControlId"] == "Reference5") {
                                    dropdata3 = ArrayOfCASValues[0]["Reference5"];
                                }
                                else if (AccountFrameCASArray1[i]["ControlId"] == "Reference6") {
                                    dropdata3 = ArrayOfCASValues[0]["Reference6"];
                                }
                                else if (AccountFrameCASArray1[i]["ControlId"] == "Reference7") {
                                    dropdata3 = ArrayOfCASValues[0]["Reference7"];
                                }
                                else if (AccountFrameCASArray1[i]["ControlId"] == "Reference8") {
                                    dropdata3 = ArrayOfCASValues[0]["Reference8"];
                                }

                                var dropsource3 = new Array();
                                //                                if (!IsStringNullOrEmpty(dropdata3)) {
                                for (var dropvalue in companyValues3) {
                                    if (dropvalue == dropdata3) {
                                        dropsource1.push(dropvalue);
                                        if (dropsource3.length > 0) {
                                            $(DropDownList + " option:selected").text(dropdata3);
                                            $(DropDownList).selectmenu('refresh');
                                        }
                                        else {
                                            $(DropDownList + " option:selected").text("select");
                                            $(DropDownList).selectmenu('refresh');
                                        }
                                    }
                                }
                                //                                }
                                //                                else {
                                //                                    $(DropDownList + " option:selected").text("select");
                                //                                    $(DropDownList).selectmenu('refresh');
                                //                                }
                                //                                $(DropDownList).prop('disabled', 'disabled');
                                //                                $(DropDownList).addClass('ui-disabled');
                                //                                $(DropDownList).addClass('ui-state-disabled');
                                $(DropDownList).attr("readonly", true);
                                $(DropDownList).parent().addClass("ui-select ui-btn-disabled");
                                $(DropDownList).selectmenu('refresh');
                                break;
                            case "DROP4":
                                var companyValues4;
                                var dropdata4;
                                if (getLocal("CAS_DropSource_4") != null) {
                                    companyValues4 = getLocal("CAS_DropSource_4").split(';');
                                }
                                if (AccountFrameCASArray1[i]["ControlId"] == "Reference1") {
                                    dropdata4 = ArrayOfCASValues[0]["Reference"];
                                }
                                else if (AccountFrameCASArray1[i]["ControlId"] == "Reference2") {
                                    dropdata4 = ArrayOfCASValues[0]["Reference2"];
                                }
                                else if (AccountFrameCASArray1[i]["ControlId"] == "Reference3") {
                                    dropdata4 = ArrayOfCASValues[0]["Reference3"];
                                }
                                else if (AccountFrameCASArray1[i]["ControlId"] == "Reference4") {
                                    dropdata4 = ArrayOfCASValues[0]["Reference4"];
                                }
                                else if (AccountFrameCASArray1[i]["ControlId"] == "Reference5") {
                                    dropdata4 = ArrayOfCASValues[0]["Reference5"];
                                }
                                else if (AccountFrameCASArray1[i]["ControlId"] == "Reference6") {
                                    dropdata4 = ArrayOfCASValues[0]["Reference6"];
                                }
                                else if (AccountFrameCASArray1[i]["ControlId"] == "Reference7") {
                                    dropdata4 = ArrayOfCASValues[0]["Reference7"];
                                }
                                else if (AccountFrameCASArray1[i]["ControlId"] == "Reference8") {
                                    dropdata4 = ArrayOfCASValues[0]["Reference8"];
                                }

                                var dropsource4 = new Array();
                                for (var dropvalue in companyValues4) {
                                    if (dropvalue == dropdata4) {
                                        dropsource4.push(dropvalue);
                                        if (dropsource4.length > 0) {
                                            $(DropDownList + " option:selected").text(dropdata4);
                                            $(DropDownList).selectmenu('refresh');
                                        }
                                        else {
                                            $(DropDownList + " option:selected").text("select");
                                            $(DropDownList).selectmenu('refresh');
                                        }
                                    }
                                }
                                //                                $(DropDownList).prop('disabled', 'disabled');
                                //                                $(DropDownList).addClass('ui-disabled');
                                //                                $(DropDownList).addClass('ui-state-disabled');
                                $(DropDownList).attr("readonly", true);
                                $(DropDownList).parent().addClass("ui-select ui-btn-disabled");
                                $(DropDownList).selectmenu('refresh');
                                break;
                            case "DROP5":
                                var companyValues5;
                                var dropdata5;
                                if (getLocal("CAS_DropSource_5") != null) {
                                    companyValues5 = getLocal("CAS_DropSource_5").split(';');
                                }
                                if (AccountFrameCASArray1[i]["ControlId"] == "Reference1") {
                                    dropdata5 = ArrayOfCASValues[0]["Reference"];
                                }
                                else if (AccountFrameCASArray1[i]["ControlId"] == "Reference2") {
                                    dropdata5 = ArrayOfCASValues[0]["Reference2"];
                                }
                                else if (AccountFrameCASArray1[i]["ControlId"] == "Reference3") {
                                    dropdata5 = ArrayOfCASValues[0]["Reference3"];
                                }
                                else if (AccountFrameCASArray1[i]["ControlId"] == "Reference4") {
                                    dropdata5 = ArrayOfCASValues[0]["Reference4"];
                                }
                                else if (AccountFrameCASArray1[i]["ControlId"] == "Reference5") {
                                    dropdata5 = ArrayOfCASValues[0]["Reference5"];
                                }
                                else if (AccountFrameCASArray1[i]["ControlId"] == "Reference6") {
                                    dropdata5 = ArrayOfCASValues[0]["Reference6"];
                                }
                                else if (AccountFrameCASArray1[i]["ControlId"] == "Reference7") {
                                    dropdata5 = ArrayOfCASValues[0]["Reference7"];
                                }
                                else if (AccountFrameCASArray1[i]["ControlId"] == "Reference8") {
                                    dropdata5 = ArrayOfCASValues[0]["Reference8"];
                                }

                                var dropsource5 = new Array();
                                for (var dropvalue in companyValues5) {
                                    if (dropvalue == dropdata5) {
                                        dropsource5.push(dropvalue);
                                        if (dropsource5.length > 0) {
                                            $(DropDownList + " option:selected").text(dropdata5);
                                            $(DropDownList).selectmenu('refresh');
                                        }
                                        else {
                                            $(DropDownList + " option:selected").text("select");
                                            $(DropDownList).selectmenu('refresh');
                                        }
                                    }
                                }
                                //                                $(DropDownList).prop('disabled', 'disabled');
                                //                                $(DropDownList).addClass('ui-disabled');
                                //                                $(DropDownList).addClass('ui-state-disabled');
                                $(DropDownList).attr("readonly", true);
                                $(DropDownList).parent().addClass("ui-select ui-btn-disabled");
                                $(DropDownList).selectmenu('refresh');
                                break;
                        }

                        break;
                }
                break;
        }
    }
}


/**
* @connectionStringURL - the url to get details of work order Log History
* @myJSONobject - the data is passing as JSONObject
*/
function postJSONOpenOrderLogHistory(connectionStringURL, myJSONobject) {
    loadingImage();
    var woID = getLocal("woID");
    if (navigator.onLine) {
        $.ajax({
            type: "POST",
            url: connectionStringURL,
            data: JSON.stringify(myJSONobject),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {

                //hideImage();
                $("#woLog").html('');
                var historyData = JSON.parse(data);
                for (var i in historyData) {
                    var woLogInfo = '<li><p><strong>' + getTranslatedValue("AssignedLabel") + ': ' + (IsStringNullOrEmpty(historyData[i].Assignment) ? "" : historyData[i].Assignment) + '</strong></p>' +
               '<p><strong>' + getTranslatedValue("CommentsLabel") + ': ' + (IsStringNullOrEmpty(historyData[i].Comments) ? "" : historyData[i].Comments) + '</strong></p>' +
               '<p><strong>' + getTranslatedValue("DateOfUpdateSiteLabel") + ': ' + (IsStringNullOrEmpty(historyData[i].DateofUpdateSite) ? "" : historyData[i].DateofUpdateSite +
                                                     ' ' + (IsStringNullOrEmpty(historyData[i].TimeZone) ? "" : historyData[i].TimeZone)) + '</strong></p>' +
               '<p><strong>' + getTranslatedValue("EnteredByLabel") + ': ' + (IsStringNullOrEmpty(historyData[i].EnteredBy) ? "" : historyData[i].EnteredBy) + '</strong></p>' +
               '<p><strong>' + getTranslatedValue("TransTypeLabel") + ': ' + (IsStringNullOrEmpty(historyData[i].TransType) ? "" : historyData[i].TransType) + '</strong></p></li>';

                    $("#woLog").append(woLogInfo).listview('refresh');
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
    } else {
        setTimeout(function () {
            hideImage();
            showErrorPopUp(true, noNetworkTranslation);
        }, 1000);
    }
}

/**
* page navigate to Attachement page
*/
function navigateToAttachment() {
    if (navigator.onLine) {
        $.mobile.changePage("Attachment.html", "fade");
    } else {
        setTimeout(function () {
            showErrorPopUp(true, noNetworkTranslation);
        }, 1000);
    }
}

/******************************Work order Needing Attention*************************/

function loadDropdown() {
    //
    //loadingImage();
    var groupDropdownOption = '';
    //for (var i = 1; i < 5; i++) {
    var connectionStringURL = standardAddress + "GetMenuItems.svc/WorkOrderNeedingAttentionOptionCount";
    var myJSONobject = {
        "databaseID": decryptStr(getLocal("DatabaseID")),
        "screenType": "1",
        "seq": getLocal("seq"),
        "pageNum": "1",
        "projectID": getLocal("projectId"),
        "approveOption": "1",
        "databaseName": decryptStr(getLocal("databaseName")),
        "language": getLocal("Language")
    };

    if (navigator.onLine) {
        $.postJSON(connectionStringURL, myJSONobject, function (data) {

            if (data != null) {
                if (data.WorkVerificationCount > 0) {
                    groupDropdownOption = '<option value="1">' + getTranslatedValue("Option1") + '</option>';
                }
                if (data.InvoiceApprovalCount > 0) {
                    groupDropdownOption = groupDropdownOption + '<option value="2">' + getTranslatedValue("Option2") + '</option>';
                }
                if (data.PreApprovalCount > 0) {
                    groupDropdownOption = groupDropdownOption + '<option value="3">' + getTranslatedValue("Option3") + '</option>';
                }
                if (data.NTEApprovalCount > 0) {
                    groupDropdownOption = groupDropdownOption + '<option value="4">' + getTranslatedValue("Option4") + '</option>';
                }

                if (groupDropdownOption === '') {
                    //groupDropdownOption = '<option value="-1">' + getTranslatedValue("optionSelect") + '</option>';
                    $("#groupByDiv").hide();
                    $(".ms-norecords-info").show();
                    hideImage();
                }
                $("#groupByDropDown").append(groupDropdownOption).selectmenu("refresh");


                if (getLocal("approvalOption") === '' && $("#groupByDropDown").val() !== "-1") {
                    getWorkOrders($("#groupByDropDown").val());
                }
                else if (getLocal("approvalOption") !== '' && $("#groupByDropDown").val() !== "-1") {
                    //var result = false;
                    $('#groupByDropDown option').each(function () {

                        if (this.value === getLocal("approvalOption")) {

                            $("#groupByDropDown").val(getLocal("approvalOption")).selectmenu("refresh");
                        }
                    });
                    //if (result == true) {

                    getWorkOrders($("#groupByDropDown").val());
                    //                        }
                    //                        else {
                    //                            
                    //                        }
                }
            }
            //hideImage();
        });
    }

}

//Method to get workorders
function getWorkOrders(val) {

    //loadingImage();
    setLocal("approvalOption", val);
    setLocal("approvalAction", $("#groupByDropDown :selected").text().replace(" Required", ""));
    var connectionStringURL = standardAddress + "GetMenuItems.svc/LoadRoldexMenuData";
    var myJSONobject = {
        "databaseID": decryptStr(getLocal("DatabaseID")),
        "screenType": "1",
        "seq": getLocal("seq"),
        "pageNum": "1",
        "projectID": getLocal("projectId"),
        "approveOption": val,
        "databaseName": decryptStr(getLocal("databaseName")),
        "language": getLocal("Language"),
        "screenName": getLocal("selectedScreen"),
        "clientId": decryptStr(getLocal("MSIClientCode"))
    };
    if (navigator.onLine) {
        $.postJSON(connectionStringURL, myJSONobject, function (data) {
            //hideImage();
            if (data.length > 0) {
                $(".ms-norecords-info").hide();
                $(".workOrderList").empty();
                bindWorkOrders(data);
                if (parseInt(data[0].MaxRow) > 10) {
                    $("#woNeedingAttentionMoreButton").show();
                } else {
                    $("#woNeedingAttentionMoreButton").hide();
                }
            }
            else {
                $(".ms-norecords-info").show();
                $("#woNeedingAttentionMoreButton").hide();
            }
            hideImage();
        });
    } else {
        setTimeout(function () {
            hideImage();
            showErrorPopUp(true, noNetworkTranslation);
        }, 1000);
    }
}

//Method To load more workorders
function loadMoreWorkOrders(obj) {
    loadingImage();
    var pageNumber = parseInt($("#woNeedingAttention").find("#" + obj.id).attr('data-nextPage')) + 1;
    var connectionStringURL = standardAddress + "GetMenuItems.svc/LoadRoldexMenuData";
    var myJSONobject = {
        "databaseID": decryptStr(getLocal("DatabaseID")),
        "screenType": "1",
        "seq": getLocal("seq"),
        "pageNum": pageNumber,
        "projectID": getLocal("projectId"),
        "approveOption": $("#groupByDropDown :selected").val(),
        "databaseName": decryptStr(getLocal("databaseName")),
        "language": getLocal("Language"),
        "screenName": getLocal("selectedScreen"),
        "clientId": decryptStr(getLocal("MSIClientCode"))
    };
    if (navigator.onLine) {
        $.postJSON(connectionStringURL, myJSONobject, function (data) {
            hideImage();
            if (data.length > 0) {
                $("#woNeedingAttention").find("#" + obj.id).attr('data-nextPage', pageNumber);
                bindWorkOrders(data);
                if (parseInt(data[0].MaxRow) - (pageNumber * 10) > 10 || parseInt(data[0].MaxRow) - (pageNumber * 10) > 0) {
                    $("#woNeedingAttentionMoreButton").show();
                }
                else {
                    $("#woNeedingAttentionMoreButton").hide();
                }
            }
        });
    } else {
        setTimeout(function () {
            hideImage();
            showErrorPopUp(true, noNetworkTranslation);
        }, 1000);
    }

}

//Method to bind Workorders
function bindWorkOrders(data) {
    var dynamicWoList = '';
    var dynamicPreApprovalList = '';
    var dynamicInvoiceApprovalList = '';
    var dynamicNTEApprovalList = '';
    //$(".workOrderList").empty();
    for (var i = 0; i < data.length; i++) {
        //console.log(data);
        dynamicWoList = dynamicWoList + '<li><a id="' + data[i].WorkOrderNumber + '"  href="#" class="ui-link-inherit" onclick="navigateToDetails(\'' + data[i].WorkOrderNumber + '\')">'
        + '<h2 class="custMargin" style="font-size: 0.9em">' + data[i].WorkOrderNumber + '</h2>'
        + '<p class="ui-li-aside" style="font-size: 0.9em">' + getTranslatedValue("statusLabel") + ': ' + (IsStringNullOrEmpty(data[i].Status) ? "" : data[i].Status) + '</p>'
        + '<p style="font-size: 0.9em"><strong>' + getTranslatedValue("assignmentLabel") + ': ' + (IsStringNullOrEmpty(data[i].AssignedName) ? "" : data[i].AssignedName) + '</strong></p>'
        + '<p>' + getTranslatedValue("buildingLabel") + ': ' + (IsStringNullOrEmpty(data[i].Building) ? "" : data[i].Building) + '</p>'
        + '<p>' + getTranslatedValue("dateEnteredLabel") + ': ' + (IsStringNullOrEmpty(data[i].Dateentered) ? "" : data[i].Dateentered + ' ' + (IsStringNullOrEmpty(data[i].TimeZone) ? "" : data[i].TimeZone)) + '</p>'
        //        + '<p style= "word-wrap: break-word">' + getTranslatedValue("descriptionLabel") + ': ' + (IsStringNullOrEmpty(data[i].ProblemDescription) ? "" : data[i].ProblemDescription) + '</p>'
        + '<p><font style="white-space:normal !important;">' + getTranslatedValue("descriptionLabel") + ': ' + (IsStringNullOrEmpty(data[i].ProblemDescription) ? "" : (data[i].ProblemDescription.length > 100 ? data[i].ProblemDescription.substring(0, 100) : data[i].ProblemDescription)) + '</font></p>'
        + '</a></li>';

    }
    $(".workOrderList").append(dynamicWoList).listview("refresh");
}


function navigateToDetails(workOrderNumber) {
    setLocal("SelectedWorkOrder", workOrderNumber);
    if (navigator.onLine) {
        $.mobile.changePage("workOrderApproval.html", "fade");
    } else {
        setTimeout(function () {
            showErrorPopUp(true, noNetworkTranslation);
        }, 1000);
    }
}


//function getCallerFilterConfigItem() {
//    openDB();
//    dB.transaction(function (ts) {
//        ts.executeSql('SELECT ItemValue FROM ConfigCRS where Item="ViewOrderCallerFilter"', [],
//                     function (ts, results) {
//                         debugger;
//                         return results.rows.item(0).ItemValue;
//                     },
//                     function (e, m, s) { log(e.status); });
//    });
//}

function woVerificationSave() {
    loadingImage();
    var myJSONobject = {
        "isWorkVerified": $("#workVerifiedDropdown :selected").val(),
        "workOrderNumber": getLocal("SelectedWorkOrder"),
        "employeeNumber": getLocal("EmployeeNumber"),
        "databaseID": decryptStr(getLocal("DatabaseID")),
        "databaseName": decryptStr(getLocal("databaseName")),
        "callerName": decryptStr(getLocal("Username")),
        "seq": getLocal("seq"),
        "comments": $("#verificationCommentTextArea").val(),
        "grade": $("#workSatisfiedDropdown :selected").val(),
        "gradeText": $("#workSatisfiedDropdown :selected").text(),
        "language": getLocal("Language"),
        "gpsLocation": getLocal("GPSLocation"),
        "problemDesc": getLocal("problemDesc4WOVerification"),
        "completeDesc": getLocal("completeDesc4WOVerification"),
        "sessionId": decryptStr(getLocal("SessionId"))
    };

    var connectionStringURL = standardAddress + "ViewWorkOrderDetail.svc/SaveVerificationUpdates";
    if (navigator.onLine) {
        $.postAjaxJSON(connectionStringURL, myJSONobject, function (data) {
            hideImage();
            if (data != '') {
                setTimeout(function () {
                    showSuccessPopUp(true, data);
                }, 1000);

                $.mobile.changePage("woNeedingAttention.html", "fade");

            }
            else {
                $.mobile.changePage("woNeedingAttention.html", "fade");
            }
        });
    } else {
        setTimeout(function () {
            hideImage();
            showErrorPopUp(true, noNetworkTranslation);
        }, 1000);
    }
}

// Load the respective work order
function loadApprovalDetails(approvalOption) {
    //loadingImage();
    //Work order verification required
    if (approvalOption == '1') {
        var connectionStringURL = standardAddress + "GetMenuItems.svc/WorkOrderVerificationRequired";
        var myJSONobject = {
            "databaseID": decryptStr(getLocal("DatabaseID")),
            "workOrderNumber": getLocal("SelectedWorkOrder"),
            "language": getLocal("Language"),
            "databaseName": decryptStr(getLocal("databaseName"))
        };
        if (navigator.onLine) {
            $.postJSON(connectionStringURL, myJSONobject, function (data) {
                hideImage();

                if (data != null) {
                    $("#locDetailsTable").empty();
                    $("#probDescTable").empty();
                    $("#financeDescTable").empty();
                    $("#compDescTable").empty();
                    $("#approvalHistoryTable").empty();
                    $("#workVerifiedDiv").show();
                    $("#workVerifiedButtonDiv").show();
                    $("#completionDescDiv").show();

                    setLocal("problemDesc4WOVerification", IsStringNullOrEmpty(data.ProblemDescription) ? "" : data.ProblemDescription);
                    setLocal("completeDesc4WOVerification", IsStringNullOrEmpty(data.CompletionDescription) ? "" : data.CompletionDescription);

                    var dynamicTableRow = '<tr><td class="left-block"><label>' + getLocal("Level1") + '</label></td>'
                       + '<td class="right-block"><label>' + (IsStringNullOrEmpty(data["LocationGridCollection"][0].Level_1) ? "" : data["LocationGridCollection"][0].Level_1) + '</label></td>'
                       + '</tr><tr>'
                       + '<td class="left-block"><label>' + getLocal("Level2") + '</label></td>'
                       + '<td class="right-block"><label>' + (IsStringNullOrEmpty(data["LocationGridCollection"][0].Level_2) ? "" : data["LocationGridCollection"][0].Level_2) + '</label></td>'
                       + '</tr><tr>'
                       + '<td class="left-block"><label>' + getTranslatedValue("addressLabel") + '</label></td>'
                       + '<td class="right-block"><label>' + (IsStringNullOrEmpty(data["LocationGridCollection"][0].Address) ? "" : data["LocationGridCollection"][0].Address) + '</label></td>'
                       + '</tr><tr>'
                       + '<td class="left-block"><label>' + getTranslatedValue("buildingIDLabel") + '</label></td>'
                       + '<td class="right-block"><label>' + (IsStringNullOrEmpty(data["LocationGridCollection"][0].BuildingID) ? "" : data["LocationGridCollection"][0].BuildingID) + '</label></td>'
                       + '</tr><tr>'
                       + '<td class="left-block"><label>' + getTranslatedValue("storeLabel") + '</label></td>'
                       + '<td class="right-block"><label>' + (IsStringNullOrEmpty(data["LocationGridCollection"][0].ProjectNumber) ? "" : data["LocationGridCollection"][0].ProjectNumber) + '</label></td>'
                       + '</tr>'

                    $("#locDetailsTable").append(dynamicTableRow);

                    dynamicTableRow = '<tr><td class="left-block"><label>' + getTranslatedValue("problemDescLabel") + '</label></td>'
                       + '<td class="right-block"><label>' + (IsStringNullOrEmpty(data.ProblemDescription) ? "" : data.ProblemDescription) + '</label></td>'
                       + '</tr>'

                    $("#probDescTable").append(dynamicTableRow);

                    dynamicTableRow = '<tr><td class="left-block"><label>' + getTranslatedValue("CompletionDescLabel") + '</label></td>'
                       + '<td class="right-block"><label>' + (IsStringNullOrEmpty(data.CompletionDescription) ? "" : data.CompletionDescription) + '</label></td>'
                       + '</tr>'

                    $("#compDescTable").append(dynamicTableRow);

                    dynamicTableRow = '<tr><td class="left-block"><label>' + getTranslatedValue("NTELabel") + '</label></td>'
                       + '<td class="right-block"><label>' + (IsStringNullOrEmpty(data["FinancialGridCollection"][0].BidAmount) ? "" : data["FinancialGridCollection"][0].BidAmount) + '</label></td>'
                       + '</tr><tr>'
                       + '<td class="left-block"><label>' + getTranslatedValue("currencyCodeLabel") + '</label></td>'
                       + '<td class="right-block"><label>' + (IsStringNullOrEmpty(data["FinancialGridCollection"][0].CurrencyCode) ? "" : data["FinancialGridCollection"][0].CurrencyCode) + '</label></td>'
                       + '</tr><tr>'
                       + '<td class="left-block"><label>' + getTranslatedValue("costCenterLabel") + '</label></td>'
                       + '<td class="right-block"><label>' + (IsStringNullOrEmpty(data["FinancialGridCollection"][0].CostCenter) ? "" : data["FinancialGridCollection"][0].CostCenter) + '</label></td>'
                       + '</tr><tr>'
                       + '<td class="left-block"><label>' + getLocal("Ref1") + '</label></td>'
                       + '<td class="right-block"><label>' + (IsStringNullOrEmpty(data["FinancialGridCollection"][0].Reference) ? "" : data["FinancialGridCollection"][0].Reference) + '</label></td>'
                       + '</tr><tr>'
                       + '<td class="left-block"><label>' + getLocal("Ref2") + '</label></td>'
                       + '<td class="right-block"><label>' + (IsStringNullOrEmpty(data["FinancialGridCollection"][0].Reference2) ? "" : data["FinancialGridCollection"][0].Reference2) + '</label></td>'
                       + '</tr>'

                    $("#financeDescTable").append(dynamicTableRow);

                    if (data.FeedbackOptionsCollection.length !== 0) {
                        var dynamicOptions = '<option value="-1">' + getTranslatedValue("selectOption") + '</option>';
                        for (var i = 0; i < data.FeedbackOptionsCollection.length; i++) {
                            dynamicOptions = dynamicOptions + '<option value="' + data.FeedbackOptionsCollection[i].PointValue + '">' + data.FeedbackOptionsCollection[i].OptionText + '</option>'
                        }

                        $("#workSatisfiedDropdown").append(dynamicOptions).selectmenu("refresh");
                    }
                    else {
                        $("#workSatisfiedGradeDiv").hide();
                    }
                }
            });
        } else {
            setTimeout(function () {
                hideImage();
                showErrorPopUp(true, noNetworkTranslation);
            }, 1000);
        }
    }

    // Invoice Approval
    if (approvalOption == '2') {
        loadingImage();
        var connectionStringURL = standardAddress + "GetMenuItems.svc/WorkOrderInvoiceApproval";

        var myJSONobject = {
            "databaseID": decryptStr(getLocal("DatabaseID")),
            "workOrderNumber": getLocal("SelectedWorkOrder"),
            "language": getLocal("Language"),
            "databaseName": decryptStr(getLocal("databaseName"))
        };
        if (navigator.onLine) {
            $.postJSON(connectionStringURL, myJSONobject, function (data) {

                hideImage();
                if (data !== null) {
                    $("#locDetailsTable").empty();
                    $("#probDescTable").empty();
                    $("#financeDescTable").empty();
                    $("#approvalHistoryTable").empty();
                    $("#approvalDiv").show();
                    $("#approvalButtonDiv").show();
                    $("#workVerificationDiv").show();
                    $("#invoiceSummaryDiv").show();
                    $("#completionDescDiv").show();
                    $("#financialDiv").hide();
                    var dynamicTableRow = '<tr><td class="left-block"><label>' + getLocal("Level1") + '</label></td>'
                       + '<td class="right-block"><label>' + (IsStringNullOrEmpty(data["LocationGridCollection"][0].Level_1) ? "" : data["LocationGridCollection"][0].Level_1) + '</label></td>'
                       + '</tr><tr>'
                       + '<td class="left-block"><label>' + getLocal("Level2") + '</label></td>'
                       + '<td class="right-block"><label>' + (IsStringNullOrEmpty(data["LocationGridCollection"][0].Level_2) ? "" : data["LocationGridCollection"][0].Level_2) + '</label></td>'
                       + '</tr><tr>'
                       + '<td class="left-block"><label>' + getTranslatedValue("addressLabel") + '</label></td>'
                       + '<td class="right-block"><label>' + (IsStringNullOrEmpty(data["LocationGridCollection"][0].Address) ? "" : data["LocationGridCollection"][0].Address) + '</label></td>'
                       + '</tr><tr>'
                       + '<td class="left-block"><label>' + getTranslatedValue("buildingIDLabel") + '</label></td>'
                       + '<td class="right-block"><label>' + (IsStringNullOrEmpty(data["LocationGridCollection"][0].BuildingID) ? "" : data["LocationGridCollection"][0].BuildingID) + '</label></td>'
                       + '</tr><tr>'
                       + '<td class="left-block"><label>' + getTranslatedValue("storeLabel") + '</label></td>'
                       + '<td class="right-block"><label>' + (IsStringNullOrEmpty(data["LocationGridCollection"][0].ProjectNumber) ? "" : data["LocationGridCollection"][0].ProjectNumber) + '</label></td>'
                       + '</tr>'


                    $("#locDetailsTable").append(dynamicTableRow);

                    dynamicTableRow = '<tr><td class="left-block"><label>' + getTranslatedValue("problemDescLabel") + '</label></td>'
                       + '<td class="right-block"><label>' + (IsStringNullOrEmpty(data.ProblemDescription) ? "" : data.ProblemDescription) + '</label></td>'
                       + '</tr>'

                    $("#probDescTable").append(dynamicTableRow);

                    dynamicTableRow = '<tr><td class="left-block"><label>' + getTranslatedValue("CompletionDescLabel") + '</label></td>'
                       + '<td class="right-block"><label>' + (IsStringNullOrEmpty(data.CompletionDescription) ? "" : data.CompletionDescription) + '</label></td>'
                       + '</tr>'

                    $("#compDescTable").append(dynamicTableRow);

                    dynamicTableRow = '<tr><td class="left-block"><label>' + getTranslatedValue("workVerificationLabel") + '</label></td>'
                       + '<td class="right-block"><label>' + (IsStringNullOrEmpty(data.VerifiedBy) ? "" : data.VerifiedBy) + '</label></td>'
                       + '</tr>'

                    $("#workVerificationTable").append(dynamicTableRow);
                    if (data["InvoiceSummaryCollection"].length != 0) {
                        dynamicTableRow = '<tr><td class="left-block"><label>' + getTranslatedValue("NTELabel") + '</label></td>'
                       + '<td class="right-block"><label>' + (IsStringNullOrEmpty(data["InvoiceSummaryCollection"][0].BidAmount) ? "" : data["InvoiceSummaryCollection"][0].BidAmount) + '</label></td>'
                       + '</tr><tr>'
                       + '<td class="left-block"><label>' + getTranslatedValue("invoiceAmountLabel") + '</label></td>'
                       + '<td class="right-block"><label>' + (IsStringNullOrEmpty(data["InvoiceSummaryCollection"][0].InvoiceAmount) ? "" : data["InvoiceSummaryCollection"][0].InvoiceAmount) + '</label></td>'
                       + '</tr><tr>'
                       + '<td class="left-block"><label>' + getTranslatedValue("laborAmountLabel") + '</label></td>'
                       + '<td class="right-block"><label>' + (IsStringNullOrEmpty(data["InvoiceSummaryCollection"][0].TotalLabor) ? "" : data["InvoiceSummaryCollection"][0].TotalLabor) + '</label></td>'
                       + '</tr><tr>'
                       + '<td class="left-block"><label>' + getTranslatedValue("materialAmountLabel") + '</label></td>'
                       + '<td class="right-block"><label>' + (IsStringNullOrEmpty(data["InvoiceSummaryCollection"][0].TotalMaterial) ? "" : data["InvoiceSummaryCollection"][0].TotalMaterial) + '</label></td>'
                       + '</tr><tr>'
                       + '<td class="left-block"><label>' + getTranslatedValue("maileageAmountLabel") + '</label></td>'
                       + '<td class="right-block"><label>' + (IsStringNullOrEmpty(data["InvoiceSummaryCollection"][0].TotalMileage) ? "" : data["InvoiceSummaryCollection"][0].TotalMileage) + '</label></td>'
                       + '</tr><tr>'
                       + '<td class="left-block"><label>' + getTranslatedValue("travelAmountLabel") + '</label></td>'
                       + '<td class="right-block"><label>' + (IsStringNullOrEmpty(data["InvoiceSummaryCollection"][0].TotalTravel) ? "" : data["InvoiceSummaryCollection"][0].TotalTravel) + '</label></td>'
                       + '</tr><tr>'
                       + '<td class="left-block"><label>' + getTranslatedValue("travelFlatFeeAmountLabel") + '</label></td>'
                       + '<td class="right-block"><label>' + (IsStringNullOrEmpty(data["InvoiceSummaryCollection"][0].TotalTravelFee) ? "" : data["InvoiceSummaryCollection"][0].TotalTravelFee) + '</label></td>'
                       + '</tr><tr>'
                       + '<td class="left-block"><label>' + getTranslatedValue("miscellaneousAmountLabel") + '</label></td>'
                       + '<td class="right-block"><label>' + (IsStringNullOrEmpty(data["InvoiceSummaryCollection"][0].TotalMisc) ? "" : data["InvoiceSummaryCollection"][0].TotalMisc) + '</label></td>'
                       + '</tr>'

                        $("#invoiceSummaryTable").append(dynamicTableRow);
                    }

                    dynamicTableRow = '';
                    for (var i = 0; i < data["ApprovalGridCollection"].length; i++) {
                        dynamicTableRow = dynamicTableRow + '<li><p><strong>' + getTranslatedValue("approvalNameLabel") + ': </strong>'
                       + (IsStringNullOrEmpty(data["ApprovalGridCollection"][i].ApproverName) ? "" : data["ApprovalGridCollection"][i].ApproverName) + '</p>'
                       + '<p><strong>' + getTranslatedValue("approvalStatusLabel") + ': </strong>'
                       + (IsStringNullOrEmpty(data["ApprovalGridCollection"][i].ApprovalStatus) ? "" : data["ApprovalGridCollection"][i].ApprovalStatus) + '</p>'
                       + '<p><strong>' + getTranslatedValue("approvalDatelabel") + ': </strong>'
                       + (IsStringNullOrEmpty(data["ApprovalGridCollection"][i].Approvaldate) ? "" : data["ApprovalGridCollection"][i].Approvaldate) + '</p>'
                       + '<p><strong>' + getTranslatedValue("approvalMethodLabel") + ': </strong>'
                       + (IsStringNullOrEmpty(data["ApprovalGridCollection"][i].ApprovalMethod) ? "" : data["ApprovalGridCollection"][i].ApprovalMethod) + '</p>'
                       + '</li>';
                    }

                    $("#approvalHistoryList").append(dynamicTableRow).listview("refresh");

                    var dynamicOptions = '<option value="-1">--Select--</option>';
                    for (var i = 0; i < data["RejectionReasons"].length; i++) {
                        dynamicOptions = dynamicOptions + '<option vlaue="' + i + '">' + data["RejectionReasons"][i] + '</option>'
                    }
                    $("#rejectionReasonDropDown").append(dynamicOptions).selectmenu("refresh");
                }
            });
        } else {
            setTimeout(function () {
                hideImage();
                showErrorPopUp(true, noNetworkTranslation);
            }, 1000);
        }
    }

    //Pre-Approval
    if (approvalOption == '3') {
        loadingImage();
        var connectionStringURL = standardAddress + "GetMenuItems.svc/WorkOrderPreApproval";
        var myJSONobject = {
            "databaseID": decryptStr(getLocal("DatabaseID")),
            "workOrderNumber": getLocal("SelectedWorkOrder"),
            "databaseName": decryptStr(getLocal("databaseName")),
            "language": getLocal("Language")
        };
        if (navigator.onLine) {
            $.postJSON(connectionStringURL, myJSONobject, function (data) {

                hideImage();
                if (data != null) {
                    $("#locDetailsTable").empty();
                    $("#probDescTable").empty();
                    $("#financeDescTable").empty();
                    $("#approvalHistoryTable").empty();
                    $("#approvalDiv").show();
                    $("#approvalButtonDiv").show();

                    var dynamicTableRow = '<tr><td class="left-block"><label>' + getLocal("Level1") + '</label></td>'
                       + '<td class="right-block"><label>' + (IsStringNullOrEmpty(data["LocationGridCollection"][0].Level_1) ? "" : data["LocationGridCollection"][0].Level_1) + '</label></td>'
                       + '</tr><tr>'
                       + '<td class="left-block"><label>' + getLocal("Level2") + '</label></td>'
                       + '<td class="right-block"><label>' + (IsStringNullOrEmpty(data["LocationGridCollection"][0].Level_2) ? "" : data["LocationGridCollection"][0].Level_2) + '</label></td>'
                       + '</tr><tr>'
                       + '<td class="left-block"><label>' + getTranslatedValue("addressLabel") + '</label></td>'
                       + '<td class="right-block"><label>' + (IsStringNullOrEmpty(data["LocationGridCollection"][0].Address) ? "" : data["LocationGridCollection"][0].Address) + '</label></td>'
                       + '</tr><tr>'
                       + '<td class="left-block"><label>' + getTranslatedValue("buildingIDLabel") + '</label></td>'
                       + '<td class="right-block"><label>' + (IsStringNullOrEmpty(data["LocationGridCollection"][0].BuildingID) ? "" : data["LocationGridCollection"][0].BuildingID) + '</label></td>'
                       + '</tr><tr>'
                       + '<td class="left-block"><label>' + getTranslatedValue("storeLabel") + '</label></td>'
                       + '<td class="right-block"><label>' + (IsStringNullOrEmpty(data["LocationGridCollection"][0].ProjectNumber) ? "" : data["LocationGridCollection"][0].ProjectNumber) + '</label></td>'
                       + '</tr>'

                    $("#locDetailsTable").append(dynamicTableRow);

                    dynamicTableRow = '<tr><td class="left-block"><label>' + getTranslatedValue("problemDescLabel") + '</label></td>'
                       + '<td class="right-block"><label>' + (IsStringNullOrEmpty(data.ProblemDescription) ? "" : data.ProblemDescription) + '</td>'
                       + '</tr>'

                    $("#probDescTable").append(dynamicTableRow);

                    dynamicTableRow = '<tr><td class="left-block"><label>' + getTranslatedValue("NTELabel") + '</td>'
                       + '<td class="right-block"><label>' + (IsStringNullOrEmpty(data["FinancialGridCollection"][0].BidAmount) ? "" : data["FinancialGridCollection"][0].BidAmount) + '</label></td>'
                       + '</tr><tr>'
                       + '<td class="left-block"><label>' + getTranslatedValue("currencyCodeLabel") + '</label></td>'
                       + '<td class="right-block"><label>' + (IsStringNullOrEmpty(data["FinancialGridCollection"][0].CurrencyCode) ? "" : data["FinancialGridCollection"][0].CurrencyCode) + '</label></td>'
                       + '</tr><tr>'
                       + '<td class="left-block"><label>' + getTranslatedValue("costCenterLabel") + '</label></td>'
                       + '<td class="right-block"><label>' + (IsStringNullOrEmpty(data["FinancialGridCollection"][0].CostCenter) ? "" : data["FinancialGridCollection"][0].CostCenter) + '</label></td>'
                       + '</tr><tr>'
                       + '<td class="left-block"><label>' + getLocal("Ref1") + '</label></td>'
                       + '<td class="right-block"><label>' + (IsStringNullOrEmpty(data["FinancialGridCollection"][0].Reference) ? "" : data["FinancialGridCollection"][0].Reference) + '</label></td>'
                       + '</tr><tr>'
                       + '<td class="left-block"><label>' + getLocal("Ref2") + '</label></td>'
                       + '<td class="right-block"><label>' + (IsStringNullOrEmpty(data["FinancialGridCollection"][0].Reference2) ? "" : data["FinancialGridCollection"][0].Reference2) + '</label></td>'
                       + '</tr>'

                    $("#financeDescTable").append(dynamicTableRow);

                    dynamicTableRow = '';
                    for (var i = 0; i < data["ApprovalGridCollection"].length; i++) {
                        dynamicTableRow = dynamicTableRow + '<li><p><strong>' + getTranslatedValue("approvalStatusLabel") + ': </strong>'
                       + (IsStringNullOrEmpty(data["ApprovalGridCollection"][i].ApprovalStatus) ? "" : data["ApprovalGridCollection"][i].ApprovalStatus) + '</p>'
                       + '<p><strong>' + getTranslatedValue("approvalDatelabel") + ': </strong>'
                       + (IsStringNullOrEmpty(data["ApprovalGridCollection"][i].Approvaldate) ? "" : data["ApprovalGridCollection"][i].Approvaldate) + '</p>'
                       + '<p><strong>' + getTranslatedValue("approvalMethodLabel") + ': </strong>'
                       + (IsStringNullOrEmpty(data["ApprovalGridCollection"][i].ApprovalMethod) ? "" : data["ApprovalGridCollection"][i].ApprovalMethod) + '</p>'
                       + '<p><strong>' + getTranslatedValue("approvalNameLabel") + ': </strong>'
                       + (IsStringNullOrEmpty(data["ApprovalGridCollection"][i].ApproverName) ? "" : data["ApprovalGridCollection"][i].ApproverName) + '</p>'
                       + '</li>';
                    }

                    $("#approvalHistoryList").append(dynamicTableRow).listview("refresh");

                }
            });
        } else {
            setTimeout(function () {
                hideImage();
                showErrorPopUp(true, noNetworkTranslation);
            }, 1000);
        }
    }

    // NTE Approval
    if (approvalOption == '4') {
        loadingImage();
        var connectionStringURL = standardAddress + "GetMenuItems.svc/WorkOrderNTEApproval";

        var myJSONobject = {
            "databaseID": decryptStr(getLocal("DatabaseID")),
            "workOrderNumber": getLocal("SelectedWorkOrder"),
            "language": getLocal("Language"),
            "databaseName": decryptStr(getLocal("databaseName"))
        };
        if (navigator.onLine) {
            $.postJSON(connectionStringURL, myJSONobject, function (data) {

                hideImage();
                if (data != null) {
                    $("#locDetailsTable").empty();
                    $("#probDescTable").empty();
                    $("#financeDescTable").empty();
                    $("#approvalHistoryTable").empty();
                    $("#approvalDiv").show();
                    $("#approvalButtonDiv").show();

                    var dynamicTableRow = '<tr><td class="left-block"><label>' + getLocal("Level1") + '</label></td>'
                       + '<td class="right-block"><label> ' + (IsStringNullOrEmpty(data["LocationGridCollection"][0].Level_1) ? "" : data["LocationGridCollection"][0].Level_1) + '</label></td>'
                       + '</tr><tr>'
                       + '<td class="left-block"><label>' + getLocal("Level2") + '</label></td>'
                       + '<td class="right-block"><label>' + (IsStringNullOrEmpty(data["LocationGridCollection"][0].Level_2) ? "" : data["LocationGridCollection"][0].Level_2) + '</label></td>'
                       + '</tr><tr>'
                       + '<td class="left-block"><label>' + getTranslatedValue("addressLabel") + '</label></td>'
                       + '<td class="right-block"><label>' + (IsStringNullOrEmpty(data["LocationGridCollection"][0].Address) ? "" : data["LocationGridCollection"][0].Address) + '</label></td>'
                       + '</tr><tr>'
                       + '<td class="left-block"><label>' + getTranslatedValue("buildingIDLabel") + '</label></td>'
                       + '<td class="right-block"><label>' + (IsStringNullOrEmpty(data["LocationGridCollection"][0].BuildingID) ? "" : data["LocationGridCollection"][0].BuildingID) + '</label></td>'
                       + '</tr><tr>'
                       + '<td class="left-block"><label>' + getTranslatedValue("storeLabel") + '</label></td>'
                       + '<td class="right-block"><label>' + (IsStringNullOrEmpty(data["LocationGridCollection"][0].ProjectNumber) ? "" : data["LocationGridCollection"][0].ProjectNumber) + '</label></td>'
                       + '</tr>'

                    $("#locDetailsTable").append(dynamicTableRow);

                    dynamicTableRow = '<tr><td class="left-block"><label>' + getTranslatedValue("problemDescLabel") + '</label></td>'
                       + '<td class="right-block"><label>' + (IsStringNullOrEmpty(data.ProblemDescription) ? "" : data.ProblemDescription) + '</label></td>'
                       + '</tr>'

                    $("#probDescTable").append(dynamicTableRow);

                    dynamicTableRow = '<tr><td class="left-block"><label>' + getTranslatedValue("currentNTELabel") + '</label></td>'
                       + '<td class="right-block"><label>' + (IsStringNullOrEmpty(data["FinancialGridCollection"][0].BidAmount) ? "" : data["FinancialGridCollection"][0].BidAmount) + '</label></td>'
                       + '</tr><tr>'
                       + '<td class="left-block"><label>' + getTranslatedValue("currencyCodeLabel") + '</label></td>'
                       + '<td class="right-block"><label>' + (IsStringNullOrEmpty(data["FinancialGridCollection"][0].CurrencyCode) ? "" : data["FinancialGridCollection"][0].CurrencyCode) + '</label></td>'
                       + '</tr><tr>'
                       + '<td class="left-block"><label>' + getTranslatedValue("costCenterLabel") + '</label></td>'
                       + '<td class="right-block"><label>' + (IsStringNullOrEmpty(data["FinancialGridCollection"][0].CostCenter) ? "" : data["FinancialGridCollection"][0].CostCenter) + '</label></td>'
                       + '</tr><tr>'
                       + '<td class="left-block"><label>' + getLocal("Ref1") + '</label></td>'
                       + '<td class="right-block"><label>' + (IsStringNullOrEmpty(data["FinancialGridCollection"][0].Reference) ? "" : data["FinancialGridCollection"][0].Reference) + '</label></td>'
                       + '</tr><tr>'
                       + '<td class="left-block"><label>' + getLocal("Ref2") + '</label></td>'
                       + '<td class="right-block"><label>' + (IsStringNullOrEmpty(data["FinancialGridCollection"][0].Reference2) ? "" : data["FinancialGridCollection"][0].Reference2) + '</label></td>'
                       + '</tr><tr>'
                       + '<td class="left-block"><label>' + getTranslatedValue("proposedNTELabel") + '</label></td>'
                       + '<td class="right-block"><label>' + (IsStringNullOrEmpty(data["FinancialGridCollection"][0].ProposedNTE) ? "" : data["FinancialGridCollection"][0].ProposedNTE) + '</label></td>'
                       + '</tr>'

                    $("#financeDescTable").append(dynamicTableRow);

                    dynamicTableRow = '';
                    for (var i = 0; i < data["ApprovalGridCollection"].length; i++) {
                        dynamicTableRow = dynamicTableRow + '<li><p><strong>' + getTranslatedValue("approvalStatusLabel") + ': </strong>'
                       + (IsStringNullOrEmpty(data["ApprovalGridCollection"][i].ApprovalStatus) ? "" : data["ApprovalGridCollection"][i].ApprovalStatus) + '</p>'
                       + '<p><strong>' + getTranslatedValue("approvalDatelabel") + ': </strong>'
                       + (IsStringNullOrEmpty(data["ApprovalGridCollection"][i].Approvaldate) ? "" : data["ApprovalGridCollection"][i].Approvaldate) + '</p>'
                       + '<p><strong>' + getTranslatedValue("approvalMethodLabel") + ': </strong>'
                       + (IsStringNullOrEmpty(data["ApprovalGridCollection"][i].ApprovalMethod) ? "" : data["ApprovalGridCollection"][i].ApprovalMethod) + '</p>'
                       + '<p><strong>' + getTranslatedValue("approvalNameLabel") + ': </strong>'
                       + (IsStringNullOrEmpty(data["ApprovalGridCollection"][i].ApproverName) ? "" : data["ApprovalGridCollection"][i].ApproverName) + '</p>'
                       + '</li>';
                    }

                    $("#approvalHistoryList").append(dynamicTableRow).listview("refresh");

                }
            });
        } else {
            setTimeout(function () {
                hideImage();
                showErrorPopUp(true, noNetworkTranslation);
            }, 1000);
        }
    }
}

// Method to approve different work order Approvals
function approveWorkOrders() {
    loadingImage();
    if (getLocal("approvalOption") == '2') {
        var myJSONobject = {
            "databaseID": decryptStr(getLocal("DatabaseID")),
            "workOrderNumber": getLocal("SelectedWorkOrder"),
            "employeeNumber": getLocal("EmployeeNumber"),
            "language": getLocal("Language"),
            "databaseName": decryptStr(getLocal("databaseName")),
            "seq": getLocal("seq"),
            "gpsLocation": getLocal("GPSLocation")
        };
        var connectionStringURL = standardAddress + "GetMenuItems.svc/ApproveInvoiceWorkOrder";
        if (navigator.onLine) {
            $.postAjaxJSON(connectionStringURL, myJSONobject, function (data) {
                hideImage();
                setTimeout(function () {
                    showSuccessPopUp(true, data);
                }, 1000);
                if (getLocal("NavigateTo") == "Sub") {
                    $.mobile.changePage("woNeedingAttention.html", "fade");
                }
                else if (getLocal("NavigateTo") == "Main") {
                    $.mobile.changePage("woInvoiceApproval.html", "fade");
                }
                else {
                    $.mobile.changePage("dashboard.html", "fade");
                }
            });
        } else {
            setTimeout(function () {
                hideImage();
                showErrorPopUp(true, noNetworkTranslation);
            }, 1000);
        }
    }

    if (getLocal("approvalOption") == '3') {
        loadingImage();
        var myJSONobject = {
            "databaseID": decryptStr(getLocal("DatabaseID")),
            "workOrderNumber": getLocal("SelectedWorkOrder"),
            "employeeNumber": getLocal("EmployeeNumber"),
            "databaseName": decryptStr(getLocal("databaseName")),
            "language": getLocal("Language"),
            "seq": getLocal("seq"),
            "gpsLocation": getLocal("GPSLocation")
        };
        var connectionStringURL = standardAddress + "GetMenuItems.svc/ApprovePreWorkOrder";
        if (navigator.onLine) {
            $.postAjaxJSON(connectionStringURL, myJSONobject, function (data) {
                hideImage();
                setTimeout(function () {
                    showSuccessPopUp(true, data);
                }, 1000);
                if (getLocal("NavigateTo") == "Sub") {
                    $.mobile.changePage("woNeedingAttention.html", "fade");
                }
                else if (getLocal("NavigateTo") == "Main") {
                    $.mobile.changePage("woPreApproval.html", "fade");
                }
                else {
                    $.mobile.changePage("dashboard.html", "fade");
                }
            });
        } else {
            setTimeout(function () {
                hideImage();
                showErrorPopUp(true, noNetworkTranslation);
            }, 1000);
        }
    }

    if (getLocal("approvalOption") == '4') {
        loadingImage();
        var myJSONobject = {
            "databaseID": decryptStr(getLocal("DatabaseID")),
            "workOrderNumber": getLocal("SelectedWorkOrder"),
            "employeeNumber": getLocal("EmployeeNumber"),
            "databaseName": decryptStr(getLocal("databaseName")),
            "language": getLocal("Language"),
            "seq": getLocal("seq"),
            "gpsLocation": getLocal("GPSLocation")
        };
        var connectionStringURL = standardAddress + "GetMenuItems.svc/ApproveNTEWorkOrder";
        if (navigator.onLine) {
            hideImage();
            $.postAjaxJSON(connectionStringURL, myJSONobject, function (data) {
                setTimeout(function () {
                    showSuccessPopUp(true, data);
                }, 1000);
                $.mobile.changePage("woNeedingAttention.html", "fade");
            });
        } else {
            setTimeout(function () {
                hideImage();
                showErrorPopUp(true, noNetworkTranslation);
            }, 1000);
        }
    }

}

//Method to reject Approvals
function rejectConfirm() {
    //Invoice approval
    if (navigator.onLine) {
        var errorMessage = '';
        var validationSuccess = 1;
        if (getLocal("approvalOption") == '2') {
            if ($("#rejectionReasonDropDown").val() == "-1" && $("#rejectCommentTextArea").val() == '') {
                validationSuccess = 0;
                errorMessage = getTranslatedValue("reasonCommentRequiredLabel");
            }
            else if ($("#rejectionReasonDropDown").val() == "-1") {
                validationSuccess = 0;
                errorMessage = getTranslatedValue("rejectReasontRequiredLabel");
            }
            else if ($("#rejectCommentTextArea").val() == '') {
                validationSuccess = 0;
                errorMessage = getTranslatedValue("commentRequiredLabel");
            }

            if (validationSuccess == 1) {
                loadingImage();
                var myJSONobject = {
                    "databaseID": decryptStr(getLocal("DatabaseID")),
                    "workOrderNumber": getLocal("SelectedWorkOrder"),
                    "employeeNumber": getLocal("EmployeeNumber"),
                    "rejectionComments": $("#rejectCommentTextArea").val(),
                    "rejectionReason": $("#rejectionReasonDropDown").val(),
                    "language": getLocal("Language"),
                    "databaseName": decryptStr(getLocal("databaseName")),
                    "seq": getLocal("seq"),
                    "gpsLocation": getLocal("GPSLocation")
                };
                var connectionStringURL = standardAddress + "GetMenuItems.svc/RejectInvoiceWorkOrder";
                if (navigator.onLine) {
                    $.postAjaxJSON(connectionStringURL, myJSONobject, function (data) {

                        hideImage();
                        setTimeout(function () {
                            showSuccessPopUp(true, data);
                        }, 1000);
                        if (getLocal("NavigateTo") == "Sub") {
                            $.mobile.changePage("woNeedingAttention.html", "fade");
                        }
                        else if (getLocal("NavigateTo") == "Main") {
                            $.mobile.changePage("woInvoiceApproval.html", "fade");
                        }
                        else {
                            $.mobile.changePage("dashboard.html", "fade");
                        }
                    });
                } else {
                    setTimeout(function () {
                        hideImage();
                        showErrorPopUp(true, noNetworkTranslation);
                    }, 1000);
                }
            }
            else {
                $("#commentRequiredLabel").show();
                $("#commentRequiredLabel").html(errorMessage)
            }
        }
        // Pre-Approvals
        if (getLocal("approvalOption") == '3') {
            loadingImage();
            var myJSONobject = {
                "databaseID": decryptStr(getLocal("DatabaseID")),
                "workOrderNumber": getLocal("SelectedWorkOrder"),
                "employeeNumber": getLocal("EmployeeNumber"),
                "rejectionComments": $("#rejectCommentTextArea").val(),
                "databaseName": decryptStr(getLocal("databaseName")),
                "language": getLocal("Language"),
                "seq": getLocal("seq"),
                "gpsLocation": getLocal("GPSLocation")
            };
            var connectionStringURL = standardAddress + "GetMenuItems.svc/RejectPreWorkOrder";
            if (navigator.onLine) {
                $.postAjaxJSON(connectionStringURL, myJSONobject, function (data) {

                    hideImage();
                    setTimeout(function () {
                        showSuccessPopUp(true, data);
                    }, 1000);
                    if (getLocal("NavigateTo") == "Sub") {
                        $.mobile.changePage("woNeedingAttention.html", "fade");
                    }
                    else if (getLocal("NavigateTo") == "Main") {
                        $.mobile.changePage("woPreApproval.html", "fade");
                    }
                    else {
                        $.mobile.changePage("dashboard.html", "fade");
                    }
                });
            } else {
                setTimeout(function () {
                    hideImage();
                    showErrorPopUp(true, noNetworkTranslation);
                }, 1000);
            }
        }

        // NTE- Approvals
        if (getLocal("approvalOption") == '4') {
            if ($("#rejectCommentTextArea").val() != '') {
                loadingImage();
                var myJSONobject = {
                    "databaseID": decryptStr(getLocal("DatabaseID")),
                    "workOrderNumber": getLocal("SelectedWorkOrder"),
                    "employeeNumber": getLocal("EmployeeNumber"),
                    "rejectionComments": $("#rejectCommentTextArea").val(),
                    "databaseName": decryptStr(getLocal("databaseName")),
                    "language": getLocal("Language"),
                    "seq": getLocal("seq"),
                    "gpsLocation": getLocal("GPSLocation")
                };
                var connectionStringURL = standardAddress + "GetMenuItems.svc/RejectNTEWorkOrder";
                if (navigator.onLine) {
                    $.postAjaxJSON(connectionStringURL, myJSONobject, function (data) {

                        hideImage();
                        setTimeout(function () {
                            showSuccessPopUp(true, data);
                        }, 1000);
                        $.mobile.changePage("woNeedingAttention.html", "fade");
                    });
                } else {
                    setTimeout(function () {
                        hideImage();
                        showErrorPopUp(true, noNetworkTranslation);
                    }, 1000);
                }
            }
            else {
                $("#commentRequiredLabel").show();
                $("#commentRequiredLabel").html(getTranslatedValue("commentRequiredLabel"))
            }
        }
    } else {
        setTimeout(function () {
            hideImage();
            showErrorPopUp(true, noNetworkTranslation);
        }, 1000);
    }
}

$.postAjaxJSON = function (url, data, func) {
    if (navigator.onLine) {
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
                cache: false,
                data: JSON.stringify(data),
                success: function (result, textStatus, jqXHR) {
                    hideImage();
                    RemoveRequest(jqXHR.ID);
                    func(result);
                },
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

                    if ($.mobile.activePage.attr('id') === 'changePwdPage') {
                        clearChangePasswordFields();
                    }
                    return;
                }
            });
        currentRequest.Request.ID = GenerateGuid();
        ajaxCalls.push(currentRequest);
    } else {
        setTimeout(function () {
            hideImage();
            showErrorPopUp(true, noNetworkTranslation);
        }, 1000);
    }
};

/****************************Work Order Needing Attention End***********************/


function dashboardBack() {
    setTimeout(function () {
        $.mobile.changePage("dashboard.html", "fade");
    }, 500);
}

/**
* Get the recently Serviced Work Orders
*/
function recentServicedOrders() {

    loadingImage();
    var connectionStringURL = standardAddress + "GetMenuItems.svc/LoadRoldexMenuData";
    var dbID = getLocal("DatabaseID");
    var dbName = decryptStr(getLocal("databaseName"));
    var seqID = getLocal("seq");
    var myJSONobject = {
        "databaseID": decryptStr(dbID),
        "screenType": getLocal("systemProjectId"),
        "seq": seqID,
        "pageNum": "1",
        "projectID": getLocal("projectId"),
        "databaseName": decryptStr(getLocal("databaseName")),
        "language": getLocal("Language"),
        "screenName": getLocal("selectedScreen"),
        "clientId": decryptStr(getLocal("MSIClientCode"))
    };
    if (navigator.onLine) {
        $.postJSON(connectionStringURL, myJSONobject, function (data) {
            $('.recentServiceOrdersList').html('');

            console.log(data);
            if (data != null) {

                for (var i = 0; i < data.length - 1; i++) {

                    //$(".recentServiceOrdersList").append('<li><a href="#" onclick="woDetail(\'' + data[i].WorkOrderNumber + '\')" data-corners="false" id="menu' + i + '"><h2>' + data[i].WorkOrderNumber + ' </h2><p><strong>Assigned Name:' + data[i].AssignedName + '</strong></p></a></li>').listview('refresh');
                    $(".recentServiceOrdersList").append('<li><a href="#" onclick="woDetail(\'' + data[i].WorkOrderNumber + '\')" data-corners="false" id="menu' + i + '"><h2 class="custMargin">' + data[i].WorkOrderNumber + ' </h2>'
                                                        + '<p><strong>' + getTranslatedValue("AssignedName") + ': ' + (IsStringNullOrEmpty(data[i].AssignedName) ? "" : data[i].AssignedName) + '</strong></p>'
                                                        + '<p class="ui-li-aside"><strong>' + getTranslatedValue("StatusLabel") + ': ' + (IsStringNullOrEmpty(data[i].Status) ? "" : data[i].Status) + '</strong></p>'
                                                        + '<p>' + (decryptStr(getLocal("MSIClientCode")) === "IO" ? getTranslatedValue("BuildingLabelIO") : getTranslatedValue("BuildingLabel")) + ': '
                                                        + (IsStringNullOrEmpty(data[i].Building) ? "" : data[i].Building) + '</strong></p>'
                                                        + '<p>' + getTranslatedValue("DateEntered") + ': ' + (IsStringNullOrEmpty(data[i].DateEntered) ? "" : data[i].DateEntered + ' ' + (IsStringNullOrEmpty(data[i].TimeZone) ? "" : data[i].TimeZone)) + '</strong></p>'
                                                        + '<p> <font style="white-space:normal !important;">' + (decryptStr(getLocal("MSIClientCode")) === "IO" ? getTranslatedValue("ProbelmDescriptionLabelIO") : getTranslatedValue("ProbelmDescriptionLabel"))
                                                        + ': ' + (data[i].ProblemDescription.length > 100 ? data[i].ProblemDescription.substring(0, 100) : data[i].ProblemDescription) + '</strong></font></p>'
                                                        + '</a></li>').listview('refresh');
                }
            }
            if (parseInt(data[data.length - 1].TotalNumberOfRecords) - (1 * 10) > 0) {
                $("#moreRecentWorkOrdersButton").show();
            }
            else if (parseInt(data[data.length - 1].TotalNumberOfRecords) - (1 * 10) == -10) {
                $(".ms-norecentserviceorders-info").show();
                $("#moreRecentWorkOrdersButton").hide();
            }
            else {
                $("#moreRecentWorkOrdersButton").hide();
            }
            hideImage();
        });
    } else {
        setTimeout(function () {
            hideImage();
            showErrorPopUp(true, noNetworkTranslation);
        }, 1000);
    }
    //postJSONrecentOrders(connectionStringURL, myJSONobject);
}

/**
* @connectionStringURL - the url to get recent serviced orders
* @myJSONobject - the data is passing as JSONObject
*/
function postJSONrecentOrders(connectionStringURL, myJSONobject) {
    loadingImage();
    if (navigator.onLine) {
        $.ajax({
            type: "POST",
            url: connectionStringURL,
            data: JSON.stringify(myJSONobject),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {

                //console.log(data);
                hideImage();
                var menuData = JSON.parse(data);
                $('.recentServiceOrdersList').html('');
                for (var i = 0; i < menuData.length - 1; i++) {

                    $(".recentServiceOrdersList").append('<li><a href="#" onclick="woDetail(\'' + menuData[i].WorkOrderNumber + '\')" data-corners="false" id="menu' + i + '"><h2 class="custMargin">' + menuData[i].WorkOrderNumber + ' </h2>'
                                                    + '<p><strong>' + getTranslatedValue("AssignedName") + ': ' + (IsStringNullOrEmpty(menuData[i].AssignedName) ? "" : menuData[i].AssignedName) + '</strong></p>'
                                                    + '<p class="ui-li-aside"><strong>' + getTranslatedValue("StatusLabel") + ': ' + (IsStringNullOrEmpty(menuData[i].Status) ? "" : menuData[i].Status) + '</strong></p>'
                                                    + '<p>' + (decryptStr(getLocal("MSIClientCode")) === "IO" ? getTranslatedValue("BuildingLabelIO") : getTranslatedValue("BuildingLabel"))
                                                    + ': ' + (IsStringNullOrEmpty(menuData[i].Building) ? "" : menuData[i].Building) + '</strong></p>'
                                                    + '<p>' + getTranslatedValue("DateEntered") + ': ' + (IsStringNullOrEmpty(menuData[i].DateEntered) ? "" : menuData[i].DateEntered + ' ' + (IsStringNullOrEmpty(menuData[i].TimeZone) ? "" : menuData[i].TimeZone)) + '</strong></p>'
                                                    + '<p> <font style="white-space:normal !important;">' + (decryptStr(getLocal("MSIClientCode")) === "IO" ? getTranslatedValue("ProbelmDescriptionLabelIO") : getTranslatedValue("ProbelmDescriptionLabel"))
                                                    + ': ' + (data[i].ProblemDescription.length > 100 ? data[i].ProblemDescription.substring(0, 100) : data[i].ProblemDescription) + '</strong></font></p>'
                                                    + '</a></li>').listview('refresh');
                }
                if (menuData.length > 0) {
                    if (parseInt(menuData[menuData.length - 1].TotalNumberOfRecords) - (1 * 10) > 0) {
                        $("#moreRecentWorkOrdersButton").show();
                    }
                    else if (parseInt(menuData[menuData.length - 1].TotalNumberOfRecords) - (1 * 10) == -10) {
                        $(".ms-norecentserviceorders-info").show();
                        $("#moreRecentWorkOrdersButton").hide();
                    }
                    else {
                        $("#moreRecentWorkOrdersButton").hide();
                    }
                }
                else {
                    $("#moreRecentWorkOrdersButton").hide();
                    $(".ms-norecentserviceorders-info").hide();
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
    } else {
        setTimeout(function () {
            hideImage();
            showErrorPopUp(true, noNetworkTranslation);
        }, 1000);
    }
}

/**
* @obj - To load more recent serviced orders
*/
function loadMoreRecentServiceOrders(obj) {
    loadingImage();
    var pageNumber = parseInt($("#recentOrders").find("#" + obj.id).attr('data-nextPage')) + 1;
    var connectionStringURL = standardAddress + "GetMenuItems.svc/LoadRoldexMenuData";
    var dbID = getLocal("DatabaseID");
    var dbName = getLocal("databaseName");
    var seqID = getLocal("seq");
    var myJSONobject = {
        "databaseID": decryptStr(dbID),
        "screenType": getLocal("systemProjectId"),
        "seq": seqID,
        "pageNum": pageNumber,
        "projectID": getLocal("projectId"),
        "databaseName": decryptStr(getLocal("databaseName")),
        "language": getLocal("Language"),
        "screenName": getLocal("selectedScreen"),
        "clientId": decryptStr(getLocal("MSIClientCode"))
    };
    if (navigator.onLine) {
        $.postJSON(connectionStringURL, myJSONobject, function (data) {
            hideImage();
            $("#recentOrders").find("#" + obj.id).attr('data-nextPage', pageNumber);
            if (data != null) {
                for (var i = 0; i < data.length - 1; i++) {
                    //$(".recentServiceOrdersList").append('<li><a href="#" onclick="woDetail(\'' + data[i].WorkOrderNumber + '\')" data-corners="false" id="menu' + i + '"><h2>' + data[i].WorkOrderNumber + ' </h2><p><strong>Assigned Name:' + data[i].AssignedName + '</strong></p></a></li>').listview('refresh');
                    $(".recentServiceOrdersList").append('<li><a href="#" onclick="woDetail(\'' + data[i].WorkOrderNumber + '\')" data-corners="false" id="menu' + i + '"><h2 class="custMargin">' + data[i].WorkOrderNumber + ' </h2>'
                                                        + '<p><strong>' + getTranslatedValue("AssignedName") + ': ' + (IsStringNullOrEmpty(data[i].AssignedName) ? "" : data[i].AssignedName) + '</strong></p>'
                                                        + '<p class="ui-li-aside"><strong>' + getTranslatedValue("StatusLabel") + ': ' + (IsStringNullOrEmpty(data[i].Status) ? "" : data[i].Status) + '</strong></p>'
                                                        + '<p>' + (decryptStr(getLocal("MSIClientCode")) === "IO" ? getTranslatedValue("BuildingLabelIO") : getTranslatedValue("BuildingLabel"))
                                                        + ': ' + (IsStringNullOrEmpty(data[i].Building) ? "" : data[i].Building) + '</strong></p>'
                                                        + '<p>' + getTranslatedValue("DateEntered") + ': ' + (IsStringNullOrEmpty(data[i].DateEntered) ? "" : data[i].DateEntered + ' ' + (IsStringNullOrEmpty(data[i].TimeZone) ? "" : data[i].TimeZone)) + '</strong></p>'
                                                        + '<p> <font style="white-space:normal !important;">' + (decryptStr(getLocal("MSIClientCode")) === "IO" ? getTranslatedValue("ProbelmDescriptionLabelIO") : getTranslatedValue("ProbelmDescriptionLabel"))
                                                        + ': ' + (data[i].ProblemDescription.length > 100 ? data[i].ProblemDescription.substring(0, 100) : data[i].ProblemDescription) + '</strong></font></p>'
                                                        + '</a></li>').listview('refresh');
                }
            }
            if (parseInt(data[data.length - 1].TotalNumberOfRecords) - (pageNumber * 10) > 0) {
                $("#moreRecentWorkOrdersButton").show();
            }
            else if (parseInt(data[data.length - 1].TotalNumberOfRecords) - (pageNumber * 10) == -10) {
                $(".ms-norecentserviceorders-info").show();
                $("#moreRecentWorkOrdersButton").hide();
            }
            else {
                $("#moreRecentWorkOrdersButton").hide();
            }
        });
    } else {
        setTimeout(function () {
            hideImage();
            showErrorPopUp(true, noNetworkTranslation);
        }, 1000);
    }
}
/*****************End of recently serviced work orders****************/

/*
* To get Quick Links
*/
function quickLinksDashboard() {

    var menuData = quickLinksData;
    $('.gridLayoutNew').html('');
    var dynamicItem = '<ul class="link">';
    var row = 2;
    if ($(window).height() > 568) {
        row = 3;
    }

    if (menuData.length <= row) {
        if (menuData.length == 3) {
            row = 2;
        }
        else {
            row = 1;
        }
    }

    for (var i = 1; i <= menuData.length; i++) {
        dynamicItem = dynamicItem + '<li  id="quickMenu' + (i) + '" style="background:' + menuData[i - 1].BackColor + '; margin-bottom: 5px;"><h3><a href="#" style="text-decoration: none;" onclick="roldexQuickLinkGrid(this)" data-corners="false"  id="menu' + i + '"><div><img id="quickImage' + i + '" width="44" height="54" src="' + menuData[i - 1].QuickLinkImage + '"><div id="quickCaption' + i + '" style="word-wrap:break-word;text-align:center;color:#FFF;text-shadow:none;font-weight:700;font-size:13px;">' + menuData[i - 1].Caption + ' </div></div></a></h3></li>';
        if (i % row === 0) {
            dynamicItem = dynamicItem + '</ul>';
            $(".content-slider").append(dynamicItem);
            dynamicItem = '<ul class="link">';
        }
        else if (i === menuData.length) {
            dynamicItem = dynamicItem + '</ul>';
            $(".content-slider").append(dynamicItem);
            //dynamicItem = '<ul class="link">';
        }

        // Fix for android
        if (menuData.length == 1) {
            dynamicItem = dynamicItem + '<li  id="quickMenu' + (i) + '" style="background:white; margin-bottom: 5px;"><h3><a href="#" style="text-decoration: none;" data-corners="false"  id="menu' + i + '"><div></div></a></h3></li>';
            dynamicItem = dynamicItem + '</ul>';
            $(".content-slider").append(dynamicItem);
        }
    }
    setTimeout(function () {
        hideImage();
    }, 1200);
}

/**
* @strurl - the url to get recent serviced orders
* @JSONObject - the data is passing as JSONObject
*/
/**
* @quickLinks - To get the quicklinks data
*/
function roldexQuickLinkGrid(quickLinks) {
    setLocal("QuickLinkRequestService", "false");
    var CRSForm = '';
    if (navigator.onLine) {
        if (quickLinks != null) {
            for (index = 1; index < 15; index++) {
                switch (quickLinks.id) {
                    case "menu" + index:
                        setLocal("ProblemCodeNumber", quickLinksData[index - 1]["ProblemCodeNumbers"]);
                        setLocal("ProblemCodeDescription", quickLinksData[index - 1]["ProblemCodeDescription"]);
                        setLocal("Caption", quickLinks.outerText);
                        setLocal("GLAccountNumber", quickLinksData[index - 1]["GLAccountNumber"]);
                        CRSForm = quickLinksData[index - 1]["CRSForm"];

                        // For the Custom Quick link with Group and SubGroup. 
                        setLocal("EquipGroupNumberQL", quickLinksData[index - 1]["EquipGroupNumber"]);
                        setLocal("EquipStyleNumberQL", quickLinksData[index - 1]["EquipStyleSeq"]);
                        break;
                }
            }
        }

        // if the problemcodeNumber = 0. Navigate to the RequestService.html, for the Custom problem code.

        var connectionStringURL = standardAddress + "GetMenuItems.svc/CheckForSelpHelp";
        var myJSONobject = {
            "workOrderTransfer": {
                "DatabaseId": decryptStr(getLocal("DatabaseID")),
                "Language": getLocal("Language"),
                "ProblemCodeNumber": getLocal("ProblemCodeNumber"),
                "CallerSeq": getLocal("seq"),
                "SessionId": decryptStr(getLocal("SessionId"))
            }
        };

        $.postJSON(connectionStringURL, myJSONobject, function (data) {
            if (data.IsSelfHelp) {
                var message = " Self Help";

                $.mobile.activePage.find("#selfHelpPopup").remove();

                var template = '<div data-role="popup" id="selfHelpPopup" data-dismissible="false" class="ui-content messagePopup" data-history="false">'
                    + '<div data-role="header" role="banner" class="ui-header ui-bar-inherit success">'
                    + '<h1 class="popupHeaderConfirm">' + getTranslatedValue("SelfHelpHeader") + '</h1></div>'
                    + '<span style="color:red;padding:7px;display:block;">' + getTranslatedValue("SelfHelpLabel") + '</span>'
                    + '<a href="#" onclick="openURLInBrowser(\'' + data.SelfHelpURL + '\')" style="padding:7px"> ' + data.SelfHelpURL + '</a><a href="#" class="ui-btn ui-btn-inline newBtn" data-rel="back">Close</a>'
                    + '</div>';

                $.mobile.activePage.append(template).trigger("create");

                $.mobile.activePage.find("#selfHelpPopup").popup().popup("open"); //.bind({
                //                    true : function () {
                //                        $(this).unbind("popupafterclose").remove();
                //                    }
                //                });
            } else {
                if (getLocal("ProblemCodeNumber") == "0") {
                    setLocal("CRSForm", CRSForm);
                    setLocal("NavigationFromQuickLinks", "1");
                    $.mobile.changePage("RequestService.html", "fade"); // Custom Problemcode. 
                }
                else {
                    $.mobile.changePage("createServiceRequest.html", "fade");
                }
            }
        });

    } else {
        setTimeout(function () {
            hideImage();
            showErrorPopUp(true, noNetworkTranslation);
        }, 1000);
    }
}

//Method used to get count fro work order needing attention
function getCount() {
    //loadingImage();
    var connectionStringURL = standardAddress + "GetMenuItems.svc/WorkOrderNeedingAttentionCount";
    var myJSONobject = {
        "databaseID": decryptStr(getLocal("DatabaseID")),
        "seq": getLocal("seq"),
        "databaseName": decryptStr(getLocal("databaseName")),
        "language": getLocal("Language")
    };

    $.postJSON(connectionStringURL, myJSONobject, function (data) {
        //hideImage();
        setLocal("woCount", data);
    });
}

function openURLInBrowser(url) {
    var ref = cordova.InAppBrowser.open(url, '_blank', 'location=yes');
}

/************* end of quick links ****************/

/**
*expenseBudgetDiagram
*/
function expenseBudgetdrawChart() {

    loadingImage();
    var connectionStringURL = standardAddress + "GetMenuItems.svc/LoadRoldexMenuData";
    var dbID = getLocal("DatabaseID");
    var dbName = decryptStr(getLocal("databaseName"));
    var seqID = getLocal("seq");
    var myJSONobject = {
        "databaseID": decryptStr(dbID),
        "screenType": getLocal("systemProjectId"),
        "seq": seqID,
        "pageNum": "1",
        "projectID": "-1",
        "databaseName": decryptStr(getLocal("databaseName")),
        "language": getLocal("Language"),
        "screenName": getLocal("selectedScreen"),
        "clientId": decryptStr(getLocal("MSIClientCode"))
    };
    if (navigator.onLine) {
        $.ajax({
            type: "POST",
            url: connectionStringURL,
            data: JSON.stringify(myJSONobject),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {

                hideImage();
                if (data != "null" && data != null) {

                    var datanew = JSON.parse(data);
                    var groupList = '', budgetList = '', debitList = '', percentList = '';
                    for (var i in datanew) {
                        var groupName = datanew[i].GroupName;
                        var res = groupName.replace(/[0-9]/g, '');
                        var groupResult = res.replace(/-/g, '');
                        groupList = groupList + '[' + '"' + groupResult + '"' + ',' + datanew[i].BudgetAmount + '],';
                    }
                    if (datanew.length !== 0) {
                        setLocal("datanew", datanew);
                        var arrayNew = "[" + groupList + "]";
                        var arrayRes = arrayNew.replace(/,]/, "]");
                        setLocal("groupList", arrayRes);
                        drawChart();
                    }
                }
                else {
                    $(".ms-norecords-info").show();
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
    } else {
        setTimeout(function () {
            hideImage();
            showErrorPopUp(true, noNetworkTranslation);
        }, 1000);
    }
}
function drawChart() {

    if (navigator.onLine) {

        $.jqplot.config.enablePlugins = true;
        var groupRes = getLocal("groupList");
        var line3 = JSON.parse(groupRes);

        var plot3 = $.jqplot('chart1', [line3], {
            series: [{ renderer: $.jqplot.BarRenderer}],
            axes: {
                xaxis: {
                    renderer: $.jqplot.CategoryAxisRenderer,
                    label: 'GL Group',
                    labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
                    tickRenderer: $.jqplot.CanvasAxisTickRenderer,
                    tickOptions: {
                        angle: -45,
                        fontFamily: 'Courier New',
                        fontSize: '9pt'
                    }

                },
                yaxis: {
                    labelRenderer: $.jqplot.CanvasAxisLabelRenderer
                }
            }
        });

    } else {
        setTimeout(function () {
            hideImage();
            showErrorPopUp(true, noNetworkTranslation);
        }, 1000);
    }
    //    window.onresize = function (event) {
    //        plot3.replot();
    //    }
}
/**********End of Exp Vs Bud ****************/


/*************************Work order Approvals**************************/

//Method to get workorders
function getWorkOrderApprovals(val) {

    loadingImage();
    setLocal("approvalOption", val);
    var connectionStringURL = standardAddress + "GetMenuItems.svc/LoadRoldexMenuData";
    var myJSONobject = {
        "databaseID": decryptStr(getLocal("DatabaseID")),
        "screenType": "1",
        "seq": getLocal("seq"),
        "pageNum": "1",
        "projectID": getLocal("projectId"),
        "approveOption": val,
        "databaseName": decryptStr(getLocal("databaseName")),
        "language": getLocal("Language"),
        "screenName": getLocal("selectedScreen"),
        "clientId": decryptStr(getLocal("MSIClientCode"))
    };
    if (navigator.onLine) {
        $.postJSON(connectionStringURL, myJSONobject, function (data) {

            hideImage();
            if (data.length > 0) {
                $(".ms-norecords-info").hide();
                bindWorkOrderApproval(data);
                if (parseInt(data[0].MaxRow) - (1 * 10) > 0) {
                    $("#woApprovalMoreButton").show();
                }
            }
            else {
                $(".ms-norecords-info").show();
                $("#woApprovalMoreButton").hide();
            }
        });
    } else {
        setTimeout(function () {
            hideImage();
            showErrorPopUp(true, noNetworkTranslation);
        }, 1000);
    }
}

//Method To load more workorders
function loadMoreWoApprovals(obj) {
    loadingImage();
    var pageNumber = parseInt($("#woPreApprovalPage").find("#" + obj.id).attr('data-nextPage')) + 1;
    var connectionStringURL = standardAddress + "GetMenuItems.svc/LoadRoldexMenuData";
    var myJSONobject = {
        "databaseID": decryptStr(getLocal("DatabaseID")),
        "screenType": "1",
        "seq": getLocal("seq"),
        "pageNum": pageNumber,
        "projectID": getLocal("projectId"),
        "approveOption": "3",
        "databaseName": decryptStr(getLocal("databaseName")),
        "language": getLocal("Language"),
        "screenName": getLocal("selectedScreen"),
        "clientId": decryptStr(getLocal("MSIClientCode"))
    };
    if (navigator.onLine) {
        $.postJSON(connectionStringURL, myJSONobject, function (data) {
            hideImage();
            if (data.length > 0) {
                $("#woPreApprovalPage").find("#" + obj.id).attr('data-nextPage', pageNumber);
                bindWorkOrderApproval(data);
                if (parseInt(data[0].MaxRow) - (pageNumber * 10) > 10 || parseInt(data[0].MaxRow) - (pageNumber * 10) > 0) {
                    $("#woApprovalMoreButton").show();
                }
                else {
                    $("#woApprovalMoreButton").hide();
                }
            }
        });
    } else {
        setTimeout(function () {
            hideImage();
            showErrorPopUp(true, noNetworkTranslation);
        }, 1000);
    }
}

//Method to bind Workorders
function bindWorkOrderApproval(data) {

    if (navigator.onLine) {
        var dynamicWoList = '';
        var dynamicPreApprovalList = '';
        var dynamicInvoiceApprovalList = '';
        var dynamicNTEApprovalList = '';
        for (var i = 0; i < data.length; i++) {
            dynamicWoList = dynamicWoList + '<li><a id="' + data[i].WorkOrderNumber + '"  href="#" class="ui-link-inherit" onclick="navigateToApprovalDetails(\'' + data[i].WorkOrderNumber + '\')">'
            + '<h2 class="custMargin">' + data[i].WorkOrderNumber + ' </h2>'
            + '<p><strong>' + getTranslatedValue("assignmentLabel") + ': ' + (IsStringNullOrEmpty(data[i].AssignedName) ? "" : data[i].AssignedName) + '</strong></p>'
            + '<p class="ui-li-aside"><strong>' + getTranslatedValue("statusLabel") + ': ' + (IsStringNullOrEmpty(data[i].Status) ? "" : data[i].Status) + '</strong></p>'
            + '<p>' + getTranslatedValue("BuildingNameLabel") + ': ' + (IsStringNullOrEmpty(data[i].Building) ? "" : data[i].Building) + '</strong></p>'
            + '<p>' + getTranslatedValue("ContractName") + ': ' + (IsStringNullOrEmpty(data[i].FilterSeq) ? "" : data[i].FilterSeq) + '</strong></p>' /*Concept Change*/
            + '<p>' + getTranslatedValue("DateEntered") + ': ' + (IsStringNullOrEmpty(data[i].Dateentered) ? "" : data[i].Dateentered + ' ' + (IsStringNullOrEmpty(data[i].TimeZone) ? "" : data[i].TimeZone)) + '</strong></p>'
            + '<p>' + getTranslatedValue("ProblemDescription") + ': ' + (IsStringNullOrEmpty(data[i].ProblemDescription) ? "" : data[i].ProblemDescription) + '</strong></p>'
            + '</a></li>';
        }
        $("#workOrderList").append(dynamicWoList).listview("refresh");
    } else {
        setTimeout(function () {
            hideImage();
            showErrorPopUp(true, noNetworkTranslation);
        }, 1000);
    }
}

/***********************Work order Approvals End************************/

/***************************Invoice Approvals***************************/
//Method to get workorders
function getInvoiceApprovals(val) {

    setLocal("approvalOption", val);
    loadingImage();
    var connectionStringURL = standardAddress + "GetMenuItems.svc/LoadRoldexMenuData";
    var myJSONobject = {
        "databaseID": decryptStr(getLocal("DatabaseID")),
        "screenType": "1",
        "seq": getLocal("seq"),
        "pageNum": "1",
        "projectID": getLocal("projectId"),
        "approveOption": val,
        "databaseName": decryptStr(getLocal("databaseName")),
        "language": getLocal("Language"),
        "screenName": getLocal("selectedScreen"),
        "clientId": decryptStr(getLocal("MSIClientCode"))
    };
    if (navigator.onLine) {
        $.postJSON(connectionStringURL, myJSONobject, function (data) {

            hideImage();
            if (data.length > 0) {
                $(".ms-norecords-info").hide();
                bindInvoiceApproval(data);
                if (parseInt(data[0].MaxRow) - (1 * 10) > 0) {
                    $("#invoiceApprovalMoreButton").show();
                }
            }
            else {
                $(".ms-norecords-info").show();
                $("#invoiceApprovalMoreButton").hide();
            }
        });
    } else {
        setTimeout(function () {
            hideImage();
            showErrorPopUp(true, noNetworkTranslation);
        }, 1000);
    }
}

//Method To load more workorders
function loadMoreInvoiceApproval(obj) {
    loadingImage();
    var pageNumber = parseInt($("#invoiceApprovalPage").find("#" + obj.id).attr('data-nextPage')) + 1;
    var connectionStringURL = standardAddress + "GetMenuItems.svc/LoadRoldexMenuData";
    var myJSONobject = {
        "databaseID": decryptStr(getLocal("DatabaseID")),
        "screenType": "1",
        "seq": getLocal("seq"),
        "pageNum": pageNumber,
        "projectID": getLocal("projectId"),
        "approveOption": "3",
        "databaseName": decryptStr(getLocal("databaseName")),
        "language": getLocal("Language"),
        "screenName": getLocal("selectedScreen"),
        "clientId": decryptStr(getLocal("MSIClientCode"))
    };
    if (navigator.onLine) {
        $.postJSON(connectionStringURL, myJSONobject, function (data) {
            hideImage();
            if (data.length > 0) {
                $("#invoiceApprovalPage").find("#" + obj.id).attr('data-nextPage', pageNumber);
                bindInvoiceApproval(data);
                if (parseInt(data[0].MaxRow) - (pageNumber * 10) > 10 || parseInt(data[0].MaxRow) - (pageNumber * 10) > 0) {
                    $("#invoiceApprovalMoreButton").show();
                }
                else {
                    $("#invoiceApprovalMoreButton").hide();
                }
            }
        });
    } else {
        setTimeout(function () {
            hideImage();
            showErrorPopUp(true, noNetworkTranslation);
        }, 1000);
    }

}

//Method to bind Workorders
function bindInvoiceApproval(data) {
    if (navigator.onLine) {
        var dynamicWoList = '';
        var dynamicPreApprovalList = '';
        var dynamicInvoiceApprovalList = '';
        var dynamicNTEApprovalList = '';
        for (var i = 0; i < data.length; i++) {
            dynamicWoList = dynamicWoList + '<li><a id="' + data[i].WorkOrderNumber + '"  href="#" class="ui-link-inherit" onclick="navigateToDetails(\'' + data[i].WorkOrderNumber + '\')">'
            + '<h2 class="custMargin">' + data[i].WorkOrderNumber + ' </h2>'
            + '<p><strong>' + getTranslatedValue("assignmentLabel") + ': ' + (IsStringNullOrEmpty(data[i].AssignedName) ? "" : data[i].AssignedName) + '</strong></p>'
            + '<p class="ui-li-aside"><strong>' + getTranslatedValue("statusLabel") + ': ' + (IsStringNullOrEmpty(data[i].Status) ? "" : data[i].Status) + '</strong></p>'
            + '<p>' + getTranslatedValue("BuildingNameLabel") + ': ' + (IsStringNullOrEmpty(data[i].Building) ? "" : data[i].Building) + '</strong></p>'
            + '<p>' + getTranslatedValue("ContractName") + ': ' + (IsStringNullOrEmpty(data[i].FilterSeq) ? "" : data[i].FilterSeq) + '</strong></p>' /*Concept Change*/
            + '<p>' + getTranslatedValue("DateEntered") + ': ' + (IsStringNullOrEmpty(data[i].Dateentered) ? "" : data[i].Dateentered + ' ' + (IsStringNullOrEmpty(data[i].TimeZone) ? "" : data[i].TimeZone)) + '</strong></p>'
            + '<p>' + getTranslatedValue("ProblemDescription") + ': ' + (IsStringNullOrEmpty(data[i].ProblemDescription) ? "" : data[i].ProblemDescription) + '</strong></p>'
            + '</a></li>';
        }
        $("#workOrderList").append(dynamicWoList).listview("refresh");
    } else {
        setTimeout(function () {
            hideImage();
            showErrorPopUp(true, noNetworkTranslation);
        }, 1000);
    }
}


function navigateToApprovalDetails(workOrderNumber) {
    setLocal("SelectedWorkOrder", workOrderNumber);
    if (navigator.onLine) {
        $.mobile.changePage("workOrderApproval.html", "fade");
    } else {
        setTimeout(function () {
            showErrorPopUp(true, noNetworkTranslation);
        }, 1000);
    }
}

/*************************Invoice Approvals End*************************/

//function GetDashboardMenu() {
//    //loadingImage();
//    var dbID = decryptStr(getLocal("DatabaseID"));
//    var dbName = decryptStr(getLocal("databaseName"));
//    var seqID = getLocal("seq");
//    var JSONObject = { "databaseID": dbID,
//        "databaseName": dbName,
//        "seq": seqID,
//        "language": getLocal("Language")
//    };
//    var strurl = standardAddress + "GetMenuItems.svc/GetRoldexMenu";
//    if (navigator.onLine) {
//        $.postJSON(strurl, JSONObject, function (data) {
//            //hideImage();
//            
//            if (data !== null) {
//                return data;
//                //$(".ms-norecords-info").hide();
//                //bindDashboardMenus(data);
//            }
//            hideImage();
//        });
//    } else {
//        setTimeout(function () {
//            hideImage();
//            showErrorPopUp(true, noNetworkTranslation);
//        }, 1000);
//    }

//}


