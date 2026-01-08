// ==UserScript==
// @name         Blacket Credits Editor
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Add custom people to blacket.org credits page
// @author       franxe
// @match        https://blacket.org/credits*
// @match        http://blacket.org/credits*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function waitForElements() {
        if (typeof blacket !== 'undefined' && blacket.config && $('.styles__creditsContainer___fkEnvi-camelCase').length > 0) {
            initCreditsEditor();
        } else {
            setTimeout(waitForElements, 100);
        }
    }

    function initCreditsEditor() {
        const editorButton = `
            <div id="creditsEditorBtn" style="position: fixed; bottom: 20px; right: 20px; z-index: 9999;">
                <div role="button" tabindex="0" class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase">
                    <div class="styles__shadow___3GMdH-camelCase"></div>
                    <div class="styles__edge___3eWfq-camelCase" style="background-color: #3b99fc;"></div>
                    <div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase" style="background-color: #3b99fc;">
                        <i class="fas fa-plus" aria-hidden="true"></i> Add Credit
                    </div>
                </div>
            </div>
        `;
        $('body').append(editorButton);

        $('#creditsEditorBtn').click(function() {
            showAddCreditModal();
        });
    }

    function showAddCreditModal() {
        const modal = `
            <div class="arts__modal___VpEAD-camelCase" id="addCreditModal">
                <div style="height: fit-content; width: 35vw;" class="styles__container___3St5B-camelCase">
                    <div id="closeAddModal" style="margin-right: 0.599vw; right: 0; position: absolute; z-index: 15;" role="button" tabindex="0" class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase">
                        <div class="styles__shadow___3GMdH-camelCase"></div>
                        <div class="styles__edge___3eWfq-camelCase" style="background-color: #ac3b3b;"></div>
                        <div class="styles__front___vcvuy-camelCase styles__buttonInsideNoMinWidth___39vdp-camelCase" style="background-color: #ac3b3b; height: 1.563vw;">
                            <i class="fas fa-times" aria-hidden="true"></i>
                        </div>
                    </div>
                    <div style="font-family: 'Titan One', sans-serif; color: white; font-size: 2vw; text-align: center; margin-bottom: 1vw;">Add New Credit</div>
                    <div style="padding: 0 1.5vw;">
                        <div style="margin-bottom: 0.7vw;">
                            <label style="color: #aaa; font-size: 0.9vw; display: block; margin-bottom: 0.3vw;">Username</label>
                            <input type="text" id="creditUsername" style="width: 100%; padding: 0.4vw; border-radius: 0.3vw; border: none; font-size: 0.9vw; background: #1a1a1a; color: white;" placeholder="Enter username">
                        </div>
                        <div style="margin-bottom: 0.7vw;">
                            <label style="color: #aaa; font-size: 0.9vw; display: block; margin-bottom: 0.3vw;">Role</label>
                            <input type="text" id="creditRole" style="width: 100%; padding: 0.4vw; border-radius: 0.3vw; border: none; font-size: 0.9vw; background: #1a1a1a; color: white;" placeholder="Developer, Artist, etc.">
                        </div>
                        <div style="margin-bottom: 0.7vw;">
                            <label style="color: #aaa; font-size: 0.9vw; display: block; margin-bottom: 0.3vw;">Color</label>
                            <input type="text" id="creditColor" style="width: 100%; padding: 0.4vw; border-radius: 0.3vw; border: none; font-size: 0.9vw; background: #1a1a1a; color: white;" placeholder="#ffffff or rainbow" value="#ffffff">
                        </div>
                        <div style="margin-bottom: 0.7vw;">
                            <label style="color: #aaa; font-size: 0.9vw; display: block; margin-bottom: 0.3vw;">Avatar URL</label>
                            <input type="text" id="creditAvatar" style="width: 100%; padding: 0.4vw; border-radius: 0.3vw; border: none; font-size: 0.9vw; background: #1a1a1a; color: white;" placeholder="https://...">
                        </div>
                        <div style="margin-bottom: 0.7vw;">
                            <label style="color: #aaa; font-size: 0.9vw; display: block; margin-bottom: 0.3vw;">Banner URL</label>
                            <input type="text" id="creditBanner" style="width: 100%; padding: 0.4vw; border-radius: 0.3vw; border: none; font-size: 0.9vw; background: #1a1a1a; color: white;" placeholder="https://...">
                        </div>
                        <div style="margin-bottom: 0.7vw;">
                            <label style="color: #aaa; font-size: 0.9vw; display: block; margin-bottom: 0.3vw;">Note</label>
                            <textarea id="creditNote" style="width: 100%; padding: 0.4vw; border-radius: 0.3vw; border: none; font-size: 0.9vw; background: #1a1a1a; color: white; min-height: 2.5vw; resize: vertical;" placeholder="Enter a note"></textarea>
                        </div>
                        <div style="margin-bottom: 0.7vw;">
                            <label style="color: #aaa; font-size: 0.9vw; display: block; margin-bottom: 0.3vw;">Position (leave empty for end)</label>
                            <input type="number" id="creditPosition" style="width: 100%; padding: 0.4vw; border-radius: 0.3vw; border: none; font-size: 0.9vw; background: #1a1a1a; color: white;" placeholder="1 for first, 2 for second, etc." min="1">
                        </div>
                        <div style="display: flex; gap: 1vw; justify-content: center; margin-bottom: 0.8vw; margin-top: 1vw;">
                            <div id="submitCredit" role="button" tabindex="0" class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase">
                                <div class="styles__shadow___3GMdH-camelCase"></div>
                                <div class="styles__edge___3eWfq-camelCase" style="background-color: #3b99fc;"></div>
                                <div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase" style="background-color: #3b99fc;">
                                    Add Credit
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        $('body').append(modal);

        $('#closeAddModal').click(function() {
            $('#addCreditModal').remove();
        });

        $('#submitCredit').click(function() {
            addCredit();
        });
    }

    function addCredit() {
        const username = $('#creditUsername').val().trim();
        const role = $('#creditRole').val().trim();
        const color = $('#creditColor').val().trim() || '#ffffff';
        const avatar = $('#creditAvatar').val().trim();
        const banner = $('#creditBanner').val().trim();
        const note = $('#creditNote').val().trim();
        const position = $('#creditPosition').val().trim();

        if (!username || !role || !avatar || !banner || !note) {
            alert('Please fill in all required fields!');
            return;
        }

        const credit = {
            user: {
                username: username,
                role: role,
                color: color,
                avatar: avatar,
                banner: banner
            },
            note: note,
            top: false
        };

        const id = Math.random().toString(36).substring(2, 15);
        const creditHTML = `
            <div id="${id}" class="styles__creditsCreditContainer___bej3a-camelCase">
                <img class="styles__creditsCreditAvatar___4939A-camelCase" src="${credit.user.avatar}" draggable="false">
                <div style="color: ${credit.user.color};" class="styles__creditsCreditName___20Cma-camelCase${credit.user.color === "rainbow" ? ' rainbow' : ""}">[${credit.user.role}] ${credit.user.username}</div>
                <div class="styles__creditsCreditNote___9benj-camelCase">${note}</div>
            </div>
        `;

        const container = $('.styles__creditsContainer___fkEnvi-camelCase');
        const existingCredits = container.children();
        
        if (position && parseInt(position) > 0) {
            const pos = parseInt(position) - 1;
            if (pos >= existingCredits.length) {
                container.append(creditHTML);
            } else {
                $(existingCredits[pos]).before(creditHTML);
            }
        } else {
            container.append(creditHTML);
        }

        $(`#${id}`).click(function() {
            const detailModal = `
                <div class="arts__modal___VpEAD-camelCase">
                    <div style="height: fit-content; width: 39.063vw;" class="styles__container___3St5B-camelCase">
                        <div id="closeDetailButton" style="margin-right: 0.599vw;right: 0;position: absolute; z-index: 15;" role="button" tabindex="0" class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase">
                            <div class="styles__shadow___3GMdH-camelCase"></div>
                            <div class="styles__edge___3eWfq-camelCase" style="background-color: #ac3b3b;"></div>
                            <div class="styles__front___vcvuy-camelCase styles__buttonInsideNoMinWidth___39vdp-camelCase" style="background-color: #ac3b3b; height: 1.563vw;">
                                <i class="fas fa-times" aria-hidden="true"></i>
                            </div>
                        </div>
                        <div class="styles__headerLeft___1Hu3N-camelCase">
                            <div class="styles__headerLeftRow___8vTJL-camelCase">
                                <div class="styles__headerBlookContainer___36zY5-camelCase" role="button" tabindex="0">
                                    <div style="filter: unset;" class="styles__blookContainer___36LK2-camelCase styles__headerBlook___DdSHd-camelCase">
                                        <img loading="lazy" style="border-radius: 0.365vw;" src="${credit.user.avatar}" draggable="false" class="styles__blook___1R6So-camelCase">
                                    </div>
                                </div>
                                <div class="styles__headerInfo___1oWlb-camelCase">
                                    <div class="styles__headerBanner___3Uuuk-camelCase">
                                        <img loading="lazy" src="${credit.user.banner}" class="styles__headerBg___12ogR-camelCase" draggable="false">
                                        <div class="styles__headerName___1GBcl-camelCase${credit.user.color === "rainbow" ? ' rainbow' : ""}" style="color: ${credit.user.color};">${credit.user.username}</div>
                                        <div class="styles__headerTitle___24Ox2-camelCase">${credit.user.role}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="styles__text___KSL4--camelCase" style="text-align: center;">${note}</div>
                    </div>
                </div>
            `;
            $('body').append(detailModal);
            $('#closeDetailButton').click(function() {
                $('.arts__modal___VpEAD-camelCase').last().remove();
            });
        });

        $(`#${id} .styles__creditsCreditName___20Cma-camelCase`).each(function() {
            let width = $(this).parent().width();
            let textWidth = $(this).width();
            let fontSize = parseInt($(this).css("font-size"));
            while (textWidth > width && fontSize > 10) {
                fontSize--;
                $(this).css("font-size", fontSize + "px");
                textWidth = $(this).width();
            }
        });

        $('#addCreditModal').remove();
    }

    waitForElements();
})();
