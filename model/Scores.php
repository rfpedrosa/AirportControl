<?php

require('Score.php');
//require(dirname(__FILE__) . "\\..\\data\\scores\\scores.txt");

$SCORES_FILE = (dirname(__FILE__) . "/../data/scores/scores.txt");

class Scores 
{ 
    
    //private static $SCORES_FILE = "scores.txt";
    
    private static $SCORES_SIZE = 10;
    
    /**
     *  Singleton method (only allow one instance of this class) 
     *  @return object 
     */
    /*public static function getInstance() {
        if (!isset(self::$instance)) {
            // set the default timezone to use. Available since PHP 5.1
            date_default_timezone_set('UTC');
            
            $c = __CLASS__;
            self::$instance = new $c;
        }

        return self::$instance;
    }*/

    // end singleton()
    

    public static function addScore($name, $score, $country) {
        global $SCORES_FILE;
        
        $scores = self::getScores();
        //var_dump($scores);
        
        // code fore doSomething() 
        $handle = fopen($SCORES_FILE, "w+") or die;
        
        $strToWrite = $name . "&" . $score . "&" . time() . "&" . $country . "\n";
        
        $i = 0;
        //$j = 0;
        //$len = count($scores);
        //while( ($strScore = fgets($handle)) && ($i < self::$SCORES_SIZE) ) {
        /* @var $element Score */
        while( ($element = each($scores)) && ($i < self::$SCORES_SIZE) ) {
            //var_dump($element['value']);
            //echo $strScore;
            //echo fgets($file) . "<br />";
            //$strScore = fgets($handle);
            
            //if (strlen($strScore) != 0) {
            //$pieces = explode("&", $scores[$j]);

            if(($strToWrite) && ($element['value']->getScore() < $score)) {
                //echo $strToWrite;
                fwrite($handle, $strToWrite);
                $strToWrite = null;
                $i++;
            }

            //fwrite($handle, $strScore);
            if(($i < self::$SCORES_SIZE)) {
                $strToRewrite = $element['value']->getName() . "&" . $element['value']->getScore() . "&" . $element['value']->getDateTime() . "&" . $element['value']->getCountry() . "\n";
                //echo $strToRewrite;
                fwrite($handle, $strToRewrite);
            }
            
            
                
            /*} else {
                fwrite($handle, $strToWrite);
            }*/

            //$j++;
            $i++;
        }
        
        if( ($strToWrite) && ($i < self::$SCORES_SIZE)) { // 0 entries in the scores file
            fwrite($handle,$strToWrite);
        }
        
        
        fclose($handle);           
    }

    public static function getScores() {
        global $SCORES_FILE;
        
        // code fore doSomething()
        $handle = fopen($SCORES_FILE, "r") or die;
        
        $scores = array();
        
        //Output a line of the file until the end is reached
        while(!feof($handle)) {
            //echo fgets($handle) . "<br />";
            $strScore = fgets($handle); 
            if (strlen($strScore) > 0) {
                //$strScore = fgets($handle);
                $pieces = explode('&', $strScore);
                if(count($pieces) > 3) {
                    $score = new Score($pieces[0], $pieces[1], $pieces[2], $pieces[3]);

                    $scores[] = $score;
                }
            }
        }
        
        fclose($handle); 
        
        /*// sort scores
        function cmp($a, $b) {
            if(!$a) {
               return 1; 
            }
            
            if(!$b) {
               return -1; 
            }
            
            if ($a->score == $b->score) {
                return 0;
            }
            return ($a->score < $b->score) ? -1 : 1;
        }
        
        usort($scores, "cmp");*/

        return $scores;
    }

}

?>
