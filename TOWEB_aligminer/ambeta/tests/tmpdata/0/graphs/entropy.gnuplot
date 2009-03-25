set term png size 2500,400
set key right top outside
set output "/srv/www/htdocs/alignminer/tmpdata/1210697813344/graphs/entropy.png"
set xlabel "Position" 
set ylabel "Entropy" 
plot  "/srv/www/htdocs/alignminer/tmpdata/1210697813344/data/entropy.data" using 1:2 title 'entropy' with lines lc rgb "red" , -0.116887092690413 title 'Lim 1' with lines lw 2 lc rgb "dark-red" , 0.116887092690413 title 'Lim 2' with lines lw 2 lc rgb "dark-red" , "/srv/www/htdocs/alignminer/tmpdata/1210697813344/data/entropyfft.data" using 1:2 title 'entropyfft' with lines lc rgb "green" , -0.0104561370811184 title 'Lim 1 FFT' with lines lw 2 lc rgb "dark-green" , 0.0104561370811184 title 'Lim 2 FFT' with lines lw 2 lc rgb "dark-green"
quit
