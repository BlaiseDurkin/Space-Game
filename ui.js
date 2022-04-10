/*
ui.js  User Interface Script
functions to control UI
*/

//update_X_val(val)

function quit_func(){
    // return to previous window
    alert('quit')
}

function restart_func(){
    // initGame()
    alert('restart')
}
//HEALTH
function update_points(){
    html_element = document.getElementById('PointsScore')
    html_element.innerHTML = POINTS
}
function update_health(){
    html_element = document.getElementById('HealthCount')
    html_element.innerHTML = HEALTH
}
//MINERALS
function update_minerals(){
    html_element = document.getElementById('MineralCount')
    html_element.innerHTML = MINERALS
}

//RESOURCES
function update_resources(){
    html_element = document.getElementById('ResourceCount')
    html_element.innerHTML = RESOURCES
}
//MODE
function update_mode(){
    html_element = document.getElementById('Mode')
    html_element.innerHTML = MODE
}
function defend_func(){
    // set user command to defend
    //alert('defend')
    MODE = 'Defend'
    update_mode()
}
function find_mine_func(){
    // set user command to search
    //alert('find minerals')
    MODE = 'Explore'
    update_mode()
}

function return_home_func(){
    // set user command to return home
    //alert('return home')
    MODE = 'Home'
    update_mode()
}

function harvest_func(){
    // set user command to harvest
    //alert('harvest')
    MODE = 'Harvest'
    update_mode()
}

//ROCKETS
function update_rockets(){
    html_element = document.getElementById('RocketCount')
    html_element.innerHTML = ROCKETS
}
function build_rocket_func(){
    //alert('build rocket')
    if (RESOURCES >= 100){
        ROCKETS += 1
        RESOURCES -= 100
        update_rockets()
        update_resources()
    }
}

//BEACONS
function update_beacons(){
    html_element = document.getElementById('BeaconCount')
    html_element.innerHTML = BEACONS

}
function build_beacon_func(){
    //alert('build rocket')
    if (RESOURCES >= 100){
        BEACONS += 1
        RESOURCES -= 100
        update_beacons()
        update_resources()
    }
}


//UPDATE USER INTERFACE
function update_UI(){
    update_points()
    update_health()
    update_minerals()
    update_resources()
    update_mode()
    update_rockets()
    update_beacons()
}



