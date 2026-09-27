(function (root, factory) {
    const api = factory();
    if (typeof module === "object" && module.exports) module.exports = api;
    root.IdiomCore = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
    "use strict";

    function shuffle(items, random = Math.random) {
        const result = [...items];
        for (let index = result.length - 1; index > 0; index -= 1) {
            const swapIndex = Math.floor(random() * (index + 1));
            [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
        }
        return result;
    }

    function normalizeProgress(raw, validIds) {
        const result = {};
        const allowed = new Set(validIds || []);
        if (!raw || typeof raw !== "object") return result;

        Object.entries(raw).forEach(([id, entry]) => {
            if (!allowed.has(id) || !entry || !["known", "review"].includes(entry.status)) return;
            result[id] = {
                status: entry.status,
                updatedAt: typeof entry.updatedAt === "string" ? entry.updatedAt : ""
            };
        });
        return result;
    }

    function summarize(data, progress) {
        const summary = { known: 0, review: 0, unseen: 0, total: data.length };
        data.forEach((idiom) => {
            const status = progress[idiom.id]?.status;
            if (status === "known") summary.known += 1;
            else if (status === "review") summary.review += 1;
            else summary.unseen += 1;
        });
        summary.percent = summary.total ? Math.round((summary.known / summary.total) * 100) : 0;
        return summary;
    }

    function filterDeck(data, filter, theme) {
        return data.filter((idiom) => {
            const themeMatches = !theme || theme === "전체" || idiom.theme === theme;
            const status = filter?.progress?.[idiom.id]?.status;
            const statusMatches = filter?.status === "review" ? status === "review" : true;
            return themeMatches && statusMatches;
        });
    }

    function textSimilarity(left, right) {
        const toBigrams = (value) => {
            const normalized = String(value || "").replace(/[^가-힣A-Za-z0-9]/g, "");
            const grams = new Set();
            for (let index = 0; index < normalized.length - 1; index += 1) {
                grams.add(normalized.slice(index, index + 2));
            }
            return grams;
        };
        const leftGrams = toBigrams(left);
        const rightGrams = toBigrams(right);
        if (!leftGrams.size || !rightGrams.size) return 0;
        let common = 0;
        leftGrams.forEach((gram) => {
            if (rightGrams.has(gram)) common += 1;
        });
        return common / Math.max(leftGrams.size, rightGrams.size);
    }

    // 한 문제의 보기에 같이 나오면 둘 다 정답처럼 읽히는 성어끼리 묶는다.
    // 뜻이 같거나(자업자득·인과응보) 같은 이야기에서 나와(모수자천·낭중지추) 뜻풀이·유래·삽화 어느 문제에서도 갈리지 않는 것들이다.
    const AMBIGUOUS_OPTION_GROUPS = [
        ["baekmi", "gungyeilhak", "nangjungjichu"],
        ["mosujacheon", "nangjungjichu"],
        ["tasanjiseok", "bulchihamun"],
        ["toego", "jeolchatakma"],
        ["gaegwacheonseon", "hwangoltaltae", "gwalmoksangdae"],
        ["gwalmoksangdae", "cheongchureoram"],
        ["ugongisan", "chiljeonpalgi", "gwontojungrae"],
        ["wasinsangdam", "gwontojungrae"],
        ["wasinsangdam", "tosagupaeng"],
        ["samyeonchoga", "gwontojungrae"],
        ["cheonsinmango", "sanjeonsujeon"],
        ["gojingamrae", "jeonhwawibok", "saeongjima"],
        ["baesujin", "samyeonchoga", "jintoeyangnan", "nuranjiwi"],
        ["gogunbuntu", "samyeonchoga"],
        ["sueojigyo", "gwanpojigyo", "gandamsangjo", "jukmagou"],
        ["isimjeonsim", "gandamsangjo"],
        ["gyeolchooseun", "gakgolnanmang"],
        ["sueojigyo", "samgochoryeo"],
        ["dongbyeongsangryeon", "yeokjisaji"],
        ["dongbyeongsangryeon", "yuyusangjong"],
        ["sipinsipsaek", "dongsangimong"],
        ["owoldongju", "dongsimhyeomnyeok", "gojangnanmyeong"],
        ["gapnoneulbak", "dongsangimong"],
        ["baekbalbaekjung", "sipjungpalgu"],
        ["bulmungaji", "sipjungpalgu"],
        ["samilcheonha", "yongdusami", "jagsimsamil"],
        ["geumsangcheomhwa", "ilseogijo"],
        ["josammosa", "osipbobaekbo", "daedongsoi"],
        ["maksangmakha", "osipbobaekbo", "daedongsoi"],
        ["jirokwima", "josammosa"],
        ["gwayubulgeup", "sajok"],
        ["sajok", "gyogaksaru"],
        ["yubimuhwan", "seongyeonjimyeong"],
        ["yumyeongmusil", "taksanggongnon"],
        ["yeonmokgueo", "gakjuguggeom"],
        ["jaeopjadeuk", "jaseungjabak", "ingwaeungbo"],
        ["sapilgwijeong", "ingwaeungbo"],
        ["gyeonmulsaengsim", "ajaninsu"],
        ["anhamuin", "huanmuchi"],
        ["anhamuin", "hogahowi"]
    ].map((group) => new Set(group));

    function hasAmbiguousMeaning(leftId, rightId) {
        return AMBIGUOUS_OPTION_GROUPS.some((group) => group.has(leftId) && group.has(rightId));
    }

    function rankDistractors(idiom, candidates, type, random) {
        return shuffle(candidates, random)
            .map((candidate) => {
                let score = 0;
                if (candidate.level === idiom.level) score += 6;
                if (candidate.theme === idiom.theme) score += 12;
                score += textSimilarity(idiom.meaning, candidate.meaning) * 5;
                score += textSimilarity(idiom.story, candidate.story) * (type === "story" || type === "image" ? 3 : 1);
                score += Math.max(0, 1 - Math.abs(idiom.word.length - candidate.word.length) / 4);
                return { candidate, score };
            })
            .sort((left, right) => right.score - left.score)
            .map((item) => item.candidate);
    }

    function selectDistractors(idiom, data, type, random = Math.random) {
        const usable = (item) => item.id !== idiom.id && !hasAmbiguousMeaning(idiom.id, item.id);
        const picked = rankDistractors(idiom, data.filter(usable), type, random).slice(0, 3);
        if (picked.length < 3) {
            // 차시가 작아 헷갈리는 짝을 빼면 보기가 모자랄 때는 전체 목록에서 채운다.
            const allData = Array.isArray(globalThis.IDIOM_DATA) ? globalThis.IDIOM_DATA : [];
            const pickedIds = new Set(picked.map((item) => item.id));
            const extra = allData.filter((item) => usable(item) && !pickedIds.has(item.id));
            picked.push(...rankDistractors(idiom, extra, type, random).slice(0, 3 - picked.length));
        }
        return picked;
    }

    function createQuestion(idiom, data, type, random = Math.random) {
        const promptType = type === "mixed"
            ? (random() < 0.5 ? "meaning" : "story")
            : type;
        const wrong = selectDistractors(idiom, data, promptType, random);
        const options = shuffle([idiom, ...wrong], random).map((item) => ({
            id: item.id,
            label: `${item.word} · ${item.hanja}`
        }));

        return {
            id: idiom.id,
            type: promptType,
            prompt: promptType === "image"
                ? "이 삽화에 해당하는 한자성어는?"
                : (promptType === "story" ? idiom.story : idiom.meaning),
            answerId: idiom.id,
            answerLabel: `${idiom.word} · ${idiom.hanja}`,
            source: idiom.source,
            options
        };
    }

    function buildQuiz(data, count = 10, type = "mixed", random = Math.random) {
        const normalizedType = ["meaning", "story", "image", "mixed"].includes(type) ? type : "mixed";
        return shuffle(data, random)
            .slice(0, Math.min(Math.max(1, count), data.length))
            .map((idiom) => createQuestion(idiom, data, normalizedType, random));
    }

    return { shuffle, normalizeProgress, summarize, filterDeck, hasAmbiguousMeaning, selectDistractors, createQuestion, buildQuiz };
});
