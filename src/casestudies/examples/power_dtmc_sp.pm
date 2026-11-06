// SERVICE PROVIDER

module SP 

	sp : [0..10] init 9;
	// 0 active
	// 1 idle
	// 2 active_idlelp
	// 3 idlelp
	// 4 idlelp_active
	// 5 active_stby
	// 6 stby
	// 7 stby_active
	// 8 active_sleep
	// 9 sleep
	// 10 sleep_active
	
	// states where PM has no control (transient states)
	[tick2] sp=2  -> 0.75   : (sp'=2) + 0.25   : (sp'=3);  // active_idlelp
	[tick2] sp=4  -> 0.25   : (sp'=0) + 0.75   : (sp'=4);  // idlelp_active
	[tick2] sp=5  -> 0.995  : (sp'=5) + 0.005  : (sp'=6);  // active_stby
	[tick2] sp=7  -> 0.005  : (sp'=0) + 0.995  : (sp'=7);  // stby_active
	[tick2] sp=8  -> 0.9983 : (sp'=8) + 0.0017 : (sp'=9);  // active_sleep
	[tick2] sp=10 -> 0.0017 : (sp'=0) + 0.9983 : (sp'=10); // sleep_active

	// states where PM has control
	// goto_active
	[tick2] sp=0 & pm=0 -> (sp'=0); // active
	[tick2] sp=1 & pm=0 -> (sp'=0); // idle
	[tick2] sp=3 & pm=0 -> (sp'=4); // idlelp
	[tick2] sp=6 & pm=0 -> (sp'=7); // stby
	[tick2] sp=9 & pm=0 -> (sp'=10); // sleep
	// goto_idle
	[tick2] sp=0 & pm=1 -> (sp'=1); // active
	[tick2] sp=1 & pm=1 -> (sp'=1); // idle
	[tick2] sp=3 & pm=1 -> (sp'=3); // idlelp
	[tick2] sp=6 & pm=1 -> (sp'=6); // stby
	[tick2] sp=9 & pm=1 -> (sp'=9); // sleep
	// goto_idlelp
	[tick2] sp=0 & pm=2 -> (sp'=2); // active
	[tick2] sp=1 & pm=2 -> (sp'=2); // idle
	[tick2] sp=3 & pm=2 -> (sp'=3); // idlelp
	[tick2] sp=6 & pm=2 -> (sp'=6); // stby
	[tick2] sp=9 & pm=2 -> (sp'=9); // sleep
	// goto_stby
	[tick2] sp=0 & pm=3 -> (sp'=5); // active
	[tick2] sp=1 & pm=3 -> (sp'=5); // idle
	[tick2] sp=3 & pm=3 -> (sp'=5); // idlelp
	[tick2] sp=6 & pm=3 -> (sp'=6); // stby
	[tick2] sp=9 & pm=3 -> (sp'=9); // sleep
	// goto_sleep
	[tick2] sp=0 & pm=4 -> (sp'=8); // active
	[tick2] sp=1 & pm=4 -> (sp'=8); // idle
	[tick2] sp=3 & pm=4 -> (sp'=8); // idlelp
	[tick2] sp=6 & pm=4 -> (sp'=8); // stby
	[tick2] sp=9 & pm=4 -> (sp'=9); // sleep
	  
endmodule
