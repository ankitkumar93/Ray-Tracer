------------------------------------------------------------------------------------------------------------------------------
														ReadMe
													  Ankit Kumar
													   akumar18
													 CG Assignment 1
													  Ray Tracing
------------------------------------------------------------------------------------------------------------------------------


1)The obj files cube,cube2,dolphins,al and car are working with the ray tracing code ive written.
2)The time for ray tracing varies for each obj file depending on the number of faces it has. The Cube2 takes around a second, whereas Dolphins take about a minute and half. The time for al came around to be 5 minutes and for car to be about 8 minutes on my system.(for 256x256 window).
3)I have used the new glmatrix library version 2.2.0 available at glmatrix.net.
4)I have cited the references for any other code taken from some reference, such as file reading, as comments following the line of code.
5)The la,ld and ls of the light are taken to be 1,1,1(for all 3 r,g and b) and by default the light is placed at (0,5,0).
6)The filename for the input file is input.obj and the location should be in the folder containing the index.html file.

Extra Credit:
1)I have implemented different window sizes using the windows.txt file. This file currently contains the size as 256x256, i.e. the default window size. The program requires this file and cannot work without it (as the default window size is also stored there).
2)I have implemented multiple light sources using the lights.txt file. This file must be present to run the program as it contains all the needed light sources (even the default one). The lights should be entered as: x y z r g b (only values no alphabets)
Example:0 5 0 1 1 1.

Both the files above should be presented in the folder containing the obj files and index.html.