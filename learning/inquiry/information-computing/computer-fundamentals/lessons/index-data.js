(() => {
    "use strict";
    // 차시 목록과 앞뒤 이동에만 쓰는 가벼운 차례표. 내용은 열어 본 차시 것만 따로 받는다.
    window.COMPUTER_CORE_MODULES = [
        ["A", "컴퓨터의 기본 원리", "Computer Principles"],
        ["B", "하드웨어와 기기", "Hardware and Devices"],
        ["C", "운영체제와 앱", "Operating Systems and Apps"],
        ["D", "포인터·터치·키보드", "Pointer, Touch, and Keyboard"],
        ["E", "파일과 저장 공간", "Files and Storage"],
        ["F", "화면과 디지털 미디어", "Displays and Digital Media"],
        ["G", "0과 1·데이터 크기", "Binary and Data Size"],
        ["H", "네트워크와 웹", "Networks and the Web"],
        ["I", "계정·보안·디지털 시민성", "Accounts, Security, and Digital Citizenship"],
        ["J", "알고리즘과 코딩 논리", "Algorithms and Coding Logic"]
    ].map(([code, title, english]) => ({ code, title, english }));

    window.COMPUTER_LESSON_INDEX = [
        {
            "id": "a01",
            "code": "A01",
            "number": 1,
            "domain": "컴퓨터의 기본 원리",
            "title": "컴퓨터의 역할",
            "english": "Functions of a Computer"
        },
        {
            "id": "a02",
            "code": "A02",
            "number": 2,
            "domain": "",
            "title": "하드웨어와 소프트웨어",
            "english": "Hardware and Software"
        },
        {
            "id": "a03",
            "code": "A03",
            "number": 3,
            "domain": "",
            "title": "기기·운영체제·앱",
            "english": "Device, Operating System, and App"
        },
        {
            "id": "a04",
            "code": "A04",
            "number": 4,
            "domain": "",
            "title": "아날로그와 디지털",
            "english": "Analog and Digital"
        },
        {
            "id": "a05",
            "code": "A05",
            "number": 5,
            "domain": "",
            "title": "소리의 디지털 변환",
            "english": "Sound Digitization"
        },
        {
            "id": "b01",
            "code": "B01",
            "number": 6,
            "domain": "컴퓨터 안의 하드웨어",
            "title": "컴퓨터의 내부 부품",
            "english": "Computer Components"
        },
        {
            "id": "b02",
            "code": "B02",
            "number": 7,
            "domain": "하드웨어와 기기",
            "title": "스마트폰과 태블릿의 구조",
            "english": "Inside Smartphones and Tablets"
        },
        {
            "id": "b03",
            "code": "B03",
            "number": 8,
            "domain": "하드웨어와 기기",
            "title": "주변 기기와 연결",
            "english": "Peripheral Devices and Connections"
        },
        {
            "id": "c01",
            "code": "C01",
            "number": 9,
            "domain": "운영체제와 앱",
            "title": "앱과 하드웨어의 연결",
            "english": "Apps and Hardware"
        },
        {
            "id": "c02",
            "code": "C02",
            "number": 10,
            "domain": "운영체제와 앱",
            "title": "운영체제의 종류",
            "english": "Types of Operating Systems"
        },
        {
            "id": "c03",
            "code": "C03",
            "number": 11,
            "domain": "운영체제와 앱",
            "title": "프로그램의 실행과 창",
            "english": "Programs, Processes, and Windows"
        },
        {
            "id": "c04",
            "code": "C04",
            "number": 12,
            "domain": "운영체제와 앱",
            "title": "설정과 기기 관리",
            "english": "Settings and Device Management"
        },
        {
            "id": "d01",
            "code": "D01",
            "number": 13,
            "domain": "포인터·터치·키보드",
            "title": "포인터와 커서",
            "english": "Pointers and Cursors"
        },
        {
            "id": "d02",
            "code": "D02",
            "number": 14,
            "domain": "포인터·터치·키보드",
            "title": "터치 조작",
            "english": "Touch Gestures"
        },
        {
            "id": "d03",
            "code": "D03",
            "number": 15,
            "domain": "포인터·터치·키보드",
            "title": "키보드·단축키·클립보드",
            "english": "Keyboard, Shortcuts, and Clipboard"
        },
        {
            "id": "e01",
            "code": "E01",
            "number": 16,
            "domain": "파일과 저장 공간",
            "title": "파일·폴더·경로",
            "english": "Files, Folders, and Paths"
        },
        {
            "id": "e02",
            "code": "E02",
            "number": 17,
            "domain": "파일과 저장 공간",
            "title": "파일 이름과 형식",
            "english": "File Names and Formats"
        },
        {
            "id": "e03",
            "code": "E03",
            "number": 18,
            "domain": "파일과 저장 공간",
            "title": "파일 저장과 정리",
            "english": "Saving and Organizing Files"
        },
        {
            "id": "e04",
            "code": "E04",
            "number": 19,
            "domain": "파일과 저장 공간",
            "title": "아이콘·바로가기·북마크",
            "english": "Icons, Shortcuts, and Bookmarks"
        },
        {
            "id": "e05",
            "code": "E05",
            "number": 20,
            "domain": "파일과 저장 공간",
            "title": "저장·동기화·백업",
            "english": "Storage, Sync, and Backup"
        },
        {
            "id": "f01",
            "code": "F01",
            "number": 21,
            "domain": "화면과 디지털 미디어",
            "title": "픽셀·해상도·화면 크기",
            "english": "Pixels, Resolution, and Screen Size"
        },
        {
            "id": "f02",
            "code": "F02",
            "number": 22,
            "domain": "화면과 디지털 미디어",
            "title": "디지털 그림과 색",
            "english": "Digital Images and Color"
        },
        {
            "id": "f03",
            "code": "F03",
            "number": 23,
            "domain": "화면과 디지털 미디어",
            "title": "소리·영상·화면 기록",
            "english": "Sound, Video, and Screen Capture"
        },
        {
            "id": "g01",
            "code": "G01",
            "number": 24,
            "domain": "0과 1·데이터 크기",
            "title": "0과 1의 이진 표현",
            "english": "Binary Representation"
        },
        {
            "id": "g02",
            "code": "G02",
            "number": 25,
            "domain": "0과 1·데이터 크기",
            "title": "비트·바이트·데이터 크기",
            "english": "Bits, Bytes, and Data Size"
        },
        {
            "id": "g03",
            "code": "G03",
            "number": 26,
            "domain": "0과 1·데이터 크기",
            "title": "인코딩·압축·전송",
            "english": "Encoding, Compression, and Transfer"
        },
        {
            "id": "h01",
            "code": "H01",
            "number": 27,
            "domain": "네트워크와 웹",
            "title": "네트워크와 인터넷",
            "english": "Networks and the Internet"
        },
        {
            "id": "h02",
            "code": "H02",
            "number": 28,
            "domain": "네트워크와 웹",
            "title": "웹 주소와 서버 요청",
            "english": "Web Addresses and Server Requests"
        },
        {
            "id": "h03",
            "code": "H03",
            "number": 29,
            "domain": "네트워크와 웹",
            "title": "브라우저와 검색",
            "english": "Browsers and Search"
        },
        {
            "id": "h04",
            "code": "H04",
            "number": 30,
            "domain": "네트워크와 웹",
            "title": "온라인 문제의 제출과 채점",
            "english": "Online Answer Submission and Scoring"
        },
        {
            "id": "h05",
            "code": "H05",
            "number": 31,
            "domain": "네트워크와 웹",
            "title": "데이터 전송과 웹사이트 공개",
            "english": "Data Transfer and Website Publishing"
        },
        {
            "id": "i01",
            "code": "I01",
            "number": 32,
            "domain": "계정·보안·디지털 시민성",
            "title": "계정·인증·권한",
            "english": "Accounts, Authentication, and Permissions"
        },
        {
            "id": "i02",
            "code": "I02",
            "number": 33,
            "domain": "계정·보안·디지털 시민성",
            "title": "온라인 안전과 디지털 시민성",
            "english": "Online Safety and Digital Citizenship"
        },
        {
            "id": "j01",
            "code": "J01",
            "number": 34,
            "domain": "알고리즘과 코딩 논리",
            "title": "문제 분해와 알고리즘",
            "english": "Decomposition and Algorithms"
        },
        {
            "id": "j02",
            "code": "J02",
            "number": 35,
            "domain": "알고리즘과 코딩 논리",
            "title": "이벤트·조건·반복",
            "english": "Events, Conditions, and Loops"
        },
        {
            "id": "j03",
            "code": "J03",
            "number": 36,
            "domain": "알고리즘과 코딩 논리",
            "title": "프로그램 오류와 디버깅",
            "english": "Program Errors and Debugging"
        }
    ];
})();
