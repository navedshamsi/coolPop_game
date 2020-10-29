const start=document.querySelector('#start')
start.onclick=()=>{
   start.style.display="none"

const scoreEl=document.querySelector('#score')
const scoreCard=document.querySelector('#scoreCard')
const refreshButton=document.querySelector('#button')
const scoreCardDiv=document.querySelector('#scoreCardDiv')

refreshButton.onclick=()=>{location.reload()}

var canvas=document.querySelector('canvas');
canvas.width=innerWidth;
canvas.height=innerHeight;
canvas.style.backgroundColor="white"



const enemies=[]
const particles=[]
const x=innerWidth/2
const y=innerHeight/2

var c=canvas.getContext('2d');

c.clearRect(0,0,innerWidth,innerHeight)
class players
{
constructor(x,y,radius,color)
{
   this.x=x;
   this.y=y;
   this.radius=radius;
   this.style=color;
}
draw()
   {
    c.beginPath()
    c.arc(this.x,this.y,this.radius,0,Math.PI*2,false)
    c.fillStyle="white"
    c.fill()  
} 
}



class projectile{
    constructor(x,y,radius,color,velocity)
    {
       this.x=x;
       this.y=y;
       this.radius=radius;
       this.color=color;
       this.velocity=velocity;
    }
    update()
    {
        this.draw()
        this.x+=this.velocity.x;
        this.y+=this.velocity.y
        
    }
    draw(){
        c.beginPath()
        c.arc(this.x,this.y,this.radius,0,Math.PI*2,false);
        c.fillStyle=this.color;
        c.fill()
    }
}
var player= new players(x,y,10,"orange")





var projectiles=[]


canvas.addEventListener('click',(e)=>
{
  
   const angle=Math.atan2(e.clientY-canvas.height/2,e.clientX-canvas.width/2)
   
   var velocity={x:Math.cos(angle)*5,y:Math.sin(angle)*5}
   
   projectiles.push(
    new projectile(canvas.width/2,canvas.height/2,5,"white",velocity)
   )
   
})

let animationId
let score=0
var speed=1;

function animation()
{
   animationId=requestAnimationFrame(animation)

   
  
c.fillStyle='rgba(0,0,0,0.1)'

c.fillRect(0,0,canvas.width,canvas.height)

 player.draw()

 particles.forEach((particle,index)=>{
    if(particle.alpha<=0)
    {
       particles.splice(index,1)
    }
    else
    {
      particle.update()
    }
    
 })

 projectiles.forEach((projectile,index)=>
 {
   projectile.update()
  if(projectile.x+projectile.radius<0 || projectile.x-projectile.radius>canvas.width ||
   projectile.y+projectile.radius<0 ||
   projectile.y-projectile.radius>canvas.height
   )
  {
   setTimeout(()=>{
      projectiles.splice(index,1)
   },0)
  }

 })
enemies.forEach((enemy,index)=>
{
  enemy.update()

  const dist=Math.hypot(player.x-enemy.x,
   player.y-enemy.y)

   if(dist-enemy.radius-player.radius<1)
      {
         cancelAnimationFrame(animationId)
         scoreCardDiv.style.display="block"
      
        scoreCard.innerText="SCORE : "+score
        scoreEl.style.display="none"
      }

  projectiles.forEach((projectile,projecIndex)=>{
     const dist=Math.hypot(projectile.x-enemy.x,
      projectile.y-enemy.y)

      if(dist-enemy.radius-projectile.radius<1)
      {

       for(let i=0;i<enemy.radius*2;i++)
       {
          particles.push(new Particle(
             projectile.x,
             projectile.y,
             Math.random()*2,
             enemy.color,
         {x:(Math.random()-0.5)*(Math.random()*5),
          y:(Math.random()-0.5)*(Math.random()*5)}
          ))
       }

        if(enemy.radius-10>10)
        {
         score+=100;
         scoreEl.innerText=score
         gsap.to(enemy,{radius:enemy.radius-10})
           
           setTimeout(()=>{
            projectiles.splice(projecIndex,1)
         },0)
        }
  
     else{
      score+=200;
      scoreEl.innerText=score
         setTimeout(()=>{
            enemies.splice(index,1)
            projectiles.splice(projecIndex,1)
         },0)
        } 
      }
  })
})

}

animation()



class Enemy{
   constructor(x,y,radius,color,velocity)
   {
      this.x=x;
      this.y=y;
      this.radius=radius;
      this.color=color;
      this.velocity=velocity;
   }
   update()
   {
      
       this.draw()
       this.x+=this.velocity.x*speed;
       this.y+=this.velocity.y*speed
       
   }
   draw(){
       c.beginPath()
       c.arc(this.x,this.y,this.radius,0,Math.PI*2,false);
       c.fillStyle=this.color;
       c.fill()
   }
}

const friction=0.99
class Particle{
   constructor(x,y,radius,color,velocity)
   {
      this.x=x;
      this.y=y;
      this.radius=radius;
      this.color=color;
      this.velocity=velocity;
      this.alpha=1
   }
  
   draw(){
      c.save()
      c.globalAlpha=this.alpha
      c.beginPath()
      c.arc(this.x,this.y,this.radius,0,Math.PI*2,false);
      c.fillStyle=this.color;
      c.fill()
      c.restore()
   }
   update()
   {
       this.draw()
       this.velocity.x*=friction
       this.velocity.y*=friction
       this.x+=this.velocity.x;
       this.y+=this.velocity.y
       this.alpha-=0.01
   }
   
}




const spawnEnemies=()=>
{
   
   setInterval(()=>{




   const radius=Math.random()*(30-8-1)+8
   let x
   let y
 
   if(Math.random()<0.5){
       x=Math.random()<0.5?0-radius:canvas.width+radius;
       y=Math.random()*canvas.height
     
   }
   else
   {
      x=Math.random()*canvas.width
      y=Math.random()<0.5?0-radius:canvas.height+radius
   }
   
   const color = `hsl(${Math.random()*360},50%,50%)`
   const  angle=Math.atan2(canvas.height/2-y,canvas.width/2-x)
  const velocity={x:Math.cos(angle),y:Math.sin(angle)}
      enemies.push( new Enemy(x,y,radius,color,velocity));console.log(speed)
  


   },1000)
setInterval(()=>{ speed=speed+0.01 },200)

}

spawnEnemies()

}