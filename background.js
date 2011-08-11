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


/**
 * ミュート対象のユーザー ID 群を文字列で返します。
 * ローカルストレージの値が undefined の場合、空文字を返します。
 */
var getMutedUsers = function() {
    /* ---- debug ---- */
    if(true) {
        var dummyData = {
            items : [
                { oid : "111",  link: "<a href='#'>123</a>", isEnable: "true" },
                { oid : "222",  link: "<a href='#'>222</a>", isEnable: "false" },
                { oid : "333",  link: "<a href='#'>333</a>", isEnable: "true" },
                { oid : "444",  link: "<a href='#'>444</a>", isEnable: "true" },
                { oid : "555",  link: "<a href='#'>555</a>", isEnable: "false" },
                { oid : "666",  link: "<a href='#'>666</a>", isEnable: "true" },
                { oid : "777",  link: "<a href='#'>777</a>", isEnable: "true" },
                { oid : "888",  link: "<a href='#'>888</a>", isEnable: "false" },
                { oid : "999",  link: "<a href='#'>999</a>", isEnable: "true" },
                { oid : "000",  link: "<a href='#'>000</a>", isEnable: "true" },
            ]
        };
        return JSON.stringify(dummyData);
    }
    /* ---- debug ---- */
    
    if (localStorage.mutedUsers === undefined) {
        return "";
    }
    return localStorage.mutedUsers;
}

/**
 * ミュート対象のユーザー ID 群を文字列で指定します。
 */
var setMutedUsers = function(mutedUsersStr) {
    localStorage.mutedUsers = mutedUsersStr;
}

