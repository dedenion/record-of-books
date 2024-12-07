import React, { useEffect } from 'react';

function MatrixEffect() {
    useEffect(() => {
        const s = window.screen;
        const c = document.getElementById("c");
        const ctx = c.getContext("2d");

        const width = c.width = s.width;
        const height = c.height = s.height;

        let matrix = "01";
        matrix = matrix.split("");

        const font_size = 10;
        const columns = c.width / font_size;
        const drops = [];
        for(let x = 0; x < columns; x++)
            drops[x] = 1;

        function draw() {
            ctx.fillStyle = "rgba(0, 0, 0, 0.04)";
            ctx.fillRect(0, 0, c.width, c.height);
            ctx.fillStyle = "#0F0";
            ctx.font = font_size + "px arial";
            for(let i = 0; i < drops.length; i++ ) {
                const text = matrix[Math.floor(Math.random() * matrix.length)];
                ctx.fillText(text, i * font_size, drops[i] * font_size);
                if(drops[i] * font_size > c.height && Math.random() > 0.975)
                    drops[i] = 0;
                drops[i]++;
            }
        }
        const intervalId = setInterval(draw, 35);
        return () => clearInterval(intervalId); // コンポーネントがアンマウントされるときにインターバルをクリアする
    }, []); // useEffectを一度だけ実行するように空の依存リストを渡す

    return (
        <canvas id="c"></canvas>
    );
}

export default MatrixEffect;
