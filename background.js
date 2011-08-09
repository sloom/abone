chrome.extension.onRequest.addListener(function (request, sender, sendResponse) {
    var response = "";
    switch(request.action) {
        case "show_page_action_icon":
            showPageIcon(sender.tab.id);
            break;
        case "is_enabled":
            response = isEnabled();
            break;
        case "get_height":
            response = getHeight();
            break;
        case "get_unfold_method":
            response = getUnfoldMethod();
            break;
        default:
    }
    sendResponse(response);
});

var showPageIcon = function(targetTabId) {
    chrome.pageAction.show(targetTabId);
}

var activate = function(enable) {
    localStorage.enable = enable;
}

var isEnabled = function() {
    if (localStorage.enable === undefined) {
        return "true";
    }
    return localStorage.enable;
}

var getHeight = function() {
    if (localStorage.height === undefined) {
        return "40";
    }
    return localStorage.height;
}

var setHeight = function(value) {
    localStorage.height = value;
}

var getUnfoldMethod = function(method) {
    if (localStorage.unfoldMethod === undefined) {
        return "mouseover";
    }
    return localStorage.unfoldMethod;
}

var setUnfoldMethod = function(method) {
    localStorage.unfoldMethod = method;
}
