/**
* Feedback Screen - To provide feedback for an work order
*/
function feedbackForm() {
    $("#feedbackSearch").on("click", function () {


        if ($("#woNumberFeedback").val() == '') {
            showErrorPopUp(true, getTranslatedValue("WorkOrderNumberEmptyLabel"));
            $("#woNumberFeedback").val('');
            return false;
        }

        var securityId = securityError($("#woNumberFeedback"));
        if (securityId == "") {
            return false;
        }

        var connectionStringURL = standardAddress + "ViewWorkOrderDetail.svc/ViewWorkOrder";
        var myJSONobject = {
            "worderNum": securityId,
            "databaseID": decryptStr(getLocal("DatabaseID")),
            "intFilter": "0",
            "seq": getLocal("seq"),
            "databaseName": decryptStr(getLocal("databaseName")),
            "language": getLocal("Language"),
            "sessionId": decryptStr(getLocal("SessionId"))
        };



        $.postJSON(connectionStringURL, myJSONobject, function (data) {
            if (getLocal("AllowFeedbackToCompletedWOsOnly") != null) {
                if (getLocal("AllowFeedbackToCompletedWOsOnly").toLowerCase() == "true") {
                    if (data.WorkOrderDetailsCollection[0].Status != null) {
                        if (!data.WorkOrderDetailsCollection[0].Status.startsWith("C")) {
                            showErrorPopUp(true, securityId + ': ' + getTranslatedValue("WONotCompleteMessageRegions"));
                            return false;
                        }
                    }
                }
            }
            var strurl = standardAddress + "ProvideFeedback.svc/GetFeedbackQuestions";
            var myJsonObject = {
                "databaseID": decryptStr(getLocal("DatabaseID")),
                "workOrderNum": securityId,
                "seq": getLocal("seq"),
                "databaseName": decryptStr(getLocal("databaseName")),
                "language": getLocal("Language")

            };
            var feedId = $("#woNumberFeedback").val();
            setLocal("woID", securityId);
            postFeedbackJSON(strurl, myJsonObject, securityId);
        });
    });
}

///**
//* @strurl - the url to get feedback questions list
//* @JSONObject - the data is passing as JSONObject
//*/
//function postFeedbackJSON(strurl, myJsonObject) {
//    $.ajax({
//        type: "POST",
//        url: strurl,
//        data: JSON.stringify(myJsonObject),
//        contentType: "application/json; charset=utf-8",
//        dataType: "json",
//        success: function (data) {
//            setLocal("feedbackData", data);
//            if (data == 'Invalid work order number') {
//                showErrorPopUp(true, getTranslatedValue("WorkOrderNumberInvalidLabel"));
//            } else {
//                $.mobile.changePage("feedbackInfo.html", "fade");
//            }
//        },
//        error: function (xhr, textStatus, jqXHR) {
//            showErrorPopUp(true, jqXHR);
//        }
//    });
//}

/**
* @strurl - the url to get feedback questions list
* @myJsonObject - the data is passing as JSONObject
* @id - workorder id
*/
function postFeedbackJSON(strurl, myJsonObject, id) {
    //loadingImage();
    setLocal("woID", id);

    if (navigator.onLine) {
        $.ajax({
            type: "POST",
            url: strurl,
            data: JSON.stringify(myJsonObject),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {

                hideImage();
                setLocal("feedbackData", data);
                if (data == 'Invalid work order number') {
                    showErrorPopUp(true, getTranslatedValue("WorkOrderNumberInvalidLabel"));
                } else {
                    $.mobile.changePage("feedbackInfo.html", "fade");
                }
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
* To get feedback Information
*/
function feedbackInfo() {

    if (navigator.onLine) {
        $("#contactInfoTable").html('');
        $("#ratingInfoDetails").html('');
        var feedbackData = getLocal("feedbackData");
        var callerName = decryptStr(getLocal("Username"));
        var phoneNumber = getLocal("PhoneNumber");
        var datanew = JSON.parse(feedbackData);
        var woID = getLocal("woID");

        $("#contactInfoTable").append('<tr><td class="left-block">' + getTranslatedValue("WONumberLabel") + '</td><td class="right-block">' + (IsStringNullOrEmpty(woID) ? "" : woID) + '</td></tr>' +
      '<tr><td class="left-block"><label class="custMandatory" id="nameLabel" style="color:Red;">*</label><label class="custMandatory">' + getTranslatedValue("NameLabel") + '</label></td><td class="right-block"><input type="text" id="callerName" value="' + (IsStringNullOrEmpty(callerName) ? "" : callerName) + '"></td></tr>' +
      '<tr><td class="left-block"><span id="phoneLabel" style="color:Red;">*</span><span>' + getTranslatedValue("PhoneNumberLabel") + '</span></td><td class="right-block"><input type="text" id="phoneNumber" value="' + (IsStringNullOrEmpty(phoneNumber) ? "" : phoneNumber) + '"></td></tr>');
        setLocal("questionList", datanew);
        $("#callerName").textinput();
        $("#phoneNumber").textinput();
        for (var i in datanew) {
            var labelText = '<div class="ui-field-contain"><label for="select-native-1">' + (IsStringNullOrEmpty(datanew[i].QuestionText) ? "" : datanew[i].QuestionText) + '</label>';
            var selectDropdown = '<select name="selectFeedback" id="' + (IsStringNullOrEmpty(datanew[i].QuestionId) ? "" : datanew[i].QuestionId) + '">';
            var optionText = '';
            setLocal("dropDownFeedback", datanew[i].FeedbackQuestionoptions.length);
            for (var j in datanew[i].FeedbackQuestionoptions) {
                optionText = optionText + '<option value="' + (IsStringNullOrEmpty(datanew[i].FeedbackQuestionoptions[j].PointValue) ? "" : datanew[i].FeedbackQuestionoptions[j].PointValue) + '">' + (IsStringNullOrEmpty(datanew[i].FeedbackQuestionoptions[j].OptionText) ? "" : datanew[i].FeedbackQuestionoptions[j].OptionText) + '</option>';
            }
            selectDropdown = selectDropdown + optionText + '</select>';
            labelText = labelText + selectDropdown + '</div>';
            $("#ratingInfoDetails").append(labelText);
            $("#" + datanew[i].QuestionId).selectmenu();
        }
        hideImage();
    } else {
        setTimeout(function () {
            hideImage();
            showErrorPopUp(true, noNetworkTranslation);
        }, 1000);
    }
}

/**
* To save feedback Information
*/
function feedbackDataSave() {
    loadingImage();
    setLocal("callerName", $("#callerName").val());
    setLocal("phoneNo", $("#phoneNumber").val());
    var woID = getLocal("woID");
    var callerName = getLocal("secStrName");
    var phoneNumber = getLocal("secStrPhone");
    var empNo = getLocal("EmployeeNumber");
    var seq = getLocal("seq");
    var dbId = decryptStr(getLocal("DatabaseID"));
    var dbName = decryptStr(getLocal("databaseName"));
    var WOFeedbackGradeThreshold = decryptStr(getLocal("WOFeedbackGradeThreshold"));
    var questions = JSON.parse(getLocal("feedbackData"));
    var feedbackOption = '';
    var negativeFeedback = '';
    var positiveFeedback = '';
    if (decryptStr(getLocal("NegativeFeedbackEmail")) != null) {
        negativeFeedback = decryptStr(getLocal("NegativeFeedbackEmail"));
    }

    if (decryptStr(getLocal("PositiveFeedbackEmail")) != null) {
        positiveFeedback = decryptStr(getLocal("PositiveFeedbackEmail"));
    }

    for (var i = 0; i < questions.length; i++) {
        var text = $("#" + questions[i].QuestionId + " option:selected").text();
        var value = $("#" + questions[i].QuestionId + " option:selected").val();
        feedbackOption = feedbackOption + '{ "QuestionId": "' + questions[i].QuestionId + '", "QuestionOptionText": "' + text + '", "QuestionOptionPoints": "' + value + '" },';
    }
    feedbackOption = '[' + feedbackOption + ']';
    feedbackOption = feedbackOption.replace(',]', ']');
    //console.log(feedbackOption);
    setLocal("feedbackOptionSel", feedbackOption);
    var comments = $("#feedbackComments").val();
    var commentsSec = getLocal("secStrCmt");
    //setLocal("comments", comments);
    var contactReq = $('#contactMe:checked').val();
    var chekedContact = $("#contactMe").is(":checked");
    setLocal("contactCheck", chekedContact);
    var myJsonObject = {
        "databaseID": dbId,
        "databaseName": dbName,
        "userFeedback": { "EmployeeNumber": empNo, "WorkOrderNum": woID, "Seq": seq, "CallerName": callerName, "CallerPhoneNo": phoneNumber, "Comments": commentsSec, "ContactMe": chekedContact, "WorkOrFeedbackGradeThreshold": WOFeedbackGradeThreshold, "NegativeFeedbackEmail": negativeFeedback, "PositiveFeedbackEmail": positiveFeedback, "SessionId": decryptStr(getLocal("SessionId")) },
        "feedbackData": eval('(' + feedbackOption + ')'),
        "language": getLocal("Language"),
        "gpsLocation": getLocal("GPSLocation")
    };
    var strurl = standardAddress + "ProvideFeedback.svc/SaveFeedbackDetails";
    if (navigator.onLine) {
        $.ajax({
            type: "POST",
            url: strurl,
            data: JSON.stringify(myJsonObject),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                hideImage();
                var feedNo = JSON.parse(data);
                setLocal("feedbackDetail", data);
                $.mobile.changePage("feedbackDetail.html", "fade");

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

function control() {
    dB.transaction(function (ts) {
        ts.executeSql('SELECT ItemValue FROM ConfigCRS where Item="WOFeedbackShowContactCheckbox"', [],
                        function (ts, results) {

                            setLocal('WOFeedbackShowContactCheckbox', results.rows.item(0).ItemValue);
                            if (decryptStr(getLocal("WOFeedbackShowContactCheckbox")) == 'True') {
                                $("#contactMe").parent().show();
                            } else {
                                $("#contactMe").parent().hide();
                            }

                        },
                        function (e, m, s) { log(e.status); });
    });
}
/**
* To Get Full deails of feedback Information for an workorder
*/
function feedbackDetail() {
    if (navigator.onLine) {
        $("#feedbackDetailTable").html('');
        $("#ratingDetails").html('');
        var feedbackDetails = JSON.parse(getLocal("feedbackDetail"));
        var woID = getLocal("woID");
        var feedbackData = getLocal("feedbackData");
        var callerName = getLocal("secStrName");
        var phoneNumber = getLocal("secStrPhone");
        var datanew = JSON.parse(feedbackData);
        var feedbackNumber = getLocal("FeedbackNumber");
        $("#feedbackCommentsDetail").html('');
        if (getLocal("contactCheck") == 'true') {
            var contactMe = "Yes";
        } else {
            var contactMe = "No";
        }
        $("#feedbackDetailTable").append('<tr><td class="left-block">' + getTranslatedValue("FeedbackNumberLabel") + '</td><td class="right-block">' + (IsStringNullOrEmpty(feedbackDetails[0].FeedbackId) ? "" : feedbackDetails[0].FeedbackId) + '</td></tr>' + '<tr><td class="left-block">' + getTranslatedValue("FeedbackWorkorderNumberLabel") + '</td><td class="right-block">' + (IsStringNullOrEmpty(woID) ? "" : woID) + '</td></tr>' +
      '<tr><td class="left-block">' + getTranslatedValue("ContactLabel") + '</td><td class="right-block">' + (IsStringNullOrEmpty(callerName) ? "" : callerName) + '</td></tr>' +
      '<tr><td class="left-block">' + getTranslatedValue("PhoneLabel") + '</td><td class="right-block">' + (IsStringNullOrEmpty(phoneNumber) ? "" : phoneNumber) + '</td></tr>' +
      '<tr><td class="left-block">' + getTranslatedValue("RequestContactLabel") + '</td><td class="right-block">' + (IsStringNullOrEmpty(contactMe) ? "" : contactMe) + '</td></tr>');
        for (var i in feedbackDetails) {
            var labelText = '<div class="ui-field-contain"><label for="select-native-1">' + (IsStringNullOrEmpty(feedbackDetails[i].QuestionText) ? "" : feedbackDetails[i].QuestionText) + '</label>' +
                '<label><strong>' + (IsStringNullOrEmpty(feedbackDetails[i].OptionText) ? "" : feedbackDetails[i].OptionText) + '</strong></label>';
            $("#ratingDetails").append(labelText + '</div>');
        }
        $("#feedbackCommentsDetail").text(getLocal("secStrCmt"));
    } else {
        setTimeout(function () {
            hideImage();
            showErrorPopUp(true, noNetworkTranslation);
        }, 1000);
    }
}

/**
* To provide feedback for recent workorders
* @wid - Work Order id
*/
function feedbackData(wid) {

    setLocal("woID", wid);
    var strurl = standardAddress + "ProvideFeedback.svc/GetFeedbackQuestions";
    var myJsonObject = {
        "databaseID": decryptStr(getLocal("DatabaseID")),
        "workOrderNum": wid,
        "seq": getLocal("seq"),
        "databaseName": decryptStr(getLocal("databaseName")),
        "language": getLocal("Language"),
        "allowFeedbackToCompletedOrdersOnly": decryptStr(getLocal("AllowFeedbackToCompletedWOsOnly"))
    };
    postFeedbackJSON(strurl, myJsonObject);
}

/*******************End of Feedback**************************/

/**
* To get the Service Request History
*/
function serviceHistory() {
    var JSONObject = {
        "databaseID": decryptStr(getLocal("DatabaseID")),
        "seq": getLocal("seq"),
        "databaseName": decryptStr(getLocal("databaseName")),
        "language": getLocal("Language")
    };

    $("#customfilter").html('');
    $("#typeDrop").html('');
    $("#contractDropdownValue").html(''); //Added for Concept change
    var strUrlHistory = standardAddress + "ServieRequestHistory.svc/GetServiceRequestHistory";
    var strurl = standardAddress + "ServieRequestHistory.svc/GetStatusDropdownItems";
    var strurl1 = standardAddress + "ServieRequestHistory.svc/GetCriteriaDropdownItems";
    var strurl2 = standardAddress + "ServieRequestHistory.svc/GetTypeDropdownItems";
    var strurl3 = standardAddress + "ServieRequestHistory.svc/GetContractDropdownItems"; //Added for Concept change

    GetContractForCaller();

    var today = new Date();
    var priorDate = new Date();
    var currdateNew = formatDate(today);
    priorDate.setDate(priorDate.getDate() - 30)
    var prevMonth = formatDate(priorDate);

    var fromDateFormated = Dateformat(prevMonth);
    var toDateFormated = Dateformat(currdateNew);

    $("#datefrom").val(fromDateFormated);
    $("#dateto").val(toDateFormated);

    if (getLocal("workOrderNo") !== null) {
        $("#orderno").val(getLocal("workOrderNo"));
    } else {
        $("#orderno").val('');
    }
    if (getLocal("dateFrom") !== null) {
        if (getLocal("dateFrom") == "") {
            $("#datefrom").val(fromDateFormated);
        } else {
            var fromDateFormatedLocal = Dateformat(getLocal("dateFrom"));
            $("#datefrom").val(fromDateFormatedLocal);
        }
    } else {
        $("#datefrom").val(fromDateFormated);
    }

    if (getLocal("dateTo") !== null) {
        if (getLocal("dateTo") == "") {
            $("#dateto").val(toDateFormated);
        } else {
            var toDateFormatedLocal = Dateformat(getLocal("dateTo"));
            $("#dateto").val(toDateFormatedLocal);
        }
    } else {
        $("#dateto").val(toDateFormated);
    }

    var recordsPerPage = $("#recordsPerPage").val(parseInt(decryptStr(getLocal('DefaultPageSize'))));

    if (getLocal("rowsPerPage") !== null) {

        recordsPerPage = $("#recordsPerPage").val(getLocal("rowsPerPage"));
    }

    if (getLocal("typeDropDown") !== null) {

        $("#typeDrop").val(getLocal("typeDropDown")).selectmenu("refresh");
    } else {
        setTimeout(function () {
            $("#typeDrop option[value='Select']").attr('selected', 'selected');
            $("#typeDrop").selectmenu("refresh");
        }, 2000);

    }

    if (getLocal("statusDrop") !== null) {
        setTimeout(function () {
            $("#historyStatus").val(getLocal("statusDrop"));
            $("#historyStatus").selectmenu("refresh");
        }, 1000);
    } else {

        setTimeout(function () {
            $("#historyStatus option[value='Select']").attr('selected', 'selected');
            $("#historyStatus").selectmenu("refresh");
        }, 1000);
    }

    if (getLocal("criteriaDropText") !== null) {
        $("#customfilter").val(getLocal("criteriaDropText"));
        $("#customfilter").selectmenu("refresh");
    } else {
        setTimeout(function () {
            $("#customfilter option[value='-1']").attr('selected', 'selected');
            $("#customfilter").selectmenu("refresh");
        }, 2000);
    }

    if (getLocal("criteriaActualCost") !== null) {
        $("#actual").val(getLocal("criteriaActualCostText"));
    } else {
        setTimeout(function () {
            $("#actual option[value='Select']").attr('selected', 'selected');
            $("#actual").selectmenu("refresh");
        }, 1000);
    }

    if (getLocal("criteriaText") !== null) {
        $("#criteria").val(getLocal("criteriaText"));
    } else {
        $("#criteria").val('');
    }

    if (getLocal("isNullChecked") === 'true') {
        $("#from2").textinput("disable");
        $("#to2").textinput("disable");
        $("#from2").val(Dateformat(getLocal("dateOpenedFrom")));
        $("#to2").val(Dateformat(getLocal("dateOpenedTo")));
        $('#nullCheck').prop('checked', true).checkboxradio('refresh');
    } else {
        $("#from2").textinput("enable");
        $("#to2").textinput("enable");
        $('#nullCheck').prop('checked', false).checkboxradio('refresh');

        if (getLocal("dateOpenedFrom") !== null) {
            $("#from2").val(Dateformat(getLocal("dateOpenedFrom")));
        } else {
            $("#from2").val('');
        }

        if (getLocal("dateOpenedTo") !== null) {
            $("#to2").val(Dateformat(getLocal("dateOpenedTo")));
        } else {
            $("#to2").val('');
        }

    }



    if (getLocal("rangeFrom") !== null) {
        $("#rangeFrom").val(getLocal("rangeFrom"));
    } else {
        $("#rangeFrom").val('');
    }

    if (getLocal("rangeTo") !== null) {
        $("#rangeTo").val(getLocal("rangeTo"));
    } else {
        $("#rangeTo").val('');
    }

    setLocal("rowsPerPage", $("#recordsPerPage").val());

    setTimeout(function () {

        var sortDirection = "ASC";
        var sortExpression = "";
        var type = "";

        if (decryptStr(getLocal('SortingOrderOfWorkOrders')) === "1") {
            sortDirection = "DESC";
        }

        type = getLocal("typeDropDown");
        sortExpression = "DateEnteredSite";

        var JSONHistoryObject =

		{
		    "historyData": {
		        "DatabaseID": decryptStr(getLocal("DatabaseID")),
		        "Seq": getLocal("seq"),
		        "PageNo": "1",
		        "PageSize": $("#recordsPerPage").val(),
		        "SortExpression": sortExpression,
		        "SortDirection": sortDirection,
		        "Type": type,
		        "WhereCondition": "",
		        "DateFrom": $("#datefrom").val(),
		        "DateTo": $("#dateto").val(),
		        "WorkOrderNum": $("#orderno").val(),
		        "Columns": "",
		        "Status": $("#historyStatus option:selected").val(),
		        "IsNullChecked": getLocal("isNullChecked"),
		        "CustFilter": $("#customfilter option:selected").text(),
		        "CriteriaDropDown": $("#actual option:selected").text(),
		        "CriteriaFromDate": $("#from2").val(),
		        "CriteriaFromRange": $("#rangeFrom").val(),
		        "CriteriaText": $("#criteria").val(),
		        "CriteriaToDate": $("#to2").val(),
		        "CriteriaTomRange": $("#rangeTo").val()

		    },
		    "databaseName": decryptStr(getLocal("databaseName")),
		    "language": getLocal("Language")

		};

        if (navigator.onLine) {
            ajaxTimeOutHistory(strUrlHistory, JSONHistoryObject);
        } else {
            setTimeout(function () {
                hideImage();
                showErrorPopUp(true, noNetworkTranslation);
            }, 1000);
        }

    }, 1000);


    function GetContractForCaller() 
    {
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
        else {
            setTimeout(function () {
                showErrorPopUp(true, noNetworkTranslation);
            }, 1000);
        }

    }


    if (navigator.onLine) {
        $.ajax({
            type: "POST",
            url: strurl1,
            data: JSON.stringify(JSONObject),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                var dropDownData = JSON.parse(data);
                $("#customfilter").append('<option value="-1">--' + getTranslatedValue("Select") + '--</option>');
                for (var i in dropDownData) {
                    $("#customfilter").append('<option value="' + dropDownData[i].ValueField + '">' + dropDownData[i].TextField + '</option>');
                    $('#customfilter').selectmenu('refresh');
                }

                if (getLocal("criteriaDrop") !== null) {
                    getLocal("criteriaShow");
                    var criteriaHistoryDrop = getLocal("criteriaDrop");

                    setTimeout(function () {
                        $('#customfilter').val(getLocal("criteriaDrop"));
                        $('#customfilter').selectmenu('refresh');
                    }, 3000);
                    if (criteriaHistoryDrop == '3' || criteriaHistoryDrop == '7' || criteriaHistoryDrop == '2') {
                        $("#Criteria").show();
                        if (getLocal("criteriaText") !== null) {
                            $("#criteria").val(getLocal("criteriaText"));
                        }
                        $("#ActualCost").hide();
                        $("#DateOpened").hide();
                    }
                    if (criteriaHistoryDrop == '5' || criteriaHistoryDrop == '6') {

                        $("#ActualCost").show();
                        $("#Criteria").show();
                        $("#DateOpened").hide();
                        if (getLocal("criteriaActualCost") !== null) {
                            var actualCost = getLocal("criteriaActualCost");
                            setTimeout(function () {
                                $("#actual").val(getLocal("criteriaActualCost"));
                                $("#actual").selectmenu('refresh');
                            }, 2000);

                            if (actualCost == '6') {
                                $("#typeRange").show();
                                $("#Criteria").hide();
                                $("#rangeFrom").val(getLocal("rangeFrom"));
                                $("#rangeTo").val(getLocal("rangeTo"));
                            } else {
                                $("#typeRange").hide();
                                $("#Criteria").show();
                                $("#Criteria").val(getLocal("criteriaText"));
                            }
                        }
                    }
                    if (criteriaHistoryDrop == '4') {
                        $("#Criteria").hide();
                        $("#ActualCost").hide();
                        $("#DateOpened").show();
                        $("#nullCheck").on("change", function () {
                            if (this.checked) {
                                setLocal("isNullChecked", $('#nullCheck').is(':checked'));
                                $("#from2").textinput("disable");
                                $("#to2").textinput("disable");
                            }
                            else {
                                setLocal("isNullChecked", $('#nullCheck').is(':checked'));
                                $("#from2").textinput("enable");
                                $("#to2").textinput("enable");
                                if (getLocal("dateOpenedFrom") !== null) {
                                    $("#from2").val(Dateformat(getLocal("dateOpenedFrom")));
                                }
                                if (getLocal("dateOpenedTo") !== null) {
                                    $("#to2").val(Dateformat(getLocal("dateOpenedTo")));
                                }
                            }
                        });
                    }
                }
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
                return;
            }
        });
    } else {
        setTimeout(function () {
            hideImage();
            showErrorPopUp(true, noNetworkTranslation);
        }, 1000);
    }

    JSONObject = {
                "databaseName": decryptStr(getLocal("databaseName")),
                "language": getLocal("Language")
            };
    if (navigator.onLine) {
        $.ajax({
            type: "POST",
            url: strurl2,
            data: JSON.stringify(JSONObject),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                var dropDownData = JSON.parse(data);
                for (var i in dropDownData) {
                    $("#typeDrop").append('<option value="' + dropDownData[i] + '">' + dropDownData[i] + '</option>');
                }

                $("#typeDrop").selectmenu('refresh', true);

                if (getLocal("typeDropDown") != null) {
                    setTimeout(function () {
                        $('#typeDrop').val(getLocal("typeDropDown"));
                        $('#typeDrop').selectmenu('refresh');
                    }, 1000);
                }
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
                return;
            }
        });
    } else {
        setTimeout(function () {
            hideImage();
            showErrorPopUp(true, noNetworkTranslation);
        }, 1000);
    }

    //Added for Concept change
    if (navigator.onLine) {

        var JSONObject = {
            "databaseID": decryptStr(getLocal("DatabaseID")),
            "seq": getLocal("seq"),
            "databaseName": decryptStr(getLocal("databaseName")),
            "language": getLocal("Language")
        };
        $.ajax({
            type: "POST",
            url: strurl3,
            data: JSON.stringify(JSONObject),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {

                var dropDownData = JSON.parse(data);
                //                for (var i in dropDownData) {
                //                    $("#contractDropdownValue").append('<option value="' + dropDownData[i] + '">' + dropDownData[i] + '</option>');
                //                }

                //                $("#contractDropdownValue").selectmenu('refresh', true);

                //                if (getLocal("typeDropDown") != null) {
                //                    setTimeout(function () {
                //                        $('#contractDropdownValue').val(getLocal("typeDropDown"));
                //                        $('#contractDropdownValue').selectmenu('refresh');
                //                    }, 1000);
                //                }

                $("#contractDropdownValue").append($("<option/>").val(0).text("--Select--"));
                $.each(dropDownData, function () {
                    $("#contractDropdownValue").append($("<option     />").val(this.Contract).text(this.BusUnitName));
                });
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
                return;
            }
        });
    } else {
        setTimeout(function () {
            hideImage();
            showErrorPopUp(true, noNetworkTranslation);
        }, 1000);
    }
//Concept change ends here

    $("#searchHistoryData").on("click", function () {
        if ($("#orderno").val() !== "") {
            var securityIdWoId = securityError($("#orderno"));
            setLocal("secStrWoId", securityIdWoId);
            if (securityIdWoId == "") {
                return false;
            }
        }
        if ($("#recordsPerPage").val() == "") {
            showErrorPopUp(true, getTranslatedValue("RecordsPerPageRequiredFieldValidator"));
            return false;
        }
        if ($("#recordsPerPage").val() !== "") {
            var securityIdPageId = securityError($("#recordsPerPage"));
            setLocal("secStrPageId", securityIdPageId);
            if (securityIdPageId == "") {
                return false;
            }
        }

        var sortDirection = "ASC";
        var sortExpression = "";

        if (decryptStr(getLocal('SortingOrderOfWorkOrders')) === "1") {
            sortDirection = "DESC";
        }
        sortExpression = "DateEnteredSite";

        var JSONObjectUpdated = {
            "historyData": {
                "DatabaseID": decryptStr(getLocal("DatabaseID")),
                "Seq": getLocal("seq"),
                "PageNo": "1",
                "PageSize": securityIdPageId,
                "SortExpression": sortExpression,
                "SortDirection": sortDirection,
                "Type": $("#typeDrop").find(":selected").val(),
                "WhereCondition": "",
                "DateFrom": $("#datefrom").val(),
                "DateTo": $("#dateto").val(),
                "WorkOrderNum": securityIdWoId,
                "Columns": "",
                "Status": $("#historyStatus").find(":selected").val(),
                "FilterSeq": $("#contractDropdownValue").find(":selected").val(), //Added for Concept change
                "IsNullChecked": getLocal("isNullChecked"),
                "CustFilter": $("#customfilter").find(":selected").text(),
                "CriteriaDropDown": $("#actual").find(":selected").text(),
                "CriteriaFromDate": $("#from2").val(),
                "CriteriaFromRange": $("#rangeFrom").val(),
                "CriteriaText": $("#criteria").val(),
                "CriteriaToDate": $("#to2").val(),
                "CriteriaTomRange": $("#rangeTo").val(),
                "ContractFilterSeq": $("#ContractDropDown").val(), 
            },
            "databaseName": decryptStr(getLocal("databaseName")),
            "language": getLocal("Language")
        };

        var StartDate = $("#datefrom").val();
        var EndDate = $("#dateto").val();
        var eDate = new Date(DefaultDateformat(EndDate));
        var sDate = new Date(DefaultDateformat(StartDate));

        if (StartDate != '' && EndDate != '' && sDate > eDate) {
            showErrorPopUp(true, getTranslatedValue("DateErrorMessage"));
            return false;
        }
        if ($("#datefrom").val() === null || $("#datefrom").val() == '') {
            showErrorPopUp(true, getTranslatedValue("FromRequiredFieldValidator"));
            return false;
        }
        if ($("#dateto").val() === null || $("#dateto").val() == '') {
            showErrorPopUp(true, getTranslatedValue("ToRequiredFieldValidator"));
            return false;
        }

        if ($("#customfilter").val() == '4') {
            if (!$('#nullCheck').is(':checked')) {
                if ($("#from2").val() === null || $("#from2").val() == '') {
                    showErrorPopUp(true, getTranslatedValue("CriteriaFromTextboxRangeValidator"));
                    return false;
                }
                if ($("#to2").val() === null || $("#to2").val() == '') {
                    showErrorPopUp(true, getTranslatedValue("CriteriaToTextboxRangeValidator"));
                    return false;
                }
                var StartDateOpened = $("#from2").val();
                var EndDateOpened = $("#to2").val();
                var eDateOpened = new Date(DefaultDateformat(EndDateOpened));
                var sDateOpened = new Date(DefaultDateformat(StartDateOpened));
                if (StartDateOpened != '' && EndDateOpened != '' && sDateOpened > eDateOpened) {
                    showErrorPopUp(true, getTranslatedValue("DateErrorMessage"));
                    return false;
                }
            }
        }
        var numbers = /^[0-9]+$/;
        if (!securityIdPageId.match(numbers)) {
            showErrorPopUp(true, getTranslatedValue("RecordsPerPageRequiredFieldValidator"));
            return false;
        }

        if ($("#customfilter").val() === '6' || $("#customfilter").val() === '5') {
            if ($("#actual").val() === '-1') {
                showErrorPopUp(true, getTranslatedValue("CriteriaDropDownListRequiredFieldValidator"));
                return false;
            }

            if ($("#actual").val() === '6') {
                if (!$("#rangeFrom").val().match(numbers)) {
                    showErrorPopUp(true, getTranslatedValue("RangeFromRequiredFieldValidator") + " " + getTranslatedValue("CriteriaRangeValidator"));
                    return false;
                }
                if (!$("#rangeTo").val().match(numbers)) {
                    showErrorPopUp(true, getTranslatedValue("RangeToRequiredFieldValidator") + " " + getTranslatedValue("CriteriaRangeValidator"));
                    return false;
                }
            } else {
                if (!$("#criteria").val().match(numbers)) {
                    showErrorPopUp(true, getTranslatedValue("CriteriaNumericNumberRequiredFieldValidator"));
                    return false;
                }
            }
        }

        setLocal("workOrderNo", $("#orderno").val());
        setLocal("dateFrom", formatDate(DefaultDateformat($("#datefrom").val())));
        setLocal("dateTo", formatDate(DefaultDateformat($("#dateto").val())));
        setLocal("typeDropDown", $("#typeDrop").find(":selected").val());
        setLocal("statusDrop", $("#historyStatus").find(":selected").val());
        setLocal("criteriaDrop", $("#customfilter").find(":selected").val());
        setLocal("criteriaDropText", $("#customfilter").find(":selected").val());
        setLocal("criteriaActualCost", $("#actual").find(":selected").val());
        setLocal("criteriaActualCostText", $("#actual").find(":selected").val());
        setLocal("criteriaText", $("#criteria").val());
        setLocal("rowsPerPage", securityIdPageId);
        setLocal("dateOpenedFrom", formatDate(DefaultDateformat($("#from2").val())));
        setLocal("dateOpenedTo", formatDate(DefaultDateformat($("#to2").val())));
        setLocal("rangeText", $("#rangeTextId").val());
        setLocal("rangeFrom", $("#rangeFrom").val());
        setLocal("rangeTo", $("#rangeTo").val());


        var strurl = standardAddress + "ServieRequestHistory.svc/GetServiceRequestHistory";
        ajaxTimeOutHistory(strurl, JSONObjectUpdated);
        $("#moreServiceHistoryButton").attr('data-nextPage', '1');

    });

}

/**
* @strUrlHistory - the url to get list of work orders
* @JSONHistoryObject - the data is passing as JSONObject
*/
function ajaxTimeOutHistory(strUrlHistory, JSONHistoryObject) {
    loadingImage();
    if (navigator.onLine) {
        $.postJSON(strUrlHistory, JSONHistoryObject, function (data) {
            hideImage();
            $('.serviceHistoryList').html('');
            for (var i = 0; i < data.length - 1; i++) {
                $(".serviceHistoryList").append('<li><a href="#" onclick="woDetail(\'' + data[i].WorkOrderNumber + '\')" data-corners="false" id="menu' + i + '">'
            + '<h2 class="custMargin">' + data[i].WorkOrderNumber + ' </h2>'
                    + '<p><strong>' + getTranslatedValue("AssignedLabel") + ': ' + (IsStringNullOrEmpty(data[i].Assigned) ? getTranslatedValue("UnknownLabel") : data[i].Assigned) + '</strong></p>'
            + '<p>' + (decryptStr(getLocal("MSIClientCode")) === "IO" ? getTranslatedValue("BuildingLabelIO") : getTranslatedValue("BuildingLabel"))
            + ': ' + (IsStringNullOrEmpty(data[i].Description) ? "" : data[i].Description) + '</p>'
            //+ '<p>' + getTranslatedValue("ContractName") + ': ' + (IsStringNullOrEmpty(data[i].FilterSeq) ? "" : data[i].FilterSeq) + '</p>' //Added for Concept change
            + '<p>' + getTranslatedValue("DateEntered") + ': ' + (IsStringNullOrEmpty(data[i].DateEnteredsite) ? "" : data[i].DateEnteredsite) + '</p>'
            + '<p> <font style="white-space:normal !important;">' + (decryptStr(getLocal("MSIClientCode")) === "IO" ? getTranslatedValue("ProblemDescriptionIO") : getTranslatedValue("ProblemDescription"))
            + ': ' + (IsStringNullOrEmpty(data[i].ProblemDescription) ? "" : (data[i].ProblemDescription.length > 100 ? data[i].ProblemDescription.substring(0, 100) : data[i].ProblemDescription)) + '</font></p>'
            + '<p class="ui-li-aside"><strong>' + getTranslatedValue("StatusLabel") + ': ' + (IsStringNullOrEmpty(data[i].Status) ? "" : data[i].Status) + '</strong></p>'
            + '<p><strong>' + getTranslatedValue("ContractFilterLabel") + ': ' + (IsStringNullOrEmpty(data[i].FilterSeq) ? "" : data[i].FilterSeq) + '</strong></p>'
            + '</a></li>').listview('refresh');
            }

            if (data.length > 0) {
                var pageNo = parseInt(getLocal("rowsPerPage"));
                $(".ms-noservicehistory-info").hide();
                if (parseInt(data[data.length - 1].TotalRecordsCount) - (1 * pageNo) > 0) {
                    $("#moreServiceHistoryButton").show();
                    $(".ms-noservicehistory-info").hide();
                } else if (parseInt(data[data.length - 1].TotalRecordsCount) - (1 * pageNo) == -pageNo) {
                    $(".ms-noservicehistory-info").show();
                    $("#moreServiceHistoryButton").hide();
                } else {
                    $("#moreServiceHistoryButton").hide();
                }
            } else {
                $(".ms-noservicehistory-info").show();
                $("#moreServiceHistoryButton").hide();
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
* @obj - to load more work orders
*/
function loadMoreServiceHistory(obj) {
    loadingImage();
    var pageNumber = parseInt($("#serviceHistory").find("#" + obj.id).attr('data-nextPage')) + 1;
    var connectionStringURL = standardAddress + "ServieRequestHistory.svc/GetServiceRequestHistory";
    var dbID = decryptStr(getLocal("DatabaseID"));
    var dbName = decryptStr(getLocal("databaseName"));
    var seqID = getLocal("seq");
    var sortDirection = "ASC";
    var sortExpression = "";

    if (decryptStr(getLocal('SortingOrderOfWorkOrders')) === "1") {
        sortDirection = "DESC";
    }
    sortExpression = "DateEnteredSite";

    var myJSONobject = {
        "historyData": {
            "DatabaseID": dbID,
            "Seq": seqID,
            "PageNo": pageNumber,
            "PageSize": getLocal("rowsPerPage"),
            "SortExpression": sortExpression,
            "SortDirection": sortDirection,
            "Type": $("#typeDrop").find(":selected").val(),
            "DateFrom": $("#datefrom").val(),
            "DateTo": $("#dateto").val(),
            "WorkOrderNum": $("#orderno").val(),
            "Status": $("#historyStatus").find(":selected").val(),
            "IsNullChecked": getLocal("isNullChecked"),
            "CustFilter": $("#customfilter").find(":selected").text(),
            "CriteriaDropDown": $("#actual").find(":selected").text(),
            "CriteriaFromDate": $("#from2").val(),
            "CriteriaFromRange": $("#rangeFrom").val(),
            "CriteriaText": $("#criteria").val(),
            "CriteriaToDate": $("#to2").val(),
            "CriteriaTomRange": $("#rangeTo").val()
            
        },
        "databaseName": decryptStr(getLocal("databaseName")),
        "language": getLocal("Language")
    };
    if (navigator.onLine) {
        $.postJSON(connectionStringURL, myJSONobject, function (data) {
            hideImage();
            $("#serviceHistory").find("#" + obj.id).attr('data-nextPage', pageNumber);

            if (data.length > 0) {
                for (var i = 0; i < data.length - 1; i++) {
                    $(".serviceHistoryList").append('<li><a href="#" onclick="woDetail(\'' + data[i].WorkOrderNumber + '\')" data-corners="false" id="menu' + i + '">'
            + '<h2 class="custMargin">' + data[i].WorkOrderNumber + ' </h2>'
                        + '<p><strong>' + getTranslatedValue("AssignedLabel") + ': ' + (IsStringNullOrEmpty(data[i].Assigned) ? getTranslatedValue("UnknownLabel") : data[i].Assigned) + '</strong></p>'
            + '<p>' + (decryptStr(getLocal("MSIClientCode")) === "IO" ? getTranslatedValue("BuildingLabelIO") : getTranslatedValue("BuildingLabel"))
            + ': ' + (IsStringNullOrEmpty(data[i].Description) ? "" : data[i].Description) + '</p>'
            + '<p>' + getTranslatedValue("ContractName") + ': ' + (IsStringNullOrEmpty(data[i].FilterSeq) ? "" : data[i].FilterSeq) + '</p>' //Added for Concept change
            + '<p>' + getTranslatedValue("DateEntered") + ': ' + (IsStringNullOrEmpty(data[i].DateEnteredsite) ? "" : data[i].DateEnteredsite) + '</p>'
            + '<p> <font style="white-space:normal !important;">' + (decryptStr(getLocal("MSIClientCode")) === "IO" ? getTranslatedValue("ProblemDescriptionIO") : getTranslatedValue("ProblemDescription"))
            + ': ' + (IsStringNullOrEmpty(data[i].ProblemDescription) ? "" : (data[i].ProblemDescription.length > 100 ? data[i].ProblemDescription.substring(0, 100) : data[i].ProblemDescription)) + '</font></p>'
            + '<p class="ui-li-aside"><strong>' + getTranslatedValue("StatusLabel") + ': ' + (IsStringNullOrEmpty(data[i].Status) ? "" : data[i].Status) + '</strong></p>'
            + '</a></li>').listview('refresh');
                }
            }
            if (data.length > 0) {
                if (parseInt(data[data.length - 1].TotalRecordsCount) - (pageNumber * getLocal("rowsPerPage")) > 0) {
                    $("#moreServiceHistoryButton").show();
                } else {
                    $("#moreServiceHistoryButton").hide();
                }
            }
            else {
                $("#moreServiceHistoryButton").hide();
            }

        });
    } else {
        setTimeout(function () {
            hideImage();
            showErrorPopUp(true, noNetworkTranslation);
        }, 1000);
    }
}

/********************End of service hostory*****************************************/


//********************************------- Start of Edit Profile ------*********************************//

var region;
var division;
var district;
var area;
var profileNote = '';
var customerNumber = getLocal("CustomerNumber");
var customerSiteNumber = getLocal("CustomerSiteNumber");
var previousSelectedCountry;
var tempCountryList;

function editProfile() {  //start of editProfile

    try {
        //declaring global variables
        var callerName = decryptStr(getLocal("Username"));
        var mailId = decryptStr(getLocal("EmailAddress"));
        var phoneNum = getLocal("PhoneNumber");
        var callerType = getLocal("TypeOfCaller");
        var callerTypeSeq = getLocal("CallerTypeSeq");
        var callerCompany = getLocal("CallerCompany");
        var profNotes = "";  //Need to assign
        var RecentRequestCollection = new Array();

        //for reset button functionality
        var fullName;
        var phoneNumber;
        var search;
        var category;
        var stateCountry;
        var building;
        var floor;
        var room;
        var location;
        var costCenter;

        //Creating contact details div of user
        $("#EmailAddressLabel").text(getTranslatedValue("EmailAddressLabel"));
        $("#EmailaddressValue").text(IsStringNullOrEmpty(mailId) ? "" : mailId);
        $("#FullNameLabel").html('<span id="FullNameMandatoryLabel" style="color: Red" >*</span>' + getTranslatedValue("FullNameLabel"));
        $("#callerName").val(IsStringNullOrEmpty(callerName) ? "" : callerName);

        if (decryptStr(getLocal('CustomPhoneLabelEditProfile')) === "1") {
            $("#PhoneNumberLabel").text(getTranslatedValue("CustomPhoneNumberLabel"));
        }
        else {
            $("#PhoneNumberLabel").text(getTranslatedValue("PhoneNumberLabel"));
        }

        $("#phoneNum").val(IsStringNullOrEmpty(phoneNum) ? "" : phoneNum);
        $("#ProfileNotesLabel").text(getTranslatedValue("ProfileNotesLabel"));
        $("#txtProfileNotes").val(IsStringNullOrEmpty(profileNote) ? (IsStringNullOrEmpty(getLocal("ProfileNotesForEditProf")) ? "" : getLocal("ProfileNotesForEditProf")) : profileNote);

        if (getLocal("selectedLocation") == "null") {
            setLocal("selectedLocation", "");
        }

        $("#searchLbl").text(getTranslatedValue("SearchLabel") + ":");
        $("#CategoryLabel").text(getTranslatedValue("CategoryLabel") + ":");
        $("#Level5").text(getTranslatedValue("LocationWithinAreaLabel") + ":");
        $("#callerLocation").val(IsStringNullOrEmpty(getLocal("selectedLocation")) ? "" : getLocal("selectedLocation"));

        SetSiteLabelsForEditProfile();

        var optCallerTypeText = '';

        $("#btnUpdateProfile").val(getTranslatedValue("SaveButton"));
        $("#btnRestProfile").val(getTranslatedValue("ResetButton"));

        //setting html5 control style
        setTimeout(function () {
            $("#optCountry").selectmenu();
            $("#optBuilding").selectmenu();
            $("#optFloor").selectmenu();
            $("#optRoom").selectmenu();
            $("#optCostCenter").selectmenu();
            $("#callerName").textinput();
            $("#phoneNum").textinput();
            $("#callerLocation").textinput();
            $("#txtSearchPrf").textinput();
            $("#optCategoryPrf").selectmenu();
            $("#txtProfileNotes").textinput();
            $("#optCallerType").selectmenu();
            $("#txtProfCostCenterCompany").textinput();
            $("#txtProfCostCenter").textinput();
        }, 3000);

        $('#optCategoryPrf option[value="0"]').remove();

        //confing items for edit profile
        CheckConfigItemsForEditProfile();

        //Binding Country list to dropdown
        // BindEditProfCountryDropDown();

        if (!IsStringNullOrEmpty(decryptStr(getLocal("LoadCallerLevels")))) {
            if (decryptStr(getLocal("LoadCallerLevels")).toLowerCase() == "true") {
                GetCallerLocationDetailsForEditProfile();
            }
            else {
                BindEditProfCountryDropDown();
                CostCenterValuesForEditProfile();
            }
        }

        if (!IsStringNullOrEmpty(getLocal("LocationDetail"))) {
            $("#callerLocation").val(getLocal("LocationDetail"));
        }
        else {
            $("#callerLocation").val("");
        }
        fullName = $("#callerName").val();
        phoneNumber = $("#phoneNum").val();
        profileNote = $("#txtProfileNotes").val();
        search = $("#txtSearchPrf").val();
        category = $("#txtSearchPrf").val();
        location = $("#callerLocation").val();
    }
    catch (e) {
        console.log('error');
    }

} //end of editProfile method

//--------------------------
//Function to check configuration items
function CheckConfigItemsForEditProfile() {
    //ProfileShowNotes
    if (!IsStringNullOrEmpty(decryptStr(getLocal("ProfileShowNotes")))) {
        if (decryptStr(getLocal("ProfileShowNotes")).toLowerCase() == "false") {
            $("#ProfileNotesRow").hide();
        }
    }

    //SetLevelsWhenEditProfile item
    if (decryptStr(getLocal("SetLevelsWhenEditProfile")) != null && decryptStr(getLocal("SetLevelsWhenEditProfile")) != "") {
        if (decryptStr(getLocal("SetLevelsWhenEditProfile")).toLowerCase() == "false") {

        }
    }

    //ShowCostCenter item
    if (decryptStr(getLocal("ShowCostCenter")) != null && decryptStr(getLocal("ShowCostCenter")) != "") {
        if (decryptStr(getLocal("ShowCostCenter")).toLowerCase() == "true") {

        }
        else {
            $("#CostCenterLableProfEdit").hide();
            $("#costCenterDropDown").hide();
            $("#costCenterTextBox").hide();
            $("#CostCenterCompany").hide();
        }
    }

    //ShowLevelSearch item   
    if (!IsStringNullOrEmpty(decryptStr(getLocal("ShowLevelSearch")))) {
        if (decryptStr(getLocal("ShowLevelSearch")).toLowerCase() == "true") {
        }
        else {
            $("#searchEditProfileLevels").hide();
        }
    }
    if (!IsStringNullOrEmpty(decryptStr(getLocal("LockTopThreeLevels")))) {
        if (decryptStr(getLocal("LockTopThreeLevels")).toLowerCase() == "true") {
            $("#optCountry").attr("readonly", true);
            $("#optCountry").parent().addClass("ui-select ui-btn-disabled");

            $("#optBuilding").attr("readonly", true);
            $("#optBuilding").parent().addClass("ui-select ui-btn-disabled");

            $("#optFloor").attr("readonly", true);
            $("#optFloor").parent().addClass("ui-select ui-btn-disabled");
        }
    }

    if (!IsStringNullOrEmpty(decryptStr(getLocal("LockTopTwoLevels")))) {
        if (decryptStr(getLocal("LockTopTwoLevels")).toLowerCase() == "true") {
            $("#optCountry").attr("readonly", true);
            $("#optCountry").parent().addClass("ui-select ui-btn-disabled");

            $("#optBuilding").attr("readonly", true);
            $("#optBuilding").parent().addClass("ui-select ui-btn-disabled");
        }
    }

    if (!IsStringNullOrEmpty(decryptStr(getLocal("LockLevelsForLockedProfile")))) {
        if (decryptStr(getLocal("LockLevelsForLockedProfile")).toLowerCase() == "true") {
            $("#txtSearchPrf").attr("readonly", true);
            $("#txtSearchPrf").parent().addClass("ui-select ui-btn-disabled");

            $("#optCategoryPrf").attr("readonly", true);
            $("#optCategoryPrf").parent().addClass("ui-select ui-btn-disabled");

            $("#optCountry").attr("readonly", true);
            $("#optCountry").parent().addClass("ui-select ui-btn-disabled");

            $("#optBuilding").attr("readonly", true);
            $("#optBuilding").parent().addClass("ui-select ui-btn-disabled");

            $("#optFloor").attr("readonly", true);
            $("#optFloor").parent().addClass("ui-select ui-btn-disabled");

            $("#optRoom").attr("readonly", true);
            $("#optRoom").parent().addClass("ui-select ui-btn-disabled");

        }
    }
}

//Fuction to check constcenter company default
function CostCenterValuesForEditProfile() {

    if (!(parseInt(decryptStr(getLocal('AcctFrameCallEntry'))) == 8) && !(parseInt(decryptStr(getLocal('AcctFrameCallEntry'))) == 99) && !(parseInt(decryptStr(getLocal('AcctFrameCallEntry'))) == 9)) {

        if (decryptStr(getLocal("ShowCostCenter")).toLowerCase() == "true") {
            $("#CostCenterLableProfEdit").hide();
            $("#costCenterDropDown").hide();
            $("#costCenterTextBox").hide();
            $("#lblProfileCostCenteCompany").text('CostCenter:'); // Need to get it from translations 
            $("#txtProfCostCenterCompany").val(getLocal('CostCenter'));
        }
    }
    else if (parseInt(decryptStr(getLocal('AcctFrameCallEntry'))) == 99 && parseInt(decryptStr(getLocal('CallEntryCostCenterDefaultSource'))) == 0) {
        $("#CostCenterCompany").hide();
        $("#costCenterTextBox").hide();
        if (!IsStringNullOrEmpty(decryptStr(getLocal("LoadCallerLevels")))) {
            if (decryptStr(getLocal("LoadCallerLevels")).toLowerCase() == "true") {
                BindCostCenterOnEditProfPageLoad();
            }
            else {
                var defaultValue = '<option value="-1">--Select--</option>';
                $("#optCostCenter").html('');
                $("#optCostCenter").append(defaultValue);
                setTimeout(function () {
                    $("#optCostCenter").val("-1");
                    $("#optCostCenter").selectmenu("refresh");
                }, 1000);
            }
        }
    }
    else if (parseInt(decryptStr(getLocal('AcctFrameCallEntry'))) == "8") {
        $("#lblProfileCostCenteCompany").text('Company:');
        $("#txtProfCostCenterCompany").val(getLocal('Company'));
        $("#CostCenteProfile").text('CostCenter:');
        $("#txtProfCostCenter").val(getLocal('CostCenter'));
        $("#costCenterDropDown").hide();
    }
    else if (parseInt(decryptStr(getLocal('AcctFrameCallEntry'))) == "9") {
        $("#lblProfileCostCenteCompany").text('CostCenter:');
        $("#txtProfCostCenterCompany").val(getLocal('Company') + " " + getLocal('CostCenter'));
        $("#CostCenteProfile").text('Company:');
        $("#costCenterTextBox").hide();
        var CompanyListArray = decryptStr(getLocal('Companies')).split(';');
        var optionCountryText = '';
        for (var i = 0; i < CompanyListArray.length; i++) {
            optionCountryText = optionCountryText + '<option value="' + CompanyListArray[i] + '">' + CompanyListArray[i] + '</option>';
        }
        $("#optCostCenter").append(optionCountryText);
        $("#optCostCenter").selectmenu("refresh");        
    }
    else {
        $("#CostCenterLableProfEdit").hide();
        $("#costCenterDropDown").hide();
        $("#costCenterTextBox").hide();
        $("#CostCenterCompany").hide();        
    }

    hideImage();
}



function GetCallerLocationDetailsForEditProfile() {
    var level = '';
    level = "10";
    var strurl = standardAddress + "CreateServiceRequest.svc/GetCallerDefaultLocationDetails";
    var myJsonObject = {
        "databaseID": decryptStr(getLocal("DatabaseID")),
        "customerNumber": getLocal("CustomerNumber"),
        "customerSiteNumber": getLocal("CustomerSiteNumber"),
        "databaseName": decryptStr(getLocal("databaseName")),
        "language": getLocal("Language"),
        "seq": getLocal("seq"),
        "level": level
    };


    $.postJSON(strurl, myJsonObject, function (data) {
        region = data[0][0].RegionNumber;
        division = data[0][0].DivisionNumber;
        district = data[0][0].DistrictNumber;
        area = data[0][0].CustomerNumber + "ì" + data[0][0].CustomerSiteNumber;

        var optionCountryText = '';
        for (j = 0; j < data[1].length; j++) {
            optionCountryText = optionCountryText + '<option value="' + data[1][j].RegionNumber + '">' + data[1][j].Description + '</option>';
        }

        $("#optCountry").html('');
        $("#optCountry").append(optionCountryText);
        $('#optCountry option').each(function () {
            if (this.value == region) {
                status = true;
            }
        });
        if (status == true || status == "true") {
            $("#optCountry").val(region);
        }
        else {
            $('#optCountry').val("0").selectmenu('refresh');
        }

        regionNumber = region;
        $("#optCountry").selectmenu("refresh", true);
        $("#hiddenLevel1Dropdown").val($("#optCountry").val());

        CostCenterValuesForEditProfile();

        $("#optBuilding").html('');
        var optionBuildingText = '';
        for (j = 0; j < data[2].length; j++) {
            optionBuildingText = optionBuildingText + '<option value="' + data[2][j].DivisionNumber + '">' + data[2][j].Description + '</option>';
        }
        $("#optBuilding").append(optionBuildingText);        
        $("#optBuilding").val(division);
        building = division;
        $("#optBuilding").selectmenu("refresh", true);
        $("#hiddenLevel2Dropdown").val($("#optBuilding").val());

        $("#optFloor").html('');
        var optionFloorText = '';
        for (j = 0; j < data[3].length; j++) {
            optionFloorText = optionFloorText + '<option value="' + data[3][j].DistrictNumber + '">' + data[3][j].Description + '</option>';
        }
        $("#optFloor").append(optionFloorText);
        $("#optFloor").val(district);
        floor = district;
        $("#optFloor").selectmenu("refresh");
        $("#hiddenLevel3Dropdown").val($("#optFloor").val());

        $("#optRoom").html('');
        var optionRoomText = '';
        for (j = 0; j < data[4].length; j++) {
            optionRoomText = optionRoomText + '<option value="' + data[4][j].CustomerSiteNumber + '">' + data[4][j].Description + '</option>';
        }

        $("#optRoom").append(optionRoomText);
        $("#optRoom option[value='" + area + "']").attr('selected', 'selected');
        room = area;
        $("#optRoom").selectmenu("refresh");
        $("#hiddenLevel4Dropdown").val($("#optRoom").val());
    });
}

//---------------------------------------
//Function to get caller location on page load.
function GetCallerLocationForEditProfile() {

    var strurl = standardAddress + "EditProfile.svc/GetCallerLocation";
    var myJsonObject = {
        "databaseID": decryptStr(getLocal("DatabaseID")),
        "customerNumber": getLocal("CustomerNumber"),
        "customerSiteNumber": getLocal("CustomerSiteNumber"),
        "databaseName": decryptStr(getLocal("databaseName")),
        "language": getLocal("Language")
    };

    $.postJSON(strurl, myJsonObject, function (data) {

        region = data[0].ItemValue;
        division = data[1].ItemValue;
        district = data[2].ItemValue;
        area = data[3].ItemValue;

        //BindEditProfCountryDropDown();
        var strurl = standardAddress + "EditProfile.svc/GetCountryCityList";
        var myJsonObject = {
            "databaseID": decryptStr(getLocal("DatabaseID")),
            "databaseName": decryptStr(getLocal("databaseName")),
            "language": getLocal("Language")
        };

        var optionCountryText = '';

        $.postJSON(strurl, myJsonObject, function (data) {
            for (var j in data) {
                optionCountryText = optionCountryText + '<option value="' + data[j].RegionNumber + '">' + data[j].Description + '</option>';
            }

            $("#optCountry").html('');
            $("#optCountry").append(optionCountryText);
            $("#optCountry").val(region);
            stateCountry = region;
            regionNumber = region;
            $("#optCountry").selectmenu("refresh");
            $("#hiddenLevel1Dropdown").val($("#optCountry").val());

            BindCostCenterOnEditProfPageLoad();
            //CostCenterValuesForEditProfile();
            BindBuildingOnEditProfPageLoad(regionNumber);
        });
    });
}

//----------------------------
//Function to bind Building details on page load.
function BindBuildingOnEditProfPageLoad(regionNumber) {

    var strurl = standardAddress + "EditProfile.svc/GetBuildingList";
    var myJsonObject = {
        "databaseID": decryptStr(getLocal("DatabaseID")),
        "regionNumber": $("#optCountry").val(), //regionNumber,
        "databaseName": decryptStr(getLocal("databaseName")),
        "language": getLocal("Language")
    };

    $("#optBuilding").html('');
    var optionBuildingText = '';
    if (navigator.onLine) {
        $.postJSON(strurl, myJsonObject, function (data) {

            for (var j in data) {
                optionBuildingText = optionBuildingText + '<option value="' + data[j].DivisionNumber + '">' + data[j].Description + '</option>';
            }
            $("#optBuilding").append(optionBuildingText);
            $("#optBuilding").val(division);
            building = division;
            $("#optBuilding").selectmenu("refresh");
            //            }

            $("#hiddenLevel2Dropdown").val($("#optBuilding").val());
            BindFloorOnEditProfPageLoad(regionNumber);
        });

        //BindFloorOnEditProfPageLoad(RegionNumber);
    }
    else {
        setTimeout(function () {
            hideImage();
            showErrorPopUp(true, noNetworkTranslation);
        }, 1000);
    }
}

//--------------------------
//Function to bind floor details on page load.
function BindFloorOnEditProfPageLoad(regionNumber) {
    var divisionNumber;
    if (getLocal("selectedBuilding") != null) {

        divisionNumber = getLocal("selectedBuilding");
    }
    else {
        divisionNumber = division;
    }

    var strurl = standardAddress + "EditProfile.svc/GetAreaList";

    var myJsonObject = {
        "databaseID": decryptStr(getLocal("DatabaseID")),
        "regionNumber": regionNumber,
        "divisionNumber": divisionNumber,
        "databaseName": decryptStr(getLocal("databaseName")),
        "language": getLocal("Language")
    };

    $("#optFloor").html('');
    var optionFloorText = '';
    if (navigator.onLine) {
        $.postJSON(strurl, myJsonObject, function (data) {
            for (var j in data) {
                optionFloorText = optionFloorText + '<option value="' + data[j].DistrictNumber + '">' + data[j].Description + '</option>';
            }
            $("#optFloor").append(optionFloorText);
            $("#optFloor").val(district);
            floor = district;
            $("#optFloor").selectmenu("refresh");
            //            }

            $("#hiddenLevel3Dropdown").val($("#optFloor").val());
            BindRoomOnEditProfPageLoad(regionNumber, divisionNumber);
        });

        //BindRoomOnEditProfPageLoad(RegionNumber, divisionNumber);
    }
    else {
        setTimeout(function () {
            hideImage();
            showErrorPopUp(true, noNetworkTranslation);
        }, 1000);
    }
}

//-------------------------------
//Function to bind room details on page load.
function BindRoomOnEditProfPageLoad(regionNumber, divisionNumber) {
    var districtNumber;
    if (getLocal("selectedFloor") != null) {
        districtNumber = getLocal("selectedFloor");
    }
    else {
        districtNumber = district;
    }

    var strurl = standardAddress + "EditProfile.svc/GetSiteList";
    var myJsonObject = {
        "databaseID": decryptStr(getLocal("DatabaseID")),
        "regionNumber": regionNumber,
        "divisionNumber": divisionNumber,
        "districtNumber": districtNumber,
        "databaseName": decryptStr(getLocal("databaseName")),
        "language": getLocal("Language")
    };
    //alert(JSON.stringify(myJsonObject));
    $("#optRoom").html('');
    var dropDownItems = '';
    if (navigator.onLine) {
        $.postJSON(strurl, myJsonObject, function (data) {

            for (var j in data) {
                dropDownItems = dropDownItems + '<option value="' + data[j].CustomerSiteNumber + '">' + data[j].Description + '</option>';
            }

            $("#optRoom").append(dropDownItems);
            $("#optRoom").val(area);
            room = area;
            $("#optRoom").selectmenu("refresh");
            //            }
            $("#hiddenLevel4Dropdown").val($("#optRoom").val());
            hideImage();
        });
    }
    else {
        setTimeout(function () {
            hideImage();
            showErrorPopUp(true, noNetworkTranslation);
        }, 1000);
    }
}


function BindEditProfCountryDropDown() {

    var strurl = standardAddress + "EditProfile.svc/GetCountryCityList";
    var myJsonObject = {
        "databaseID": decryptStr(getLocal("DatabaseID")),
        "databaseName": decryptStr(getLocal("databaseName")),
        "language": getLocal("Language")
    };

    var optionCountryText = '';

    $.postJSON(strurl, myJsonObject, function (data) {
        for (var j in data) {
            optionCountryText = optionCountryText + '<option value="' + data[j].RegionNumber + '">' + data[j].Description + '</option>';
        }

        $("#optCountry").html('');
        $("#optCountry").append(optionCountryText);
        $("#optCountry").selectmenu("refresh");
    });
}


//-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -
//Function to bind Cost Center only on page load.
function BindCostCenterOnEditProfPageLoad() {

    var strurl1 = standardAddress + "EditProfile.svc/GetListOfCostCenters";
    var myJsonObject1 = {
        "databaseID": decryptStr(getLocal("DatabaseID")),
        "countryCity": $("#optCountry option:selected").text(),
        "databaseName": decryptStr(getLocal("databaseName")),
        "language": getLocal("Language"),
        "customerNumber": getLocal("CustomerNumber"),
        "customerSiteNumber": getLocal("CustomerSiteNumber"),
        "defaultCostCenter": getLocal("CostCenterProfile")
    };

    var optionText1 = '';
    $("#optCostCenter").html('');
    $.postJSON(strurl1, myJsonObject1, function (data1) {
        for (var j in data1) {
            optionText1 = optionText1 + '<option value="' + data1[j].CostCenter + '">' + data1[j].Description + '</option>';
        }
        tempCountryList = data1;
        $("#optCostCenter").html('');
        $("#optCostCenter").append('<option value="-1">--Select--</option>');
        $("#optCostCenter").append(optionText1);
        if (!IsStringNullOrEmpty(getLocal("CostCenterProfile"))) {
            $("#optCostCenter").val(getLocal("CostCenterProfile"));
            $("#optCostCenter").selectmenu("refresh");
        }
        else {
            $("#optCostCenter").val("-1");
            $("#optCostCenter").selectmenu("refresh");
        }

        $("#hiddenCostCenter").val($("#optCostCenter").val());
        hideImage();
    });
}

//-------------------------------------------------
//Reset button functionality
function ResetEditProfileData() {
    loadingImage();
    ResetCategoryDropDownEditProfile();
    if (!IsStringNullOrEmpty(decryptStr(localStorage.getItem("EmailAddress")))) {
        $("#EmailaddressValue").html(decryptStr(localStorage.getItem("EmailAddress")));
    }
    else {
        $("#EmailaddressValue").html("");
    }

    if (!IsStringNullOrEmpty(decryptStr(localStorage.getItem("Username")))) {
        $("#callerName").val(decryptStr(localStorage.getItem("Username")));
    }
    else {
        $("#callerName").val("");
    }

    if (!IsStringNullOrEmpty(localStorage.getItem("PhoneNumber"))) {
        $("#phoneNum").val(localStorage.getItem("PhoneNumber"));
    }
    else {
        $("#phoneNum").val("");
    }

    if (!IsStringNullOrEmpty(localStorage.getItem("LocationDetail"))) {
        $("#callerLocation").val(localStorage.getItem("LocationDetail"));
    }
    else {
        $("#callerLocation").val("");
    }

    checkResetinRequestService = true;

    if (($('#optCountry').val() != $("#hiddenLevel1Dropdown").val()) || ($('#optCountry').val() != region) || ($('#optBuilding').val() != $("#hiddenLevel2Dropdown").val()) || ($('#optFloor').val() != $("#hiddenLevel3Dropdown").val()) || ($('#optRoom').val() != $("#hiddenLevel4Dropdown").val())) {
        setTimeout(function () {
            if ($('#optCountry').val() == null) {
                BindLevel1DataForeditprofile();
            }
            else {
                if (!IsStringNullOrEmpty($("#hiddenLevel1Dropdown").val())) {
                    $('#optCountry').val($("#hiddenLevel1Dropdown").val());
                    $("#optCountry").selectmenu("refresh");
                }
                if (!IsStringNullOrEmpty(region)) {
                    $('#optCountry').val(region);
                    $("#optCountry").selectmenu("refresh");
                }

                if ($('#optCountry').val() == null) {
                    BindLevel1DataForeditprofile();
                }
                else {
                    BindBuildingEditProfile();
                }

                if (!IsStringNullOrEmpty(decryptStr(getLocal("ShowLevelSearch")))) {
                    if (decryptStr(getLocal("ShowLevelSearch")).toLowerCase() == "true") {
                        if (!IsStringNullOrEmpty($("#txtSearchPrf").val())) {
                            $("#txtSearchPrf").val('');
                            if ($("#optCategoryPrf").val() != "-1" || $("#optCategoryPrf").val() != null) {
                                $("#optCategoryPrf").val("-1");
                                $("#optCategoryPrf").selectmenu("refresh");
                            }
                        }
                    }
                }
            }
        }, 500);
    }
    else {
        checkResetinRequestService = false;
    }

    setTimeout(function () {
        if ($("#optCostCenter").val() != $("#hiddenCostCenter").val()) {
            $('#optCostCenter').selectmenu('refresh');
            BindCostCenterEditProfile();
        }
    }, 300);

    var interval = setTimeout(function () {
        $("body").removeClass('ui-disabled');
        $.mobile.loading('hide');
        clearInterval(interval);
        hideImage();
    }, 10000);
}

//-- -- -- -- -- -- -- -- -- -- -- -- -
//Function to bind Building details on dropdown change /on reset button click
function BindBuildingEditProfile() {

    //building = $("#optBuilding").val();
    $("#optBuilding option:gt(0)").remove();
    $('#optBuilding').selectmenu('refresh');
    $("#optFloor option:gt(0)").remove();
    $('#optFloor').selectmenu('refresh');
    $("#optFloor option[value='0']").remove();
    $('#optFloor').selectmenu('refresh');
    $("#optRoom option:gt(0)").remove();
    $('#optRoom').selectmenu('refresh');
    $("#optRoom option[value='0']").remove();
    $('#optRoom').selectmenu('refresh');

    var select = ''
    if (!IsStringNullOrEmpty(getTranslatedValue("Select1"))) {
        if (getTranslatedValue("Select1").indexOf('-') != -1) {
            select = getTranslatedValue("Select1").split('-')[1];
        }
        else {
            select = getTranslatedValue("Select1")
        }
    }
    //    if ($("#optCountry").val() != "0") {
    if ($("#optCountry").val() != null && $("#optCountry").val() != "" && $("#optCountry").val() != undefined && $("#optCountry option:selected").text() != select) {
        var strurl = standardAddress + "EditProfile.svc/GetBuildingList";
        var myJsonObject = {
            "databaseID": decryptStr(getLocal("DatabaseID")),
            "regionNumber": $("#optCountry").val(),
            "databaseName": decryptStr(getLocal("databaseName")),
            "language": getLocal("Language"),
            "callerSeq": getLocal("seq"),
        };


        var optionText2 = '';
        if (navigator.onLine) {
            $.postJSON(strurl, myJsonObject, function (data) {

                for (var j in data) {
                    optionText2 = optionText2 + '<option value="' + data[j].DivisionNumber + '">' + data[j].Description + '</option>';
                }
                $("#optBuilding").html('');
                $("#optBuilding").append(optionText2);
                $("#optBuilding").selectmenu("refresh");

                if (!IsStringNullOrEmpty($("#hiddenLevel2Dropdown").val()) && checkResetinRequestService == true) {
                    $('#optBuilding').val($("#hiddenLevel2Dropdown").val());
                    setTimeout(function () {
                        //$('#optBuilding').val($("#hiddenLevel2Dropdown").val());
                        $('#optBuilding').selectmenu('refresh');

                        if (!IsStringNullOrEmpty($("#hiddenLevel2Dropdown").val())) {
                            BindFloorEditProfile();
                        }

                    }, 100);
                }
                else {
                    checkResetinRequestService == false;
                }
            });
        }
        else {
            setTimeout(function () {
                hideImage();
                showErrorPopUp(true, noNetworkTranslation);
            }, 1000);
        }
    }
    else {
        //building = $("#optBuilding").val();
        $("#optBuilding option:gt(0)").remove();
        $('#optBuilding').selectmenu('refresh');
        $("#optBuilding option[value='0']").remove();
        $('#optBuilding').selectmenu('refresh');
        $("#optFloor option:gt(0)").remove();
        $('#optFloor').selectmenu('refresh');
        $("#optFloor option[value='0']").remove();
        $('#optFloor').selectmenu('refresh');
        $("#optRoom option:gt(0)").remove();
        $('#optRoom').selectmenu('refresh');
        $("#optRoom option[value='0']").remove();
        $('#optRoom').selectmenu('refresh');
    }
}

//-- -- -- -- -- -- -- -- -- -- -- -- -- --
//Function to bind Floor details on dropdown change /on reset button click
function BindFloorEditProfile() {

    //floor = $("#optFloor").val();
    var strurl = standardAddress + "EditProfile.svc/GetAreaList";
    var myJsonObject = {
        "databaseID": decryptStr(getLocal("DatabaseID")),
        "regionNumber": $("#optCountry").val(),
        "divisionNumber": $("#optBuilding").val(),
        "databaseName": decryptStr(getLocal("databaseName")),
        "language": getLocal("Language")
    };

    var optionText3 = '';
    var select = ''
    if (!IsStringNullOrEmpty(getTranslatedValue("Select1"))) {
        if (getTranslatedValue("Select1").indexOf('-') != -1) {
            select = getTranslatedValue("Select1").split('-')[1];
        }
        else {
            select = getTranslatedValue("Select1")
        }
    }

    if ($("#optBuilding").val() == null || $("#optBuilding").val() == undefined && $("#optBuilding").val() == "" && $("#optBuilding option:selected").text() == select) {
        setTimeout(function () {
            $("#optFloor").html('');
            $("#optFloor").selectmenu("refresh");
            $("#optRoom").html('');
            $("#optRoom").selectmenu("refresh");
        }, 1000);
    }
    else if (navigator.onLine) {
        $.postJSON(strurl, myJsonObject, function (data) {

            for (var j in data) {
                optionText3 = optionText3 + '<option value="' + data[j].DistrictNumber + '">' + data[j].Description + '</option>';
            }
            $("#optFloor").html('');
            $("#optFloor").append(optionText3);
            $("#optFloor").selectmenu("refresh");
            if (!IsStringNullOrEmpty($("#hiddenLevel3Dropdown").val()) && checkResetinRequestService == true) {

                $('#optFloor').val($("#hiddenLevel3Dropdown").val());
                setTimeout(function () {
                    $('#optFloor').selectmenu('refresh');
                    if (!IsStringNullOrEmpty($("#hiddenLevel3Dropdown").val())) {   //$("#optFloor").val()
                        BindRoomEditProfile();
                    }

                }, 100);
            }
            else {
                setTimeout(function () {
                    $("#optFloor").val(0);
                    $('#optFloor').selectmenu('refresh');
                    $("#optRoom").html('');
                    $('#optRoom').selectmenu('refresh');
                }, 100);
                checkResetinRequestService == false;
            }
        });
    }
    else {
        setTimeout(function () {
            hideImage();
            showErrorPopUp(true, noNetworkTranslation);
        }, 1000);
    }
}

//-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
//Function to bind Room details on dropdown change /on reset button click
function BindRoomEditProfile() {
    var strurl = standardAddress + "EditProfile.svc/GetSiteList";
    var myJsonObject = {
        "databaseID": decryptStr(getLocal("DatabaseID")),
        "regionNumber": $("#optCountry").val(),
        "divisionNumber": $("#optBuilding").val(),
        "districtNumber": $("#optFloor").val(),
        "databaseName": decryptStr(getLocal("databaseName")),
        "language": getLocal("Language")
    };


    var optionText4 = '';
    if (navigator.onLine) {
        $.postJSON(strurl, myJsonObject, function (data) {

            for (var j in data) {
                optionText4 = optionText4 + '<option value="' + data[j].CustomerSiteNumber + '">' + data[j].Description + '</option>';
            }
            $("#optRoom").html('');
            $("#optRoom").append(optionText4);
            $("#optRoom").selectmenu("refresh");
            if (!IsStringNullOrEmpty($("#hiddenLevel4Dropdown").val()) && checkResetinRequestService == true) {
                $('#optRoom').val($("#hiddenLevel4Dropdown").val()).selectmenu('refresh');
                checkResetinRequestService = false;
            }
            else {
                checkResetinRequestService == false;
            }
        });
    }
    else {
        setTimeout(function () {
            hideImage();
            showErrorPopUp(true, noNetworkTranslation);
        }, 1000);
    }
}

//-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -
//Function to bind cost center on dropdown change /on reset button click
function BindCostCenterEditProfile() {

    var strurl1 = standardAddress + "EditProfile.svc/GetListOfCostCenters";
    var myJsonObject1 = {
        "databaseID": decryptStr(getLocal("DatabaseID")),
        "countryCity": $("#optCountry option:selected").text(),
        "databaseName": decryptStr(getLocal("databaseName")),
        "language": getLocal("Language")
    };

    var optionText1 = '';
    if (navigator.onLine) {
        $.postJSON(strurl1, myJsonObject1, function (data1) {
            //alert($("#optCountry").text());        
            for (var j in data1) {
                optionText1 = optionText1 + '<option value="' + data1[j].CostCenter + '">' + data1[j].Description + '</option>';
            }
            $("#optCostCenter").html('');
            $("#optCostCenter").append('<option value="-1">--Select--</option>');
            $("#optCostCenter").append(optionText1);
            if (getLocal("selectedCostCenter") != null) {
                //$("#optCostCenter option:selected").text(getLocal("selectedCostCenter"));
                $("#optCostCenter").val(getLocal("selectedCostCenter"));
                costCenter = getLocal("selectedCostCenter");
            }
            else {
                $("#optCostCenter").val(getLocal("CostCenterProfile"));
                costCenter = getLocal("CostCenterProfile");
            }

            if (!IsStringNullOrEmpty($("#hiddenCostCenter").val())) {
                $("#optCostCenter").val($("#hiddenCostCenter").val());
            }
            else {
                $("#optCostCenter").val("-1");
            }

            $("#optCostCenter").selectmenu("refresh");

        });
    }
    else {
        setTimeout(function () {
            hideImage();
            showErrorPopUp(true, noNetworkTranslation);
        }, 1000);
    }
}

//---------------------------
/// Disables the location dropdown based on configuration.
function DisableDropDowns() {
    $("#txtSearchPrf").hide();
    $("#txtSearchPrf").closest("tr").hide();
    $("#optCategoryPrf").hide();
    $("#optCategoryPrf").closest("tr").hide();
    $("#optCountry").hide();
    $("#optCountry").closest("tr").hide();
    $("#optBuilding").hide();
    $("#optBuilding").closest("tr").hide();
    $("#optFloor").hide();
    $("#optFloor").closest("tr").hide();
    $("#optRoom").hide();
    $("#optRoom").closest("tr").hide();
    $("#callerLocation").hide();
    $("#callerLocation").closest("tr").hide();
    $("#optCostCenter").hide();
    $("#optCostCenter").closest("tr").hide();
}

//------------------------------------
/// Function to filter the location dropdwon values based on search critirea entered in Category/Search textbox.
function FilterLocationDropdownEditProfile() {
    if (navigator.onLine) {

        var level;
        var myJsonObject;
        var url = standardAddress + "CreateServiceRequest.svc/BindDropDownData";
        switch ($("#optCategoryPrf").val()) {
            case "0":
                level = 1;
                myJsonObject = {
                    "callerObject": {
                        "DataBaseID": decryptStr(getLocal("DatabaseID")),
                        "Level": level,
                        "SearchString": $("#txtSearchPrf").val(),
                        "DatabaseName": decryptStr(getLocal("databaseName")),
                        "Language": getLocal("Language"),
                        "Seq": getLocal("seq")
                    }
                };
                $.postJSON(url, myJsonObject, function (data) {
                    if (data != null) {
                        $("#optCountry option:gt(0)").remove();

                        $("#optBuilding option:gt(0)").remove();
                        $('#optBuilding').selectmenu('refresh');
                        $("#optBuilding option[value='0']").remove();
                        $('#optBuilding').selectmenu('refresh');
                        $("#optFloor option:gt(0)").remove();
                        $('#optFloor').selectmenu('refresh');
                        $("#optFloor option[value='0']").remove();
                        $('#optFloor').selectmenu('refresh');
                        $("#optRoom option:gt(0)").remove();
                        $('#optRoom').selectmenu('refresh');
                        $("#optRoom option[value='0']").remove();
                        $('#optRoom').selectmenu('refresh');
                        for (index = 0; index < data.length; index++) {
                            var dropdown = document.createElement('option');
                            dropdown.setAttribute("value", data[index]['RegionNumber']);
                            dropdown.innerHTML = data[index]['Description'];
                            $('#optCountry').append(dropdown);
                        }

                        $('#optCountry').selectmenu('refresh');
                    }
                });
                break;
            case "1":
                level = 2;
                if ($('#optCountry').val() != 0 && $('#optCountry').val() != null) {
                    myJsonObject = { "callerObject": { "DataBaseID": decryptStr(getLocal("DatabaseID")), "Level": level, "SearchString": $("#txtSearchPrf").val(), "RegionNumber": $('#optCountry').val() },
                        "databaseName": decryptStr(getLocal("DatabaseID")),
                        "selectedLanguage": getLocal("Language"),
                        "databaseNameVal": decryptStr(getLocal("databaseName"))
                    };
                    $.postJSON(url, myJsonObject, function (data) {
                        if (data != null) {
                            $("#optBuilding option:gt(0)").remove();
                            $('#optBuilding').selectmenu('refresh');
                            for (index = 0; index < data.length; index++) {
                                var dropdown = document.createElement('option');
                                dropdown.setAttribute("value", data[index]['DivisionNumber']);
                                dropdown.innerHTML = data[index]['Description'];
                                $('#optBuilding').append(dropdown);
                            }
                            $('#optBuilding').selectmenu();
                            $("#optFloor").html('');
                            $('#optFloor').selectmenu('refresh');
                            $('#optRoom').html('');
                            $('#optRoom').selectmenu('refresh');
                        }
                    });
                } else {
                    //showErrorPopUp(true, getTranslatedValue("CityRequired"));
                }

                break;
            case "2":
                level = 3;
                if ($('#optCountry').val() != 0 && $('#optCountry').val() != null && $('#optBuilding').val() != 0 && $('#optBuilding').val() != null) {
                    myJsonObject = { "callerObject": { "DataBaseID": decryptStr(getLocal("DatabaseID")), "Level": level, "SearchString": $("#txtSearchPrf").val(), "RegionNumber": $('#optCountry').val(), "DivisionNumber": $('#optBuilding').val() },
                        "databaseName": decryptStr(getLocal("DatabaseID")),
                        "selectedLanguage": getLocal("Language"),
                        "databaseNameVal": decryptStr(getLocal("databaseName"))
                    };
                    $.postJSON(url, myJsonObject, function (data) {
                        if (data != null) {
                            $("#optFloor option:gt(0)").remove();
                            $('#optFloor').selectmenu('refresh');
                            for (index = 0; index < data.length; index++) {
                                var dropdown = document.createElement('option');
                                dropdown.setAttribute("value", data[index]['DistrictNumber']);
                                dropdown.innerHTML = data[index]['Description'];
                                $('#optFloor').append(dropdown);
                            }
                            $('#optFloor').selectmenu();
                            $('#optRoom').html('');
                            $('#optRoom').selectmenu('refresh');
                        }
                    });
                } else {
                    //showErrorPopUp(true, getTranslatedValue("CityAndBuildingRequired"));
                }
                break;
            case "3":
                level = 4;
                if ($('#optCountry').val() != 0 && $('#optCountry').val() != null && $('#optBuilding').val() != 0 && $('#optBuilding').val() != null && $('#optFloor').val() != 0 && $('#optFloor').val() != null) {
                    myJsonObject = { "callerObject": { "DataBaseID": decryptStr(getLocal("DatabaseID")), "Level": level, "SearchString": $("#txtSearchPrf").val(), "RegionNumber": $('#optCountry').val(), "DivisionNumber": $('#optBuilding').val(), "DistrictNumber": $('#optFloor').val() },
                        "databaseName": decryptStr(getLocal("DatabaseID")),
                        "selectedLanguage": getLocal("Language"),
                        "databaseNameVal": decryptStr(getLocal("databaseName"))
                    };
                    $.postJSON(url, myJsonObject, function (data) {
                        if (data != null) {
                            $("#optRoom option:gt(0)").remove();
                            $('#optRoom').selectmenu('refresh');
                            for (index = 0; index < data.length; index++) {
                                var dropdown = document.createElement('option');
                                dropdown.setAttribute("value", data[index]['CustomerNumber'] + 'ì' + data[index]['CustomerSiteNumber']);
                                dropdown.innerHTML = data[index]['Description'];
                                $('#optRoom').append(dropdown);
                            }
                            $('#optRoom').selectmenu();
                        }
                    });
                } else {
                    //showErrorPopUp(true, getTranslatedValue("CityBuildingAndFloorRequired"));
                }
                break;
        }
        //$("#txtSearchPrf").val('');
    }
    else {
        setTimeout(function () {
            hideImage();
            showErrorPopUp(true, noNetworkTranslation);
        }, 1000);
    }
}

//-------------------------------
/// Gets the site label values for loaction dropdowns.
function SetSiteLabelsForEditProfile() {
    var myJsonObject = {
        "databaseID": decryptStr(getLocal("DatabaseID")),
        "language": getLocal("Language")
    };

    var url = standardAddress + "EditProfile.svc/SetSiteLabels";
    if (navigator.onLine) {
        $.postJSON(url, myJsonObject, function (data) {
            if (data != null) {
                if (decryptStr(getLocal("MSIClientCode")) === "IO" && getLocal("Language") === "fr-FR") {
                    data["Level_1"] = getTranslatedValue("Level_1");
                    data["Level_2"] = getTranslatedValue("Level_2");
                    data["Level_3"] = getTranslatedValue("Level_3");
                    data["Level_4"] = getTranslatedValue("Level_4");
                }
                $("#Level1").html('<label id="Level1DropDownMandatorySymbol" class="custMandatory" style="color:red">*</label>' + data["Level_1"] + ":");
                $("#Level2").html('<label id="Level2DropDownMandatorySymbol" class="custMandatory" style="color:red">*</label>' + data["Level_2"] + ":");
                $("#Level3").html('<label id="Level3DropDownMandatorySymbol" class="custMandatory" style="color:red">*</label>' + data["Level_3"] + ":");
                $("#Level4").html('<label id="Level4DropDownMandatorySymbol" class="custMandatory" style="color:red">*</label>' + data["Level_4"] + ":");
                $("#CostCenteProfile").html(data.AltCustLbl + ":");

                var dropdown1;
                var dropdown = document.createElement('option');
                dropdown.setAttribute("value", "-1");
                dropdown.innerHTML = "--Select--";
                dropdown1 = dropdown.outerHTML;
                dropdown.setAttribute("value", "0");
                dropdown.innerHTML = data["Level_1"];
                dropdown1 = dropdown1 + dropdown.outerHTML;
                dropdown.setAttribute("value", "1");
                dropdown.innerHTML = data["Level_2"];
                dropdown1 = dropdown1 + dropdown.outerHTML;
                dropdown.setAttribute("value", "2");
                dropdown.innerHTML = data["Level_3"];
                dropdown1 = dropdown1 + dropdown.outerHTML;
                dropdown.setAttribute("value", "3");
                dropdown.innerHTML = data["Level_4"];
                dropdown1 = dropdown1 + dropdown.outerHTML;
                $("#optCategoryPrf").html('');
                $("#optCategoryPrf").append(dropdown1);
                $("#optCategoryPrf option[value='-1']").attr('selected', 'selected');
                $("#optCategoryPrf").selectmenu('refresh');


                if (decryptStr(getLocal("LockTopThreeLevels")) != null && decryptStr(getLocal("LockTopThreeLevels")) != "") {
                    if (decryptStr(getLocal("LockTopThreeLevels")).toLowerCase() == "true") {
                        $("#optCategoryPrf option[value='0']").remove();
                        $("#optCategoryPrf").selectmenu('refresh');
                        $("#optCategoryPrf option[value='1']").remove();
                        $("#optCategoryPrf").selectmenu('refresh');
                        $("#optCategoryPrf option[value='2']").remove();
                        $("#optCategoryPrf").selectmenu('refresh');
                        $("#optCategoryPrf").val('3');
                        $('#optCategoryPrf').selectmenu('refresh');
                    }
                }

                if (decryptStr(getLocal("LockTopTwoLevels")) != null && decryptStr(getLocal("LockTopTwoLevels")) != "") {
                    if (decryptStr(getLocal("LockTopTwoLevels")).toLowerCase() == "true") {
                        $("#optCategoryPrf option[value='0']").remove();
                        $('#optCategoryPrf').selectmenu('refresh');
                        $("#optCategoryPrf option[value='1']").remove();
                        $('#optCategoryPrf').selectmenu('refresh');
                        $("#optCategoryPrf").val('2');
                        $('#optCategoryPrf').selectmenu('refresh');
                    }
                }
            }
        });
    }
    else {
        setTimeout(function () {
            hideImage();
            showErrorPopUp(true, noNetworkTranslation);
        }, 1000);
    }
}

//------------------------
function SetUpProfileAccess() {
    if (getLocal("EditProfileFromWeb") == "false") {
        //$("#FullNameId").parent().addClass('ui-disabled');
        //$("#PhoneNumberId").parent().addClass('ui-disabled');        
        $("#FullNameId").attr("readonly", true);
        $("#FullNameId").parent().addClass("ui-select ui-btn-disabled");
        //$("#FullNameId").css("opacity", "0.8");
        $("#PhoneNumberId").attr("readonly", true);
        $("#PhoneNumberId").parent().addClass("ui-select ui-btn-disabled");
        //$("#PhoneNumberId").css("opacity", "0.8"); 
        $("#txtSearchPrf").attr("readonly", true);
        $("#txtSearchPrf").parent().addClass("ui-select ui-btn-disabled");
        //$("#txtSearchPrf").css("opacity", "0.8");
        $("#optCategoryPrf").attr("readonly", true);
        $("#optCategoryPrf").parent().addClass("ui-select ui-btn-disabled");
        //$("#optCategoryPrf").css("opacity", "0.8");
        $("#optCountry").attr("readonly", true);
        $("#optCountry").parent().addClass("ui-select ui-btn-disabled");
        //$("#optCountry").css("opacity", "0.8");
        $("#optBuilding").attr("readonly", true);
        $("#optBuilding").parent().addClass("ui-select ui-btn-disabled");
        //$("#optBuilding").css("opacity", "0.8");
        $("#optFloor").attr("readonly", true);
        $("#optFloor").parent().addClass("ui-select ui-btn-disabled");
        //$("#optFloor").css("opacity", "0.8");
        $("#optRoom").attr("readonly", true);
        $("#optRoom").parent().addClass("ui-select ui-btn-disabled");
        //$("#optRoom").css("opacity", "0.8");
        $("#optCostCenter").attr("readonly", true);
        $("#optCostCenter").parent().addClass("ui-select ui-btn-disabled");
        //$("#optCostCenter").css("opacity", "0.8");
        $("#btnUpdateProfile").attr("readonly", true);
        $("#btnUpdateProfile").parent().addClass("ui-select ui-btn-disabled");
        //$("#btnUpdateProfile").css("opacity", "0.8");
        $("#btnRestProfile").attr("readonly", true);
        $("#btnRestProfile").parent().addClass("ui-select ui-btn-disabled");
        //$("#btnRestProfile").css("opacity", "0.8");            
    }
}

//----------------------
function ResetCategoryDropDownEditProfile() {
    $('#optCategoryPrf').val('-1')
    //$('#optCategoryPrf').val('0')
    $('#optCategoryPrf').selectmenu('refresh');
}

//----------------------------
function StoreDropDownValuesForEditProfile() {
    $("#hiddenLevel1Dropdown").val($("#optCountry").val());
    $("#hiddenLevel2Dropdown").val($("#optBuilding").val());
    $("#hiddenLevel3Dropdown").val($("#optFloor").val());
    $("#hiddenLevel4Dropdown").val($("#optRoom").val());
    $("#hiddenCostCenter").val($("#optCostCenter").val());
}

//-------------------------
function BindCallerTyprDropdown() {
    var myJsonObject = {
        "databaseId": decryptStr(getLocal("DatabaseID")),
        "language": getLocal("Language"),
        "dataBaseName": decryptStr(getLocal("databaseName"))
    }

    var url = standardAddress + "EditProfile.svc/BindCallerTyprDropdown";
    if (navigator.onLine) {
        $.postJSON(url, myJsonObject, function (data) {
            if (data != null) {
                if (data.length > 0) {
                    var dropdownDefault = document.createElement("option");
                    dropdownDefault.setAttribute("value", "-1");
                    dropdownDefault.innerHTML = getTranslatedValue("Select1");
                    $("#optCallerType").append(dropdownDefault);
                    for (i = 0; i < data.length; i++) {
                        var dropdown = document.createElement("option");
                        dropdown.setAttribute("value", data[i]["CallerTypeSeq"]);
                        dropdown.innerHTML = data[i]["CallerTypeDescription"];
                        $("#optCallerType").append(dropdown);
                    }

                    $("#optCallerType").selectmenu("refresh");
                    if (!IsStringNullOrEmpty(getLocal("CallerTypeSeq"))) {
                        $("#optCallerType").val(getLocal("CallerTypeSeq"));
                        $("#optCallerType").selectmenu("refresh");
                    }
                    else {
                        $("#optCallerType").val("-1");
                        $("#optCallerType").selectmenu("refresh");
                    }

                    //                    $("#optCallerType").attr('disabled', 'disabled');
                    //                    $("#optCallerType").addClass('ui-disabled');
                    //                    $("#optCallerType").parent().parent().addClass("ui-state-disabled");
                    $("#optCallerType").attr("readonly", true);
                    $("#optCallerType").parent().addClass("ui-select ui-btn-disabled");
                    $("#optCallerType").selectmenu();

                }
            }
        });
    }
    else {
        setTimeout(function () {
            hideImage();
            showErrorPopUp(true, noNetworkTranslation);
        }, 1000);
    }
}

//----------------------------
function BindLevel2DropDownForEdit() {
    checkResetinRequestService == false;
    BindBuildingEditProfile();
}

//------------------------
function BindLevel3DropDownForEdit() {
    checkResetinRequestService == false;
    BindFloorEditProfile();
}

//--------------------------------
function BindLevel1DataForeditprofile() {
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
            $("#optCountry option:gt(0)").remove();
            if (data != null) {
                for (index = 0; index < data.length; index++) {
                    var dropdown = document.createElement('option');
                    dropdown.setAttribute("value", data[index]['RegionNumber']);
                    dropdown.innerHTML = data[index]['Description'];
                    $('#optCountry').append(dropdown);
                }
            }

            if ($('#optCountry').val() != $("#hiddenLevel1Dropdown").val()) {
                $('#optCountry').val($("#hiddenLevel1Dropdown").val());
                $('#optCountry').selectmenu('refresh');
                BindBuildingEditProfile();
                if (decryptStr(getLocal("ShowLevelSearch")) != null && decryptStr(getLocal("ShowLevelSearch")) != "") {
                    if (decryptStr(getLocal("ShowLevelSearch")).toLowerCase() == "true") {
                        if (!IsStringNullOrEmpty($("#txtSearchPrf").val())) {
                            $("#txtSearchPrf").val('');
                            if ($("#optCategoryPrf").val() != "-1" || $("#optCategoryPrf").val() != null) {
                                $("#optCategoryPrf").val("-1");
                                $("#optCategoryPrf").selectmenu("refresh");
                            }
                        }
                    }
                }
            }
            $('#optCountry').selectmenu('refresh');
        });
    }
    else {
        setTimeout(function () {
            hideImage();
            showErrorPopUp(true, noNetworkTranslation);
        }, 1000);
    }
}

// Method used to update the caller profile.
function SaveProfileData() {
    var ErrorMessage = '';
    loadingImage();

    setLocal("LatLongRegionNumber", "");
    setLocal("LatLongDivisionNumber", "");
    setLocal("LatLongDistrictNumber", "");
    setLocal("LatLongCustNumber", "");
    setLocal("LatLongCustSiteNumber", "");

    if (IsStringNullOrEmpty($("#callerName").val()) || $("#optCountry").val() == "0" || $("#optBuilding").val() == "0" || $("#optFloor").val() == "0" || $("#optRoom").val() == "0") {
        ErrorMessage = getTranslatedValue("RequiredFields");
    }
    else if (IsStringNullOrEmpty($("#callerName").val())) {
        ErrorMessage = getTranslatedValue("CallerNameIsRequired");
    }
    else if ($("#optCountry").val() == "0" || $("#optBuilding").val() == "0" || $("#optFloor").val() == "0" || $("#optRoom").val() == "0") {
        ErrorMessage = getTranslatedValue("DropDownValuesRequired");
    }

    var securityIdForCallerName = '';
    if (!IsStringNullOrEmpty($("#callerName").val())) {
        securityIdForCallerName = securityError($("#callerName"));
        if (securityIdForCallerName == "") {
            return false;
        }
    }

    var securityIdForPhoneNum = '';
    if (!IsStringNullOrEmpty($("#phoneNum").val())) {
        securityIdForPhoneNum = securityError($("#phoneNum"));
        if (securityIdForPhoneNum == "") {
            return false;
        }
    }

    var securityIdForCallerLocation = '';
    if (!IsStringNullOrEmpty($("#callerLocation").val())) {
        securityIdForCallerLocation = securityError($("#callerLocation"));
        if (securityIdForCallerLocation == "") {
            return false;
        }
    }

    var strurl = standardAddress + "EditProfile.svc/SaveCallerProfile";
    var customerNumber = '';
    var customerSitenumber = '';
    if ($("#optRoom").val() != null && $("#optRoom").val() != undefined && $("#optRoom").val() != "") {
        if ($("#optRoom").val().indexOf("ì") != -1) {
            customerNum = $("#optRoom").val().split('ì')[0];
            customerSitenum = $("#optRoom").val().split('ì')[1];
        }
    }

    var myJsonObject = {
        "databaseID": decryptStr(getLocal("DatabaseID")),
        "databaseName": decryptStr(getLocal("databaseName")),
        "language": getLocal("Language"),
        "callerDetails": { "RegionNumber": $("#optCountry").val(), "DivisionNumber": $("#optBuilding").val(),
            "DistrictNumber": $("#optFloor").val(), "Area": $("#optRoom  option:selected").text(), "EmailID": $("#EmailaddressValue").text(),
            "FullName": securityIdForCallerName, "PhoneNumber": securityIdForPhoneNum, "TypeOfCaller": getLocal("TypeOfCaller"), "CallerTypeSeq": getLocal("CallerTypeSeq"),
            "Company": getLocal("CallerCompany"), "CostCenter": $("#optCostCenter").val(), "Location": securityIdForCallerLocation,
            "CustomerNumber": customerNum, "CustomerSiteNumber": customerSitenum, "ProfileNotes": $("#txtProfileNotes").val(),
            "Seq": getLocal("seq"), "EmployeeNumber": getLocal("EmployeeNumber"), "GPSLocation": getLocal("GPSLocation"), "SessionId": decryptStr(getLocal("SessionId"))
        }
    };

    if (IsStringNullOrEmpty(ErrorMessage)) {
        if (navigator.onLine) {
            $.postJSON(strurl, myJsonObject, function (data) {
                customerNumber = data["CustomerNumber"];
                customerSiteNumber = data["CustomerSiteNumber"];
                profileNote = $("#txtProfileNotes").val();
                //editProfile();
                setTimeout(function () {
                    $("#profilePopup").popup("open");
                    //hideImage();
                }, 3000);  //8000

                $("#phoneNumber").val(data["PhoneNumber"]);
                $("#callerName").val(data["CallerName"]);
                $("#optCostCenter").val(data["CostCenter"]);
                setTimeout(function () {
                    $("#optCostCenter").selectmenu('refresh');
                }, 2000);
                setLocal("CostCenterProfile", data["CostCenter"]);
                setLocal("Username", encryptStr(data["CallerName"]));
                setLocal("PhoneNumber", data["PhoneNumber"]);
                setLocal("CustomerNumber", data["CustomerNumber"]);
                setLocal("CustomerSiteNumber", data["CustomerSiteNumber"]);
                setLocal("SearchTextBoxVal", $("#txtSearchPrf").text());
                setLocal("CategoryDropDownVal", $("#optCategoryPrf").val());
                setLocal("LocationDetail", securityIdForCallerLocation);
                //setLocal("ProfileNotesForEditProf", data["Notes"]);
                //profileNote = $("#txtProfileNotes").val();
                editProfile();

                //$("#callerName").val(data.CallerName)
            });
        }
        else {
            setTimeout(function () {
                hideImage();
                showErrorPopUp(true, noNetworkTranslation);
            }, 1000);
        }
    }
    else {
        hideImage();
        setTimeout(function () {
            showErrorPopUp(true, ErrorMessage);
            ErrorMessage = '';
            return false;
        }, 100);
    }
}

//******************************************** End of Edit Profile ****************************************//


/**
* Feedback required Work Orders
*/
function requiredFeedback() {

    loadingImage();
    var connectionStringURL = standardAddress + "ProvideFeedback.svc/GetFeedbackRequiredWODetails";
    var dbID = decryptStr(getLocal("DatabaseID"));
    var dbName = decryptStr(getLocal("databaseName"));
    var seqID = getLocal("seq");
    var myJSONobject = {
        "databaseID": dbID,
        "databaseName": dbName,
        "language": getLocal("Language"),
        "selectedView": "1",
        "seq": getLocal("seq"),
        "pageNum": "1",
        "pageSize": "10"
    };
    postJSONreqFeedbackWO(connectionStringURL, myJSONobject);
}

/**
* @connectionStringURL - the url to get feedback requored work orders
* @myJSONobject - the data is passing as JSONObject
*/
function postJSONreqFeedbackWO(connectionStringURL, myJSONobject) {

    if (navigator.onLine) {
        $.ajax({
            type: "POST",
            url: connectionStringURL,
            data: JSON.stringify(myJSONobject),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {

                //console.log(data);

                var menuData = JSON.parse(data);
                $('.reqFeedbackWorkOrderList').html('');

                for (var i in menuData) {
                    $(".reqFeedbackWorkOrderList").append('<li><a href="#" onclick="reqFeedbackWO(\'' + menuData[i].WorkOrderNumber + '\')" data-corners="false" id="menu' + i + '">'
                + '<h2 class="custMargin">' + (IsStringNullOrEmpty(menuData[i].WorkOrderNumber) ? "" : menuData[i].WorkOrderNumber) + ' </h2>'
                + '<p><strong>' + getTranslatedValue("AssignedName") + ': ' + (IsStringNullOrEmpty(menuData[i].AssignedName) ? "" : menuData[i].AssignedName) + '</strong></p>'
                + '<p>' + getTranslatedValue("BuildingName") + ': ' + (IsStringNullOrEmpty(menuData[i].Building) ? "" : menuData[i].Building) + '</p>'
                + '<p>' + getTranslatedValue("DateEntered") + ': ' + (IsStringNullOrEmpty(menuData[i].Dateentered) ? "" : menuData[i].Dateentered + ' ' + (IsStringNullOrEmpty(menuData[i].TimeZone) ? "" : menuData[i].TimeZone)) + '</p>'
                + '<p>' + getTranslatedValue("DateCompleted") + ': ' + (IsStringNullOrEmpty(menuData[i].DatecompleteSite) ? "" : menuData[i].DatecompleteSite + ' ' + (IsStringNullOrEmpty(menuData[i].TimeZone) ? "" : menuData[i].TimeZone)) + '</p>'
                + '<p><font style="white-space:normal !important;">' + getTranslatedValue("ProblemDescription") + ': ' + (IsStringNullOrEmpty(menuData[i].ProblemDescription) ? "" : (menuData[i].ProblemDescription.length > 100 ? menuData[i].ProblemDescription.substring(0, 100) : menuData[i].ProblemDescription)) + '</p>'
                + '<p class="ui-li-aside"><strong>' + getTranslatedValue("StatusLabel") + ': ' + (IsStringNullOrEmpty(menuData[i].Status) ? "" : menuData[i].Status) + '</strong></p>'
                + '</a></li>').listview('refresh');

                }

                if (menuData.length > 0) {
                    if (parseInt(menuData[0].MaxRow) - (1 * 10) > 0) {
                        $("#moreFeedbackReqWOButton").show();
                    }
                    else {
                        $("#moreFeedbackReqWOButton").hide();
                    }
                }
                else {
                    $("#moreFeedbackReqWOButton").hide();
                    $(".ms-nofeedbackreqworkorders-info").show();
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
/**
* To load more work orders
*/

function loadMoreFeedbackReqWorkOrders(obj) {
    loadingImage();
    var pageNumber = parseInt($("#feedbackRequiredPage").find("#" + obj.id).attr('data-nextPage')) + 1;
    var connectionStringURL = standardAddress + "ProvideFeedback.svc/GetFeedbackRequiredWODetails";
    var dbID = decryptStr(getLocal("DatabaseID"));
    var dbName = decryptStr(getLocal("databaseName"));
    var seqID = getLocal("seq");
    var myJSONobject = {
        "databaseID": dbID,
        "databaseName": dbName,
        "language": getLocal("Language"),
        "selectedView": "1",
        "seq": getLocal("seq"),
        "pageNum": pageNumber,
        "pageSize": "10"

    };
    if (navigator.onLine) {
        $.postJSON(connectionStringURL, myJSONobject, function (data) {
            hideImage();
            $("#feedbackRequiredPage").find("#" + obj.id).attr('data-nextPage', pageNumber);
            if (data != null) {
                for (var i = 0; i < data.length; i++) {
                    //$(".reqFeedbackWorkOrderList").append('<li><a href="#" onclick="reqFeedbackWO(\'' + data[i].WorkOrderNumber + '\')" data-corners="false" id="menu' + i + '"><h2>' + data[i].WorkOrderNumber + ' </h2><p><strong>Assigned Name:' + data[i].AssignedName + '</strong></p></a></li>').listview('refresh');
                    $(".reqFeedbackWorkOrderList").append('<li><a href="#" onclick="reqFeedbackWO(\'' + data[i].WorkOrderNumber + '\')" data-corners="false" id="menu' + i + '">'
                + '<h2 class="custMargin">' + (IsStringNullOrEmpty(data[i].WorkOrderNumber) ? "" : data[i].WorkOrderNumber) + ' </h2>'
                + '<p><strong>' + getTranslatedValue("AssignedName") + ': ' + (IsStringNullOrEmpty(data[i].AssignedName) ? "" : data[i].AssignedName) + '</strong></p>'
                + '<p>' + getTranslatedValue("BuildingName") + ': ' + (IsStringNullOrEmpty(data[i].Building) ? "" : data[i].Building) + '</p>'
                + '<p>' + getTranslatedValue("DateEntered") + ': ' + (IsStringNullOrEmpty(data[i].Dateentered) ? "" : data[i].Dateentered + ' ' + (IsStringNullOrEmpty(data[i].TimeZone) ? "" : data[i].TimeZone)) + '</p>'
                + '<p>' + getTranslatedValue("DateCompleted") + ': ' + (IsStringNullOrEmpty(data[i].DatecompleteSite) ? "" : data[i].DatecompleteSite + ' ' + (IsStringNullOrEmpty(data[i].TimeZone) ? "" : data[i].TimeZone)) + '</p>'
                + '<p><font style="white-space:normal !important;">' + getTranslatedValue("ProblemDescription") + ': ' + (IsStringNullOrEmpty(menuData[i].ProblemDescription) ? "" : (menuData[i].ProblemDescription.length > 100 ? menuData[i].ProblemDescription.substring(0, 100) : menuData[i].ProblemDescription)) + '</p>'
                + '<p class="ui-li-aside"><strong>' + getTranslatedValue("StatusLabel") + ': ' + (IsStringNullOrEmpty(data[i].Status) ? "" : data[i].Status) + ' </strong></p>'
                + '</a></li>').listview('refresh');
                }
            }
            if (parseInt(data[data.length - 1].MaxRow) - (pageNumber * 10) > 0) {
                $("#moreFeedbackReqWOButton").show();
            }
            else {
                $("#moreFeedbackReqWOButton").hide();
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
* @id - work order id
*/
function reqFeedbackWO(id) {
    loadingImage();
    var strurl = standardAddress + "ProvideFeedback.svc/GetFeedbackQuestions";
    var myJsonObjectNew = {
        "databaseID": decryptStr(getLocal("DatabaseID")),
        "workOrderNum": id,
        "seq": getLocal("seq"),
        "databaseName": decryptStr(getLocal("databaseName")),
        "language": getLocal("Language")
    };
    postFeedbackJSON(strurl, myJsonObjectNew, id);
}
/**
* To Get the count of Feedback Work Orders
*/
function loadFeedbackWO() {

    var connectionStringURL = standardAddress + "ProvideFeedback.svc/GetCountOfFeedbackWO";
    var dbID = decryptStr(getLocal("DatabaseID"));
    var dbName = decryptStr(getLocal("databaseName"));
    var seqID = getLocal("seq");
    var myJSONobject = {
        "databaseID": dbID,
        "databaseName": dbName,
        "language": getLocal("Language"),
        "selectedView": "2",
        "seq": getLocal("seq"),
        "pageNum": "1",
        "pageSize": "10"
    };
    if (navigator.onLine) {
        $.postJSON(connectionStringURL, myJSONobject, function (data) {
            setLocal("feedbackCount", data);
        });
    } else {
        setTimeout(function () {
            hideImage();
            showErrorPopUp(true, noNetworkTranslation);
        }, 1000);
    }

}


/*******************End of Required Feedback Work Orders******************/


/**
* To View Service Request of an work order
* @workOrderNumber - work order number
*/
function navigateToWoDetails(workOrderNumber) {


    if (workOrderNumber == '') {
        showErrorPopUp(true, getTranslatedValue("enterWorkOrderLabel"));
        return false;
    }
    var securityId = securityError($("#woNumber"));
    if (securityId == "") {
        return false;
    }
    setLocal("woID", securityId);
    var myJsonObject = {
        "databaseID": decryptStr(getLocal("DatabaseID")),
        "worderNum": securityId,
        "intFilter": decryptStr(getLocal("ViewOrderCallerFilter")), //intFilter,
        "seq": getLocal("seq"),
        "databaseName": decryptStr(getLocal("databaseName")),
        "language": getLocal("Language"),
        "sessionId": decryptStr(getLocal("SessionId"))
    };
    var accessURL = standardAddress + "ViewWorkOrderDetail.svc/ViewWorkOrder";
    if (navigator.onLine) {
        $.postAjaxJSON(accessURL, myJsonObject, function (data) {
            if (data !== null) {
                if (data == 'Invalid work order number' || data == $("#woNumber").val() + ': The work order number entered could not be found or is not in your filter.') {
                    showErrorPopUp(true, data);
                }
                else {
                    $.mobile.changePage("woDetails.html", "fade");
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

/******************************************End of View Service Request***************************************/

/**
* To change the password
*/
function changePwd() {
    loadingImage();

    var JSONObject = {
        "databaseID": decryptStr(getLocal("DatabaseID")),
        "language": getLocal("Language")
    };
    var strurl = standardAddress + "LoginAuthentication.svc/GetPasswordPolicy";
    var newPassword = $("#newPassword").val();
    var userName = decryptStr(getLocal("Username"));
    var returnVal;
    if (navigator.onLine) {
        $.postAjaxJSON(strurl, JSONObject, function (data) {
            //hideImage();
            // 
            if (data !== null) {
                var pwdPolicyObj = JSON.parse(data);

                //To check the password length with respect to password policy
                if (pwdPolicyObj[0].NewRuleId === "1" || pwdPolicyObj[0].NewRuleId === 1) {
                    if (pwdPolicyObj[0].Status != false || pwdPolicyObj[0].Value != "N\A") {
                        if (newPassword.length < pwdPolicyObj[0].Value) {
                            hideImage();
                            showErrorPopUp(true, getTranslatedValue("PasswordFormatMessageLabel2").replace("X", pwdPolicyObj[0].Value));
                            clearChangePasswordFields();
                            return false;
                        }
                    }
                }

                //To check whether the password contains characters, numbers etc.
                if (pwdPolicyObj[1].NewRuleId === "2" || pwdPolicyObj[1].NewRuleId === 2) {
                    if (pwdPolicyObj[1].Status != false || pwdPolicyObj[1].Value != "N\A") {
                        var pattern = /.*[a-zA-Z].*[0-9].*|.*[0-9].*[a-zA-Z].*|.*[a-z].*[A-Z].*|.*[A-Z].*[a-z].*/;
                        if (!pattern.test(newPassword)) {
                            hideImage();
                            showErrorPopUp(true, getTranslatedValue("PasswordFormatMessageLabel1"));
                            clearChangePasswordFields();
                            return false;
                        }
                    }
                }
                // To check whether password can contain Username
                if (pwdPolicyObj[8].NewRuleId === "9" || pwdPolicyObj[8].NewRuleId === 9) {
                    if (pwdPolicyObj[8].Status != false || pwdPolicyObj[8].Value != "N\A") {
                        var usernameArray = userName.split(' ');
                        var isValid = true;
                        if (usernameArray.length > 0) {
                            for (i = 0; i < usernameArray.length; i++) {
                                if (usernameArray[i].length > 1) {
                                    if (newPassword.toLowerCase().indexOf(usernameArray[i].toLowerCase()) >= 0) {
                                        isValid = false;
                                        break;
                                    }
                                }
                            }
                        }

                        if (!isValid) {
                            hideImage();
                            showErrorPopUp(true, getTranslatedValue("ErrorMessageNewPasswordUserLabel"));
                            clearChangePasswordFields();
                            return false;
                        }

                    }
                }

                var JSONObject = {
                    "callerObject": {
                        "DatabaseID": decryptStr(getLocal("DatabaseID")),
                        "EmailAddress": decryptStr(getLocal("EmailAddress")),
                        "OldPassword": $("#oldPassword").val(),
                        "NewPassword": $("#newPassword").val(),
                        "DatabaseName": decryptStr(getLocal("databaseName")),
                        "Language": getLocal("Language"),
                        "Seq": getLocal("seq"),
                        "EmployeeNumber": getLocal("EmployeeNumber"),
                        "GPSLocation": getLocal("GPSLocation"),
                        "SessionId": decryptStr(getLocal("SessionId"))
                    }
                };
                var strurl = standardAddress + "ChangePassword.svc/ChangeCallerPassword";

                if (navigator.onLine) {
                    $.postAjaxJSON(strurl, JSONObject, function (data) {
                        hideImage();
                        if (data !== null) {
                            $("#passwordUpdated").popup("open");
                        }
                    });
                } else {
                    setTimeout(function () {
                        hideImage();
                        showErrorPopUp(true, noNetworkTranslation);
                    }, 1000);
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

//Method to clear the change password screen fields.
function clearChangePasswordFields() {
    $("#oldPassword").val('');
    $("#newPassword").val('');
    $("#confirmPassword").val('');
}


