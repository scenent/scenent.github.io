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
        dropCount: 300,


        // 속도 배율
        // 낮을수록 느림
        speedMultiplier: 0.93,


        // 바람
        // 0   = 수직
        // -값 = 왼쪽 바람
        // +값 = 오른쪽 바람
        wind: -1.2,


        // 색상
        color: "100,140,180",


        // true  = 모든 빗방울 동일
        // false = 랜덤 비
        uniformRain: false
    };


    // ==========================
    // Canvas 생성
    // ==========================

    const canvas = document.createElement("canvas");

    canvas.id = "rain-canvas";

    document.body.appendChild(canvas);


    const ctx = canvas.getContext("2d");


    function resize() {

        canvas.width =
            window.innerWidth;

        canvas.height =
            window.innerHeight;
    }


    resize();


    window.addEventListener(
        "resize",
        resize
    );



    // ==========================
    // Rain Particle
    // ==========================

    const drops = [];


    class RainDrop {


        constructor(index) {

            this.index = index;

            // 최초 생성은 전체 화면 분산
            this.reset(true);
        }



        reset(initial = false) {


            // --------------------------
            // 랜덤 없는 비
            // --------------------------

            if (CONFIG.uniformRain) {


                this.x =
                    (this.index / CONFIG.dropCount)
                    * canvas.width;


                if (initial) {

                    this.y =
                        Math.random()
                        * canvas.height;

                } else {

                    this.y =
                        -50;
                }


                this.vx =
                    CONFIG.wind;


                this.vy =
                    6;


                this.length =
                    24;


                this.opacity =
                    0.3;


                this.width =
                    1;


                return;
            }



            // --------------------------
            // 랜덤 비
            // --------------------------

            this.x =
                Math.random()
                * (canvas.width + 400)
                - 200;



            if (initial) {

                // 첫 화면 전체 분산
                this.y =
                    Math.random()
                    * canvas.height;

            } else {

                // 이후 생성은 위에서
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
                24 +
                Math.random() * 20;



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



        for (const drop of drops) {

            drop.update();

            drop.draw();

        }



        requestAnimationFrame(
            animate
        );

    }



    animate();

});