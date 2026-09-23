const BOOK_TITLE = "효녀 심청";

const CHAPTER_LABEL = n => (LANG === 'en' ? `Chapter ${n} · ` : `${n}장 · `);

const CHAPTERS = [
    {
        num: 1,
        title: "젖동냥으로 기른 딸",
        emoji: "👶",
        art: ["story-01-a.webp", "story-01-b.webp", "story-01-c.webp"],
        artAt: ["우리 아이 한 모금만 먹여 주십시오", "바가지를 들고 이 집 저 집을 다녔습니다", "댁 부인이 그 소문을 듣고 심청을 불렀습니다"],
        paras: [
            `옛날 황해도 황주 도화동에 심학규라는 사람이 살았습니다. 본디 글을 읽던 집안이었으나 살림이 기울어 가난하게 지냈습니다.`,
            `심학규는 스무 살 무렵 큰 병을 앓고 나서 앞을 보지 못하게 되었습니다. 그때부터 사람들은 그를 심 봉사<span class="gloss">(앞 못 보는 남자를 가리키던 옛말)</span>라 불렀습니다.`,
            `아내 곽 씨 부인은 삯바느질<span class=\"gloss\">(남의 바느질을 해 주고 삯을 받는 일)</span>을 하고 남의 집 방아를 찧어 두 사람의 끼니를 이었습니다. 가난했지만 부부 사이는 더없이 좋았습니다.`,
            `혼인한 지 십여 년 만에 곽 씨 부인이 아이를 가졌습니다. 심 봉사는 그 소식에 밤새 잠을 이루지 못했습니다.`,
            `이듬해 봄에 딸이 태어났습니다. 이름을 청이라 지었습니다.`,
            `그런데 아이가 태어난 지 일곱 날 만에 곽 씨 부인이 세상을 떠났습니다. 몸이 약한 데다 산후에 몸조리를 하지 못한 탓이었습니다.`,
            `심 봉사는 갓난아이를 안고 마당에 주저앉아 울었습니다. 앞이 보이지 않는 사람이 젖먹이를 어떻게 기른단 말입니까.`,
            `그러나 심 봉사는 울고만 있지 않았습니다. 이튿날부터 아이를 포대기에 싸서 안고 마을을 돌기 시작했습니다.`,
            `"이 댁에 젖먹이가 있다지요? 우리 아이 한 모금만 먹여 주십시오."`,
            `동네 아낙들이 아이를 받아 젖을 물렸습니다. 어떤 집에서는 미음을 쑤어 주었고, 어떤 집에서는 낡은 옷가지를 내주었습니다.`,
            `심 봉사는 아침에 나가 저녁에 돌아왔습니다. 하루에 열 집도 넘게 다녔습니다. 그 손에는 늘 지팡이가 들려 있었고, 품에는 늘 아이가 있었습니다.`,
            `그렇게 청이는 온 동네의 젖을 먹고 자랐습니다. 사람들이 말했습니다.<br>"저 아이는 도화동이 함께 기른 아이일세."`,
            `청이는 자라면서 아버지의 눈이 되었습니다.`,
            `여섯 살에 벌써 아버지의 손을 잡고 길을 안내했습니다.<br>"아버지, 여기 돌 있어요."<br>"아버지, 이제 왼쪽으로 도세요."`,
            `일곱 살에는 밥을 지었습니다. 부뚜막이 높아 발판을 놓고 올라서야 했습니다.`,
            `여덟 살이 되자 아버지를 집에 모셔 두고 혼자 동냥을 나섰습니다.<br>"아버지는 계세요. 제가 다녀올게요."<br>"안 된다. 어린것이 무슨 동냥이냐."<br>"아버지가 나가시면 제가 걱정되어 아무것도 못 해요."`,
            `청이는 바가지를 들고 이 집 저 집을 다녔습니다. 사람들은 그 어린것이 안쓰러워 밥을 두 술씩 더 떠 주었습니다.`,
            `그런데 청이는 얻어 온 밥을 제가 먼저 먹는 법이 없었습니다. 늘 아버지 앞에 놓고 물었습니다.<br>"아버지, 잡수셨어요?"<br>"오냐, 먹었다."`,
            `심 봉사가 밥그릇을 다 비우고 나면 청이는 그제야 부뚜막에 쪼그리고 앉아 남은 것을 먹었습니다. 어떤 날은 남은 것이 없어 물만 마셨습니다.`,
            `열두 살이 되자 청이는 삯바느질을 배웠습니다. 어머니가 하던 일이었습니다. 손끝이 야무져 금세 동네에서 이름이 났습니다.`,
            `열다섯이 되자 청이는 도화동에서 가장 부지런한 처녀가 되었습니다. 마을에서는 그를 심청이라 부르며 아꼈습니다.`,
            `장 승상<span class=\"gloss\">(아주 높은 벼슬)</span> 댁 부인이 그 소문을 듣고 심청을 불렀습니다. 부인은 심청을 보자마자 마음에 들어 했습니다.<br>"내 수양딸<span class=\"gloss\">(남의 아이를 데려다 제 딸로 삼는 것)</span>이 되지 않겠느냐. 네 아버지도 내가 돌보아 주마."`,
            `심청은 고개를 숙였습니다.<br>"고마우신 말씀입니다. 그러나 제가 없으면 아버지는 물 한 그릇도 못 뜨십니다."`,
            `부인은 그 말에 눈가가 붉어졌습니다. 그러고는 이렇게 말했습니다.<br>"언제든 힘든 일이 있거든 나를 찾아오너라."`
        ]
    },
    {
        num: 2,
        title: "공양미 삼백 석",
        emoji: "🌾",
        art: ["story-02-a.webp", "story-02-b.webp", "story-02-c.webp"],
        artAt: ["누군가 물속으로 뛰어들었습니다", "댁의 눈은 못 고칠 눈이 아닙니다", "한 그릇을 떠 놓고 오래도록 빌었습니다"],
        paras: [
            `심청이 열다섯 되던 해 겨울이었습니다. 그날 심청은 장 승상 댁에 바느질감을 가져다주러 갔습니다.`,
            `날이 저물었는데도 딸이 돌아오지 않자 심 봉사는 걱정이 되었습니다.<br>"이것이 왜 이리 늦누?"`,
            `기다리다 못한 심 봉사는 지팡이를 짚고 마중을 나섰습니다. 눈이 얼어붙은 길이었습니다.`,
            `개울에 놓인 다리를 건너려는데, 지팡이 끝이 얼음에 미끄러졌습니다.`,
            `첨벙— 하고 심 봉사가 물에 빠졌습니다. 겨울 물은 살을 에는 듯했습니다. 심 봉사는 어디가 뭍인지 알 수가 없어 허우적거리기만 했습니다.`,
            `"사, 사람 살려!"<br>목소리가 점점 잦아들었습니다.`,
            `그때 누군가 물속으로 뛰어들었습니다. 심 봉사를 끌어올려 뭍에 눕히고 등을 두드렸습니다.`,
            `심 봉사가 물을 토해 내고 겨우 정신을 차렸습니다.<br>"뉘, 뉘십니까."<br>"몽운사에서 온 중입니다."`,
            `스님은 심 봉사를 부축해 집까지 데려다주었습니다. 젖은 옷을 갈아입히고 불을 지펴 주었습니다.`,
            `심 봉사는 스님의 손을 잡고 흐느꼈습니다.<br>"이 은혜를 어찌 갚습니까. 사실 나는 죽는 것이 두려운 것이 아니라, 내가 죽으면 우리 청이가 혼자 남을 것이 두렵습니다."`,
            `스님이 한참 동안 심 봉사의 얼굴을 들여다보았습니다.<br>"댁의 눈은 못 고칠 눈이 아닙니다."`,
            `심 봉사가 고개를 번쩍 들었습니다.<br>"그, 그게 무슨 말씀입니까?"`,
            `"우리 절 부처님께 공양미<span class="gloss">(부처님께 바치는 쌀)</span> 삼백 석을 올리고 정성껏 빌면 눈을 뜨실 것입니다."`,
            `심 봉사는 그 말을 듣자마자 앞뒤를 재지 않았습니다.<br>"바치겠습니다! 삼백 석을 바치겠습니다!"`,
            `스님이 놀라 물었습니다.<br>"댁의 형편에 삼백 석이 가당키나 합니까."<br>"됩니다! 적어 주십시오!"`,
            `스님은 마지못해 시주 책자에 심학규라는 이름과 삼백 석을 적었습니다. 그러고는 몇 번이나 뒤를 돌아보며 절로 돌아갔습니다.`,
            `스님이 떠나고 나자 심 봉사는 그제야 정신이 들었습니다.`,
            `삼백 석이라니. 이 집에는 쌀 세 되도 없었습니다. 논도 밭도 한 뼘 없는 사람이 무슨 수로 삼백 석을 마련한단 말입니까?`,
            `심 봉사는 방바닥을 치며 후회했습니다.<br>"아이고, 내가 미쳤지. 부처님을 속인 죄를 어찌 받으려고!"`,
            `밤늦게 심청이 돌아왔습니다. 아버지가 이불을 뒤집어쓰고 누워 있었습니다.<br>"아버지, 어디 편찮으세요?"`,
            `심 봉사는 처음에는 말하지 않으려 했습니다. 그러나 딸이 자꾸 묻자 결국 털어놓고 말았습니다.`,
            `이야기를 다 들은 심청은 한참 동안 아무 말이 없었습니다. 그러고는 이렇게 말했습니다.<br>"잘하셨어요, 아버지."`,
            `"잘하다니. 우리가 무슨 수로?"<br>"부처님께 하신 약속인데 설마 못 지키게 하시겠어요. 걱정 마시고 주무세요."`,
            `그날 밤 심청은 뒤뜰로 나가 정화수<span class=\"gloss\">(이른 새벽에 길어 하늘이나 신께 올리는 맑은 물)</span> 한 그릇을 떠 놓고 오래도록 빌었습니다. 어머니가 살아 계실 때 하던 그대로였습니다.`
        ]
    },
    {
        num: 3,
        title: "뱃사람들과 거짓말",
        emoji: "⛵",
        art: ["story-03-a.webp", "story-03-b.webp", "story-03-c.webp"],
        artAt: ["뱃사람 차림의 사내 여럿이 무언가를 붙이고 있었습니다", "제가 가겠습니다", "잠든 아버지의 곁에 앉아 밤을 새웠습니다"],
        paras: [
            `며칠 뒤 심청은 마을 어귀에서 낯선 사람들을 보았습니다. 뱃사람 차림의 사내 여럿이 무언가를 붙이고 있었습니다.`,
            `심청이 다가가 물었습니다.<br>"무슨 일이신지요."`,
            `우두머리로 보이는 사내가 대답했습니다.<br>"우리는 남경으로 장사를 다니는 배꾼들이오. 가는 길에 인당수라는 곳을 지나야 하는데, 그 물길이 어찌나 사나운지 해마다 배가 여러 척 뒤집힌다오."`,
            `"그런데요?"<br>"예로부터 그 바다는 열다섯 처녀를 제물<span class=\"gloss\">(신이나 바다에 바치는 것)</span>로 받으면 잔잔해진다고 하오. 그래서 사람을 구하고 있소. 값은 얼마든지 치르겠소."`,
            `심청의 가슴이 크게 뛰었습니다.`,
            `"…얼마든지라 하셨습니까?"<br>"그렇소."<br>"쌀 삼백 석도 가능합니까?"`,
            `사내들이 심청을 돌아보았습니다.<br>"가능하오. 그런데 왜 묻는 게요?"`,
            `"제가 가겠습니다."`,
            `사내들이 한참 동안 말을 잇지 못했습니다. 우두머리가 심청의 얼굴을 살폈습니다.<br>"낭자<span class=\"gloss\">(처녀를 높여 부르던 말)</span>, 이건 장난이 아니오. 바다에 몸을 던지는 일이오."<br>"압니다."`,
            `"어찌하여 그런 결심을 하셨소."<br>심청은 담담하게 말했습니다.<br>"저희 아버지가 앞을 못 보십니다. 쌀 삼백 석을 절에 바치면 눈을 뜨신다고 합니다."`,
            `우두머리가 고개를 돌렸습니다. 그 곁의 젊은 뱃사람 하나는 아예 소매로 눈을 눌렀습니다.`,
            `"…쌀은 언제 보내 드리면 되겠소?"<br>"오늘 안에 몽운사로 보내 주십시오. 저는 배 떠나는 날에 나가겠습니다."<br>"떠나는 날은 삼월 보름이오."`,
            `그날 저녁 심청은 아버지 앞에 앉았습니다.`,
            `"아버지, 좋은 소식이 있어요. 공양미 삼백 석이 마련되었어요."`,
            `심 봉사가 벌떡 일어났습니다.<br>"뭐라고! 어떻게!"`,
            `심청은 미리 생각해 둔 말을 꺼냈습니다.<br>"장 승상 댁 부인께서 저를 수양딸로 삼고 싶어 하셨잖아요. 그 댁에 들어가기로 했어요. 대신 삼백 석을 절에 보내 주시기로 했고요."`,
            `"수양딸이라니. 그러면 너는 그 댁에서 살게 되는 것이냐?"<br>"삼월 보름에 들어가요. 아버지도 자주 뵈러 올게요."`,
            `심 봉사는 처음에는 서운해했습니다. 그러나 곧 기뻐했습니다.<br>"잘되었다. 잘되었어. 그 댁에 가면 너도 고생을 면하겠구나."`,
            `심청은 웃으며 대답했습니다.<br>"예, 아버지."<br>그러고는 얼른 부엌으로 나갔습니다. 아버지가 앞을 볼 수 없다는 것이 그날처럼 다행스러운 적이 없었습니다.`,
            `그날부터 심청은 밤마다 바느질을 했습니다. 아버지의 사철 옷을 다 지어 놓았습니다. 봄옷, 여름옷, 가을옷, 겨울옷을 차례로 개어 장롱에 넣었습니다.`,
            `버선도 여러 켤레 지었습니다. 마을 아낙들에게는 따로 부탁을 해 두었습니다.<br>"제가 없는 동안 아버지 진지를 좀 챙겨 주세요."`,
            `며칠 뒤 장 승상 댁에서 급히 사람이 왔습니다. 소문이 벌써 그 댁까지 닿은 것이었습니다.`,
            `심청이 들어서자 부인이 자리에서 벌떡 일어났습니다.<br>"네가 뱃사람들에게 몸을 팔았다는 말이 참이냐?"`,
            `심청은 대답 대신 고개를 숙였습니다. 부인이 그 두 손을 잡았습니다. 부인의 손이 더 떨렸습니다.<br>"어찌하여 나에게 오지 않았느냐? 힘든 일이 있거든 찾아오라 하지 않았느냐."`,
            `부인은 그 자리에서 곳간지기를 불렀습니다.<br>"쌀 삼백 석을 내어 오늘 안에 몽운사로 보내라. 그리고 뱃사람들이 준 것은 돌려주도록 하여라."`,
            `심청이 부인의 소매를 붙들었습니다.<br>"부인, 그리하지 마십시오."`,
            `부인이 심청을 돌아보았습니다.<br>"지금 무슨 소리를 하는 게냐. 살 수 있는데 죽겠다는 말이냐?"`,
            `"저는 이미 값을 받았습니다. 그 쌀은 이미 몽운사로 들어갔고, 저는 삼월 보름에 나가겠다고 했습니다. 이제 와서 무르면 저는 사람을 속인 것이 됩니다."`,
            `"사람이 죽고 사는 일이다. 그깟 약속이 무슨 대수냐?"`,
            `심청은 한참 동안 말이 없었습니다. 그러고는 조용히 입을 열었습니다.<br>"부인께서 대신 내주시면 아버지는 눈을 뜨실 것입니다. 그러나 그 눈은 제가 드린 것이 아닙니다."`,
            `"그것이 무슨 상관이란 말이냐. 뜨기만 하면 되지 않느냐?"`,
            `"제가 아버지께 드릴 수 있는 것은 저밖에 없습니다. 그것마저 남의 것으로 하면, 저는 아버지께 아무것도 드리지 못한 딸이 됩니다."`,
            `부인은 더 말을 잇지 못했습니다. 한참 만에 심청의 얼굴을 두 손으로 감쌌습니다.<br>"…내가 너를 못 이기겠구나."`,
            `심청이 마지막으로 한 가지를 부탁했습니다.<br>"아버지께는 아무 말씀도 마십시오. 제가 이 댁 수양딸이 되는 줄로 알고 계십니다."`,
            `돌아오는 길에 심청은 한 번도 뒤를 돌아보지 않았습니다.`,
            `삼월 보름 전날 밤이었습니다. 심청은 아버지의 밥상을 어느 때보다 정성껏 차렸습니다.`,
            `심 봉사가 밥을 먹다 말고 물었습니다.<br>"오늘은 반찬이 유난하구나. 무슨 날이냐?"<br>"…그냥요."`,
            `그날 밤 심청은 잠든 아버지의 곁에 앉아 밤을 새웠습니다. 아버지의 손을 잡았다 놓았다 하며, 얼굴을 오래오래 들여다보았습니다.`
        ]
    },
    {
        num: 4,
        title: "인당수",
        emoji: "🌊",
        art: ["story-04-a.webp", "story-04-b.webp", "story-04-c.webp"],
        artAt: ["심청은 아버지의 아침상을 차려 놓고 옷을 갈아입었습니다", "배가 인당수에 이르렀습니다", "소용돌이 속으로 몸을 던졌습니다"],
        paras: [
            `새벽닭이 울었습니다. 심청은 아버지의 아침상을 차려 놓고 옷을 갈아입었습니다.`,
            `그때 대문 밖에서 뱃사람들의 목소리가 들렸습니다.<br>"낭자, 때가 되었소!"`,
            `심 봉사가 잠에서 깼습니다.<br>"밖에 누가 왔느냐?"<br>"장 승상 댁에서 저를 데리러 왔어요."`,
            `그런데 대문 밖의 목소리가 사내들의 것이었습니다. 심 봉사가 고개를 갸웃했습니다.<br>"승상 댁에서 웬 사내들이 온단 말이냐?"`,
            `심청은 아버지 앞에 무릎을 꿇었습니다. 그러고는 마지막 절을 올렸습니다.`,
            `"아버지."<br>"오냐."<br>"몸조심하세요. 진지 거르지 마시고요."<br>"오냐, 오냐. 너나 잘 지내라."`,
            `심청이 자리에서 일어섰습니다. 문지방을 넘는데 발이 떨어지지 않았습니다.`,
            `그때 마을 아낙 하나가 참지 못하고 울음을 터뜨렸습니다.<br>"아이고, 심청아……."`,
            `심 봉사가 그 소리를 들었습니다.<br>"저 사람은 왜 우는 게냐?"`,
            `대답이 없었습니다. 심 봉사는 그제야 무언가 잘못되었다는 것을 알아챘습니다. 그는 지팡이도 짚지 않고 마당으로 뛰쳐나갔습니다.`,
            `"청아! 청아! 어디 있느냐!"<br>심 봉사는 마당에서 허공을 더듬었습니다. 손에 아무것도 잡히지 않았습니다.`,
            `"이놈들아! 내 딸을 어디로 데려가느냐! 눈이 다 무엇이냐! 나는 눈 안 떠도 좋다! 내 딸을 다오!"<br>심 봉사가 대문 밖으로 몇 걸음 쫓아 나가다 돌부리에 걸려 넘어졌습니다. 마을 사람들이 달려와 그를 붙들었습니다. 길 저편에서 심청이 딱 한 번 뒤를 돌아보았습니다.`,
            `심청을 태운 배는 바닷길로 사흘을 나아갔습니다. 심청은 뱃머리에 앉아 바다만 보았습니다.`,
            `뱃사람들은 심청을 정성껏 대접했습니다. 좋은 밥을 지어 올리고, 밤이면 따로 자리를 마련해 주었습니다. 그러면서도 아무도 심청과 눈을 마주치지 못했습니다.`,
            `젊은 뱃사람 하나가 밤중에 심청 곁에 와서 말했습니다.<br>"낭자, 지금이라도 마음을 돌리시오. 우리가 뭍에 내려 드리리다. 쌀은 이미 절에 보냈으니 그냥 두면 되오."`,
            `심청이 고개를 저었습니다.<br>"그러면 부처님을 속이는 것이 됩니다. 아버지가 눈을 못 뜨실 거예요."`,
            `나흘째 되던 날 아침, 배가 인당수에 이르렀습니다.`,
            `바다가 갑자기 달라졌습니다. 방금까지 잔잔하던 물이 시커멓게 소용돌이치기 시작했습니다. 배가 위아래로 크게 흔들렸습니다.`,
            `뱃사람들이 돛을 내리고 제물상을 차렸습니다. 향을 피우고 절을 올렸습니다.`,
            `우두머리가 심청 앞에 와서 무릎을 꿇었습니다.<br>"낭자, 우리는 평생 이 죄를 지고 살 것이오."`,
            `심청은 그를 일으켜 세웠습니다.<br>"제가 스스로 온 것입니다. 다만 한 가지만 부탁드리겠습니다."<br>"무엇이든 말씀하시오."<br>"돌아가시는 길에 도화동에 들러 저희 아버지가 살아 계신지만 보아 주세요."`,
            `심청은 뱃머리로 걸어갔습니다. 그러고는 서쪽 하늘을 향해 두 손을 모았습니다.`,
            `"하늘이시여. 이 몸은 아깝지 않으나 저희 아버지의 눈은 꼭 뜨게 해 주십시오."`,
            `그러고는 치맛자락을 머리에 뒤집어쓰고 소용돌이 속으로 몸을 던졌습니다. 물살이 한 번 크게 일었다가 이내 잔잔해졌습니다. 뱃사람들이 뱃전에 엎드려 통곡했습니다.`
        ]
    },
    {
        num: 5,
        title: "물 아래, 그리고 연꽃",
        emoji: "🪷",
        art: ["story-05-a.webp", "story-05-b.webp", "story-05-c.webp"],
        artAt: ["심청은 물속으로 한없이 가라앉았습니다", "곽 씨 부인이었습니다", "사람 키만 한 붉은 연꽃 한 송이가 떠 있었습니다"],
        paras: [
            `심청은 물속으로 한없이 가라앉았습니다. 이상하게도 숨이 막히지 않았습니다.`,
            `얼마쯤 내려갔을까요. 발밑이 환해지더니 누군가 심청의 몸을 받쳐 들었습니다.`,
            `눈을 떠 보니 옥으로 만든 가마 위였습니다. 좌우로 낯선 사람들이 늘어서서 절을 하고 있었습니다.`,
            `"어서 오십시오."<br>"…여기가 어디입니까?"<br>"물 아래 용궁입니다."`,
            `심청은 커다란 궁궐로 안내되었습니다. 기둥은 산호요 바닥은 진주였습니다. 사람들이 심청을 윗자리에 앉히고 상을 차려 올렸습니다.`,
            `"저는 제물로 바쳐진 몸입니다. 이런 대접을 받을 까닭이 없습니다."<br>"낭자께서는 제물이 아니십니다. 하늘이 낭자를 여기로 보내신 것입니다."`,
            `며칠이 지난 어느 날, 궁의 발이 걷히고 한 부인이 들어왔습니다.`,
            `심청은 그 얼굴을 본 적이 없었습니다. 그런데도 가슴이 먼저 알아보았습니다.`,
            `"…어머니?"<br>곽 씨 부인이었습니다. 부인은 심청을 끌어안고 오래도록 놓지 않았습니다.`,
            `"내 딸이 이렇게 컸구나. 손이 어쩌다 이리 거칠어졌누!"<br>심청은 어머니의 품에서 처음으로 소리 내어 울었습니다. 열다섯 해 동안 참았던 울음이었습니다.`,
            `며칠 뒤 어머니가 말했습니다.<br>"이제 돌아가야 한다."<br>"어머니, 여기 있으면 안 됩니까?"<br>"네 아버지가 아직 눈을 못 뜨셨다."`,
            `심청이 고개를 들었습니다.<br>"쌀 삼백 석을 바쳤는데도요?"<br>"쌀로 뜨는 눈이 아니란다. 네가 가야 뜨는 눈이다."`,
            `이별하는 날, 어머니는 심청을 커다란 연꽃 봉오리 속에 앉혔습니다.`,
            `"이 안에서 잠들어 있거라. 눈을 뜨면 다시 세상이다."<br>"어머니는요?"<br>"나는 여기서 늘 보고 있으마."`,
            `꽃잎이 하나씩 오므라들었습니다. 심청은 그 안에서 스르르 잠이 들었습니다.`,
            `연꽃은 천천히 떠올랐습니다. 물살을 따라 흔들리며, 며칠이 걸려 인당수 한복판에 이르렀습니다.`,
            `그 무렵 남경에서 장사를 마치고 돌아오던 배 한 척이 인당수를 지나고 있었습니다. 심청을 데려갔던 바로 그 배였습니다.`,
            `뱃사람들은 그 바다를 지날 때마다 술을 붓고 절을 했습니다. 그날도 뱃전에 상을 차리고 있는데, 물 위에 무언가 떠 있는 것이 보였습니다.`,
            `"저것이 무엇이냐?"<br>"꽃입니다! 연꽃입니다!"`,
            `제철도 아닌데, 연못도 아닌 바다 한복판에, 사람 키만 한 붉은 연꽃 한 송이가 떠 있었습니다.`,
            `우두머리가 배를 대게 했습니다. 꽃을 건져 올리자 배 전체에 은은한 향이 퍼졌습니다.`,
            `"이것은 예사 꽃이 아니다."<br>뱃사람들은 그 꽃을 배 한가운데에 모셔 두고 뭍으로 향했습니다.`,
            `뭍에 닿자 소문이 삽시간에 퍼졌습니다. 바다에서 건진 신비한 연꽃 이야기는 곧 대궐까지 들어갔습니다.`,
            `그 무렵 나라의 임금은 왕후를 잃고 홀로 지내고 있었습니다. 임금은 그 꽃 이야기를 듣고 뱃사람들을 불렀습니다.<br>"그 꽃을 궐로 들여라!"`
        ]
    },
    {
        num: 6,
        title: "맹인 잔치",
        emoji: "👑",
        art: ["story-06-a.webp", "story-06-b.webp", "story-06-c.webp"],
        artAt: ["연꽃은 대궐 뜰에 놓였습니다", "이 나라의 앞 못 보는 사람을 모두 대궐로 불러", "지팡이로 문지방을 더듬으며 대궐 안으로 들어섰습니다"],
        paras: [
            `연꽃은 대궐 뜰에 놓였습니다. 임금은 날마다 그 앞에 나와 꽃을 보았습니다.`,
            `며칠이 지난 밤이었습니다. 달빛이 유난히 밝았습니다. 그 빛을 받은 꽃잎이 하나씩 열리기 시작했습니다.`,
            `꽃 속에 처녀 하나가 앉아 있었습니다. 궁 안이 발칵 뒤집혔습니다.`,
            `임금이 물었습니다.<br>"그대는 누구인가?"<br>"저는 황주 도화동에 살던 심청이라 하옵니다."`,
            `심청은 있었던 일을 하나도 숨기지 않고 아뢰었습니다. 앞 못 보는 아버지, 공양미 삼백 석, 인당수.`,
            `임금은 이야기를 다 듣고 한참 동안 말이 없었습니다. 그러고는 이렇게 말했습니다.<br>"하늘이 이 나라에 보낸 사람이로다."`,
            `그해 가을 심청은 왕후가 되었습니다. 온 나라가 그 혼례를 축하했습니다.`,
            `그러나 심청은 웃지 않았습니다. 대궐의 비단옷도, 산해진미도 마음에 들어오지 않았습니다.`,
            `임금이 물었습니다.<br>"무엇이 그리 마음에 걸리시오?"<br>"아버지가 살아 계신지조차 알 수 없습니다."`,
            `임금은 사람을 풀어 황주 도화동을 뒤졌습니다. 그러나 심학규라는 사람은 이미 그 마을을 떠난 뒤였습니다. 딸이 죽은 뒤 마을에 있을 수가 없어 어디론가 떠났다는 것이었습니다.`,
            `심청은 여러 날 밤을 새웠습니다. 그러다 어느 날 아침 임금 앞에 나아가 아뢰었습니다.`,
            `"이 나라의 앞 못 보는 사람을 모두 대궐로 불러 잔치를 열어 주십시오. 사흘도 좋고 열흘도 좋습니다. 다 오실 때까지 열어 주십시오."<br>임금이 고개를 끄덕였습니다.<br>"그대의 소원이니, 내 그리하리다."`,
            `방<span class=\"gloss\">(사람들에게 알리려고 써 붙인 글)</span>이 팔도에 붙었습니다. 앞 못 보는 사람은 누구든 대궐로 오라는 방이었습니다. 오는 길의 밥과 잠자리는 나라에서 대 준다고 했습니다.`,
            `사람들이 길을 나섰습니다. 지팡이를 짚고, 서로 어깨를 붙들고, 아이 손에 이끌려 한양으로 향했습니다.`,
            `그 무렵 심 봉사는 어느 낯선 고을을 떠돌고 있었습니다. 딸을 보낸 뒤 도화동을 떠나 정처 없이 다니던 참이었습니다.`,
            `방 소식을 들은 심 봉사는 처음에는 가지 않으려 했습니다.<br>"내가 무슨 낯으로 밥을 얻어먹는단 말인가."`,
            `그러나 마을 사람이 등을 떠밀었습니다.<br>"가 보시오. 임금님이 주는 밥이니 꼭 잡숫고 오시오."`,
            `심 봉사는 지팡이를 짚고 길을 나섰습니다. 노잣돈이라고는 몇 푼이 전부였습니다.`,
            `가는 길에 이런저런 일을 겪었습니다. 주막에서 만난 사람이 좋은 길을 알려 주겠다며 앞장서더니, 자는 사이에 봇짐과 노잣돈을 몽땅 들고 달아났습니다.`,
            `심 봉사는 빈손으로 남았습니다. 그래도 걸었습니다. 남의 집 처마 밑에서 자고, 얻어먹고, 또 걸었습니다.`,
            `그러다 발을 헛디뎌 도랑에 빠지기도 하고, 길을 잘못 들어 하루를 헤매기도 했습니다.`,
            `한양에 닿았을 때는 잔치가 시작된 지 이미 여러 날이 지난 뒤였습니다. 옷은 다 해지고 발은 부르터 있었습니다.`,
            `대궐 문 앞에서 관리가 말했습니다.<br>"오늘이 마지막 날이오. 어서 들어가시오."`,
            `심 봉사는 그 말에 안도했습니다. 그러고는 지팡이로 문지방을 더듬으며 대궐 안으로 들어섰습니다.`
        ]
    },
    {
        num: 7,
        title: "눈을 뜨다",
        emoji: "👁️",
        art: ["story-07-a.webp", "story-07-b.webp", "story-07-c.webp"],
        artAt: ["잔치 마당에는 앞 못 보는 사람들이 가득 앉아 있었습니다", "심청이 그 노인 앞에 무릎을 꿇었습니다", "스물다섯 해 만에 세상을 보았습니다"],
        paras: [
            `잔치 마당에는 앞 못 보는 사람들이 가득 앉아 있었습니다. 상마다 밥과 국이 올라 있었습니다.`,
            `심청은 발 뒤에 앉아 하루 종일 그 마당을 내려다보았습니다. 벌써 여러 날째였습니다.`,
            `관리가 명부를 들고 다니며 이름을 적었습니다. 심청은 그 이름을 하나하나 확인했습니다. 심학규라는 이름은 나오지 않았습니다.`,
            `마지막 날 저녁이었습니다. 상이 거의 다 치워지고 사람들이 하나둘 일어서고 있었습니다.`,
            `그때 마당 끝자리에 늦게 들어온 노인 하나가 앉았습니다. 옷이 몹시 해지고 머리가 온통 하얀 노인이었습니다.`,
            `관리가 다가가 물었습니다.<br>"이름을 대시오."<br>"…황주 도화동 심학규올시다."`,
            `발 뒤에서 무언가 쓰러지는 소리가 났습니다. 심청이 자리에서 벌떡 일어서다 병풍을 넘어뜨린 것입니다.`,
            `심청은 발을 걷고 마당으로 뛰어 내려갔습니다. 왕후의 옷자락이 흙에 끌렸지만 아무도 말리지 못했습니다.`,
            `심청이 그 노인 앞에 무릎을 꿇었습니다. 목이 메어 말이 나오지 않았습니다.`,
            `노인이 인기척에 고개를 들었습니다.<br>"뉘시오?"`,
            `심청이 겨우 입을 열었습니다.<br>"아버지!"`,
            `노인의 몸이 굳었습니다. 지팡이가 손에서 떨어졌습니다.<br>"…무어라 하셨소?"<br>"아버지. 저예요. 청이예요!"`,
            `심 봉사가 손을 뻗어 허공을 더듬었습니다.<br>"아니다. 아니야. 우리 청이는 물에 빠져 죽었소. 내가 그 아이를 물에 팔아먹은 사람이오."`,
            `"청이가 살아 있어요, 아버지. 제가 청이예요."<br>심청이 아버지의 손을 잡아 제 얼굴에 갖다 댔습니다.`,
            `심 봉사의 손끝이 딸의 이마를, 눈을, 볼을 더듬었습니다. 손이 몹시 떨렸습니다.`,
            `"청이냐? 정말 청이냐? 내가 네 얼굴을 한 번도 못 봤는데. 어떻게 생겼는지도 모르는데!"`,
            `"아버지!"<br>"아이고, 내 딸아! 어디 좀 보자! 어디 좀 보자!"`,
            `심 봉사가 두 눈을 부릅떴습니다. 그 순간이었습니다.`,
            `눈앞이 번쩍하더니 무언가 걷혔습니다. 캄캄하던 자리에 빛이 들어왔습니다.`,
            `흐릿하던 것이 차츰 또렷해졌습니다. 그리고 심 봉사는 스물다섯 해 만에 세상을 보았습니다.`,
            `가장 먼저 보인 것은 제 앞에 무릎 꿇고 앉은 딸의 얼굴이었습니다.`,
            `"…청아!"<br>부녀가 마당 한가운데에서 서로를 끌어안았습니다.`,
            `그런데 그때 마당 곳곳에서 소리가 터져 나왔습니다.<br>"보인다!"<br>"내가 보인다!"`,
            `잔치에 왔던 사람들이 하나둘 눈을 떴습니다. 지팡이가 땅에 떨어지는 소리가 마당 가득 울렸습니다. 늦게 도착해 문밖에 있던 사람들까지 눈을 떴습니다.`,
            `그날 대궐 마당에서 온 나라의 앞 못 보는 사람이 다 눈을 떴다고 합니다. 사람들은 그것을 심청의 효성이 하늘에 닿은 것이라 했습니다.`,
            `심 봉사는 그 뒤로 오래 살았습니다. 사람들이 딸 자랑을 청하면 늘 이렇게 말했다고 합니다.<br>"내 딸이 나를 살렸다고들 하는데, 그건 아니오. 저 아이는 내 눈을 뜨게 한 것이 아니라, 내가 눈을 뜨고 싶게 만든 것이오."`
        ]
    }
];

function makeProbe() {
    const book = document.getElementById('book');
    const holder = document.createElement('div');
    holder.style.cssText = 'position:absolute;inset:10px;visibility:hidden;pointer-events:none;z-index:-1;';
    holder.innerHTML = '<div class="page page-story"><div class="story-page-left"></div><div class="story-page-right"></div></div>';
    book.appendChild(holder);

    // 따로 만든 상자에 재면 실제 쪽과 미묘하게 어긋난다.
    // 그래서 진짜 쪽과 똑같은 칸을 하나 숨겨 두고 거기에 넣어 잰다.
    // 칸이 넘치면 scrollHeight가 칸 높이에서 잘리므로, 안에 든 것들의 높이를 직접 더한다.
    const col = holder.querySelector('.story-page-left');
    const cs = getComputedStyle(col);
    const measured = col.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);

    // 그림처럼 위쪽 여백이 음수인 것도 있으므로 위아래 여백을 다 셈한다.
    const contentHeight = () => [...col.children].reduce((h, el) => {
        const s = getComputedStyle(el);
        return h + el.getBoundingClientRect().height
            + (parseFloat(s.marginTop) || 0) + (parseFloat(s.marginBottom) || 0);
    }, 0);

    col.innerHTML = '<h2>제목</h2>';
    const headHeight = contentHeight();

    // 그림이 얹힌 쪽은 그림 높이만큼 글이 적게 들어간다. 그 높이를 미리 재 둔다.
    // 그림 파일이 없어도 자리는 같으므로, 파일이 뒤에 들어와도 쪽이 밀리지 않는다.
    col.innerHTML = '<div class="story-art-top"><div class="art-frame"></div></div>';
    const artHeight = contentHeight();
    col.innerHTML = '';

    return {
        // 창이 아직 크기를 갖지 못한 채 열리면 잰 값이 0이 된다. 그때는 어림값으로 버틴다.
        usable: measured > 40 ? measured : 620,
        headHeight: headHeight > 0 ? headHeight : 45,
        artHeight: artHeight > 40 ? artHeight : 300,
        measure(html) {
            col.innerHTML = html;
            return contentHeight();
        },
        close() { book.removeChild(holder); }
    };
}

let PROBE = null;   // 쪽을 나눌 때마다 새로 만든다

// 문단을 쪽 넘길 수 있는 조각으로 나눈다. 문장 끝과 대사 줄바꿈이 자를 수 있는 자리다.
// 낱말 뜻풀이처럼 태그로 묶인 부분 안에서는 자르지 않는다.
function splitSegments(html) {
    const tokens = html.split(/(<[^>]+>)/).filter(t => t !== '');
    const segs = [];
    let buf = '';
    let depth = 0;
    for (const tok of tokens) {
        if (tok.startsWith('<')) {
            buf += tok;
            if (/^<br\s*\/?>$/i.test(tok)) {
                if (depth === 0) { segs.push(buf); buf = ''; }
            } else if (tok.startsWith('</')) {
                depth = Math.max(0, depth - 1);
            } else if (!tok.endsWith('/>')) {
                depth++;
            }
            continue;
        }
        if (depth > 0) { buf += tok; continue; }
        // 문장이 끝나고 빈칸이 오는 자리에서 자른다
        const parts = tok.split(/(?<=[.!?"”][\s])/);
        for (let i = 0; i < parts.length; i++) {
            buf += parts[i];
            if (i < parts.length - 1) { segs.push(buf); buf = ''; }
        }
    }
    if (buf.trim() !== '') segs.push(buf);
    return segs.length ? segs : [html];
}

// 말을 바꾸면 글이 통째로 갈리므로 조각도 다시 나눈다.
function segsOf(paras) {
    const segs = [];
    paras.forEach((html, paraIdx) => {
        splitSegments(html).forEach((piece, k) => {
            segs.push({ paraIdx, html: piece, start: k === 0 });
        });
    });
    return segs;
}

let CHAPTER_SEGS = [];

// 조각 묶음을 문단 단위로 다시 묶어 화면에 그릴 모양으로 만든다.
// 앞 쪽에서 이어진 문단은 첫 줄을 들여쓰지 않는다.
function runHtml(segs, a, b) {
    let out = '';
    let i = a;
    while (i < b) {
        const pi = segs[i].paraIdx;
        let inner = '';
        const contd = !segs[i].start;
        let j = i;
        while (j < b && segs[j].paraIdx === pi) { inner += segs[j].html; j++; }
        // 대화는 줄을 바꿀 때마다 한 칸 들여 쓴다. 국어 표기 규칙이다.
        // 첫 줄만 들여쓰는 text-indent로는 안 되므로 줄 앞에 한 칸짜리 자리를 넣는다.
        // 쪽 끝에 걸린 <br>는 빈 줄만 만드니 떼어 낸다.
        inner = inner.replace(/(<br\s*\/?>)+\s*$/i, '')
            .replace(/<br\s*\/?>/gi, '<br><span class="ln"></span>');
        out += `<p${contd ? ' class="cont"' : ''} data-say="${pi}">${inner}</p>`;
        i = j;
    }
    return out;
}

// 그림은 제가 그린 장면보다 **앞에 나오면 안 된다.** 앞에 나오면 아직 읽지도
// 않은 일을 먼저 보여 주는 셈이라 김이 새고 헷갈린다. 실제로 흥부전 5장에서
// 사당패 그림이 사당패가 나오기 열일곱 쪽 전에 붙어 있었다.
// 그래서 장마다 그림 옆에 「이 장면이다」 하는 문구(artAt)를 달아 두고,
// 그 문구가 든 펼침면에 그림을 얹는다. 두 그림이 같은 쪽으로 몰리면 뒤로 민다.
function anchorSlots(segs, ranges, count, anchors, total) {
    // 1) 문구가 든 펼침면을 찾는다. 못 찾으면 예전처럼 고르게 나눈 자리.
    const at = [];
    const want = [];
    for (let k = 0; k < count; k++) {
        let found = -1;
        const a = anchors[k];
        if (a) {
            const segIdx = segs.findIndex(g => g.html.indexOf(a) >= 0);
            if (segIdx >= 0) {
                for (let p = 0; p < ranges.length; p++) {
                    if (segIdx >= ranges[p][0] && segIdx < ranges[p][1]) { found = p >> 1; break; }
                }
            }
        }
        at.push(found);
        want.push(found < 0 ? Math.min(Math.round((k * total) / count), total - 1) : found);
    }
    // 2) 앞으로 훑으며 겹치면 뒤로 민다.
    for (let k = 1; k < count; k++) {
        if (want[k] <= want[k - 1]) want[k] = want[k - 1] + 1;
    }
    // 3) 뒤로 훑으며 끝을 넘은 것을 앞으로 당긴다.
    //    이 두 번으로 자리가 반드시 서로 다르고 순서도 범위도 지켜진다.
    for (let k = count - 1; k >= 0; k--) {
        const cap = total - 1 - (count - 1 - k);
        if (want[k] > cap) want[k] = cap;
        if (k > 0 && want[k - 1] >= want[k]) want[k - 1] = want[k] - 1;
    }
    const slots = new Array(total).fill('text');
    for (let k = 0; k < count; k++) {
        if (want[k] >= 0 && want[k] < total) slots[want[k]] = 'img';
    }
    // 3)에서 앞으로 당겨진 그림이 몇인지 센다. 뒤로 밀린 것(늦음)은 괜찮지만
    // 앞으로 당겨진 것은 아직 읽지도 않은 일을 먼저 보여 주는 셈이라 안 된다.
    let early = 0;
    for (let k = 0; k < count; k++) {
        if (at[k] >= 0 && want[k] < at[k]) early++;
    }
    return { slots, early };
}

// 지금 나눠진 대로 배치가 얼마나 좋은지 점수를 매긴다. 낮을수록 좋다.
// 그림이 장면보다 **앞서는 것**이 가장 나쁘다. 그 다음이 장면에서 먼 것이다.
function anchorScore(segs, ranges, count, anchors, slots) {
    const spreadOfSeg = si => {
        for (let p = 0; p < ranges.length; p++) {
            if (si >= ranges[p][0] && si < ranges[p][1]) return p >> 1;
        }
        return -1;
    };
    const imgAt = [];
    slots.forEach((kind, s) => { if (kind === 'img') imgAt.push(s); });
    let early = 0, dist = 0;
    for (let k = 0; k < count; k++) {
        const a = anchors[k];
        const si = a ? segs.findIndex(g => g.html.indexOf(a) >= 0) : -1;
        const at = si >= 0 ? spreadOfSeg(si) : -1;
        if (at < 0 || imgAt[k] === undefined) continue;
        if (imgAt[k] < at) early++;
        dist += Math.abs(imgAt[k] - at);
    }
    return { early, dist, score: early * 1000 + dist };
}

function slotPlan(imgCount, textCount) {
    const total = imgCount + textCount;
    const slots = new Array(total).fill('text');
    for (let k = 0; k < imgCount; k++) {
        let pos = Math.min(Math.round((k * total) / imgCount), total - 1);
        while (slots[pos] === 'img') pos = (pos + 1) % total;
        slots[pos] = 'img';
    }
    return slots;
}

// 글을 쪽마다 같은 높이만큼 나눠 담는다. 마지막 쪽만 남은 만큼 담는다.
// 장 제목이 붙는 첫 쪽은 제목까지 함께 얹어서 재야 한다.
// 제목 높이를 따로 빼서 계산하면 실제로 나란히 놓였을 때의 높이와 조금씩 어긋난다.
function fillPages(segs, caps, headHtml) {
    const pageHeight = (a, b, first) => PROBE.measure((first ? headHtml : '') + runHtml(segs, a, b));
    const ranges = [];
    let i = 0;
    for (let p = 0; p < caps.length; p++) {
        const rest = caps.length - p - 1;
        if (rest === 0) { ranges.push([i, segs.length]); break; }
        // 남은 글을 남은 쪽들의 크기에 비례해 나눈다. 그래야 쪽마다 고르게 찬다.
        // 꽉꽉 채워 넘기면 장의 마지막 펼침면이 거의 비어 버린다.
        // 그림이 얹힌 쪽은 담을 수 있는 높이가 작으므로 그만큼 적게 가져간다.
        const remainingH = pageHeight(i, segs.length, p === 0);
        let capSum = 0, capRest = 0;
        for (let q = p; q < caps.length; q++) capSum += caps[q];
        for (let q = p + 1; q < caps.length; q++) capRest += caps[q];
        // 뒤쪽 쪽들에 남은 글이 다 안 들어가면 이번 쪽이 그만큼 더 가져가야 한다.
        const share = remainingH * caps[p] / capSum;
        const room = Math.min(caps[p], Math.max(remainingH - capRest, share));
        const maxTake = Math.max(1, segs.length - i - rest);
        let take = 1;
        let lo = 1, hi = maxTake;
        while (lo <= hi) {
            const mid = (lo + hi) >> 1;
            if (pageHeight(i, i + mid, p === 0) <= room) { take = mid; lo = mid + 1; }
            else { hi = mid - 1; }
        }
        ranges.push([i, i + take]);
        i += take;
    }

    // 조각 단위로 끊다 보면 마지막 쪽에 넘치는 만큼이 남을 수 있다.
    // 뒤에서부터 훑어, 넘치는 쪽의 앞머리를 한 조각씩 앞 쪽으로 밀어 준다.
    for (let p = caps.length - 1; p > 0; p--) {
        while (ranges[p][1] - ranges[p][0] > 1 &&
               pageHeight(ranges[p][0], ranges[p][1], false) > caps[p]) {
            const prev = ranges[p - 1];
            if (pageHeight(prev[0], prev[1] + 1, p - 1 === 0) > caps[p - 1]) break;
            prev[1]++;
            ranges[p][0]++;
        }
    }
    return ranges;
}

// 그림 자리가 안 맞을 때 펼침면을 몇 장까지 늘려 볼지. 늘리면 책이 성겨진다.
const GROW_LIMIT = 1;

function paginateChapter(ch, chIndex) {
    const segs = CHAPTER_SEGS[chIndex];
    const arts = (ch.art && ch.art.length) ? ch.art : [];
    const { usable, headHeight, artHeight } = PROBE;
    const headHtml = `<h2>${CHAPTER_LABEL(ch.num)}${ch.title}</h2>`;
    const totalH = PROBE.measure(runHtml(segs, 0, segs.length));

    // 그림이 얹힌 쪽에도 그 아래에 글이 들어간다. 그래서 담을 수 있는 높이가 쪽마다 다르다.
    const underArt = Math.max(60, usable - artHeight);
    const capsOf = slots => {
        const caps = [];
        slots.forEach(kind => { caps.push(usable); caps.push(kind === 'img' ? underArt : usable); });
        return caps;
    };

    // 그림 한 장이 펼침면 하나를 쓴다. 거기서 시작해 글이 다 들어갈 때까지 펼침면을 늘린다.
    // 쪽 수는 조각 수를 넘을 수 없다 — 빈 쪽이 생기면 안 되기 때문이다.
    const minSpreads = Math.max(arts.length, 1);
    const maxSpreads = Math.max(minSpreads, Math.floor(segs.length / 2));
    let spreadCount = minSpreads;
    while (spreadCount < maxSpreads) {
        const caps = capsOf(slotPlan(arts.length, spreadCount - arts.length));
        if (caps.reduce((a, b) => a + b, 0) >= totalH + headHeight) break;
        spreadCount++;
    }

    const anchors = (ch.artAt && ch.artAt.length === arts.length) ? ch.artAt : null;
    let tries = 0;
    let slots = slotPlan(arts.length, Math.max(0, spreadCount - arts.length));
    let caps = capsOf(slots);
    let ranges = fillPages(segs, caps, headHtml);
    let grows = 0;
    let best = null;
    for (let guard = 0; guard < 40; guard++) {
        // 한 쪽이라도 넘치면 펼침면을 늘려 다시 나눈다.
        // 마지막 쪽만 보면 안 된다 — 첫 쪽에는 장 제목이 얹히므로 그쪽이 먼저 넘칠 수 있다.
        // 여유를 1px이나 두면 안 된다. 0.8px만 넘쳐도 그 칸에 스크롤 막대가 생기고,
        // 막대가 칸을 15px 좁히면 글이 다시 길어져 넘침이 32px로 불어난다.
        const over = ranges.some(([a, b], n) =>
            PROBE.measure((n === 0 ? headHtml : '') + runHtml(segs, a, b)) > caps[n] + 0.25);

        // 넘치지 않는 배치는 점수를 매겨 둔다. 되풀이가 두 자리를 오갈 때
        // 하필 나쁜 쪽에서 멈추는 일이 있어서, 끝나면 가장 좋았던 것으로 돌아간다.
        if (!over && anchors) {
            const sc = anchorScore(segs, ranges, arts.length, anchors, slots);
            if (!best || sc.score < best.score) {
                best = {
                    score: sc.score, slots: slots.slice(), caps: caps.slice(),
                    ranges: ranges.map(r => r.slice()), spreadCount
                };
            }
        }

        // 그림을 제 장면이 있는 쪽으로 옮긴다. 옮기면 글 나눔이 달라지므로
        // 자리가 더 안 움직일 때까지 되풀이한다.
        if (anchors && tries < 10) {
            const plan = anchorSlots(segs, ranges, arts.length, anchors, spreadCount);
            // 닻 둘이 같은 펼침면을 원하는데 뒤에 자리가 없으면 앞엣것이
            // 앞으로 당겨진다. 당기는 대신 펼침면을 한 장 늘려 자리를 만든다.
            // 그러면 글이 조금 성겨지지만, 그림이 장면보다 먼저 나오지는 않는다.
            if (plan.early > 0 && grows < GROW_LIMIT && spreadCount < maxSpreads) {
                grows++;
                spreadCount++;
                tries = 0;
                slots = slotPlan(arts.length, Math.max(0, spreadCount - arts.length));
                caps = capsOf(slots);
                ranges = fillPages(segs, caps, headHtml);
                continue;
            }
            if (plan.slots.join() !== slots.join()) {
                tries++;
                slots = plan.slots;
                caps = capsOf(slots);
                ranges = fillPages(segs, caps, headHtml);
                continue;
            }
        }
        if (!over || spreadCount >= maxSpreads) break;
        spreadCount++;
        tries = 0;
        slots = slotPlan(arts.length, Math.max(0, spreadCount - arts.length));
        caps = capsOf(slots);
        ranges = fillPages(segs, caps, headHtml);
    }

    // 오가는 동안 가장 좋았던 배치로 돌아간다.
    if (best) {
        slots = best.slots;
        caps = best.caps;
        ranges = best.ranges;
        spreadCount = best.spreadCount;
    }

    const spreads = [];
    let pageIdx = 0;
    let artIdx = 0;
    slots.forEach((kind, s) => {
        const left = ranges[pageIdx++];
        const right = ranges[pageIdx++];
        spreads.push({
            kind: 'chapter', ch, chIndex, first: s === 0,
            art: kind === 'img' ? arts[artIdx++] : null, left, right
        });
    });
    return spreads;
}
const COVER = {
    emoji: '🪷',
    title: '효녀 심청',
    intro: [
        "심청전은 지은이가 알려지지 않은 조선 후기 소설이에요. 판소리 심청가로 불리던 것이 글로 옮겨진 것이지요.",
        "이야기의 무대인 인당수는 황해도 앞바다에 있었다고 전해지는 물길이에요. 물살이 사납기로 이름나, 뱃사람들은 그 바다를 지날 때 제사를 지냈답니다.",
        "앞 못 보는 아버지 심 봉사가 눈을 뜨려면 공양미 삼백 석을 바쳐야 한대요. 가난한 집 딸 심청은 어떻게 할까요?",
        "소리꾼이 심청가를 부르면 듣는 사람들이 다 같이 울었다고 전해진답니다."
    ]
};

/* ── 그리기 ───────────────────────────────────────── */

function artFrame(src, emoji) {
    return `
        <div class="art-frame">
            <img src="images/${src}?v=20260918" alt="" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
            <div class="art-fallback" style="display:none">${emoji}</div>
        </div>`;
}

function coverPage() {
    const c = CV();
    return `
        <div class="page page-cover">
            <div class="story-page-left story-page-left-full">
                ${artFrame('cover.webp', c.emoji)}
            </div>
            <div class="story-page-right">
                <h1 data-say="0">${c.title}</h1>
                ${c.intro.map((p, i) => `<p data-say="${i + 1}">${p}</p>`).join('')}
            </div>
        </div>`;
}

function tocPage(part) {
    // 한 편으로 이어지는 이야기라 차례는 장 번호와 제목만 둔다.
    // 줄거리 한 줄을 붙이면 차례가 두 펼침면으로 늘어나고, 앞으로 읽을 대목을 미리 알려 주는 셈도 된다.
    // 쪽수는 화면 아래에 뜨는 그 번호(FOLIOS)를 그대로 가져다 쓴다.
    const folioOf = idx => (idx >= 0 ? FOLIOS[idx].start : '');
    const pageOfChapter = num => folioOf(PAGES.findIndex(p => p.kind === 'chapter' && p.first && p.ch.num === num));
    const pageOfKind = kind => folioOf(PAGES.findIndex(p => p.kind === kind && p.first !== false));
    const rowHtml = (attr, mark, title, page) => `
        <li>
            <button type="button" ${attr}>
                <span class="toc-num">${mark}</span>
                <span>
                    <strong>${title}</strong>
                    <small>${page}${T().folio}</small>
                </span>
            </button>
        </li>`;
    const itemHtml = ch => rowHtml(`data-goto="${ch.num}"`, ch.num, ch.title, pageOfChapter(ch.num));
    const extraItems = [
        rowHtml('data-goto-kind="quiz"', '❓', T().quiz, pageOfKind('quiz')),
        rowHtml('data-goto-kind="after"', '📖', T().after, pageOfKind('after')),
    ];
    const group = TOC_GROUPS[part];
    const last = part === TOC_GROUPS.length - 1;
    const items = group.map(itemHtml).concat(last ? extraItems : []);
    const half = Math.ceil(items.length / 2);
    return `
        <div class="page page-toc">
            <div class="story-page-left">
                ${part === 0 ? `<h2>${T().toc}</h2>` : ''}
                <ul class="toc-list">${items.slice(0, half).join('')}</ul>
            </div>
            <div class="story-page-right">
                ${part === 0 ? `<h2 class="toc-h2-ghost" aria-hidden="true">${T().toc}</h2>` : ''}
                <ul class="toc-list">${items.slice(half).join('')}</ul>
            </div>
        </div>`;
}

// 한 펼침면에 담을 수 있는 차례 항목은 여덟 개까지다. 그보다 많으면 차례도 여러 쪽이 된다.
const TOC_PER_SPREAD = 16;
let TOC_GROUPS = [];

function chapterSpreadPage(spread) {
    const ch = spread.ch;
    const segs = CHAPTER_SEGS[spread.chIndex];
    const head = spread.first ? `<h2>${CHAPTER_LABEL(ch.num)}${ch.title}</h2>` : '';

    if (spread.art) {
        return `
            <div class="page page-story">
                <div class="story-page-left">
                    ${head}
                    ${runHtml(segs, spread.left[0], spread.left[1])}
                </div>
                <div class="story-page-right story-page-right-image">
                    <div class="story-art-top">${artFrame(spread.art, ch.emoji)}</div>
                    ${runHtml(segs, spread.right[0], spread.right[1])}
                </div>
            </div>`;
    }

    return `
        <div class="page page-story">
            <div class="story-page-left">
                ${head}
                ${runHtml(segs, spread.left[0], spread.left[1])}
            </div>
            <div class="story-page-right story-page-right-text">
                ${runHtml(segs, spread.right[0], spread.right[1])}
            </div>
        </div>`;
}

const QUIZ = [
    { q: "심 봉사가 앞을 못 보게 된 것은 언제입니까?", choices: ["태어날 때부터 그러했다고 한다", "스무 살 무렵 병을 앓고 나서", "싸움을 하다 크게 다쳐서"], answer: 1 },
    { q: "어린 심청을 먹여 살린 것은 무엇입니까?", choices: ["절에서 보내 준 쌀", "외가에서 보낸 돈", "동네 아낙들의 젖동냥"], answer: 2 },
    { q: "심 봉사는 왜 겨울 개울에 빠졌습니까?", choices: ["물을 긷다가 발을 헛디뎌서", "딸 마중을 나가다 얼음에 미끄러져서", "동냥을 다니다 다리가 무너져서"], answer: 1 },
    { q: "삼백 석을 바치겠다고 하고 나서 심 봉사는 어떻게 했습니까?", choices: ["방바닥을 치며 후회했다", "바로 곡식을 모으러 나섰다", "딸에게 자랑을 했다"], answer: 0 },
    { q: "뱃사람들이 사람을 구한 까닭은 무엇입니까?", choices: ["인당수를 무사히 건너려고", "배에서 일할 사람이 없어서", "임금의 명을 받아서"], answer: 0 },
    { q: "심청은 아버지에게 뭐라고 둘러댔습니까?", choices: ["몽운사에 일을 하러 간다고", "장 승상 댁 수양딸이 된다고", "먼 외가에 잠깐 다녀온다고"], answer: 1 },
    { q: "심청은 떠나기 전 밤마다 무엇을 했습니까?", choices: ["마을 아낙들에게 밥을 지어 주었다", "아버지의 사철 옷을 지어 두었다", "아버지께 인당수 이야기를 들려주었다"], answer: 1 },
    { q: "용궁 사람들은 심청을 무엇이라고 했습니까?", choices: ["하늘이 보낸 사람", "바다에 바쳐진 제물", "임금이 찾는 처녀"], answer: 0 },
    { q: "어머니는 심청을 안고 무엇이라고 했습니까?", choices: ["왜 이리 늦게 왔느냐", "아버지는 잘 계시느냐", "손이 어쩌다 이리 거칠어졌누"], answer: 2 },
    { q: "뱃사람들은 인당수를 지날 때마다 무엇을 했습니까?", choices: ["술을 붓고 절을 했다", "돛을 내리고 하룻밤을 머물렀다", "쌀을 바다에 뿌렸다"], answer: 0 },
    { q: "임금이 사람을 보내 찾았을 때 심 봉사는 어디에 있었습니까?", choices: ["몽운사에서 지내고 있었다", "도화동을 떠나 낯선 고을을 떠돌고 있었다", "장 승상 댁에 몸을 맡기고 있었다"], answer: 1 },
    { q: "한양으로 가는 길에 심 봉사가 겪은 일은 무엇입니까?", choices: ["주막에서 만난 사람에게 봇짐을 도둑맞았다", "도랑에 빠져 다리를 다쳐 며칠 누웠다", "마을 사람이 한양까지 데려다주었다"], answer: 0 },
    { q: "심 봉사는 언제 눈을 떴습니까?", choices: ["관리가 이름을 물었을 때", "딸이 처음 아버지 하고 불렀을 때", "어디 좀 보자 하고 소리쳤을 때"], answer: 2 },
    { q: "심 봉사가 앞을 보게 되자 무슨 일이 벌어졌습니까?", choices: ["하늘에서 꽃비가 쏟아져 내렸다", "인당수 물살이 잔잔해졌다", "잔치에 온 이들이 다 눈을 떴다"], answer: 2 },
    {
        q: "이 책을 읽고 난 반응으로 알맞지 않은 것은 무엇인가요?",
        wide: true,
        choices: [
            "장 승상 댁 부인이 대신 쌀을 내주겠다는데도 마다한 것을 보면, 값보다 제 손으로 드리는 것을 앞세웠구나.",
            "젊은 뱃사람이 밤중에 지금이라도 뭍에 내려 주겠다고 한 것을 보면, 그 배에도 마음이 편치 않은 사람이 있었네.",
            "어머니가 쌀로 뜨는 눈이 아니라고 한 것을 보면, 삼백 석이 답은 아니었어.",
            "심 봉사가 딸을 보내고 삼백 석을 절에 바쳐 눈을 뜬 것을 보면, 스님의 말이 그대로 맞았나 봐."
        ],
        answer: 3
    }
];

// 선지를 세로로 쌓으니 한 쪽에 열여섯 문항이 다 들어가지 않는다. 몇 개씩 나눠 싣는다.
// 문제는 한 쪽에 다 넣고 스크롤해서 푼다.
// 쪽을 쪼개 놓으면 쪽마다 절반이 비고, 답을 고르려고 여러 번 넘겨야 한다.
const QUIZ_GROUPS = [{ from: 0 }];

// 쪽을 넘겼다 돌아와도 이미 푼 문항은 풀린 채로 있어야 한다.
const QUIZ_PICKED = new Array(QUIZ.length).fill(null);
/* 여태 골라 본 틀린 보기. 쪽을 오가도 빨갛게 남는다. */
const QUIZ_WRONG = QUIZ.map(() => new Set());

/* 보기는 책을 열 때마다 자리를 바꾼다. 답의 자리를 외워 버리면 문제가 아니게 된다.
   섞는 것은 그리는 차례뿐이고, 채점은 data-choice 에 담긴 원래 번호로 한다.
   한 번 정한 차례는 책을 닫을 때까지 그대로다. 쪽을 오갈 때마다 바뀌면 헷갈린다. */
function shuffledOrder(n) {
    const a = [...Array(n).keys()];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

/* 보기 차례는 한글 문항 수로 정한다. 영어판도 보기 개수가 같고,
   QZ 는 이 줄보다 아래에서 만들어져 여기서 부르면 책이 열리지 않는다. */
const QUIZ_ORDER = QUIZ.map(q => shuffledOrder(q.choices.length));

function quizPage(part) {
    const group = { from: QUIZ_GROUPS[part].from, items: QZ() };
    const done = QUIZ_PICKED.filter(v => v !== null).length;
    const items = group.items.map((item, k) => {
        const i = group.from + k;
        const picked = QUIZ_PICKED[i];
        const graded = picked !== null;
        const cls = ci => (graded && ci === item.answer) ? ' correct'
            : (QUIZ_WRONG[i].has(ci) ? ' incorrect' : '');
        return `
        <div class="quiz-item${graded ? ' graded' : ''}" data-qindex="${i}">
            <p class="quiz-question">${i + 1}. ${item.q}</p>
            <div class="quiz-choices${item.wide ? ' quiz-choices-stack' : ''}">
                ${QUIZ_ORDER[i].map(ci => `<button type="button" class="quiz-choice${cls(ci)}" data-choice="${ci}">${item.choices[ci]}</button>`).join('')}
            </div>
        </div>`;
    }).join('');
    return `
        <div class="page page-quiz">
            ${part === 0 ? `<h2>${T().quiz}</h2>` : ''}
            <p class="quiz-intro-text" id="quizProgress">${T().done(done, QZ().length)}</p>
            <div class="quiz-list">${items}</div>
        </div>`;
}

/* 읽고 나서 — 장과 같은 방식으로 쪽을 나눈다. 그림은 오른쪽 위에 얹힌다. */
const AFTERWORD = {
    title: '읽고 나서',
    emoji: '👁️',
    art: ['end.webp'],
    paras: [
        `이 이야기는 책이기 전에 노래였습니다. 소리꾼 한 사람이 북 치는 사람 하나만 데리고 서너 시간을 내리 부르는 「심청가」가 먼저 있었고, 그것을 글로 옮겨 적은 것이 지금 읽은 『심청전』입니다.`,
        `판소리로 지금까지 남아 전하는 것은 다섯 마당입니다. 춘향가, 심청가, 흥보가, 수궁가, 적벽가. 이 가운데 세 마당이 이 서가에 소설로 들어와 있습니다. 춘향전, 심청전, 그리고 흥부전입니다. 수궁가는 토끼전이 되었으니 넷인 셈입니다.`,
        `그래서 이 이야기에는 지은이가 없습니다. 한 사람이 앉아서 지어낸 것이 아니라, 소리꾼들이 부르고 또 부르면서 조금씩 고쳐 온 것이기 때문입니다. 사람들이 울던 대목은 점점 더 늘었고, 지루해하던 대목은 저절로 줄었습니다.`,
        `그러다 보니 책마다 내용이 다릅니다. 옛날에 서울에서 찍어 팔던 것과 전주에서 찍어 팔던 것을 견주어 보면 길이부터 세 배 가까이 차이가 납니다. 어느 쪽이 진짜인지 따질 수가 없습니다. 둘 다 진짜입니다.`,
        `이 책에도 덜어 낸 대목이 있습니다. 원래 이야기에는 심청이 떠난 뒤에 뺑덕 어멈이라는 사람이 나옵니다. 심 봉사에게 붙어살면서 딸이 남기고 간 재물을 야금야금 축내고, 맹인 잔치를 찾아가는 길에서는 그마저 챙겨 달아나 버립니다. 심 봉사가 빈털터리로 대궐에 닿게 만드는 대목입니다.`,
        `이 이야기의 뿌리로 흔히 세 가지를 꼽습니다. 『삼국사기』에 실린 효녀 지은 이야기는 가난한 딸이 제 몸을 남의 집에 팔아 어머니를 봉양한 이야기입니다. 『삼국유사』의 거타지 이야기에는 사람을 제물로 바치는 바다가 나옵니다. 전라도 관음사에 전해 오는 원홍장 이야기는 눈먼 아버지를 둔 딸이 뱃사람들에게 팔려 가는 이야기입니다.`,
        `사람을 제물로 바다에 바치는 이야기는 우리나라에만 있는 것이 아닙니다. 배를 타고 먼바다로 나가야 먹고사는 곳이면 어디든 비슷한 이야기가 있습니다. 그만큼 바다가 무서웠다는 뜻입니다.`,
        `그런데 심청은 그런 이야기들과 한 군데가 다릅니다. 끌려간 것이 아니라 제 발로 갔습니다. 값을 매기고 흥정을 한 것도 심청 자신입니다. 제물이 된 사람이 아니라 제 몸을 팔기로 정한 사람입니다. 이 한 가지 차이 때문에 이야기가 완전히 달라집니다.`,
        `공양미 삼백 석이라는 셈도 한 번 짚어 볼 만합니다. 삼백 석은 어른 백 사람이 한 해를 먹고도 남을 쌀입니다. 동냥으로 딸을 키운 집에서 마련할 수 있는 양이 아닙니다. 애초에 갚을 수 없는 값이었습니다.`,
        `그것이 이 이야기의 급소입니다. 심 봉사는 눈이 보이지 않으니 쌀 삼백 석이 마당에 쌓이면 얼마나 되는지를 볼 수 없었습니다. 보았다면 그 자리에서 스님을 붙들었을 것입니다. 약속을 한 것이 아니라, 얼마나 큰 약속인지 모른 채 고개를 끄덕인 것입니다.`,
        `삼 장을 다시 펴 보십시오. 심청이 아버지에게 장 승상 댁 수양딸로 간다고 둘러대는 대목이 있습니다. 이 책에서 심청이 하는 유일한 거짓말입니다. 효도한 딸이 아버지를 속이고 떠난 것입니다. 이야기가 그 거짓말을 나무라지 않는 까닭도 생각해 볼 만합니다.`,
        `장 승상 댁 부인이 삼백 석을 대신 내주겠다고 했을 때 심청이 그 길을 마다한 것도 그렇습니다. 돈만 놓고 보면 받는 편이 낫습니다. 심청이 마다한 것은 값을 치르지 않고 얻은 것이 아버지의 눈이 되어서는 안 된다고 여겼기 때문입니다.`,
        `인당수는 지어낸 곳이 아닙니다. 서해 백령도 앞바다의 물살 센 자리를 그렇게 불렀다고 전해 옵니다. 지금도 백령도에는 심청을 기리는 집이 서 있고, 맞은편 황해도 땅에 심청이 나고 자란 마을이 있었다는 말도 함께 전해 옵니다.`,
        `심청이 다시 나온 자리가 하필 연꽃인 것에도 까닭이 있습니다. 연꽃은 맑은 물에서 피지 않습니다. 진창에 뿌리를 박고 그 위로 깨끗한 꽃을 밀어 올립니다. 이 이야기를 지어 온 사람들이 절과 가까웠던 것을 생각하면, 연꽃을 고른 것은 우연이 아닙니다.`,
        `마지막 장에서 심 봉사가 눈을 뜬 것은 약을 먹어서가 아닙니다. 쌀 삼백 석을 절에 바쳐서도 아닙니다. 쌀은 벌써 오래전에 들어갔는데 눈은 그대로였습니다. 눈이 떠진 것은 딸의 목소리를 들은 그 자리에서였습니다.`,
        `그리고 그날 눈을 뜬 사람은 심 봉사만이 아니었습니다. 잔치에 왔던 사람도, 늦게 와서 문밖에 서 있던 사람도 다 떴습니다. 한 사람의 일로 끝내지 않은 것입니다. 옛이야기가 좋은 일을 마무리하는 방식이 대개 이렇습니다.`,
        `이 이야기를 효도 이야기로만 읽으면 절반만 읽은 것이 됩니다. 효도 이야기라면 심청이 인당수에 몸을 던지는 데서 끝나야 합니다. 그런데 이야기는 거기서 끝나지 않고 심청을 기어이 되돌려 놓습니다. 이 이야기를 지어 온 사람들도 그대로 보내지는 못한 것입니다.`,
        `심 봉사도 다시 보아야 할 사람입니다. 이 사람은 딸을 팔아 눈을 뜬 아버지입니다. 그것을 알고 나서 이 사람이 어떻게 살았을지 생각해 보면, 마지막 쪽에서 그가 한 말이 달리 들립니다. 제 눈을 뜨게 한 것이 아니라 눈을 뜨고 싶게 만든 것이라고 했지요.`,
        `오늘 이 이야기를 읽으면서 마음이 불편했다면 그것이 맞습니다. 아버지를 위해 딸이 목숨을 내놓는 것을 우리는 더 이상 아름답다고 하지 않습니다. 옛사람들이 아름답게 여긴 것을 오늘 사람이 그대로 따라 여길 필요는 없습니다. 이야기는 남고 값매김은 바뀝니다.`,
        `심청이 제 몸을 판 것은 잘한 일이었을까요? 아버지 눈은 떠졌습니다. 그러나 아버지가 그것을 바랐을 리는 없습니다. 누군가를 위한 일인데 그 사람이 바라지 않는 일이라면, 그것은 누구를 위한 일일까요.`,
        `심 봉사가 삼백 석의 크기를 알았더라면 어땠을까요? 이 이야기는 눈이 보이지 않아서 생긴 일입니다. 몰라서 한 약속의 값을 딸이 치른 셈인데, 그렇다면 잘못은 누구에게 있을까요.`,
        `몽운사 스님은 왜 하필 삼백 석이라고 했을까요? 서른 석이라고 했다면 심청은 팔려 가지 않았을 것입니다. 스님이 그 값을 부를 때 무슨 생각을 했을지, 이 물음에는 이야기가 끝내 답해 주지 않습니다.`
    ]
};

let AFTER_SEGS = [];

const AFTER_FOOT = () => `<p class="after-home"><a class="home-btn" href="../../../../../">${T().home}</a></p>`;

function paginateAfterword() {
    const segs = AFTER_SEGS;
    const arts = AF().art || [];
    const { usable, headHeight, artHeight } = PROBE;
    const headHtml = `<h2>${AF().title}</h2>`;
    const totalH = PROBE.measure(runHtml(segs, 0, segs.length));

    const underArt = Math.max(60, usable - artHeight);

    // 맨 끝에는 학습 허브로 가는 단추가 붙는다. 그 높이를 미리 빼 두지 않으면
    // 마지막 쪽만 넘친다.
    const footH = PROBE.measure(AFTER_FOOT());

    const capsOf = slots => {
        const caps = [];
        slots.forEach(kind => { caps.push(usable); caps.push(kind === 'img' ? underArt : usable); });
        caps[caps.length - 1] = Math.max(60, caps[caps.length - 1] - footH);
        return caps;
    };

    const minSpreads = Math.max(arts.length, 1);
    const maxSpreads = Math.max(minSpreads, Math.floor(segs.length / 2));
    let spreadCount = minSpreads;
    while (spreadCount < maxSpreads) {
        const caps = capsOf(slotPlan(arts.length, spreadCount - arts.length));
        if (caps.reduce((a, b) => a + b, 0) >= totalH + headHeight) break;
        spreadCount++;
    }

    let slots = slotPlan(arts.length, Math.max(0, spreadCount - arts.length));
    let caps = capsOf(slots);
    let ranges = fillPages(segs, caps, headHtml);
    for (let guard = 0; guard < 8; guard++) {
        const over = ranges.some(([a, b], n) =>
            PROBE.measure((n === 0 ? headHtml : '') + runHtml(segs, a, b)) > caps[n] + 0.25);
        if (!over || spreadCount >= maxSpreads) break;
        spreadCount++;
        slots = slotPlan(arts.length, Math.max(0, spreadCount - arts.length));
        caps = capsOf(slots);
        ranges = fillPages(segs, caps, headHtml);
    }

    const spreads = [];
    let pageIdx = 0;
    let artIdx = 0;
    slots.forEach((kind, s) => {
        const left = ranges[pageIdx++];
        const right = ranges[pageIdx++];
        spreads.push({
            kind: 'after', first: s === 0, last: s === slots.length - 1,
            art: kind === 'img' ? arts[artIdx++] : null, left, right
        });
    });
    return spreads;
}

function afterSpreadPage(spread) {
    const segs = AFTER_SEGS;
    const head = spread.first ? `<h2>${AF().title}</h2>` : '';
    // 학습 허브로 돌아가는 길은 맨 끝에 한 번만 둔다.
    const foot = spread.last ? AFTER_FOOT() : '';

    if (spread.art) {
        return `
            <div class="page page-story page-after">
                <div class="story-page-left">
                    ${head}
                    ${runHtml(segs, spread.left[0], spread.left[1])}
                </div>
                <div class="story-page-right story-page-right-image">
                    <div class="story-art-top">${artFrame(spread.art, AF().emoji)}</div>
                    ${runHtml(segs, spread.right[0], spread.right[1])}
                    ${foot}
                </div>
            </div>`;
    }

    return `
        <div class="page page-story page-after">
            <div class="story-page-left">
                ${head}
                ${runHtml(segs, spread.left[0], spread.left[1])}
            </div>
            <div class="story-page-right story-page-right-text">
                ${runHtml(segs, spread.right[0], spread.right[1])}
                ${foot}
            </div>
        </div>`;
}


/* ── 영어판 ────────────────────────────────────────────────────
   우리말 글과 영어 글을 나란히 두고, 단추 하나로 갈아 끼운다.
   쪽은 재어서 나누므로 말을 바꾸면 처음부터 다시 나눈다. */
/* 영어판 — 줄 단위 번역이 아니라 영어로 다시 썼다.
   읽기를 앞세운다. 줄임말을 쓰고, 옛 관용구는 쉬운 말로 바꾼다.
   artAt 닻은 영어 문장 조각으로 새로 잡았다. */
const EN = {
    lang: 'en',
    cover: {
        emoji: '🪷',
        title: 'Simcheong the Devoted Daughter',
        intro: [
            "This story was a song before it was a book: Simcheong-ga, sung as pansori by one singer with one drummer.",
            "There is no author. Singers changed it a little each time, so every old copy is different.",
            "Indangsu, the sea in this story, is not invented. People gave that name to hard water off Baengnyeongdo in the West Sea.",
            "Her blind father needs three hundred sacks of rice to see again, and Simcheong is poor. What will she do?"
        ]
    },
    chapters: [
        {
            num: 1,
            title: "The Daughter Raised on Begged Milk",
            art: ["story-01-a.webp", "story-01-b.webp", "story-01-c.webp"],
            artAt: ["Just one mouthful for my child", "went from house to house with a bowl", "heard of it and sent for Simcheong"],
            paras: [
                "Long ago in Dohwadong, in Hwangju in Hwanghae province, there lived a man called Sim Hakgyu. His family had been a reading family once, but the household had come down in the world and they were poor.",
                "When Sim Hakgyu was about twenty he had a bad illness, and after it he could not see. From then on people called him Sim Bongsa<span class=\"gloss\">(the old word for a blind man)</span>.",
                "His wife, Lady Gwak, took in sewing and pounded other people's grain, and kept the two of them fed. They were poor, but there was no better-matched couple.",
                "After more than ten years of marriage Lady Gwak was going to have a child. Sim Bongsa could not sleep all night for the news.",
                "The next spring a daughter was born. They named her Cheong.",
                "But seven days after the child was born, Lady Gwak died. She had been weak, and there had been no proper rest for her after the birth.",
                "Sim Bongsa sat down in the yard with the newborn in his arms and wept. How is a man who cannot see to raise a baby at the breast?",
                "But Sim Bongsa did not only weep. From the next day he wrapped the child up, held her in his arms and began going round the village.",
                "\"I hear there is a nursing mother in this house. Just one mouthful for my child, please.\"",
                "The women of the village took the baby and fed her. In one house they made her thin gruel; in another they gave out old clothes.",
                "Sim Bongsa went out in the morning and came home in the evening. He went to more than ten houses a day. There was always a stick in his hand and always a child in his arms.",
                "So Cheong grew up on the milk of the whole village. People said,<br>\"That child was raised by all of Dohwadong together.\"",
                "As she grew, Cheong became her father's eyes.",
                "At six she was already leading him by the hand.<br>\"Father, there's a stone here.\"<br>\"Father, turn left now.\"",
                "At seven she cooked the rice. The stove was so high that she had to put down a block and stand on it.",
                "At eight she left her father at home and went out to beg alone.<br>\"Stay here, father. I'll go.\"<br>\"You must not. What has a small child to do with begging?\"<br>\"If you go out I worry so that I can't do anything.\"",
                "Cheong went from house to house with a bowl. People felt for the little thing and put in two extra spoonfuls.",
                "But Cheong never ate first what she had been given. She always set it in front of her father and asked,<br>\"Father, have you eaten?\"<br>\"Yes, I've eaten.\"",
                "Only when Sim Bongsa had emptied his bowl would Cheong crouch at the stove and eat what was left. On some days there was nothing left and she drank water.",
                "At twelve Cheong learned to take in sewing. It was her mother's work. Her hands were deft and the village soon knew her name for it.",
                "At fifteen Cheong was the hardest-working young woman in Dohwadong. The village called her Simcheong and thought a great deal of her.",
                "The lady of the Jang household heard of it and sent for Simcheong. The lady liked her the moment she saw her.<br>\"Will you not be my adopted daughter? I will look after your father as well.\"",
                "Simcheong bowed her head.<br>\"You are very kind. But without me my father cannot even fetch himself a bowl of water.\"",
                "The lady's eyes reddened at that. And then she said,<br>\"If ever you are in trouble, come to me.\""
            ]
        },
        {
            num: 2,
            title: "Three Hundred Sacks of Rice",
            art: ["story-02-a.webp", "story-02-b.webp", "story-02-c.webp"],
            artAt: ["somebody jumped into the water", "not eyes that cannot be cured", "a bowl of fresh water"],
            paras: [
                "It was the winter of the year Simcheong turned fifteen. That day Simcheong had gone to the Jang household to take back some sewing.",
                "The sun went down and his daughter did not come home, and Sim Bongsa began to worry.<br>\"Why is the child so late?\"",
                "In the end he could not wait, and he took his stick and went out to meet her. The road was frozen over.",
                "As he was crossing the bridge over the stream, the end of his stick slipped on the ice.",
                "There was a splash and Sim Bongsa went into the water. The winter water cut like a knife. Sim Bongsa could not tell which way the bank was and only thrashed about.",
                "\"Help! Somebody help!\"<br>His voice grew fainter and fainter.",
                "Then somebody jumped into the water. He pulled Sim Bongsa out, laid him on the bank and beat his back.",
                "Sim Bongsa brought up the water and barely came to himself.<br>\"Who... who is it?\"<br>\"A monk from Mongunsa.\"",
                "The monk held him up and took him all the way home. He got him into dry clothes and lit the fire for him.",
                "Sim Bongsa took the monk's hand and sobbed.<br>\"How am I to repay this? The truth is I am not afraid of dying. I am afraid that if I die my Cheong will be left alone.\"",
                "The monk looked into Sim Bongsa's face for a long while.<br>\"Your eyes are not eyes that cannot be cured.\"",
                "Sim Bongsa's head came up.<br>\"What... what do you mean?\"",
                "\"Offer three hundred sacks of temple rice<span class=\"gloss\">(rice offered to the Buddha)</span> to the Buddha of our temple and pray with a whole heart, and you will see.\"",
                "The moment Sim Bongsa heard it he did not stop to think.<br>\"I will offer them! I will offer three hundred sacks!\"",
                "The monk was startled and asked,<br>\"Is three hundred sacks anywhere near possible for a household like yours?\"<br>\"It is! Write it down!\"",
                "Unwillingly the monk wrote the name Sim Hakgyu and three hundred sacks in the offering book. And he went back to the temple, looking round several times as he went.",
                "Only when the monk had gone did Sim Bongsa come to his senses.",
                "Three hundred sacks. There were not three measures of rice in that house. How was a man without one plot of paddy or one plot of field to find three hundred sacks?",
                "Sim Bongsa beat the floor and regretted it.<br>\"Oh, I was mad. How am I to bear the sin of lying to the Buddha?\"",
                "Late that night Simcheong came home. Her father was lying with the quilt over his head.<br>\"Father, are you ill?\"",
                "At first Sim Bongsa did not mean to tell her. But his daughter kept asking, and in the end it all came out.",
                "When she had heard the whole of it Simcheong said nothing for a long while. And then she said,<br>\"You did well, father.\"",
                "\"Did well? How are we to manage it?\"<br>\"It is a promise made to the Buddha. Surely he will not let us fail to keep it. Don't worry, and go to sleep.\"",
                "That night Simcheong went out to the back garden, set out a bowl of fresh water and prayed for a long time. It was exactly what her mother had done when she was alive."
            ]
        },
        {
            num: 3,
            title: "The Sailors and the Lie",
            art: ["story-03-a.webp", "story-03-b.webp", "story-03-c.webp"],
            artAt: ["Several men dressed as sailors", "I will go", "sat beside her sleeping father"],
            paras: [
                "A few days later Simcheong saw strangers at the mouth of the village. Several men dressed as sailors were putting something up.",
                "Simcheong went over and asked,<br>\"What is happening?\"",
                "The one who looked like their leader answered,<br>\"We are sailors who trade down to Nanjing. On the way we have to pass a place called Indangsu, and that water is so wild that several ships go over every year.\"",
                "\"And?\"<br>\"They have always said that sea grows calm if it is given a girl of fifteen. So we are looking for someone. We will pay whatever it takes.\"",
                "Simcheong's heart began to beat hard.",
                "\"...You said whatever it takes?\"<br>\"I did.\"<br>\"Would three hundred sacks of rice be possible?\"",
                "The men turned and looked at her.<br>\"It would. But why do you ask?\"",
                "\"I will go.\"",
                "For a long moment the men could not speak. The leader looked into her face.<br>\"Young woman, this is not a game. It means throwing yourself into the sea.\"<br>\"I know.\"",
                "\"What has brought you to such a decision?\"<br>Simcheong said it calmly.<br>\"My father cannot see. They say that if three hundred sacks of rice are offered to the temple he will see again.\"",
                "The leader turned his head away. A young sailor beside him pressed his sleeve to his eyes.",
                "\"...When shall we send the rice?\"<br>\"Send it to Mongunsa today, please. I will come on the day the ship sails.\"<br>\"We sail on the fifteenth of the third month.\"",
                "That evening Simcheong sat down in front of her father.",
                "\"Father, there is good news. The three hundred sacks of temple rice have been found.\"",
                "Sim Bongsa sprang up.<br>\"What! How?\"",
                "Simcheong brought out the words she had thought over beforehand.<br>\"The lady of the Jang household wanted me for an adopted daughter, you remember. I have agreed to go into that house. And in return she is sending the three hundred sacks to the temple.\"",
                "\"An adopted daughter. Then you will be living in that house?\"<br>\"I go on the fifteenth. I'll come and see you often.\"",
                "At first Sim Bongsa was sorry. But then he was glad.<br>\"That's good. That's good. In that house you'll be spared this hard life.\"",
                "Simcheong smiled and answered,<br>\"Yes, father.\"<br>And then she went quickly out to the kitchen. Never had she been so glad that her father could not see.",
                "From that day Simcheong sewed every night. She made her father's clothes for all four seasons. Spring clothes, summer clothes, autumn clothes, winter clothes, folded in turn and put away in the chest.",
                "She made several pairs of socks as well. And she asked the women of the village, quietly,<br>\"While I am away, will you see that my father eats?\"",
                "A few days later someone came in haste from the Jang household.",
                "When Simcheong came in the lady sprang to her feet.<br>\"Is it true that you have sold yourself to the sailors?\"",
                "Instead of answering, Simcheong bowed her head. The lady took her two hands. It was the lady's hands that shook the more.<br>\"Why did you not come to me? Did I not say to come to me if you were in trouble?\"",
                "There and then the lady called her storekeeper.<br>\"Take out three hundred sacks of rice and send them to Mongunsa today. And give back what the sailors have paid.\"",
                "Simcheong caught hold of the lady's sleeve.<br>\"My lady, please do not.\"",
                "The lady turned to her.<br>\"What are you saying? You can live, and you say you will die?\"",
                "\"I have already taken the payment. That rice has already gone to Mongunsa, and I said I would come on the fifteenth. If I go back on it now, I am a person who has cheated others.\"",
                "\"It is a matter of a person living or dying. What is a promise beside that?\"",
                "Simcheong was silent for a long while. Then she spoke quietly.<br>\"If you pay it for me, my father will see. But those eyes will not be what I gave him.\"",
                "\"And what does that matter? If he can see, he can see.\"",
                "\"The only thing I have to give my father is myself. If even that is somebody else's, then I am a daughter who gave her father nothing at all.\"",
                "The lady could say no more. After a long moment she took Simcheong's face in both hands.<br>\"...I cannot win against you.\"",
                "Simcheong asked one last thing.<br>\"Say nothing to my father. He believes I am becoming your adopted daughter.\"",
                "On the way home Simcheong did not once look back.",
                "It was the night before the fifteenth of the third month. Simcheong set her father's table more carefully than she ever had.",
                "Sim Bongsa stopped in the middle of eating and asked,<br>\"The dishes are unusual today. Is it some special day?\"<br>\"...No reason.\"",
                "That night Simcheong sat beside her sleeping father and stayed awake until morning. She took his hand and let it go and took it again, and looked at his face for a long, long time."
            ]
        },
        {
            num: 4,
            title: "Indangsu",
            art: ["story-04-a.webp", "story-04-b.webp", "story-04-c.webp"],
            artAt: ["set her father's breakfast", "the ship reached Indangsu", "threw herself into the whirlpool"],
            paras: [
                "The cock crowed at dawn. Simcheong set her father's breakfast on the table and changed her clothes.",
                "Then voices came from outside the gate.<br>\"Young woman, it is time.\"",
                "Sim Bongsa woke.<br>\"Who has come?\"<br>\"They have come from the Jang household to fetch me.\"",
                "But the voices outside the gate were men's voices. Sim Bongsa tipped his head.<br>\"Why would the Jang household send men?\"",
                "Simcheong knelt in front of her father. And she made her last bow.",
                "\"Father.\"<br>\"Yes.\"<br>\"Take care of yourself. Don't miss your meals.\"<br>\"Yes, yes. You look after yourself.\"",
                "Simcheong stood up. She could not get her feet over the threshold.",
                "Then one of the village women could not hold it in and burst out crying.<br>\"Oh, Simcheong...\"",
                "Sim Bongsa heard it.<br>\"Why is that woman crying?\"",
                "There was no answer. Only then did Sim Bongsa understand that something was wrong. He ran out into the yard without even his stick.",
                "\"Cheong! Cheong! Where are you!\"<br>Sim Bongsa felt about in the empty air of the yard. His hands closed on nothing.",
                "\"You men! Where are you taking my daughter! What do my eyes matter! I don't want to see! Give me my daughter!\"<br>Sim Bongsa ran a few steps out of the gate after them, caught his foot on a stone and fell. The villagers ran and held him. Far down the road Simcheong looked back exactly once.",
                "The ship carrying Simcheong sailed the sea road for three days. Simcheong sat in the bow and looked only at the sea.",
                "The sailors treated her with great care. They cooked good food for her and made her a place apart at night. And still not one of them could meet her eye.",
                "One young sailor came to her side in the night and said,<br>\"Young woman, change your mind even now. We will set you down on land. The rice has gone to the temple already; we can just leave it.\"",
                "Simcheong shook her head.<br>\"Then we would be lying to the Buddha. My father would not see.\"",
                "On the morning of the fourth day the ship reached Indangsu.",
                "The sea changed all at once. Water that had been smooth a moment before began to turn black and whirl. The ship pitched up and down.",
                "The sailors took in the sails and set out an offering table. They burned incense and bowed.",
                "The leader came and knelt in front of Simcheong.<br>\"Young woman, we shall carry this sin all our lives.\"",
                "Simcheong raised him to his feet.<br>\"I came of my own will. Only, I ask you one thing.\"<br>\"Anything. Say it.\"<br>\"On your way home, stop at Dohwadong and see whether my father is still alive.\"",
                "Simcheong walked to the bow. And she put her two hands together toward the western sky.",
                "\"Heaven. This body of mine is no loss, but let my father's eyes be opened.\"",
                "And then she pulled her skirt up over her head and threw herself into the whirlpool. The water heaved once and then went smooth. The sailors lay against the rail and wept aloud."
            ]
        },
        {
            num: 5,
            title: "Under the Water, and the Lotus",
            art: ["story-05-a.webp", "story-05-b.webp", "story-05-c.webp"],
            artAt: ["sank down and down", "It was Lady Gwak", "one red lotus as tall as a person"],
            paras: [
                "Simcheong sank down and down through the water. Strangely, she could not feel herself smothering.",
                "How far down she went she did not know. Then it grew bright beneath her feet and somebody took her body up.",
                "When she opened her eyes she was in a palanquin made of jade. On both sides strangers stood in rows and bowed.",
                "\"You are welcome.\"<br>\"...Where is this?\"<br>\"It is the Dragon Palace under the water.\"",
                "Simcheong was led into a great palace. The pillars were coral and the floor was pearl. They seated her in the highest place and set a table before her.",
                "\"I am a body given as an offering. There is no reason for me to be treated so.\"<br>\"You are no offering. Heaven has sent you here.\"",
                "Some days later the screen of the hall was drawn back and a woman came in.",
                "Simcheong had never seen that face. And still her heart knew it first.",
                "\"...Mother?\"<br>It was Lady Gwak. She held Simcheong and did not let go for a long time.",
                "\"How big my daughter has grown. And how did these hands get so rough?\"<br>In her mother's arms Simcheong cried out loud for the first time in her life. It was fifteen years of crying held back.",
                "A few days later her mother said,<br>\"Now you must go back.\"<br>\"Mother, may I not stay here?\"<br>\"Your father's eyes are not open yet.\"",
                "Simcheong raised her head.<br>\"Even with three hundred sacks offered?\"<br>\"They are not eyes that open for rice. They are eyes that open when you go.\"",
                "On the day they parted, her mother seated Simcheong inside a great lotus bud.",
                "\"Sleep in here. When you open your eyes it will be the world again.\"<br>\"And you, mother?\"<br>\"I shall be watching from here always.\"",
                "The petals closed one by one. Inside them Simcheong drifted into sleep.",
                "The lotus rose slowly. Swaying with the current, it came after several days to the middle of Indangsu.",
                "About that time a ship coming back from trading in Nanjing was passing Indangsu. It was the very ship that had taken Simcheong.",
                "Whenever they passed that sea the sailors poured wine and bowed. That day too they were setting out a table at the rail when they saw something floating on the water.",
                "\"What is that?\"<br>\"A flower! It is a lotus!\"",
                "Out of season, and not in a pond but in the middle of the open sea, one red lotus as tall as a person was floating there.",
                "The leader had the ship brought alongside. When they lifted the flower aboard, a faint scent spread through the whole ship.",
                "\"This is no ordinary flower.\"<br>The sailors set the flower in the middle of the ship and made for land.",
                "When they reached land the story spread in no time. The tale of a strange lotus taken out of the sea soon reached the palace.",
                "At that time the king of the country had lost his queen and was living alone. When he heard about the flower he sent for the sailors.<br>\"Bring that flower into the palace.\""
            ]
        },
        {
            num: 6,
            title: "The Feast for the Blind",
            art: ["story-06-a.webp", "story-06-b.webp", "story-06-c.webp"],
            artAt: ["The lotus was set in the palace garden", "Call every blind person in this country", "feeling for the threshold with his stick"],
            paras: [
                "The lotus was set in the palace garden. Every day the king came out and looked at the flower.",
                "It was a night some days later. The moon was unusually bright. In that light the petals began to open, one by one.",
                "Inside the flower a young woman was sitting. The palace was thrown into an uproar.",
                "The king asked,<br>\"Who are you?\"<br>\"I am Simcheong, and I lived in Dohwadong in Hwangju.\"",
                "Simcheong told him everything without hiding any of it. Her blind father, the three hundred sacks of temple rice, Indangsu.",
                "The king heard it all and said nothing for a long time. And then he said,<br>\"This is a person heaven has sent to this country.\"",
                "That autumn Simcheong became queen. The whole country celebrated the wedding.",
                "But Simcheong did not smile. Neither the silk of the palace nor the finest dishes reached her.",
                "The king asked,<br>\"What weighs on you so?\"<br>\"I do not even know whether my father is alive.\"",
                "The king sent men to search Dohwadong in Hwangju. But the man called Sim Hakgyu had already left that village. They said that after his daughter died he could not stay there and had gone away somewhere.",
                "Simcheong lay awake many nights. Then one morning she went before the king and said,",
                "\"Call every blind person in this country to the palace and hold a feast for them. Three days, or ten days. Keep it open until they have all come.\"<br>The king nodded.<br>\"Since it is your wish, I will do it.\"",
                "Notices went up across the eight provinces. Anyone who could not see was to come to the palace. Food and lodging on the road would be paid for by the state.",
                "People set out. Leaning on sticks, holding one another's shoulders, led by the hand of a child, they made their way to Hanyang.",
                "About that time Sim Bongsa was wandering in some strange district. After he sent his daughter away he had left Dohwadong and gone about with nowhere to go.",
                "When he heard about the notice Sim Bongsa did not want to go at first.<br>\"With what face am I to go and be fed?\"",
                "But a villager pushed him along.<br>\"Go. It is the king's own table, so be sure to go and eat.\"",
                "Sim Bongsa took his stick and set out. All he had for the journey was a few coins.",
                "Things happened on the way. A man he met at an inn offered to show him a good road and went ahead of him, and then made off with his bundle and all his money while he slept.",
                "Sim Bongsa was left with nothing. Still he walked. He slept under other people's eaves, was given food, and walked on.",
                "He missed his footing and fell into a ditch, and he took a wrong road and wandered a whole day.",
                "By the time he reached Hanyang the feast had been going for many days already. His clothes were worn through and his feet were blistered.",
                "At the palace gate an official said,<br>\"Today is the last day. Go in quickly.\"",
                "Sim Bongsa was relieved to hear it. And then he went into the palace, feeling for the threshold with his stick."
            ]
        },
        {
            num: 7,
            title: "His Eyes Are Opened",
            art: ["story-07-a.webp", "story-07-b.webp", "story-07-c.webp"],
            artAt: ["The feast yard was full of people who could not see", "knelt in front of that old man", "saw the world for the first time in twenty-five years"],
            paras: [
                "The feast yard was full of people who could not see. There was rice and soup on every table.",
                "Simcheong sat behind a screen and looked down at that yard all day long. She had done it for many days now.",
                "An official went about with a register writing down the names. Simcheong checked every name. The name Sim Hakgyu did not come.",
                "It was the evening of the last day. The tables were nearly all cleared and people were getting up, one by one.",
                "Then an old man who had come in late sat down at the far end of the yard. His clothes were badly worn and his hair was quite white.",
                "The official went over and asked,<br>\"Give your name.\"<br>\"...Sim Hakgyu, of Dohwadong in Hwangju.\"",
                "There was a sound of something falling behind the screen. Simcheong had sprung to her feet and knocked over a folding screen.",
                "Simcheong pushed the screen aside and ran down into the yard. The hem of a queen's robe dragged in the dirt and nobody dared stop her.",
                "Simcheong knelt in front of that old man. Her throat closed and no words came.",
                "The old man heard someone there and raised his head.<br>\"Who is it?\"",
                "Simcheong barely got it out.<br>\"Father.\"",
                "The old man's body went stiff. The stick fell out of his hand.<br>\"...What did you say?\"<br>\"Father. It's me. It's Cheong.\"",
                "Sim Bongsa put out a hand and felt at the empty air.<br>\"No. No. My Cheong drowned. I am the man who sold that child into the water.\"",
                "\"Cheong is alive, father. I am Cheong.\"<br>Simcheong took her father's hand and put it against her face.",
                "Sim Bongsa's fingertips went over his daughter's forehead, her eyes, her cheek. His hands shook badly.",
                "\"Is it Cheong? Is it really Cheong? And I never once saw your face. I don't even know what you look like.\"",
                "\"Father.\"<br>\"Oh, my daughter! Let me see you! Let me see you!\"",
                "Sim Bongsa opened his eyes wide. And that was the moment.",
                "There was a flash before him and something lifted away. Light came into the place that had been dark.",
                "What was blurred grew slowly clear. And Sim Bongsa saw the world for the first time in twenty-five years.",
                "The first thing he saw was the face of his daughter, kneeling in front of him.",
                "\"...Cheong.\"<br>Father and daughter held each other in the middle of the yard.",
                "And then voices broke out all over the yard.<br>\"I can see!\"<br>\"I can see!\"",
                "One after another the people who had come to the feast opened their eyes. The sound of sticks falling on the ground rang all across the yard. Even those who had come late and were still outside the gate opened their eyes.",
                "They say that on that day every blind person in the whole country opened their eyes in the palace yard. People said Simcheong's love for her father had reached heaven.",
                "Sim Bongsa lived a long time after that. When people asked him to boast about his daughter, they say he always said this.<br>\"They tell me my daughter saved me. That's not it. She did not open my eyes. She made me want to open them.\""
            ]
        }
    ],
    /* 단어장 — 그림책은 펼침면마다 묶지만, 소설은 장마다 묶는다.
       쪽은 재어서 나누므로 미리 알 수 없기 때문이다.
       화면에는 그 쪽에 실제로 나온 낱말만 골라 보여 준다(vocabFor). */
    words: {
        "cover": [
            { w: "There is no author", k: "지은이가 없다", s: "There is no author" },
            { w: "changed it a little each time (change)", k: "그때마다 조금씩 고쳤다", s: "changed it a little each time" },
            { w: "is not invented (invent)", k: "지어낸 것이 아니다", s: "is not invented" },
            { w: "hard water", k: "물살이 센 바다", s: "People gave that name to hard water" },
            { w: "sacks of rice", k: "쌀 ~ 석", s: "three hundred sacks of rice" },
            { w: "to see again", k: "다시 보려면", s: "needs three hundred sacks of rice to see again" }
        ],
        "ch1": [
            { w: "had come down in the world (come down)", k: "가세가 기울었다", s: "the household had come down in the world" },
            { w: "took in sewing (take in)", k: "삯바느질을 했다", s: "took in sewing and pounded other people's grain" },
            { w: "no better-matched couple", k: "더없이 잘 맞는 부부", s: "there was no better-matched couple" },
            { w: "no proper rest", k: "몸조리를 제대로 못 함", s: "there had been no proper rest for her after the birth" },
            { w: "a baby at the breast", k: "젖먹이", s: "to raise a baby at the breast" },
            { w: "wrapped the child up (wrap up)", k: "아이를 포대기에 쌌다", s: "he wrapped the child up" },
            { w: "Just one mouthful", k: "한 모금만", s: "Just one mouthful for my child" },
            { w: "thin gruel", k: "미음", s: "In one house they made her thin gruel" },
            { w: "became her father's eyes (become)", k: "아버지의 눈이 되었다", s: "Cheong became her father's eyes" },
            { w: "leading him by the hand (lead)", k: "손을 잡고 이끌며", s: "she was already leading him by the hand" },
            { w: "put down a block and stand on it (put)", k: "받침을 놓고 올라서다", s: "she had to put down a block and stand on it" },
            { w: "felt for ~ (feel for)", k: "안쓰럽게 여겼다", s: "People felt for the little thing" },
            { w: "two extra spoonfuls", k: "두 숟갈 더", s: "put in two extra spoonfuls" },
            { w: "crouch at the stove", k: "부뚜막에 쭈그려 앉다", s: "Cheong crouch at the stove and eat what was left" },
            { w: "Her hands were deft", k: "손이 야무졌다", s: "Her hands were deft" },
            { w: "thought a great deal of ~ (think)", k: "아주 대단하게 여겼다", s: "thought a great deal of her" },
            { w: "sent for ~ (send)", k: "사람을 보내 불렀다", s: "heard of it and sent for Simcheong" },
            { w: "adopted daughter", k: "수양딸", s: "Will you not be my adopted daughter?" },
            { w: "fetch himself a bowl of water", k: "물 한 그릇도 못 떠 먹는다", s: "my father cannot even fetch himself a bowl of water" },
            { w: "reddened (redden)", k: "붉어졌다", s: "The lady's eyes reddened at that" }
        ],
        "ch2": [
            { w: "take back some sewing (take back)", k: "바느질감을 돌려주다", s: "gone to the Jang household to take back some sewing" },
            { w: "frozen over (freeze)", k: "꽁꽁 얼었다", s: "The road was frozen over" },
            { w: "slipped on the ice (slip)", k: "얼음에 미끄러졌다", s: "the end of his stick slipped on the ice" },
            { w: "cut like a knife (cut)", k: "칼처럼 에었다", s: "The winter water cut like a knife" },
            { w: "only thrashed about (thrash)", k: "허우적거리기만 했다", s: "only thrashed about" },
            { w: "grew fainter and fainter (grow)", k: "점점 잦아들었다", s: "His voice grew fainter and fainter" },
            { w: "beat his back (beat)", k: "등을 두드렸다", s: "laid him on the bank and beat his back" },
            { w: "brought up the water (bring up)", k: "물을 토해 냈다", s: "Sim Bongsa brought up the water" },
            { w: "came to himself (come to)", k: "정신을 차렸다", s: "barely came to himself" },
            { w: "lit the fire (light)", k: "불을 지폈다", s: "lit the fire for him" },
            { w: "How am I to repay this", k: "이 은혜를 어떻게 갚나", s: "How am I to repay this?" },
            { w: "will be left alone (leave)", k: "혼자 남는다", s: "my Cheong will be left alone" },
            { w: "not eyes that cannot be cured (cure)", k: "못 고칠 눈이 아니다", s: "Your eyes are not eyes that cannot be cured" },
            { w: "temple rice", k: "공양미", s: "three hundred sacks of temple rice" },
            { w: "with a whole heart", k: "정성을 다해", s: "pray with a whole heart" },
            { w: "did not stop to think (stop)", k: "생각해 보지도 않았다", s: "he did not stop to think" },
            { w: "anywhere near possible", k: "가당키나 한가", s: "Is three hundred sacks anywhere near possible" },
            { w: "Unwillingly", k: "마지못해", s: "Unwillingly the monk wrote the name" },
            { w: "came to his senses (come to)", k: "제정신이 들었다", s: "did Sim Bongsa come to his senses" },
            { w: "beat the floor (beat)", k: "방바닥을 쳤다", s: "Sim Bongsa beat the floor and regretted it" },
            { w: "bear the sin (bear)", k: "죄를 짊어지다", s: "How am I to bear the sin of lying to the Buddha" },
            { w: "with the quilt over his head", k: "이불을 뒤집어쓰고", s: "lying with the quilt over his head" },
            { w: "it all came out (come out)", k: "다 털어놓게 되었다", s: "in the end it all came out" },
            { w: "a bowl of fresh water", k: "정화수 한 그릇", s: "set out a bowl of fresh water" }
        ],
        "ch3": [
            { w: "at the mouth of the village", k: "마을 어귀에서", s: "saw strangers at the mouth of the village" },
            { w: "who looked like their leader (look like)", k: "우두머리로 보이는", s: "The one who looked like their leader" },
            { w: "so wild that ~", k: "어찌나 사나운지", s: "that water is so wild that several ships go over every year" },
            { w: "go over (go)", k: "뒤집힌다", s: "several ships go over every year" },
            { w: "grows calm (grow)", k: "잔잔해진다", s: "that sea grows calm" },
            { w: "whatever it takes (take)", k: "얼마가 들든", s: "We will pay whatever it takes" },
            { w: "began to beat hard (begin)", k: "크게 뛰기 시작했다", s: "Simcheong's heart began to beat hard" },
            { w: "this is not a game", k: "장난이 아니다", s: "this is not a game" },
            { w: "throwing yourself into the sea (throw)", k: "바다에 몸을 던지는 것", s: "It means throwing yourself into the sea" },
            { w: "brought you to such a decision (bring)", k: "그런 결심을 하게 했다", s: "What has brought you to such a decision?" },
            { w: "said it calmly (say)", k: "담담하게 말했다", s: "Simcheong said it calmly" },
            { w: "pressed his sleeve to his eyes (press)", k: "소매로 눈을 눌렀다", s: "pressed his sleeve to his eyes" },
            { w: "the day the ship sails (sail)", k: "배 떠나는 날", s: "I will come on the day the ship sails" },
            { w: "had thought over beforehand (think over)", k: "미리 생각해 두었다", s: "the words she had thought over beforehand" },
            { w: "be spared ~ (spare)", k: "~을 면하다", s: "you'll be spared this hard life" },
            { w: "Never had she been so glad", k: "그렇게 다행스러운 적이 없었다", s: "Never had she been so glad that her father could not see" },
            { w: "folded in turn (fold)", k: "차례로 개어", s: "folded in turn and put away in the chest" },
            { w: "see that ~ eats (see)", k: "밥을 챙겨 주다", s: "will you see that my father eats?" },
            { w: "in haste", k: "급히", s: "someone came in haste from the Jang household" },
            { w: "sold yourself to ~ (sell)", k: "몸을 팔았다", s: "you have sold yourself to the sailors" },
            { w: "shook the more (shake)", k: "더 떨렸다", s: "It was the lady's hands that shook the more" },
            { w: "give back what ~ have paid (give back)", k: "받은 값을 돌려주다", s: "give back what the sailors have paid" },
            { w: "caught hold of ~ (catch hold)", k: "붙들었다", s: "Simcheong caught hold of the lady's sleeve" },
            { w: "go back on it (go back on)", k: "무르다", s: "If I go back on it now" },
            { w: "has cheated others (cheat)", k: "사람을 속였다", s: "I am a person who has cheated others" },
            { w: "What is a promise beside that", k: "그깟 약속이 무슨 대수냐", s: "What is a promise beside that?" },
            { w: "somebody else's", k: "남의 것", s: "If even that is somebody else's" },
            { w: "cannot win against ~ (win)", k: "~를 못 이기겠다", s: "I cannot win against you" },
            { w: "did not once look back (look back)", k: "한 번도 뒤돌아보지 않았다", s: "Simcheong did not once look back" },
            { w: "more carefully than she ever had", k: "어느 때보다 정성껏", s: "more carefully than she ever had" },
            { w: "stopped in the middle of eating (stop)", k: "밥을 먹다 말고", s: "stopped in the middle of eating" },
            { w: "stayed awake until morning (stay)", k: "밤을 새웠다", s: "stayed awake until morning" }
        ],
        "ch4": [
            { w: "The cock crowed at dawn (crow)", k: "새벽닭이 울었다", s: "The cock crowed at dawn" },
            { w: "changed her clothes (change)", k: "옷을 갈아입었다", s: "changed her clothes" },
            { w: "it is time", k: "때가 되었다", s: "Young woman, it is time" },
            { w: "tipped his head (tip)", k: "고개를 갸웃했다", s: "Sim Bongsa tipped his head" },
            { w: "made her last bow (make)", k: "마지막 절을 올렸다", s: "she made her last bow" },
            { w: "Don't miss your meals (miss)", k: "진지 거르지 마세요", s: "Don't miss your meals" },
            { w: "get her feet over the threshold (get)", k: "문지방을 넘다", s: "She could not get her feet over the threshold" },
            { w: "could not hold it in (hold in)", k: "참지 못했다", s: "could not hold it in and burst out crying" },
            { w: "something was wrong", k: "무언가 잘못되었다", s: "understand that something was wrong" },
            { w: "felt about in the empty air (feel about)", k: "허공을 더듬었다", s: "felt about in the empty air of the yard" },
            { w: "closed on nothing (close)", k: "아무것도 잡히지 않았다", s: "His hands closed on nothing" },
            { w: "What do my eyes matter (matter)", k: "눈이 다 무엇이냐", s: "What do my eyes matter!" },
            { w: "caught his foot on a stone (catch)", k: "돌부리에 걸렸다", s: "caught his foot on a stone and fell" },
            { w: "looked back exactly once (look back)", k: "딱 한 번 돌아보았다", s: "Simcheong looked back exactly once" },
            { w: "treated her with great care (treat)", k: "정성껏 대접했다", s: "The sailors treated her with great care" },
            { w: "meet her eye (meet)", k: "눈을 마주치다", s: "not one of them could meet her eye" },
            { w: "change your mind (change)", k: "마음을 돌리다", s: "change your mind even now" },
            { w: "set you down on land (set down)", k: "뭍에 내려 주다", s: "We will set you down on land" },
            { w: "shook her head (shake)", k: "고개를 저었다", s: "Simcheong shook her head" },
            { w: "turn black and whirl (turn)", k: "시커멓게 소용돌이치다", s: "began to turn black and whirl" },
            { w: "pitched up and down (pitch)", k: "위아래로 크게 흔들렸다", s: "The ship pitched up and down" },
            { w: "took in the sails (take in)", k: "돛을 내렸다", s: "The sailors took in the sails" },
            { w: "carry this sin all our lives (carry)", k: "평생 이 죄를 지고 살다", s: "we shall carry this sin all our lives" },
            { w: "of my own will", k: "제 발로", s: "I came of my own will" },
            { w: "put her two hands together (put)", k: "두 손을 모았다", s: "she put her two hands together toward the western sky" },
            { w: "is no loss", k: "아깝지 않다", s: "This body of mine is no loss" },
            { w: "threw herself into ~ (throw)", k: "몸을 던졌다", s: "threw herself into the whirlpool" },
            { w: "went smooth (go)", k: "잔잔해졌다", s: "The water heaved once and then went smooth" },
            { w: "wept aloud (weep)", k: "통곡했다", s: "lay against the rail and wept aloud" }
        ],
        "ch5": [
            { w: "sank down and down (sink)", k: "한없이 가라앉았다", s: "Simcheong sank down and down through the water" },
            { w: "smothering (smother)", k: "숨이 막히는 것", s: "she could not feel herself smothering" },
            { w: "took her body up (take up)", k: "몸을 받쳐 들었다", s: "somebody took her body up" },
            { w: "made of jade (make)", k: "옥으로 만든 가마", s: "she was in a palanquin made of jade" },
            { w: "stood in rows (stand)", k: "늘어서 있었다", s: "strangers stood in rows and bowed" },
            { w: "the Dragon Palace", k: "용궁", s: "It is the Dragon Palace under the water" },
            { w: "coral", k: "산호", s: "The pillars were coral and the floor was pearl" },
            { w: "seated her in the highest place (seat)", k: "상석에 앉혔다", s: "They seated her in the highest place" },
            { w: "given as an offering (give)", k: "제물로 바쳐진", s: "I am a body given as an offering" },
            { w: "was drawn back (draw back)", k: "걷혔다", s: "the screen of the hall was drawn back" },
            { w: "her heart knew it first (know)", k: "가슴이 먼저 알아보았다", s: "her heart knew it first" },
            { w: "did not let go (let go)", k: "놓지 않았다", s: "held Simcheong and did not let go for a long time" },
            { w: "get so rough (get)", k: "이리 거칠어지다", s: "how did these hands get so rough" },
            { w: "cried out loud (cry)", k: "소리 내어 울었다", s: "cried out loud for the first time in her life" },
            { w: "held back (hold back)", k: "참았던", s: "It was fifteen years of crying held back" },
            { w: "not eyes that open for rice (open)", k: "쌀로 뜨는 눈이 아니다", s: "They are not eyes that open for rice" },
            { w: "a lotus bud", k: "연꽃 봉오리", s: "inside a great lotus bud" },
            { w: "drifted into sleep (drift)", k: "스르르 잠이 들었다", s: "Inside them Simcheong drifted into sleep" },
            { w: "Swaying with the current (sway)", k: "물살을 따라 흔들리며", s: "Swaying with the current" },
            { w: "the very ship", k: "바로 그 배", s: "It was the very ship that had taken Simcheong" },
            { w: "poured wine and bowed (pour)", k: "술을 붓고 절했다", s: "the sailors poured wine and bowed" },
            { w: "at the rail", k: "뱃전에", s: "setting out a table at the rail" },
            { w: "Out of season", k: "제철도 아닌데", s: "Out of season, and not in a pond" },
            { w: "as tall as a person", k: "사람 키만 한", s: "one red lotus as tall as a person" },
            { w: "brought alongside (bring)", k: "배를 대게 했다", s: "had the ship brought alongside" },
            { w: "a faint scent", k: "은은한 향", s: "a faint scent spread through the whole ship" },
            { w: "no ordinary flower", k: "예사 꽃이 아니다", s: "This is no ordinary flower" },
            { w: "made for land (make for)", k: "뭍으로 향했다", s: "made for land" },
            { w: "in no time", k: "삽시간에", s: "the story spread in no time" },
            { w: "had lost his queen (lose)", k: "왕후를 잃었다", s: "the king of the country had lost his queen" }
        ],
        "ch6": [
            { w: "came out and looked at ~ (come out)", k: "나와서 들여다보았다", s: "the king came out and looked at the flower" },
            { w: "unusually bright", k: "유난히 밝은", s: "The moon was unusually bright" },
            { w: "was thrown into an uproar (throw)", k: "발칵 뒤집혔다", s: "The palace was thrown into an uproar" },
            { w: "without hiding any of it (hide)", k: "하나도 숨기지 않고", s: "everything without hiding any of it" },
            { w: "said nothing for a long time (say)", k: "한참 동안 말이 없었다", s: "said nothing for a long time" },
            { w: "heaven has sent (send)", k: "하늘이 보냈다", s: "This is a person heaven has sent to this country" },
            { w: "became queen (become)", k: "왕후가 되었다", s: "Simcheong became queen" },
            { w: "celebrated the wedding (celebrate)", k: "혼례를 축하했다", s: "The whole country celebrated the wedding" },
            { w: "the finest dishes", k: "산해진미", s: "nor the finest dishes reached her" },
            { w: "What weighs on you so (weigh)", k: "무엇이 그리 마음에 걸리오", s: "What weighs on you so?" },
            { w: "sent men to search ~ (send)", k: "사람을 풀어 뒤졌다", s: "The king sent men to search Dohwadong" },
            { w: "had already left (leave)", k: "이미 떠난 뒤였다", s: "had already left that village" },
            { w: "lay awake many nights (lie)", k: "여러 날 밤을 새웠다", s: "Simcheong lay awake many nights" },
            { w: "Keep it open until ~ (keep)", k: "~할 때까지 열어 두다", s: "Keep it open until they have all come" },
            { w: "Notices went up (go up)", k: "방이 붙었다", s: "Notices went up across the eight provinces" },
            { w: "the eight provinces", k: "팔도", s: "across the eight provinces" },
            { w: "paid for by the state (pay)", k: "나라에서 대 준다", s: "would be paid for by the state" },
            { w: "led by the hand of a child (lead)", k: "아이 손에 이끌려", s: "led by the hand of a child" },
            { w: "with nowhere to go", k: "정처 없이", s: "gone about with nowhere to go" },
            { w: "With what face ~", k: "무슨 낯으로 ~", s: "With what face am I to go and be fed?" },
            { w: "pushed him along (push)", k: "등을 떠밀었다", s: "a villager pushed him along" },
            { w: "a few coins", k: "몇 푼", s: "All he had for the journey was a few coins" },
            { w: "went ahead of him (go ahead)", k: "앞장섰다", s: "went ahead of him" },
            { w: "made off with ~ (make off)", k: "들고 달아났다", s: "made off with his bundle and all his money" },
            { w: "was left with nothing (leave)", k: "빈손으로 남았다", s: "Sim Bongsa was left with nothing" },
            { w: "under other people's eaves", k: "남의 집 처마 밑에서", s: "He slept under other people's eaves" },
            { w: "missed his footing (miss)", k: "발을 헛디뎠다", s: "He missed his footing and fell into a ditch" },
            { w: "took a wrong road (take)", k: "길을 잘못 들었다", s: "he took a wrong road and wandered a whole day" },
            { w: "worn through (wear)", k: "다 해졌다", s: "His clothes were worn through" },
            { w: "blistered (blister)", k: "부르텄다", s: "his feet were blistered" },
            { w: "feeling for the threshold (feel for)", k: "문지방을 더듬으며", s: "feeling for the threshold with his stick" }
        ],
        "ch7": [
            { w: "a register", k: "명부", s: "went about with a register writing down the names" },
            { w: "were nearly all cleared (clear)", k: "거의 다 치워졌다", s: "The tables were nearly all cleared" },
            { w: "at the far end of the yard", k: "마당 끝자리에", s: "sat down at the far end of the yard" },
            { w: "badly worn (wear)", k: "몹시 해진", s: "His clothes were badly worn" },
            { w: "quite white", k: "온통 하얀", s: "his hair was quite white" },
            { w: "Give your name (give)", k: "이름을 대시오", s: "Give your name" },
            { w: "had sprung to her feet (spring)", k: "벌떡 일어섰다", s: "Simcheong had sprung to her feet" },
            { w: "knocked over ~ (knock over)", k: "넘어뜨렸다", s: "knocked over a folding screen" },
            { w: "dragged in the dirt (drag)", k: "흙에 끌렸다", s: "a queen's robe dragged in the dirt" },
            { w: "dared stop her (dare)", k: "감히 말리지 못했다", s: "nobody dared stop her" },
            { w: "Her throat closed (close)", k: "목이 메었다", s: "Her throat closed and no words came" },
            { w: "raised his head (raise)", k: "고개를 들었다", s: "heard someone there and raised his head" },
            { w: "barely got it out (get out)", k: "겨우 입을 열었다", s: "Simcheong barely got it out" },
            { w: "went stiff (go)", k: "굳었다", s: "The old man's body went stiff" },
            { w: "fell out of his hand (fall)", k: "손에서 떨어졌다", s: "The stick fell out of his hand" },
            { w: "felt at the empty air (feel)", k: "허공을 더듬었다", s: "put out a hand and felt at the empty air" },
            { w: "sold that child into the water (sell)", k: "그 아이를 물에 팔았다", s: "I am the man who sold that child into the water" },
            { w: "put it against her face (put)", k: "제 얼굴에 갖다 댔다", s: "put it against her face" },
            { w: "went over ~ (go over)", k: "더듬었다", s: "fingertips went over his daughter's forehead" },
            { w: "shook badly (shake)", k: "몹시 떨렸다", s: "His hands shook badly" },
            { w: "never once (never)", k: "한 번도 ~않다", s: "I never once saw your face" },
            { w: "Let me see you (let)", k: "어디 좀 보자", s: "Let me see you!" },
            { w: "opened his eyes wide (open)", k: "두 눈을 부릅떴다", s: "Sim Bongsa opened his eyes wide" },
            { w: "a flash before him", k: "눈앞이 번쩍", s: "There was a flash before him" },
            { w: "something lifted away (lift)", k: "무언가 걷혔다", s: "something lifted away" },
            { w: "grew slowly clear (grow)", k: "차츰 또렷해졌다", s: "What was blurred grew slowly clear" },
            { w: "for the first time in twenty-five years", k: "스물다섯 해 만에", s: "saw the world for the first time in twenty-five years" },
            { w: "held each other (hold)", k: "서로를 끌어안았다", s: "Father and daughter held each other" },
            { w: "broke out (break out)", k: "터져 나왔다", s: "voices broke out all over the yard" },
            { w: "One after another", k: "하나둘", s: "One after another the people" },
            { w: "rang all across the yard (ring)", k: "마당 가득 울렸다", s: "rang all across the yard" },
            { w: "had reached heaven (reach)", k: "하늘에 닿았다", s: "Simcheong's love for her father had reached heaven" },
            { w: "boast about ~ (boast)", k: "자랑하다", s: "When people asked him to boast about his daughter" },
            { w: "made me want to ~ (make)", k: "~하고 싶게 만들었다", s: "She made me want to open them" }
        ]
    },
    quiz: [
        { q: "When did Sim Bongsa lose his sight?", choices: ["He is said to have been so from birth", "After an illness at about twenty", "From a bad hurt in a fight"], answer: 1 },
        { q: "What kept the baby Simcheong alive?", choices: ["Rice sent down from the temple", "Money sent by her mother's family", "Milk begged from the village women"], answer: 2 },
        { q: "Why did Sim Bongsa fall into the winter stream?", choices: ["He slipped while drawing water", "His stick slid on the ice as he went to meet his daughter", "A bridge gave way while he was begging"], answer: 1 },
        { q: "What did Sim Bongsa do after promising the three hundred sacks?", choices: ["Beat the floor in regret", "Went straight out to gather grain", "Boasted of it to his daughter"], answer: 0 },
        { q: "Why were the sailors looking for someone?", choices: ["To get across Indangsu safely", "Because they had nobody to work the ship", "Because the king had ordered it"], answer: 0 },
        { q: "What did Simcheong tell her father instead of the truth?", choices: ["That she was going to work at Mongunsa", "That she was becoming the Jang household's adopted daughter", "That she was visiting distant relatives"], answer: 1 },
        { q: "What did Simcheong do night after night before she left?", choices: ["Cooked meals for the village women", "Sewed her father clothes for all four seasons", "Told her father about Indangsu"], answer: 1 },
        { q: "What did the people of the Dragon Palace call Simcheong?", choices: ["One sent by heaven", "An offering given to the sea", "The maiden the king was seeking"], answer: 0 },
        { q: "What did her mother say as she held Simcheong?", choices: ["Why have you come so late", "Is your father well", "How did your hands get so rough"], answer: 2 },
        { q: "What did the sailors do each time they passed Indangsu?", choices: ["Poured out wine and bowed", "Lowered the sail and stayed a night", "Scattered rice on the sea"], answer: 0 },
        { q: "Where was Sim Bongsa when the king sent men to find him?", choices: ["Living at Mongunsa", "Wandering strange towns, having left Dohwadong", "Sheltering at the Jang house"], answer: 1 },
        { q: "What happened to Sim Bongsa on the road to Hanyang?", choices: ["A man he met at an inn stole his bundle", "He fell in a ditch and lay hurt for days", "A villager walked him all the way to Hanyang"], answer: 0 },
        { q: "When did Sim Bongsa's eyes open?", choices: ["When the official asked his name", "When his daughter first called him Father", "When he cried out Let me see you"], answer: 2 },
        { q: "What happened when Sim Bongsa's eyes opened?", choices: ["Flowers rained down out of the sky", "The water of Indangsu went smooth", "Everyone who had come to the feast opened their eyes too"], answer: 2 },
        {
            q: "Which reaction to this book does NOT fit?",
            wide: true,
            choices: [
                "She refused the lady's three hundred sacks, so she put giving it with her own hands above the price.",
                "A young sailor came at night and offered to set her ashore, so even on that ship there was someone whose heart was not easy.",
                "Her mother said rice would not open those eyes, only her going, so three hundred sacks was never the answer.",
                "Sim Bongsa's eyes opened once the three hundred sacks reached the temple, so the monk had been right all along."
            ],
            answer: 3
        }
    ],
    afterword: {
        title: 'After Reading',
        emoji: '👁️',
        art: ['end.webp'],
        paras: [
            "This story was a song before it was a book. Simcheong-ga came first — one singer with one drummer, singing for three or four hours together — and what you have just read is that song written down.",
            "Five pansori pieces still survive as song: Chunhyang-ga, Simcheong-ga, Heungbo-ga, Sugung-ga and Jeokbyeok-ga. Three of those five are on this shelf as novels: Chunhyangjeon, Simcheongjeon and Heungbujeon. Sugung-ga became the Tale of the Rabbit, so that makes four.",
            "So this story has no author. One person did not sit down and make it up. Singers sang it and sang it and changed it a little each time. The parts where people cried grew longer and longer, and the parts where they were bored shrank of themselves.",
            "That is why every copy is different. Set the ones printed and sold in Seoul beside the ones printed in Jeonju and the length alone differs by nearly three times. There is no arguing which is the real one. They are both real.",
            "This book has left something out too. In the original story a woman called Ppaengdeok's mother appears after Simcheong has gone. She attaches herself to Sim Bongsa, eats up bit by bit what his daughter left behind, and on the road to the feast for the blind she takes even that and runs. She is what leaves Sim Bongsa arriving at the palace with nothing.",
            "Three older stories are usually named as the roots of this one. The devoted daughter Jieun, in the History of the Three Kingdoms, is a poor girl who sells herself into another house to feed her mother. The Geotaji story, in the Memorabilia of the Three Kingdoms, has a sea that is given people as an offering. And the Won Hongjang story handed down at Gwaneumsa in Jeolla is about a girl with a blind father who is sold to sailors.",
            "Stories about giving a person to the sea are not only ours. Anywhere people had to go out on deep water to live, there is a story like it. That is how frightening the sea was.",
            "But Simcheong differs from those stories in one place. She was not dragged off; she went on her own feet. It was Simcheong herself who set the price and made the bargain. She is not a person made into an offering but a person who decided to sell herself. That single difference changes the whole story.",
            "The sum of three hundred sacks is worth working out. Three hundred sacks is more rice than a hundred grown people eat in a year. It is not an amount a household that raised its daughter on begging could ever find. It was a price that could not be paid from the start.",
            "That is where this story is tender. Sim Bongsa could not see, so he could not see how big a heap three hundred sacks makes in a yard. If he had seen it he would have caught the monk's sleeve on the spot. He did not make a promise; he nodded without knowing how large a promise it was.",
            "Open chapter three again. There is the place where Simcheong tells her father she is going to the Jang household as an adopted daughter. It is the only lie Simcheong tells in this book. A daughter praised for devotion left home by deceiving her father. It is worth thinking about why the story does not scold her for that lie.",
            "The same goes for her refusing the lady of the Jang household when the lady offered to pay the three hundred sacks. Counting money alone, taking it was better. Simcheong refused because she did not think her father's eyes should be a thing got without paying for it.",
            "Indangsu is not an invented place. It is said to be what people called a stretch of hard water off Baengnyeongdo in the West Sea. Even now there is a hall on Baengnyeongdo in Simcheong's memory, and along with it the saying that the village where Simcheong was born and grew up lay on the Hwanghae shore opposite.",
            "There is a reason, too, that a lotus is what Simcheong comes back inside. Lotuses do not open in clear water. They set their roots in the mud and push a clean flower up above it. Remembering how close the people who built this story were to the temples, choosing a lotus was no accident.",
            "In the last chapter Sim Bongsa's eyes did not open because he took medicine. Nor because three hundred sacks went to the temple. The rice had gone in long before and his eyes were the same. They opened on the spot where he heard his daughter's voice.",
            "And Sim Bongsa was not the only one whose eyes opened that day. Those who had come to the feast, and those who had come late and were standing outside the gate, all opened them. The story does not end it as one man's business. That is mostly how old stories finish a good thing.",
            "Read this only as a story about devotion to a parent and you have read half of it. If it were a story about devotion it should end where Simcheong throws herself into Indangsu. But the story does not end there; it insists on bringing Simcheong back. The people who built this story could not simply let her go either.",
            "Sim Bongsa is a person to look at twice as well. He is a father who got his eyes by selling his daughter. Think about how a man lived after learning that, and what he says on the last page sounds different. He said she did not open his eyes but made him want to open them.",
            "If reading this today made you uncomfortable, that is right. We no longer say it is beautiful for a daughter to lay down her life for her father. What people long ago thought beautiful does not have to be thought beautiful now. Stories stay; the weighing of them changes.",
            "Was Simcheong right to sell herself? Her father's eyes did open. But there is no chance her father wanted it that way. If a thing done for somebody is a thing that person did not want, who is it done for?",
            "What if Sim Bongsa had known how big three hundred sacks was? This whole story comes out of not being able to see. His daughter paid the price of a promise made in ignorance — so where does the fault lie?",
            "And why did the monk of Mongunsa say three hundred sacks of all numbers? Had he said thirty, Simcheong would not have been sold. What the monk was thinking when he named that price is a question the story never answers."
        ]
    }
};

const UI = {
    ko: {
        toc: '차례', quiz: '이야기 문제', after: '읽고 나서', folio: '쪽',
        home: '학습 허브로 돌아가기', other: 'EN', otherAria: 'Read in English',
        done: (n, all) => `${n} / 총 ${all}문항 완료`
    },
    en: {
        toc: 'Contents', quiz: 'Story Questions', after: 'After Reading', folio: '',
        home: 'Back to the learning hub', other: '한국어', otherAria: '한국어로 읽기',
        wordsDown: 'Words ⌄',
        done: (n, all) => `${n} of ${all} answered`
    }
};

const LANG_KEY = 'korea-tales-lang';
const HAS_EN = typeof EN !== 'undefined';
const readLang = () => { try { return localStorage.getItem(LANG_KEY); } catch (e) { return null; } };
const saveLang = v => { try { localStorage.setItem(LANG_KEY, v); } catch (e) { /* 저장이 막힌 곳도 있다 */ } };

let LANG = (HAS_EN && readLang() === 'en') ? 'en' : 'ko';
// 글꼴 규칙이 html[lang] 에 걸려 있다. 쪽을 재기 전에 미리 걸어 두어야
// 영어 글을 영어 글꼴로 잰다. 늦게 걸면 첫 쪽나눔이 통째로 어긋난다.
document.documentElement.lang = LANG;

const T  = () => UI[LANG];
const CH = () => (LANG === 'en' ? EN.chapters  : CHAPTERS);
const QZ = () => (LANG === 'en' ? EN.quiz      : QUIZ);
const AF = () => (LANG === 'en' ? EN.afterword : AFTERWORD);
const CV = () => (LANG === 'en' ? EN.cover     : COVER);

const TWO_PAGE_KINDS = new Set(['chapter', 'toc', 'cover', 'after']);

let PAGES = [];
let FOLIOS = [];

function buildPages() {
    CHAPTER_SEGS = CH().map(ch => segsOf(ch.paras));
    AFTER_SEGS = segsOf(AF().paras);
    TOC_GROUPS = [];
    for (let i = 0; i < CH().length; i += TOC_PER_SPREAD) {
        TOC_GROUPS.push(CH().slice(i, i + TOC_PER_SPREAD));
    }

    PROBE = makeProbe();
    PAGES = [
        { kind: 'cover' },
        ...TOC_GROUPS.map((_, i) => ({ kind: 'toc', part: i })),
        ...CH().flatMap(paginateChapter),
        ...QUIZ_GROUPS.map((_, i) => ({ kind: 'quiz', part: i })),
        ...paginateAfterword()
    ];
    PROBE.close();   // 쪽을 다 나눴으니 재는 데 쓰던 숨은 쪽은 치운다

    let folioCounter = 0;
    FOLIOS = PAGES.map(p => {
        const width = TWO_PAGE_KINDS.has(p.kind) ? 2 : 1;
        const start = folioCounter + 1;
        folioCounter += width;
        return { start, width };
    });
}

buildPages();

function renderPage(page) {
    switch (page.kind) {
        case 'cover': return coverPage();
        case 'toc': return tocPage(page.part);
        case 'chapter': return chapterSpreadPage(page);
        case 'quiz': return quizPage(page.part);
        case 'after': return afterSpreadPage(page);
        default: return '';
    }
}

let current = 0;
let animating = false;

const spreadEl = document.getElementById('spread');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const indicatorEl = document.getElementById('pageIndicator');
const folioLeftEl = document.getElementById('folioLeft');
const folioRightEl = document.getElementById('folioRight');

function paint() {
    spreadEl.innerHTML = renderPage(PAGES[current]);
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current === PAGES.length - 1;
    indicatorEl.textContent = `${current + 1} / ${PAGES.length}`;

    const folio = FOLIOS[current];
    folioLeftEl.classList.toggle('folio-center', folio.width === 1);
    folioLeftEl.textContent = folio.start;
    folioLeftEl.hidden = false;
    if (folio.width === 2) {
        folioRightEl.textContent = folio.start + 1;
        folioRightEl.hidden = false;
    } else {
        folioRightEl.hidden = true;
    }

    spreadEl.querySelectorAll('[data-goto]').forEach(btn => {
        btn.addEventListener('click', () => {
            const num = Number(btn.dataset.goto);
            const idx = PAGES.findIndex(p => p.kind === 'chapter' && p.first && p.ch.num === num);
            if (idx >= 0) goTo(idx);
        });
    });
    spreadEl.querySelectorAll('[data-goto-kind]').forEach(btn => {
        btn.addEventListener('click', () => {
            const idx = PAGES.findIndex(p => p.kind === btn.dataset.gotoKind);
            if (idx >= 0) goTo(idx);
        });
    });

    if (PAGES[current].kind === 'quiz') initQuiz();

    paintReadBtn();
    // 읽는 중일 때만 문단을 눌러 그 자리로 옮긴다.
    // 그냥 눌렀다고 소리가 나면 곤란하니, 스피커 단추를 누른 뒤에만 먹는다.
    if (LANG === 'en' && CAN_SPEAK) {
        spreadEl.querySelectorAll('[data-say]').forEach(el => {
            el.addEventListener('click', () => {
                if (!reading) return;
                readPage(Number(el.dataset.say));
            });
        });
    }

    renderVocab();
    fitVocabScreen();
}

function initQuiz() {
    const progressEl = document.getElementById('quizProgress');

    spreadEl.querySelectorAll('.quiz-item').forEach(item => {
        const qi = Number(item.dataset.qindex);
        const q = QZ()[qi];
        item.querySelectorAll('.quiz-choice').forEach(btn => {
            btn.addEventListener('click', () => {
                if (item.classList.contains('graded')) return;
                const chosen = Number(btn.dataset.choice);
                /* 틀리면 그 보기만 빨갛게 남기고, 맞는 것을 고를 때까지 다시 고르게 한다.
                   답을 미리 보여 주면 아이가 생각할 자리가 사라진다. */
                if (chosen !== q.answer) {
                    btn.classList.add('incorrect');
                    QUIZ_WRONG[qi].add(chosen);
                    return;
                }
                btn.classList.add('correct');
                item.classList.add('graded');
                QUIZ_PICKED[qi] = chosen;
                const done = QUIZ_PICKED.filter(v => v !== null).length;
                progressEl.textContent = T().done(done, QZ().length);
            });
        });
    });
}

function goTo(index) {
    if (animating || index === current || index < 0 || index >= PAGES.length) return;
    stopReading();
    animating = true;
    const dir = index > current ? 'flip-next' : 'flip-prev';
    spreadEl.classList.add(dir);
    setTimeout(() => {
        current = index;
        paint();
    }, 230);
    setTimeout(() => {
        spreadEl.classList.remove('flip-next', 'flip-prev');
        animating = false;
    }, 480);
}

prevBtn.addEventListener('click', () => goTo(current - 1));
nextBtn.addEventListener('click', () => goTo(current + 1));

document.getElementById('tocLink').addEventListener('click', () => {
    const idx = PAGES.findIndex(p => p.kind === 'toc');
    if (idx >= 0) goTo(idx);
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') goTo(current + 1);
    if (e.key === 'ArrowLeft') goTo(current - 1);
});



/* ── 읽어 주기 ─────────────────────────────────────────────────
   소설은 한 문단 안에 서술과 대사가 섞여 있다. 그림책처럼 말하는 이를
   따로 적어 둘 수가 없으므로, 큰따옴표 안팎으로만 목소리를 가른다.
   속도는 둘 다 같다. 대사에서 갑자기 빨라지면 귀에 턱턱 걸린다. */
const CAN_SPEAK = typeof speechSynthesis !== 'undefined';

const SAY_RATE = 0.85;
const SAY_AS = {
    narration: { pitch: 1.00, rate: SAY_RATE },
    speech:    { pitch: 1.24, rate: SAY_RATE },
    speech2:   { pitch: 0.78, rate: SAY_RATE }
};

let SAY_VOICE = null;

function pickVoices() {
    if (typeof speechSynthesis === 'undefined') return;
    const vs = speechSynthesis.getVoices().filter(v => /^en/i.test(v.lang));
    if (!vs.length) return;
    SAY_VOICE = vs.find(v => /^en[-_]US/i.test(v.lang)) || vs[0];
}

if (typeof speechSynthesis !== 'undefined') {
    pickVoices();
    speechSynthesis.onvoiceschanged = pickVoices;
}

function dressVoice(u, role) {
    const a = SAY_AS[role] || SAY_AS.narration;
    u.pitch = a.pitch;
    u.rate = a.rate;
    if (SAY_VOICE) u.voice = SAY_VOICE;
}

/* 낱말 뜻풀이는 소리 내어 읽지 않는다. 나머지 표시는 떼고 글자만 남긴다. */
const plainText = h => h
    .replace(/<span class="gloss">[\s\S]*?<\/span>/g, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

/* 큰따옴표 안은 대사다. 서술과 목소리를 가른다.
   한 문단 안에서 따옴표가 잇달아 나오면 대개 두 사람이 주고받는 자리다.
   그래서 두 번째 대사부터 목소리를 번갈아 바꾼다. 말하는 이를 일일이
   적어 둘 수 없는 소설틀에서 낼 수 있는 가장 가까운 흉내다. */
function sayChunks(text) {
    const out = [];
    const re = /"([^"]*)"/g;
    let last = 0, q = 0, m;
    while ((m = re.exec(text)) !== null) {
        if (m.index > last) out.push({ t: text.slice(last, m.index), v: 'narration' });
        out.push({ t: m[1], v: (q++ % 2) ? 'speech2' : 'speech' });
        last = re.lastIndex;
    }
    if (last < text.length) out.push({ t: text.slice(last), v: 'narration' });
    return out.filter(c => /\S/.test(c.t));
}

/* 그 쪽에 있는 문단들. 쪽에 걸쳐 잘린 문단은 한 번만 센다. */
function pageParts(page) {
    if (!page) return [];
    if (page.kind === 'cover') {
        return [CV().title].concat(CV().intro).map((t, i) => ({ i, raw: t }));
    }
    const segs = page.kind === 'chapter' ? CHAPTER_SEGS[page.chIndex]
        : page.kind === 'after' ? AFTER_SEGS : null;
    if (!segs) return [];
    const src = page.kind === 'chapter' ? CH()[page.chIndex].paras : AF().paras;
    const seen = {};
    const out = [];
    [page.left, page.right].forEach(r => {
        if (!r) return;
        for (let k = r[0]; k < r[1]; k++) {
            const pi = segs[k].paraIdx;
            if (seen[pi]) continue;
            seen[pi] = 1;
            out.push({ i: pi, raw: src[pi] });
        }
    });
    return out;
}

/* 읽기 단추는 책틀에 붙박이로 있다. 영어로 읽을 때만 보인다. */
const readBtnEl = document.getElementById('readBtn');
let reading = false;
let readToken = 0;

function paintReadBtn() {
    if (!readBtnEl) return;
    readBtnEl.hidden = !(LANG === 'en' && CAN_SPEAK);
    readBtnEl.textContent = reading ? '■' : '▶';
}

function stopReading() {
    reading = false;
    if (spreadEl) spreadEl.classList.remove('is-reading');
    readToken++;
    if (CAN_SPEAK) { try { speechSynthesis.cancel(); } catch (e) {} }
    document.querySelectorAll('.saying').forEach(el => el.classList.remove('saying'));
    paintReadBtn();
}

function readPage(fromParaIdx) {
    const page = PAGES[current];
    if (!CAN_SPEAK || !page) return;
    const parts = pageParts(page);
    if (!parts.length) return;
    // 읽던 것이 있으면 끊는다. 안 그러면 새 글이 뒤에 줄을 선다.
    try { speechSynthesis.cancel(); } catch (e) {}
    reading = true;
    if (spreadEl) spreadEl.classList.add('is-reading');
    paintReadBtn();
    const mine = ++readToken;

    let start = parts.findIndex(p => p.i === fromParaIdx);
    if (start < 0) start = 0;

    const step = (k) => {
        if (mine !== readToken) return;
        document.querySelectorAll('.saying').forEach(el => el.classList.remove('saying'));
        if (k >= parts.length) { stopReading(); return; }
        const here = spreadEl.querySelector(`[data-say="${parts[k].i}"]`);
        if (here) {
            here.classList.add('saying');
            here.scrollIntoView({ block: 'nearest' });
        }
        const chunks = sayChunks(plainText(parts[k].raw));
        const go = (c) => {
            if (mine !== readToken) return;
            if (c >= chunks.length) { step(k + 1); return; }
            const u = new SpeechSynthesisUtterance(chunks[c].t);
            u.lang = 'en-US';
            dressVoice(u, chunks[c].v);
            u.onend = () => go(c + 1);
            u.onerror = () => go(c + 1);
            try { speechSynthesis.speak(u); } catch (e) { stopReading(); }
        };
        go(0);
    };
    step(start);
}

if (readBtnEl) {
    readBtnEl.addEventListener('click', () => (reading ? stopReading() : readPage(-1)));
}

/* ── 단어장 ────────────────────────────────────────────────────
   책 아래에 있는 또 한 장의 화면이다. 책은 손대지 않는다.
   낱말은 장마다 묶어 두었고, 그 쪽에 실제로 나온 것만 골라 보여 준다. */
const vocabScreenEl = document.getElementById('vocabScreen');
const vocabPanelEl = document.getElementById('vocabPanel');
const scrollDownEl = document.getElementById('scrollDown');
const HAS_WORDS = HAS_EN && EN.words && Object.keys(EN.words).length > 0;
let VOCAB_NOW = [];

function vocabFor() {
    const all = (HAS_WORDS && EN.words) || {};
    const page = PAGES[current];
    if (!page) return { list: [] };
    if (page.kind === 'cover') return { list: all.cover || [] };
    if (page.kind === 'chapter' || page.kind === 'after') {
        const pool = page.kind === 'chapter' ? (all['ch' + page.ch.num] || []) : (all.after || []);
        const text = pageParts(page).map(p => p.raw).join(' ');
        return { list: pool.filter(w => text.indexOf(w.s) >= 0) };
    }
    // 문제 쪽에는 글이 없다. 답을 고르기 전에 훑어볼 수 있게 책에 나온 낱말을 다 보여 준다.
    // 차례에는 볼 글이 없으므로 단어장을 아예 열지 않는다.
    if (page.kind !== 'quiz') return { list: [] };
    const list = [];
    Object.keys(all).forEach(k => all[k].forEach(w => list.push(w)));
    return { list };
}

function renderVocab() {
    const { list } = (HAS_WORDS && LANG === 'en') ? vocabFor() : { list: [] };
    // 볼 낱말이 없는 쪽에서는 아래 화면을 아예 열지 않는다.
    const on = list.length > 0;
    if (vocabScreenEl) vocabScreenEl.hidden = !on;
    if (scrollDownEl) {
        scrollDownEl.hidden = !on;
        scrollDownEl.textContent = T().wordsDown || 'Words ⌄';
    }
    if (!on) {
        if (window.scrollY) window.scrollTo({ top: 0 });
        return;
    }
    VOCAB_NOW = list;
    vocabPanelEl.innerHTML = `
        <ul class="vocab-list">
            ${list.map((w, i) => `
            <li>
                <div class="vocab-top">
                    <p class="vocab-word">${w.w}</p>
                    ${(CAN_SPEAK && LANG === 'en') ? `<button type="button" class="vocab-say" data-i="${i}" aria-label="Listen">🔊</button>` : ''}
                </div>
                <p class="vocab-mean">${w.k}</p>
                <p class="vocab-sent">${w.s}</p>
            </li>`).join('')}
        </ul>`;
}

/* 듣기 — 낱말을 먼저 읽고, 이어서 그 낱말이 나온 구절을 읽는다. */
function sayWord(item) {
    if (!CAN_SPEAK || !item) return;
    try {
        speechSynthesis.cancel();
        // 「went without (go without)」처럼 괄호로 적어 둔 기본형은 읽지 않는다.
        const bare = item.w.replace(/\s*\([^)]*\)/g, '').replace(/~/g, '').trim();
        const word = new SpeechSynthesisUtterance(bare);
        word.lang = 'en-US';
        dressVoice(word, 'narration');
        word.rate = 0.75;
        const sent = new SpeechSynthesisUtterance(item.s);
        sent.lang = 'en-US';
        dressVoice(sent, 'narration');
        speechSynthesis.speak(word);
        speechSynthesis.speak(sent);
    } catch (e) { /* 소리를 못 내는 기기도 있다 */ }
}

if (vocabPanelEl) {
    vocabPanelEl.addEventListener('click', e => {
        const btn = e.target.closest('.vocab-say');
        if (btn) sayWord(VOCAB_NOW[Number(btn.dataset.i)]);
    });
}

/* 그림선 — 그림 칸이 끝나는 자리다. 여기까지만 내려가면 글과 단어장이 함께 보인다.
   소설은 그림 없는 펼침면이 더 많다. 그때는 책 아랫부분만 남기고 멈춘다. */
function artLine() {
    const page = PAGES[current];
    if (!page) return 0;
    const book = document.querySelector('.book');
    const bookBox = book ? book.getBoundingClientRect() : null;
    const capLine = () => (bookBox
        ? Math.max(0, Math.round(bookBox.bottom + window.scrollY - Math.round(window.innerHeight * 0.45)))
        : 0);
    const el = page.kind === 'cover'
        ? document.querySelector('.page-cover .story-page-left-full')
        : spreadEl.querySelector('.story-art-top');
    if (!el) return capLine();
    const box = el.getBoundingClientRect();
    const line = Math.max(0, Math.round(box.bottom + window.scrollY));
    // 표지처럼 그림이 책 높이를 거의 다 차지하면 경계선이 곧 책 밑이라
    // 책이 통째로 사라진다. 그때만 책이 절반쯤 남도록 붙든다.
    if (!bookBox || box.height < bookBox.height * 0.8) return line;
    return Math.max(0, Math.min(line, capLine()));
}

/* 쪽을 다시 나눌 때는 단어장을 먼저 접는다.
   아래 화면이 펼쳐진 채로 재면 문서가 길어져 세로 막대가 생기고,
   그만큼 칸이 좁아져 쪽이 잘못 나뉜다. 세로 화면에서 두 쪽이 어긋났다. */
function rebuildPages() {
    if (vocabScreenEl) vocabScreenEl.hidden = true;
    window.scrollTo(0, 0);
    buildPages();
}

function fitVocabScreen() {
    if (!vocabScreenEl || vocabScreenEl.hidden) return;
    const line = artLine();
    vocabScreenEl.style.minHeight = line ? line + 'px' : '';
}

if (scrollDownEl) {
    scrollDownEl.addEventListener('click', () => {
        fitVocabScreen();
        const line = artLine();
        window.scrollTo({ top: line || document.documentElement.scrollHeight, behavior: 'smooth' });
    });
}

window.addEventListener('resize', () => { window.scrollTo(0, 0); fitVocabScreen(); });

/* ── 말 바꾸기 ─────────────────────────────────────────────────
   쪽은 재어서 나누므로 글을 갈아 끼우면 처음부터 다시 나눈다.
   보던 장으로 돌아간다. 쪽 수는 말마다 다르다. */
const langBtn = document.getElementById('langLink');

function applyLang() {
    stopReading();
    document.documentElement.lang = LANG;
    document.title = CV().title;
    if (langBtn) {
        langBtn.hidden = !HAS_EN;
        langBtn.textContent = T().other;
        langBtn.setAttribute('aria-label', T().otherAria);
    }
}

if (langBtn && HAS_EN) {
    langBtn.addEventListener('click', () => {
        LANG = LANG === 'en' ? 'ko' : 'en';
        saveLang(LANG);
        const here = PAGES[current];
        // 글꼴 규칙(html[lang])을 먼저 바꾸고 나서 재야 한다. 순서를 바꾸면
        // 영어 글을 한글 글꼴 규칙으로 재게 되어 쪽 수가 열 쪽 넘게 어긋난다.
        applyLang();
        rebuildPages();
        current = Math.min(current, PAGES.length - 1);
        if (here && here.kind === 'chapter') {
            const i = PAGES.findIndex(p => p.kind === 'chapter' && p.first && p.ch.num === here.ch.num);
            if (i >= 0) current = i;
        } else if (here) {
            const i = PAGES.findIndex(p => p.kind === here.kind);
            if (i >= 0) current = i;
        }
        paint();
    });
}

applyLang();
paint();

// 본문 글꼴은 늦게 내려온다. 글꼴이 바뀌면 한 줄에 들어가는 글자 수가 달라져서
// 먼저 나눠 둔 쪽이 넘치게 된다. 그래서 글꼴을 다 받은 뒤에 한 번 다시 나눈다.
if (document.fonts && document.fonts.status !== 'loaded') {
    document.fonts.ready.then(() => {
        const here = PAGES[current];
        rebuildPages();
        current = Math.min(current, PAGES.length - 1);
        if (here && here.kind === 'chapter') {
            const idx = PAGES.findIndex(p => p.kind === 'chapter' && p.first && p.ch.num === here.ch.num);
            if (idx >= 0) current = idx;
        }
        paint();
    });
}
