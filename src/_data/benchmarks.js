// The PRISM benchmark suite: the models and properties in its models.json files, one per model
// type, from a checkout of https://github.com/prismmodelchecker/prism-benchmarks
// ($PRISM_BENCHMARKS, or ../prism-benchmarks). Used by the pages in src/benchmarks/.

import fs from "node:fs";
import path from "node:path";

const DIR = process.env.PRISM_BENCHMARKS || "../prism-benchmarks";

const TYPES = [
	{ id: "dtmc", title: "Discrete-time Markov chains" },
	{ id: "mdp", title: "Markov decision processes",
		note: "\"PTA model\" indicates that the MDP was constructed from a probabilistic timed automaton (PTA) using digital clocks." },
	{ id: "ctmc", title: "Continuous-time Markov chains" },
	{ id: "pta", title: "Probabilistic timed automata",
		note: "Model sizes are not available for PTAs since the whole (infinite-state) model is never explicitly constructed." },
	{ id: "smg", title: "Stochastic multi-player games",
		note: "We use the names stochastic multi-player game (SMG) and turn-based stochastic game (TSG) interchangeably." },
];

export default function () {
	if (process.env.MANUAL_ONLY) return {};
	const types = {};
	for (const type of TYPES) {
		const file = path.join(DIR, "models", `${type.id}s`, "models.json");
		if (!fs.existsSync(file)) {
			console.warn(`[benchmarks] no ${file}: set PRISM_BENCHMARKS to a checkout of prism-benchmarks`);
			types[type.id] = { ...type, acronym: type.id.toUpperCase(), models: [], properties: [] };
			continue;
		}
		const { models } = JSON.parse(fs.readFileSync(file, "utf8"));
		const properties = models.flatMap((m) => (m.properties || []).map((p) => ({ ...p, model: m.name })));
		types[type.id] = { ...type, acronym: type.id.toUpperCase(), models, properties,
			hasMinMax: properties.some((p) => p["min-max"]) };
	}
	return types;
}
