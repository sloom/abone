dojo.require("Post");

/**
 * フィルタの基底クラス
 */
dojo.declare("PostFilter", null, {
    /**
     * フィルタすべきか否かを判定する。
     * @return {Boolean} true: フィルタすべき、false: フィルタすべきでない。
     */
    isFiltered: function() {
        return false;
    }
});

/**
 * 再共有フィルタ
 */
dojo.declare("ResharePostFilter", PostFilter, {
    /**
     * コンストラクタ
     * @param {Object} post ポストオブジェクト
     * @param {Array} exceptionalOids 再共有でも例外的にフィルターしない OID 群
     */
    constructor: function(post, exceptionalOids) {
        this.post = post;
        this.exceptionalOids = exceptionalOids;
    }

    isFiltered: function() {
        var self = this;
        chrome.extension.sendRequest({action:"is_enabled"}, function(response) {
            var enable = response === "true";
            if (enable) {
                if(this.post.isReshared) {
                    var isException = dojo.some(this.exceptionalOids, function(value) {
                        return value === self.post.ownerId; 
                    });
                    if (!isException) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
});