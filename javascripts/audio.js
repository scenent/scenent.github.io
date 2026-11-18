document.addEventListener("DOMContentLoaded", function () {
    // 메인 페이지에서만 실행
    if (window.location.pathname !== "/" &&
        !window.location.pathname.endsWith("/index.html")) {
        return;
    }

    const audio = new Audio("/rainydays.mp3");
    audio.loop = true;
    audio.volume = 0.3;

    // 자동 재생 시도
    audio.play().catch(() => {
        // console.log("자동 재생이 차단되었습니다.");
        console.log("failed to play audio : rainydays.mp3");
    });

    // 사용자 첫 클릭 시 재생
    document.addEventListener("click", function playAudio() {
        audio.play().catch(() => {});
        document.removeEventListener("click", playAudio);
    }, { once: true });

    const button = document.getElementById("rain-toggle");
    if (button) {
        button.addEventListener("click", function() {
            if (audio.paused) { audio.play(); } else { audio.pause(); }
        });
    }
});