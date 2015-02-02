/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global window, document, CSInterface*/


/*

    Responsible for overwriting CSS at runtime according to CC app
    settings as defined by the end user.

*/

var themeManager = (function () {
    'use strict';
     
    /**
     * Convert the Color object to string in hexadecimal format;
     */
    function toHex(color, delta) {
        
        function computeValue(value, delta) {
            var computedValue = !isNaN(delta) ? value + delta : value;
            if (computedValue < 0) {
                computedValue = 0;
            } else if (computedValue > 255) {
                computedValue = 255;
            }
            
            computedValue = Math.floor(computedValue);
    
            computedValue = computedValue.toString(16);
            return computedValue.length === 1 ? "0" + computedValue : computedValue;
        }
    
        var hex = "";
        if (color) {
            hex = computeValue(color.red, delta) + computeValue(color.green, delta) + computeValue(color.blue, delta);
        }
        return hex;
    }


    function reverseColor(color, delta) {
        return toHex({
            red: Math.abs(255 - color.red),
            green: Math.abs(255 - color.green),
            blue: Math.abs(255 - color.blue)
        },
            delta);
    }
            

    function addRule(stylesheetId, selector, rule) {
        var stylesheet = document.getElementById(stylesheetId);
        
        if (stylesheet) {
            stylesheet = stylesheet.sheet;
            if (stylesheet.addRule) {
                stylesheet.addRule(selector, rule);
            } else if (stylesheet.insertRule) {
                stylesheet.insertRule(selector + ' { ' + rule + ' }', stylesheet.cssRules.length);
            }
        }
    }
        
        
                
    /**
     * Update the theme with the AppSkinInfo retrieved from the host product.
     */
    function updateThemeWithAppSkinInfo(appSkinInfo) {
        var themeShade = "",
            redShade = appSkinInfo.panelBackgroundColor.color.red;
        var styleId = "topcoat-host";

        if (redShade > 200) { // exact: 214 (#D6D6D6)
            themeShade = "lightlight"; // might be useful in the future
            // this is where font color and other theme dependent stuff could go
            $("#custom").attr("href", "style/customLightLight.css");
            //addRule(styleId, "body", "background-color:#d6d6d6" );
        
        } else if (redShade > 180) { // exact: 184 (#B8B8B8)
            themeShade = "light";
            $("#custom").attr("href", "style/customLight.css");
            //addRule(styleId, "body", "background-color:#B8B8B8" );

        } else if (redShade > 80) { // exact: 83 (#535353)
            themeShade = "dark";
            $("#custom").attr("href", "style/customDark.css");
            //addRule(styleId, "body", "background-color:#535353" );
        
        } else if (redShade > 50) { // exact: 52 (#343434)
            themeShade = "darkdark";
            $("#custom").attr("href", "style/customDarkDark.css");
            //addRule(styleId, "body", "background-color:#343434" );
        }


        var fontColor = themeShade.match(/light/) ? "#202020" : "#E6E6E6"
            
        addRule(styleId, "body", "font-family:" + appSkinInfo.baseFontFamily );
        addRule(styleId, "body", "font-size:" + appSkinInfo.baseFontSize + "px");
        addRule(styleId, "body", "color:" + fontColor);
    }
    
    
    function onAppThemeColorChanged(event) {
        var skinInfo = JSON.parse(window.__adobe_cep__.getHostEnvironment()).appSkinInfo;
        updateThemeWithAppSkinInfo(skinInfo);
    }


    function init() {
        
        var csInterface = new CSInterface();
    
        updateThemeWithAppSkinInfo(csInterface.hostEnvironment.appSkinInfo);
        
        csInterface.addEventListener(CSInterface.THEME_COLOR_CHANGED_EVENT, onAppThemeColorChanged);
    }
    
    return {
        init: init
    };
    
}());
