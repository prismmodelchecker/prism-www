// reward structure
// cost is the number of bits A requires to know a pair
formula cost = min(L-min(b0,b5),L-min(b1,b6),L-min(b2,b7),L-min(b3,b8),L-min(b4,b9));
rewards "bits_A_needs"
	[finish] true : cost;
endrewards

