// Power Manager (PM)

module PM

	pm : [0..4] init 1;
	// 0 - go to active 
	// 1 - go to idle 
	// 2 - go to idlelp 
	// 3 - go to stby  
	// 4 - go to sleep 
	
	// Only go to active when queue is full
	[choose] q=QMAX -> (pm'=0);
	[choose] q<QMAX -> (pm'=1);
	
	[tick] true -> (pm'=pm);
	
endmodule

//-------------------------------------------------------------------------

// Scheduler

module sched

	turn : [0..1];

	[choose] turn=0 -> (turn'=1);
	[tick] turn=1 -> (turn'=0);
	
endmodule

