// power consumption
rewards "power"

	sp=0 & c=1 : 2.5;
	sp=1 & c=1 : 1.5;
	sp=2 & c=1 : 2.5;
	sp=3 & c=1 : 0.8;
	sp=4 & c=1 : 2.5;
	sp=5 & c=1 : 2.5;
	sp=6 & c=1 : 0.3;
	sp=7 & c=1 : 2.5;
	sp=8 & c=1 : 2.5;
	sp=9 & c=1 : 0.1;
	sp=10 & c=1 : 2.5;

endrewards

// queue size
rewards "queue"

	c=1 : q;

endrewards

// customers lost
rewards "lost"

	[tick2] q=2 & sr=1 & sp>0 : 1;

endrewards

// time
rewards "time"

    [tick2] true : 1;

endrewards