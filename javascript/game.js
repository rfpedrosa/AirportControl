/* Main variables */
var canvas;
var context;
            
var audio;
var audio_playing = true;
            
var audio_alarm;
var audio_explosion;
var audio_effects_enabled = true;

/* Stage variable */
var stage;


/* Variables under control off Mouse Events */
// these are common to all elements
// Multi touch not supported!
var mouseTarget;	// the display object currently under the mouse, or being dragged
var dragStarted;	// indicates whether we are currently in a drag operation

var startPt;	// Line draw start position


/* Targets/Air Planes associated structures */
// Key: DisplayObject.id - Value: DisplayObject
var mapIdDisplayObject = new Object();     // Display Objects array/map

var FIGHTER_AIRPORT; // Airport location in the map
var FIGHTER_AIRPORT_BITMAP; // Airport location in the map
var FIGHTER_AIRPORT_SHAPE; // Draw Airport location
var FIGHTER_AIRPORT_ROUTE = []; // Route on landing
            
var BOMBER_AIRPORT; // Airport location in the map
var BOMBER_AIRPORT_BITMAP; // Airport location in the map
var BOMBER_AIRPORT_SHAPE; // Draw Airport location
var BOMBER_AIRPORT_ROUTE = []; // Route on landing
            
var HELICOPTER_AIRPORT; // Airport location in the map
var HELICOPTER_AIRPORT_BITMAP; // Airport location in the map
var HELICOPTER_AIRPORT_SHAPE; // Draw Airport location
var HELICOPTER_AIRPORT_ROUTE = []; // Route on landing
            

var TICKS_BEFORE_ACTIVE_START_COUNTER = 100;


var INCREASE_DIFICULTY_DELAY_TIME = 45000; // each 5s
var CREATE_AIRPLANES_DELAY_TIME = 7000; // each 5s
var last_increase_dificulty_time;
var last_create_airplanes_delay_time = CREATE_AIRPLANES_DELAY_TIME; // DIFICULTY
var last_airplane_created; // date
var last_nr_airplane_created;
var factor;
            
var isDead = true;
var score = 0;            // Final Score           
var messageField1;		//Message display field
var messageField2;		//Message display field
var messageField3;		//Message display field
var scoreField;			//score Field

/* Used to draw GUI */
var CLOUDS_NUMBER = 5;
var clouds = [];
//var cloudsShape;
            
/*var isToBlink = false;*/
var lastTrackBlinkDate = new Date();
            
BLINK_TIME = 300;

function init() {
    // create stage and point it to the canvas:
    canvas = document.getElementById("game_canvas");
    // audio files
    audio = document.getElementById("music");
    audio_alarm = document.getElementById("alarm");
    audio_explosion = document.getElementById("explosion");

    context = canvas.getContext('2d');

    // grab canvas width and height for later calculations:
    //var width = canvas.width;
    //var height = canvas.height;

    stage = new Stage(canvas);
    //ensure stage is blank
    //stage.clear();
    //stage.autoClear = false;
    stage.mouseEnabled = true;

    stage.enableMouseOver(50);

    // attach mouse handlers directly to the source canvas:
    canvas.onmousemove = onMouseMove;
    canvas.onmousedown = onMouseDown;
    canvas.onmouseup = onMouseUp;

    scoreField = new Text("0", "bold 18px Arial", "#00FF00");
    scoreField.textAlign = "right";
    scoreField.x = canvas.width - 10;
    scoreField.y = 22;

    messageField1 = new Text("Welcome to the Airport Control Game!!", "bold 24px Arial", "#000000");
    messageField1.textAlign = "center";
    //messageField1.x = canvas.width / 2;
    messageField1.x = 300;
    messageField1.y = canvas.height / 2 - 175;
                
    messageField2 = new Text("Rules:\n\nDrag and Drop Airplanes in the RIGHT Airport track! \n\n Airplanes must be dropped on the blinking RED BOXES!", "bold 20px Arial", "#000000");
    messageField2.textAlign = "center";
    //messageField2.x = canvas.width / 2;
    messageField2.x = 300;
    messageField2.y = canvas.height / 2 - 100;
                
    messageField3 = new Text("Are you ready?!? Click here or press \"Play\" to start", "bold 12px Arial", "#FF0000");
    messageField3.textAlign = "center";
    //messageField3.x = canvas.width / 2;
    messageField3.x = 300;
    messageField3.y = canvas.height / 2 + 200;

    watchRestart();
}
            
function watchRestart() {   
    // 1. Add instructions
    FIGHTER_AIRPORT = new Rectangle(500,canvas.height/2 + 100,32,32); // Airport location in the map
                
    FIGHTER_AIRPORT_SHAPE = new Shape();
    // draw rectangle
    FIGHTER_AIRPORT_SHAPE.graphics.setStrokeStyle(3,"round","round").beginStroke(Graphics.getRGB(255,0,0,1));
    FIGHTER_AIRPORT_SHAPE.graphics.rect(FIGHTER_AIRPORT.x,FIGHTER_AIRPORT.y,FIGHTER_AIRPORT.width, FIGHTER_AIRPORT.height);
    // draw arrows
    FIGHTER_AIRPORT_SHAPE.graphics.setStrokeStyle(3,"round","round").beginStroke(Graphics.getRGB(255,0,0,1));
    drawArrowsAroundRectangle(FIGHTER_AIRPORT_SHAPE.graphics, FIGHTER_AIRPORT, true);
    stage.addChild(FIGHTER_AIRPORT_SHAPE);
                
    var airPlane = addAirPlane(0);
    airPlane.setPosition(50, canvas.height/2 + 100 + 16);               
    //airPlane.addRoutePoint(805,216);
    airPlane.drawRoute(66, canvas.height/2 + 100 + 16, 516, canvas.height/2 + 100 + 16);
    airPlane.bitmap.rotation = 90;
                
    //watch for clicks
    stage.addChild(messageField1);
    stage.addChild(messageField2);
    stage.addChild(messageField3);
    
    // 1.1 Add Play instruction
    var img = new Image();
    img.src = "img/audio/play.png";
    var bitmap = new Bitmap(img); // Airport location in the map
    bitmap.x = canvas.width / 2 - 50;
    bitmap.y = canvas.height / 2 + 175;
    stage.addChild(bitmap);
    
    
    // 2. Add High Scores
    drawScoreTable();
    
                
    stage.update(); 	//update the stage to show text
                
    // Play Audio
    /*if(audio_playing) {
                    audio.play();
                }*/

    //canvas.onclick = handleClick;
    canvas.onclick = PlayButtonHandler;
}

function handleClick() {
    //prevent extra clicks and hide text
    canvas.onclick = null;
    stage.removeChild(messageField1);
    stage.removeChild(messageField2);
    stage.removeChild(messageField3);

    restart();                
}

//reset all game logic
function restart() {
    /*var obj = document.getElementById("play_button");
                obj.firstChild?obj.firstChild.data="Pause":obj.appendChild(document.createTextNode(Pause));
                //document.getElementById("play_button").innerHMTL = "Pause";*/
                
    mapIdDisplayObject = new Object();
    clouds.length = 0;
    score = 0;

    //hide anything on stage and show the score
    stage.removeAllChildren();

    //ensure stage is blank and add the ship
    stage.clear();
                
    DrawScenario();

    scoreField.text = (0).toString();
    stage.addChild(scoreField);

    // initialize some variables
    last_increase_dificulty_time = new Date();
    last_airplane_created = new Date();
    last_create_airplanes_delay_time = CREATE_AIRPLANES_DELAY_TIME; // DIFICULTY
    last_nr_airplane_created = 0;
    factor = 0.85;

    lastTrackBlinkDate = new Date();
                
    isDead = false;
                
    // add some airplanes
    addAirPlane(0);
    addAirPlane(TICKS_BEFORE_ACTIVE_START_COUNTER);

    // Add air planes
    /*for(var i = 0; i < 2; i++){
                    addAirPlane(0);
                }

                for(var i = 0; i < 2; i++){
                    addAirPlane(TICKS_BEFORE_ACTIVE_START_COUNTER);
                }*/

    //start game timer
    // assign a tick listener directly to this window:
    //Ticker.setInterval(75); // Default is 50...
    //Ticker.setFPS(10);
    Ticker.addListener(window);
}


DrawScenario = function() {
    CreateClouds();

    // Background
    var stage_img = new Image();
    stage_img.src = "img/stage_backgroundv11.png";
    //stage_img.src = "img/AeroportodeGibraltar.jpg";

    var bitmap = new Bitmap(stage_img);
    bitmap.alpha = 0.4;
    stage.addChild(bitmap);

    // Airport/targets positions
    var img1 = new Image();
    img1.src = "img/airplanes/fighter_white.png";
                
    FIGHTER_AIRPORT_BITMAP = new Bitmap(img1); // Airport location in the map

    //FIGHTER_AIRPORT_BITMAP.alpha = 0.5;
    //FIGHTER_AIRPORT_BITMAP.visible = false;
    FIGHTER_AIRPORT_BITMAP.x = 375;
    FIGHTER_AIRPORT_BITMAP.y = 150;
    FIGHTER_AIRPORT_BITMAP.rotation = 90;
    stage.addChild(FIGHTER_AIRPORT_BITMAP);
                
    FIGHTER_AIRPORT = new Rectangle(343,150,32,32); // Airport location in the map
                
    FIGHTER_AIRPORT_ROUTE.length = 0;
    FIGHTER_AIRPORT_ROUTE.push(new Point(375,164));
    FIGHTER_AIRPORT_ROUTE.push(new Point(375 + 400,164));
                
    FIGHTER_AIRPORT_SHAPE = new Shape();
    // draw rectangle
    FIGHTER_AIRPORT_SHAPE.graphics.setStrokeStyle(3,"round","round").beginStroke(Graphics.getRGB(255,0,0,1));
    FIGHTER_AIRPORT_SHAPE.graphics.rect(FIGHTER_AIRPORT.x,FIGHTER_AIRPORT.y,FIGHTER_AIRPORT.width, FIGHTER_AIRPORT.height);
    // draw arrows
    FIGHTER_AIRPORT_SHAPE.graphics.setStrokeStyle(3,"round","round").beginStroke(Graphics.getRGB(255,0,0,1));
    drawArrowsAroundRectangle(FIGHTER_AIRPORT_SHAPE.graphics, FIGHTER_AIRPORT, true);
                
    FIGHTER_AIRPORT_SHAPE.visible = false;
    stage.addChild(FIGHTER_AIRPORT_SHAPE);
                
                
                

    var img2 = new Image();
    img2.src = "img/airplanes/bomber_white.png";
    BOMBER_AIRPORT_BITMAP = new Bitmap(img2); // Airport location in the map

    //BOMBER_AIRPORT_BITMAP.alpha = 0.5;
    //BOMBER_AIRPORT_BITMAP.visible = false;
    BOMBER_AIRPORT_BITMAP.x = 520;
    BOMBER_AIRPORT_BITMAP.y = 295;
    BOMBER_AIRPORT_BITMAP.rotation = 65;
    stage.addChild(BOMBER_AIRPORT_BITMAP);
                
    BOMBER_AIRPORT = new Rectangle(500,295,32,32); // Airport location in the map

    BOMBER_AIRPORT_ROUTE.length = 0;
    /*BOMBER_AIRPORT_ROUTE.push(new Point(500,319));
                BOMBER_AIRPORT_ROUTE.push(new Point(511,315));
                BOMBER_AIRPORT_ROUTE.push(new Point(521,308));
                BOMBER_AIRPORT_ROUTE.push(new Point(506,316));*/
    BOMBER_AIRPORT_ROUTE.push(new Point(523,306));
    BOMBER_AIRPORT_ROUTE.push(new Point(545,300));
    BOMBER_AIRPORT_ROUTE.push(new Point(570,286));
    BOMBER_AIRPORT_ROUTE.push(new Point(600,276));
    BOMBER_AIRPORT_ROUTE.push(new Point(650,252));
    BOMBER_AIRPORT_ROUTE.push(new Point(750,239));
    /*BOMBER_AIRPORT_ROUTE.push(new Point(650,295-20));
                BOMBER_AIRPORT_ROUTE.push(new Point(700,295-50));*/
    /*BOMBER_AIRPORT_ROUTE.push(new Point(750,295-50));*/

    BOMBER_AIRPORT_SHAPE = new Shape();
    BOMBER_AIRPORT_SHAPE.graphics.setStrokeStyle(3,"round","round").beginStroke(Graphics.getRGB(255,0,0,1));
    BOMBER_AIRPORT_SHAPE.graphics.rect(BOMBER_AIRPORT.x,BOMBER_AIRPORT.y,BOMBER_AIRPORT.width, BOMBER_AIRPORT.height);
    // draw arrows
    BOMBER_AIRPORT_SHAPE.graphics.setStrokeStyle(3,"round","round").beginStroke(Graphics.getRGB(255,0,0,1));
    drawArrowsAroundRectangle(BOMBER_AIRPORT_SHAPE.graphics, BOMBER_AIRPORT, true);
                
    BOMBER_AIRPORT_SHAPE.visible = false;
    stage.addChild(BOMBER_AIRPORT_SHAPE);
                
                
    var img3 = new Image();
    img3.src = "img/airplanes/helicopter_white.png";
    HELICOPTER_AIRPORT_BITMAP = new Bitmap(img3); // Airport location in the map

    HELICOPTER_AIRPORT_BITMAP.alpha = 0.2;
    //BOMBER_AIRPORT_BITMAP.visible = false;
    HELICOPTER_AIRPORT_BITMAP.x = 765;
    HELICOPTER_AIRPORT_BITMAP.y = 310;
    stage.addChild(HELICOPTER_AIRPORT_BITMAP);
                
    HELICOPTER_AIRPORT = new Rectangle(765,310,32,32); // Airport location in the map
                
    // There is any route after landing

    HELICOPTER_AIRPORT_SHAPE = new Shape();
    HELICOPTER_AIRPORT_SHAPE.graphics.setStrokeStyle(3,"round","round").beginStroke(Graphics.getRGB(255,0,0,1));
    HELICOPTER_AIRPORT_SHAPE.graphics.rect(HELICOPTER_AIRPORT.x,HELICOPTER_AIRPORT.y,HELICOPTER_AIRPORT.width, HELICOPTER_AIRPORT.height);
    // draw arrows
    HELICOPTER_AIRPORT_SHAPE.graphics.setStrokeStyle(3,"round","round").beginStroke(Graphics.getRGB(255,0,0,1));
    drawArrowsAroundRectangle(HELICOPTER_AIRPORT_SHAPE.graphics, HELICOPTER_AIRPORT, false);
                
    HELICOPTER_AIRPORT_SHAPE.visible = false;
    stage.addChild(HELICOPTER_AIRPORT_SHAPE);
                
                
    /*var shapeTest = new Shape();
                stage.addChild(shapeTest);
                shapeTest.graphics.beginFill(Graphics.getRGB (255,255,255,1));
                shapeTest.graphics.rect(FIGHTER_AIRPORT.x,FIGHTER_AIRPORT.y,FIGHTER_AIRPORT.width, FIGHTER_AIRPORT.height);
                shapeTest.graphics.rect(BOMBER_AIRPORT.x,BOMBER_AIRPORT.y,BOMBER_AIRPORT.width, BOMBER_AIRPORT.height);
                shapeTest.graphics.endFill();*/

    /*context.fillStyle = 'rgba(255, 255, 0, 1)';
                context.beginPath();

                context.rect(canvas.width/2,canvas.height/2, 100, 100);
                context.closePath();
                context.fill();*/

}


CreateClouds = function(){
    //add information about circles into
    //the 'circles' Array. It is x & y positions,
    //radius from 0-100 and transparency
    //from 0-0.5 (0 is invisible, 1 no transparency)

    for (var i = 0; i < CLOUDS_NUMBER; i++) {
        clouds.push([Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 100, Math.random()/2]);
    }

    //cloudsShape = new Shape();
    //stage.addChild(cloudsShape);
}

MoveClouds = function(deltaY){
    for (var i = 0; i < CLOUDS_NUMBER; i++) {
        if (clouds[i][0] - clouds[i][2] > canvas.width) {
            //the circle is under the screen so we change
            //informations about it
            clouds[i][2] = Math.random() * 100;
            clouds[i][0] = 0 - clouds[i][2];
            clouds[i][1] = Math.random() * canvas.height;
            clouds[i][3] = Math.random()/2;
        } else {
            //move circle deltaY pixels down
            clouds[i][0] += deltaY;
        }
        /*if (clouds[i][1] - clouds[i][2] > canvas.height) {
                        //the circle is under the screen so we change
                        //informations about it
                        clouds[i][0] = Math.random() * canvas.width;
                        clouds[i][2] = Math.random() * 100;
                        clouds[i][1] = 0 - clouds[i][2];
                        clouds[i][3] = Math.random() / 2;
                    } else {
                        //move circle deltaY pixels down
                        clouds[i][1] += deltaY;
                    }*/
    }

    DrawClouds();
};

DrawClouds = function() {
    for (var i = 0; i < CLOUDS_NUMBER; i++) {
        context.fillStyle = 'rgba(255, 255, 255, ' + clouds[i][3] + ')';
        //white color with transparency in rgba
        context.beginPath();

        context.arc(clouds[i][0]-clouds[i][2], clouds[i][1], clouds[i][2], 0, Math.PI, true);
        context.arc(clouds[i][0], clouds[i][1], clouds[i][2]/2, 0, Math.PI, true);
        context.arc(clouds[i][0]+clouds[i][2]/2, clouds[i][1], clouds[i][2]/4, 0, Math.PI, true);

        //context.arc(clouds[i][0], clouds[i][1], clouds[i][2], 0, Math.PI * 2, true);
        //arc(x, y, radius, startAngle, endAngle, anticlockwise)
        //circle has always PI*2 end angle
        context.closePath();
        context.fill();
    }

    /*cloudsShape.graphics.clear();
                for (var i = 0; i < CLOUDS_NUMBER; i++) {
                    //cloudsShape.graphics.fillStyle = 'rgba(255, 255, 255, ' + clouds[i][3] + ')';
                    //white color with transparency in rgba
                    cloudsShape.graphics.beginFill(Graphics.getRGB (255,255,255,clouds[i][3]));

                    cloudsShape.graphics.arc(clouds[i][0]-clouds[i][2], clouds[i][1], clouds[i][2], 0, Math.PI, true);
                    cloudsShape.graphics.arc(clouds[i][0], clouds[i][1], clouds[i][2]/2, 0, Math.PI, true);
                    cloudsShape.graphics.arc(clouds[i][0]+clouds[i][2]/2, clouds[i][1], clouds[i][2]/4, 0, Math.PI, true);

                    //context.arc(clouds[i][0], clouds[i][1], clouds[i][2], 0, Math.PI * 2, true);
                    //arc(x, y, radius, startAngle, endAngle, anticlockwise)
                    //circle has always PI*2 end angle
                    //cloudsShape.graphics.closePath();
                    cloudsShape.graphics.endFill();
                }*/
}

/*DrawSun = function() {
                context.fillStyle = 'rgba(255, 215, 0, ' + 0.5 + ')';
                //white color with transparency in rgba
                context.beginPath();

                context.arc(100, 100, 50, 0, Math.PI * 2, true);
                context.moveTo(100,100);

                for (var i = 0; i < 10; i++) {
                    context.bezierCurveTo(75,37,70,25,50,25);
                    context.bezierCurveTo(20,25,20,62.5,20,62.5);
                    context.bezierCurveTo(20,80,40,102,75,120);
                    context.bezierCurveTo(110,102,130,80,130,62.5);
                    context.bezierCurveTo(130,62.5,130,25,100,25);
                    context.bezierCurveTo(85,25,75,37,75,40); 
                }

                context.closePath();
                context.fill();
            }*/

function addAirPlane(beforeActiveCounter) {
    var p = getAvailableStartPosition();
    if(!p) {
        return null;
    }

    //var type = Math.round(Math.random() * 17) + 1;
    //var type = Math.round(Math.random()*3) + 1;
    var type = Math.floor(Math.random()*3) + 1; // between 1 and 3
    var airPlane = new AirPlane(type, beforeActiveCounter, canvas.width, canvas.height);
    //var airPlane = new AirPlane();

    // set air plane position by the defined method
    airPlane.setPosition(p.x,p.y);
                
    airPlane.bitmap.mouseEnabled = true;
    airPlane.bitmap.onMouseOver = onMouseOver;
    airPlane.bitmap.onMouseOut = onMouseOut;

    // others initializations
    mapIdDisplayObject[airPlane.id] = airPlane;

    stage.addChild(airPlane);
    //alert("air plane criado! ID:" + airPlane.id);
                
    return airPlane;
}

function getAvailableStartPosition() {
    // ensure that there isn´t infinite cycles here
    // we generate 100 random start points maximum
    for(i = 0; i < 100; i++) {
        // Find a random and empty position to put this air plane
        var v = Math.random();
        var x;
        var y;
        if(v > 0.5) {
            x = Math.round(canvas.width * Math.random());
            y = Math.round(Math.random()) * canvas.height; // 0 || canvas.height
        } else {
            x = Math.round(Math.random()) * canvas.width; // 0 || canvas.height
            y = Math.round(canvas.height * Math.random());
        }

        if(x == 0) {
            x = 16;
        }

        if(x == canvas.width) {
            x = canvas.width - 16;
        }

        if(y == 0) {
            y = 16;
        }

        if(y == canvas.height) {
            y = canvas.height - 16;
        }

        // random point generated.. check if there is any air plane near
        var validLocationFounded = true;
        for(id in mapIdDisplayObject) {
            var target = mapIdDisplayObject[id];

            if(target.hitRadius(x, y, target.hit*4)) {
                validLocationFounded = false;
                break;
            }
        }

        if(validLocationFounded) {
            return new Point(x,y);
        }
    }

    return null;
}


function tick() {
    // Play Audio
    //if(audio_playing && audio.readyState >= 4) {
    if(audio_playing) {
        audio.play();
    }
        
    // if we were dragging, but are not anymore, call mouseOut with the old target:
    /*if(!dragStarted && mouseTarget) {
                    onMouseOut(mouseTarget);
                    dragStarted = false;
                }

                // if we're not currently dragging, and have valid mouseX and mouseY values, check for objects under mouse:
                if(!dragStarted && stage.mouseX && stage.mouseY) {
                    // when running local files, most browsers throw a security error when reading pixel data
                    // (which getObjectUnderPoint uses) so we'll put it in a try/catch block:~

                    try {
                        var target = stage.getObjectUnderPoint(stage.mouseX, stage.mouseY);
                        // this will return the top-most display object under the mouse position:
                    } catch (e) {
                        //Ticker.removeListener(window);
                        alert("An error occurred because this browser does not support reading pixel data in local files. Please read 'SECURITY_ERROR_README.txt' included with the EaselJS for details");
                    }

                    if( (target) && (target instanceof Bitmap) ) {
                        //alert(target);
                        mouseTarget = target.parent;
                        // if we found a target, call mouseOver with it:
                        onMouseOver(mouseTarget);

                    } else {
                        mouseTarget = null;
                    }
                }*/


    // 1. Draw mouseTarget route if necessary
    if((dragStarted) && (mouseTarget)) {
        //if(dragStarted) {
        // calculate the new position in the shape's local coordinate space:
        var endPt = mouseTarget.routeShape.globalToLocal(stage.mouseX,stage.mouseY);
                    
        mouseTarget.drawRoute(startPt.x, startPt.y, endPt.x, endPt.y);
        //mouseTarget.addRoutePoint(endPt.x, endPt.y);
        /*if(mouseTarget.positions.length <= 0) { // security check - point added
                        // suppose never happens!
                        mouseTarget.addRoutePoint(startPt.x, startPt.y);
                        mouseTarget.addRoutePoint(endPt.x, endPt.y);
                    }*/

        startPt = endPt;
                    
        // Now blinks airplane image/bitmap on the track
        var curTime = new Date();
        if(curTime.getTime() - lastTrackBlinkDate.getTime() > BLINK_TIME) {
            if(mouseTarget.type == AirPlane.FIGHTER) {
                FIGHTER_AIRPORT_BITMAP.visible = !FIGHTER_AIRPORT_BITMAP.visible; 
                FIGHTER_AIRPORT_SHAPE.visible = FIGHTER_AIRPORT_BITMAP.visible;
                            
            } else if(mouseTarget.type == AirPlane.BOMBER) {
                BOMBER_AIRPORT_BITMAP.visible = !BOMBER_AIRPORT_BITMAP.visible;
                BOMBER_AIRPORT_SHAPE.visible = BOMBER_AIRPORT_BITMAP.visible;
                            
            } else if(mouseTarget.type == AirPlane.HELICOPTER) {
                HELICOPTER_AIRPORT_BITMAP.visible = !HELICOPTER_AIRPORT_BITMAP.visible;
                HELICOPTER_AIRPORT_SHAPE.visible = HELICOPTER_AIRPORT_BITMAP.visible;
            }

            lastTrackBlinkDate = curTime;
        }
    } else {
        FIGHTER_AIRPORT_BITMAP.visible = true;
        BOMBER_AIRPORT_BITMAP.visible = true;
        HELICOPTER_AIRPORT_BITMAP.visible = true;
                    
        FIGHTER_AIRPORT_SHAPE.visible = false;
        BOMBER_AIRPORT_SHAPE.visible = false; 
        HELICOPTER_AIRPORT_SHAPE.visible = false; 
    }
                
                
    // 2. Game Engine
    // Nested loop are used to increase performance (reducing cycles)
                
    var is_to_ring_alarm = false;

    // 2.1 Move all elements according with drawed route
    for(id in mapIdDisplayObject) {
        var target = mapIdDisplayObject[id];
        //alert('Id is: ' + id + ', value is: ' + target);

        if(target == mouseTarget) {
            //alert('Id is: ' + mouseTarget.id + ', value is: ' + mouseTarget);
            continue;
        }

        // move target to the next route point
        target.move();

        //alert('New Target (' + target.toString() + ') position. X:' + key.x + ' Y:' + key.y);

        // 2.2 Check if it was reached to the objective - landing
        // and increase score it is the case


        // 2.3 Another/Nested Loop
        // 1. Check if this air plane crashes!
        // 2. Check if is on target
        if(target.isActive) {
            // 2.3.1 - Cohesion detector
            var isNormalMode = true;
            for(otherId in mapIdDisplayObject) {
                //var otherTargetPositions = mapPositions[otherId];
                var otherTarget = mapIdDisplayObject[otherId];

                if( (target == otherTarget) || (! otherTarget.isActive) ) {
                    continue;
                }
                            
                if(target.hitRadius(otherTarget.bitmap.x, otherTarget.bitmap.y, otherTarget.hit)) {
                    target.changeToWarningMode(otherTarget.hit*4);
                    otherTarget.changeToWarningMode(otherTarget.hit*4);
                                
                    GameOver(target, otherTarget);  
                                
                    return;

                } else if(target.hitRadius(otherTarget.bitmap.x, otherTarget.bitmap.y, otherTarget.hit*4)) {
                    //alert("true! change to warning mode...");
                    isNormalMode = false;
                }
            }

            if(isNormalMode) {
                target.changeToNormalMode();
            } else {
                target.changeToWarningMode(otherTarget.hit*4);
                            
                is_to_ring_alarm = true;
            }


            
            var array = target.getLastPositions(1);
            var lastRoutePoint = null;
            if(array.length != 0) {
                lastRoutePoint = array[0];
            }
            
            // 2.3.2 - Check if the airplane is on target/airport
            // If so, set it for landing
            if( (target.type == AirPlane.FIGHTER) && (target.hitRectangle(FIGHTER_AIRPORT)) && (target.isAirportRouteTraced) && 
                ((!lastRoutePoint) || (hitRectangle(lastRoutePoint.x, lastRoutePoint.y, FIGHTER_AIRPORT))) ) {
                
                target.land(FIGHTER_AIRPORT_ROUTE);

                increaseScore(1);

            } else if((target.type == AirPlane.BOMBER) && (target.hitRectangle(BOMBER_AIRPORT)) && (target.isAirportRouteTraced) && 
                ((!lastRoutePoint) || (hitRectangle(lastRoutePoint.x, lastRoutePoint.y, BOMBER_AIRPORT))) ) {
                target.land(BOMBER_AIRPORT_ROUTE);

                increaseScore(1);
                            
            } else if( (target.type == AirPlane.HELICOPTER) && (target.hitRectangle(HELICOPTER_AIRPORT)) /*&& (target.positions.length == 0)*/ &&
                ((!lastRoutePoint) || (hitRectangle(lastRoutePoint.x, lastRoutePoint.y, HELICOPTER_AIRPORT))) ) {
                    
                target.land(HELICOPTER_AIRPORT_ROUTE);

                increaseScore(1);
            }

        }

        // 2.4. Remove airplanes which has already landed
        if(target.isToDelete) {
            stage.removeChild(target);
        }
    }

    if(is_to_ring_alarm && audio_effects_enabled) {
        audio_alarm.play();
    } else {
        audio_alarm.pause();
    }

    // 3. Create air planes
    curTime = new Date();

    if( (curTime.getTime() - last_airplane_created.getTime() > last_create_airplanes_delay_time) || (mapIdDisplayObject.length == 0) ) {
        addAirPlane(TICKS_BEFORE_ACTIVE_START_COUNTER);
        last_airplane_created = curTime;
    }
                
                
    /*if(curTime.getTime() - last_increase_dificulty_time.getTime() > INCREASE_DIFICULTY_DELAY_TIME) {
                    last_create_airplanes_delay_time = last_create_airplanes_delay_time * 0.9;
                    last_increase_dificulty_time = curTime;
                }*/
                
             
    // if we're currently dragging something, update it's x/y:
    //                if(dragStarted && mouseTarget) {
    //                    // pop it to the top of the display list:
    //                    stage.addChild(mouseTarget);
    //                    mouseTarget.x = stage.mouseX+offset.x;
    //                    mouseTarget.y = stage.mouseY+offset.y;
    //                }
                
    //Update the display list (draw everything)
    stage.update();

    //DrawSun();
    MoveClouds(5);
}

            
function increaseScore(value) {
    score += value;
                
    /*if((score > 0) && (score%10 == 0)) {
        last_create_airplanes_delay_time = last_create_airplanes_delay_time * factor;
                    
        if(last_create_airplanes_delay_time <= 3500) {
            factor = 0.95;
        }
    }*/
    
    var interval = CREATE_AIRPLANES_DELAY_TIME * Math.pow(0.95,Math.floor(Math.sqrt(score)));
    last_create_airplanes_delay_time = Math.round((Math.random() + 0.5) * interval);

    //trust the field will have a number and add the score
    scoreField.text = score.toString();
}
            
            
function GameOver(airplane1, airplane2) {
    audio_alarm.pause();
                
    airplane1.explode();
    airplane2.explode();
                
    if(audio_effects_enabled) {
        audio_explosion.play();
    }
                
    isDead = true;

    var img_button = document.getElementById("img_play");
    img_button.src = "img/audio/play.png";
    img_button.title = "Play";
                
    messageField1.text = "Game Over. Your score is...  " + score + "!";
    messageField1.color = "#FF0000";
    messageField1.font = "bold 24px Arial";
                
    if(score == 0) {
        messageField2.text = "\n Drag and drop airplanes in the RED BOXES.\n They flashes after selecting an airplane!";
                    
    } else if(score < 50) {
        messageField2.text = "\n Tip: Try to define common routes for each airplane type.";
                    
    } else if(score < 100) {
        messageField2.text = "\n Great result! Keep going...";
                    
    } else if(score < 200) {
        messageField2.text = "\n Beautiful! In which airport are you working?!? :)";
                    
    } else {
        messageField2.text = "\n Uauu! Amazing result! You are a pro...";
    }
                
    //messageField2.color = "#0000FF";
                
    messageField3.text = "Press \"Play\" to start a new game!";  
                
    //watchRestart();
    stage.addChild(messageField1);
    stage.addChild(messageField2);
    stage.addChild(messageField3);
    stage.update(); 	//update the stage to show text

    // AND Remove ticker listener...               
    Ticker.removeListener(window);
    
    drawScoreTable();
    stage.update();
                
    publish_Results(score);   
    
    //alert("You lose! Score:" + score);
    //Update the display list (draw everything)
}
           
isAlignWithTrack = function(target) {
    var nLastPoints = 5;
    
    var points = target.getLastPositions(nLastPoints);
    //alert(points);
    
    if(points.length < nLastPoints) {
        return false;
    }

    var distancePixels = 0;
    
    var nextPosition = points.pop();

    for(var i=0; i < nLastPoints-1; i++) {
        var currentPosition = points.pop();

        if(nextPosition.x - currentPosition.x < 0) {
            return false;
        } else {
            distancePixels += nextPosition.x - currentPosition.x;
        }
        
        nextPosition = currentPosition;
    }
    
    if(distancePixels < 2) {
        return false;
    }

    return true;
}
            

/**********************************
            /** MOUSE HANDLERS
 **********************************/
// on mouse move, update the stage's mouseX/mouseY:
function onMouseMove(e) {
    if(!e){
        e = window.event;
    }

    /*stage.mouseX = e.pageX-canvas.offsetLeft;
    stage.mouseY = e.pageY-canvas.offsetTop;*/

    //console.log("Mouse Move position:" + stage.mouseX + "," + stage.mouseY);

    if((dragStarted) && (mouseTarget)) {
        // Add route points
        mouseTarget.addRoutePoint(stage.mouseX, stage.mouseY);

        if( (mouseTarget.type == AirPlane.FIGHTER) && (hitRectangle(stage.mouseX, stage.mouseY, FIGHTER_AIRPORT)) && (isAlignWithTrack(mouseTarget)) ) {
            mouseTarget.setAirportRouteTraced(true);

        } else if((mouseTarget.type == AirPlane.BOMBER) && (hitRectangle(stage.mouseX, stage.mouseY, BOMBER_AIRPORT)) && (isAlignWithTrack(mouseTarget)) ) {
            mouseTarget.setAirportRouteTraced(true);
                        
        } else if((mouseTarget.type == AirPlane.HELICOPTER) && (hitRectangle(stage.mouseX, stage.mouseY, HELICOPTER_AIRPORT))) {
            mouseTarget.setAirportRouteTraced(true);
                        
        } else {
            mouseTarget.setAirportRouteTraced(false);
        }
    }
}

// set flag to indicate we want to drag whatever is under the mouse:
function onMouseDown(e) {
    if(!e){
        e = window.event;
    }

    /*stage.mouseX = e.pageX-canvas.offsetLeft;
    stage.mouseY = e.pageY-canvas.offsetTop;*/
    
    if(! mouseTarget) {
        // If any target is selected and user presses mouse...
        // check is there is any target in that position calling an onMouseOver method
        // If the user presses a target on a not yet detected onMouseOver... 
        // target will be selected!
        onMouseOver(e);
    }
                
    if( (mouseTarget) && (mouseTarget.isActive) ) {
        dragStarted = true;

        // Clear last route draw
        mouseTarget.clearRoute();

        mouseTarget.setAirportRouteTraced(false);

        // set up the first point in the new draw, and choose a random color:
        startPt = mouseTarget.routeShape.globalToLocal(stage.mouseX,stage.mouseY);
        mouseTarget.addRoutePoint(startPt.x, startPt.y);

        // Add first route point
        //mouseTarget.addRoutePoint(startPt.x, startPt.y);

        // clear the cache, so the vector data is drawn each tick:
        //lineShape.uncache();
    }
}

// set flag to indicate we no longer want to drag:
function onMouseUp(e) {
    dragStarted = false;
                

    // Check if a mouseOut is miss
    /*try {
                    // this will return the top-most display object under the mouse position:
                    var target = stage.getObjectUnderPoint(event.stageX, event.stageY);
                } catch (e) {
                    //Ticker.removeListener(window);
                    alert("An error occurred because this browser does not support reading pixel data in local files. Please read 'SECURITY_ERROR_README.txt' included with the EaselJS for details");
                }*/

    //if( (! target) && (mouseTarget) ) {
    if(mouseTarget) {
        //alert("onMouseUp");
        // cache the vector data to a saved canvas, so we don't have to render it each tick:
        //var lineShape = mapLineShape[mouseTarget.id];
        //lineShape.cache(-800,-800,2000,2000);

        onMouseOut(e);
    }
}

// scale Display Objects on mouseOver / Out:
/*function onMouseOver(target){
                //target.scaleX = target.scaleY = target.scale * 1.1;
                target.mouseOver();
            }

            function onMouseOut(target){
                //target.scaleX = target.scaleY = target.scale;
                target.mouseOut();
            }*/

function onMouseOver(e) {
    if(!e){
        e = window.event;
    }
    //alert("onMouseOver");
    if(!dragStarted) {

        try {
            // this will return the top-most display object under the mouse position:
            var object = stage.getObjectUnderPoint(e.stageX, e.stageY);
                        
        } catch (exception) {
            //Ticker.removeListener(window);
            //alert("An error occurred because this browser does not support reading pixel data in local files. Please read 'SECURITY_ERROR_README.txt' included with the EaselJS for details");
        }

        if( (object) && (object.parent.isActive) ) {
            mouseTarget = object.parent;
            mouseTarget.mouseOver();
        }
    }
}

function onMouseOut(e) {
    if(!e){
        e = window.event;
    }
                
    // My onMouseOut event...
    // if we were dragging, but are not anymore, call mouseOut with the old target:
    /*if(show) {
                alert(dragStarted);
                }*/
    if(!dragStarted && mouseTarget) {
        mouseTarget.mouseOut();
        mouseTarget = null;

        //var array = mapPositions[mouseTarget.id];
        //alert(mouseTarget.positions.join("+"));
        //alert("onMouseOut");
    }
                
}
            
            
/**********************************
            /** HTML TAGS - JAVASCRIPT HANDLERS
 **********************************/
            
function PlayButtonHandler() {  
    //alert(isDead);
    var img_button = document.getElementById("img_play");

    if(isDead) {
        handleClick();
        img_button.src = "img/audio/pause.png";
        img_button.title = "Pause";
                    
    } else if(Ticker.getPaused()) {
        Ticker.setPaused(false);
        img_button.src = "img/audio/pause.png";
        img_button.title = "Pause";
                    
    } else if(! Ticker.getPaused()) {
        Ticker.setPaused(true);
        img_button.src = "img/audio/play.png";
        img_button.title = "Play";
    }
}
            
function AudioButtonHandler() {  
    //alert(isDead);
    var img_button = document.getElementById("img_audio");

    // Stop or enable audio by changing audio flag
    audio_playing = !audio_playing;
                
    if(audio_playing) {
        img_button.src = "img/audio/audio_on.png";
        img_button.title = "Audio enabled";
                    
        audio.play();
                    
    } else {
        img_button.src = "img/audio/audio_off.png";
        img_button.title = "Audio disable";
                    
        audio.pause();
    }
}
            
function AudioEffectsButtonHandler() {  
    //alert(isDead);
    var control = document.getElementById("audio_effects");

    //alert("AudioEffectsButtonHandler");
    // Stop or enable audio by changing audio flag
    audio_effects_enabled = control.checked;
}
            
function ChangeSpeedButtonHandler() {  
    //alert(isDead);
                
    var img_button = document.getElementById("img_speed");
                
    //Ticker.setInterval(75); // Default is 50...
    if(Ticker.getInterval() == 50) {
        img_button.src = "img/audio/rewind.png";
        img_button.title = "Decrease Speed";
                    
        Ticker.setInterval(25); // Default is 50...
                    
    } else {
        img_button.src = "img/audio/forward.png";
        img_button.title = "Increase Speed";
                    
        Ticker.setInterval(50); // Default is 50...
    }
}