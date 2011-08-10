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

/**
 * 再共有ミュートの有効無効を返します。
 * 戻り値が undefined とならないことは保証されます(値が undefined の場合、デフォルト値の "true"を返します)。
 * それ以外の場合、ローカルストレージの enable の値をそのまま返します。
 */
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
