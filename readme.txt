This is a search plugin for Firefox browser, written in javascript, that embeds at context menu on selecting text, and redirects user to custom search engine.

It was written by Alexey Vasilyev (alexa.infra@gmail.com).

===============================================================================

Behavior:

# Plugin hasn't specific user interface like toolbars, panels, icons and buttons
# After install of plugin, it adds an item to context menu at browser pages (context menu for any text selection on web page)
# Context menu has a label with text like "Search by my super search engine.."
# When user clicks to context menu item:
## new browser tab or window is opened
## it points to URL with search phrase, URL format is configured as following "http://searchengine.com/?search=%s&quot;
## search phrase is encoded by urlencode algorithm
## could also add itself version to search request
# if user selects more than MAX symbols, or less than MIN symbols at page, then after click on context menu message box is shown. MAX and MIN numbers are configured.
# at first run after installation, plugin opens its home page, url of page is configured

Supported versions:

# Firefox 2+
# Any platform with FF (including Win, Unix-like)

Build code: 

# pack all files at plugin directory to ZIP archive
# rename archive to .XPI

Install/uninstall plugin:

Check installed firefox version:
# HKEY_LOCAL_MACHINE\Software\Mozilla\Firefox\Mozilla Firefox
# an item CurrentVersion
Get path to firefox executable
# HKEY_LOCAL_MACHINE\Software\Mozilla\Firefox\Mozilla Firefox\%CURRENT_FF_VERSION%\Main
# an item pathToExe

Install/unistall:
# you could samply drug'n'drop XPI file to firefox :)
# or set link on web-page to XPI file (note - you should setup content type for xpi type)
# or manually:
## unpack XPI as ZIP archive to local folder %PLUGINPATH%
## at registry HKEY_LOCAL_MACHINE\Software\Mozilla\Firefox\Extensions
## create key with name %IDPLUGIN% and string value %PLUGINPATH%
## restart FF, it will prompt new plugin installation
## for uninstall - remove the one registry key, and restart FF

Build version and configure plugin:

# version, plugin identifier and name could be changed at install.rdf, see nodes 
## RDF->Description->em:version)
## RDF->Description->em:id
## RDF->Description->em:name
# text labels are placed at chrome\content\searchPlugin.properties
# other configurations - defaults\preferences\defaults.js

Code notes:

# context menu, and loading modules - chrome\content\contextMenu.xul
# plugin code is placed at chrome\content\searchPlugin.js
## settingsPlugin - load of configurations
## searchPlugin_navigate - handler for click on context menu item
## uninstallObserver - deinstallation control
# firstrun feature is controlled at uninstallObserver and settingsPlugin classes

===============================================================================

Happy plugin development :)

Sincerely, 
Alexey Vasilyev
