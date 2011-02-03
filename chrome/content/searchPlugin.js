//
// Constants
//
var Cc = Components.classes;
var Ci = Components.interfaces;

var settingsDomain = "searchPlugin";

//
// Open new tab at browser and navigate to url
// 
function navigateTo(url) {
    gBrowser.selectedTab = gBrowser.addTab(url)
}

//
// Settings control
//
var settingsPlugin = {
    prefs: null,
    
    firstRun: true,
    currentVersion: '',

    searchMinChars: 0,
    serachMaxChars: 0,
    searchUrlFormat: '',
    welcomePageUrl: '',
    menuItemText: '',
    searchMinCharsError: '',
    searchmaxCharsError: '',

    init: function() {
        // initialize plugin preferencies
        this.prefs = Cc["@mozilla.org/preferences-service;1"].getService(Ci.nsIPrefService).getBranch(settingsDomain + '.');
        this.prefs.QueryInterface(Ci.nsIPrefBranch2);

        // load actual settings data
        this.searchMinChars = this.prefs.getIntPref("searchMinChars");
        this.searchMaxChars = this.prefs.getIntPref("searchMaxChars");
        this.searchUrlFormat = this.prefs.getCharPref("searchUrlFormat");
        this.welcomePageUrl = this.prefs.getCharPref("welcomePageUrl");
        
        try {
        var strbundle = document.getElementById("stringsPlugin");
        this.menuItemText=strbundle.getString("menuItemText");
        this.searchMinCharsError=strbundle.getString("minCharsError");
        this.searchMaxCharsError=strbundle.getString("maxCharsError");
        } catch (err) {
            alert(err)
        }

        try {
        var gExtensionManager = Cc["@mozilla.org/extensions/manager;1"].getService(Ci.nsIExtensionManager);  
        this.currentVersion = gExtensionManager.getItemForID("alexa.infra@plugin-develop").version;
        } catch (err) {
            alert(err);
        }
        try {
            this.firstRun = this.prefs.getBoolPref("first_run");
        } catch (err) {
        }
        if (this.firstRun) {
            this.prefs.setBoolPref("first_run", false);
            window.setTimeout(function() {
                navigateTo(settingsPlugin.welcomePageUrl)
            }, 1500);
        }
    },
    cleanup: function() {
        try {
            this.prefs.deleteBranch("first_run");
            this.prefs.savePrefFile(null);
        } catch (err) {
        }
    }
}

//
// String.Format function ("{0}_{1}")
// 
String.prototype.formatstr = function(){
    var pattern = /\{\d+\}/g;
    var args = arguments;
    return this.replace(pattern, function(capture){
        return args[capture.match(/\d+/)];
    });
}

//
// Enable/disable menu item handler
//
function ShowContextMenu(event) {
    var popupButton = document.getElementById('menu_searchPlugin')
    var popupNode = document.popupNode
    popupButton.disabled = !(gContextMenu.isTextSelected)
}

//
// Bind context menu item
//
function addPopupSearchButton(event) {
    window.removeEventListener("load", addPopupSearchButton, false)

    var contextMenu = document.getElementById('contentAreaContextMenu');
    if (contextMenu)
    {
        contextMenu.addEventListener("popupshowing", ShowContextMenu, false);
    }

    var popupButton = document.getElementById('menu_searchPlugin')
    if (popupButton) {
        popupButton.setAttribute('label', settingsPlugin.menuItemText)
    }

    uninstallObserver.register();
}

//
// Initialization
//
window.addEventListener("load", function(){
    settingsPlugin.init();
    addPopupSearchButton();
}, false);

//
// get browser version
//
function getBrowserVersion() {
    var ffversion = 3.0;
    if (/Firefox[\/\s](\d+\.\d+)/.test(navigator.userAgent)){ //test for Firefox/x.x or Firefox x.x (ignoring remaining digits);
         ffversion = new Number(RegExp.$1);
    }
    return ffversion;
}

//
// Context menu item click
//
function searchPlugin_navigate() {
    var prompts = Cc["@mozilla.org/embedcomp/prompt-service;1"].getService(Ci.nsIPromptService);  
    // get selected text
    var focusedWindow = document.commandDispatcher.focusedWindow;
    var selectedText = focusedWindow.getSelection().toString();
    // check up text lenght
    if (!selectedText 
        || selectedText.length < settingsPlugin.searchMinChars) {
        prompts.alert(null, '', settingsPlugin.searchMinCharsError);
        return;
    } else if (selectedText.length > settingsPlugin.searchMaxChars) {
        prompts.alert(null, '', settingsPlugin.searchMaxCharsError);
        return;
    }

    var ffversion = "FF{0}".formatstr(getBrowserVersion());

    // encode text
    selectedText = fixedEncodeURIComponent(selectedText)
    // generate url
    var url = settingsPlugin.searchUrlFormat.formatstr(selectedText, settingsPlugin.currentVersion, ffversion)
    
    // open new tab
    navigateTo(url);
}

//
// String encoding
//
function fixedEncodeURIComponent (str) {  
    return encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/\*/g, '%2A');  
}  

//
// Control uninstall plugin event
//
var uninstallObserver = {
    observe:function(subject,topic,data) {
        subject = subject.QueryInterface(Components.interfaces.nsIUpdateItem);
        if (subject.name == "SearchPluginFF" && data == "item-uninstalled") {
            //uninstall clean-up script
            settingsPlugin.cleanup()
        }
    },

    register:function() {
        var observerService = Components.classes["@mozilla.org/observer-service;1"].getService(Components.interfaces.nsIObserverService);
        observerService.addObserver(this, "em-action-requested", false);
    },

    deregister:function() {
        var observerService = Components.classes["@mozilla.org/observer-service;1"].getService(Components.interfaces.nsIObserverService);
        observerService.removeObserver(this,"em-action-requested");
    }
};


window.addEventListener("unload", function(e){
    uninstallObserver.deregister();
}, false);
