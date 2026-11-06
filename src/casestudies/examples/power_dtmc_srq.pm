// SERVICE REQUEST QUEUE
module SRQ

	q : [0..2] init 0;
	
	[tick2] sr=0 & sp>0 -> true; // do not serve and nothing arrives
	[tick2] sr=1 & sp>0 -> (q'=min(q+1,2)); // do not serve and a request arrives
	[tick2] sr=0 & sp=0 -> (q'=max(q-1,0)); // serve and nothing arrives
	[tick2] sr=1 & sp=0 -> true; // serve and a request arrives arrives

endmodule
