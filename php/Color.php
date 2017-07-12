<?php

class Color {

    private $red;
    private $green;
    private $blue;

    public function __construct ($string) {

        if (preg_match('/^#?([a-f\d])([a-f\d])([a-f\d])(?:([a-f\d])([a-f\d])([a-f\d]))?$/i', $string, $matches)) {

            $strlen = strlen($string);

            if ($strlen >= 6) {

                $this->red   = intval($matches[1].$matches[2], 16);
                $this->green = intval($matches[3].$matches[4], 16);
                $this->blue  = intval($matches[5].$matches[6], 16);

            } elseif ($strlen <= 4) {

                $this->red   = intval($matches[1], 16);
                $this->green = intval($matches[2], 16);
                $this->blue  = intval($matches[3], 16);

            }

        }

    }

    public function isLight() {
        $a = 1 - ( (0.2 * $this->red) + (0.5 * $this->green) + (0.114 * $this->blue) ) / 255;
        return ($a < 0.5);
    }

}
