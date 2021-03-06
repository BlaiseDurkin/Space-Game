//init global var

TIME = 0
POINTS = 0
HEALTH = 100
MINERALS = 0
RESOURCES = 10
ROCKETS = 2
BEACONS = 1
HOSTILES = 0
MODE = 'Home'

ENEMY_COOL_DOWN = 2000

//helper functions
console.log('hello world')


function drawCircle(center, radius, color_fill, color_line){
    c.beginPath()
    c.arc(center.x, center.y, radius, 0, 2*Math.PI)
    c.fillStyle = color_fill
    c.fill()
    c.strokeStyle = color_line
    //c.lineWidth = 4
    c.stroke()
}

function drawLine(first, next, color){
    //first, next : Point
    //color : string
    c.beginPath()
    c.moveTo(first.x , first.y) // first point
    c.lineTo(next.x , next.y) // next point
    c.strokeStyle = color
    c.lineWidth = 1
    c.stroke()
    c.closePath()
}


function drawShip(center, radius, color_fill, color_line){
    c.beginPath()
    c.arc(center.x-radius, center.y, radius, .5*Math.PI, 1.5*Math.PI)
    c.fillStyle = color_fill
    c.fill()
    c.strokeStyle = color_line
    //c.lineWidth = 4
    c.stroke()

    c.beginPath()
    c.arc(center.x+radius, center.y, radius, 1.5*Math.PI, .5*Math.PI)
    c.fillStyle = color_fill
    c.fill()
    c.strokeStyle = color_line
    //c.lineWidth = 4
    c.stroke()
}