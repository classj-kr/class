/* Original, code-native biological diagrams. Positions and motion are illustrative,
   not measurements of speed, size, or development time. See the audit references. */
'use strict';
(function () {
    const leaf = `<path d="M18 139 Q54 34 179 51 Q199 138 73 171 Q38 171 18 139Z" fill="#7fae62" stroke="#487649" stroke-width="2"/><path d="M25 147 Q92 112 171 60 M61 129 L56 91 M91 112 L95 71 M120 94 L145 99 M66 132 L95 146" fill="none" stroke="#bdd39b" stroke-width="2"/>`;
    // A cabbage-white egg stands on a flattened attachment point; it is not a cut chicken egg.
    // A complete curved contour and subtle shading distinguish the attached base from a cutaway.
    const egg = `<g data-life-part="egg">
        <ellipse cx="102" cy="139" rx="20" ry="4.5" fill="#395a2b" opacity=".16"/>
        <path data-life-part="egg-shell" d="M100 77 C107 77 113 89 117 105 C120 117 120 129 117 134 C113 141 87 141 83 134 C80 129 80 117 83 105 C87 89 93 77 100 77Z" fill="url(#specimen-egg)" stroke="#a98d48" stroke-width="1.1"/>
        <g fill="none" stroke-linecap="round" stroke="#c4aa62" stroke-width=".85">
            <path d="M95 81 C87 96 85 117 87 134 M98 79 C93 98 92 121 93 137 M101 80 C100 99 100 123 101 138 M104 81 C109 98 111 119 109 137 M107 85 C115 104 117 119 114 134"/>
        </g>
        <path d="M95 86 C89 100 88 115 89 126" fill="none" stroke="#fff9d9" stroke-width="2.1" stroke-linecap="round" opacity=".8"/>
        <path d="M88 135 Q100 140 113 135" fill="none" stroke="#d9be76" stroke-width=".9"/>
    </g>`;
    const larvalSegments = [34,46,58,70,82,94,106,118,130,141];
    const larva = `<g data-life-part="caterpillar">
        ${larvalSegments.map((x,i)=>{
            const y=109-Math.sin(i/9*Math.PI)*3, proleg=[0,3,4,5,6].includes(i), thoracic=i>=7;
            return `<g class="life-crawl-segment" data-life-motion="crawl" data-crawl-segment="${i}" style="--crawl-delay:${i*.09}s">
                ${proleg?`<g data-life-part="proleg-pair"><path d="M${x-3} ${y+6} q-3 9 0 11 l4 0 q3-4 2-11" fill="#71914c" stroke="#506e38" stroke-width=".85"/><path d="M${x-1} ${y+7} q-2 8 0 11 q4 2 6-1 l1-8" fill="#93b55b" stroke="#587e3e" stroke-width=".85"/><path d="M${x} ${y+17} l4 0" stroke="#4d6835" stroke-width="1.2"/></g>`:''}
                ${thoracic?`<g data-life-part="thoracic-leg-pair" fill="none" stroke-linecap="round"><path d="M${x-2} ${y+7} l1 7 5 3" stroke="#486539" stroke-width="1.5"/><path d="M${x+2} ${y+8} l2 7 5 3 1-2" stroke="#637c3a" stroke-width="1.8"/></g>`:''}
                <ellipse cx="${x}" cy="${y}" rx="${i===0?8:9.5}" ry="${i===0?8:10.5}" fill="url(#specimen-larva)" stroke="#648b41" stroke-width=".65"/>
                <path d="M${x-6} ${y-7} Q${x} ${y-9} ${x+7} ${y-7}" fill="none" stroke="#dae483" stroke-width="1.5"/>
                <path d="M${x-4} ${y+5} l5 .2" stroke="#d4db79" stroke-width="1.2" stroke-linecap="round"/>
                <ellipse cx="${x+3}" cy="${y+3}" rx=".7" ry="1" fill="#6c793e"/>
                <path d="M${x-3} ${y-8} l-1-2 M${x+3} ${y-8} l1-2 M${x-5} ${y} l-2-1" stroke="#b8cf88" stroke-width=".45"/>
            </g>`;
        }).join('')}
        <g class="life-crawl-segment" data-life-motion="crawl-head" data-crawl-segment="head" style="--crawl-delay:.9s">
            <path data-life-part="head" d="M146 102 C153 99 157 104 158 110 L155 117 Q148 119 145 113 Q142 107 146 102Z" fill="url(#specimen-larva)" stroke="#526f38" stroke-width=".9"/>
            <path d="M151 103 Q148 109 153 113" fill="none" stroke="#809a4a" stroke-width=".65"/>
            <g fill="#3d4e2d">${[[154,109],[155,110.5],[155,112],[154,113.4],[152.6,113],[152.5,111.2]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r=".45"/>`).join('')}</g>
            <path d="M157 112 l2 1" stroke="#8b9e54" stroke-width=".8" stroke-linecap="round"/>
            <g class="life-chew" data-life-motion="chew"><path d="M154 116 l3-1 -.5 2 M156 116 l1 2" fill="none" stroke="#4d592e" stroke-width="1" stroke-linecap="round"/></g>
        </g>
    </g>`;
    const pupa = `<path d="M127 26 L114 174" stroke="#91704c" stroke-width="9" stroke-linecap="round"/><path d="M126 42 Q117 57 116 86 L100 93 110 108 106 128 Q108 151 116 157 L120 143 132 119 131 96 142 85 132 72Z" fill="#a9b36f" stroke="#68784c" stroke-width="2"/><path d="M126 51 L123 95 132 115 M116 89 L126 103 111 126 M111 134 L121 139 M113 143 L118 145" fill="none" stroke="#6f854f" stroke-width="1.5"/><path d="M117 151 L111 161 M125 70 Q79 106 131 112" fill="none" stroke="#e8dfc4" stroke-width="2.5"/><path d="M125 70 Q79 106 131 112" fill="none" stroke="#9d956f" stroke-width=".65"/>`;
    // Dorsal observation: four separate wings and six legs join the thorax, not the abdomen.
    function butterflySide(mirror=false) {
        return `<g${mirror?' transform="translate(200 0) scale(-1 1)"':''}>
            <g class="life-wing" data-life-motion="wing">
                <path data-life-part="hindwing" data-attached-to="thorax" d="M95 89 C82 94 49 89 36 112 C22 140 45 163 64 151 Q86 139 98 94Z" fill="url(#specimen-wing)" stroke="#7d8774" stroke-width=".9"/>
                <path d="M93 94 Q58 111 44 138 M90 98 Q69 124 61 145 M87 101 Q76 119 75 136 M75 104 L42 115" fill="none" stroke="#c4c8b4" stroke-width=".7"/>
                <path data-life-part="forewing" data-attached-to="thorax" d="M96 77 C83 50 51 24 29 29 C10 34 21 67 29 80 C43 99 70 103 95 89Z" fill="url(#specimen-wing)" stroke="#707d70" stroke-width="1"/>
                <path d="M30 29 C17 31 19 48 22 59 L29 55 28 47 36 48 36 39 46 41 Q39 32 30 29Z" fill="#414a40"/>
                <path d="M94 79 Q59 52 34 36 M93 81 Q61 62 26 54 M92 84 Q62 76 29 73 M93 87 Q64 89 43 88 M63 60 L57 44 M63 74 L52 61" fill="none" stroke="#bec6b0" stroke-width=".75"/>
                <ellipse cx="55" cy="70" rx="4.8" ry="5.8" transform="rotate(-24 55 70)" fill="#424b40"/>
                <ellipse cx="70" cy="86" rx="3.5" ry="4.5" fill="#424b40"/>
                <ellipse cx="77" cy="106" rx="3" ry="3.5" fill="#555b46"/>
            </g>
            <g fill="none" stroke="#4b5848" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round">
                <path data-life-part="leg" data-attached-to="thorax" d="M95 76 L83 66 79 54 75 52"/>
                <path data-life-part="leg" data-attached-to="thorax" d="M94 84 L77 94 69 111 65 114"/>
                <path data-life-part="leg" data-attached-to="thorax" d="M95 91 L83 112 79 132 74 138"/>
            </g>
        </g>`;
    }
    const butterfly = `<g class="life-hover" data-life-motion="hover">
        ${butterflySide()}${butterflySide(true)}
        <path data-life-part="abdomen" d="M95 92 Q91 112 97 137 Q100 147 103 137 Q109 112 105 92Z" fill="url(#specimen-butterfly-body)" stroke="#4e5b4e" stroke-width=".9"/>
        <path d="M95 104 Q100 107 105 104 M95 112 Q100 115 105 112 M96 120 Q100 123 104 120 M97 128 Q100 131 103 128" fill="none" stroke="#a0ac90" stroke-width=".75"/>
        <ellipse data-life-part="thorax" cx="100" cy="82" rx="7.5" ry="13" fill="#586755" stroke="#354c3d" stroke-width="1"/>
        <path d="M98 72 Q94 80 98 92 M102 72 Q107 81 102 92" fill="none" stroke="#aab69c" stroke-width="1"/>
        <path d="M94 77 l-2-2 M94 82 l-2-1 M94 88 l-2 1 M106 77 l2-2 M106 83 l2-1 M106 88 l2 1" stroke="#718168" stroke-width=".65"/>
        <ellipse data-life-part="head" cx="100" cy="63" rx="6.3" ry="6" fill="#4b5d4c"/>
        <ellipse cx="94.5" cy="63" rx="2.2" ry="3.2" fill="#2f4539"/><ellipse cx="105.5" cy="63" rx="2.2" ry="3.2" fill="#2f4539"/>
        <path d="M97 59 Q89 43 86 35 M103 59 Q111 43 114 35" fill="none" stroke="#425747" stroke-width="1.1"/>
        <ellipse cx="85.5" cy="34" rx="1.6" ry="3" transform="rotate(-18 85.5 34)" fill="#425747"/><ellipse cx="114.5" cy="34" rx="1.6" ry="3" transform="rotate(18 114.5 34)" fill="#425747"/>
    </g>`;
    function mantisSide() {
        return `<g fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path data-life-part="leg" data-attached-to="thorax" d="M94 94 L68 108 53 135 45 139" stroke="#557342" stroke-width="2.5"/>
            <path data-life-part="leg" data-attached-to="thorax" d="M94 103 L76 126 61 158 52 167" stroke="#526e3e" stroke-width="2.7"/>
            <path d="M68 108 L53 135 M76 126 L61 158" stroke="#99ad67" stroke-width=".8"/>
        </g>
        <g data-life-part="leg" data-attached-to="thorax">
            <path d="M96 60 L83 69" fill="none" stroke="#6f914b" stroke-width="4" stroke-linecap="round"/>
            <g class="life-foreleg" data-life-motion="forelegs">
                <path d="M83 69 Q75 71 67 86 Q64 90 62 84 L57 61 Q57 56 60 60 L70 76" fill="#94ae59" stroke="#58763c" stroke-width="1.1" stroke-linejoin="round"/>
                <path d="M79 73 L69 84 M63 81 L59 65" fill="none" stroke="#c5ce86" stroke-width="1"/>
                <path d="M74 77 l-2-3 M71 81 l-2-3 M67 83 l-1-4 M63 77 l3-2 M62 73 l3-2 M61 69 l3-2" stroke="#466239" stroke-width="1" fill="none"/>
                <path d="M57 61 Q53 56 53 53" fill="none" stroke="#5d7741" stroke-width=".9"/>
            </g>
        </g>`;
    }
    function mantisWings() {
        return `<g data-life-part="wings">
            ${[false,true].map(mirror=>`<g${mirror?' transform="translate(200 0) scale(-1 1)"':''}>
                <path data-life-part="hindwing" data-attached-to="thorax" d="M94 101 Q74 112 61 141 Q77 153 95 115Z" fill="#d2d7a0" fill-opacity=".75" stroke="#839565" stroke-width=".8"/>
                <path d="M94 102 L65 140 M94 102 L72 144 M94 102 L80 142" fill="none" stroke="#a2b184" stroke-width=".5"/>
                <path data-life-part="forewing" data-attached-to="thorax" d="M94 94 C82 100 70 121 55 153 Q68 159 83 134 Q96 114 96 96Z" fill="url(#specimen-mantis-wing)" stroke="#617d44" stroke-width="1"/>
                <path d="M94 97 Q78 122 58 151 M85 112 L80 128 M79 122 L73 140 M73 133 L66 150" fill="none" stroke="#b6c37b" stroke-width=".75"/>
            </g>`).join('')}
        </g>`;
    }
    const mantis = adult => `<g class="life-mantis" data-life-motion="sway">
        ${mantisSide()}<g transform="translate(200 0) scale(-1 1)">${mantisSide()}</g>
        <path data-life-part="abdomen" d="M92 106 Q84 130 92 153 L100 168 108 153 Q116 130 108 106Z" fill="url(#specimen-mantis-body)" stroke="#587444" stroke-width="1.1"/>
        ${[117,126,135,144,153].map((y,i)=>`<path d="M${90+i*.7} ${y} Q100 ${y+4} ${110-i*.7} ${y}" fill="none" stroke="#82995a" stroke-width=".9"/>`).join('')}
        <g data-life-part="thorax">
            <path d="M97 51 Q92 61 95 72 L95 90 105 90 105 72 Q108 61 103 51Z" fill="#93b45e" stroke="#577940" stroke-width="1"/>
            <path d="M95 88 L91 96 92 107 Q100 112 108 107 L109 96 105 88Z" fill="#799e50" stroke="#52713d" stroke-width="1"/>
            <path d="M100 57 L100 88 M93 99 Q100 101 107 99" fill="none" stroke="#becb80" stroke-width="1"/>
        </g>
        ${adult?mantisWings():''}
        <path d="M97 49 L98 53 102 53 103 49" fill="#75964d"/>
        <path data-life-part="head" d="M83 39 Q100 33 117 39 Q113 48 101 54 Q88 48 83 39Z" fill="#a2bb6a" stroke="#56773e" stroke-width="1.1"/>
        <ellipse cx="84" cy="39" rx="5.2" ry="5.8" fill="#bcc983" stroke="#66814e" stroke-width=".8"/><ellipse cx="116" cy="39" rx="5.2" ry="5.8" fill="#bcc983" stroke="#66814e" stroke-width=".8"/>
        <circle cx="84" cy="39" r="1.4" fill="#425937"/><circle cx="116" cy="39" r="1.4" fill="#425937"/>
        <path d="M92 37 Q87 24 80 14 M108 37 Q113 24 120 14" fill="none" stroke="#5d7d42" stroke-width="1"/>
        <path d="M96 48 L100 50 104 48" fill="none" stroke="#6a8448" stroke-width=".7"/>
    </g>`;
    const tadpole = legs => `<g class="life-swim" data-life-motion="swim"><g class="life-tail" data-life-motion="tail"><path d="M101 91 Q128 82 182 109 Q139 137 98 112Z" fill="#a9c8b9" fill-opacity=".75" stroke="#648b78" stroke-width="1.4"/><path d="M100 102 Q144 96 177 109" fill="none" stroke="#658674" stroke-width="5"/></g><ellipse cx="80" cy="99" rx="32" ry="24" fill="#697953" stroke="#465e48" stroke-width="2"/><ellipse cx="69" cy="103" rx="18" ry="15" fill="#8d9970"/><circle cx="63" cy="85" r="4" fill="#c0c893"/><circle cx="63" cy="85" r="2" fill="#293e33"/>${legs?'<g class="life-kick" data-life-motion="kick"><path d="M101 109 Q122 125 104 133 l12 8 M105 92 Q123 78 126 93 l9-7" fill="none" stroke="#628559" stroke-width="6" stroke-linecap="round"/><path d="M114 140 l9 1 m-9-1 8 5 M134 86 l6-4" stroke="#456946" stroke-width="2"/></g>':''}</g>`;
    function frogHindLeg() {
        return `<g data-life-part="hind-leg">
            <path d="M78 111 C62 108 45 113 38 126 C31 139 42 147 60 143 L73 137" fill="url(#specimen-frog)" stroke="#4f7445" stroke-width="1.3"/>
            <path d="M62 133 Q52 139 45 153 L39 157" fill="none" stroke="#658b4e" stroke-width="8" stroke-linecap="round"/>
            <path d="M61 133 Q51 140 44 152" fill="none" stroke="#a1ba75" stroke-width="1.8"/>
            <path d="M41 154 Q30 150 21 151 Q31 155 26 158 L16 159 Q27 161 26 164 L18 169 Q29 167 30 172 L26 177 Q35 171 37 180 Q43 172 46 161Z" fill="#b1bc78" stroke="#719151" stroke-width=".7"/>
            <g data-life-part="hind-foot" fill="none" stroke="#67894d" stroke-width="1.8" stroke-linecap="round">
                <path data-life-digit="toe" d="M41 157 Q31 151 21 151"/>
                <path data-life-digit="toe" d="M40 158 Q29 158 16 159"/>
                <path data-life-digit="toe" d="M40 159 Q28 163 18 169"/>
                <path data-life-digit="toe" d="M41 160 Q32 169 26 177"/>
                <path data-life-digit="toe" d="M43 161 Q38 171 37 180"/>
            </g>
            <path d="M44 128 Q48 122 55 121 M51 135 l6-3" fill="none" stroke="#527a44" stroke-width="2.2" stroke-linecap="round"/>
        </g>`;
    }
    function frogForeLeg() {
        return `<g data-life-part="fore-leg">
            <path d="M78 107 Q69 116 70 137 Q70 145 79 153" fill="none" stroke="#4c7242" stroke-width="8" stroke-linecap="round"/>
            <path d="M78 108 Q72 125 74 139 L81 151" fill="none" stroke="#92b168" stroke-width="5" stroke-linecap="round"/>
            <path d="M79 150 Q74 152 76 158 Q80 162 85 156 L83 152Z" fill="#92ad64" stroke="#537a45" stroke-width=".8"/>
            <g data-life-part="fore-foot" fill="none" stroke="#688d50" stroke-width="2.1" stroke-linecap="round">
                <path data-life-digit="finger" d="M78 154 Q69 153 64 160"/>
                <path data-life-digit="finger" d="M79 157 Q74 163 72 169"/>
                <path data-life-digit="finger" d="M81 158 Q81 164 81 170"/>
                <path data-life-digit="finger" d="M83 157 Q88 161 90 165"/>
            </g>
        </g>`;
    }
    const frog = `<g class="life-hop" data-life-motion="hop">
        ${frogHindLeg()}<g transform="translate(200 0) scale(-1 1)">${frogHindLeg()}</g>
        <path data-life-part="body" d="M75 92 C61 118 71 145 87 153 Q100 161 113 153 C129 145 139 118 125 92Z" fill="url(#specimen-frog)" stroke="#527a46" stroke-width="1.2"/>
        <path d="M84 108 Q79 126 86 143 Q100 157 114 143 Q121 126 116 108Z" fill="#d4d7ad"/>
        ${frogForeLeg()}<g transform="translate(200 0) scale(-1 1)">${frogForeLeg()}</g>
        <path data-life-part="head" d="M69 81 C65 70 73 60 84 62 Q100 67 116 62 C127 60 135 70 131 81 Q146 91 133 101 Q100 119 67 101 Q54 91 69 81Z" fill="url(#specimen-frog)" stroke="#507844" stroke-width="1.3"/>
        ${[80,120].map(x=>`<ellipse cx="${x}" cy="74" rx="9" ry="8" fill="#789954" stroke="#507344" stroke-width=".8"/><ellipse cx="${x}" cy="74" rx="6.3" ry="5" fill="#c9b966"/><ellipse cx="${x}" cy="74" rx="4.3" ry="1.8" fill="#253e30"/><ellipse cx="${x-2}" cy="72.5" rx="1.1" ry=".6" fill="#e8dfa6"/>`).join('')}
        <path d="M68 95 Q100 104 132 95" fill="none" stroke="#496c40" stroke-width=".9"/>
        <ellipse cx="92" cy="87" rx="1.1" ry=".7" fill="#4e7242"/><ellipse cx="108" cy="87" rx="1.1" ry=".7" fill="#4e7242"/>
        <path d="M74 85 Q82 81 87 85 M113 85 Q119 81 126 85" fill="none" stroke="#b2c588" stroke-width="1.2"/>
    </g>`;
    const chick = adult => `<g class="life-peck"><path d="M88 133 L85 164 72 168 M85 164 L94 168 M115 133 L119 164 108 168 M119 164 L129 168" fill="none" stroke="#b88639" stroke-width="3" stroke-linecap="round"/><path d="M130 106 L162 75 Q162 108 146 123" fill="${adult?'#866348':'#e1b85d'}" stroke="#99794f" stroke-width="1.5"/><ellipse cx="110" cy="115" rx="39" ry="30" fill="${adult?'#bd9565':'#f5d577'}" stroke="#a9854d" stroke-width="1.8"/><path d="M101 104 Q143 102 128 129 Q110 143 94 122" fill="${adult?'#a47b50':'#e9c365'}" stroke="#ad8a50" stroke-width="1.5"/><g class="life-peck-head" data-life-motion="peck-head"><path d="M80 111 Q60 97 64 77 Q60 56 81 54 Q103 57 96 85 L112 105" fill="${adult?'#cfaa75':'#f5da84'}" stroke="#a9854d" stroke-width="1.8"/><path d="M65 76 L49 82 65 87Z" fill="#d59a3e" stroke="#ad7835" stroke-width="1.2"/><circle cx="73" cy="72" r="3" fill="#36372d"/><circle cx="72" cy="71" r=".8" fill="white"/>${adult?'<path d="M67 57 Q56 47 68 46 Q66 32 76 42 Q85 29 87 43 Q103 40 94 59" fill="#ba5547" stroke="#964334" stroke-width="1.3"/><path d="M65 88 Q59 111 70 106 Q79 103 75 92" fill="#bb5846"/>':''}</g></g>`;
    // External hardened foam around a twig, not a row of individual exposed eggs.
    const ootheca = `<g data-life-part="ootheca">
        <path d="M40 182 Q79 109 154 22" fill="none" stroke="#897259" stroke-width="7" stroke-linecap="round"/>
        <path d="M42 181 Q81 110 156 23 M115 67 L142 66" fill="none" stroke="#b19a73" stroke-width="1.4" stroke-linecap="round"/>
        <path d="M65 137 Q52 125 55 111 Q49 97 58 87 Q58 75 74 70 Q84 61 101 64 Q120 62 130 75 Q146 83 144 100 Q150 118 133 129 Q125 145 105 143 Q84 150 65 137Z" fill="url(#specimen-foam)" stroke="#947450" stroke-width="1.2"/>
        <path d="M60 116 Q80 138 113 131 Q136 125 144 103 Q145 127 126 137 Q92 153 65 137Z" fill="#98774f" opacity=".28"/>
        ${Array.from({length:11},(_,i)=>{
            const y=76+i*5.1,x=85+i*.9;
            return `<path d="M${x} ${y} Q${66+i*.1} ${y-4} ${59+Math.abs(5-i)*1.8} ${y+4} M${x+8} ${y+1} Q${125+i*.4} ${y-3} ${137-Math.abs(5-i)*1.7} ${y+7}" fill="none" stroke="${i%2?'#d9be91':'#b69262'}" stroke-width="${i%2?2:1}" stroke-linecap="round"/>`;
        }).join('')}
        <path data-life-part="ootheca-seam" d="M88 71 C81 88 90 111 105 135" fill="none" stroke="#967247" stroke-width="8" stroke-linecap="round"/>
        <path d="M87 72 C83 89 92 114 105 134" fill="none" stroke="#e1cba5" stroke-width="5.5" stroke-linecap="round"/>
        ${Array.from({length:13},(_,i)=>{const t=i/12,y=75+t*55,x=86+20*t*t;return `<path d="M${x-2.6} ${y} l5 1.3" stroke="#ab895c" stroke-width="1" stroke-linecap="round"/>`;}).join('')}
        ${Array.from({length:58},(_,i)=>{const angle=i*2.39996,r=10+26*((i*7%59)/59),x=99+Math.cos(angle)*r,y=104+Math.sin(angle)*r;return `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx=".65" ry=".45" fill="${i%2?'#ead5ae':'#94744f'}" opacity=".6"/>`;}).join('')}
    </g>`;
    const pigments = `<defs>
        <linearGradient id="specimen-egg"><stop stop-color="#dfc577"/><stop offset=".35" stop-color="#fff0ba"/><stop offset=".64" stop-color="#f4dfa0"/><stop offset="1" stop-color="#cfb369"/></linearGradient>
        <linearGradient id="specimen-larva" x2="0" y2="1"><stop stop-color="#b5ce74"/><stop offset=".3" stop-color="#98bc5c"/><stop offset="1" stop-color="#709744"/></linearGradient>
        <linearGradient id="specimen-wing" x2=".6" y2="1"><stop stop-color="#fffef4"/><stop offset=".7" stop-color="#f8f7df"/><stop offset="1" stop-color="#e5e9d0"/></linearGradient>
        <linearGradient id="specimen-butterfly-body"><stop stop-color="#53614e"/><stop offset=".5" stop-color="#9fab8a"/><stop offset="1" stop-color="#4b604c"/></linearGradient>
        <linearGradient id="specimen-mantis-body"><stop stop-color="#72984e"/><stop offset=".45" stop-color="#b9cb7a"/><stop offset="1" stop-color="#7a9a50"/></linearGradient>
        <linearGradient id="specimen-mantis-wing"><stop stop-color="#78934e"/><stop offset=".55" stop-color="#9cb465"/><stop offset="1" stop-color="#658646"/></linearGradient>
        <radialGradient id="specimen-frog" cx=".4" cy=".3" r=".8"><stop stop-color="#a8bd77"/><stop offset=".65" stop-color="#85a35d"/><stop offset="1" stop-color="#62894e"/></radialGradient>
        <radialGradient id="specimen-foam" cx=".35" cy=".3" r=".8"><stop stop-color="#e4cfaa"/><stop offset=".65" stop-color="#c4a172"/><stop offset="1" stop-color="#a78155"/></radialGradient>
    </defs>`;
    const arts = {
        butterfly: [leaf+egg,leaf+`<path d="M175 107 Q163 106 166 117 Q154 118 156 131 Q168 135 177 123Z" fill="#f5f7e9"/>`+larva,pupa,butterfly],
        mantis: [ootheca,mantis(false),mantis(true)],
        frog: [`<g fill="#d4e8d9" fill-opacity=".65" stroke="#92b4a1" stroke-width="1.5">${[[77,80],[112,73],[134,99],[104,109],[71,113],[96,143]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="20"/><circle cx="${x}" cy="${y}" r="6" fill="#394d40"/>`).join('')}</g>`,tadpole(false),tadpole(true),frog],
        chick: [`<path d="M69 130 C51 110 69 48 93 42 C119 36 154 100 134 130 Q105 160 69 130Z" fill="#f3e4c8" stroke="#b89a6f" stroke-width="2"/><path d="M74 113 Q68 77 91 57" fill="none" stroke="#fffae9" stroke-width="7" stroke-linecap="round"/>`,chick(false),chick(true)],
    };
    const features = {
        butterfly: [
            ['잎에 붙은 작은 알','배춧잎에 하나씩 붙어 있습니다. 표면에 세로줄이 있고, 알 속에서 애벌레가 자랍니다.'],
            ['기어가며 잎을 먹는 애벌레','초록색 몸에 마디와 노란 줄이 있습니다. 머리 뒤의 가슴다리 세 쌍과 배다리로 잎을 딛고 앞으로 기어가며, 작은 턱으로 잎을 갉아 먹습니다.'],
            ['실로 몸을 고정한 번데기','몸 뒤쪽과 몸통을 받치는 실로 붙어 있습니다. 먹지 않으며, 몸 안에서 성충의 모습이 만들어집니다.'],
            ['날개를 펼친 어른벌레','머리·가슴·배가 구별됩니다. 가슴에 다리 세 쌍과 날개 두 쌍이 붙어 있습니다. 흰 날개에는 검은 무늬가 있고 꽃의 꿀을 빨아 먹습니다.'],
        ],
        mantis: [['알집 속의 알','여러 알이 알집 안에서 보호받습니다. 그림에 보이는 갈색 덩어리는 알 한 개가 아니라 알집입니다.'],['어른과 닮은 애벌레','여섯 다리로 걷고 앞다리로 먹이를 잡습니다. 번데기를 거치지 않고 허물을 벗으며 자랍니다.'],['날개가 자란 어른벌레','날개는 배가 아니라 가슴에 붙어 있습니다. 연결 부위가 보이도록 날개를 조금 벌린 모습입니다. 가슴에 붙은 여섯 다리 중 앞다리로 먹이를 붙잡습니다.']],
        frog: [['물속의 알','투명한 젤리 같은 물질 속에 알이 있습니다. 가운데 짙은 부분에서 몸이 자랍니다.'],['꼬리로 헤엄치는 올챙이','아직 다리가 없습니다. 꼬리를 좌우로 흔들며 물속을 헤엄칩니다.'],['뒷다리가 생긴 올챙이','뒷다리가 먼저 보이고 꼬리도 남아 있습니다. 이후 앞다리가 나오고 꼬리가 짧아집니다.'],['네 다리로 뛰는 개구리','꼬리가 없어지고 다리가 발달했습니다. 긴 뒷다리를 뻗어 뛰거나 헤엄칩니다.']],
        chick: [['껍데기로 싸인 알','껍데기 안에서 병아리가 자랍니다. 알은 스스로 이동하거나 먹이를 먹지 않습니다.'],['먹이를 쪼는 병아리','솜털로 덮여 있고 부리와 두 다리가 있습니다. 고개를 숙여 곡식과 작은 벌레를 쪼아 먹습니다.'],['깃털이 자란 어른 닭','솜털 대신 깃털이 발달합니다. 병아리와 마찬가지로 부리를 이용해 먹이를 먹습니다.']],
    };
    function scene(animal, step, miniature=false) {
        const specimenId=animal+'-'+step+'-'+(miniature?'mini':'main');
        const wet=animal==='frog'&&step<3;
        const bg=wet?'#e9f3f1':'#f5f7e9';
        const ground=animal==='chick'?'<path d="M15 170 Q100 151 187 170" fill="none" stroke="#cabd95" stroke-width="2"/><g fill="#b28c44"><ellipse cx="48" cy="164" rx="3" ry="1.5"/><ellipse cx="61" cy="169" rx="3" ry="1.5"/><ellipse cx="43" cy="171" rx="3" ry="1.5"/></g>':'';
        return `<svg viewBox="0 0 200 200" class="life-specimen${miniature?' miniature':''}" aria-hidden="true">${pigments}<rect x="1" y="1" width="198" height="198" rx="20" fill="${bg}"/>${wet?'<path d="M17 158 Q54 151 94 158 T183 158 M20 172 Q61 165 99 172 T180 172" fill="none" stroke="#b9d9cd" stroke-width="1.6"/>':''}${ground}${arts[animal][step]}</svg>`.replaceAll('specimen-',specimenId+'-');
    }
    window.lifeObservationArt={scene,features};
})();
