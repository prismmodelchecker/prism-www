---
layout: layouts/base.njk
title: "The thinkteam user interface"
section: casestudies
permalink: /casestudies/thinkteam/
---
# The thinkteam user interface

*[contributed by Maurice ter Beek, Mieke Massink, Diego Latella, Stefania Gnesi, Alessandro Forghieri and Maurizio Sebastianis]*{.note}

## Contents

-   [Introduction](#intro)
-   [thinkteam](#thinkteam)
-   [Stochastic Model of thinkteam](#stocthinkteam)
    -   [The Retrial Approach](#retrial)
    -   [The Waiting-List Approach](#waiting)
-   [Conclusion](#conc)

**Related publications:** {% cite "BML+04", "BML+05", "BML05a", "BML05b" %}

## Introduction { #intro }

This case study is about using stochastic model checking to address a number of usability concerns that involve quantitative aspects of a user interface for the industrial groupware system **thinkteam**. **thinkteam** is a ready-to-use Product Data Management (PDM) application that was developed by [think3](http://www.think3.com) and which caters the product/document management needs of design processes in the manufacturing industry. It allows enterprises to capture, organise, automate, and share engineering product information in an efficient way and it is an example of an asynchronous and dispersed groupware system.

Many interesting properties of groupware protocols and their interfaces can be analysed *a priori*, *i.e.* before implementation, by means of a model-based approach and model-checking techniques. In fact, several aspects of the functional correctness, such as concurrency aspects and awareness aspects, of the groupware protocol underlying **thinkteam** (and of its planned publish/subscribe notification service) have indeed been addressed in several papers by means of a traditional model-checking approach. There are, however, also usability issues that are influenced by the *performance* of the groupware system rather than by its functional behaviour. One such issue was raised by the analysis of *thinkteam* with a traditional model-checking approach in {% cite "BML+04", "BML+05" %}. It was shown that it was possible for the system to exclude a user from obtaining a file simply because other users competing for the same file were more "lucky" in their attempts to obtain the file. Such behaviour was explained by the fact that users were only provided with a file-access mechanism based on a retrial principle. While analysis with traditional model checking can be used to show that such a problem exists, it cannot be used to quantify the effect that it has on the user. In other words, it cannot be used to find out how often, in the average, a user needs to perform a retry in order to get a single file. Of course, the number of retries a user has to perform before obtaining a file is an important ingredient for measuring the usability of the system. If a high number of retries is necessary it may be more useful to have, *e.g.*, a waiting list for files to which users can subscribe.

In this case study (taken from {% cite "BML05a", "BML05b" %}) we investigate the trade-off between two different design options for granting users access to files in the database: a retrial approach and a waiting-list approach. As such, we show how stochastic model checking can be used for such analyses.

## thinkteam { #thinkteam }

We now give a brief overview of **thinkteam**. For more information we refer to {% cite "BML+04" %} and [www.think3.com](http://www.think3.com).

**thinkteam** is a three-tier data management system running on Wintel platforms (*cf.* [Figure 1](#fig1)). The most typical installation scenario is a network of desktop clients interacting with one centralized RDBMS server and one or more file servers. Components residing on each client node supply a graphical interface, metadata management, and integration services. Persistence services are achieved by building on the characteristics of the RDBMS and file servers. We describe only its vaulting subsystem, as it is relevant to our analysis.

<a name="fig1"></a>

![thinkteam system](/images/cs/thinkteam.system.gif)

*Figure 1*{.caption}

Controlled storage and retrieval of documents in PDM applications is traditionally called vaulting, the vault being a file-system-like repository. The two main functions of vaulting are: (1) to provide a single, secure, and controlled storage environment, where the documents controlled by the PDM application are managed, and (2) to prevent inconsistent updates or changes to the document base, while still allowing the maximal access compatible with the business rules. While the first function is subject to the implementation of the lower layers of the vaulting system, the second is implemented in **thinkteam**'s underlying groupware protocol by a standard set of operations, *viz.*

-   *get*: extract a read-only copy of a document from the vault,
-   *import*: insert an external document into the vault,
-   *checkOut*: extract a copy of a document from the vault with the intent of modifying it (exclusive, *i.e.* only one checkout at a time is possible),
-   *unCheckOut*: cancel the effects of a previous checkout,
-   *checkIn*: replace an edited document in the vault (the document must previously have been checked out), and
-   *checkInOut*: replace an edited document in the vault, while at the same time retaining it as checked out.

It is important to note that access to documents (via the *checkOut* operation) is based on the "retrial" principle: currently there is no queue (or reservation system) handling the requests for editing rights on a document.

**thinkteam** typically handles some 100,000 documents for 20-100 users. A user rarely checks out more than 10 documents a day, but she can keep a document checked out from anywhere between 5 minutes and several days.

In order to maximize concurrency, a *checkOut* in **thinkteam** creates an exclusive lock for write access but not for read access. It is thus possible for clients to gain read access to documents that are checked out by others. An automatic solution of the write access conflict is not easy, as it is critically related to the type, nature, and scope of the changes that will be performed on the document. Moreover, standard but harsh solutions - like maintaining a dependency relation between documents and use it to simply lock all documents depending on the document being checked out - are out of the question for [think3](http://www.think3.com), as they would cause these documents to be unavailable for too long periods of time. For **thinkteam**, the preferred solution is thus to leave it to the users to resolve such conflicts. A publish/subscribe notification service provides the means to supply the clients with adequate information by

-   informing the client who checks out a document of existing outstanding reference copies, and
-   notifying the copy holders upon *checkOut* and *checkIn* of the document.

In {% cite "BML+04" %}, several correctness properties of **thinkteam** have been verified. These properties addressed issues like concurrency control, awareness, and denial of service. Most properties were found to hold, with the exception of one concurrency-control property and a denial-of-service property. The problem with the concurrency-control property arises when a user simply "forever" forgets to *checkIn* the file it has checked out, which means that the lock on this file is never released. In **thinkteam**, such a situation is resolved by the intervention of a system administrator.

The problem with the denial-of-service property, on the other hand, is that it may be the case that one of the users can never get its turn to, *e.g.*, perform a *checkOut*, simply because the system is continuously kept busy by the other users, while this user did express its desire to perform a *checkOut*. Such behaviour forms an integral part of the **thinkteam** protocol. This is because, as mentioned before, access to documents is based on the "retrial" principle: **thinkteam** currently has no queue (or reservation system) handling simultaneous requests for a document. Before simply extending **thinkteam** with a reservation system, it would be useful to know (1) how often, in the average, users have to express their requests before they are satisfied and (2) under which system conditions (number of users, file processing time, *etc.*) such a reservation system would really improve usability.

## Stochastic Model of thinkteam { #stocthinkteam }

Next we describe the stochastic model of **thinkteam** in PEPA, first for the retrial approach and consequently for the waiting-list approach, and we perform several analyses on these models.

## The Retrial Approach { #retrial }

In [Figure 2](#fig2) the models of the User and CheckOut components, for the retrial approach, are drawn as automata for reasons of readability.

<a name="fig2"></a>

![image: retrial queue](/images/cs/thinkteam.retrialQueue.gif)

*Figure 2*{.caption}

We consider the case that there is only one file, the (exclusive) access to which is handled by the CheckOut component. A user can express interest in checking out the file by performing a *checkOut*. This operation can either result in the user being granted the access to the file or in the user being denied the access because the file is currently already checked out by another user. In [Figure 2](#fig2), the *s*uccessful execution of a *checkOut* is modelled by activity (cO\_s,`lambda`), while a *f*ailed *checkOut* is modelled by (cO\_f,`lambda`). The exponential rate `lambda` is also called the *request* rate. If the user does not obtain the file, then she may retry to check out the file, which is modelled by activity (cO\_s,`theta`) in case of a *s*uccessful retry and by (cO\_f,`theta`) in case the *checkOut* *f*ailed. The exponential rate `theta` is also called the *retrial* rate. The *checkIn* operation, finally, is modelled by activity (cI,`mu`) and the exponential rate `mu` is also called the *file processing* rate. The CheckOut component takes care that only one user at a time can have the file in her possession. To this aim, it simply keeps track of whether the file is checked out (state &lt;1>) or not (state &lt;0>). When a User tries to obtain the file through the *checkOut* activity, then she is denied the file if it is currently checked out by another user while she might obtain the file if it is available.

The formal PEPA specifications of the User and the CheckOut component, and the composed model for three User components and the CheckOut component, are as follows:

```pepa
  lambda = 1.0; % request rate (user/hour)
  mu = 5.0;     % file processing rate (user/hour)
  theta = 5.0;  % retrial rate (user/hour)
  #User = (cO_s,lambda).User1 + (cO_f,lambda).User2; % request mode
  #User1 = (cI,mu).User;                             % file in possession
  #User2 = (cO_s,theta).User1 + (cO_f,theta).User2;    % retry mode
  #CheckOut = (cO_s,infty).CheckOut1;
  #CheckOut1 = (cI,infty).CheckOut + (cO_f,infty).CheckOut1;
  (User <> User <> User) < cO_s,cO_f,cI > CheckOut
```

We loaded these specifications into PRISM, which resulted in the following specification:

{% prismCode "casestudies/examples/thinkteam_retrial.sm", false, true %}

From this specification PRISM generated a CTMC with 19 states and 54 transitions. Each state is represented as a quadruple (a,b,c,d), where a, b and c give the state in the User automaton of the first, the second and the third user, respectively, while d gives the state of automaton CheckOut. In [Figure 3](#fig3) we have drawn this CTMC and we have sketched how this CTMC is lumping equivalent to the much simpler CTMC given in [Figure 4](#fig4). (Moreover, the CTMC obtained by removing the self-loops from that of [Figure 4](#fig4) is frequently used in the theory of *retrial queues* {% cite "Fal90", "FT97", "Kul95" %}.)

<a name="fig3"></a>

![](/images/cs/thinkteam.retrial.gif)

*Figure 3*{.caption}

  
<a name="fig4"></a>

![](/images/cs/thinkteam.retrialCTMC.gif)

*Figure 4*{.caption}

The states of this latter CTMC are tuples &lt;x,y> in which x denotes whether the file is checked out (x = 1) or not (x = 0) and y = 0,1,2 denotes the number of users that are currently retrying to perform a *checkOut*. Note, however, that when a user inserts the file she has checked out back into the Vault through a *checkIn* activity, the CheckOut component does allow another user to *checkOut* the file but this need not be a user that has tried before to obtain the file. In fact, a race condition occurs between the request and retrial rates associated to the *checkOut* activity (*cf.* states &lt;0,1> and &lt;0,2>). Note also that once the file is checked in, it is *not* immediately granted to another user, even if there are users that have expressed their interest in obtaining the file. In such a situation, the file will remain unused for a period of time which is exponentially distributed with rate `theta + lambda`.

We will use the stochastic model and the stochastic logic to formalise and analyse various usability issues concerning the retrial approach used in **thinkteam**. In this context it is important to fix the time units one considers. We choose hours as our time unit. For instance, if `mu` = 5 this means that a typical user keeps the file in its possession for 60/5 = 12 minutes on the average.

While the above specifications assume three User components and one CheckOut component, our analyses below sometimes consider upto ten User components composed with one CheckOut component. Note that this leads to models that can no longer be verified by hand. For instance, the resulting composition in case of ten User components has a total of 6,143 states and 43,500 transitions and the lumping-equivalent CTMC has 20 states and 52 transitions.

### Analysis of Performance Properties

All analyses reported below have been performed by running PRISM Version 2.0 and each took only a few seconds of CPU time. The iterative numerical method used for the computation of probabilities was Gauss-Seidel and the accuracy 1e-6.

We first analyse the probability that a user that has requested the file and is now in "retry mode" (state &lt;2> of the User component), obtains the requested file within the next five hours. This measure can be formalised in CSL as (in a pseudo-notation close to the PRISM notation):

```prism
P=? [ true U<=5 (User_STATE=1) {User_STATE=2} ]
```

which must be read as follows: "what is the probability that path formula `true` `U`<sup>&lt;=5</sup> (`User_STATE = 1`) is satisfied for state `User_STATE = 2`?".

The results for this measure are presented in [Figure 5](#fig5) for request rate `lambda` = 1 (*i.e.* a user requests the file once an hour on average), retrial rate `theta` taking values 1, 5 and 10 (*i.e.* in one hour a user averagely retries one, five or ten times to obtain the file), file processing rate `mu` = 1 (*i.e.* a user in the average keeps the file checked out for one hour) and for different numbers of users ranging from 1 to 10.

<a name="fig5"></a>

![](/images/graphs/thinkteam.chart1.gif)

*Figure 5*{.caption}

Clearly, with an increasing number of users the probability that a user gets her file within the time interval is decreasing. On the other hand, with an increasing retrial rate and an invaried file processing rate the probability for a user to obtain the requested file within the time interval is increasing. Further results could easily be obtained by model checking for different rate parameters that may characterise different profiles of use of the same system. In particular, this measure could be used to evaluate under which circumstances (*e.g.* when it is known that only a few users will compete for the same file) a retrial approach would give satisfactory results from a usability point of view.

A somewhat more complicated measure can be obtained with some additional calculations involving steady-state analysis (by means of model checking). [Figure 6](#fig6) shows the average number of retrials per file request for request rate `lambda` = 1, retrial rate `theta` taking values 5 and 10, file processing rate `mu` ranging from 1 to 10 and for 10 users. The measure has been computed as the average number of retries that take place over a certain system observation period of time T divided by the average number of requests during T. To compute the average number of retries (requests, resp.) we proceeded as follows. We first compute the steady-state probability p (q, resp.) of the user being in "retry mode" ("request mode", resp.), *i.e.*

```prism
p ≡ S = ? (User_STATE = 2) and q ≡ S = ? (User_STATE = 0)
```

The fraction of time the user is in "retry mode" ("request mode", resp.) is then given by T ⋅ p (T ⋅ q, resp.). Consequently the average number of retries (requests, resp.) is `theta` ⋅ T ⋅ p (`lambda` ⋅ T ⋅ q, resp.). Hence the measure of interest is (`theta` ⋅ p)/(`lambda` ⋅ q).

<a name="fig6"></a>

![](/images/graphs/thinkteam.chart2.gif)

*Figure 6*{.caption}

It is easy to observe in [Figure 6](#fig6) that the number of retrials decreases considerably when the file processing rate is increased (*i.e.* when the users restitute, by means of a *checkIn*, the file they had checked out after a shorter time). We also note that a relatively high file processing rate is needed for obtaining an acceptably low number of retrials in the case of 10 users that regularly compete for the same file.

The effect on the average number of retries is even better illustrated in [Figure 7](#fig7), where with a similar approach as outlined above the average number of retrials per file request is presented for request rate `lambda` = 1, retrial rate `theta` taking values 5 and 10, fixed file processing rate `mu` = 5 and various numbers of users. Clearly, the average number of retrials per file request increases sharply when the number of users increases.

<a name="fig7"></a>

![](/images/graphs/thinkteam.chart3.gif)

*Figure 7*{.caption}

## The Waiting-List Approach { #waiting }

We again use PEPA to specify our model and we draw the models as automata for readability. In contrast with our model for the retrial approach, we now assume that a user that attempts to *checkOut* the file when it has already been checked out by another user is put in a FIFO queue. The moment in which the file then becomes available, the user that is first in this FIFO queue obtains the file. This implies the following changes w.r.t. the model from the previous section. Since a user no longer retries to obtain the file after her initial unsuccessful attempt to *checkOut* the file, the new User component has two states only, *viz.* state &lt;2> is removed from the User component as given in [Figure 2](#fig2). Moreover, since the CheckOut component now implements a FIFO policy, the new CheckOut component needs to keep track of the number of users in the FIFO queue and their relative position. This also means that the new CheckOut component needs to know exactly which of the users performs a *checkOut* or a *checkIn*. In [Figure 8](#fig8) the model of the new Users and CheckOut - now called FIFO - components are drawn.

<a name="fig8"></a>

![](/images/cs/thinkteam.FIFOqueue.gif)

*Figure 8*{.caption}

The formal PEPA specifications of these new Users and CheckOut components, and the composed model for three User components and the CheckOut component, are as follows:

```pepa
  lambda = 1.0;    % request rate
  mu = 5.0;        % file processing rate
  #User_0 = (cO_0,lambda).User_0a;    
  #User_0a = (cI_0,mu).User_0;
  #User_1 = (cO_1,lambda).User_1a;
  #User_1a = (cI_1,mu).User_1;
  #User_2 = (cO_2,lambda).User_2a;
  #User_2a = (cI_2,mu).User_2;
  #FIFO = (cO_0,infty).F_0 + (cO_1,infty).F_1 + (cO_2,infty).F_2;   
  #F_0 = (cI_0,infty).FIFO + (cO_1,infty).F_01 + (cO_2,infty).F_02;
  #F_1 = (cI_1,infty).FIFO + (cO_0,infty).F_10 + (cO_2,infty).F_12;
  #F_2 = (cI_2,infty).FIFO + (cO_0,infty).F_20 + (cO_1,infty).F_21;
  #F_01 = (cI_0,infty).F_1 + (cO_2,infty).F_012;
  #F_02 = (cI_0,infty).F_2 + (cO_1,infty).F_021;
  #F_10 = (cI_1,infty).F_0 + (cO_2,infty).F_102;
  #F_12 = (cI_1,infty).F_2 + (cO_0,infty).F_120;
  #F_20 = (cI_2,infty).F_0 + (cO_1,infty).F_201;
  #F_21 = (cI_2,infty).F_1 + (cO_0,infty).F_210;
  #F_012 = (cI_0,infty).F_12;
  #F_021 = (cI_0,infty).F_21;
  #F_102 = (cI_1,infty).F_02;
  #F_120 = (cI_1,infty).F_20;
  #F_201 = (cI_2,infty).F_01;
  #F_210 = (cI_2,infty).F_10;
  (User_0 <> User_1 <> User_2) < cO_0,cO_1,cO_2,cI_0,cI_1,cI_2 > FIFO
```

The translations of these specifications into the PRISM language are as follows:

{% prismCode "casestudies/examples/thinkteam_waiting_list.sm", false, true %}

From these specifications PRISM automatically generates a CTMC with 16 states and 30 transitions. In [Figure 9](#fig9) we have drawn this CTMC and we have sketched how this CTMC is lumping equivalent to the much simpler CTMC given in [Figure 10](#fig10).

<a name="fig9"></a>

![](/images/cs/thinkteam.birthDeath1.gif)

*Figure 9*{.caption}

It is not difficult to verify that the CTMC of [Figure 9](#fig9) is indeed lumping equivalent to the CTMC of [Figure 10](#fig10).

<a name="fig10"></a>

![](/images/cs/thinkteam.birthDeath2.gif)

*Figure 10*{.caption}

The state tuples of this CTMC have the same meaning as before, but states &lt;0,1> and &lt;0,2> no longer occur. This is due to the fact that, once the file is checked in, it is immediately granted to another user, *viz.* the first in the FIFO queue.

The fact that we consider an exponential request rate `lambda`, an exponential file processing rate `mu`, one file, and three users means that we are dealing with a M|M|1|3 *queueing system* {% cite "Hav01", "Kul95" %}. The CTMC of [Figure 10](#fig10) is then its underlying CTMC and this type of CTMC is also called a *birth-death process* {% cite "Hav01", "Kul95" %}.

We now compare the two models with respect to the steady-state probability that there are users waiting to obtain the file after a *checkOut* request. To measure this we compute the probabilities for at least one user not being granted the file after asking for it, *i.e.* the steady-state probability p to be in a state in which at least one user has performed a *checkOut* but did not obtain the file yet. In the retrial approach this concerns the situation in which any of the User components of [Figure 2](#fig2) is in state &lt;`2`\>, whereas in the waiting-list approach this concerns the situation in which two or three of the new User components of [Figure 8](#fig8) are in state &lt;`ia`\>, i = 0,1,2. Hence this can be expressed as CSL steady-state formulae (again in a pseudo-notation close to that of PRISM):

```prism
p ≡ S = ? [ (User_STATE = <2>) | (User_2_STATE = <2>) | (User_3_STATE = <2>) ],
```

in the retrial approach while

```prism
p ≡ S = ? [ (User_0_STATE = <0a>) & (User_1_STATE = <1a>) | (User_1_STATE = <1a>) & (User_2_STATE = <2a>) |(User_2_STATE = <2a>) & (User_0_STATE = <0a>) ],
```

in the waiting-list approach.

The results of our comparison are presented in [Figure 11](#fig11) for request rate `lambda` = 1, retrial rate `theta` (only in the retrial approach of course) ranging from 1 to 10, file processing rate `mu` taking values 5 and 10 and 3 users.

<a name="fig11"></a>

![](/images/graphs/thinkteam.chart4.gif)

*Figure 11*{.caption}

It is easy to see that, as expected, the waiting-list approach outperforms the retrial approach in all the cases we considered: The probability to be in a situation in which two or three of the new User components of the waiting-list approach are in state &lt;ia>, i = 0,1,2, is always lower than the probability to be in a situation in which any of the User components of the retrial approach is in state &lt;2>. Note that for large `theta` the probability in case of the retrial approach is asymptotically approaching that of the waiting-list approach, of course given the same values for `lambda` and `mu`. While we did verify this for values of `theta` upto 10<sup>9</sup>, it is of course extremely unrealistic to assume that a user performs 10<sup>9</sup> retries per hour. We thus conclude that the time that a user has to wait "in the long run" for the file after it has performed a *checkOut* is always less in the waiting-list approach than in the retrial approach. Furthermore, while increasing the retrial rate (*i.e.* reducing the time inbetween retries) does bring the results for the retrial approach close to those for the waiting-list approach, it takes highly unrealistic retrial rates to reach a difference between the two approaches that is insignificantly small.

## Conclusion { #conc }

Above we have addressed the formal analysis of a number of quantitative usability measures of a small, but relevant industrial case study concerning an existing groupware system for PDM, **thinkteam**. We have shown how the quantitative aspects of the interaction between users and the system can be modelled in PEPA. The model has been used to obtain quantitative information on two different approaches for users to obtain files from a central database; one based on retrial and one based on a reservation system implemented via a FIFO waiting list. The quantitative measures addressed the expected time that users are required to wait before they obtain a requested file and the average number of retries per file, for various assumptions on the parameters of the model. These measures have been formalised as formulae of CSL and analysed by means of PRISM.

The results show that, from a user perspective, the retrial approach is less convenient than the waiting-list approach. Moreover, it can be shown that the situation for the retrial approach rapidly deteriorates with an increasing number of users that compete for the same file. Nevertheless, in situations where it is very unlikely that more than a few users compete for the same file the retrial approach may still be acceptable from a usability point of view, even if not optimal. The use of stochastic model checking allowed for a convenient modular and compositional specification of the system and the automatic generation of the underlying CTMCs on which performance analysis is based. Furthermore, the combination of compositional specification of models and logic characterisation of measures of interest provides a promising technique for *a priori* *formal* model-based usability analysis where quantitative aspects as well as qualitative ones are involved.

We plan to apply the developed models and measures for the analysis of different user profiles of the actual **thinkteam** system in collaboration with [think3](http://www.think3.com). The user profiles will be useful to obtain realistic values for the parameters of the model and for further validation of the model. In a further extension of the model we also plan to deal with the quantitative effects of the addition of a publish/subscribe notification service to **thinkteam**.

## Contact { #contact }

Feel free to [contact us](http://fmt.isti.cnr.it/) if you have any questions about the case study presented here.
