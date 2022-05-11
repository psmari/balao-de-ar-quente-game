var bg
var bottomGround, topGround
var balloon, balloonImg
var obstacleTop, obstacleTopImg
var obstacleBottom, obstacleBottom1, obstacleBottom2
var gameOver, gameOverImg
var restart, restartImg
var backgroundImg

var score = 0;

//estados de jogo      
var PLAY = 1;
var END = 0;
var gameState = PLAY;


function preload(){
  bgImg = loadImage("assets/bg.png")
  bgImg2 = loadImage("assets/bgImg2.jpg")

  balloonImg = loadAnimation("assets/balloon1.png","assets/balloon2.png","assets/balloon3.png")
  
  obsTop1 = loadImage("assets/obsTop1.png")
  obsTop2 = loadImage("assets/obsTop2.png")
  
  obsBottom1 = loadImage("assets/obsBottom1.png")
  obsBottom2 = loadImage("assets/obsBottom2.png")
  obsBottom3 = loadImage("assets/obsBottom3.png")
  
  gameOverImg= loadImage("assets/fimdejogo.png")
  restartImg = loadImage("assets/restart.png")

jumpSound = loadSound("assets/jump.mp3");
dieSound = loadSound("assets/die.mp3");

}

function setup(){

  createCanvas(400,400)
//imagem de plano de fundo
bg = createSprite(165,485,1,1);
getBackgroundImg();


//criando canto superior e inferior
bottomGround = createSprite(200,390,800,20);
bottomGround.visible = false;

topGround = createSprite(200,10,800,20);
topGround.visible = false;
      
//criando o balão   
balloon = createSprite(100,200,20,50);
balloon.addAnimation("balloon",balloonImg);
balloon.scale = 0.2;
balloon.debug = true;


//inicializando grupos
topObstaclesGroup = new Group();
bottomObstaclesGroup = new Group();
barGroup = new Group();

//criando sprites de fim de jogo e reiniciar
gameOver = createSprite(220,200);
restart = createSprite(220,240);
gameOver.addImage(gameOverImg);
gameOver.scale = 0.5;
restart.addImage(restartImg);
restart.scale = 0.5;
gameOver.visible = false;
restart.visible = false;


}

function draw() {
  

  if(gameState === PLAY){

    //fazendo o balão de ar quente pular
    if(keyDown("space")) {
      balloon.velocityY = -6 ;
      jumpSound.play();
    }

    //adicionando gravidade
     balloon.velocityY = balloon.velocityY + 2;

     
    Bar();

     //gerando obstáculos no topo e no chão
     spawnObstaclesTop();
     spawnObstaclesBottom();

//condição para o estado END
if(topObstaclesGroup.isTouching(balloon) || balloon.isTouching(topGround)
|| balloon.isTouching(bottomGround) || bottomObstaclesGroup.isTouching(balloon)){

gameState = END;
dieSound.play();
}


//Adicionando AI para o balão qaundo tocar topObstaclesGroup e topGround

/*if(topObstaclesGroup.isTouching(balloon) || balloon.isTouching(topGround)){
  balloon.velocityY = 6 ;
  jumpSound.play();
}*/


//Adicionando AI para o balão qaundo tocar topObstaclesGroup e topGround

/*if(balloon.isTouching(bottomGround) || bottomObstaclesGroup.isTouching(balloon)){
  balloon.velocityY = -6 ;
  jumpSound.play();
}*/

  }

  if(gameState === END) 
    {

      gameOver.visible = true;
      gameOver.depth = gameOver.depth+1
      restart.visible = true;
      restart.depth = restart.depth+1
          
          //todos os sprites devem parar de se mover no estado END
          balloon.velocityX = 0;
          balloon.velocityY = 0;
          topObstaclesGroup.setVelocityXEach(0);
          bottomObstaclesGroup.setVelocityXEach(0);
          barGroup.setVelocityXEach(0);
          
          //definindo -1 tempo de vida para que os obstáculos não desapareçam no estado END
          topObstaclesGroup.setLifetimeEach(-1);
          bottomObstaclesGroup.setLifetimeEach(-1);
         
          balloon.y = 200;
          
          //reiniciando o jogo
          if(mousePressedOver(restart)) 
          {
                reset();
          }

    } 

    drawSprites();
    Score();     
}

function reset()
{
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  topObstaclesGroup.destroyEach();
  bottomObstaclesGroup.destroyEach();

  score = 0;
}


function spawnObstaclesTop() 
{
  if(World.frameCount % 60 === 0) {
    obstacleTop = createSprite(400,50,40,50);

//obstacleTop.addImage(obsTop1);

obstacleTop.scale = 0.1;
obstacleTop.velocityX = -4;

//posições y aleatórias para os obstáculos do topo
obstacleTop.y = Math.round(random(10,100));

//gerar obstáculos aleatórios no topo
var rand = Math.round(random(1,2));
switch(rand) {
  case 1: obstacleTop.addImage(obsTop1);
          break;
  case 2: obstacleTop.addImage(obsTop2);
          break;
  default: break;
}

 //definir tempo de vida para a variável
obstacleTop.lifetime = 100;

balloon.depth = balloon.depth + 1;

topObstaclesGroup.add(obstacleTop);

  }
}

function spawnObstaclesBottom() 
{
  if(World.frameCount % 60 === 0) {
    obstacleBottom = createSprite(400,350,40,50);

obstacleBottom.addImage(obsBottom1);
obstacleBottom.debug=true


obstacleBottom.scale = 0.07;
obstacleBottom.velocityX = -4;



//gerar obstáculos aleatórios no chão
var rand = Math.round(random(1,3));
switch(rand) {
  case 1: obstacleBottom.addImage(obsBottom1);
          break;
  case 2: obstacleBottom.addImage(obsBottom2);
          break;
  case 3: obstacleBottom.addImage(obsBottom3);
          break;
  default: break;
}

 //definir tempo de vida para a variável
obstacleBottom.lifetime = 100;

balloon.depth = balloon.depth + 1;

bottomObstaclesGroup.add(obstacleBottom);

  }
}

 function Bar() 
 {
         if(World.frameCount % 60 === 0)
         {
           var bar = createSprite(400,200,10,800);
          bar.velocityX = -6
        
          
          bar.velocityX = -6
          bar.depth = balloon.depth;
          bar.lifetime = 70;

          bar.visible = false;

          barGroup.add(bar);
         }
}

function Score()
{
         if(balloon.isTouching(barGroup))
         {
           score = score + 1;
         }
        textFont("algerian");
        textSize(30);
        fill("yellow");
        text("Pontuação: "+ score, 250, 50);
       
  
}

//usando chamadas de API para definir a imagem de plano de fundo de acordo com o tempo
async function getBackgroundImg(){
  var response = await fetch("http://worldtimeapi.org/api/timezone/Asia/Kolkata");
  var responseJSON = await response.json();

  var datetime = responseJSON.datetime;
  var hour = datetime.slice(11,13);
  
  if(hour>=06 && hour<=19){
    
    bg.addImage(bgImg);
    bg.scale = 1.3
  }
  else{
    
    bg.addImage(bgImg2);
    bg.scale = 1.5
    bg.x=200
    bg.y=200
  }

}
