// BATTERY
module BAT

	bat : [0..1] init 1; // 0 empty, 1 - operational
	
	[] bat=0 -> (bat'=0); // loop when battery empty
	[tick2] bat=1 -> 0.000001 : (bat'=0) + 0.999999 : (bat'=1);

endmodule
