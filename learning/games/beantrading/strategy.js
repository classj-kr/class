(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory(require("./engine.js"));
  else root.BeanTradingStrategy = factory(root.BeanTrading);
})(typeof globalThis !== "undefined" ? globalThis : this, function (B) {
  "use strict";
  const beans = Object.fromEntries(B.BEANS.map(b => [b.id, b]));
  const fieldValue = f => B.payout(f.kind, f.count);
  function futureWeight(view) {
    if (view.turnNumber >= view.players.length * view.roundLimit) return 0;
    return view.round === view.roundLimit ? 0.35 : 0.7;
  }
  function value(fields, earned, weight) {
    return earned + fields.reduce((sum, f) => {
      const coins = fieldValue(f), next = beans[f.kind]?.prices[coins];
      return sum + coins + (next ? weight * f.count / next : 0);
    }, 0);
  }
  // A bounded search considers planting order and both fields, including the
  // coins banked and unfinished crops lost when a field must be harvested.
  function project(fields, kinds, weight) {
    let plans = [{ fields: fields.map(f => ({ kind: f.kind, count: f.count })), earned: 0, left: kinds.slice(), first: null }];
    for (let step = 0; step < kinds.length; step++) {
      const next = [];
      for (const plan of plans) for (const kind of new Set(plan.left)) {
        for (let field = 0; field < plan.fields.length; field++) {
          const old = plan.fields[field];
          const mustHarvest = !!old.count && old.kind !== kind;
          const options = old.count && old.kind === kind ? [false, true] : [mustHarvest];
          for (const harvest of options) {
            const updated = plan.fields.map(f => ({ ...f }));
            updated[field] = { kind, count: (harvest ? 0 : old.count) + 1 };
            const left = plan.left.slice(); left.splice(left.indexOf(kind), 1);
            const earned = plan.earned + (harvest ? fieldValue(old) : 0);
            next.push({ fields: updated, earned, left, first: plan.first || { kind, field, harvest }, score: value(updated, earned, weight) });
          }
        }
      }
      const unique = new Map();
      for (const plan of next.sort((a, b) => b.score - a.score)) {
        const key = JSON.stringify([plan.fields, plan.earned, plan.left.slice().sort()]);
        if (!unique.has(key)) unique.set(key, plan);
        if (unique.size === 8) break;
      }
      plans = [...unique.values()];
    }
    return plans[0];
  }
  function handValue(fields, hand, weight) {
    if (!weight) return 0;
    let result = hand.reduce((sum, c) => sum + (fields.some(f => f.kind === c.kind && fieldValue(f) < 4) ? 0.22 : 0.06), 0);
    if (hand.length && fields.every(f => f.count && f.kind !== hand[0].kind)) result -= 0.18;
    return result * weight / 0.7;
  }
  function estimate(view, id, hand, pending, market) {
    const fields = view.players.find(p => p.id === id)?.fields;
    if (!fields) return -Infinity;
    const weight = futureWeight(view);
    const plan = project(fields, [...pending, ...(view.turnPlayerId === id ? market : [])].map(c => c.kind), weight);
    return value(plan.fields, plan.earned, weight) + handValue(plan.fields, hand, weight);
  }
  function pool(view, id) { return [...(view.turnPlayerId === id ? view.market : []), ...view.hand]; }
  function paymentCards(view, id, kinds) {
    // Match the engine: the back of the hand is spent before the market.
    const available = pool(view, id).reverse(), result = [];
    for (const kind of kinds) {
      const i = available.findIndex(c => c.kind === kind);
      if (i < 0) return null;
      result.push(available.splice(i, 1)[0]);
    }
    return result;
  }
  function tradeGain(view, id, giveIds, receiveKinds) {
    const owned = pool(view, id), ids = new Set(giveIds);
    if (ids.size !== giveIds.length || giveIds.some(cid => !owned.some(c => c.id === cid)) || receiveKinds.some(k => !beans[k])) return -Infinity;
    const before = estimate(view, id, view.hand, view.pending, view.market);
    const after = estimate(view, id, view.hand.filter(c => !ids.has(c.id)),
      [...view.pending, ...receiveKinds.map(kind => ({ kind }))], view.market.filter(c => !ids.has(c.id)));
    return after - before;
  }
  function evaluateOffer(view, id, offer) {
    if (view.stage !== "trade" || offer.to !== id) return { accept: false, gain: -Infinity };
    const payment = paymentCards(view, id, offer.want);
    if (!payment) return { accept: false, gain: -Infinity, reason: "missing" };
    const gain = tradeGain(view, id, payment.map(c => c.id), offer.give.map(c => c.kind));
    return { accept: gain > 0.04, gain };
  }
  function choosePlant(view, id, cards, ordered = false) {
    if (!cards.length) return null;
    const fields = view.players.find(p => p.id === id)?.fields;
    if (!fields) return null;
    const plan = project(fields, (ordered ? cards.slice(0, 1) : cards).map(c => c.kind), futureWeight(view));
    return { ...plan.first, cardId: cards.find(c => c.kind === plan.first.kind).id };
  }
  function shouldPlantSecond(view, id) {
    const card = view.hand[0];
    return !!card && tradeGain(view, id, [card.id], [card.kind]) > 0.04;
  }
  function planOffer(view, id, pick = n => Math.floor(Math.random() * n)) {
    if (view.stage !== "trade") return null;
    const targets = view.players.filter(p => p.id !== id && (view.turnPlayerId === id || p.id === view.turnPlayerId));
    const candidates = [];
    for (const card of pool(view, id)) {
      for (const wanted of [null, ...B.BEANS.map(b => b.id)]) {
        const want = wanted ? [wanted] : [];
        const gain = tradeGain(view, id, [card.id], want);
        if (gain <= 0.04) continue;
        for (const target of targets) {
          // Other players' hands are deliberately unavailable. Prefer beans
          // useful to their visible fields; requests are possibilities only.
          const matching = target.fields.some(f => f.kind === card.kind && fieldValue(f) < 4);
          if (!matching && target.fields.every(f => f.count)) continue;
          const visiblePayment = wanted && target.id === view.turnPlayerId && view.market.some(c => c.kind === wanted);
          const likelihood = !wanted || visiblePayment ? 1 : 1 - (1 - beans[wanted].count / 120) ** (target.handCount ?? 5);
          const score = gain * likelihood + (matching ? 0.15 : 0) + (wanted && !target.fields.some(f => f.kind === wanted) ? 0.02 : 0);
          candidates.push({ to: target.id, giveIds: [card.id], want, score });
        }
      }
    }
    if (!candidates.length) return null;
    const best = Math.max(...candidates.map(c => c.score));
    const tied = candidates.filter(c => c.score >= best - 0.02);
    const chosen = tied[pick(tied.length)];
    return { to: chosen.to, giveIds: chosen.giveIds, want: chosen.want };
  }
  return { evaluateOffer, choosePlant, shouldPlantSecond, planOffer, tradeGain, paymentCards };
});
