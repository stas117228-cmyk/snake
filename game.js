(() => {
  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d');
  const scoreEl = document.getElementById('score');
  const restartBtn = document.getElementById('restart');

  const COLS = 20;
  const ROWS = 20;
  const CELL = Math.floor(canvas.width / COLS);

  let snake, dir, food, running, tickInterval, score;

  function reset() {
    snake = [{x:9,y:9},{x:8,y:9},{x:7,y:9}];
    dir = {x:1,y:0};
    placeFood();
    score = 0;
    running = true;
    updateScore();
    clearInterval(tickInterval);
    tickInterval = setInterval(tick, 120);
    draw();
  }

  function placeFood(){
    while(true){
      const x = Math.floor(Math.random()*COLS);
      const y = Math.floor(Math.random()*ROWS);
      if(!snake.some(s => s.x===x && s.y===y)){
        food = {x,y};
        break;
      }
    }
  }

  function tick(){
    const head = {x: snake[0].x + dir.x, y: snake[0].y + dir.y};
    if(head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS || snake.some(s => s.x===head.x && s.y===head.y)){
      gameOver();
      return;
    }
    snake.unshift(head);
    if(head.x === food.x && head.y === food.y){
      score += 1;
      updateScore();
      placeFood();
      if(tickInterval) clearInterval(tickInterval);
      const speed = Math.max(40, 120 - score*4);
      tickInterval = setInterval(tick, speed);
    } else {
      snake.pop();
    }
    draw();
  }

  function updateScore(){
    scoreEl.textContent = Счёт: ;
  }

  function gameOver(){
    running = false;
    clearInterval(tickInterval);
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(0, canvas.height/2 - 30, canvas.width, 60);
    ctx.fillStyle = '#fff';
    ctx.font = '20px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Игра окончена — нажмите Перезапустить', canvas.width/2, canvas.height/2 + 7);
  }

  function draw(){
    ctx.fillStyle = '#08121a';
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.strokeStyle = 'rgba(255,255,255,0.03)';
    ctx.lineWidth = 1;
    for(let i=0;i<=COLS;i++){
      ctx.beginPath();ctx.moveTo(i*CELL,0);ctx.lineTo(i*CELL,canvas.height);ctx.stroke();
    }
    for(let j=0;j<=ROWS;j++){
      ctx.beginPath();ctx.moveTo(0,j*CELL);ctx.lineTo(canvas.width,j*CELL);ctx.stroke();
    }
    ctx.fillStyle = '#ff4d4f';
    drawCell(food.x, food.y);
    for(let i=0;i<snake.length;i++){
      const s = snake[i];
      ctx.fillStyle = i===0 ? '#10b981' : '#0ea5a9';
      drawCell(s.x, s.y);
    }
  }

  function drawCell(x,y){
    const pad = 2;
    ctx.fillRect(x*CELL + pad, y*CELL + pad, CELL - pad*2, CELL - pad*2);
  }

  window.addEventListener('keydown', e => {
    if(!running) return;
    const k = e.key;
    if(k === 'ArrowUp' || k === 'w' || k === 'W') setDir(0,-1);
    if(k === 'ArrowDown' || k === 's' || k === 'S') setDir(0,1);
    if(k === 'ArrowLeft' || k === 'a' || k === 'A') setDir(-1,0);
    if(k === 'ArrowRight' || k === 'd' || k === 'D') setDir(1,0);
  });

  function setDir(x,y){
    if(dir.x === -x && dir.y === -y) return;
    dir = {x,y};
  }

  (function addSwipe(){
    let startX=null, startY=null;
    canvas.addEventListener('touchstart', e => {
      const t = e.touches[0]; startX = t.clientX; startY = t.clientY;
    });
    canvas.addEventListener('touchend', e => {
      if(startX===null) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - startX; const dy = t.clientY - startY;
      if(Math.abs(dx) > Math.abs(dy)){
        if(dx>20) setDir(1,0); else if(dx<-20) setDir(-1,0);
      } else {
        if(dy>20) setDir(0,1); else if(dy<-20) setDir(0,-1);
      }
      startX = startY = null;
    });
  })();

  restartBtn.addEventListener('click', reset);
  reset();
})();
