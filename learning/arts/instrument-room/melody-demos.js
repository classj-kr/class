(function () {
    "use strict";
    // Times are quarter-note beats. Most excerpts use four measures and a
    // closing note; the organ's free opening spells out its fermatas below.
    function melody(rows, gate = .94, transpose = 0) {
        return rows.map(([beat, midi, length, velocity = .7]) =>
            [beat, [midi + transpose], velocity, length * gate]);
    }
    // Dvorak, Symphony 9/II, English horn solo, mm. 7–10 (written in F).
    // Concert pitches below are seven semitones below the written part.
    // https://www.nromusic.org/wp-content/uploads/2026/09/03__NRO-2027-Audition-Book-English-Horn.pdf
    const largo = [
        [0,65,.75],[.75,68,.25],[1,68,1],[2,65,.75],[2.75,63,.25],[3,61,1],
        [4,63,.75],[4.75,65,.25],[5,68,.75],[5.75,65,.25],[6,63,2],
        [8,65,.75],[8.75,68,.25],[9,68,1],[10,65,.75],[10.75,63,.25],[11,61,1],
        [12,63,.5],[12.5,65,.5],[13,63,.75],[13.75,61,.25],[14,61,2],[16,61,1]
    ];
    // Morricone, Gabriel's Oboe, solo opening, four bars in concert D.
    // Molenaar's publisher preview, rehearsal A (mm. 14–17). Ties are merged;
    // the first-beat turn retains its triplet, without shifting beat two.
    // https://www.molenaar.com/files/pdf/01319405_mini_score.pdf
    const gabriel = [
        [0,69,1/3],[1/3,71,1/6],[.5,69,1/6],[2/3,67,1/3],
        [1,69,2.5],[3.5,69,.5],
        [4,74,.25],[4.25,76,.25],[4.5,74,.25],[4.75,73,.25],
        [5,73,.25],[5.25,74,.25],[5.5,73,.25],[5.75,71,.25],
        [6,71,.5],[6.5,69,3],
        [9.5,69,.5],[10,74,.75],[10.75,76,.125],[10.875,74,.125],
        [11,73,.75],[11.75,74,.125],[11.875,73,.125],
        [12,71,2.5],[14.5,74,.5],[15,73,.5],[15.5,71,.5],[16,74,1]
    ];
    // Dukas, The Sorcerer's Apprentice, rehearsal 7, first four 3/8 bars.
    // https://www.orchestralbassoon.com/dukas-apprentice-part-1
    const apprentice = [[0,53,1],[1.5,60,1],[3,48,.5],[3.5,50,.5],[4,52,.5],
        [4.5,53,.5],[5.5,56,.5],[6,53,1]];
    // Beethoven, Ode to Joy: four-bar opening, arranged in C for imitation.
    // https://www.carnegiehall.org/Education/Programs/Link-Up/National-Program/The-Orchestra-Sings/Ode-to-Joy
    const joy = [[0,64,1],[1,64,1],[2,65,1],[3,67,1],[4,67,1],[5,65,1],[6,64,1],[7,62,1],
        [8,60,1],[9,60,1],[10,62,1],[11,64,1],[12,64,1.5],[13.5,62,.5],[14,62,2],[16,60,1]];
    // Petzold, Minuet in G, BWV Anh. 114, first four 3/4 bars, melody only.
    // https://www.mutopiaproject.org/ftp/BachJS/BWVAnh114/anna-magdalena-04/anna-magdalena-04.ly
    const minuet = [[0,74,1],[1,67,.5],[1.5,69,.5],[2,71,.5],[2.5,72,.5],
        [3,74,1],[4,67,1],[5,67,1],[6,76,1],[7,72,.5],[7.5,74,.5],[8,76,.5],[8.5,78,.5],
        [9,79,1],[10,67,1],[11,67,1],[12,67,1]];
    // Stevie Wonder, Superstition: main Clavinet 1 riff, first four bars.
    // Northwestern scholarly transcription, Figure 5.2, p. 177. The x-head
    // in the bass line is represented by a quiet, short ghost note.
    // https://arch.library.northwestern.edu/downloads/v692t659j?locale=en
    const riffA = [[0,39,.42,.85],[.5,51,.4,.7],[1,49,.4,.74],[1.5,51,.4,.8],
        [2,54,.17,.85],[2.5,49,.08,.25],[3,49,.65,.76],[3.75,49,.16,.65]];
    const riffB = [[0,44,.42,.82],[.5,46,.4,.72],[1,49,.4,.76],[1.5,51,.4,.8],
        [2,54,.67,.86],[2.75,49,.4,.7],[3.25,46,.17,.66],[3.5,49,.17,.72],[3.75,51,.17,.8]];
    function swing(beat) {
        const whole = Math.floor(beat), part = beat - whole;
        return whole + (part === .25 || part === .75 ? part + .06 : part);
    }
    const superstition = [riffA, riffB, riffA, riffB].flatMap((bar, i) =>
        bar.map(([beat, midi, length, velocity]) => [i * 4 + swing(beat), [midi], velocity, length]));
    superstition.push([16,[39],.85,1]);
    // Bach, BWV 565: the three octave calls, diminished arpeggio and open-D
    // resolution. The mordents are played A–G–A, not an upper-neighbour trill.
    // Fermatas are expanded for a short, recognisable free-time demonstration.
    // Source: Breitkopf & Härtel, 1867, opening transcribed here:
    // https://commons.wikimedia.org/wiki/File:Toccata-Fugue-BWV565_Bach-intro.svg
    const toccata = [];
    function organCall(beat, high, descending) {
        [[0, high, .085], [.09, high - 2, .085], [.18, high, .92],
            ...descending.map(([offset, distance, length]) => [offset, high + distance, length])]
            .forEach(([offset, midi, length]) => toccata.push([beat + offset, [midi - 12, midi], .58, length]));
    }
    const organDescent = [[1.35,-2,.065],[1.42,-4,.065],[1.49,-5,.065],
        [1.56,-7,.075],[1.64,-8,.14],[1.8,-7,.5]];
    organCall(0,81,organDescent);
    organCall(2.5,69,[[1.35,-5,.13],[1.5,-4,.13],[1.65,-8,.13],[1.8,-7,.5]]);
    organCall(5,57,organDescent);
    toccata.push([7.65,[38],.56,3.5]);
    [49,52,55,58,61,64].forEach((midi,index) =>
        toccata.push([7.7 + index * .12,[midi],.52,1.95 - index * .12]));
    toccata.push([9.8,[38,50,57,62],.58,1.9]);
    const demos = {
        "pipe-organ": [{title:"토카타와 푸가 라단조 · BWV 565",bpm:72,notes:toccata,endBeat:12}],
        clavinet: [{title:"Superstition",bpm:100,notes:superstition,endBeat:17}],
        oboe: [{title:"가브리엘의 오보에",bpm:72,notes:melody(gabriel),endBeat:17,articulation:"sustain"}],
        "english-horn": [{title:"신세계 교향곡 · 라르고",bpm:56,notes:melody(largo),endBeat:17,articulation:"sustain"}],
        bassoon: [{title:"마법사의 제자",bpm:96,notes:melody(apprentice,.7),endBeat:7,articulation:"sustain"}],
        contrabassoon: [{title:"마법사의 제자",bpm:96,notes:melody(apprentice,.7,-12),endBeat:7,articulation:"sustain"}]
    };
    for (const [model, transpose] of [["recorder-piccolo",24],["recorder-soprano",12],["recorder-alto",12],["recorder-tenor",0]]) {
        const minuetTranspose = transpose === 0 ? 0 : transpose === 24 ? 12 : model === "recorder-alto" ? 0 : 12;
        demos[model] = [
            {title:"환희의 송가",bpm:100,notes:melody(joy,.88,transpose),endBeat:17},
            {title:"미뉴에트",bpm:104,notes:melody(minuet,.88,minuetTranspose),endBeat:13}
        ];
    }
    window.INSTRUMENT_MELODY_DEMOS = demos;
}());
