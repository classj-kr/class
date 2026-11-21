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
    // Free Adagio: these beats equal seconds (quarter = 60). Four calls,
    // as printed: octave, single treble, single bass, octave bass. Fermatas
    // and the silences between calls are explicit, not compressed into bars.
    const toccata = [];
    function organCall(start, high, doubled, shortDescent) {
        const phrase = [[0,high,.11],[.12,high-2,.11],[.24,high,1.4]];
        const descent = shortDescent
            ? [[1.86,-5,.19],[2.06,-4,.19],[2.26,-8,.19],[2.46,-7,1.35]]
            : [[1.86,-2,.09],[1.96,-4,.09],[2.06,-5,.09],[2.16,-7,.09],[2.26,-8,.19],[2.46,-7,1.35]];
        descent.forEach(([offset,distance,length]) => phrase.push([offset,high+distance,length]));
        phrase.forEach(([offset,midi,length]) =>
            toccata.push([start+offset,doubled?[midi-12,midi]:[midi],.58,length,false,"detached"]));
    }
    organCall(0,81,true,false);
    organCall(4.5,69,false,true);
    organCall(9,57,false,true);
    organCall(13.5,57,true,false);
    // The pedal D is tied through the cadence: keep one continuous source.
    toccata.push([18,[38],.56,7.5]);
    [49,52,55,58,61,64].forEach((midi,index) =>
        toccata.push([18.15+index*.16,[midi],.52,2.8-index*.16]));
    toccata.push([22,[50,57,62],.58,3]);
    // Concert-pitch solo excerpts, without orchestral lead-ins.
    // Horn: K.495/III pickup + mm.1–8, Eb horn part transposed down a sixth.
    // https://www.mfiles.co.uk/scores/mozart-horn-concerto4-3-rondo-horn-solo.pdf
    // Clarinet: K.622/II mm.1–8, A clarinet part down a minor third.
    // https://www.mfiles.co.uk/scores/mozart-clarinet-concerto-2-solo-clarinet-part.pdf
    // Trumpet: Hob.VIIe:1/III mm.45–56, Eb trumpet part up a minor third.
    // IMSLP258244, Michel Rondeau's part, p.5 (quarter circa 130).
    // Flute: BWV1067/7 pickup + mm.1–8, original B minor, quarter 120.
    // https://www.flutetunes.com/tunes/bach-orchestral-suite-no-2-badinerie.pdf
    // Detached note-offs describe phrasing only. The recorded attack is intact.
    function solo(rows, gate, velocity) {
        return rows.map(([beat,midi,length]) => [beat,[midi],velocity,length*gate,false,"detached"]);
    }
    const hornRondo = [[0.0,58,0.5],[0.5,63,0.5],[1.0,63,0.5],[1.5,63,0.5],[2.0,63,0.5],[2.5,63,0.5],[3.0,63,0.5],[3.5,62,0.5],[4.0,65,0.5],[4.5,70,0.5],[5.0,70,0.5],[5.5,68,0.5],[6.0,65,0.5],[6.5,63,0.5],[7.0,63,0.5],[7.5,63,0.5],[8.0,63,0.5],[8.5,62,0.5],[9.0,63,0.5],[9.5,65,0.5],[10.0,58,0.5],[10.5,58,0.5],[11.0,58,1.0],[12.0,58,0.5],[12.5,63,0.5],[13.0,63,0.5],[13.5,63,0.5],[14.0,63,0.5],[14.5,63,0.5],[15.0,63,0.5],[15.5,62,0.5],[16.0,65,0.5],[16.5,70,0.5],[17.0,70,0.5],[17.5,68,0.5],[18.0,65,0.5],[18.5,67,0.5],[19.0,70,0.5],[19.5,63,0.375],[19.875,67,0.125],[20.0,65,0.5],[20.5,63,0.5],[21.0,65,0.5],[21.5,63,0.5],[22.0,51,0.5],[22.5,51,0.5],[23.0,51,1.0]];
    const clarinetAdagio = [[0,69,1],[1,74,1.5],[2.5,78,0.5],[3,78,0.5],[3.5,76,0.5],[4,74,1],[6,69,1.5],[7.5,74,0.5],[8,78,0.5],[8.5,81,0.5],[9,81,0.5],[9.5,79,0.5],[10,78,1],[12,76,1.5],[13.5,81,0.5],[14,78,0.5],[14.5,81,0.5],[15,76,1.5],[16.5,81,0.5],[17,71,0.5],[17.5,78,0.5],[18,69,2],[20,73,0.1875],[20.1875,71,0.5625],[20.75,69,0.25],[21,69,1]];
    const trumpetFinale = [[0,70,1.5],[1.5,75,0.5],[2,72,1.5],[3.5,75,0.5],[4,74,0.5],[4.5,77,0.5],[5,70,0.5],[5.5,74,0.5],[6,75,1],[7.5,75,0.5],[8,74,0.5],[8.5,77,0.5],[9,70,0.5],[9.5,74,0.5],[10,75,1],[11.5,75,0.5],[12,74,0.25],[12.25,75,0.25],[12.5,77,0.25],[12.75,74,0.25],[13,70,0.25],[13.25,72,0.25],[13.5,74,0.25],[13.75,70,0.25],[14,75,1.5],[15.5,77,0.25],[15.75,79,0.25],[16,80,0.5],[16.5,80,0.5],[17,79,0.5],[17.5,79,0.5],[18,77,0.5],[18.5,77,0.5],[19,75,0.5],[19.5,75,0.5],[20,74,0.25],[20.25,75,0.25],[20.5,77,0.25],[20.75,79,0.25],[21,77,0.25],[21.25,75,0.25],[21.5,74,0.25],[21.75,72,0.25],[22,70,1]];
    const badinerie = [[0.0,83,0.5],[0.5,86,0.25],[0.75,83,0.25],[1.0,78,0.5],[1.5,83,0.25],[1.75,78,0.25],[2.0,74,0.5],[2.5,78,0.25],[2.75,74,0.25],[3.0,71,1.0],[4.0,66,0.25],[4.25,71,0.25],[4.5,74,0.25],[4.75,71,0.25],[5.0,73,0.25],[5.25,71,0.25],[5.5,73,0.25],[5.75,71,0.25],[6.0,70,0.25],[6.25,73,0.25],[6.5,76,0.25],[6.75,73,0.25],[7.0,74,0.5],[7.5,71,0.5],[8.0,83,0.5],[8.5,86,0.25],[8.75,83,0.25],[9.0,78,0.5],[9.5,83,0.25],[9.75,78,0.25],[10.0,74,0.5],[10.5,78,0.25],[10.75,74,0.25],[11.0,71,1.0],[12.0,74,0.5],[12.5,74,0.5],[13.0,74,0.5],[13.5,74,0.5],[14.0,83,0.5],[14.5,74,0.5],[15.0,74,0.125],[15.125,76,0.125],[15.25,74,0.125],[15.375,76,0.125],[15.5,73,0.5],[16.0,78,0.5],[16.5,66,0.25],[16.5,78,0.5]];
    const demos = {
        "french-horn": [{title:"모차르트 호른 협주곡 4번 · 론도",bpm:171,notes:solo(hornRondo,.86,.7),endBeat:24.5,articulation:"sustain"}],
        clarinet: [{title:"모차르트 클라리넷 협주곡 · 아다지오",bpm:57,notes:solo(clarinetAdagio,.99,.62),endBeat:24,articulation:"sustain"}],
        trumpet: [{title:"하이든 트럼펫 협주곡 · 3악장",bpm:130,notes:solo(trumpetFinale,.88,.7),endBeat:24,articulation:"sustain"}],
        flute: [{title:"바흐 바디네리",bpm:120,notes:solo(badinerie,.92,.67),endBeat:17,articulation:"sustain"}],
        "pipe-organ": [{title:"토카타와 푸가 라단조 · BWV 565",bpm:60,notes:toccata,endBeat:25.5}],
        clavinet: [{title:"Superstition · 스티비 원더",bpm:100,notes:superstition,endBeat:17}],
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
