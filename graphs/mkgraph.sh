#!/bin/bash

gnuplot "/Library/WebServer/Documents/alignminer/tmpdata/$2/graphs/$1.gnuplot"
logger "/Library/WebServer/Documents/alignminer/tmpdata/$2/graphs/$1.gnuplot";
open "/Library/WebServer/Documents/alignminer/tmpdata/$2/graphs/$1.png"
