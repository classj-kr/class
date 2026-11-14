(() => {
    "use strict";

    async function show(line) {
        const text = line?.firstChild;
        const prefix = "PLAYER · ";
        if (text?.nodeType !== Node.TEXT_NODE || !text.data.startsWith(prefix)) return;
        const label = text.data;
        const avatars = window.ClassroomAvatars;
        const key = await avatars?.loadKey();
        if (!key) return;

        const figure = avatars.create(key);
        figure.classList.add("solo-player-avatar");
        const image = figure.querySelector("img");
        const insert = () => {
            if (!line.isConnected || line.firstChild !== text || text.data !== label) return;
            const name = text.splitText(prefix.length);
            line.insertBefore(figure, name);
        };
        if (image.complete) {
            if (image.naturalWidth) insert();
        } else {
            image.addEventListener("load", insert, { once: true });
        }
    }

    window.ClassroomSoloAvatar = { show };
})();
