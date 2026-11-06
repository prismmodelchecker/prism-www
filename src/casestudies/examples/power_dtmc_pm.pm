// POWER MANAGER 

module PM
	
	pm  :  [0..4]; 
	// 0 - go to active 
	// 1 - go to idle 
	// 2 - go to idlelp 
	// 3 - go to stby  
	// 4 - go to sleep 
	
	[tick1] cond1 -> p01 : (pm'=0) + p11 : (pm'=1) + p21 : (pm'=2) + p31 : (pm'=3) + p41 : (pm'=4);
	[tick1] cond2 -> p02 : (pm'=0) + p12 : (pm'=1) + p22 : (pm'=2) + p32 : (pm'=3) + p42 : (pm'=4);
	[tick1] cond3 -> p02 : (pm'=0) + p13 : (pm'=1) + p23 : (pm'=2) + p33 : (pm'=3) + p43 : (pm'=4);

endmodule
