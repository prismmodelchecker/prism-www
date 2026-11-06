dtmc

// Max size of service request queue
const int QMAX = 10;

//-------------------------------------------------------------------------

// Service Requester (SR)

module SR

	sr : [0..1] init 0;
	// 0 idle
	// 1 1req
	
	[tick] sr=0 -> 0.898: (sr'=0) + 0.102: (sr'=1);
	[tick] sr=1 -> 0.454: (sr'=0) + 0.546: (sr'=1);

endmodule

//-------------------------------------------------------------------------

// Service Queue (SQ)

module SQ

	q : [0..QMAX] init 0;
	
	// request removed by SP if it is active
	[tick] sr=0 & sp=0 -> (q'=max(q-1,0));
	[tick] sr=1 & sp=0 -> (q'=q);
	
	// otherwise do nothing
	[tick] sr=0 & sp>0 -> (q'=q);
	[tick] sr=1 & sp>0 & q<QMAX -> (q'=q+1);
	[tick] sr=1 & sp>0 & q=QMAX -> (q'=q);

endmodule

//-------------------------------------------------------------------------

// Service Provider (SP) (Disk drive)

module SP 

	sp : [0..1] init 1;
	// 0 active
	// 1 idle
	
endmodule

//-------------------------------------------------------------------------

// Labels:

label "queue_full" = (q=QMAX);
label "queue_empty" = (q=0);

// Reward structures:

rewards "time"
	[tick] true : 1;
endrewards

rewards "queue"
	true : q;
endrewards

