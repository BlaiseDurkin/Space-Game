/*
main.js
 - initialize game, objects
 -  objects: user, enemy, 2 asteroids, home_base
 - play game

*/
var canvas = document.getElementById('GameBoard')
console.log(canvas)
var c = canvas.getContext('2d')
//c.translate(0.1, 0.1);
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;



// init display

html_element = document.getElementById('PointsScore')
html_element.innerHTML = POINTS

html_element = document.getElementById('HealthCount')
html_element.innerHTML = HEALTH

html_element = document.getElementById('MineralCount')
html_element.innerHTML = MINERALS

html_element = document.getElementById('ResourceCount')
html_element.innerHTML = RESOURCES

html_element = document.getElementById('RocketCount')
html_element.innerHTML = ROCKETS

html_element = document.getElementById('BeaconCount')
html_element.innerHTML = BEACONS

html_element = document.getElementById('HostileCount')
html_element.innerHTML = HOSTILES

html_element = document.getElementById('Mode')
html_element.innerHTML = MODE

//

function clearCanvas(){
    c.clearRect(0, 0, canvas.width , canvas.height)
}

objects = []
CENTER_PNT = new Point(canvas.width/2, canvas.height/2)

function displayDeathScreen(){
    document.getElementById('DeathWrapper').style.visibility = 'visible'
}
function update_Environment(){
    console.log('Updating Env')
    //create enemy f(POINTS)
}
//  Animate
function animateGame(){
    update_Environment()
    update_UI()
    requestAnimationFrame(animateGame)
    clearCanvas()
    TIME += 1

    for (j = 0; j< objects.length; j++){
        objects[j].computeChange(objects)

    }
    for (j = 0; j< objects.length; j++){
        objects[j].update()
        objects[j].draw()
    }
}

function test_main(){
    pos = new Point(canvas.width/2, canvas.height/2)
    pos1 = new Point(9*canvas.width/10, canvas.height/10)
    v = [1, 0]
    r = 5
    color = 'white'
    p = new Particle(pos, v, r, color)
    planet_0 = new Planet(pos1, [-0.2, 0.001], 30, 'rgba(200,200,200,1)')
    objects.push(planet_0)
    //p = new Planet(pos, v, 20, color)
    //p.draw()
    U = new User(pos, [-1,.1], 100)
    p2 = new Point(20,20)
    E = new Enemy(p2, [0.1, 0], 100)
    objects.push(E)
    //objects.push(p)
    objects.push(U)
    animateGame()


}

test_main()
//animateGame(t, objects){
//  command = getCommand()
//  for obj in objects
//      obj.computeChange()
//  for obj in objects
//      obj.update()
//      obj.draw()
//      if obj == user && obj.health < 1:
//          return false

//gameOver(){
//  showGameOverScreen()
//
//}

//initGame(){
//  obj_cont = []
//  create objects
//  game = true
//  while game == true
//      game = animateGame(t, objects)
//  gameOver()
//}
