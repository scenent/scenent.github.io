document.addEventListener("DOMContentLoaded", () => {

    // ==========================
    // 홈 페이지만 실행
    // ==========================

    const path = window.location.pathname;

    const isHome =
        path === "/" ||
        path.endsWith("/index.html");

    if (!isHome) {
        return;
    }


    // ==========================
    // 설정
    // ==========================

    const CONFIG = {

        // 빗방울 개수
        dropCount: 390,


        // 속도 배율
        speedMultiplier: 1.5,


        // 바람
        // 0   = 수직
        // -값 = 왼쪽
        // +값 = 오른쪽
        wind: 0,


        // 색상
        color: "80,120,160",


        // true  = 모든 빗방울 동일
        // false = 랜덤 비
        uniformRain: false,


        // ==========================
        // 튀김 효과 설정
        // ==========================

        splash: {

            // 튀는 물방울 개수
            minDrops: 2,
            maxDrops: 3,
            // 위쪽으로 튀는 힘
            //minVelocity: 2.5,
            //maxVelocity: 4.5,
            // 좌우로 퍼지는 정도
            //spread: 1.8,
            // 튀는 물방울 수명
            minLife: 15,
            maxLife: 28,
            // 튀는 물방울 크기
            minLength: 5,
            maxLength: 12,
            // 튀는 물방울 투명도
            opacity: 0.45,
            // 튀는 물방울 중력
            //gravity: 0.16

//minVelocity: 2.0,
//maxVelocity: 3.5,
//spread: 1.2,
//gravity: 0.12

minVelocity: 3.5,
maxVelocity: 6.0,
spread: 2.5,
gravity: 0.20
        }
    };


    // ==========================
    // Canvas 생성
    // ==========================

    const canvas = document.createElement("canvas");

    canvas.id = "rain-canvas";

    canvas.style.position = "fixed";
    canvas.style.left = "0";
    canvas.style.top = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";

    // 콘텐츠 위에 있지만 클릭을 방해하지 않음
    canvas.style.pointerEvents = "none";

    // Material UI보다 위에 표시
    canvas.style.zIndex = "9999";

    document.body.appendChild(canvas);

    const ctx = canvas.getContext("2d");


    // ==========================
    // Canvas 크기
    // ==========================

    function resize() {

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resize();

    window.addEventListener(
        "resize",
        resize
    );


    // ==========================
    // Footer 찾기
    // ==========================

    function getFooterTop() {

        /*
         * MkDocs Material footer
         *
         * 일반적으로:
         * <footer class="md-footer">
         */

        const footer =
            document.querySelector(".md-footer");

        if (!footer) {

            // footer를 찾지 못하면
            // 화면 맨 아래를 충돌 지점으로 사용
            return canvas.height;
        }


        const rect =
            footer.getBoundingClientRect();


        return rect.top;
    }


    // ==========================
    // Rain Particle
    // ==========================

    const drops = [];


    class RainDrop {

        constructor(index) {

            this.index = index;

            this.reset(true);
        }


        reset(initial = false) {

            // ==========================
            // 랜덤 없는 비
            // ==========================

            if (CONFIG.uniformRain) {

                this.x =
                    (this.index / CONFIG.dropCount)
                    * canvas.width;


                if (initial) {

                    this.y =
                        Math.random()
                        * canvas.height;

                } else {

                    this.y = -50;
                }


                this.vx =
                    CONFIG.wind;


                this.vy = 6;


                this.length = 24;


                this.opacity = 0.3;


                this.width = 1;


                return;
            }


            // ==========================
            // 랜덤 비
            // ==========================

            this.x =
                Math.random()
                * (canvas.width + 400)
                - 200;


            if (initial) {

                this.y =
                    Math.random()
                    * canvas.height;

            } else {

                this.y =
                    -50 -
                    Math.random() * 300;
            }


            this.vx =
                CONFIG.wind +
                (Math.random() - 0.5)
                * 0.5;


            this.vy =
                4 +
                Math.random() * 3;


            this.length =
                40 +
                Math.random() * 30;


            this.opacity =
                0.15 +
                Math.random() * 0.35;


            this.width =
                0.7 +
                Math.random() * 0.8;

        }


        update() {

            this.x +=
                this.vx *
                CONFIG.speedMultiplier;


            this.y +=
                this.vy *
                CONFIG.speedMultiplier;


            // ==========================
            // Footer 충돌
            // ==========================

            const footerTop =
                getFooterTop();


            if (
                this.y >= footerTop &&
                this.y <= footerTop + 30
            ) {

                createSplash(
                    this.x,
                    footerTop
                );


                this.reset(false);

                return;
            }


            // ==========================
            // 화면 밖
            // ==========================

            if (

                this.y >
                canvas.height + 100

                ||

                this.x <
                -300

                ||

                this.x >
                canvas.width + 300

            ) {

                this.reset(false);
            }

        }


        draw() {

            ctx.beginPath();


            ctx.strokeStyle =
                `rgba(${CONFIG.color},${this.opacity})`;


            ctx.lineWidth =
                this.width;


            // 이동 방향 벡터

            const magnitude =
                Math.sqrt(
                    this.vx * this.vx +
                    this.vy * this.vy
                );


            const dx =
                (this.vx / magnitude)
                * this.length;


            const dy =
                (this.vy / magnitude)
                * this.length;


            ctx.moveTo(
                this.x,
                this.y
            );


            ctx.lineTo(
                this.x - dx,
                this.y - dy
            );


            ctx.stroke();

        }

    }


    // ==========================
    // Splash Particle
    // ==========================

    const splashes = [];


    class SplashDrop {

        constructor(x, y) {

            this.x = x;
            this.y = y;


            // 좌우로 랜덤하게 퍼짐

            this.vx =
                (Math.random() - 0.5)
                * CONFIG.splash.spread;


            // 위쪽으로 튀어오름

            this.vy =
                -(
                    CONFIG.splash.minVelocity +
                    Math.random() *
                    (
                        CONFIG.splash.maxVelocity -
                        CONFIG.splash.minVelocity
                    )
                );


            this.life =
                CONFIG.splash.minLife +
                Math.random() *
                (
                    CONFIG.splash.maxLife -
                    CONFIG.splash.minLife
                );


            this.maxLife =
                this.life;


            this.length =
                CONFIG.splash.minLength +
                Math.random() *
                (
                    CONFIG.splash.maxLength -
                    CONFIG.splash.minLength
                );


            this.width =
                0.5 +
                Math.random() * 0.6;

        }


        update() {

            this.x += this.vx;
            this.y += this.vy;


            // 중력

            this.vy +=
                CONFIG.splash.gravity;


            this.life--;


            return this.life > 0;

        }


        draw() {

            const alpha =
                (
                    this.life /
                    this.maxLife
                ) *
                CONFIG.splash.opacity;


            ctx.beginPath();


            ctx.strokeStyle =
                `rgba(${CONFIG.color},${alpha})`;


            ctx.lineWidth =
                this.width;


            // 튀어오르는 방향

            const magnitude =
                Math.sqrt(
                    this.vx * this.vx +
                    this.vy * this.vy
                );


            const dx =
                (
                    this.vx /
                    magnitude
                ) *
                this.length;


            const dy =
                (
                    this.vy /
                    magnitude
                ) *
                this.length;


            ctx.moveTo(
                this.x,
                this.y
            );


            ctx.lineTo(
                this.x - dx,
                this.y - dy
            );


            ctx.stroke();

        }

    }


    // ==========================
    // Splash 생성
    // ==========================

    function createSplash(x, y) {

        const count =
            Math.floor(
                CONFIG.splash.minDrops +
                Math.random() *
                (
                    CONFIG.splash.maxDrops -
                    CONFIG.splash.minDrops +
                    1
                )
            );


        for (
            let i = 0;
            i < count;
            i++
        ) {

            splashes.push(
                new SplashDrop(x, y)
            );

        }

    }


    // ==========================
    // Particle 생성
    // ==========================

    for (
        let i = 0;
        i < CONFIG.dropCount;
        i++
    ) {

        drops.push(
            new RainDrop(i)
        );

    }


    // ==========================
    // Animation Loop
    // ==========================

    function animate() {

        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );


        // ==========================
        // Rain
        // ==========================

        for (const drop of drops) {

            drop.update();
            drop.draw();

        }


        // ==========================
        // Splash
        // ==========================

        for (
            let i = splashes.length - 1;
            i >= 0;
            i--
        ) {

            const splash =
                splashes[i];


            if (!splash.update()) {

                splashes.splice(i, 1);

                continue;
            }


            splash.draw();

        }


        requestAnimationFrame(
            animate
        );

    }


    animate();

});
