const canvas = document.querySelector("canvas");
const scoreEl = document.querySelector(".score");
const bigScoreEl = document.querySelector(".big_score");
const btn = document.querySelector(".start")
const pop = document.querySelector(".pop");
const c = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height=innerHeight
const cw = canvas.width,ch = canvas.height


class Player{
 constructor(pos,r,color) {
        this.pos = pos
        this.r = r
        this.color = color
}
draw() {
    c.beginPath()
     c.fillStyle = this.color
    c.arc(
        this.pos.x,
        this.pos.y,
        this.r,
        0,
        Math.PI*2
        )
    c.fill()
    c.closePath()
}
}
class Projectile{
    static r = 6;
 constructor(pos,r,color,velocity) {
        this.pos = pos
        this.r = r
        this.color = color
        this.velocity = velocity
}
draw() {
    c.beginPath()
     c.fillStyle = this.color
    c.arc(
        this.pos.x,
        this.pos.y,
        this.r,
        0,
        Math.PI*2
        )
    c.fill()
    c.closePath()
}
update() {
    this.draw()
    this.pos.x += this.velocity.x
    this.pos.y += this.velocity.y
}
}

class Enemy{
 constructor(pos,r,color,velocity) {
        this.pos = pos
        this.r = r
        this.color = color
        this.velocity = velocity
}
draw() {
    c.beginPath()
     c.fillStyle = this.color
    c.arc(
        this.pos.x,
        this.pos.y,
        this.r,
        0,
        Math.PI*2
        )
    c.fill()
    c.closePath()
}
update() {
    this.draw()
    this.pos.x += this.velocity.x
    this.pos.y += this.velocity.y
}
}

const friction = 0.99
class Particle {
  constructor(x, y, radius, color, velocity) {
    this.x = x
    this.y = y
    this.radius = radius
    this.color = color
    this.velocity = velocity
    this.alpha = 1
  }

  draw() {
    c.save()
    c.globalAlpha = this.alpha
    c.beginPath()
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    c.fillStyle = this.color
    c.fill()
    c.restore()
  }

  update() {
    this.draw()
   this.velocity.x *= friction
    this.velocity.y *= friction
    this.x = this.x + this.velocity.x
   this.y = this.y + this.velocity.y
    this.alpha -= 0.01
  }
}


function init(e) {
   
let score = 0;
let time = 1000
scoreEl.innerHTML = "Score: " + score 
let player = new Player({
    x:cw/2,
    y:ch/2
},25,"crimson")
let projectiles = []
let enemies = []
let particles=[]
let cnt = 0;
let speedRate = 2;
let enemeyId;

document.addEventListener("click",e => {
    let r = Projectile.r
        x = player.pos.x,
        y = player.pos.y,
        color =player.color,
        angle = Math.atan2(e.clientY-player.pos.y,e.clientX-player.pos.x)
        velocity = {
            x:Math.cos(angle) * 8,
            y:Math.sin(angle) * 8
        }
    projectiles.push(new Projectile({
        x,
        y
    },r,color,velocity))
})

function enemyMaker() {
    enemeyId = setInterval(() => {
        console.log(particles)
        let rand = Math.random();
         let r = Math.random() * (32-10) + 10,x,y;
        if(rand < .25) {
            console.log("")
            x = 0 - r
            y = Math.random() * ch
        }else if(rand <= .5) {
            y = ch + r
            x = Math.random() * cw
        }else if(rand <= .75) {
            y = 0 - r
            x = Math.random() * cw
        }else if(rand <= 1) {
            x = cw + r
            y = Math.random() * ch
        }
      let color = `hsl(${Math.random() * 360},50%,50%)`,
    angle = Math.atan2(player.pos.y -y, player.pos.x - x)
        velocity = {
            x:(y >= player.pos.y - player.r -10&& y <= player.pos.y + player.r + 10 && Math.sqrt((player.pos.x - x)**2) < cw/2 + r + player.r + 10  )? Math.cos(angle) *(speedRate- 0.7):Math.cos(angle)* speedRate,
            y: Math.sin(angle) * speedRate
        }
        enemies.push(new Enemy({
            x,
            y
        },r,color,velocity))
    },time)
}
let animateId;
function animate() {
    if(!time <= 300) {
        
    time--;
    console.log(time)
    }
    animateId = requestAnimationFrame(animate)
    cnt++;
    c.save()
    c.fillStyle = "rgba(0,0,0,.1)"
    c.fillRect(0,0,cw,ch)
    c.restore()
    for (let index = particles.length - 1; index >= 0; index--) {
    const particle = particles[index]

    if (particle.alpha <= 0) {
      particles.splice(index, 1)
    } else {
      particle.update()
    }
  }
projectiles.forEach((projectile,i) => {
        projectile.update()
      if( projectile.pos.x + projectile.r <= 0 ||
            projectile.pos.x - projectile.r >= cw ||
            projectile.pos.y + projectile.r >= ch||
            projectile.pos.y - projectile.r <= 0  ) {
                projectiles.splice(i,1)
            }
     enemies.forEach((enemy,j) => {
          //shot out
          if(Math.hypot(
              projectile.pos.x - enemy.pos.x,
              projectile.pos.y- enemy.pos.y
              ) < projectile.r + enemy.r) {
                  console.log("shot")
                  if(enemy.r  > 25)
                  {
                   score +=  Math.floor(enemy.r);
                   gsap.to(enemy,{
                    r: enemy.r - 11
                   })
                   enemy.velocity = {
                       x:enemy.velocity.x-enemy.velocity.x/2,
                     y:enemy.velocity.y-enemy.velocity.y/2 
                   }
                  scoreEl.innerHTML = "score:" + score;
                  setTimeout(() => {
                      projectiles.splice(i,1)
                  },1)   
                      
                  }
                  else{
                  score +=  Math.floor(enemy.r);
                  scoreEl.innerHTML = "score:" + score;
                  setTimeout(() => {
                      projectiles.splice(i,1)
                      enemies.splice(j,1)
                  },1)
                  }
                  
                  
                  
              }
      })
    })
    enemies.forEach((enemy,i) => {
        enemy.update()
        if(Math.hypot(player.pos.x - enemy.pos.x,player.pos.y-enemy.pos.y) < player.r + enemy.r) {
            clearInterval(enemeyId)
           setTimeout(() => { 
               bigScoreEl.innerHTML = score
            cancelAnimationFrame(animateId)
            pop.classList.remove("none")
            pop.classList.add("flex")
           },0)
        }
         for (
      let projectilesIndex = projectiles.length - 1;
      projectilesIndex >= 0;
      projectilesIndex--
    ) {
      const projectile = projectiles[projectilesIndex]
 const dist = Math.hypot(projectile.pos.x - enemy.pos.x, projectile.pos.y - enemy.pos.y)
      // when projectiles touch enemy
      if (dist < enemy.r + projectile.r) {
        // create explosions
        for (let i = 0; i < enemy.r * 2; i++) {
          particles.push(
            new Particle(
              projectile.pos.x,
              projectile.pos.y,
              Math.random() * 2,
              enemy.color,
              {
                x: (Math.random() - 0.5) * (Math.random() * 20),
                y: (Math.random() - 0.5) * (Math.random() * 20)
              }
            )
          )
        }
}
}
    })
   player.draw()
 
 
    
    if(cnt%2)  speedRate += .0009
    if(cnt >= 2000) cnt=0
}
animate()
enemyMaker()
 if(e) {
        pop.classList.add("none")
    }
}
init()
btn.addEventListener("click",init)
