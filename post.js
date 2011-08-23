/**
 * 各Postを表すクラス
 */
dojo.declare("Post", null, {

    /* 共有記事か否か判定する際に使用するクエリ。isReshared()参照 */
    var resharePostsQuery = "div.Wx",

    /* ポストのオーナー ID */
	ownerId: "",
	
	/* 再共有ポストか否か */
	isReshared: false,

	constructor: function(node) {
		this.ownerId = resolvePostOwnerId(node);
		this.isReshared = isReshare(node);
	},

	/**
	 * ポストのオーナーの ID を解決する
	 * @param {Node} node ポストのルート ID
	 * @return ポストのオーナーの ID。解決できない場合は例外
	 */
	resolvePostOwnerId: function(node) {
    	var anchors = node.getElementsByTagName("a");
    	for (var a = 0; a < anchors.length; a++) {
    		var postOwnerId = anchors[a].getAttribute("oid");
    		if (postOwnerId) {
    			return postOwnerId;
    		}
    	}
    	// never
    	throw new Error("cannot resolve post owner id"); 
	},
	
	/**
	 * 再共有記事か否かを判定する
	 * @param {Node} node ポストのルート ID
	 * @return true: 再共有記事である。false: 再共有記事でない(少なくとも resharePostQuery で引っかからない)。
	 */
	isReshare: function(node) {
		var reshareNodes = dojo.query(resharePostQuery, node);
		if (reshareNodes.length !== 0) {
			return true;
		}
		return false;
	}
});