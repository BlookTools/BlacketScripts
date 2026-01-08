// ==UserScript==
// @name         Chat Giphy Button
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Add Giphy button to chat interface
// @author       You
// @match        *://*/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    const GIPHY_API_KEY = 'get a key, and never share this script with you key in it'; // Replace with your API key, remember yall dont share it whatsoever

    if (!document.querySelector('link[href*="font-awesome"]')) {
        const faLink = document.createElement('link');
        faLink.rel = 'stylesheet';
        faLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
        document.head.appendChild(faLink);
        console.log('Font Awesome loaded');
    }

    const style = document.createElement('style');
    style.textContent = `
        .styles__chatEmojiButton___8RFa2-camelCase {
            margin-right: 0.521vw;
        }

        .styles__chatGiphyPickerContainer___KR4aN-camelCase {
            width: 18.229vw;
            background-color: #2f2f2f;
            text-align: center;
            position: absolute;
            bottom: 2.917vw;
            right: 0;
            min-height: 18.229vw;
            max-height: 18.229vw;
            border-radius: 0 0 0 0.521vw;
            box-shadow: inset 0 -0.417vw rgb(0 0 0 / 20%), 0 0 0.208vw rgb(0 0 0 / 15%);
            padding-bottom: 0.521vw;
            -ms-overflow-style: none;
            scrollbar-width: none;
            display: none;
            flex-direction: column;
            z-index: 999999;
        }

        .styles__chatGiphyPickerContainer___KR4aN-camelCase.active {
            display: flex;
        }

        .styles__chatGiphyPickerHeader___FK4Ac-camelCase {
            width: 100%;
            height: 2.604vw;
            background-color: #4f4f4f;
            box-shadow: inset 0 -0.417vw rgb(0 0 0 / 20%), 0 0 0.208vw rgb(0 0 0 / 15%);
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 1.042vw;
            color: white;
            position: absolute;
            bottom: calc(107.5% - 7.5%);
            border-radius: 0.521vw 0 0 0;
            padding: 0 0.521vw;
        }

        .styles__chatGiphyPickerSearch___FK4Ac-camelCase {
            width: 100%;
            height: 100%;
            background-color: transparent;
            border: none;
            outline: none;
            color: white;
            font-size: 0.938vw;
            padding: 0 0.521vw;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            font-weight: 400;
        }

        .styles__chatGiphyPickerSearch___FK4Ac-camelCase::placeholder {
            color: rgba(255, 255, 255, 0.6);
            font-weight: 400;
        }

        .styles__chatGiphyPickerBody___KR4aN-camelCase {
            display: flex;
            flex-wrap: wrap;
            max-height: 95%;
            bottom: 0.781vw;
            overflow-y: scroll;
            position: absolute;
            -ms-overflow-style: none;
            scrollbar-width: none;
            left: 0.260vw;
        }

        .styles__chatGiphyPickerBody___KR4aN-camelCase::-webkit-scrollbar {
            display: none;
        }

        .styles__chatGiphyPickerGif___UWUGR-camelCase {
            display: inline-flex;
            margin: 0.156vw;
            padding: 0.000vw;
            gap: 0.000vw;
            cursor: pointer;
            width: 5.625vw;
            height: 5.625vw;
            object-fit: cover;
            transition: 0.25s;
            border-radius: 0.208vw;
            overflow: hidden;
        }

        .styles__chatGiphyPickerGif___UWUGR-camelCase:hover {
            transform: scale(0.9);
        }

        .styles__chatGiphyPickerGif___UWUGR-camelCase img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .styles__chatGiphyPickerLoading___UWUGR-camelCase {
            color: rgba(255, 255, 255, 0.6);
            font-size: 0.938vw;
            padding: 2.604vw;
            width: 100%;
            text-align: center;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            font-weight: 400;
        }
    `;
    document.head.appendChild(style);

    function waitForElement(selector, callback, maxAttempts = 50) {
        let attempts = 0;
        const interval = setInterval(() => {
            attempts++;
            const element = document.querySelector(selector);
            if (element) {
                clearInterval(interval);
                console.log(`Found element: ${selector}`);
                callback(element);
            } else if (attempts >= maxAttempts) {
                clearInterval(interval);
                console.error(`Could not find element: ${selector} after ${maxAttempts} attempts`);
            }
        }, 200);
    }

    function initGiphy() {
        console.log('Looking for emoji button...');

        waitForElement('.styles__chatEmojiButton___8RFa2-camelCase', (emojiButton) => {
            const chatBox = document.getElementById('chatBox');

            if (!chatBox) {
                console.error('Could not find chatBox element');
                return;
            }

            console.log('Found chatBox');

            if (document.getElementById('giphyButtonCustom')) {
                console.log('Giphy button already exists lmaoo');
                return;
            }

            const giphyButton = document.createElement('div');
            giphyButton.id = 'giphyButtonCustom';
            giphyButton.className = 'styles__chatEmojiButton___8RFa2-camelCase';
            giphyButton.innerHTML = '<i style="font-size: 1.563vw;" class="fas fa-image" aria-hidden="true"></i>';

            const giphyPopup = document.createElement('div');
            giphyPopup.className = 'styles__chatGiphyPickerContainer___KR4aN-camelCase';
            giphyPopup.id = 'giphyPopup';
            giphyPopup.innerHTML = `
                <div class="styles__chatGiphyPickerHeader___FK4Ac-camelCase">
                    <input type="text" class="styles__chatGiphyPickerSearch___FK4Ac-camelCase" id="giphySearch" placeholder="Search GIFs...">
                </div>
                <div class="styles__chatGiphyPickerBody___KR4aN-camelCase" id="giphyBody">
                    <div class="styles__chatGiphyPickerLoading___UWUGR-camelCase">Search for GIFs...</div>
                </div>
            `;

            emojiButton.parentNode.insertBefore(giphyButton, emojiButton.nextSibling);

            const chatContainer = document.querySelector('.styles__chatInputContainer___gkR4A-camelCase');
            if (chatContainer) {
                chatContainer.style.position = 'relative';
                chatContainer.appendChild(giphyPopup);
            } else {
                document.body.appendChild(giphyPopup);
            }

            console.log('GIPHY BUTTON CREATED AND INSERTED YUHHH!');

            const giphySearch = document.getElementById('giphySearch');
            const giphyBody = document.getElementById('giphyBody');

            let searchTimeout;

            giphyButton.addEventListener('click', (e) => {
                e.stopPropagation();
                console.log('Giphy button clicked!');
                const isActive = giphyPopup.classList.toggle('active');

                if (isActive) {
                    giphySearch.focus();
                    if (!giphyBody.querySelector('.styles__chatGiphyPickerGif___UWUGR-camelCase')) {
                        loadTrendingGifs();
                    }
                }
            });

            document.addEventListener('click', (e) => {
                if (!giphyPopup.contains(e.target) && e.target !== giphyButton && !giphyButton.contains(e.target)) {
                    giphyPopup.classList.remove('active');
                }
            });

            giphyPopup.addEventListener('click', (e) => e.stopPropagation());

            giphySearch.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                const query = e.target.value.trim();

                if (query.length === 0) {
                    loadTrendingGifs();
                    return;
                }

                searchTimeout = setTimeout(() => searchGifs(query), 500);
            });

            async function loadTrendingGifs() {
                try {
                    giphyBody.innerHTML = '<div class="styles__chatGiphyPickerLoading___UWUGR-camelCase">Loading trending...</div>';
                    const response = await fetch(`https://api.giphy.com/v1/gifs/trending?api_key=${GIPHY_API_KEY}&limit=48&rating=g`);
                    const data = await response.json();

                    if (data.data && data.data.length > 0) {
                        displayGifs(data.data);
                    } else {
                        giphyBody.innerHTML = '<div class="styles__chatGiphyPickerLoading___UWUGR-camelCase">Check API key</div>';
                    }
                } catch (error) {
                    console.error('Giphy error:', error);
                    giphyBody.innerHTML = '<div class="styles__chatGiphyPickerLoading___UWUGR-camelCase">Error loading GIFs</div>';
                }
            }

            async function searchGifs(query) {
                try {
                    giphyBody.innerHTML = '<div class="styles__chatGiphyPickerLoading___UWUGR-camelCase">Searching...</div>';
                    const response = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=${encodeURIComponent(query)}&limit=48&rating=g`);
                    const data = await response.json();

                    if (data.data.length === 0) {
                        giphyBody.innerHTML = '<div class="styles__chatGiphyPickerLoading___UWUGR-camelCase">No GIFs found</div>';
                    } else {
                        displayGifs(data.data);
                    }
                } catch (error) {
                    giphyBody.innerHTML = '<div class="styles__chatGiphyPickerLoading___UWUGR-camelCase">Error searching</div>';
                }
            }

            function displayGifs(gifs) {
                giphyBody.innerHTML = '';
                gifs.forEach(gif => {
                    const item = document.createElement('div');
                    item.className = 'styles__chatGiphyPickerGif___UWUGR-camelCase';

                    const img = document.createElement('img');
                    img.src = gif.images.fixed_height_small.url;
                    img.alt = gif.title;
                    img.loading = 'lazy';

                    item.appendChild(img);
                    item.addEventListener('click', () => {
                        const currentValue = chatBox.value;
                        chatBox.value = currentValue + (currentValue ? '\n' : '') + gif.images.original.url;
                        giphyPopup.classList.remove('active');
                        chatBox.focus();
                        chatBox.dispatchEvent(new Event('input', { bubbles: true }));
                        console.log('GIF inserted:', gif.title);
                    });

                    giphyBody.appendChild(item);
                });
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initGiphy);
    } else {
        initGiphy();
    }
})();
