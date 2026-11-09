---
layout: layouts/base.njk
title: "PRISM-games: Installation"
section: games
permalink: /games/installation/
---
# PRISM-games: Installation

PRISM-games is known to run on Linux, Windows and macOS, both 64-bit and 32-bit versions.

We [provide](/games/download/) both binary and source releases. For more up-to-date source code, see the [GitHub repo](https://github.com/prismmodelchecker/prism-games).

-   [Installing binary releases](#binary)
-   [Compiling from source](#src)

* * *

## Installing binary releases { #binary }

For binary releases of PRISM-games, the situation is similar to PRISM. The **pre-requisites** are:

-   **Java**, version 9 or above: a Java Runtime Environment (JRE) suffices, e.g. from [Oracle](https://jdk.java.net/) or [AdoptOpenJDK](https://adoptopenjdk.net/)

Installation instructions are the [same as for PRISM](/manual/InstallingPRISM/Instructions). In short: [Download](/games/download/) PRISM-games. Then: for Windows, just run the installer executable; for other binaries, untar and run `./install.sh` from inside the directory:

```
tar xfz prism-games-3.2-linux64-x86.tar.gz
cd prism-games-3.2-linux64-x86
./install.sh
```

And to run PRISM-games: for Windows, double-click the short-cut; on other OSs, run `bin/xprism` for the GUI or `bin/prism` for the command-line version.

* * *

## Compiling from source { #src }

In most cases, compiling PRISM-games from source code should be the same as for PRISM. The **pre-requisites** are:

-   Java, version 9 or above: a Java Development Kit (JDK), e.g. from [Oracle](https://jdk.java.net/) or [AdoptOpenJDK](https://adoptopenjdk.net/)
-   GNU make and a C/C++ compiler (e.g. gcc/g++)

Compilation instructions are the [same as for PRISM](/manual/InstallingPRISM/Instructions).

On non-Windows platforms, untar and run `make` from inside the `prism` sub-directory:

```
tar xfz prism-games-3.2-src.tar.gz
cd prism-games-3.2-src/prism
make
```

Then, as for binaries, run bin/xprism for the GUI or bin/prism for the command-line version.

Compiling on Window needs [Cygwin](http://www.cygwin.com/). See [this page](/manual/InstallingPRISM/Instructions#cygwin) (about compiling PRISM) for details.

The source releases of PRISM-games includes binary copies of external libraries (Z3, Yices 2, PPL), which are copied to the `lib` directory at compile time. As of version 3.2.1, this also includes PPL on Windows, which was previously not supported. If you experience problems with these libraries at runtime, you can try compiling them yourself and putting the relevant native libraries and JAR files in `lib`. See [this page](/other-downloads/) for details of libraries and their versions. See the "Dependencies" section of the [developer wiki](https://github.com/prismmodelchecker/prism/wiki/) for more details about compilation.
