// ==UserScript==
// @name         Blacket Red to Black Text
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Makes Blacket text animate red to black
// @author       Franxe
// @match        *://*.blacket.org/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const style = document.createElement('style');
    style.textContent = `
        @keyframes redToBlack {
            0% { color: #ff0000; }
            50% { color: #000000; }
            100% { color: #ff0000; }
        }
        #big-name {
            animation: redToBlack 2s infinite !important;
        }
    `;
    document.head.appendChild(style);
})();
