dtmc

// Maximal charge of the robot battery counted as the number of moves.
const int batteryCharge=20 ;

// Speed at which the battery recharges as the number of moves per unit of time.
const int chargeSpeed = 4;

// Frequency at which new delivery requests arrive.
const double f = 0.5;

//------------------------------------------------------------------------------

// Controller of robot movements
    
module controller
	p: [0..8] init 0;
	
	[move] p=0&c>0 -> 1/2:(p'=0) + 1/2:(p'=4);
	[move] p=4&c>0 -> 1/4:(p'=0) + 1/4:(p'=1) + 1/4:(p'=4) + 1/4:(p'=6);
	[move] p=1&c>0 -> 1/3:(p'=4) + 1/3:(p'=1) + 1/3:(p'=2);
	[move] p=2&c>0 -> 1/3:(p'=1) + 1/3:(p'=2) + 1/3:(p'=3);
	[move] p=3&c>0 -> 1/3:(p'=2) + 1/3:(p'=3) + 1/3:(p'=5);
	[move] p=5&c>0 -> 1/3:(p'=3) + 1/3:(p'=5) + 1/3:(p'=8);
	[move] p=6&c>0 -> 1/3:(p'=4) + 1/3:(p'=6) + 1/3:(p'=7);
	[move] p=7&c>0 -> 1/3:(p'=6) + 1/3:(p'=7) + 1/3:(p'=8);
	[move] p=8&c>0 -> 1/3:(p'=5) + 1/3:(p'=7) + 1/3:(p'=8);

        // When the battery is empty, loop over current state.
	[] c=0 -> 1.0 : true;
endmodule

//------------------------------------------------------------------------------

// Charge of the battery

module battery
	c:   [0..batteryCharge] init batteryCharge;

        // When position is equal to 0, recharge the battery.
	[move] c<=batteryCharge-chargeSpeed & p=0 -> 1.0 : (c'=c+chargeSpeed);
	[move] c> batteryCharge-chargeSpeed & p=0 -> 1.0 : (c'=batteryCharge);
        // Otherwise discharge it.
	[move] c>0 & p!=0 -> 1.0 : (c'=c-1);
endmodule

//------------------------------------------------------------------------------

// Handling of tasks and task completion    
    
module task
        fd:[0..2] init 0;
        // 0 no task
        // 1 fetch mail
        // 2 deliver mail

        g: [1..8] init 1;
        // Location to reach in order to complete the current task.

        // Randomly choose a new task with probability f.
	[move] fd=0 -> 
               f/8:(g'=1)&(fd'=1) + f/8:(g'=2)&(fd'=1) + f/8:(g'=3)&(fd'=1)
	     + f/8:(g'=4)&(fd'=1) + f/8:(g'=5)&(fd'=1) + f/8:(g'=6)&(fd'=1)
             + f/8:(g'=7)&(fd'=1) + f/8:(g'=8)&(fd'=1) + 1-f:true;

        [move] fd>0 & g!=p -> 1.0:true;

        // The robot reaches a location where it fetches mail, then
        // randomly chooses destination.
	[] g=p & fd=1 -> 
 	       1/7*(g=1?0:1):(g'=1)&(fd'=2) + 1/7*(g=2?0:1):(g'=2)&(fd'=2) 
             + 1/7*(g=3?0:1):(g'=3)&(fd'=2) + 1/7*(g=4?0:1):(g'=4)&(fd'=2)
	     + 1/7*(g=5?0:1):(g'=5)&(fd'=2) + 1/7*(g=6?0:1):(g'=6)&(fd'=2)
             + 1/7*(g=7?0:1):(g'=7)&(fd'=2) + 1/7*(g=8?0:1):(g'=8)&(fd'=2);

        // Deliver the mail, set current task to empty.
	[delivery] g=p & fd=2 -> 1 : (fd'=0); 
endmodule

//------------------------------------------------------------------------------

label "outOfPower" = c=0;
