(function(window, document, undefined) {

  /*
    TemplatePackage Widget Common Functionality - 03/2015 - G. Ewing

    ** Description / Purpose ***********************************************************************************************

    This file is intended to be called locally by any CDC widget, it will load common widget functionality for
    all widgets.

    The intent is common scripts can be shared in to:
    1. Re Use Core Code / Increase Managability / Decrease Maintenance Time / Redundancy
    2. Reduce completity of individual widget libraries
    3. Reduce Complexity / DeMystify Metrics Calling

    ***************************************************************************************************************************
  */

  window.CDC = window.CDC || {};
  window.CDC.Widget = window.CDC.Widget || {};
  window.CDC.Widget.load = function (widgetLoader, widgetConfig, jqElement) {

    jqElement.attr('data-cdc-widget-id', widgetConfig.windowId); // SET ID
    jqElement.html(widgetConfig.widgetName + ' Loaded'); // HTML ASSIGNMENT - YOU CAN PLACE ANYTHING HERE TO INJECT HTML TO THE TARGET ELEMENT

  };

} (window, document));
