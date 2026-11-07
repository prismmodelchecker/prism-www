---
layout: layouts/base.njk
title: "Other downloads"
section: downloads
permalink: /other-downloads/
---
# Other downloads

PRISM includes or adapts several pieces of software developed elsewhere. This pages lists them, and provides links and downloads.

Typically, the version numbers given here refer to the libraries currently distributed with the latest [development version on GitHub](https://github.com/prismmodelchecker/prism).

## Integrated components

The following are incorporated within the PRISM codebase:

-   **CUDD**: PRISM includes a modified version of the [CUDD](http://vlsi.colorado.edu/~fabio/CUDD/) package, a BDD/MTBDD library developed by [Fabio Somenzi](https://www.colorado.edu/ecee/fabio-somenzi) at [Colorado University](http://www.colorado.edu/) released under a [BSD-style license](https://github.com/prismmodelchecker/cudd/blob/master/LICENSE). We build on CUDD 3.0.0 and modifications are kept at [https://github.com/prismmodelchecker/cudd](https://github.com/prismmodelchecker/cudd).
-   **LTL 2 BA and ltl2dstar**: PRISM's LTL model checking functionality includes Java ports, by Carlos Bederian, of [LTL 2 BA](http://www.lsv.ens-cachan.fr/~gastin/ltl2ba/) (by Denis Oddoux & Paul Gastin) and [ltl2dstar](http://www.ltl2dstar.de/) (by Joachim Klein), [GPL](http://www.gnu.org/licenses/gpl.html)\-licensed tools for LTL-to-automata translation.

## Java libraries

PRISM includes various pre-compiled Java libraries, usually as JAR files. To check the version numbers of libraries included in a particular release, check the file [lib/README.md](https://github.com/prismmodelchecker/prism/blob/master/prism/lib/README.md).

-   **Colt**: PRISM's simulator uses parts of [Colt](http://acs.lbl.gov/software/colt/), a free numerical library in Java, developed at CERN by Wolfgang Hoschek and released under under a [BSD-style](http://acs.lbl.gov/software/colt/license.html) license (we include only packages `cern.colt.*`, `cern.jet.*`, `cern.clhep`). PRISM includes a binary version (JAR file) for version 1.2.0 of the library. You can download source code version for that version here: [colt-1.2.0.tar.gz](/dl/other/colt-1.2.0.tar.gz).
-   **EPS Graphics**: The PRISM GUI uses the [EPS Graphics](http://www.abeel.be/taxonomy_menu/2/3) library to provide export of graphs to EPS files. PRISM includes a pre-compiled copy of version 1.0.0 of the library, which was released under the [GPL](http://www.gnu.org/licenses/gpl.html). You can download a full source code version here: [epsgraphics-1.0.0-src.zip](/dl/other/epsgraphics-1.0.0-src.zip).
-   **Java Algebra System (JAS)**: PRISM's parametric model checking functionality uses parts of [JAS](http://krum.rz.uni-mannheim.de/jas/) (the Java Algebra System), a library for algebraic computations in Java released under the [GPL](http://www.gnu.org/licenses/gpl.html)/. PRISM includes a binary version (JAR file) for version 2.7.90 of the library. You can download source code for that version here: [jas-2.7.90-src.zip](/dl/other/jas-2.7.90-src.zip).
-   **Log4j**: The Apache [Log4j](http://logging.apache.org/log4j/2.x/) package (version 2.16.0) is included as a dependency of [JAS](http://krum.rz.uni-mannheim.de/jas/).
-   **JCommon and JFreeChart**: The PRISM GUI includes a graph-plotting component based on [JFreeChart](http://www.jfree.org/jfreechart/). PRISM includes pre-compiled copies fofor version 1.0.13 of [JFreeChart](http://www.jfree.org/jfreechart/) and version 1.0.16 of its dependency [JCommon](http://www.jfree.org/jcommon/). JFreeChart/JCommon are released under the [LGPL](http://www.gnu.org/licenses/lgpl.html) and you can download full source code versions of these here: [jfreechart-1.0.13.tar.gz](/dl/other/jfreechart-1.0.13.tar.gz), [jcommon-1.0.16.tar.gz](/dl/other/jcommon-1.0.16.tar.gz).
-   **jhoafparser**: PRISM supports the [Hanoi Omega Automaton](http://adl.github.io/hoaf/) (HOA) format for importing deterministic omega automata. To to do this, it uses the [jhoafparser](http://automata.tools/hoa/jhoafparser/) HOA parser (by Joachim Klein and David Müller), released under the [LGPL](http://www.gnu.org/licenses/lgpl.html). PRISM includes a JAR file (also including source) for version 1.1.1.
-   **JUnit**: PRISM uses [JUnit](https://junit.org/) for regression tests, which is released under a GPL-compatible [license](https://github.com/junit-team/junit5/blob/main/LICENSE.md). PRISM includes a binary version (JAR file) for version 1.7.2 of the library. You can download a source code version for that release here: [junit-platform-console-standalone-1.7.2-sources.jar](/dl/other/junit-platform-console-standalone-1.7.2-sources.jar).
-   **Nailgun**: PRISM can use the [Nailgun](https://www.martiansoftware.com/nailgun/) server to avoid JVM start-up overhead. PRISM includes a pre-compiled copy of version 0.9.2-SNAPSHOT. It was released under the [Apache License](http://www.apache.org/licenses/LICENSE-2.0) and source code can be found [here](https://github.com/facebookarchive/nailgun).
-   **PEPA-to-PRISM Compiler**: PRISM includes a translator from [PEPA](http://www.dcs.ed.ac.uk/pepa/) to PRISM, developed by [Stephen Gilmore](http://www.dcs.ed.ac.uk/home/stg/) at the [University of Edinburgh](http://www.ed.ac.uk/). PRISM includes a pre-compiled copy of version 0.03.2. The compiler is released under the [GPL](http://www.gnu.org/licenses/gpl.html) and you can download the full source code version here: [pepa2prism-0.03.2.tar.gz](/dl/other/pepa2prism-0.03.2.tar.gz).

## Other libraries

PRISM and/or PRISM-games include various other libraries, mostly written in C/C++ but including Java interfaces.

-   **lp\_solve**: PRISM includes a modified version of [lp\_solve](https://lpsolve.sourceforge.net/5.5/), an [LGPL](http://www.gnu.org/licenses/lgpl.html)\-licensed Mixed Integer Linear Programming (MILP) solver. It builds on version 5.5.2.0 of lp\_solve and version 5.5.0.14 of the lp\_solve Java wrapper. Modifications can be found on GitHub: [lp\_solve\_5.5](https://github.com/prismmodelchecker/prism/tree/master/prism/ext/lpsolve55/src/lp_solve_5.5) and [lp\_solve\_5.5\_java](https://github.com/prismmodelchecker/prism/tree/master/prism/ext/lp_solve_5.5_java).
-   **Z3**: PRISM-games can use the [Z3](https://github.com/Z3Prover/z3) solver by Microsoft Research, released under the [MIT license](https://github.com/Z3Prover/z3/blob/master/LICENSE.txt). It currently includes version 4.12.4.
-   **Yices 2**: PRISM-games can use the [Yices 2](https://yices.csl.sri.com/) SMT solver via its [Java interface](https://github.com/SRI-CSL/yices2_java_bindings), which are released under the [GPL](http://www.gnu.org/licenses/gpl.html) and [MIT license](https://github.com/SRI-CSL/yices2_java_bindings/blob/master/LICENSE.txt), respectively. It currently includes version 2.6.4 and version 1.0.1 (approximately), respectively.
-   **Parma Polyhedron Library (PPL)**: PRISM-games can use the [Parma Polyhedron Library](https://www.bugseng.com/parma-polyhedra-library) (PPL), which is released under the [GPL](http://www.gnu.org/licenses/gpl.html). A modified version, based on PPL 2.1, is at [https://github.com/prismmodelchecker/ppl](https://github.com/prismmodelchecker/ppl), which eases the build process.

More information on building and integrating these dependencies can be found on the PRISM [developer wiki](https://github.com/prismmodelchecker/prism/wiki).
