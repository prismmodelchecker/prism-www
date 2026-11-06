#!/bin/csh

#################################################################
# standard model checking props

# min/max probability of L lost requests by step 1000
prism power_mdp.nm power_mdp.pctl -s -const QMAX=2,L=0:10:100,K=1000 -prop 1
prism power_mdp.nm power_mdp.pctl -s -const QMAX=2,L=0:10:100,K=1000 -prop 2

# min/max expected power by step K
prism power_mdp.nm power_mdp.pctl -s -const QMAX=2,L=1,K=0:20:500 -prop 3
prism power_mdp.nm power_mdp.pctl -s -const QMAX=2,L=1,K=0:20:500 -prop 4

# min/max expected queue at step K
prism power_mdp.nm power_mdp.pctl -s -const QMAX=2,L=1,K=0:50:1000 -prop 5
prism power_mdp.nm power_mdp.pctl -s -const QMAX=2,L=1,K=0:50:1000 -prop 6

# min/max expected lost requests by step K
prism power_mdp.nm power_mdp.pctl -s -const QMAX=2,L=1,K=0:50:1000 -prop 7
prism power_mdp.nm power_mdp.pctl -s -const QMAX=2,L=1,K=0:50:1000 -prop 8

#################################################################
# tests (used to find bounds on the constraints)
# (use -abs for convergence as reward values are >1) 

# min/max expected batter life
prism power_multi.nm power_tests.pctl -maxiters 50000 -abs -s -const QMAX=2 -prop 1
prism power_multi.nm power_tests.pctl -maxiters 50000 -abs -s -const QMAX=2 -prop 2
# bounds  [99.999,99.999]

# min/max expected power consumption
prism power_multi.nm power_tests.pctl -maxiters 50000 -abs -s -const QMAX=2 -prop 3
prism power_multi.nm power_tests.pctl -maxiters 50000 -abs -s -const QMAX=2 -prop 4
# bounds  [99.999,2497.599]

# min/max average queue size
prism power_multi.nm power_tests.pctl -maxiters 50000 -abs -s -const QMAX=2 -prop 5
prism power_multi.nm power_tests.pctl -maxiters 50000 -abs -s -const QMAX=2 -prop 6
# bounds  [0.718596,1.97323]

# min/max expected lost requests
prism power_multi.nm power_tests.pctl -maxiters 50000 -abs -s -const QMAX=2 -prop 7
prism power_multi.nm power_tests.pctl -maxiters 50000 -abs -s -const QMAX=2 -prop 8
# bounds  [65.837,181.147]

# probably L lost requests
prism power_lost_multi.nm power_lost_tests.pctl -s -const QMAX=2,L=10 -prop 1
prism power_lost_multi.nm power_lost_tests.pctl -s -const QMAX=2,L=10 -prop 2
# bounds [0.831920,0.9329340]

#################################################################
# multi-objective model checking

# min power consumption with constraints on av queue size and expected lost requests
prism-multi-fair power_multi.nm power_multi.pctl -s -prop 3 -const QMAX=2,Q=0.72:0.05:1.97,L=70:5:190  -exportresults both2.res

# min power consumption with constraints on probability L lost requests
prism-multi-fair power_lost_multi.nm power_lost_multi.pctl -s  -const QMAX=2,L=10,l=0.8:0.02:1  -exportresults lost2.res



