var dog;
var dogIMG,doghappy;
var database;
var foodStock;
//var food;
var foodS;
var button1,button2;
var foodObj;
var lastFed;
var FedTime;
var gameState;
var gamestateread;
var bedroom;
var washroom;
var garden;
var saddog;
var milkBotltle2;
var milkbottle;

function preload(){
  dogIMG = loadImage("Dog.png");
  doghappy = loadImage("happydog.png");
  bedroom = loadImage("Bed Room.png");
  washroom = loadImage("Wash Room.png");
  livingroom = loadImage("Living Room.png")
  garden = loadImage("Garden.png");
  saddog = loadImage("deadDog.png");
  milkbottle = loadImage("milk.png");
  
}

function setup() {
	

  database = firebase.database();
  //console.log(database);

  foodObj = new Foods(200,200,10,10);

  createCanvas(1000,500);

  milkBotltle2= createSprite(200,420,20,20);
  milkBotltle2.addImage(milkbottle);
  milkBotltle2.scale = 0.15

  dog = createSprite(300,300,20,20);
  dog.addImage(dogIMG);
  dog.scale = 0.15;

  foodStock = database.ref('Food');
  foodStock.on("value", readStock);

  FedTime = database.ref('FeedTime');
  FedTime.on("value", function(data){
    lastFed=data.val();
  
  })

  readstate = database.ref('gameState');
  readstate.on("value", function(data){
    gameState = data.val();
  });

  feed = createButton("feed the dog");
  feed.position(400,200);
  feed.mousePressed(feedDog);

   addFood=createButton("Add Food");
  addFood.position(300,500);
  addFood.mousePressed(addFoods);

}  

function draw() { 
  background(46, 139, 87);

 // writeStock(foodS);

  if(foodS==0){
    dog.addImage(doghappy);
    milkBotltle2.visible=false;

  }
  else{
    dog.addImage(saddog);
    milkBotltle2.visible=true;

  }
  
  fill("red");
   text(foodS,200,300);

   foodObj.display();
  
  drawSprites();

  fill("red"); 
  text("Press UP_ARROW key to feed the dog",100,150);

  
    fill(255,255,254);
  textSize(15);
  if(lastFed>=12){
    text("Last feed: "+lastFed%12+"PM",300,300);
  }
  else if(lastFed==0){
    text("Last Feed :",300,300);
  }
  else{
    text("Last Feed :",lastFed+"PM",500,300);
  }
  
  currentTime = hour();
  /*if(currentTime===(lastFed+1)){
    update("Playing");
    foodObj.bedrooms();
  }
  else if(currentTime===(lastFed)){
    update("Sleeping");
    foodObj.gardens();
  }
  else{
    update("Hungry");
    foodObj.display();
  }

  if(gameState!="Hungry"){
    feed.hide();
    addFood.hide();
    //dog.remove();
    dog.visible=true;
  }
  else{
    feed.show();
    addFood.show();
    dog.addImage(saddog);
  }*/

  if(gameState===1){
    dog.addImage(doghappy);
    dog.scale=0.175;
    dog.y=250;

  }

  if(gameState===2){
    dog.addImage(saddog);
    dog.scale=0.175;
    milkBotltle2.visible=false;
    dog.y=250;

  }

  var Bath= createButton("I want to take a bath");
  Bath.position(500,125);
  if(Bath.mousePressed(function(){
    gameState=3;
    database.ref('/').update({'gameState':gameState});
  }));

  if(gameState===3){
    dog.addImage(washroom);
    dog.scale=1;
    milkBotltle2.visible=false;

  }
  else{
    dog.addImage(saddog);
    milkBotltle2.visible=false;

  }

  var Sleep = createButton("I am very sleepy");
  Sleep.position(710,125);
  if(Sleep.mousePressed(function(){
    gameState=4;
    database.ref('/').update({'gameState':gameState});
  }));
  if(gameState===4){
    dog.addImage(bedroom);
    dog.scale=1;
    milkBotltle2.visible=false;
  }

  var Play = createButton("Lets Play");
  Play.position(500,150);
  if(Play.mousePressed(function(){
    gameState=5;
    database.ref('/').update({'gameState':gameState});
  }));

  if(gameState===5){
    dog.addImage(livingroom);
    dog.scale=1;
    milkBotltle2.visible=false;
  }

  var PlayIngarden = createButton("Lets Play in Park");
  PlayIngarden.position(285,150);
  if(PlayIngarden.mousePressed(function(){
    gameState=6;
    database.ref('/').update({'gameState':gameState});
  }));
  if(gameState===6){
    dog.y=175;
    dog.addImage(garden);
    dog.scale=1;
    milkBotltle2.visible=false;
  }

}

function readStock(data){
  foodS=data.val();
  foodObj.updatefoodStock(foodS);
  
 }

 function readTime(data){
  times=data.val();
  
 }

function writeStock(x){
  var dataRef = database.ref("Food");

  if(x<=0){
    x=0;
  }
  else{
    x=x-1;
  }
 database.ref('/').update({
   food:x
 })

}

function feedDog(){
  dog.addImage(doghappy);

  foodObj.updatefoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}

function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })

}

function update(state){
  database.ref('/').update({
    gameState:state
  });

}


