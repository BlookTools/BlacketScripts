(function () { //i gotta fix the yt bit
  const wait = setInterval(() => {
    if (!window.blacket || !blacket.createToast) return;

    const dropdown = document.querySelector(
      ".styles__profileDropdownMenu___2jUAA-camelCase"
    );
    if (!dropdown) return;

    clearInterval(wait);

    if (document.getElementById("secret-rickroll-btn")) return;

    const secret = document.createElement("a");
    secret.id = "secret-rickroll-btn";
    secret.className = "styles__profileDropdownOption___ljZXD-camelCase";
    secret.href = "javascript:void(0)";
    secret.innerHTML = `
      <i class="fas fa-user-secret styles__profileDropdownOptionIcon___15VKX-camelCase"></i>
      Secret
    `;
    dropdown.appendChild(secret);

    const lyrics = (
      "Never gonna give you up never gonna let you down never gonna run around and desert you"
    ).split(" ");

    let spamInterval = null;
    let overlay = null;

    function startRickroll() {
      overlay = document.createElement("div");
      overlay.id = "rickroll-overlay";
      overlay.style.cssText = `
        position: fixed;
        inset: 0;
        z-index: 1;
        pointer-events: none;
        opacity: 0.12;
      `;

      overlay.innerHTML = `
        <iframe
          src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1&controls=0&loop=1&playlist=dQw4w9WgXcQ"
          frameborder="0"
          allow="autoplay"
          style="width:100%; height:100%;"
        ></iframe>
      `;

      document.body.appendChild(overlay);

      let i = 0;
      spamInterval = setInterval(() => {
        blacket.createToast({
          title: "🤫 Secret",
          message: lyrics[i],
          icon: "/content/blooks/Jigglypuff.png",
          time: 700
        });

        i++;
        if (i >= lyrics.length) i = 0;
      }, 120); 
    }

    function stopRickroll() {
      clearInterval(spamInterval);
      spamInterval = null;
      overlay?.remove();
      overlay = null;
    }

    secret.addEventListener("click", () => {
      if (spamInterval) stopRickroll();
      else startRickroll();
    });
  }, 150);
})();
