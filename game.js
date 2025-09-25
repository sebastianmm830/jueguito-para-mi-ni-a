const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let player = { x:canvas.width/2, y:canvas.height-100, r:35, vx:0 };
let petals = [], starsFalling = [], hearts = [];
let score=0, final=false, started=false;

// Mensajes de amor
const messages = [
  "Eres la razón de mi sonrisa 💕",
  "Cada rosa es un beso para ti 😘",
  "Te amo más que ayer y menos que mañana 💖",
  "Mi corazón late solo por ti ❤️",
  "Eres mi sueño hecho realidad 🌹",
  "Tus ojos iluminan mi universo ✨",
  "Quiero estar contigo por siempre 💍",
  "Tu amor es mi mayor regalo 🎁",
  "Eres mi princesa hermosa 👑",
  "Gracias por existir en mi vida 🙏",
  "Cada día contigo es un milagro ✨",
  "Cuando sonríes, el mundo se ilumina 🌞",
  "No hay distancia que pueda separarnos 💌",
  "Eres el sol en mis días nublados ☀️",
  "Mi vida tiene sentido gracias a ti 💞",
  "No necesito nada más, solo a ti 💫",
  "Tus abrazos son mi refugio favorito 🤗",
  "Quiero envejecer a tu lado 👵👴",
  "Eres mi persona favorita en todo el universo 🌌",
  "Si pudiera pedir un deseo, pediría vivir contigo mil vidas ✨",
  "Tu voz es la melodía que calma mi corazón 🎶",
  "Cada momento contigo es inolvidable 📸",
  "Eres la dueña de mis pensamientos 💭",
  "Mi corazón solo late con tu nombre 💓",
  "Eres mi amor eterno, mi todo, mi siempre 💍"
];
const letter = `
Querida shiquita de papi,

Cada rosa que atrapas en este juego representa
un latido de mi corazón. Estoy agradecido
por cada momento contigo. Eres mi amor eterno.

Con todo mi amor,
Sebastian 💖
`;

const music = document.getElementById("music");

// Estrellas de fondo
let stars = [];
for(let i=0;i<150;i++){
  stars.push({x:Math.random()*canvas.width, y:Math.random()*canvas.height, r:Math.random()*1.5+0.5, on:Math.random()>0.5});
}

function drawStars(){
  for(let s of stars){
    if(Math.random()<0.01) s.on = !s.on;
    if(s.on){
      ctx.beginPath();
      ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
      ctx.fillStyle="#fff";
      ctx.fill();
    }
  }
}

function drawPlayer(){
  ctx.beginPath();
  ctx.fillStyle="#ff3366";
  ctx.arc(player.x,player.y,player.r,0,Math.PI*2);
  ctx.fill();
  ctx.font="30px Arial";
  ctx.fillText("💖",player.x-16,player.y+10);
}

function drawPetals(){
  ctx.font="28px serif";
  for(const p of petals) ctx.fillText("🌹",p.x,p.y);
  for(const s of starsFalling) ctx.fillText("✨",s.x,s.y);
}

function drawHearts(){
  ctx.font="24px serif";
  for(const h of hearts) ctx.fillText("💘",h.x,h.y);
}

function update(dt){
  if(!started) return;

  if(final){
    for(const h of hearts){
      h.y += h.vy*dt;
      if(h.y>canvas.height+20){ h.y=-20; h.x=Math.random()*canvas.width; }
    }
    return;
  }

  player.x += player.vx*dt;
  if(player.x<player.r) player.x=player.r;
  if(player.x>canvas.width-player.r) player.x=canvas.width-player.r;

  for(const p of petals) p.y += 120*dt;
  for(const s of starsFalling) s.y += 140*dt;

  // Colisiones con pétalos
  for(let i=petals.length-1;i>=0;i--){
    let p=petals[i];
    if(Math.hypot(player.x-p.x,player.y-p.y)<player.r+20){
      petals.splice(i,1);
      score++;
      document.getElementById("score").innerText = "Rosas: "+score;

      // Mensajes cada 100 rosas
      if(score % 100 === 0){
        let idx = Math.floor(score / 100 - 1) % messages.length;
        document.getElementById("msg").innerHTML = messages[idx];
        document.getElementById("msg").style.display="block";
        setTimeout(()=>{ document.getElementById("msg").style.display="none"; }, 3000);
      }

      // Carta romántica a las 1000 rosas
      if(score>=1000){
        final = true;
        document.getElementById("letter").innerHTML = letter;
        document.getElementById("letter").style.display = "block";
        for(let j=0;j<80;j++){
          hearts.push({x:Math.random()*canvas.width,y:Math.random()*canvas.height,vy:50+Math.random()*100});
        }
      }
    } else if(p.y>canvas.height+40) petals.splice(i,1);
  }

  // Colisiones con estrellas
  for(let i=starsFalling.length-1;i>=0;i--){
    let s=starsFalling[i];
    if(Math.hypot(player.x-s.x,player.y-s.y)<player.r+20){
      starsFalling.splice(i,1);
      score++;
      document.getElementById("score").innerText = "Rosas: "+score;
    } else if(s.y>canvas.height+40) starsFalling.splice(i,1);
  }

  // Generar nuevas rosas y estrellas
  if(Math.random()<0.05) petals.push({x:Math.random()*canvas.width,y:-20});
  if(Math.random()<0.03) starsFalling.push({x:Math.random()*canvas.width,y:-20});

  // Actualizar contador de próximo mensaje
  let next = Math.ceil(score/100)*100;
  if(!final) document.getElementById("nextMsg").innerText = "Próximo mensaje: "+(next - score);
}

let last=performance.now();
function loop(now){
  const dt=(now-last)/1000; last=now;
  ctx.clearRect(0,0,canvas.width,canvas.height);
  drawStars();
  drawPlayer();
  drawPetals();
  if(final) drawHearts();
  update(dt);
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

// Controles teclado
window.addEventListener("keydown",e=>{
  if(e.key==="ArrowLeft") player.vx=-250;
  if(e.key==="ArrowRight") player.vx=250;
});
window.addEventListener("keyup",()=>player.vx=0);

// Controles táctiles mejorados
canvas.addEventListener("touchstart",handleTouch);
canvas.addEventListener("touchmove",handleTouch);
canvas.addEventListener("touchend",()=>{ player.vx=0; });

function handleTouch(e){
  if(!started) return;
  let x = e.touches[0].clientX;
  if(x < canvas.width/2) player.vx=-250;
  else player.vx=250;
}

// Botón de inicio
document.getElementById("startBtn").addEventListener("click",()=>{
  started=true;
  document.getElementById("startScreen").style.display="none";
  music.play();
});
