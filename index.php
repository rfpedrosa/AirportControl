<?php 
    require(dirname(__FILE__) . '/model/Scores.php');
    //chdir(dirname(__FILE__));
    
    $scores = Scores::getScores();
    //var_dump($scores);
?>

<!DOCTYPE html>
<html lang="en">
    <head>
        <meta content="text/html; charset=UTF-8">
        <title>Airport Control</title>

        <link rel="shortcut icon" href="img/favicon.ico"/>
        
        <link rel="stylesheet" href="css/styles.css"/>
        <link rel="stylesheet" href="css/tooltip.css"/>
       
        <script type="text/javascript">  
            var tooltip=function(){
                var id = 'tt';
                var top = 3;
                var left = 3;
                var maxw = 600;
                var speed = 10;
                var timer = 20;
                var endalpha = 95;
                var alpha = 0;
                var tt,t,c,b,h;
                var ie = document.all ? true : false;
                return{
                    show:function(v,w){
                        if(tt == null){
                            tt = document.createElement('div');
                            tt.setAttribute('id',id);
                            t = document.createElement('div');
                            t.setAttribute('id',id + 'top');
                            c = document.createElement('div');
                            c.setAttribute('id',id + 'cont');
                            b = document.createElement('div');
                            b.setAttribute('id',id + 'bot');
                            tt.appendChild(t);
                            tt.appendChild(c);
                            tt.appendChild(b);
                            document.body.appendChild(tt);
                            tt.style.opacity = 0;
                            tt.style.filter = 'alpha(opacity=0)';
                            document.onmousemove = this.pos;
                        }
                        tt.style.display = 'block';
                        c.innerHTML = v;
                        tt.style.width = w ? w + 'px' : 'auto';
                        if(!w && ie){
                            t.style.display = 'none';
                            b.style.display = 'none';
                            tt.style.width = tt.offsetWidth;
                            t.style.display = 'block';
                            b.style.display = 'block';
                        }
                        if(tt.offsetWidth > maxw){tt.style.width = maxw + 'px'}
                        h = parseInt(tt.offsetHeight) + top;
                        clearInterval(tt.timer);
                        tt.timer = setInterval(function(){tooltip.fade(1)},timer);
                    },
                    pos:function(e){
                        var u = ie ? event.clientY + document.documentElement.scrollTop : e.pageY;
                        var l = ie ? event.clientX + document.documentElement.scrollLeft : e.pageX;
                        tt.style.top = (u - h) + 'px';
                        tt.style.left = (l + left) + 'px';
                    },
                    fade:function(d){
                        var a = alpha;
                        if((a != endalpha && d == 1) || (a != 0 && d == -1)){
                            var i = speed;
                            if(endalpha - a < speed && d == 1){
                                i = endalpha - a;
                            }else if(alpha < speed && d == -1){
                                i = a;
                            }
                            alpha = a + (i * d);
                            tt.style.opacity = alpha * .01;
                            tt.style.filter = 'alpha(opacity=' + alpha + ')';
                        }else{
                            clearInterval(tt.timer);
                            if(d == -1){tt.style.display = 'none'}
                        }
                    },
                    hide:function(){
                        clearInterval(tt.timer);
                        tt.timer = setInterval(function(){tooltip.fade(-1)},timer);
                    }
                };
            }();
        </script>

        <script type="text/javascript">  
            function drawScoreTable() { 
                
                var shape = new Shape();
                shape.graphics.setStrokeStyle(3,"round","round").beginStroke(Graphics.getRGB(0,0,255,1));
                shape.graphics.rect(canvas.width / 2 + 175,canvas.height / 2 - 200, 250, 450);

                var titleField = new Text("HIGH SCORES", "bold 24px Arial", "#0000ff");
                titleField.textAlign = "center";
                titleField.x = canvas.width / 2 + 175 + 125;
                titleField.y = canvas.height / 2 - 200 + 30;
                stage.addChild(titleField);

                shape.graphics.moveTo(canvas.width / 2 + 175, canvas.height / 2 - 200 + 50);
                shape.graphics.lineTo(canvas.width / 2 + 175 + 250, canvas.height / 2 - 200 + 50);
                
                lastY = canvas.height / 2 - 200 + 50;
                <?php
                    $i = 1;
                    foreach ($scores as $value) {?>
                            
                        shape.graphics.moveTo(canvas.width / 2 + 175, lastY + 40);
                        shape.graphics.lineTo(canvas.width / 2 + 175 + 250, lastY + 40);                       
                        
                        var userScoreField = new Text("", "16px Arial", "#000000");
                        if(<?php echo $i; ?> < 10) {
                            userScoreField.text = '<?php echo "    " . $i . ": " . date("d-m-Y",$value->getDateTime()) . " , " . $value->getScore() . " , " . $value->getName();?>';
                        } else {
                            userScoreField.text = '<?php echo "  " . $i . ": " . date("d-m-Y",$value->getDateTime()) . " , " . $value->getScore() . " , " . $value->getName();?>';
                        }
                        
                        userScoreField.textAlign = "left";
                        userScoreField.x = canvas.width / 2 + 55 + 125;
                        userScoreField.y = lastY + 25;
                        stage.addChild(userScoreField);
                
                        lastY += 40;
                        
                        <?php  
                        $i++;
                    }
                ?>
                

                stage.addChild(shape);
            }
            
            function publish_Results(score) {
                <?php     
                    //echo count($scores);
                    $len = count($scores);
                    if($len > 0) {
                        /* @var $lowerScoreObj Score */
                        $lowerScoreObj = end($scores);
                        $lowerScore = $lowerScoreObj->getScore();
                    } else {
                        $lowerScore = 0;
                    }
                    
                ?>
                
                if(score > <?php echo $lowerScore; ?>) {
                    
                    var name = prompt("GREAT!! You are on the top 10! Do you want to publish your results?", "Type your name here (less than 10 chars)");
                    if(!name) {
                        return;
                    }
                    
                    if(name.length > 10) {
                        name = name.substr(0, 9);
                    }
                    
                    /*if(name.indexOf('.') != -1) {
                        name = 
                    }*/
                            
                    name = name.replace(',', ' ');
                    
                    
                    //alert("Your name is: "+name);

                    // Save score on the server
                    var params = new Object();
                    params["name"] = name;
                    params["score"] = score;
                    params["country"] = "unknow";

                    post_to_url("controller/AddScore.php", params, "post");

                    /*$.get(
                        "controller/AddScore.php",
                        {
                            name : "rfp", 
                            score : score,
                            country : "unknow"
                        },
                        function(data) {
                            alert('page content: ' + data);
                        }
                        );*/
                }
                
                
            }
        </script>
        
        
        <script src="javascript/easel.js" type="text/javascript"></script>
        
        <script src="javascript/utils_min.js" type="text/javascript"></script>
        <script src="javascript/AirPlane_min.js" type="text/javascript"></script>
        <script src="javascript/game_min.js" type="text/javascript"></script>
        
    </head>
    
    
    <!--<body onload="init();tooltip.show('<p>#DevUnplugged contest winners were announced!</p><p>Unfortunately, the finalist Airport Control doesn`t win a prize... :|</p><p>THANK YOU ALL for voting and keep playing...!</p><br><p>Important note: I made some changes on the game engine in order to add more randomness and improve the gameplay. The amazing scores by saLo, Golem CZE & PSV will be kept but now easier to beat (sorry guys!)</p>', 400);" style="background-image:url('img/bg.gif');"> -->
    <body onload="init();" style="background-image:url('img/bg.gif');">
    
        <div class="body">
            <div class="header">               
                <?php include("common/header.php"); ?>               
            </div>
            
            <div class="canvas_container" onClick="tooltip.hide();">
                <canvas id="game_canvas" width="1024" height="600">
                    Your browser does not support the canvas element.
                </canvas>
            </div>
            
            <div class="buttons">
                <table width="100%" border="0">
                    <tr>
                        <td width="300px" align="left">
                            <iframe src="http://www.facebook.com/plugins/like.php?href=http%3A%2F%2Fwww.facebook.com%2Fpages%2FAirport-Control-The-Game%2F144085945664812&amp;send=true&amp;layout=button_count&amp;width=200&amp;show_faces=false&amp;action=like&amp;colorscheme=light&amp;font&amp;height=21" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:200px; height:21px;" allowTransparency="true"></iframe>
                            <!--<div class="button green"><a href="https://microsoft.promo.eprize.com/ie9app/gallery?id=328" target="blank">VOTE!</a></div>-->
                        </td>
                        <td width="224px" align="right">
                            <!--<div id="play_button" class="button green" onClick="handleClick()">Play !</div>-->
                            <a onClick="PlayButtonHandler(); tooltip.hide();"><img id="img_play" src="img/audio/play.png" alt="" title="Start Game"></a>
                            <a onClick="ChangeSpeedButtonHandler()"><img id="img_speed" src="img/audio/forward.png" alt="" title="Increase Speed"></a>
                            <!--<div class="button green" onClick="handleClick()"><img id="img_play" src="img/audio/play.png" alt=""></div>
                            <div class="button blue" onClick="alert('asasa')"><img id="img_forward" src="img/audio/forward.png" alt=""></img></div>-->
                        </td>
                        <td width="488px" height="100%" align="right"> 
                            <input id="audio_effects" type="checkbox" checked="yes" onChange="AudioEffectsButtonHandler()" style="vertical-align: middle; margin: 0px; height: 100%;"><font color="blue">Audio Effects</font></input>
                            
                        </td>
                        <td width="12px" height="100%" align="right">                             
                            <a onClick="AudioButtonHandler()"><img id="img_audio" src="img/audio/audio_on.png" alt="" title="Audio enabled"></a>
                        </td>
                    </tr>
                </table>
            </div>
            
            <div class="footer">
                <?php include("common/footer.php"); ?>
            </div>
        </div>
        
        
        
        
        <audio id="music" loop="loop"> 
            <source src="audio/bg.mp3" /> 
            <source src="audio/bg.ogg" /> 
            Your browser does not support the Audio.
        </audio>
            
        <audio id="alarm"> 
            <source src="audio/alarm.mp3" /> 
            <source src="audio/alarm.ogg" /> 
        </audio>
            
        <audio id="explosion"> 
            <source src="audio/explosion.mp3" /> 
            <source src="audio/explosion.ogg" /> 
        </audio>
        
    </body>
</html>