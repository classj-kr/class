(function (root) {
    "use strict";

    const pointsOnRing = radius => [
        [-1,-1], [0,-1], [1,-1], [1,0], [1,1], [0,1], [-1,1], [-1,0]
    ].map(([x,y]) => [50 + x * radius, 50 + y * radius]);
    const ringEdges = offsets => offsets.flatMap(offset =>
        Array.from({length:8}, (_, i) => [offset + i, offset + (i + 1) % 8]));
    const rim = [[0,1],[1,2],[2,3],[3,0]];
    const boards = {
        well: {
            name:"우물고누", description:"말 2개로 상대 길 막기",
            rule:"선을 따라 빈 점으로 한 칸씩 옮겨요. 상대 말이 하나도 움직일 수 없으면 이겨요. 첫 수에는 먼저 두는 사람(방장)의 말 중 그 사람 쪽에서 보아 왼쪽 말만 가운데로 갈 수 있어요.",
            points:[[18,50],[50,18],[82,50],[50,82],[50,50]],
            edges:[rim[0],rim[1],rim[3],[0,4],[1,4],[2,4],[3,4]],
            arcs:3, initial:[1,2,2,1,0], home:1
        },
        pumpkin: {
            name:"호박고누", description:"말 3개로 상대 길 막기",
            rule:"선을 따라 빈 점으로 한 칸씩 옮겨요. 원에 들어간 말은 양쪽 진영으로 들어갈 수 없어요. 상대가 움직일 수 없으면 이겨요.",
            points:[[18,50],[50,18],[82,50],[50,82],[50,50],[18,6],[50,6],[82,6],[18,94],[50,94],[82,94]],
            edges:[...rim,[0,4],[1,4],[2,4],[3,4],[5,6],[6,7],[6,1],[8,9],[9,10],[9,3]],
            arcs:4, initial:[0,0,0,0,0,1,1,1,2,2,2], home:2
        },
        cham: {
            name:"참고누", description:"세 말을 이어 상대 말 잡기",
            rule:"말을 번갈아 12개씩 놓아요. 세 점을 이으면 상대 말을 하나 잡아요. 놓는 동안 잡힌 자리는 막히고, 더 놓을 수 없으면 표시를 걷고 말을 한 칸씩 움직여요. 상대 말이 두 개 이하가 되거나 움직일 수 없으면 이겨요.",
            points:[...pointsOnRing(42),...pointsOnRing(29),...pointsOnRing(16)],
            edges:[...ringEdges([0,8,16]),...Array.from({length:8}, (_, i) => [[i,i+8],[i+8,i+16]]).flat()],
            groups:[0,8,16].flatMap(offset => [0,2,4,6].map(i =>
                [offset+i,offset+(i+1)%8,offset+(i+2)%8])).concat(
                Array.from({length:8},(_,i)=>[i,i+8,i+16]))
        }
    };

    // 화면 방향: 장기·체스처럼 사람마다 자기 말이 아래로 오게 보인다. home은 말판 그림 그대로 보는 편이다.
    // 우물고누는 방장 말이 왼쪽·아래, 호박고누는 손님 말이 아래에 놓여 있다. 참고누는 빈 판에서 시작하니 돌리지 않는다.
    function flipped(kind, team) {
        const home = boards[kind].home;
        return home !== undefined && team !== home;
    }

    function initial(kind) {
        const board = boards[kind];
        return {
            kind, board:board.initial ? [...board.initial] : Array(24).fill(0),
            turn:1, phase:kind === "cham" ? "place" : "move",
            reserves:[0,12,12], blocked:[], winner:null, revision:0, seen:{}
        };
    }

    function legal(state) {
        if (state.winner !== null) return [];
        if (state.phase === "take") {
            return state.board.flatMap((value,to) => value === 3-state.turn ? [{to}] : []);
        }
        if (state.phase === "place") {
            return state.board.flatMap((value,to) => value === 0 && !state.blocked.includes(to) ? [{to}] : []);
        }
        const board = boards[state.kind];
        return board.edges.flatMap(edge => [edge,[edge[1],edge[0]]])
            .filter(([from,to]) => state.board[from] === state.turn && state.board[to] === 0 &&
                (state.kind !== "well" || state.revision > 0 || from === 0) &&
                (state.kind !== "pumpkin" || to < 5 || (from >= 5 && (from < 8) === (to < 8))))
            .map(([from,to]) => ({from,to}));
    }

    function finishTurn(state, placing) {
        state.turn = 3-state.turn;
        if (placing && (state.reserves[state.turn] === 0 ||
            !state.board.some((value,index) => value === 0 && !state.blocked.includes(index)))) {
            state.phase = "move";
            state.blocked = [];
        } else {
            state.phase = placing ? "place" : "move";
        }
        if ((state.kind === "cham" && state.phase === "move" &&
            state.board.filter(value => value === state.turn).length <= 2) || !legal(state).length) {
            state.winner = 3-state.turn;
        } else if (state.phase === "move") {
            const key = state.board.join("") + state.turn;
            state.seen[key] = (state.seen[key] || 0) + 1;
            if (state.seen[key] >= 3) state.winner = 0;
        }
    }

    function play(state, action) {
        const move = legal(state).find(candidate => candidate.from === action?.from && candidate.to === action?.to);
        if (!move) return null;
        const next = {...state, board:[...state.board], reserves:[...state.reserves], blocked:[...state.blocked],
            seen:{...state.seen}, revision:state.revision+1};
        if (state.phase === "take") {
            next.board[move.to] = 0;
            if (state.placingWhenTaking) next.blocked.push(move.to);
            finishTurn(next, state.placingWhenTaking);
            return next;
        }
        next.board[move.to] = state.turn;
        if (state.phase === "place") next.reserves[state.turn]--;
        else next.board[move.from] = 0;
        if (state.kind === "cham" && boards.cham.groups.some(group =>
            group.includes(move.to) && group.every(index => next.board[index] === state.turn)) &&
            next.board.includes(3-state.turn)) {
            next.phase = "take";
            next.placingWhenTaking = state.phase === "place";
        } else {
            finishTurn(next, state.phase === "place");
        }
        return next;
    }

    const rules = {boards, initial, legal, play, flipped};
    if (typeof module === "object" && module.exports) module.exports = rules;
    else root.GonuRules = rules;
})(globalThis);
