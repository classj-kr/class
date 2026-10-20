// 녹음별 제공처와 이용 조건은 아래 출처 기록에서 관리합니다.
// 출처와 라이선스 전문은 assets/audio/classical/AUDIO_CREDITS.md 에 있습니다.
const AUDIO_LOCAL = {
  '01': { file: 'vivaldi-spring.ogg', performer: 'John Harrison(바이올린) · Wichita State University Chamber Players', license: 'CC BY-SA 4.0', revision: '67ada06f9769' },
  '02': { file: 'air-on-g-string.ogg', performer: 'US Air Force Strings(지휘 Keith H. Bland)', license: '퍼블릭 도메인', revision: '8ee948ebc591' },
  '03': { file: 'brandenburg-concerto5.ogg', performer: 'Advent Chamber Orchestra', license: 'CC BY-SA 2.0', revision: 'e338f0e20d22' },
  '04': { file: 'water-music-hornpipe.ogg', performer: 'Marine Chamber Orchestra(지휘 Michelle Rakers)', license: '퍼블릭 도메인', revision: 'cbd5956d81ea' },
  '05': { file: 'canon.ogg', performer: 'Lee Galloway(피아노 편곡)', license: 'CC BY-SA 3.0', note: '원곡은 현악 합주지만 이 녹음은 피아노 독주 편곡입니다.' },
  '06': { file: 'symphony5-fate.ogg', performer: 'Skidmore College Orchestra(Musopen)', license: '퍼블릭 도메인', revision: '663cfa62707b' },
  '07': { file: 'symphony9-choral4.ogg', performer: 'Symphony Orchestra · 합창단과 독창자 · Albert Coates 지휘(1923년 녹음)', license: '퍼블릭 도메인', note: '두 파일로 나뉜 역사적 실연 녹음을 이어 붙였습니다. 피날레는 영어로 노래합니다.' },
  '08': { file: 'eine-kleine-nachtmusik.ogg', performer: 'Advent Chamber Orchestra', license: 'CC BY-SA 2.0', revision: 'db35d442500e' },
  '09': { file: 'twinkle-variations.ogg', performer: 'Andriy Bondarenko(피아노)', license: 'CC BY-SA 4.0', revision: '75150c868552' },
  '10': { file: 'haydn-surprise.ogg', performer: '보스턴 교향악단 · 세르게 쿠세비츠키 지휘(1929년 녹음)', license: '퍼블릭 도메인' },
  '11': { file: 'trumpet-concerto3.ogg', performer: "Real Filharmonía de Galicia", license: 'CC BY 3.0', revision: 'f01b2855d6ab' },
  '12': { file: 'william-tell-finale.ogg', performer: 'US Marine Band(지휘 Timothy Foley)', license: '퍼블릭 도메인', note: '관악합주 편곡이며 전곡 녹음 중 7분 30초부터가 피날레입니다.' },
  '14': {"file": "erlking.ogg", "performer": "Michael Jackson(베이스바리톤)", "license": "CC BY 3.0", "revision": "2fc3ce470fdd"},
  '15': { file: 'nocturne-op9-2.ogg', performer: 'Frank Lévy(피아노)', license: '퍼블릭 도메인', revision: 'be9eb1f9326a' },
  '16': { file: 'hungarian-dance5.ogg', performer: 'Artur Nikisch(피아노, 1906년 피아노 롤 녹음)', license: '퍼블릭 도메인', note: '원곡은 피아노 네 손 연주곡이며, 이 녹음은 역사적인 피아노 롤 연주입니다.' },
  '17': { file: 'waltz-of-flowers.ogg', performer: 'US Air Force Band(편곡 Lawrence Odom)', license: '퍼블릭 도메인', note: '관악합주 편곡입니다.' },
  '18': { file: 'swan-lake-scene.ogg', performer: 'London Philharmonic Orchestra(지휘 John Barbirolli, 1933년 녹음)', license: '퍼블릭 도메인' },
  '19': { file: 'the-swan.ogg', performer: "Seattle Youth Symphony · Vilem Sokol · Neal & Nancy O’Doan(피아노)", license: 'CC BY-SA 2.0', revision: 'c72ec8d23c68' },
  '20': { file: 'great-gate-of-kiev.ogg', performer: 'Musopen 제공(연주자 정보 미표기)', license: '퍼블릭 도메인' },
  '21': { file: 'new-world-symphony2.ogg', performer: 'Musopen 제공(연주 단체 정보 미표기)', license: '퍼블릭 도메인' },
  '22': { file: 'bolero.ogg', performer: '모리스 라벨 본인 지휘(1930년 녹음)', license: '퍼블릭 도메인' },
  '23': { file: 'prelude-faun.mp3', performer: "Columbia University Orchestra", license: '퍼블릭 도메인', revision: '708c0cf674fa' },
  '24': { file: 'jupiter.ogg', performer: 'Skidmore College Orchestra(Musopen)', license: 'Musopen Attribution', revision: '2d947467948d' },
  '27': {"file": "hallelujah-chorus.ogg", "performer": "국립합창단(2019년 예술의전당 실황)", "license": "CC BY 3.0", "revision": "f58bc1e56a69"},
  '28': { file: 'turkish-march.ogg', performer: 'Romuald Greiss(피아노, 2000년 실황)', license: '퍼블릭 도메인', revision: '65d728bec126' },
  '29': { file: 'moldau.ogg', performer: 'Musopen Symphony Orchestra(2012년)', license: 'CC0', revision: '84663550a99b' },
  '31': { file: 'toccata-fugue-dminor.ogg', performer: 'Ashtar Moïra(오르간)', license: '퍼블릭 도메인' },
  '32': { file: 'vivaldi-winter.ogg', performer: 'John Harrison(바이올린) · Wichita State University Chamber Players', license: 'CC BY-SA 4.0', revision: 'e7d4c67c6466' },
  '33': { file: 'fur-elise.ogg', performer: 'Jason M. C. Han(피아노)', license: 'CC BY-SA 4.0', revision: '8c7fc3c20603' },
  '34': { file: 'moonlight.ogg', performer: 'Paul Pitman(피아노, Musopen)', license: '퍼블릭 도메인', revision: '035a31b8d67d' },
  '35': { file: 'symphony40.ogg', performer: 'Tsumugi Orchestra(지휘 Takashi Inoue, 2010년 실황)', license: 'CC BY 3.0', revision: '793aee0a93be' },
  '36': { file: 'queen-of-night-aria.ogg', performer: 'Sandra Partridge(소프라노) · Bangkok Opera(2006년 실황)', license: 'CC BY 2.5', revision: 'bbdf0a8d4c15' },
  '37': { file: 'carmen-prelude.ogg', performer: 'Philadelphia Symphony Orchestra(지휘 Leopold Stokowski, 1919년 녹음)', license: '퍼블릭 도메인', note: '1923년 이전 녹음이라 미국에서 저작인접권이 만료됐습니다.' },
  '38': { file: 'can-can.ogg', performer: 'Musopen 제공(연주자 정보 미표기)', license: '퍼블릭 도메인' },
  '39': { file: 'blue-danube.ogg', performer: 'US Marine Band(지휘 Albert F. Schoepper)', license: '퍼블릭 도메인', note: '취주악(윈드밴드) 편곡입니다.' },
  '40': {"file": "ride-of-valkyries.ogg", "performer": "Ulm Philharmonic · James Allen Gähres(지휘)", "license": "EFF Open Audio License v1", "revision": "c4f67cdeece7"},
  '41': { file: 'morning-mood.ogg', performer: 'Czech National Symphony Orchestra(Musopen Symphony, 2012년)', license: '퍼블릭 도메인', revision: '3207072ffef9' },
  '42': { file: 'hall-of-mountain-king.ogg', performer: 'Czech National Symphony Orchestra(Musopen Symphony, 2012년)', license: '퍼블릭 도메인', revision: '3bfa7424d3a1' },
  '43': { file: 'wedding-march.ogg', performer: 'European Archive 소장 녹음(연주 단체 정보 미표기)', license: '퍼블릭 도메인' },
  '44': { file: '1812-overture-finale.ogg', performer: 'Concertgebouw Orchestra of Amsterdam(지휘 Paul van Kempen)', license: '퍼블릭 도메인' },
  '45': { file: 'flight-of-bumblebee.ogg', performer: 'US Army Band', license: '퍼블릭 도메인' },
  '46': { file: 'hungarian-rhapsody2.ogg', performer: 'Martha Goldstein(피아노)', license: 'CC BY-SA 2.0', revision: '398a95e7978f' },
  '47': { file: 'clair-de-lune.ogg', performer: 'Laurens Goedhart(피아노)', license: 'CC BY 3.0', revision: '2f7a1e833f4e' },
  '50': {"file": "rhapsody-in-blue.ogg", "performer": "Bramwell Tovey(피아노·지휘) · United States Marine Band(2018년)", "license": "Public domain", "revision": "eeaacacbce60", "note": "1924년 초연의 재즈 밴드 편성으로 연주한 2018년 실황입니다."},
};

const pieces = [
  ['01','baroque','바로크','사계 〈봄〉 1악장','비발디','협주곡','바이올린','4박자','빠르게','밝고 생기 있게','새소리와 천둥을 묘사하는 독주 바이올린','표제 음악','봄 풍경을 소리로 그린 음악'],
  ['02','baroque','바로크','G선상의 아리아','바흐','관현악 모음곡','현악 합주','4박자','느리게','평온하고 장중하게','길게 이어지는 선율과 고른 저음','선율','숨을 길게 이어 가는 듯한 노래'],
  ['03','baroque','바로크','브란덴부르크 협주곡 5번 1악장','바흐','합주 협주곡','하프시코드','2박자','빠르게','화려하고 활기차게','독주 악기군과 합주가 주고받는 대화','합주 협주곡','하프시코드의 긴 독주 부분'],
  ['04','baroque','바로크','수상 음악 〈알라 혼파이프〉','헨델','관현악 모음곡','금관악기','3박자','보통 빠르게','당당하고 축제처럼','힘찬 금관과 뚜렷한 3박자','모음곡','왕의 뱃놀이를 위해 만든 야외 음악'],
  ['05','baroque','바로크','카논 라장조','파헬벨','카논','현악 합주','4박자','보통 빠르게','차분하고 따뜻하게','같은 선율이 차례로 뒤따라 들어옴','돌림노래 원리','반복되는 저음 위에 선율이 겹침'],
  ['06','classical','고전','교향곡 5번 〈운명〉 1악장','베토벤','교향곡','관현악','2박자','빠르게','긴장되고 힘차게','따따따-따 네 음 동기의 반복과 변형','동기','짧은 음악 재료가 곡 전체를 이끔'],
  ['07','classical','고전','교향곡 9번 〈합창〉 4악장','베토벤','교향곡','합창과 관현악','4박자','빠르게','장엄하고 환희에 차게','환희의 주제가 합창과 함께 커짐','주제','교향곡에 성악을 본격적으로 결합'],
  ['08','classical','고전','아이네 클라이네 나흐트무지크 1악장','모차르트','세레나데','현악 합주','4박자','빠르게','밝고 우아하게','힘찬 첫 주제와 부드러운 둘째 주제','소나타 형식','두 성격의 주제가 대비됨'],
  ['09','classical','고전','작은 별 변주곡','모차르트','변주곡','피아노','2박자','보통 빠르게','재치 있고 다채롭게','익숙한 주제가 리듬과 빠르기를 바꿈','변주','하나의 주제가 여러 모습으로 변화'],
  ['10','classical','고전','놀람 교향곡 2악장','하이든','교향곡','관현악','2박자','조금 느리게','평온하다가 익살스럽게','여린 선율 뒤 갑자기 나오는 큰 소리','셈여림','갑작스러운 강한 소리로 놀라게 함'],
  ['11','classical','고전','트럼펫 협주곡 3악장','하이든','협주곡','트럼펫','2박자','빠르게','명랑하고 경쾌하게','독주 트럼펫과 관현악의 주고받음','협주','독주 악기와 관현악이 대비하고 협력'],
  ['12','romantic','낭만','윌리엄 텔 서곡 〈피날레〉','로시니','서곡','관현악','2박자','빠르게','용감하고 질주하듯','말발굽을 닮은 빠른 리듬','서곡','오페라가 시작되기 전 연주하는 음악'],
  ['13','romantic','낭만','피아노 5중주 〈송어〉 4악장','슈베르트','변주곡','피아노와 현악기','2박자','조금 느리게','맑고 경쾌하게','주제가 악기를 바꾸며 다섯 번 변주됨','실내악','소수 연주자가 긴밀하게 호흡'],
  ['14','romantic','낭만','마왕','슈베르트','예술가곡','성악과 피아노','4박자','매우 빠르게','불안하고 긴박하게','말발굽 같은 피아노 반주와 역할별 목소리','예술가곡','시와 음악이 결합한 독창곡'],
  ['15','romantic','낭만','녹턴 작품 9-2','쇼팽','녹턴','피아노','12/8박자','조금 느리게','고요하고 서정적으로','꾸밈음이 더해진 노래하는 오른손 선율','루바토','박자를 유연하게 밀고 당기는 표현'],
  ['16','romantic','낭만','헝가리 무곡 5번','브람스','무곡','피아노 네 손 원곡·관현악 편곡','2박자','빠르기의 변화가 큼','정열적이고 익살스럽게','갑작스러운 빠르기와 셈여림 변화','아고기크','피아노 네 손 원곡과 관현악 편곡으로 널리 연주'],
  ['17','romantic','낭만','호두까기 인형 〈꽃의 왈츠〉','차이콥스키','발레 음악','관현악과 하프','3박자','보통 빠르게','화려하고 우아하게','화려하게 시작해 빙글도는 왈츠 리듬','왈츠','강-약-약으로 흐르는 3박자 춤'],
  ['18','romantic','낭만','백조의 호수 〈정경〉','차이콥스키','발레 음악','오보에와 관현악','4박자','보통 빠르게','신비롭고 애잔하게','오보에가 연주하는 슬픈 백조 주제','발레 음악','춤과 극의 장면을 이끄는 관현악'],
  ['19','romantic','낭만','동물의 사육제 〈백조〉','생상스','모음곡','첼로와 두 대의 피아노','6/4박자','조금 느리게','우아하고 평화롭게','첼로 선율과 잔물결 같은 피아노 반주','음색','첼로가 물 위의 백조를 표현'],
  ['20','romantic','낭만','전람회의 그림 〈키예프의 대문〉','무소륵스키','모음곡','피아노 원곡·관현악 편곡','4박자','장엄하게','웅장하고 찬란하게','큰 종소리 같은 화음과 힘찬 주제','표제 음악','피아노 원곡과 라벨의 관현악 편곡으로 널리 감상'],
  ['21','romantic','낭만','신세계 교향곡 2악장','드보르자크','교향곡','잉글리시 호른','4박자','매우 느리게','그립고 평화롭게','잉글리시 호른의 고향을 그리는 선율','민족주의 음악','민속적 선율과 리듬을 예술 음악에 활용'],
  ['22','modern','20세기','볼레로','라벨','관현악곡','스네어드럼과 관현악','3박자','보통 빠르게','집요하고 점차 고조되게','같은 리듬 위 음색과 셈여림이 변화','크레셴도','긴 시간에 걸쳐 점점 크게 연주'],
  ['23','modern','20세기','목신의 오후에의 전주곡','드뷔시','교향시','플루트','9/8박자','보통 빠르게','몽환적이고 신비롭게','경계가 흐릿한 화음과 유연한 플루트 선율','인상주의','빛과 분위기처럼 순간의 인상을 표현'],
  ['24','modern','20세기','행성 〈목성〉','홀스트','관현악 모음곡','관현악','2박자','빠르게','웅장하고 즐겁게','힘찬 춤 리듬과 넓게 노래하는 중간 선율','관현악법','다양한 악기 음색을 풍부하게 배치'],
  ['25','modern','20세기','피터와 늑대','프로코피예프','음악 동화','관현악과 해설','박자 변화','빠르기 변화','재치 있고 이야기하듯','등장인물마다 다른 악기와 주제를 사용','라이트모티프','인물이나 생각을 나타내는 반복 주제'],
  ['26','modern','20세기','청소년을 위한 관현악 입문','브리튼','변주곡과 푸가','관현악','박자 변화','빠르기 변화','선명하고 교육적으로','악기군별 변주 뒤 모든 악기가 푸가로 합류','푸가','주제가 여러 성부에서 차례로 모방'],
  ['27','baroque','바로크','메시아 〈할렐루야〉','헨델','오라토리오','합창과 관현악','4박자','빠르게','장엄하고 환희에 차게','합창이 반복하는 “할렐루야”와 힘찬 화음','합창','성경 이야기를 바탕으로 한 대규모 성악곡'],
  ['28','classical','고전','피아노 소나타 11번 〈터키 행진곡〉','모차르트','피아노 소나타','피아노','2박자','조금 빠르게','경쾌하고 또렷하게','행진을 닮은 리듬과 빠른 오른손 선율','론도','반복되는 주제가 여러 부분 사이에 돌아옴'],
  ['29','romantic','낭만','나의 조국 〈몰다우〉','스메타나','교향시','관현악','6/8박자','보통 빠르게','넓고 흐르듯','두 샘물이 만나 큰 강이 되는 선율','표제 음악','강의 흐름과 주변 풍경을 음악으로 표현'],
  ['30','modern','20세기','사브르 댄스','하차투리안','발레 음악','관현악','2박자','매우 빠르게','격렬하고 긴장되게','빠른 리듬과 강한 악센트가 반복됨','발레 음악','발레 〈가야네〉의 한 장면을 위한 음악'],
  ['31','baroque','바로크','토카타와 푸가 라단조','바흐','오르간곡','오르간','4박자','빠르기 변화','어둡고 극적으로','강렬한 첫 동기와 거대한 오르간 음향','푸가','공포·긴장 장면에서 자주 들리는 유명한 도입'],
  ['32','baroque','바로크','사계 〈겨울〉 1악장','비발디','협주곡','바이올린','4박자','빠르게','차갑고 긴박하게','떨리는 현악기와 매섭게 몰아치는 독주 바이올린','표제 음악','추위에 떠는 몸과 얼음바람을 소리로 묘사'],
  ['33','classical','고전','엘리제를 위하여','베토벤','피아노 소품','피아노','3박자','조금 빠르게','쓸쓸하고 부드럽게','미-레# 두 음을 오가는 익숙한 첫 동기','론도','첫 주제가 다른 부분 사이에 계속 돌아옴'],
  ['34','classical','고전','월광 소나타 1악장','베토벤','피아노 소나타','피아노','4박자','느리게','고요하고 어둡게','셋잇단음표 아르페지오 위에 떠오르는 낮은 선율','선율','반복 반주 위에서 긴 선율이 천천히 이동'],
  ['35','classical','고전','교향곡 40번 1악장','모차르트','교향곡','관현악','2박자','빠르게','불안하고 격정적으로','쉼 없이 이어지는 여덟 음의 첫 주제','소나타 형식','불안한 주제가 조성과 악기를 바꾸며 전개'],
  ['36','classical','고전','마술피리 〈밤의 여왕의 아리아〉','모차르트','오페라 아리아','소프라노와 관현악','4박자','매우 빠르게','분노에 차고 화려하게','매우 높은 음과 빠른 콜로라투라','콜로라투라','사람의 목소리가 악기처럼 빠르게 움직임'],
  ['37','romantic','낭만','카르멘 〈전주곡〉','비제','오페라 전주곡','관현악','2박자','매우 빠르게','화려하고 긴박하게','심벌즈와 금관이 이끄는 투우사 주제','서곡','오페라의 주요 선율을 시작 전에 들려줌'],
  ['38','romantic','낭만','천국과 지옥 〈캉캉〉','오펜바흐','오페레타','관현악','2박자','매우 빠르게','익살스럽고 들뜨게','빠른 갤럽 리듬과 반복되는 계단식 선율','무곡','빠르게 발을 차올리는 캉캉 춤과 연결'],
  ['39','romantic','낭만','아름답고 푸른 도나우','요한 슈트라우스 2세','왈츠','관현악','3박자','보통 빠르게','우아하고 찬란하게','도입 뒤 펼쳐지는 강-약-약의 왈츠 주제','왈츠','빈의 무도회와 새해 음악회의 상징'],
  ['40','romantic','낭만','발퀴레의 기행','바그너','오페라 음악','관현악','3박자','빠르게','용맹하고 압도적으로','금관악기의 상승 동기와 질주하는 리듬','라이트모티프','발퀴레 전사들을 나타내는 반복 주제'],
  ['41','romantic','낭만','페르 귄트 〈아침 기분〉','그리그','모음곡','플루트와 오보에','6/8박자','조금 느리게','맑고 평화롭게','플루트와 오보에가 주고받는 떠오르는 선율','표제 음악','해가 떠오르는 풍경을 음색과 셈여림으로 표현'],
  ['42','romantic','낭만','페르 귄트 〈산왕의 궁전에서〉','그리그','모음곡','관현악','4박자','빠르게','은밀하다가 광적으로','짧은 주제가 반복되며 점점 빠르고 크게 변함','크레셴도','같은 선율의 속도·음량·악기가 계속 증가'],
  ['43','romantic','낭만','한여름 밤의 꿈 〈결혼행진곡〉','멘델스존','극음악','관현악','4박자','빠르게','당당하고 축제처럼','트럼펫 팡파르와 힘찬 행진 리듬','주제','결혼식 퇴장 음악으로 널리 사용되는 선율'],
  ['44','romantic','낭만','1812년 서곡 〈피날레〉','차이콥스키','축전 서곡','관현악과 종·대포','4박자','장엄하게','승리에 차고 웅장하게','종소리·금관 합주와 대포 효과가 겹침','관현악법','매우 큰 음향으로 역사적 승리의 장면을 표현'],
  ['45','romantic','낭만','술탄 황제의 이야기 〈왕벌의 비행〉','림스키코르사코프','오페라 음악','관현악','4박자','매우 빠르게','쉴 새 없이 날렵하게','반음계가 벌의 날갯짓처럼 빠르게 오르내림','선율','빠른 반음계 선율로 날아다니는 벌을 묘사'],
  ['46','romantic','낭만','헝가리 광시곡 2번','리스트','랩소디','피아노','2박자','느리게 시작해 빨라짐','장중하다가 익살스럽게','느린 부분 뒤 빠른 춤과 옥타브가 폭발함','루바토','애니메이션의 피아노 대결 장면으로도 익숙한 곡'],
  ['47','modern','20세기','베르가마스크 모음곡 〈달빛〉','드뷔시','피아노 소품','피아노','9/8박자','조금 느리게','고요하고 몽환적으로','부드러운 화음과 물결처럼 번지는 아르페지오','인상주의','선명한 줄거리보다 빛과 공기의 분위기를 표현'],
  ['48','modern','20세기','로미오와 줄리엣 〈기사들의 춤〉','프로코피예프','발레 음악','관현악','4박자','보통 빠르게','무겁고 위압적으로','낮은 금관과 현악기의 강한 오스티나토','오스티나토','짧고 무거운 리듬이 반복되어 위압감을 만듦'],
  ['49','modern','20세기','카르미나 부라나 〈오 운명의 여신이여〉','오르프','칸타타','합창과 관현악','3박자','보통 빠르게','운명적이고 폭발적으로','속삭임에서 포효로 커지는 합창과 반복 리듬','크레셴도','영화 예고편 같은 극적 합창으로 널리 알려짐'],
  ['50','modern','20세기','랩소디 인 블루','거슈윈','랩소디','피아노와 관현악','4박자','보통 빠르게','세련되고 활기차게','클라리넷 글리산도와 재즈풍 당김음','글리산도','재즈 어법과 클래식 협주곡의 규모를 결합']
].map(([no,era,period,title,composer,form,lead,meter,tempo,mood,feature,concept,note])=>({no,era,period,title,composer,form,lead,meter,tempo,mood,feature,concept,note,url:`https://www.youtube.com/results?search_query=${encodeURIComponent(`${composer} ${title}`)}`,audio:AUDIO_LOCAL[no]||null}));

const originalTitles=[
  'Le quattro stagioni: “La primavera”, I','Air from Orchestral Suite No. 3 in D major','Brandenburg Concerto No. 5 in D major, I','Water Music: “Alla Hornpipe”','Canon in D major',
  'Symphony No. 5 in C minor, I','Symphony No. 9 in D minor, IV','Eine kleine Nachtmusik, I','12 Variations on “Ah vous dirai-je, Maman”','Symphony No. 94 “Surprise”, II',
  'Trumpet Concerto in E-flat major, III','Guillaume Tell Overture: Finale','Piano Quintet in A major “Trout”, IV','Erlkönig, D 328','Nocturne in E-flat major, Op. 9 No. 2',
  'Hungarian Dance No. 5','The Nutcracker: “Waltz of the Flowers”','Swan Lake: “Scene”','Le Carnaval des animaux: “Le Cygne”','Pictures at an Exhibition: “The Great Gate of Kyiv”',
  'Symphony No. 9 “From the New World”, II','Boléro','Prélude à l’après-midi d’un faune','The Planets: “Jupiter, the Bringer of Jollity”','Peter and the Wolf, Op. 67',
  'The Young Person’s Guide to the Orchestra','Messiah: “Hallelujah”','Piano Sonata No. 11: “Rondo alla Turca”','Má vlast: “Vltava (The Moldau)”','Gayane: “Sabre Dance”',
  'Toccata and Fugue in D minor, BWV 565','Le quattro stagioni: “L’inverno”, I','Für Elise, WoO 59','Piano Sonata No. 14 “Moonlight”, I','Symphony No. 40 in G minor, I',
  'Die Zauberflöte: “Der Hölle Rache”','Carmen: Prélude','Orphée aux enfers: “Galop infernal”','An der schönen blauen Donau','Die Walküre: “Ride of the Valkyries”',
  'Peer Gynt: “Morning Mood”','Peer Gynt: “In the Hall of the Mountain King”','A Midsummer Night’s Dream: “Wedding March”','1812 Overture: Finale','The Tale of Tsar Saltan: “Flight of the Bumblebee”',
  'Hungarian Rhapsody No. 2','Suite bergamasque: “Clair de lune”','Romeo and Juliet: “Dance of the Knights”','Carmina Burana: “O Fortuna”','Rhapsody in Blue'
];
const composerOriginal={
  '비발디':'Antonio Vivaldi','바흐':'Johann Sebastian Bach','헨델':'George Frideric Handel','파헬벨':'Johann Pachelbel','베토벤':'Ludwig van Beethoven','모차르트':'Wolfgang Amadeus Mozart',
  '하이든':'Joseph Haydn','로시니':'Gioachino Rossini','슈베르트':'Franz Schubert','쇼팽':'Frédéric Chopin','브람스':'Johannes Brahms','차이콥스키':'Pyotr Ilyich Tchaikovsky',
  '생상스':'Camille Saint-Saëns','무소륵스키':'Modest Mussorgsky','드보르자크':'Antonín Dvořák','라벨':'Maurice Ravel','드뷔시':'Claude Debussy','홀스트':'Gustav Holst',
  '프로코피예프':'Sergei Prokofiev','브리튼':'Benjamin Britten','스메타나':'Bedřich Smetana','하차투리안':'Aram Khachaturian','비제':'Georges Bizet','오펜바흐':'Jacques Offenbach',
  '요한 슈트라우스 2세':'Johann Strauss II','바그너':'Richard Wagner','그리그':'Edvard Grieg','멘델스존':'Felix Mendelssohn','림스키코르사코프':'Nikolai Rimsky-Korsakov',
  '리스트':'Franz Liszt','오르프':'Carl Orff','거슈윈':'George Gershwin'
};
const workYears={'01':'1723년','02':'1730년경','03':'1721년','04':'1717년','05':'1680년경','06':'1808년','07':'1824년','08':'1787년','09':'1781~1782년','10':'1791년','11':'1796년','12':'1829년','13':'1819년','14':'1815년','15':'1832년','16':'1869년','17':'1892년','18':'1876년','19':'1886년','20':'1874년','21':'1893년','22':'1928년','23':'1894년','24':'1916년','25':'1936년','26':'1945년','27':'1741년','28':'1783년','29':'1874년','30':'1942년','31':'1700년경','32':'1723년','33':'1810년경','34':'1801년','35':'1788년','36':'1791년','37':'1875년','38':'1858년','39':'1867년','40':'1856년','41':'1875년','42':'1875년','43':'1842년','44':'1880년','45':'1900년','46':'1847년','47':'1905년','48':'1935년','49':'1936년','50':'1924년'};
const stories={
  '01':'비발디는 《사계》의 각 협주곡에 어울리는 짧은 소네트를 악보와 함께 출판했습니다. 그래서 새소리, 개 짖는 소리, 천둥처럼 들리는 부분을 “무엇을 표현한 대목일까?” 하며 찾아 들을 수 있습니다.',
  '02':'이 곡이 ‘G선상의 아리아’로 불리게 된 것은 바흐의 원래 제목이 아니라, 19세기 바이올리니스트 아우구스트 빌헬미가 선율을 G선 하나로 연주할 수 있게 편곡하면서부터입니다.',
  '03':'브란덴부르크 협주곡은 바흐가 브란덴부르크 변경백에게 헌정한 여섯 곡입니다. 특히 5번의 하프시코드 독주는 당시에는 드물 만큼 길고 화려해서, 반주 악기가 잠시 주인공이 되는 장면처럼 들립니다.',
  '04':'《수상 음악》은 1717년 템스강의 왕실 뱃놀이에서 연주된 것으로 알려져 있습니다. 강 위 야외에서도 잘 들리도록 호른·트럼펫 같은 금관악기를 힘차게 쓴 이유를 상상하며 들어 보세요.',
  '05':'파헬벨의 카논은 낮은 음의 진행이 끝까지 거의 반복되는 동안 같은 선율을 맡은 성부가 차례로 뒤따라 들어옵니다. 단순한 규칙에서 점점 복잡하고 풍성한 소리가 만들어지는 것이 이 곡의 재미입니다.',
  '06':'‘운명이 문을 두드린다’는 유명한 해석은 베토벤의 말을 전한 사람의 기록이라 확실하지 않습니다. 하지만 네 음으로 시작하는 동기가 작품 전체를 끌고 가기 때문에, 학생들이 직접 자기만의 이야기를 붙여 보기 좋은 곡입니다.',
  '07':'1824년 초연 때 베토벤은 청력을 거의 잃은 상태였습니다. 연주가 끝난 뒤에도 객석의 박수를 듣지 못해, 한 연주자가 그를 관객 쪽으로 돌려 세웠다는 일화가 전해집니다.',
  '08':'《아이네 클라이네 나흐트무지크》는 너무 유명하지만 어떤 자리에서 처음 연주되었는지는 정확히 알 수 없습니다. 제목은 ‘작은 밤 음악’ 정도의 뜻으로, 밤의 배경보다 밝고 또렷한 실내악의 대화에 귀가 갑니다.',
  '09':'모차르트는 프랑스 노래 〈Ah vous dirai-je, Maman〉 선율로 열두 변주를 만들었습니다. 오늘날 ‘반짝반짝 작은 별’로 친숙한 선율이어서, 변주마다 무엇이 바뀌고 무엇이 남는지 놀이처럼 찾아볼 수 있습니다.',
  '10':'하이든의 ‘놀람’이라는 별명은 조용한 주제 뒤에 갑자기 강한 화음이 터지는 데서 왔습니다. 졸던 관객을 깨우려고 썼다는 이야기는 유쾌한 전설에 가깝지만, 실제로 듣는 사람을 깜짝 놀라게 하는 효과는 분명합니다.',
  '11':'하이든의 트럼펫 협주곡은 새로 개발된 ‘키드 트럼펫’을 잘 아는 연주자 안톤 바이딩거를 위해 쓴 곡입니다. 이전 트럼펫보다 음을 더 부드럽게 이어 낼 수 있었기에, 독주 악기가 노래하듯 움직이는 장면이 돋보입니다.',
  '12':'로시니의 오페라 《윌리엄 텔》 마지막 부분은 영웅이 자유를 향해 달려가는 장면을 떠올리게 합니다. 이후 영화와 방송에서 추격 장면 음악으로 자주 쓰여, 원래 오페라보다 ‘질주 음악’으로 먼저 기억하는 사람도 많습니다.',
  '13':'‘송어 5중주’라는 별명은 4악장이 슈베르트의 가곡 〈송어〉 선율을 변주하기 때문에 붙었습니다. 피아노와 현악기가 같은 멜로디를 차례로 받아 가며, 물속 송어가 이리저리 움직이는 듯한 색을 바꿉니다.',
  '14':'〈마왕〉은 괴테의 시를 바탕으로 한 노래입니다. 한 성악가가 아버지·아이·마왕·해설자까지 여러 인물을 바꾸어 표현해야 해서, 짧은 곡 안에 작은 연극을 보는 듯한 긴장감이 생깁니다.',
  '15':'쇼팽의 녹턴은 살롱에서 연주되는 음악의 섬세함과 즉흥적인 느낌을 함께 품고 있습니다. 오른손 선율을 노래하듯 자유롭게 흔들어도 왼손 반주는 비교적 고르게 흐르는데, 이 차이가 루바토의 매력입니다.',
  '16':'브람스는 헝가리 민속 음악을 직접 채집한 작품이라기보다, 당시 접한 집시풍·헝가리풍 춤곡의 에너지를 자기 방식으로 다듬었습니다. 5번의 갑작스러운 멈춤과 재출발은 춤추는 사람의 표정 변화처럼 들립니다.',
  '17':'《호두까기 인형》은 E. T. A. 호프만의 이야기를 바탕으로 한 발레입니다. 초연 당시에는 반응이 엇갈렸지만, 오늘날에는 크리스마스 시즌을 대표하는 작품이 되었고 〈꽃의 왈츠〉는 무대 밖에서도 사랑받습니다.',
  '18':'《백조의 호수》 초연은 큰 성공을 거두지 못했지만, 차이콥스키가 세상을 떠난 뒤 안무와 구성이 다듬어지며 대표 발레가 되었습니다. 오보에의 백조 주제가 나올 때, 춤의 장면 없이도 호수의 쓸쓸한 분위기를 떠올릴 수 있습니다.',
  '19':'생상스는 《동물의 사육제》를 친구들을 위한 사적인 연주회에서 먼저 들려주었고, 작품이 진지한 작곡가로서의 평판을 해칠까 걱정해 생전에는 대부분 공개하지 않았습니다. 예외가 바로 〈백조〉였고, 지금은 첼리스트의 대표 레퍼토리가 되었습니다.',
  '20':'무소륵스키는 화가 친구 빅토르 하르트만의 추모 전시회를 보고 이 모음곡을 썼습니다. 피아노 원곡 사이사이의 ‘프롬나드’는 전시장 그림 사이를 걸어 다니는 관람객처럼 들리며, 라벨의 관현악 편곡이 특히 널리 알려졌습니다.',
  '21':'드보르자크는 미국 뉴욕에 머물며 이 교향곡을 썼습니다. 2악장의 잉글리시 호른 선율은 훗날 ‘Goin’ Home’이라는 노래로도 사랑받았지만, 원래 곡에 있던 노래가 아니라 후대에 이 선율에 새 가사를 붙인 것입니다.',
  '22':'라벨의 《볼레로》는 무용가 이다 루빈슈타인의 발레를 위해 만들어졌습니다. 거의 같은 리듬과 선율을 반복하면서도 매번 다른 악기가 등장하고, 마지막까지 점점 커지기 때문에 ‘변화가 거의 없는데 지루하지 않은 이유’를 찾기 좋은 곡입니다.',
  '23':'드뷔시는 시인 말라르메의 시에서 영감을 얻어 이 곡을 썼습니다. 시작의 플루트 선율은 규칙적인 박자를 또렷하게 보여 주기보다, 꿈에서 막 깨어난 듯 자유롭게 떠다니며 인상주의 음악의 색채를 들려줍니다.',
  '24':'홀스트는 점성술에서 받은 인상을 바탕으로 《행성》을 만들었고, 이 곡의 제목도 ‘즐거움을 가져오는 자 목성’입니다. 중간의 넓은 선율은 후에 영국의 애국가 〈I Vow to Thee, My Country〉에 쓰여 더 익숙하게 들릴 수 있습니다.',
  '25':'프로코피예프는 어린이에게 관현악기를 친근하게 소개하려고 《피터와 늑대》를 만들었습니다. 피터는 현악기, 새는 플루트, 늑대는 호른처럼 인물마다 악기를 정해 두어, 이야기와 소리를 함께 기억하게 합니다.',
  '26':'브리튼은 영국 교육부의 의뢰로 이 작품을 썼습니다. 퍼셀의 주제를 악기군별로 변주해 들려준 뒤 마지막에 모두가 푸가로 합류하므로, 오케스트라를 ‘한 악기씩 만나고 마지막에 함께 듣는’ 책처럼 따라갈 수 있습니다.',
  '27':'《메시아》는 오페라가 아니라 성경 이야기를 콘서트 형식으로 들려주는 오라토리오입니다. 1742년 아일랜드 더블린에서 처음 연주되었고, 〈할렐루야〉는 뒤이어 관객이 함께 일어서는 관습으로도 유명해졌습니다.',
  '28':'‘터키 행진곡’은 오스만 제국의 예니체리 군악대가 유럽에서 유행하던 시기의 상상력을 담았습니다. 피아노 한 대로 북과 심벌즈가 섞인 행진의 느낌을 어떻게 만드는지, 왼손 반주와 강한 악센트를 들어 보세요.',
  '29':'스메타나는 체코의 역사와 풍경을 음악으로 그린 연작 《나의 조국》 가운데 하나로 〈몰다우〉를 썼습니다. 두 샘물이 만나는 작은 물길에서 출발해 큰 강으로 흐르는 장면을 제목 없이도 상상하게 만드는 표제 음악입니다.',
  '30':'〈사브르 댄스〉는 발레 《가야네》의 한 장면을 위한 음악입니다. 1942년 초연 뒤 빠른 리듬과 강한 악센트가 큰 인기를 얻어, 서커스·방송·대중문화에서 ‘숨 가쁘게 바쁜 장면’의 음악처럼 자주 쓰이게 되었습니다.',
  '31':'첫 화음과 빠르게 떨어지는 선율은 공포 영화와 게임에서 오르간을 상징하는 소리처럼 쓰여 왔습니다. 곡의 바흐 작곡 여부를 둘러싼 논의도 있지만, 토카타의 자유로운 몸짓과 푸가의 질서가 대비되는 대표적인 오르간 레퍼토리입니다.',
  '32':'비발디는 추위에 떨고 발을 구르며 얼음바람을 견디는 모습을 음악으로 그렸습니다. 짧게 떨리는 합주와 날카로운 독주 바이올린을 번갈아 들으면 겨울 장면이 더 또렷해집니다.',
  '33':'누구를 가리키는지 확실하지 않은 ‘엘리제’에게 바친 짧은 피아노곡입니다. 미와 레#을 오가는 첫 동기가 너무 유명해 피아노를 처음 배우는 학생들도 자주 만나지만, 중간 부분에서는 분위기와 연주 기법이 크게 달라집니다.',
  '34':'‘월광’은 베토벤이 붙인 제목이 아니라 후대 평론가가 달빛 비친 호수에 비유하며 생긴 별명입니다. 고른 셋잇단음표 반주 위로 낮고 긴 선율이 움직여, 조용하지만 계속 긴장된 느낌을 만듭니다.',
  '35':'모차르트가 남긴 두 개의 단조 교향곡 가운데 하나입니다. 첫 주제는 작은 음량으로 급히 시작하지만 같은 리듬이 끊임없이 이어져, 노래하기 쉬운 선율 안에 불안과 추진력이 함께 느껴집니다.',
  '36':'오페라 《마술피리》에서 밤의 여왕이 분노를 터뜨리는 아리아입니다. 소프라노가 매우 높은 음역에서 빠르고 정교한 음표를 연속해서 노래하는 콜로라투라 기교 때문에 성악의 한계를 보여 주는 장면으로 유명합니다.',
  '37':'《카르멘》 전주곡은 투우장의 화려한 행진과 비극을 암시하는 음악을 짧게 압축합니다. 빠른 현악기와 심벌즈, 금관의 선명한 주제가 오페라 막이 오르기 전부터 강한 에너지를 만듭니다.',
  '38':'오늘날 ‘캉캉’으로 알려진 선율의 원래 제목은 오페레타 《천국과 지옥》의 〈지옥의 갤럽〉입니다. 빠른 2박자와 반복 선율 때문에 익살스럽고 정신없이 움직이는 장면에 자주 사용됩니다.',
  '39':'빈의 합창 협회를 위해 만든 곡이지만 오늘날에는 관현악 왈츠로 더 널리 알려졌습니다. 안개처럼 시작하는 도입 뒤에 유명한 도나우 주제가 나타나며, 여러 왈츠가 이어져 하나의 큰 춤 장면을 만듭니다.',
  '40':'바그너의 오페라 연작 《니벨룽의 반지》 중 발퀴레들이 전사들을 데리고 질주하는 장면의 음악입니다. 호른과 금관의 상승 동기가 반복되면서 거대한 무리가 다가오는 듯한 힘을 만듭니다.',
  '41':'그리그가 입센의 극 《페르 귄트》를 위해 만든 음악입니다. 플루트와 오보에가 같은 선율을 주고받고 관현악이 점차 밝아지면서, 해가 떠오르고 풍경이 깨어나는 모습을 소리로 그립니다.',
  '42':'트롤들에게 쫓기는 장면에서 한 가지 짧은 선율이 끈질기게 반복됩니다. 처음에는 낮고 조용하지만 악기 수·음량·속도가 계속 늘어나므로, 크레셴도와 가속을 한꺼번에 알아차리기 좋은 곡입니다.',
  '43':'셰익스피어의 극을 위한 부수음악 가운데 한 곡으로, 오늘날 서양식 결혼식의 퇴장 음악으로 널리 쓰입니다. 트럼펫 팡파르와 규칙적인 행진 리듬이 의식의 당당한 분위기를 만듭니다.',
  '44':'차이콥스키는 1812년 러시아가 나폴레옹의 침공을 물리친 사건을 기념해 이 서곡을 썼습니다. 피날레에는 교회 종과 대포 효과까지 표시되어 있어, 관현악이 만들 수 있는 가장 거대한 축제 음향을 들려줍니다.',
  '45':'오페라에서 왕자가 벌로 변해 날아가는 장면을 묘사한 곡입니다. 반음씩 빠르게 오르내리는 선율이 여러 악기로 옮겨 다니면서 벌의 윙윙거림과 민첩한 움직임을 표현합니다.',
  '46':'느리고 장중한 라산과 빠르고 격렬한 프리스카가 이어지는 헝가리풍 광시곡입니다. 피아노의 화려한 옥타브와 급격한 속도 변화가 만화의 연주 대결 장면에 자주 쓰이면서 더욱 익숙해졌습니다.',
  '47':'드뷔시의 《베르가마스크 모음곡》 가운데 가장 유명한 곡으로 제목은 프랑스 시에서 가져왔습니다. 기능화성의 방향을 또렷하게 밀기보다 부드러운 화음과 아르페지오의 잔향으로 달빛 같은 분위기를 만듭니다.',
  '48':'프로코피예프의 발레 《로미오와 줄리엣》에서 두 가문의 위압적인 모습을 나타내는 음악입니다. 낮은 현악기와 금관, 무거운 점음표 리듬이 반복되며 인물들의 권력과 긴장을 들려줍니다.',
  '49':'중세 라틴어 시를 바탕으로 만든 무대 칸타타 《카르미나 부라나》의 처음과 마지막 곡입니다. 짧은 리듬과 화음이 집요하게 반복되고 합창이 갑자기 커져, 운명 앞의 두려움과 폭발력을 직접적으로 전달합니다.',
  '50':'거슈윈은 미국 재즈의 리듬과 블루스 음정, 클래식 협주곡의 규모를 한 작품에 결합했습니다. 시작의 클라리넷 글리산도는 원래 리허설에서 연주자가 장난스럽게 과장한 소리를 작곡가가 마음에 들어 해 살린 것으로 전해집니다.'
};
const paired=(ko,foreign)=>`${ko} (${foreign})`;
const termMaps={
  period:{'바로크':paired('바로크','Baroque'),'고전':paired('고전','Classical'),'낭만':paired('낭만','Romantic'),'20세기':paired('20세기','20th Century')},
  form:{'협주곡':paired('협주곡','concerto'),'관현악 모음곡':paired('관현악 모음곡','orchestral suite'),'합주 협주곡':paired('합주 협주곡','concerto grosso'),'카논':paired('카논','canon'),'교향곡':paired('교향곡','symphony'),'세레나데':paired('세레나데','serenade'),'변주곡':paired('변주곡','variations'),'서곡':paired('서곡','overture'),'예술가곡':paired('예술가곡','Lied / art song'),'녹턴':paired('녹턴','nocturne'),'무곡':paired('무곡','dance'),'발레 음악':paired('발레 음악','ballet music'),'모음곡':paired('모음곡','suite'),'교향시':paired('교향시','symphonic poem'),'음악 동화':paired('음악 동화','musical tale'),'변주곡과 푸가':paired('변주곡과 푸가','variations and fugue'),'랩소디':paired('랩소디','rhapsody'),'관현악 환상곡':paired('관현악 환상곡','orchestral fantasia'),'교향적 환상곡':paired('교향적 환상곡','symphonic fantasia'),'영화 음악':paired('영화 음악','film music'),'오르간곡':paired('오르간곡','organ work'),'피아노 소품':paired('피아노 소품','piano piece'),'피아노 소나타':paired('피아노 소나타','piano sonata'),'오페라 아리아':paired('오페라 아리아','opera aria'),'오페라 전주곡':paired('오페라 전주곡','opera prelude'),'오페레타':paired('오페레타','operetta'),'왈츠':paired('왈츠','waltz'),'오페라 음악':paired('오페라 음악','opera music'),'극음악':paired('극음악','incidental music'),'축전 서곡':paired('축전 서곡','festival overture'),'칸타타':paired('칸타타','cantata')},
  tempo:{'매우 빠르게':paired('매우 빠르게','Presto'),'빠르게':paired('빠르게','Allegro'),'조금 빠르게':paired('조금 빠르게','Allegretto'),'보통 빠르게':paired('보통 빠르기로','Moderato'),'조금 느리게':paired('조금 느리게','Andante / Andantino'),'느리게':paired('느리게','Adagio'),'매우 느리게':paired('매우 느리게','Largo'),'장엄하게':paired('장엄하게','Maestoso'),'느리게 시작해 빨라짐':'느리게에서 빠르게 (Lento → Allegro)','빠르기의 변화가 큼':paired('빠르기를 유연하게','tempo rubato'),'빠르기 변화':paired('부분마다 빠르기 변화','changing tempo')},
  meter:{'4박자':paired('4박자','quadruple meter'),'3박자':paired('3박자','triple meter'),'2박자':paired('2박자','duple meter'),'6/4박자':paired('6/4박자','compound duple meter'),'6/8박자':paired('6/8박자','compound duple meter'),'9/8박자':paired('9/8박자','compound triple meter'),'12/8박자':paired('12/8박자','compound quadruple meter'),'자유로운 박자':paired('자유로운 박자','free meter'),'박자 변화':paired('부분마다 박자 변화','changing meter')},
  concept:{'표제 음악':paired('표제 음악','program music'),'선율':paired('선율','melody'),'합주 협주곡':paired('합주 협주곡','concerto grosso'),'모음곡':paired('모음곡','suite'),'돌림노래 원리':paired('돌림노래 원리','canon'),'동기':paired('동기','motif'),'주제':paired('주제','theme'),'소나타 형식':paired('소나타 형식','sonata form'),'변주':paired('변주','variation'),'셈여림':paired('셈여림','dynamics'),'협주':paired('협주','concerto'),'서곡':paired('서곡','overture'),'실내악':paired('실내악','chamber music'),'예술가곡':paired('예술가곡','Lied / art song'),'루바토':paired('루바토','rubato'),'아고기크':paired('아고기크','agogics'),'왈츠':paired('왈츠','waltz'),'무곡':paired('무곡','dance'),'발레 음악':paired('발레 음악','ballet music'),'음색':paired('음색','timbre'),'민족주의 음악':paired('민족주의 음악','musical nationalism'),'크레셴도':paired('크레셴도','crescendo'),'인상주의':paired('인상주의','Impressionism'),'관현악법':paired('관현악법','orchestration'),'라이트모티프':paired('라이트모티프','Leitmotiv'),'푸가':paired('푸가','fugue'),'글리산도':paired('글리산도','glissando'),'환상곡':paired('환상곡','fantasia'),'오스티나토':paired('오스티나토','ostinato'),'콜로라투라':paired('콜로라투라','coloratura'),'레가토':paired('레가토','legato'),'스타카토':paired('스타카토','staccato'),'합창':paired('합창','chorus'),'론도':paired('론도','rondo')}
};
const instrumentOriginal={'바이올린':'violin','현악 합주':'string ensemble','하프시코드':'harpsichord','금관악기':'brass instruments','관현악':'orchestra','합창과 관현악':'chorus & orchestra','피아노':'piano','트럼펫':'trumpet','피아노와 현악기':'piano & strings','피아노와 관현악':'piano & orchestra','성악과 피아노':'voice & piano','관현악과 하프':'orchestra & harp','오보에와 관현악':'oboe & orchestra','첼로와 두 대의 피아노':'cello & two pianos','피아노 네 손 원곡·관현악 편곡':'piano four hands original / orchestral arrangement','피아노 원곡·관현악 편곡':'piano original / orchestral arrangement','잉글리시 호른':'English horn','스네어드럼과 관현악':'snare drum & orchestra','플루트':'flute','관현악과 해설':'orchestra & narrator','오르간':'organ','소프라노와 관현악':'soprano & orchestra','플루트와 오보에':'flute & oboe','관현악과 종·대포':'orchestra, bells & cannon'};
pieces.forEach((p,i)=>{
  p.originalTitle=originalTitles[i];
  p.year=workYears[p.no];
  p.story=stories[p.no];
  p.titleAnswer=paired(p.title,p.originalTitle);
  p.composer=paired(p.composer,composerOriginal[p.composer]);
  ['period','form','tempo','meter','concept'].forEach(key=>{p[key]=termMaps[key][p[key]]||p[key]});
  p.lead=instrumentOriginal[p.lead]?paired(p.lead,instrumentOriginal[p.lead]):p.lead;
});

const levels=['핵심','핵심','핵심','핵심'];
const templates=[
  ['박자를 느끼며 들었을 때 가장 알맞은 것은 무엇일까요?','meter'],
  ['빠르기를 가장 알맞게 표현한 것은 무엇일까요?','tempo'],
  ['소리로 느껴지는 전체 분위기와 가장 가까운 것은 무엇일까요?','mood'],
  ['실제로 들리는 음악적 특징과 가장 가까운 것은 무엇일까요?','feature']
];
const pickWrong=(piece,key,seed)=>{
  const ranked=pieces.filter(other=>other!==piece&&other[key]!==piece[key]).sort((a,b)=>{
    const score=item=>(item.era===piece.era?4:0)+(item.form===piece.form?2:0)+(item.lead===piece.lead?1:0);
    return score(b)-score(a);
  });
  const pool=[...new Set(ranked.map(item=>item[key]))],start=seed%pool.length;
  return [...pool.slice(start),...pool.slice(0,start)].slice(0,2);
};
const shuffle=(arr)=>arr.map(v=>({v,r:Math.random()})).sort((a,b)=>a.r-b.r).map(x=>x.v);
const allQuestions=pieces.flatMap((p,pi)=>templates.map(([stem,key],ti)=>{
  const id=`${p.no}-${ti+1}`,answer=p[key],choices=shuffle([answer,...pickWrong(p,key,pi*11+ti)]);
  return {id,key,piece:p,level:levels[ti],stem,choices,correct:choices.indexOf(answer),answer,explain:`제시곡은 ${p.title} (${p.originalTitle}, ${p.year})입니다. ${answer}. ${p.note}`};
}));
window.CLASSICAL_DATA={pieces,allQuestions};
