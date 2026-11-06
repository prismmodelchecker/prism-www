---
layout: layouts/base.njk
title: "Benchmarks"
section: downloads
permalink: /benchmarks/
---
# PRISM Benchmark Suite

The **PRISM benchmark suite** is a collection of PRISM models and associated properties, that can be used for benchmarking or testing of a new probabilistic model checking implementation or technique. These are already [widely used](https://scholar.google.com/scholar?hl=en&as_sdt=2005&sciodt=0,5&cites=7638455775515697190&scipsc=&q=&scisbd=1) in the verification community for this purpose.

Models (and properties) are grouped by type:

-   [discrete-time Markov chains (DTMCs)](/benchmarks/models/#dtmcs) (and [properties for DTMCs](/benchmarks/props-dtmc/))
-   [Markov decision processes (MDPs)](/benchmarks/models/#mdps) (and [properties for MDPs](/benchmarks/props-mdp/))
-   [continuous-time Markov chains (CTMCs)](/benchmarks/models/#ctmcs) (and [properties for CTMCs](/benchmarks/props-ctmc/))
-   [probabilistic timed automata (PTAs)](/benchmarks/models/#ptas) (and [properties for PTAs](/benchmarks/props-pta/))
-   [(turn-based) stochastic multi-player games (SMGs)](/benchmarks/models/#smgs) (and [properties for SMGs](/benchmarks/props-smg/))

The benchmarks themselves are hosted on GitHub:

-   [https://github.com/prismmodelchecker/prism-benchmarks/](https://github.com/prismmodelchecker/prism-benchmarks/)

Check out the repository, or download it as a [zip file](https://github.com/prismmodelchecker/prism-benchmarks/archive/master.zip).

PRISM includes useful scripts for [automating benchmarking](https://github.com/prismmodelchecker/prism/wiki/Benchmarking), notably [prism-auto](https://github.com/prismmodelchecker/prism/blob/master/prism/etc/scripts/prism-auto) and [prism-log-extract](https://github.com/prismmodelchecker/prism/blob/master/prism/etc/scripts/prism-log-extract). For example, these commands:

```shell
git clone https://github.com/prismmodelchecker/prism-benchmarks
```

```shell
prism-auto prism-benchmarks/models/dtmcs --filter-models "states<10000" --args-list "-pow,-jac,-gs" --log logs --log-subdir
```

```shell
prism-log-extract logs --groupby=log_dir --groupkey=benchmark --fields=time_check > times.csv
```

run PRISM on all DTMC benchmark instances with less than 10,000 states using three different methods and then collate the run times in a CSV file for easy analysis.

See the [benchmarking](https://github.com/prismmodelchecker/prism/wiki/Benchmarking) section of the PRISM Developer Resources for more details.

If you need the benchmarks in another format, don't forget that PRISM can [export models in various formats](/manual/RunningPRISM/ExportingTheModel).

Comments or suggestions regarding this benchmark set, as well as contributed models, are [welcome](/contact/).

<div class="prism-citebox"><div class="prism-citeboxheader">To cite the PRISM benchmark suite, please use:</div><ul><li><a href="http://www.cs.ox.ac.uk/people/marta.kwiatkowska/">Marta Kwiatkowska</a>, <a href="http://www.dcs.gla.ac.uk/people/personal/gethin/">Gethin Norman</a> and <a href="http://www.cs.bham.ac.uk/~parkerdx/">David Parker</a>. <a href="/bibitem/KNP12b/">The PRISM Benchmark Suite</a>. In <em>Proc. 9th International Conference on Quantitative Evaluation of SysTems (QEST'12)</em>, IEEE CS Press, 2012. [<a href="/papers/qest12.pdf">pdf</a>] [<a href="/bibtex/KNP12b.bib">bib</a>]</li></ul></div>

The contents of the PRISM benchmark suite are distributed under the [CC-BY 4.0](https://creativecommons.org/licenses/by/4.0/) license: you are free to copy, edit and redistribute it, but please give appropriate credit.
