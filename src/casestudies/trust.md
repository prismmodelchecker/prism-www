---
layout: layouts/base.njk
title: "Trust models for user-centric networks"
section: casestudies
permalink: /casestudies/trust/
---
# Trust models for user-centric networks

(A. Bogliolo, P. Polidori, A. Aldini, W. Moreira, P. Mendes, M. Yildiz, C. Ballester & J. Seigneur)

## Contents

-   [Introduction](#intro)
-   [Turn-Based Stochastic Game Model](#turn)
-   [Concurrent Stochastic Game Model](#concurrent)
-   [Analysis](#analysis)

**Related publications**: {% cite "KPS13", "KNPS18", "KNPS19" %}

## Introduction: { #intro }

User-centric networks are designed to encourage users to act cooperatively, sharing resources or services between themselves, for example in order to provide connectivity in a mobile ad-hoc network. The effectiveness of such networks is heavily dependent on their cooperation mechanisms, which are often based on the use of incentives to behave unselfishly. In this paper, we present an analysis of a cooperation mechanism for user-centric networks {% cite "BPA+12" %}, which combines a reputation-based incentive, used to establish a measure of trust between users, and a virtual currency mechanism used to “buy” and “sell” services.

The basic ideas behind the cooperation mechanism of {% cite "BPA+12" %} can be summarised as follows. We assume a general model of providers offering services to requesters. Cooperation between users of the network (requesters and providers) is managed through a combination of reputation and virtual currency.

Reputation is captured by a discrete trust measure, denoted *trust<sub>ij</sub>*, representing the extent to which user *i* trusts user *j*, based on previous interactions between them and the recommendations provided by the other users in the network. This is used to determine whether a service request from *j* is accepted by *i*. A trust level *T<sub>ij</sub>* is computed as a weighted sum:

$$T_{ij} = \alpha \cdot \mathit{trust}_{ij} + (1-\alpha) \cdot \mathit{recs}_{ij}$$

where *recs<sub>ij</sub>* is an “indirect” trust measure, taken as the the average value of *trust<sub>kj</sub>* for other users k (whereas *trust<sub>kj</sub>* is called a “direct” measure of trust). By default, *i* will decide to accept *j*’s request if *T<sub>ij</sub>* is not below a pre-specified service trust level, denoted *st<sub>i</sub>*. The parameter α ∈ \[0,1\] controls the relative influence that the direct and indirect measures of trust have on this decision.

The reputation scheme is then integrated with a virtual currency system, where services are bought and sold between users, and the cost paid to *i* by *j* for a service is a function of *trust<sub>ij</sub>*. Assuming model parameters for minimum and maximum costs *C*<sub>min</sub> , *C*<sub>mX</sub> and threshold *T′*, the cost *C*(*trust<sub>ij</sub>*) is defined as:

-   *C*<sub>min</sub> + (*C*<sub>max</sub>−*C*<sub>min</sub>) ∙ (*T′*− *trust<sub>ij</sub>*)/ *T′*    if *trust<sub>ij</sub>* < *T′*;
-   *C*<sub>min</sub>    otherwise.

Procurement of a service proceeds in several phases. First, a requester *j* chooses a provider *i* and makes a request. If *T<sub>ij</sub>* ≥ *st<sub>i</sub>*, the request is accepted. In this case, the two users then “negotiate” the service cost, using the function of *trust<sub>ij</sub>* given above. The negotiation may, however, fail: with probability *c<sub>i</sub>*, user *i* cancels the accepted request; this represents the “cooperative attitude” of the provider *i*. If not cancelled, the service is delivered and the requester chooses whether or not to pay the negotiated price to the provider. If payment is made, the provider increases the trust measure of the requester by one unit. If not, the measure is decreased by *td<sub>i</sub>* units. On encountering a requester for the first time, a provider shares the trust measure with the other providers.

## Turn-Based Stochastic Game Model { #turn }

Here we consider turn-based stochastic game where a single user can either make a request to one of three service providers or buy the service directly by paying maximum price. If the user makes a request to a service provider, then the provider decides to accept or deny the request based on the user's trust measure. If the request was accepted, the provider would next decide on the price again based on the trust measure, and the user would then decide whether to pay for the service and finally the provider would update its trust measure based on whether there was a payment. This sequence of steps would have to take place before any other interactions occurred between the user and other providers.

Three trust models are considered. In the first, the trust level is decremented by 1 (*td*\=1) when the user does not pay, decremented by 2 in the second (*td*\=2) and reset to 0 in the third (*td*\=*inf*).

{% prismCode "casestudies/examples/trust_tsg.prism", true, true %}

## Concurrent Stochastic Game Model { #concurrent }

We now extend the above model to a concurrent stochastic game by allowing the user to make requests and pay different service providers simultaneously and for the different providers to execute requests concurrently. There are 7 players: one for the user's interaction with each service provider, one for the user buying services directly and one for each of the 3 service providers.

{% prismCode "casestudies/examples/trust_csg.prism", true, true %}

## Analysis { #analysis }

We consider both the maximum fraction and number of unpaid services the user can ensure for each trust model for both the TSG and CSG models. These properties can be expressed by the following formulae. As the players for the TSG and CSG models are different wee need different properties for these models. We first present the properties for the TSG model and then for the CSG model.

{% prismCode "casestudies/examples/trust_tsg.props", false, true %}

{% prismCode "casestudies/examples/trust_csg.props", false, true %}

The results are presented below using dashed lines for the TSG mode and solid lines for CSG model. The results demonstrate that the user can take advantage of the fact that in the CSG model it can request multiple services at the same time, and obtain more services without paying before the different providers get a chance to inform each other about non-payment. In addition, the results show that having a more severe penalty on the trust measure for non-payment decreases the unpaid services the user can obtain.

![plot: maximum fraction and number of unpaid services the user can ensure for each trust model for both the TSG and CSG models](/images/graphs/trust_graphs.png){.large}
