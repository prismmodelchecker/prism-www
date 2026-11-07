---
layout: layouts/base.njk
title: "Randomised two-process wait-free test-and-set"
section: casestudies
permalink: /casestudies/test-and-set/
---
# Randomised two-process wait-free test-and-set

(Tromp and Vitanyi)

## Contents

-   [Introduction](#intro)
-   [The PRISM Model](#model)
-   [Model Checking](#expected%20time)

## Introduction { #intro }

This case study considers the algorithm of Tromp and Vitanyi {% cite "TV02" %}, the first explicit randomised algorithm for two-process wait-free test-and-set.

The protocol is used to select a unique process. It is designed for two processes, **P0** and **P1**, acting concurrently and involves two four valued single writer/single reader atomic variables **R0** and **R1**. Process **Pi** only writes to variable **Ri** and only reads variable **R(1-i)**. Hence, the reads and the writes in the protocol do not need to be parametrised by the variable they access. The protocol for a single process is given below and the transitions are labelled by reads (**`r(VALUE)`**) and writes (**`w(VALUE)`**).

![](/images/cs/test-and-set.gif)

Note that there is a probabilistic choice in state **choose** when the process also reads value **CHOOSE**. The states enclosed within the dotted lines correspond to the set of states in which the processes own shared variable has the same value. The initial state is **rst**, and the states **tst0** and **tst1** correspond to the completing the test-and-set operation with *success* and *failure* respectively.

## The PRISM Model { #model }

The PRISM code for this protocol is given below. Note that the description also includes a tester processes which is required in the model checking phase.

{% prismCode "casestudies/examples/test-and-set.nm", false, true %}

It took 0.03 to construct the model, the model has 196 states, and it required 19 iterations to find these reachable states.

<a name="expected time"></a>

## Model Checking

We showed that the protocol is *wait free*, by verifying that, under any scheduling, *the maximum expected number of accesses by one process to shared variables during the execution of a test-and-set operation is less than or equal to 10.*

More precisely we check that the following PCTL specifications hold in all states.

{% prismCode "casestudies/examples/test-and-set.pctl", false, true %}

Below we summarise the results relating to the maximum *expected* number of accesses, by process **P0**, to shared variables during the execution of one test-and-set operation, for all states of the protocol.

| state of the protocol || maxmium expected reward |
| local state of P0     | local state of P1 | ^^                      |
|-----------------------|-------------------|-------------------------|
| rst                   | rst               | 10.0                    |
| rst                   | me                | 10.0                    |
| rst                   | not me            | 10.0                    |
| rst                   | choose            | 2.0                     |
| rst                   | to me             | 10.0                    |
| rst                   | to he             | 2.0                     |
| rst                   | he                | 2.0                     |
| rst                   | not he            | 2.0                     |
| rst                   | tst0              | 6.0                     |
| rst                   | tst1              | 2.0                     |
| rst                   | free              | 10.0                    |
| me                    | rst               | 9.0                     |
| me                    | me                | 9.0                     |
| me                    | not me            | 9.0                     |
| me                    | choose            | 1.0                     |
| me                    | to me             | 9.0                     |
| me                    | to he             | 1.0                     |
| me                    | he                | 1.0                     |
| me                    | not he            | 1.0                     |
| me                    | tst0              | 5.0                     |
| me                    | tst1              | 1.0                     |
| me                    | free              | 9.0                     |
| not me                | rst               | 8.0                     |
| not me                | me                | 8.0                     |
| not me                | not me            | 8.0                     |
| not me                | choose            | 8.0                     |
| not me                | to he             | 8.0                     |
| not me                | he                | 4.0                     |
| not me                | tst0              | 4.0                     |
| not me                | tst1              | 4.0                     |
| choose                | rst               | 3.0                     |
| choose                | me                | 3.0                     |
| choose                | not me            | 7.0                     |
| choose                | choose            | 7.0                     |
| choose                | to me             | 7.0                     |
| choose                | to he             | 7.0                     |
| choose                | he                | 3.0                     |
| choose                | not he            | 7.0                     |
| choose                | tst0              | 3.0                     |
| choose                | tst1              | 3.0                     |
| to me                 | rst               | 10.0                    |
| to me                 | me                | 10.0                    |
| to me                 | choose            | 6.0                     |
| to me                 | to me             | 10.0                    |
| to me                 | to he             | 2.0                     |
| to me                 | he                | 2.0                     |
| to me                 | not he            | 6.0                     |
| to me                 | tst0              | 6.0                     |
| to me                 | tst1              | 2.0                     |
| to he                 | rst               | 2.0                     |
| to he                 | me                | 2.0                     |
| to he                 | not me            | 6.0                     |
| to he                 | choose            | 6.0                     |
| to he                 | to me             | 2.0                     |
| to he                 | to he             | 10.0                    |
| to he                 | he                | 10.0                    |
| to he                 | tst0              | 2.0                     |
| to he                 | tst1              | 6.0                     |
| he                    | rst               | 1.0                     |
| he                    | me                | 1.0                     |
| he                    | not me            | 1.0                     |
| he                    | choose            | 1.0                     |
| he                    | to me             | 1.0                     |
| he                    | to he             | 9.0                     |
| he                    | he                | 9.0                     |
| he                    | not he            | 9.0                     |
| he                    | tst0              | 1.0                     |
| he                    | tst1              | 5.0                     |
| not he                | rst               | 4.0                     |
| not he                | me                | 4.0                     |
| not he                | choose            | 8.0                     |
| not he                | to me             | 8.0                     |
| not he                | he                | 8.0                     |
| not he                | not he            | 8.0                     |
| not he                | tst0              | 4.0                     |
| not he                | tst1              | 4.0                     |
| free                  | rst               | 10.0                    |
| free                  | me                | 10.0                    |
| free                  | tst0              | 6.0                     |
