(function(window) {

    //
    function AirPlane(type, beforeActiveCounter, max_x, max_y) {
        //alert("Estou a inicializar o air plane");
        this.initialize(type, beforeActiveCounter, max_x, max_y);
    }

    var p = AirPlane.prototype = new Container();


// static properties:
    // air plane types
    AirPlane.FIGHTER = 1;
    AirPlane.FIGHTER_VEL = 2;

    AirPlane.FIGHTER_IMAGE_RED = new Image();
    AirPlane.FIGHTER_IMAGE_RED.src = "img/airplanes/fighter_red.png";
    AirPlane.FIGHTER_IMAGE_BLUE = new Image();
    AirPlane.FIGHTER_IMAGE_BLUE.src = "img/airplanes/fighter_blue.png";
    AirPlane.FIGHTER_IMAGE_GREEN = new Image();
    AirPlane.FIGHTER_IMAGE_GREEN.src = "img/airplanes/fighter_green.png";
    AirPlane.FIGHTER_IMAGE_WHITE = new Image();
    AirPlane.FIGHTER_IMAGE_WHITE.src = "img/airplanes/fighter_white.png";
    AirPlane.FIGHTER_IMAGE_BLACK = new Image();
    AirPlane.FIGHTER_IMAGE_BLACK.src = "img/airplanes/fighter_black.png";
    AirPlane.FIGHTER_IMAGE_EXPLODE = new Image();
    AirPlane.FIGHTER_IMAGE_EXPLODE.src = "img/airplanes/fighter_explode.png";

    AirPlane.FIGHTER_HIT = 16;


    AirPlane.BOMBER = 2;
    AirPlane.BOMBER_VEL = 1;

    AirPlane.BOMBER_IMAGE_RED = new Image();
    AirPlane.BOMBER_IMAGE_RED.src = "img/airplanes/bomber_red.png";
    AirPlane.BOMBER_IMAGE_BLUE = new Image();
    AirPlane.BOMBER_IMAGE_BLUE.src = "img/airplanes/bomber_blue.png";
    AirPlane.BOMBER_IMAGE_GREEN = new Image();
    AirPlane.BOMBER_IMAGE_GREEN.src = "img/airplanes/bomber_green.png";
    AirPlane.BOMBER_IMAGE_WHITE = new Image();
    AirPlane.BOMBER_IMAGE_WHITE.src = "img/airplanes/bomber_white.png";
    AirPlane.BOMBER_IMAGE_BLACK = new Image();
    AirPlane.BOMBER_IMAGE_BLACK.src = "img/airplanes/bomber_black.png";
    AirPlane.BOMBER_IMAGE_EXPLODE = new Image();
    AirPlane.BOMBER_IMAGE_EXPLODE.src = "img/airplanes/bomber_explode.png";

    AirPlane.BOMBER_HIT = 16;
    
    
    AirPlane.HELICOPTER = 3;
    AirPlane.HELICOPTER_VEL = 1;

    AirPlane.HELICOPTER_IMAGE_RED = new Image();
    AirPlane.HELICOPTER_IMAGE_RED.src = "img/airplanes/helicopter_red.png";
    AirPlane.HELICOPTER_IMAGE_BLUE = new Image();
    AirPlane.HELICOPTER_IMAGE_BLUE.src = "img/airplanes/helicopter_blue.png";
    AirPlane.HELICOPTER_IMAGE_GREEN = new Image();
    AirPlane.HELICOPTER_IMAGE_GREEN.src = "img/airplanes/helicopter_green.png";
    AirPlane.HELICOPTER_IMAGE_WHITE = new Image();
    AirPlane.HELICOPTER_IMAGE_WHITE.src = "img/airplanes/helicopter_white.png";
    AirPlane.HELICOPTER_IMAGE_BLACK = new Image();
    AirPlane.HELICOPTER_IMAGE_BLACK.src = "img/airplanes/helicopter_black.png";
    AirPlane.HELICOPTER_IMAGE_EXPLODE = new Image();
    AirPlane.HELICOPTER_IMAGE_EXPLODE.src = "img/airplanes/helicopter_explode.png";

    AirPlane.HELICOPTER_HIT = 16;

    // Other static values
    BLINK_TIME = 500;

// public properties:

    p.type; // Air plane type - One of the static values

    p.bitmap; // Image/Icon visible in canvas
    p.bitmapImageBlue;    // State icon - should be loaded at initialization due IE compatibility
    p.bitmapImageRed;    // State icon - should be loaded at initialization due IE compatibility
    p.bitmapImageGreen;    // State icon - should be loaded at initialization due IE compatibility
    p.bitmapImageBlack;    // State icon - should be loaded at initialization due IE compatibility
    p.bitmapImageWhite;    // State icon - should be loaded at initialization due IE compatibility
    p.bitmapImageExplode;    // State icon - should be loaded at initialization due IE compatibility
    p.routeShape;    // Shape used to draw Air Plain route in canvas
    p.routeColor; // random color to draw path
    p.text;

    p.lastWarningShapeRadius = 0;    // Shape used to draw Air Plain route in canvas
    p.warningShape;    // Shape used to draw Air Plain route in canvas

    p.positions; // AirLine route course - array of points


    p.hit;		//average radial disparity

    p.vel;		// AirPlane velocity


    p.isActive = false;         //is it active
    p.isLanding = false;         //it is landing
    p.isAirportRouteTraced = false;         //it is a airport route?!?

    p.isToDelete = false;         //it is a airport route?!?

    p.beforeActiveCounter;	//Start counter before being active, i.e., used for place on the screen
    p.lastVisibleChangeDate;    // Like beforeActiveCounter, it it used to blink/change visibility of bitmap before being active


    // Boundaries used in addRandomRoute
    p.max_x;		// max X
    p.max_y;		// max Y


    
	
    // constructor:
p.Shape_initialize = p.initialize;	//unique to avoid overiding base class
	
    p.initialize = function(type, beforeActiveCounter, max_x, max_y) {
        this.Shape_initialize(); // super call
  
        //this.activate(size);
        this.type = type;
            
        this.max_x = max_x;
        this.max_y = max_y;

        this.name = name;

        // Build Image
        if(this.type == AirPlane.FIGHTER) {
            this.name = "Fighter";
            this.vel = AirPlane.FIGHTER_VEL;

            this.bitmapImageBlue = AirPlane.FIGHTER_IMAGE_BLUE;
            this.bitmapImageRed = AirPlane.FIGHTER_IMAGE_RED;
            this.bitmapImageGreen = AirPlane.FIGHTER_IMAGE_GREEN;
            this.bitmapImageWhite = AirPlane.FIGHTER_IMAGE_WHITE;
            this.bitmapImageBlack = AirPlane.FIGHTER_IMAGE_BLACK;
            this.bitmapImageExplode = AirPlane.FIGHTER_IMAGE_EXPLODE;

            // Hit depends of air plane icon size.. but since all of them has the same size...
            this.hit = AirPlane.FIGHTER_HIT; // 48 pixel image icon
            //this.hit *= 1.1; //pad a bit
            
        } else if(this.type == AirPlane.BOMBER) {
            this.name = "Bomber";
            this.vel = AirPlane.BOMBER_VEL;

            this.bitmapImageBlue = AirPlane.BOMBER_IMAGE_BLUE;
            this.bitmapImageRed = AirPlane.BOMBER_IMAGE_RED;
            this.bitmapImageGreen = AirPlane.BOMBER_IMAGE_GREEN;
            this.bitmapImageWhite = AirPlane.BOMBER_IMAGE_WHITE;
            this.bitmapImageBlack = AirPlane.BOMBER_IMAGE_BLACK;
            this.bitmapImageExplode = AirPlane.BOMBER_IMAGE_EXPLODE;

            // Hit depends of air plane icon size.. but since all of them has the same size...
            this.hit = AirPlane.BOMBER_HIT; // 48 pixel image icon
            //this.hit *= 1.1; //pad a bit
            
        } else if(this.type == AirPlane.HELICOPTER) {
            this.name = "Helicopter";
            this.vel = AirPlane.HELICOPTER_VEL;

            this.bitmapImageBlue = AirPlane.HELICOPTER_IMAGE_BLUE;
            this.bitmapImageRed = AirPlane.HELICOPTER_IMAGE_RED;
            this.bitmapImageGreen = AirPlane.HELICOPTER_IMAGE_GREEN;
            this.bitmapImageWhite = AirPlane.HELICOPTER_IMAGE_WHITE;
            this.bitmapImageBlack = AirPlane.HELICOPTER_IMAGE_BLACK;
            this.bitmapImageExplode = AirPlane.HELICOPTER_IMAGE_EXPLODE;

            // Hit depends of air plane icon size.. but since all of them has the same size...
            this.hit = AirPlane.HELICOPTER_HIT; // 48 pixel image icon
            //this.hit *= 1.1; //pad a bit
        }


        this.bitmap = new Bitmap(this.bitmapImageRed);
        //this.bitmap.image.src = this.bitmapImageRed;
        this.bitmap.name = name;
        //this.setPosition(0,0);

        //this.bitmap.rotation = 360 * Math.random()|0;
        
        /*this.bitmap.regX = this.bitmap.image.width/2|0;
        this.bitmap.regY = this.bitmap.image.height/2|0;*/
        this.bitmap.regX = 16;
        this.bitmap.regY = 16;

        this.bitmap.scaleX = this.bitmap.scaleY = this.bitmap.scale = 1;//Math.random()+0.6;


        // Build Shape used to draw air plane route
        this.routeShape = new Shape();

        this.text = new Text(this.name, "bold 12px Arial", "#FF0000");
        this.text.visible = false;

        // Add Display object to the container
        this.addChild(this.bitmap);
        this.addChild(this.routeShape);
        this.addChild(this.text);

        this.warningShape = new Shape();
        this.addChild(this.warningShape);

        // Other initializations
        //this.routeColor = Graphics.getRGB(100,100,100);
        var random = Math.random() * 360;
        this.routeColor = Graphics.getHSL(
			random,
			100,//Math.round(Math.random() * 40),
			50,
			1);

        // Empty array at biginning
        this.positions = new Array();

        this.isActive = false;
        //this.bitmap.alpha = 0.5;
        this.beforeActiveCounter = beforeActiveCounter;
        this.lastVisibleChangeDate = new Date();
        //alert(this.lastVisibleChangeTime);
    }


// public methods:

    /* Mouse Events methods */
    // Must be Game Engine Call it because not all mouseOver events under a bitmap
    // should be process...
    p.mouseOver = function() {
        this.bitmap.scaleX = this.bitmap.scaleY = this.bitmap.scale * 1.4;
        this.text.visible = true;
    }
	
    p.mouseOut = function() {
        this.bitmap.scaleX = this.bitmap.scaleY = this.bitmap.scale;
        this.text.visible = false;
    }


    p.setPosition = function(x, y) {
        this.bitmap.x = x;
        this.bitmap.y = y;

        this.text.x = x;
        this.text.y = y;
    }

    /* Route methods */
    p.addRoutePoint = function(x, y) {
        this.positions.push(new Point(x, y));
    }

    p.clearRoute = function() {
        this.routeShape.graphics.clear();
        this.positions.length = 0; //= new Array();
    }
    
    p.getLastPositions = function(nLastPoints) {
        var tempArray = new Array();
         
        if(this.positions.length < nLastPoints) {
            return tempArray;
        }
         
        
        /*var nextPosition;
        for(var i=0; i < nLastPoints; i++) {
            nextPosition = this.positions.pop();
            tempArray.push(nextPosition);                   
        }
        
        for(i=0; i < nLastPoints; i++) {
            nextPosition = tempArray.pop();
            this.positions.push(new Point(nextPosition.x, nextPosition.y));                   
        }       
        tempArray.reverse();*/
         
        tempArray = this.positions.slice(-nLastPoints);

        return tempArray;
    }
    
    p.addRandomRoute = function() {
        // 1. another way to do the same
        var randomX = Math.round((this.max_x-200) * Math.random());
        var randomY = Math.round((this.max_y-200) * Math.random());
        
        if(randomX < 200) {
            randomX = 200;
        }
        
        if(randomY < 200) {
            randomY = 200;
        }
        
        // 2. another way to do the same
        /*var randomX = Math.round(Math.random());
        if(randomX == 0) {
            randomX = 200;
        } else {
            randomX = this.max_x - 200;
        }
        
        var randomY = Math.round(Math.random());
        if(randomY == 0) {
            randomY = 200;
        } else {
            randomY = this.max_y - 200;
        }*/

        // found an intermediate point ...
        // used to draw a more soft route
        x3 = Math.round((this.bitmap.x + randomX) / 2);
        y3 = Math.round((this.bitmap.y + randomY) / 2);

        //alert('New Random Position for the target: (' + target.toString() + ') position. X:' + randomX + ' Y:' + randomY);

        this.addRoutePoint(x3, y3);
        this.addRoutePoint(randomX, randomY);

        this.setAirportRouteTraced(false);
    }

    p.drawRoute = function(startX, startY, endX, endY) {
        // set up our drawing properties:
        //lineGraphics.setStrokeStyle(Math.random()*20+2,"round").beginStroke(color);
        this.routeShape.graphics.setStrokeStyle(3,"round","round").beginStroke(this.routeColor);

        // start the line at the last position:
        this.routeShape.graphics.moveTo(startX,startY);
            
        // draw the line, and close the path:
        this.routeShape.graphics.lineTo(endX,endY);
    }


    //handle what a air plane does to itself every frame
    p.move = function() {
        if( (!this.isActive) && (this.beforeActiveCounter > 0) ) {
            //this.bitmap.visible = !this.bitmap.visible;

            var curTime = new Date();

            if(curTime.getTime() - this.lastVisibleChangeDate.getTime() > BLINK_TIME) {
                this.bitmap.visible = !this.bitmap.visible;
                this.lastVisibleChangeDate = curTime;
            }
            
            //this.bitmap.scaleX = this.bitmap.scaleY = this.bitmap.scale * 0.5;
            /*if(this.bitmap.scaleX == this.bitmap.scale) {
                this.bitmap.scaleX = this.bitmap.scaleY = this.bitmap.scale * 0.5;
            } else {
                this.bitmap.scaleX = this.bitmap.scaleY = this.bitmap.scale;
            }*/

            this.beforeActiveCounter--;            
            return;

        } else if( (! this.isActive) && (! this.isLanding) ) {
            // it is now active
            this.bitmap.visible = true;
            this.bitmap.alpha = 1;
            this.bitmap.image = this.bitmapImageBlack;
            this.isActive = true;
        }

        
        // 1. Add a random route if necessary
        if(this.positions.length <= 0) {
            if(! this.isLanding) {
                this.clearRoute();

                this.addRandomRoute();
                //alert('New Random Position for the target: (' + target.toString() + ') position. X:' + randomX + ' Y:' + randomY);
            } else {
                this.isToDelete = true;
                return;
            }
        }

        // 2. Move airplane to the next route point
        var i = 0;
        while(i < this.vel) {
            //target.x = nextPosition.x;
            //target.y = nextPosition.y;
            var nextPosition = this.positions.shift();

            if(!nextPosition) {
                break;
            }

    //        var oldX = this.bitmap.x;
    //        var oldY = this.bitmap.y;

            //alert("Old Target x:" + target.x + "Old Target y:" + target.y);
            if(nextPosition.x > this.bitmap.x) {
                this.bitmap.x = this.bitmap.x + 1;
            } else if(nextPosition.x < this.bitmap.x) {
                this.bitmap.x = this.bitmap.x - 1;
            }

            if(nextPosition.y > this.bitmap.y) {
                this.bitmap.y = this.bitmap.y + 1;
            } else if(nextPosition.y < this.bitmap.y) {
                this.bitmap.y = this.bitmap.y - 1;
            }

            // update text position too
            this.setPosition(this.bitmap.x, this.bitmap.y);

            //alert("New Target x:" + target.x + "New Target y:" + target.y);
            if( (this.bitmap.x != nextPosition.x) || (this.bitmap.y != nextPosition.y) ) {
                this.positions.unshift(nextPosition);
            }

            // 3. compute rotation
            //Suppose you're at (a, b) and the object is at (c, d). Then the relative position of the object to you is (x, y) = (c - a, d - b).
            // (x, y) = (c - a, d - b).
            xDiff = nextPosition.x - this.bitmap.x;
            yDiff = nextPosition.y - this.bitmap.y;

            // Another way to this.. but doesn´t work well
            //Then you could use the Math.atan2() function to get the angle in radians.
            /*var theta = Math.atan2(yDiff, xDiff);
            //note that the result is in the range [-π, π]. If you need nonnegative numbers, you have to add
            if (theta < 0) {
                theta += 2 * Math.PI;
            }

            // convert radians to degrees, multiply by 180 / Math.PI.
            var angle = theta * 180 / Math.PI;
            this.bitmap.rotation = angle;*/

            var nextRotationValue = 0;

            if(xDiff > 0) {
                nextRotationValue = 90;
            } else if(xDiff < 0) {
                nextRotationValue = 270;
            }

            if(yDiff > 0) {
                if(nextRotationValue == 90) {
                    nextRotationValue = 135; // 90 + 45
                } else if(nextRotationValue == 270) {
                    nextRotationValue = 225; // 270 - 45
                } else { //this.bitmap.rotation == 0
                    nextRotationValue = 180;
                }
            } else if(yDiff < 0) {
                if(nextRotationValue == 90) {
                    nextRotationValue = 45; // 90 + 45
                } else if(nextRotationValue == 270) {
                    nextRotationValuen = 315; // 270 + 45
                } else {
                    nextRotationValue = 0;
                }
            }

            // Ajust rotation by soft moves
            if(nextRotationValue > this.bitmap.rotation) {
                if(nextRotationValue - this.bitmap.rotation < 180) {
                    this.bitmap.rotation = this.bitmap.rotation + 2;
                } else {
                    this.bitmap.rotation = this.bitmap.rotation - 2;
                }

            } else if(nextRotationValue < this.bitmap.rotation) {
                if(this.bitmap.rotation - nextRotationValue < 180) {
                    this.bitmap.rotation = this.bitmap.rotation - 2;
                } else {
                    this.bitmap.rotation = this.bitmap.rotation + 2;
                }
                //this.bitmap.rotation = this.bitmap.rotation - 1;
            }

            if(this.bitmap.rotation < 0) {
                this.bitmap.rotation = this.bitmap.rotation + 360;
            } else if(this.bitmap.rotation > 360) {
                this.bitmap.rotation = this.bitmap.rotation - 360;
            }

            i++;
        }


        

    }
	
    p.hitPoint = function(tX, tY) {
        return this.hitRadius(tX, tY, 0);
    }
	
    p.hitRadius = function(tX, tY, tHit) {
        //early returns speed it up
        if(tX - tHit > this.bitmap.x + this.hit) {
            return false;
        }
        if(tX + tHit < this.bitmap.x - this.hit) {
            return false;
        }
        if(tY - tHit > this.bitmap.y + this.hit) {
            return false;
        }
        if(tY + tHit < this.bitmap.y - this.hit) {
            return false;
        }

        //alert((this.hit + tHit) + " > " + (Math.sqrt(Math.pow(Math.abs(this.bitmap.x - tX),2) + Math.pow(Math.abs(this.bitmap.y - tY),2))));
        //now do the circle distance test
        return this.hit + tHit > Math.sqrt(Math.pow(Math.abs(this.bitmap.x - tX),2) + Math.pow(Math.abs(this.bitmap.y - tY),2));
    }


    p.hitRectangle = function(rectangle) {
        return hitRectangle(this.bitmap.x, this.bitmap.y, rectangle);
        /*if( (rectangle.x <= this.bitmap.x) && (this.bitmap.x <= rectangle.x + rectangle.width) &&
            (rectangle.y <= this.bitmap.y) && (this.bitmap.y <= rectangle.y + rectangle.height) ) {

            return true;
        }

        return false;*/
    }

    /*p.hitArea2 = function(x, y, rectangle) {
        if( (rectangle.x <= x) && (x <= rectangle.x + rectangle.width) && 
            (rectangle.y <= y) && (y <= rectangle.y + rectangle.height) ) {
            
            return true;
        }
        
        return false;
    }

    p.hitArea = function(rectangle) {
        var myRect = this.getCurrentBounds(1);

        if(this.hitArea2(myRect.x, myRect.y, rectangle)) {
            return true;
        }

        if(this.hitArea2(myRect.x + myRect.width, myRect.y, rectangle)) {
            return true;
        }

        if(this.hitArea2(myRect.x, myRect.y + myRect.height, rectangle)) {
            return true;
        }

        if(this.hitArea2(myRect.x + myRect.width, myRect.y + myRect.height, rectangle)) {
            return true;
        }

        return false;
    }

    p.getCurrentBounds = function(resizeFactor) {
        // Obtain Bounds - 32 pixel image/icon
        var bounds = new Rectangle(this.bitmap.x - (16 * resizeFactor), this.bitmap.y - (16 * resizeFactor),
                                    this.bitmap.x + (16 * resizeFactor), this.bitmap.y + (16 * resizeFactor));

        // check if bounds are inside of canvas
        if(bounds.x < 0) {
            bounds.x = 0;
        }

        if(bounds.x + bounds.width > this.max_x) {
            bounds.width = this.max_x - bounds.x;
        }

        if(bounds.y < 0) {
            bounds.y = 0;
        }

        if(bounds.y + bounds.height > this.max_y) {
            bounds.y = this.max_y - bounds.y;
        }

        return bounds;
    }*/

    p.land = function(landingPositions) {
        //alert("Landing positions array is:" + landingPositions);
        this.isActive = false;

        this.warningShape.graphics.clear();
        this.lastWarningShapeRadius = this.hit;

        this.isLanding = true;
        this.vel = 1;

        this.bitmap.scaleX = this.bitmap.scaleY = this.bitmap.scale = 0.5;
        this.bitmap.image = this.bitmapImageWhite;

        this.clearRoute();
        for(index in landingPositions) {
            var p = landingPositions[index];
            //alert("Land positions are:" + p.x + "," + p.y);
            this.addRoutePoint(p.x, p.y);
        }
    }

    p.setAirportRouteTraced = function(flag) {
        
        if(this.isAirportRouteTraced != flag) {
            //alert("setAirportRouteTraced: Value-" + flag);
            this.isAirportRouteTraced = flag;

            if(this.bitmap.image != this.bitmapImageRed) {
                if(this.isAirportRouteTraced) {
                    this.bitmap.image = this.bitmapImageGreen;

                } else {
                    this.bitmap.image = this.bitmapImageBlack;
                }

            }
        }

    }

    p.changeToWarningMode = function(maxRadius) {
        this.bitmap.image = this.bitmapImageRed;

        this.warningShape.graphics.clear();
        
        this.lastWarningShapeRadius += 2;
        if(this.lastWarningShapeRadius > maxRadius) {
            this.lastWarningShapeRadius = this.hit;
        }

        this.warningShape.graphics.setStrokeStyle(1).beginStroke("#FF0000"); //#C0C0C0
	//this.warningShape.graphics.beginRadialGradientFill(["#FF0","#00F"],[0,1],this.bitmap.x,this.bitmap.y,0,this.bitmap.x,this.bitmap.y,40);
	this.warningShape.graphics.drawCircle(this.bitmap.x,this.bitmap.y,this.lastWarningShapeRadius);
    }

    p.changeToNormalMode = function() {
        if(this.bitmap.image == this.bitmapImageRed) {
            if(this.isLanding || this.isAirportRouteTraced) {
                this.bitmap.image = this.bitmapImageGreen;
            } else {
                this.bitmap.image = this.bitmapImageBlack;
            }

            this.warningShape.graphics.clear();
            this.lastWarningShapeRadius = this.hit;
        }
    }
    
    p.explode = function() {
        this.bitmap.image = this.bitmapImageExplode;
    }

    window.AirPlane = AirPlane;
}(window));