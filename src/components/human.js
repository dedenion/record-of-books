import React, { useState, useEffect, useRef } from 'react';

const THuman = () => {
  const [height, setHeight] = useState(170);  // 初期身長
  const [weight, setWeight] = useState(70);   // 初期体重
  const canvasRef = useRef(null);

  // 人体を描画する関数
  const drawHuman = (ctx, height, weight) => {
    ctx.clearRect(0, 0, 300, 300); // キャンバスのクリア

    // 身体のサイズを決定するためのスケーリングファクター
    const scaleHeight = height / 170;
    const scaleWeight = weight / 70;

    // 身体の中心位置
    const centerX = 150;
    const centerY = 100;

    // 頭を描画
    ctx.beginPath();
    ctx.arc(centerX, centerY - 50 * scaleHeight, 20 * scaleWeight, 0, Math.PI * 2);
    ctx.fillStyle = 'lightblue';
    ctx.fill();

    // 胴体を描画
    ctx.fillStyle = 'blue';
    ctx.fillRect(centerX - 20 * scaleWeight, centerY - 50 * scaleHeight, 40 * scaleWeight, 100 * scaleHeight);

    // 手を描画
    ctx.fillStyle = 'blue';
    ctx.fillRect(centerX - 60 * scaleWeight, centerY - 50 * scaleHeight, 40 * scaleWeight, 10 * scaleHeight); // 左手
    ctx.fillRect(centerX + 20 * scaleWeight, centerY - 50 * scaleHeight, 40 * scaleWeight, 10 * scaleHeight); // 右手

    // 足を描画
    ctx.fillStyle = 'blue';
    ctx.fillRect(centerX - 20 * scaleWeight, centerY + 50 * scaleHeight, 10 * scaleWeight, 50 * scaleHeight); // 左足
    ctx.fillRect(centerX + 10 * scaleWeight, centerY + 50 * scaleHeight, 10 * scaleWeight, 50 * scaleHeight); // 右足
  };

  // 身長と体重が変わるたびに再描画
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    drawHuman(ctx, height, weight);
  }, [height, weight]);

  return (
    <div>
      <canvas ref={canvasRef} width={300} height={300} style={{ border: '1px solid black' }}></canvas>
      <div>
        <label>Height (cm):</label>
        <input
          type="number"
          value={height}
          onChange={(e) => setHeight(Number(e.target.value))}
        />
      </div>
      <div>
        <label>Weight (kg):</label>
        <input
          type="number"
          value={weight}
          onChange={(e) => setWeight(Number(e.target.value))}
        />
      </div>
    </div>
  );
};

export default THuman;
