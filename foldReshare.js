	/* URL */
	var plusUrl = "https://plus.google.com/";

	/* 各ポストを抽出するクエリ */
    var postsQuery = "div[id^='update']";

    /* 自分自身のアンカー(メインストリーム左)を抽出するクエリ */
    var meQuery = "div.a-Dd-wH > a.a-e-j-Sa";

    /* ポスト以下でポスト者のアンカーを抽出するクエリ */
    var postOwnerQuery = "a";

    /* 自分の OID */
    var myOid = "";

    /* 共有記事ポストを抽出するクエリ。*/
    var resharePostsQuery = "div.Wx";

    /* ストリームの監視間隔(ミリ秒) */
    var watchInterval = 1000;

    /* 処理済みの先頭ID。処理ループ用 */
    var previousPostId = "";

    /**
     * 共有記事を探し折りたたむ
     */
    var abone = function() {
        var self = this;
        dojo.query(resharePostsQuery).forEach(function(node, index, arr){
            var targetNode = node.parentNode.parentNode.parentNode.parentNode;
            if (!targetNode.forceOpen) {
            	/* 自分のポストでも折りたたむかどうか */
                chrome.extension.sendRequest({action:"is_exceptional_me"}, function(response) {
                    var isExceptionalMe = response === "true";
                	if (isExceptionalMe) {
                		/* 自分の投稿か確認し、自分のものだったらスキップ */
                        chrome.extension.sendRequest({action:"get_my_oid"}, function(myOid) {
                        	var anchors = targetNode.getElementsByTagName("a");
                        	for (var a = 0; a < anchors.length; a++) {
                        		var postOwnerOid = anchors[a].getAttribute("oid");
                        		if (postOwnerOid) {
                        			if (postOwnerOid !== myOid) {
                                		self.hidePost(targetNode);
                        			}
                        		}
                        	}
                        });
                	} else {
                		self.hidePost(targetNode);
                	}
                });
            }
        });
    };

    /**
     * 指定されたノードを折りたたむ。
     * @param targetNode {Object} 対象のノード
     * @returns なし
     */
    var hidePost = function(targetNode) {
    	if (targetNode.keepOpen) {
    		return;
    	}
        /* スタイルの適用(cf. displayPost) */
        var self = this;
        chrome.extension.sendRequest({action:"get_height"}, function(response) {
            dojo.style(targetNode, "opacity", "0.5");
            dojo.style(targetNode, "overflow", "hidden");
            dojo.style(targetNode, "height", response + "px");
            dojo.connect(targetNode, "onmouseenter", function() {
                if (!targetNode.forceOpen) {
                    self.displayPost(targetNode);
                }
            });
            targetNode.forceOpen = false;
        });
    };

    /**
     * 指定されたノードを折りたたんでいたポストとして表示する。
     * @param targetNode {Object} 対象のノード
     * @returns なし
     */
    var displayPost = function(targetNode) {
        /* スタイルの適用(cf. hidePost) */
        dojo.style(targetNode, "opacity", "1.0");
        dojo.style(targetNode, "overflow", "none");
        dojo.style(targetNode, "height", "auto");
        dojo.connect(targetNode, "onclick", function() {
        	targetNode.keepOpen = true;
        })
        dojo.connect(targetNode, "onmouseleave", function() {
            self.hidePost(targetNode);
        });
        targetNode.forceOpen = true;
    };

    /**
     * 折りたたみ適用対象か否かを返す。
     * @returns {Boolean} true: ミュート適用対象である。false: ミュート適用対象外である。
     */
    var isTargetPage = function() {
        return (document.location.href.indexOf("stream/circles") == -1
            && document.location.href.indexOf("notifications") == -1);
    };

    /**
     * ポストを監視して必要に応じて折りたたむ。参考) Mute Plus
     */
    var watchStream = function() {
        var self = this;
        if(isTargetPage()) {
            chrome.extension.sendRequest({action:"show_page_action_icon"}, function() {
                chrome.extension.sendRequest({action:"is_enabled"}, function(response) {
                    var enable = response === "true";
                    if (enable) {
                        var divs = document.getElementById("contentPane").getElementsByTagName("div");
                        for(var p = 0; p < divs.length; p++) {
                            var recentDivID = divs[p].id;
                            if(recentDivID.substring(0,6) == "update") {
                                if(recentDivID == previousPostId) {
                                    break;
                                } else {
                                    previousPostId = recentDivID;
                                    abone();
                                    break;
                                }
                            }
                        }
                    }
                });
            });
        }
    };

    var resoloveMyOid = function() {
        var myNodes = dojo.query(meQuery);
        if (myNodes.length <= 0) {
            return;
        }
        var myHref = myNodes[0].href;
        var _myOid = myHref.substring(plusUrl.length);
        myOid = _myOid;
        chrome.extension.sendRequest({action:"set_my_oid", oid:myOid}, function() {
        	// no-op
        });
    }

    /* 自分の OID を解決 */
    myOid = resoloveMyOid();
    
    /* メイン処理 */
    setInterval(watchStream, watchInterval);