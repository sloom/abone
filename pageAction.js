dojo.require("dijit.form.CheckBox");
dojo.require("dijit.form.Slider");
dojo.require("dijit.form.TextBox");

dojo.require("dijit.layout.TabContainer");
dojo.require("dijit.layout.ContentPane");

dojo.addOnLoad(function() {
    var background = chrome.extension.getBackgroundPage();

    /* ==================================================== */
    /* 各 UI 構築                                           */
    /* ==================================================== */
    /* タブ全体を司るコンテナ */
    var tabContainer = new dijit.layout.TabContainer({
        style: "height: 100%; width: 100%;"
    },
    "tab_container");

    /* ---------------------------------------------------- */
    /* 再共有ミュート有効・無効チェックボックス             */
    /* ---------------------------------------------------- */

    /* タブのラベル */
    var enableTabLabel = chrome.i18n.getMessage("enabled_tab_label_message");

    /* チェックボックス前のラベル */
    var enableLabel = chrome.i18n.getMessage("enabled_label_message");
    dojo.byId("enabledLabel").innerHTML = enableLabel;

    /* タブになるための ContentPane & タブに追加 */
    var enableContainer = new dijit.layout.ContentPane({
        title: enableTabLabel
    }, "reshare_container");
    tabContainer.addChild(enableContainer);    

    /* 現在の設定値を取得 */
    var initialState = background.isEnabled() === "true" ;

    /* チェックボックス構築 */
    var checkBox = new dijit.form.CheckBox({
        name: "enabled",
        value: "enabled",
        checked: initialState,
        onChange: function(b) {
            background.activate(b);
        }
    }, "enabledCheckBox");

    /* ---------------------------------------------------- */
    /* 自分のポストの例外チェックボックス                   */
    /* ---------------------------------------------------- */

    /* チェックボックス前のラベル */
    var exceptionalLabel = chrome.i18n.getMessage("exceptional_label_message");
    dojo.byId("exceptionalLabel").innerHTML = exceptionalLabel;

    /* 現在の設定値を取得 */
    var initialExceptionalMe = background.isExceptionalMe() === "true" ;

    /* チェックボックス構築 */
    var isExceptionalMeCheckBox = new dijit.form.CheckBox({
        name: "isExceptionalMe",
        value: "isExceptionalMe",
        checked: initialExceptionalMe,
        onChange: function(b) {
            background.setIsExceptionalMe(b);
        }
    }, "exceptionalCheckBox");
    
    /* ---------------------------------------------------- */
    /* 高さ設定スライダー                                   */
    /* ---------------------------------------------------- */

    /* 現在の設定値 */
    var initialHeight = parseInt(background.getHeight(), 10);

    /* スライダーのラベルとpx表示の初期値 */
    var heightSliderLabel = chrome.i18n.getMessage("heightSlider_label_message");
    dojo.byId("heightSliderLabel").innerHTML = heightSliderLabel;
    dojo.byId("heightSliderValue").innerHTML = initialHeight + " px";

    /* 高さ設定スライダーUI構築 */
    var slider = new dijit.form.HorizontalSlider({
        name: "heightSlider",
        value: initialHeight,
        minimum: 0,
        maximum: 100,
        intermediateChanges: true,
        style: "width:150px;",
        onChange: function(value) {
            dojo.byId("heightSliderValue").innerHTML = parseInt(value, 10) + " px";
            background.setHeight(value);
        },
        discreteValues: 110
    },
    "heightSlider");

    /* TODO: NG ユーザー, NG ワード */

    /* ---------------------------------------------------- */
    /* その他処理
    /* ---------------------------------------------------- */
    /* タブコンテナ初期化 */
    tabContainer.startup();
    
    /* UI が出来上がってから最後に見せる */
    dojo.style("configuration_pane", "display", "block");
});
