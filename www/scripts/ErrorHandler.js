function LogErrors(exception, pageName, methodName) {
    alert('Into Log Errors');

    var exceptionData = {
        DatabaseID: decryptStr(getLocal("DatabaseID")),
        Culture: getLocal("Language"),
        DatabaseName: decryptStr(getLocal("databaseName")),
        AdditionalInformation: exception.message,
        StackTrace: exception.stack,
        AppName: 'iCRS',
        MethodName: methodName,
        PageName: pageName,
        Type: exception.name
    };

    var strURL = standardAddress + "CRSConfiguration.svc/LogExceptions";
    $.postJSONWithParams(strURL, exceptionData, function (data) {

    });
}

$.postJSONWithParams = function (url, data, func) {
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
            data: JSON.stringify({ 'data': data }), // Watch this line where you send the Object. 
            success: function (result, textStatus, jqXHR) {
                debugger;
                RemoveRequest(jqXHR.ID);
                if (result[0] == "(" && result[result.length - 1] == ")") {
                    result = result.substring(1, result.length - 1);

                }
                result = IsStringNullOrEmpty(result) ? result : JSON.parse(result);
                func(result);
            },
            error: function (data) {
                debugger;
                hideImage();
                var errorMessge = data.responseText.split('See')[0];
                var errorMessge2 = errorMessge.substr(errorMessge.indexOf("exception") + 23, (errorMessge.length - errorMessge.indexOf("exception") - 27))
                if (errorMessge2 != '') {
                    if (!isNaN(errorMessge2.substr(0, 1))) {
                        ////showErrorPopUp(true, errorMessge2.substr(1, errorMessge2.length));
                        showErrorPopUpSplash(true, errorMessge2);
                    }
                    else {
                        showErrorPopUp(true, errorMessge2);
                    }
                }
                return;
            }
        });
    currentRequest.Request.ID = GenerateGuid();
    ajaxCalls.push(currentRequest);
};