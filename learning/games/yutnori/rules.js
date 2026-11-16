((root) => {
    "use strict";

    const outer = Array.from({ length: 20 }, (_, index) => index);
    const shortcuts = {
        5: [5, 20, 21, 22, 23, 24, ...outer.slice(15), 0],
        10: [10, 25, 26, 22, 27, 28, 0],
        22: [22, 27, 28, 0]
    };
    const names = ["", "도", "개", "걸", "윷", "모"];
    const seconds = { throw: 5, move: 10 };
    // Each player draws all 16 four-stick combinations in their own shuffled
    // order. Keep future throws on the host, outside the broadcast game state.
    const throwBags = new WeakMap();

    function drawSticks(state, random) {
        if (!throwBags.has(state)) throwBags.set(state, state.players.map(() => []));
        const bag = throwBags.get(state)[state.turn];
        if (!bag.length) {
            for (let mask = 0; mask < 16; mask++) bag.push(mask);
            for (let i = bag.length - 1; i > 0; i--) {
                const j = Math.floor(random() * (i + 1));
                [bag[i], bag[j]] = [bag[j], bag[i]];
            }
        }
        const mask = bag.pop();
        return Array.from({length: 4}, (_, index) => Boolean(mask & (1 << index)));
    }

    function create(players) {
        if (![2, 4].includes(players.length)) throw new RangeError("Expected two or four players");
        return {
            players, turn: 0, revision: 0, results: [], throwing: true, winner: null, event: null,
            pieces: [0, 1].flatMap(team => Array.from({length: 4}, (_, slot) => ({
                id: team * 4 + slot, team, owner: players.length === 2 ? team : team + 2 * Math.floor(slot / 2),
                node: null, route: null, finished: false
            })))
        };
    }

    function routeFrom(piece) {
        if (piece.node === null) return [...outer, 0];
        if (piece.route?.length === 1) return piece.route;
        return shortcuts[piece.node] || piece.route;
    }

    function preview(state, id, result = 0) {
        const piece = state.pieces.find(item => item.id === id);
        const roll = state.results[result];
        if (state.throwing || !roll || !piece || piece.finished || piece.team !== state.turn % 2) return null;
        const route = routeFrom(piece);
        const remaining = route.slice(roll.steps);
        const path = route.slice(1, roll.steps + 1);
        if (!remaining.length) path.push(29);
        return { node: remaining[0] ?? null, route: remaining, path };
    }

    function act(state, sender, action, random = Math.random) {
        if (!action || !state || state.winner !== null || state.players[state.turn].id !== sender || action.revision !== state.revision) return false;
        if (action.kind === "throw" && state.throwing) {
            const sticks = drawSticks(state, random);
            const steps = sticks.filter(Boolean).length || 5;
            const roll = { sticks, steps };
            state.results.push(roll);
            state.throwing = steps >= 4;
            state.event = { kind: "roll", roll };
        } else if (action.kind === "move") {
            if (!Number.isInteger(action.result) || action.result < 0) return false;
            const move = preview(state, action.piece, action.result);
            if (!move) return false;
            const chosen = state.pieces.find(piece => piece.id === action.piece);
            const from = chosen.node;
            const group = state.pieces.filter(piece => piece === chosen ||
                (from !== null && !piece.finished && piece.team === chosen.team && piece.node === from));
            const caught = move.node === null ? [] : state.pieces.filter(piece =>
                !piece.finished && piece.team !== chosen.team && piece.node === move.node);
            const stacked = move.node !== null && state.pieces.some(piece =>
                !group.includes(piece) && !piece.finished && piece.team === chosen.team && piece.node === move.node);
            caught.forEach(piece => Object.assign(piece, {node: null, route: null}));
            group.forEach(piece => Object.assign(piece, {node: move.node, route: move.route, finished: move.node === null}));
            // Pieces that arrive together take the route of the incoming group.
            if (stacked) state.pieces.filter(piece => piece.team === chosen.team && piece.node === move.node)
                .forEach(piece => { piece.route = move.route; });
            const bonus = caught.length > 0;
            state.event = {kind: "move", id: chosen.id, group: group.map(piece => piece.id), from, path: move.path, caught: caught.length, stacked, bonus, finished: move.node === null};
            state.results.splice(action.result, 1);
            if (state.pieces.filter(piece => piece.team === chosen.team).every(piece => piece.finished)) state.winner = chosen.team;
            else if (bonus) state.throwing = true;
            else if (!state.results.length) {
                state.turn = (state.turn + 1) % state.players.length;
                state.throwing = true;
            }
        } else return false;
        state.revision += 1;
        return true;
    }

    function timeoutAction(state, selected, result = 0) {
        if (state.throwing) return {kind: "throw", revision: state.revision};
        const piece = preview(state, selected, result)
            ? selected
            : state.pieces.find(item => preview(state, item.id, result))?.id;
        return {kind: "move", piece, result, revision: state.revision};
    }

    const rules = { create, act, preview, names, seconds, timeoutAction };
    if (typeof module === "object" && module.exports) module.exports = rules;
    else root.YutRules = rules;
})(globalThis);
