module CLOCK

	c : [0..1];

	[tick1] c=0 -> (c'=1);
	[tick2] c=1 -> (c'=0);
	
endmodule
