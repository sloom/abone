dojo.require("dijit.form.CheckBox");
dojo.require("dijit.form.Slider");
dojo.require("dijit.form.TextBox");

dojo.addOnLoad(function() {
    var background = chrome.extension.getBackgroundPage();
    var initialState = background.isEnabled();
    if (initialState === undefined) {
        initialState = true;
    } else {
        initialState = initialState === "true";
    }
    var checkBox = new dijit.form.CheckBox({
        name: "enabled",
        value: "enabled",
        checked: initialState,
        onChange: function(b) {
            background.activate(b);
        }
    }, "enabledCheckBox");

    var initialHeight = parseInt(background.getHeight(), 10);

    var slider = new dijit.form.HorizontalSlider({
        name: "heightSlider",
        value: initialHeight,
        minimum: 0,
        maximum: 100,
        intermediateChanges: true,
        style: "width:150px;",
        onChange: function(value) {
            dojo.byId("heightSliderValue").innerHTML = parseInt(value, 10);
            background.setHeight(value);
        },
        discreteValues: 110
    },
    "heightSlider");

    var enableLabel = chrome.i18n.getMessage("enabled_label_message");
    dojo.byId("enabledLabel").innerHTML = enableLabel;

    var heightSliderLabel = chrome.i18n.getMessage("heightSlider_label_message");
    dojo.byId("heightSliderLabel").innerHTML = heightSliderLabel;
    dojo.byId("heightSliderValue").innerHTML = initialHeight;

    dojo.style("configuration_pane", "display", "block");
});