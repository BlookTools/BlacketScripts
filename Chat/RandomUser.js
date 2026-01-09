// ==UserScript==
// @name         Chat Random User Button
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Add Random User button to chat interface
// @author       You
// @match        https://blacket.org/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

;(() => {
  console.log("loaded fsr")

  if (!document.querySelector('link[href*="font-awesome"]')) {
    const faLink = document.createElement("link")
    faLink.rel = "stylesheet"
    faLink.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
    document.head.appendChild(faLink)
    console.log("Font Awesome loaded")
  }

  const style = document.createElement("style")
  style.textContent = `
        .styles__chatEmojiButton___8RFa2-camelCase {
            margin-right: 0.521vw;
        }

        .styles__chatRandomUserPickerContainer___KR4aN-camelCase {
            width: 18.229vw;
            background-color: #2f2f2f;
            text-align: center;
            position: absolute;
            bottom: 2.917vw;
            right: 0;
            min-height: 12vw;
            max-height: 18.229vw;
            border-radius: 0 0 0 0.521vw;
            box-shadow: inset 0 -0.417vw rgb(0 0 0 / 20%), 0 0 0.208vw rgb(0 0 0 / 15%);
            padding: 0.521vw;
            -ms-overflow-style: none;
            scrollbar-width: none;
            display: none;
            flex-direction: column;
            z-index: 999999;
            gap: 0.521vw;
        }

        .styles__chatRandomUserPickerContainer___KR4aN-camelCase.active {
            display: flex;
        }

        .styles__chatRandomUserPickerHeader___FK4Ac-camelCase {
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
            bottom: calc(100% - 0.1vw);
            left: 0;
            border-radius: 0.521vw 0.521vw 0 0;
            padding: 0 0.521vw;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            font-weight: 600;
        }

        .styles__chatRandomUserGetButton___FK4Ac-camelCase {
            width: 100%;
            height: 2.604vw;
            background-color: #4f4f4f;
            box-shadow: inset 0 -0.417vw rgb(0 0 0 / 20%), 0 0 0.208vw rgb(0 0 0 / 15%);
            border: none;
            border-radius: 0.521vw;
            color: white;
            font-size: 0.938vw;
            font-weight: 600;
            cursor: pointer;
            transition: 0.25s;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        }

        .styles__chatRandomUserGetButton___FK4Ac-camelCase:hover {
            transform: scale(0.95);
            background-color: #5f5f5f;
        }

        .styles__chatRandomUserGetButton___FK4Ac-camelCase:active {
            transform: scale(0.9);
        }

        .styles__chatRandomUserCard___UWUGR-camelCase {
            width: 100%;
            min-height: 4vw;
            background-color: #3f3f3f;
            border-radius: 0.521vw;
            padding: 0.521vw;
            display: flex;
            align-items: center;
            gap: 0.625vw;
            position: relative;
            overflow: hidden;
            box-shadow: inset 0 -0.417vw rgb(0 0 0 / 20%), 0 0 0.208vw rgb(0 0 0 / 15%);
        }

        .styles__chatRandomUserBanner___UWUGR-camelCase {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            opacity: 0.25;
            z-index: 0;
        }

        .styles__chatRandomUserAvatar___UWUGR-camelCase {
            width: 3vw;
            height: 3vw;
            border-radius: 0.521vw;
            object-fit: cover;
            z-index: 1;
            box-shadow: 0 0 0.208vw rgb(0 0 0 / 50%);
        }

        .styles__chatRandomUserInfo___UWUGR-camelCase {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            gap: 0.156vw;
            z-index: 1;
            flex: 1;
        }

        .styles__chatRandomUserName___UWUGR-camelCase {
            color: white;
            font-size: 1.042vw;
            font-weight: 600;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            text-shadow: 0 0.104vw 0.208vw rgba(0, 0, 0, 0.5);
        }

        .styles__chatRandomUserLoading___UWUGR-camelCase {
            color: rgba(255, 255, 255, 0.6);
            font-size: 0.938vw;
            padding: 1vw;
            width: 100%;
            text-align: center;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            font-weight: 400;
        }
    `
  document.head.appendChild(style)

  function waitForElement(selector, callback, maxAttempts = 50) {
    let attempts = 0
    const interval = setInterval(() => {
      attempts++
      const element = document.querySelector(selector)
      if (element) {
        clearInterval(interval)
        console.log(`Found element: ${selector}`)
        callback(element)
      } else if (attempts >= maxAttempts) {
        clearInterval(interval)
        console.error(`Could not find element: ${selector} after ${maxAttempts} attempts`)
      }
    }, 200)
  }

  async function fetchRandomUser() {
    return new Promise((resolve, reject) => {
      if (!window.blacket || !window.blacket.requests) {
        reject(new Error("Blacket API not loaded"))
        return
      }

      if (typeof window.blacket.requests.get !== "function") {
        reject(new Error("Blacket API not loaded"))
        return
      }

      window.blacket.requests.get("/worker2/messages/0?limit=1000", (data) => {
        if (!data.error && data.messages && data.messages.length > 0) {
          const usersMap = new Map()

          data.messages.forEach((msg) => {
            if (msg.author && msg.author.username) {
              usersMap.set(msg.author.id, msg.author)
            }
          })

          const users = Array.from(usersMap.values())

          if (users.length > 0) {
            const randomUser = users[Math.floor(Math.random() * users.length)]
            resolve(randomUser)
          } else {
            reject(new Error("No users found"))
          }
        } else {
          reject(new Error("Failed to fetch messages"))
        }
      })
    })
  }

  function initRandomUser() {
    console.log("Looking for emoji button...")

    const waitForBlacket = setInterval(() => {
      if (typeof window.blacket !== "undefined" && window.blacket.user && window.blacket.requests) {
        clearInterval(waitForBlacket)
        setupRandomUserButton()
      }
    }, 100)
  }

  function setupRandomUserButton() {
    waitForElement(".styles__chatEmojiButton___8RFa2-camelCase", (emojiButton) => {
      console.log("Found emoji button")

      if (document.getElementById("randomUserButtonCustom")) {
        console.log("Random User button already exists")
        return
      }

      const randomUserButton = document.createElement("div")
      randomUserButton.id = "randomUserButtonCustom"
      randomUserButton.className = "styles__chatEmojiButton___8RFa2-camelCase"
      randomUserButton.innerHTML = '<i style="font-size: 1.563vw;" class="fas fa-user-circle" aria-hidden="true"></i>'

      const randomUserPopup = document.createElement("div")
      randomUserPopup.className = "styles__chatRandomUserPickerContainer___KR4aN-camelCase"
      randomUserPopup.id = "randomUserPopup"
      randomUserPopup.innerHTML = `
                <div class="styles__chatRandomUserPickerHeader___FK4Ac-camelCase">
                    Random User
                </div>
                <button class="styles__chatRandomUserGetButton___FK4Ac-camelCase" id="getRandomUserBtn">
                    <i class="fas fa-dice"></i> Get New Player
                </button>
                <div id="randomUserDisplay">
                    <div class="styles__chatRandomUserLoading___UWUGR-camelCase">Click to get a random user!</div>
                </div>
            `

      emojiButton.parentNode.insertBefore(randomUserButton, emojiButton.nextSibling)

      const chatContainer = document.querySelector(".styles__chatInputContainer___gkR4A-camelCase")
      if (chatContainer) {
        chatContainer.style.position = "relative"
        chatContainer.appendChild(randomUserPopup)
      } else {
        document.body.appendChild(randomUserPopup)
      }

      console.log("RANDOM USER BUTTON CREATED AND INSERTED WWWW!")

      const getRandomUserBtn = document.getElementById("getRandomUserBtn")
      const randomUserDisplay = document.getElementById("randomUserDisplay")

      randomUserButton.addEventListener("click", (e) => {
        e.stopPropagation()
        console.log("Random User button clicked!")
        randomUserPopup.classList.toggle("active")
      })

      document.addEventListener("click", (e) => {
        if (
          !randomUserPopup.contains(e.target) &&
          e.target !== randomUserButton &&
          !randomUserButton.contains(e.target)
        ) {
          randomUserPopup.classList.remove("active")
        }
      })

      randomUserPopup.addEventListener("click", (e) => e.stopPropagation())

      getRandomUserBtn.addEventListener("click", async () => {
        try {
          randomUserDisplay.innerHTML =
            '<div class="styles__chatRandomUserLoading___UWUGR-camelCase"><i class="fas fa-spinner fa-spin"></i> Finding...</div>'

          const user = await fetchRandomUser()

          randomUserDisplay.innerHTML = `
                        <div class="styles__chatRandomUserCard___UWUGR-camelCase">
                            <img class="styles__chatRandomUserBanner___UWUGR-camelCase" src="${user.banner || "/content/banners/Default.png"}" alt="Banner">
                            <img class="styles__chatRandomUserAvatar___UWUGR-camelCase" src="${user.avatar || "/content/blooks/Default.png"}" alt="Avatar">
                            <div class="styles__chatRandomUserInfo___UWUGR-camelCase">
                                <div class="styles__chatRandomUserName___UWUGR-camelCase">${user.username}</div>
                            </div>
                        </div>
                        <button class="styles__chatRandomUserGetButton___FK4Ac-camelCase" id="copyUsernameBtn" style="margin-top: 0.521vw;">
                            <i class="fas fa-copy"></i> Copy Username
                        </button>
                    `

          document.getElementById("copyUsernameBtn").addEventListener("click", () => {
            navigator.clipboard.writeText(user.username).then(() => {
              const btn = document.getElementById("copyUsernameBtn")
              btn.innerHTML = '<i class="fas fa-check"></i> Copied!'
              setTimeout(() => {
                btn.innerHTML = '<i class="fas fa-copy"></i> Copy Username'
              }, 2000)
            })
          })
        } catch (error) {
          console.error("Error getting random user:", error)
          randomUserDisplay.innerHTML =
            '<div class="styles__chatRandomUserLoading___UWUGR-camelCase">Error! Try again.</div>'
        }
      })
    })
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initRandomUser)
  } else {
    initRandomUser()
  }
})()
