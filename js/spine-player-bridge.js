(function () {
    if (window.spine && !window.spinePlayer) {
        window.spinePlayer = window.spine;
    }

    if (window.spinePixi) {
        window.spine = window.spinePixi;
    }
})();
