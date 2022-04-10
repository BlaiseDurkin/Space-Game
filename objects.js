//objects

//Point class
class Point{
    constructor(x, y){
        this.x = x
        this.y = y
    }
}

//Particle class
class Particle{
    constructor(pos, vel, rad, color){
        this.position = pos
        this.velocity = vel
        this.radius = rad
        this.new_position = pos
        this.color_fill = color
        this.color_line = 'rgba(200,200,255,.5)'
        this.health = 100
    }
    update(){

        this.position = this.new_position
    }
    computeChange(objects){

        this.new_position = new Point(this.new_position.x + this.velocity[0], this.new_position.y + this.velocity[1])
        if (this.new_position.x < this.radius){
            this.new_position.x = this.radius
            this.velocity[0] = this.velocity[0] * -.9
        }
        if (this.new_position.x > canvas.width - this.radius){
            this.new_position.x = canvas.width - this.radius
            this.velocity[0] = this.velocity[0] * -.9
        }
        if (this.new_position.y < this.radius){
            this.new_position.y = this.radius
            this.velocity[1] = this.velocity[1] * -.9
        }
        if (this.new_position.y > canvas.height - this.radius){
            this.new_position.y = canvas.height - this.radius
            this.velocity[1] = this.velocity[1] * -.9
        }
    }

    draw(){
        drawCircle(this.position, this.radius, this.color_fill, this.color_line)
    }
}

//Planet
class Planet extends Particle{
    constructor(pos, vel, rad, color){
        super(pos, vel, rad, color)
    }
    draw(){
        drawCircle(this.position, this.radius, this.color_fill, this.color_line)
        let gray = 'rgba(150, 150, 150, 0.8)'
        var p1 = new Point(this.position.x, this.position.y-4+this.radius/4)
        drawCircle(p1, this.radius/4, 'white', 'white')
        var p2 = new Point(this.position.x, this.position.y+this.radius/4)
        drawCircle(p2, this.radius/4, gray, gray)
    }
}


//Explosion
class Explosion{
    constructor(position){
        this.position = position
        this.radius = 30
        this.max_radius = 70
        this.health = 100
    }
    update(){
        //change radius

        this.radius += 2
    }
    computeChange(objects){
        //any object in radius incurs damage to health = f(distance)
        //disapear when radius > max_radius

        let blast_damage = 0
        let dx = 0
        let dy = 0
        let distance = 10000
        for (var i = 0; i < objects.length; i++){
            //
            if (objects[i] === this){
                if (this.radius >= this.max_radius){
                    //delete
                    objects.splice(i, 1)
                }
            }

            //check distance
            dx = this.position.x - objects[i].position.x
            dy = this.position.y - objects[i].position.y
            distance = Math.sqrt(dx**2 + dy**2)

            if (distance < this.max_radius){
                //blow up = reduce damage
                blast_damage = 4//f(distance)
                objects[i].health -= blast_damage
            }
        }
    }
    draw(){
        drawCircle(this.position, this.radius, 'rgba(255, 227, 71, 0.5)', 'white')
    }
}
//Rocket
class Rocket{
    constructor(position){
        console.log('rocket created')
        this.position = position
        this.new_position = position
        this.velocity = [0,0]
        this.center = CENTER_PNT
        this.max_v = 3
        this.health = 10
        this.target_types = ['Enemy', 'EnemyRocket']
    }
    update(){
        this.position = this.new_position
    }
    computeChange(objects){
        //TODO
        let dx = 0
        let dy = 0

        let min_distance = 99999999
        let distance = 0
        let other_pnt = this.position
        let j = 0
        //closest target = (x,y)
        for (var i = 0; i < objects.length; i++){
            //find self
            if (objects[i] === this){
                //console.log('this is this')
                j = i
            }
            //blow up Particle
            //blow up enemy rocket
            //TODO -- find out how <in> works
            for (var t = 0; t < this.target_types.length; t++){
            if(objects[i].constructor.name.toString() == this.target_types[t]){
                //check distance
                dx = this.position.x - objects[i].position.x
                dy = this.position.y - objects[i].position.y
                distance = Math.sqrt(dx**2 + dy**2)
                if (distance < min_distance){
                    min_distance = distance
                    other_pnt = objects[i].position
                }
            }
            }
        }

        let target_threshold = 10
        if (min_distance < target_threshold || this.health < 1){
            //create explosion
            //delete rocket
            console.log('removing rocket')
            objects.splice(j, 1)
            var explosion = new Explosion(this.position)
            objects.push(explosion)
            return
        }
        // calculate trajectory to closest target
        dx = other_pnt.x - this.position.x
        dy = other_pnt.y - this.position.y

        let v_x = this.velocity[0]
        let v_y = this.velocity[1]
        let d_v_x = 0
        let d_v_y = 0
        let V = Math.sqrt(v_x**2 + v_y**2)
        let ang = Math.atan2(dy, dx)

        if (min_distance < 100){
            v_x = 0.1*V*Math.cos(ang) + 0.9*v_x
            v_y = 0.1*V*Math.sin(ang) + 0.9*v_y
            d_v_x = 0
            d_v_y = 0
        }
        else{
            let B = .0005
            let Vm = .8//Math.min(this.max_v, V)

            // g_x,y : distance from center
            // d_v_x,y : acceleration = f(g)
            let g_x = 2*B*(dx)
            let e_g_x = Math.exp(g_x)
            d_v_x = Vm*(e_g_x - 1)/(e_g_x + 1)

            let g_y = 2*B*(dy)
            let e_g_y = Math.exp(g_y)
            d_v_y = Vm*(e_g_y - 1)/(e_g_y + 1)

            // z_x,y : distance from center
            // d_v_x,y : acceleration = f(z) + f(g)
            /*
            let z_x = .02*B*(this.position.x - this.center.x)
            let e_z_x = Math.exp(z_x)
            d_v_x += -Vm*(e_z_x - 1)/(e_z_x + 1)

            let z_y = .02*B*(this.position.y - this.center.y)
            let e_z_y = Math.exp(z_y)
            d_v_y += -Vm*(e_z_y - 1)/(e_z_y + 1)
            */
        }
        this.velocity = [v_x + d_v_x, v_y + d_v_y]
        //check max velocity
        if (this.velocity[0] < 0){
            this.velocity[0] = Math.max(this.velocity[0], -this.max_v)
        }
        else{
            this.velocity[0] = Math.min(this.velocity[0], this.max_v)
        }

        if (this.velocity[1] < 0){
            this.velocity[1] = Math.max(this.velocity[1], -this.max_v)
        }
        else{
            this.velocity[1] = Math.min(this.velocity[1], this.max_v)
        }
        this.new_position = new Point(this.new_position.x + this.velocity[0], this.new_position.y + this.velocity[1])
    }
    draw(){
        let radius = 3
        drawCircle(this.position, radius, 'white', 'white')

    }
}
class EnemyRocket extends Rocket{
    constructor(position){
        super(position)
        this.target_types = ['User']
        this.max_v = 2
    }
}
//user
// TODO
//      search - go to asteroid
//      defend - shoot rocket with cool down
//      harvest - stay on asteroid, update minerals
//      home - return to home base
class User{
    constructor(position, velocity, health){
        this.position = position //Point
        this.new_position = position //Point
        this.velocity = velocity //List
        this.health = health //int
        this.radius = 8
        this.max_v = 2.5
        this.max_turn = 10
        this.center = position //Point
        this.cool_down = 100
        this.timer = this.cool_down
        this.color = 'white'
        //will this work
        let W = canvas.width
        let H = canvas.height
        let p1 = new Point(0.2*W,0.2*H)
        let p2 = new Point(0.2*W,0.8*H)
        let p3 = new Point(0.8*W,0.2*H)
        let p4 = new Point(0.8*W,0.8*H)

        this.map = [p1, p2, p3, p4]
        this.destination = 0
        this.target_type = 'Planet'

    }
    update(){
        if (BEACONS > 0) {
            this.health += 50

            BEACONS -= 1
            }
        HEALTH = this.health
        if (this.health < 1){
            //death
            console.log('You Died')
            displayDeathScreen()
        }
        this.position = this.new_position
    }
    search(objects){
        this.color = 'white'

        let dx = 0
        let dy = 0
        let distance = 0
        let min_distance = 9999999999
        let other_pnt = this.position
        for (var i = 0; i < objects.length; i++){
            //change to Planet
            if(objects[i].constructor.name.toString() == this.target_type ){
                //check distance
                dx = this.position.x - objects[i].position.x
                dy = this.position.y - objects[i].position.y
                distance = Math.sqrt(dx**2 + dy**2)
                if (distance < min_distance){
                    min_distance = distance
                    other_pnt = objects[i].position
                }
            }
        }
        //if min_distance <= view_radius
        let v_x = this.velocity[0]
        let v_y = this.velocity[1]

        let B = .0001*(2**(min_distance-10))
        if (min_distance > 200){

            //go to destination

            //    Point = this.map[this.destination]
            // calc distance to Point
            dx = this.position.x - this.map[this.destination].x
            dy = this.position.y - this.map[this.destination].y
            //if distance < 30, increment destination
            distance = Math.sqrt(dx**2 + dy**2)
            if (distance < 30){
                this.destination = (this.destination + 1) % this.map.length
            }
        }
        else{
            dx = this.position.x - other_pnt.x
            dy = this.position.y - other_pnt.y
        }


        let d_v_x = -.3*dx*B
        let d_v_y = -.3*dy*B
        //else
        // zig zag


        this.velocity = [v_x + d_v_x, v_y + d_v_y]

    }
    harvest(others){

        this.color = 'green'
        //land on Planet
        let dx = 0
        let dy = 0
        let distance = 0
        let min_distance = 9999999999
        let other_pnt = this.position

        for (var i = 0; i < objects.length; i++){
            //change to Planet
            if(objects[i].constructor.name.toString() == this.target_type ){
                //check distance
                dx = this.position.x - objects[i].position.x
                dy = this.position.y - objects[i].position.y
                distance = Math.sqrt(dx**2 + dy**2)
                if (distance < min_distance){
                    min_distance = distance
                    other_pnt = objects[i].position
                }
            }
        }
        //if min_distance <= view_radius
        let v_x = this.velocity[0]
        let v_y = this.velocity[1]

        dx = this.position.x - other_pnt.x
        dy = this.position.y - other_pnt.y
        let B = .0001*(2**(min_distance-10))
        let d_v_x = -.3*dx*B
        let d_v_y = -.3*dy*B
        if (min_distance > 200){
            d_v_x = 0
            d_v_y = 0
        }
        else{
            //update resources
            if (min_distance < 50){
                MINERALS += 1
                if (MINERALS > 100 && MINERALS % 100 == 1){
                    POINTS += Math.round(MINERALS*0.03)
                }
            }
        }

        this.velocity = [v_x + d_v_x, v_y + d_v_y]
        //update resources
    }
    defend(){
        this.color = 'red'
        //velocity = f(enemy and enemy rockets)

        let dx = 0
        let dy = 0

        let min_distance = 99999999
        let distance = 0
        let other_pnt = this.position
        let j = 0
        //closest target = (x,y)
        for (var i = 0; i < objects.length; i++){
            //find self
            if (objects[i] === this){
                //console.log('this is this')
                j = i
            }
            //blow up Particle
            //blow up enemy rocket
            if(objects[i].constructor.name.toString() == 'Enemy' ){
                //check distance
                dx = this.position.x - objects[i].position.x
                dy = this.position.y - objects[i].position.y
                distance = Math.sqrt(dx**2 + dy**2)
                if (distance < min_distance){
                    min_distance = distance
                    other_pnt = objects[i].position
                }
            }
        }
        /*
        let target_threshold = 10
        if (min_distance < target_threshold){
            //create explosion
            //delete rocket
            console.log('removing rocket')
            objects.splice(j, 1)
            var explosion = new Explosion(this.position)
            objects.push(explosion)

        }
        */
        // calculate trajectory to closest target
        dx = other_pnt.x - this.position.x
        dy = other_pnt.y - this.position.y

        let v_x = this.velocity[0]
        let v_y = this.velocity[1]
        let V = Math.sqrt(v_x**2 + v_y**2)
        //let ang = Math.atan2(v_y, v_x)

        let B = .0005
        let Vm = .8//Math.min(this.max_v, V)

        // g_x,y : distance from center
        // d_v_x,y : acceleration = f(g)
        let g_x = 2*B*(dx)
        let e_g_x = Math.exp(g_x)
        let d_v_x = Vm*(e_g_x - 1)/(e_g_x + 1)

        let g_y = 2*B*(dy)
        let e_g_y = Math.exp(g_y)
        let d_v_y = Vm*(e_g_y - 1)/(e_g_y + 1)

        if (this.timer < 1){
            if (ROCKETS > 0) {
            var rocket = new Rocket(this.position)
            objects.push(rocket)
            ROCKETS -= 1
            }
        this.timer = this.cool_down
        }
        this.timer -= 1
    }
    home(){
        this.color = 'blue'
        // return to home base
        var home = new Point(canvas.width/2, canvas.height)
        let dx = home.x - this.position.x
        let dy = home.y - this.position.y
        let distance = Math.sqrt(dx**2 + dy**2)
        let max_convert = 100
        let converted = 0
        let conversion_ratio = 0.5
        if (distance < 20){
            //convert MINERALS -> RESOURCES
            converted = Math.min(MINERALS, max_convert)
            MINERALS -= converted
            RESOURCES += Math.round(converted*conversion_ratio)



        }
        //let dx = this.map[0].x - this.position.x
        //let dy = this.map[0].y - this.position.y
        let v_x = this.velocity[0]
        let v_y = this.velocity[1]
        let V = Math.sqrt(v_x**2 + v_y**2)
        let ang = Math.atan2(dy, dx)
        v_x = V*Math.cos(ang)
        v_y = V*Math.sin(ang)
        this.velocity = [v_x, v_y]

    }
    computeChange(others){
        //Explore, Defend, Harvest, ReturnHome
        if (MODE == "Explore"){
            this.search(objects)
        }
        if (MODE == "Harvest"){
            this.harvest(others)
        }
        if (MODE == "Defend"){
            this.defend()
        }
        if (MODE == "Home"){
            this.home()
        }
        //cap velocity magnitude
        if (this.velocity[0] < 0){
            this.velocity[0] = Math.max(this.velocity[0], -this.max_v)
        }
        else{
            this.velocity[0] = Math.min(this.velocity[0], this.max_v)
        }

        if (this.velocity[1] < 0){
            this.velocity[1] = Math.max(this.velocity[1], -this.max_v)
        }
        else{
            this.velocity[1] = Math.min(this.velocity[1], this.max_v)
        }
        this.new_position = new Point(this.new_position.x + this.velocity[0], this.new_position.y + this.velocity[1])
        //checks if in canvas
        if (this.new_position.x < this.radius){
            this.new_position.x = this.radius
            this.velocity[0] = this.velocity[0] * -.9
        }
        if (this.new_position.x > canvas.width - this.radius){
            this.new_position.x = canvas.width - this.radius
            this.velocity[0] = this.velocity[0] * -.9
        }
        if (this.new_position.y < this.radius){
            this.new_position.y = this.radius
            this.velocity[1] = this.velocity[1] * -.9
        }
        if (this.new_position.y > canvas.height - this.radius){
            this.new_position.y = canvas.height - this.radius
            this.velocity[1] = this.velocity[1] * -.9
        }
    }
    draw(){
        let mid = 3
        let t_var = TIME%(this.radius) + mid
        drawCircle(this.position, t_var, 'rgba(0,0,0,0)', 'white')
        drawCircle(this.position, this.radius, 'rgba(0,0,0,0)', 'white')
        drawCircle(this.position, mid, this.color, 'white')

    }
}


//Enemy
class Enemy{
    constructor(position, velocity, health){
        this.position = position
        this.new_position = position
        this.velocity = velocity
        this.health = health
        this.radius = 8
        this.max_v = 2
        //this.max_turn = 10
        //this.center = position //Point
        this.cool_down = 500
        this.timer = this.cool_down
        this.color = 'black'
        //will this work
        let W = canvas.width
        let H = canvas.height
        let p1 = new Point(0.2*W,0.1*H)
        let p2 = new Point(0.2*W,0.5*H)
        let p3 = new Point(0.8*W,0.1*H)
        let p4 = new Point(0.8*W,0.5*H)

        this.map = [p1, p2, p3, p4]
        this.destination = 0
        this.target_type = 'User'
        this.modes = ['search', 'attack']
        this.mode = this.modes[0]

    }
    update(){

        this.position = this.new_position
    }
    attack(){
        //same as user defend
        let dx = 0
        let dy = 0

        let min_distance = 99999999
        let distance = 0
        let other_pnt = this.position
        let j = 0
        //closest target = (x,y)
        for (var i = 0; i < objects.length; i++){
            //find self
            if (objects[i] === this){
                //console.log('this is this')
                if (this.health < 1){
                    objects.splice(i, 1)
                    console.log('Emeny destroyed')
                    POINTS += 100
                    return
                }
            }
            //blow up Particle
            //blow up enemy rocket
            if(objects[i].constructor.name.toString() == this.target_type ){
                //check distance
                dx = this.position.x - objects[i].position.x
                dy = this.position.y - objects[i].position.y
                distance = Math.sqrt(dx**2 + dy**2)
                if (distance < min_distance){
                    min_distance = distance
                    other_pnt = objects[i].position
                }
            }
        }
        /*
        let target_threshold = 10
        if (min_distance < target_threshold){
            //create explosion
            //delete rocket
            console.log('removing rocket')
            objects.splice(j, 1)
            var explosion = new Explosion(this.position)
            objects.push(explosion)

        }
        */
        // calculate trajectory to closest target
        dx = other_pnt.x - this.position.x
        dy = other_pnt.y - this.position.y

        let v_x = this.velocity[0]
        let v_y = this.velocity[1]
        let V = Math.sqrt(v_x**2 + v_y**2)
        //let ang = Math.atan2(v_y, v_x)

        let B = .0005
        let Vm = .8//Math.min(this.max_v, V)

        // g_x,y : distance from center
        // d_v_x,y : acceleration = f(g)
        let g_x = 2*B*(dx)
        let e_g_x = Math.exp(g_x)
        let d_v_x = Vm*(e_g_x - 1)/(e_g_x + 1)

        let g_y = 2*B*(dy)
        let e_g_y = Math.exp(g_y)
        let d_v_y = Vm*(e_g_y - 1)/(e_g_y + 1)

        if (this.timer < 1){
            var rocket = new EnemyRocket(this.position)
            objects.push(rocket)
            this.timer = this.cool_down
        }
        this.timer -= 1
        this.velocity = [v_x + d_v_x, v_y + d_v_y]
    }
    search(){
        //same as user search

        let dx = 0
        let dy = 0
        let distance = 0
        let min_distance = 9999999999
        let other_pnt = this.position
        for (var i = 0; i < objects.length; i++){
            //change to Planet
            if (objects[i] === this){
                //console.log('this is this')
                if (this.health < 1){
                    objects.splice(i, 1)
                    POINTS += 100
                    console.log('Emeny destroyed')
                }
            }
            if(objects[i].constructor.name.toString() == this.target_type ){
                //check distance
                dx = this.position.x - objects[i].position.x
                dy = this.position.y - objects[i].position.y
                distance = Math.sqrt(dx**2 + dy**2)
                if (distance < min_distance){
                    min_distance = distance
                    other_pnt = objects[i].position
                }
            }
        }
        //if min_distance <= view_radius
        let v_x = this.velocity[0]
        let v_y = this.velocity[1]

        let B = .0001*(2**(min_distance-10))
        if (min_distance > 200){

            //go to destination

            //    Point = this.map[this.destination]
            // calc distance to Point
            dx = this.position.x - this.map[this.destination].x
            dy = this.position.y - this.map[this.destination].y
            //if distance < 30, increment destination
            distance = Math.sqrt(dx**2 + dy**2)
            if (distance < 30){
                this.destination = (this.destination + 1) % this.map.length
            }
        }
        else{
            dx = 0
            dy = 0
            this.mode = this.modes[1]
        }


        let d_v_x = -.3*dx*B
        let d_v_y = -.3*dy*B
        //else
        // zig zag


        this.velocity = [v_x + d_v_x, v_y + d_v_y]
    }
    computeChange(others){
        //Explore, Defend, Harvest, ReturnHome

        if (this.mode == "attack"){
            this.attack()
        }
        if (this.mode == 'search'){
            this.search()
        }
        //cap velocity magnitude
        if (this.velocity[0] < 0){
            this.velocity[0] = Math.max(this.velocity[0], -this.max_v)
        }
        else{
            this.velocity[0] = Math.min(this.velocity[0], this.max_v)
        }

        if (this.velocity[1] < 0){
            this.velocity[1] = Math.max(this.velocity[1], -this.max_v)
        }
        else{
            this.velocity[1] = Math.min(this.velocity[1], this.max_v)
        }
        this.new_position = new Point(this.new_position.x + this.velocity[0], this.new_position.y + this.velocity[1])
        //checks if in canvas
        if (this.new_position.x < this.radius){
            this.new_position.x = this.radius
            this.velocity[0] = this.velocity[0] * -.9
        }
        if (this.new_position.x > canvas.width - this.radius){
            this.new_position.x = canvas.width - this.radius
            this.velocity[0] = this.velocity[0] * -.9
        }
        if (this.new_position.y < this.radius){
            this.new_position.y = this.radius
            this.velocity[1] = this.velocity[1] * -.9
        }
        if (this.new_position.y > canvas.height - this.radius){
            this.new_position.y = canvas.height - this.radius
            this.velocity[1] = this.velocity[1] * -.9
        }
    }
    draw(){
        /*
        let mid = 3
        let t_var = TIME%(this.radius) + mid
        drawCircle(this.position, t_var, 'rgba(0,0,0,0)', 'white')
        drawCircle(this.position, this.radius, 'rgba(0,0,0,0)', 'red')
        drawCircle(this.position, mid, this.color, 'white')
        */
        drawShip(this.position, this.radius, 'rgba(110,100,100,1)', 'rgba(200,200,200,1)')
        drawCircle(this.position, this.radius-3, 'rgba(100,100,100,1)', 'rgba(100,100,100,1)')
    }

}




