// SERVICE REQUESTER
module SR

	sr : [0..1] init 0; // 0 - idle and 1 - 1req
	
	[tick2] sr=0 -> 0.898: (sr'=0) + 0.102: (sr'=1);
	[tick2] sr=1 -> 0.454: (sr'=0) + 0.546: (sr'=1);

endmodule
