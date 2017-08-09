<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of Score
 *
 * @author ruipedrosa
 */
class Score {
    //put your code here

    private $name = ""; 
    private $score = 0;
    private $datetime = 0;
    private $country = "Unknow";
    
    /**
     *
     * @param type $name
     * @param type $score
     * @param type $datetime
     * @param type $country 
     */
    public function Score($name, $score, $datetime, $country = "Unknow") {
        $this->name = $name;
        $this->score = intval($score);
        $this->datetime = $datetime;
        $this->country = $country;
    }

    public function getName() {
        return $this->name;
    }
    
    public function getScore() {
        return $this->score;
    }
    
    public function getDateTime() {
        return $this->datetime;
    }
    
    public function getCountry() {
        return $this->country;
    }

}

?>
