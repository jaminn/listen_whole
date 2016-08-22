        var tag = document.createElement('script');
        tag.src = "http://www.youtube.com/iframe_api";
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
		var p = getParams();
        var srtF = ""; //전문(원문) 텍스트 파일
        var parsed_srt; //원문 파싱된
        var quiz_counter = 0; //카운터: 몇번째 시간대 인지
        var unshuffled; //셔플 안된 단어들
        var howMany_del = 0; //몇번이나 지웠나?
        var allRightBool = false; //전부 맞쳤을 경우
        var playByButton = false; //스타트 버튼으로 재생했는가
        var HowMany_wrongs = 0; //몇번이나 틀렸나?
        var wrongsCnt = 0;
        var time = 0;
        var wrongWord = "";
        var vidID; //비디오 아이디
        var SuffButton = ["apple", "banna", "orange", "kiwi"]; //화면에 표시되는값
        var srtLast = 0; //srt파싱된것의 마지막 번호
        var player;
		function getParams() {
    var param = new Array();
 
    var url = decodeURIComponent(location.href);
    url = decodeURIComponent(url);
 
    var params;
    params = url.substring( url.indexOf('?')+1, url.length );
    params = params.split("&");

    var size = params.length;
    var key, value;
    for(var i=0 ; i < size ; i++) {
        key = params[i].split("=")[0];
        value = params[i].split("=")[1];

        param[key] = value;
    }

    return param;
}
var p = getParams();
        function timecnt() {
          time++;
        }
        
        function onYouTubeIframeAPIReady() {
            player = new YT.Player('player', {
                playerVars: {
                    controls: 1,
                    rel: 0,
                    autohide: 0,
                    disablekb: 1
                },
                 events: {
                    'onReady': onPlayerReady,
                    'onStateChange': onPlayerStateChange
                }
            });
        }

        function onPlayerReady(event) {
            event.target.cueVideoById({
                videoId: p["vid"]
            , });
        }

        function onPlayerStateChange(event) {
            switch (event.data) {
            case YT.PlayerState.UNSTARTED:
                console.log('unstarted');
                break;
            case YT.PlayerState.ENDED:
                console.log('ended');
                break;
            case YT.PlayerState.PLAYING:
                if (!playByButton) {
                    player.stopVideo();
                    alert("start버튼으로 재생해주세요");
                }
                console.log('--playing--');
                my_timer = setInterval(check_where, 5);
                $("#buttonP").html(""); //버튼 초기화
                //$("#textP").html("");  //문장 초기화
                howMany_del = 0;
                HowMany_wrongs = 0;
                $("#hintP").html("<h1>" + "힌트" + "</h1>");
                $("#life").html("<h1>" + "틀린횟수" + "</h1>");
                break;
            case YT.PlayerState.PAUSED:
                clearInterval(my_timer);
                console.log('-paused-');
                break;
            case YT.PlayerState.BUFFERING: //중요
                clearInterval(my_timer);
                console.log('buffering');
                break;
            case YT.PlayerState.CUED:
                console.log('video cued');
                break;
            }
        }
        jQuery(document).ready(($) => {
            "use strict";
            $(window).load(() => {
                youtube_play_api(); //window가 로드되면 함수 실행
            });

            function youtube_play_api(e) {
                "use strict";
                $("#play").click(() => {
                    player.playVideo();
                });
                $("#pause").click(() => {
                    player.pauseVideo();
                    console.log("눌러서 (멈춤)");
                });
            }
        })

        function lets_start() {
            $.get("/sub/"+p["vid"]+".srt", (data) => {
                srtF = data;
                alert(srtF);
                parsed_srt = from_srt(srtF, true);
                srtLast = parsed_srt.length - 1;
                my_timer = setInterval(check_where, 5);
            });
            player.playVideo();
            $("#starter").remove();
            playByButton = true;
            document.getElementById('player').style.pointerEvents = 'none';
        }

        function selected_word(i) {
            return $("#buttonP").children().eq(i).children().eq(0).get(0);
        }
        $(document).keydown((e) => {
            switch (e.keyCode) {
            case 65: //A
                if (selected_word(0) !== undefined) {
                    my_dis(selected_word(0));
                }
                break;
            case 83: //S
                if (selected_word(1) !== undefined) {
                    my_dis(selected_word(1));
                }
                break;
            case 68: //D
                if (selected_word(2) !== undefined) {
                    my_dis(selected_word(2));
                }
                break;
            case 70: //F
                if (selected_word(3) !== undefined) {
                    my_dis(selected_word(3));
                }
                break;
            case 37:
                console.log("you pressed 37(<-) left key");
                if (quiz_counter !== 0) {
                    clearInterval(my_timer);
                    player.seekTo(getPastStart());
                    prvWhere();
                    player.playVideo();
                }
                break;
            case 39:
                console.log("you pressed 39(->) right key");
                if (quiz_counter < srtLast) {
                    clearInterval(my_timer);
                    player.seekTo(getFutureStart());
                    nxtWhere();
                    player.playVideo();
                }
                break;
            }
        });

        function replaces(words) {
            words = words.replace(/<i>/g, "");
            words = words.replace(/<\/i>/g, "");
            words = words.replace(/\n/g, " ");
            //words=words.replace(/-/g," ");
            words = words.replace(/ +/g, " ");
            words = words.replace(/^\s*/, '');
            words = words.replace(/\s*$/, '');
            return words;
        }

        function prvWhere() {
            quiz_counter--;
        }

        function nxtWhere() {
            quiz_counter++;
        }

        function getPast() {
            return quiz_counter > 0 ? parsed_srt[quiz_counter - 1].endTime / 1000 : 0;
        }

        function getPastStart() {
            return quiz_counter > 0 ? parsed_srt[quiz_counter - 1].startTime / 1000 : 0;
        }

        function getNow() {
            if (quiz_counter <= srtLast) {
                return parsed_srt[quiz_counter].endTime / 1000;
            }
            else {
                return player.durationMs - 1000;
            }
        }

        function getNowStart() {
            if (quiz_counter <= srtLast) {
                return parsed_srt[quiz_counter].startTime / 1000;
            }
            else {
                return player.durationMs - 1000;
            }
        }

        function getFuture() {
            if (quiz_counter < srtLast) {
                return parsed_srt[quiz_counter + 1].endTime / 1000;
            }
            else {
                return player.durationMs - 1000;
            }
        }

        function getFutureStart() {
            if (quiz_counter < srtLast) {
                return parsed_srt[quiz_counter + 1].startTime / 1000;
            }
            else {
                return player.durationMs - 1000;
            }
        }

        function check_where() {
            var How_video_pasted = player.getCurrentTime().toFixed(2);
            if (!allRightBool) {
                if (getPast() > How_video_pasted) { //진행시간이 과거 보다 작으면
                    if (quiz_counter > 0) {
                        console.log(quiz_counter + ": ViewPrv");
                        prvWhere(); //카운터를 줄인다.
                    }
                }
                if (getFuture() < How_video_pasted) { //진행시간이 미래 보다 크면
                    if (quiz_counter < srtLast) {
                        console.log(quiz_counter + ": ViewNxt");
                        nxtWhere(); //카운터를 늘린다.
                    }
                }
                else {
                    if (getNow() <= How_video_pasted) { //진행시간이 미래 보다 작고, 현재보다 크면
                        $("#buttonP").html("");
                        console.log("진행 현재보다 큼(멈춤)");
                        player.pauseVideo();
                        unshuffled = parsed_srt[quiz_counter].text;
                        unshuffled = replaces(unshuffled);
                        unshuffled = unshuffled.split(" ");
                        [0, 1, 2, 3].forEach((i) => {
                            if (i < unshuffled.length) SuffButton[i] = unshuffled[i % unshuffled.length];
                        });
                        SuffButton = shuffle(SuffButton);
                        [0, 1, 2, 3].forEach((my_x) => {
                            $("#buttonP").append('<div class="text-center" style="float:left;"><button class="btn btn-primary btn-lg center-block" style="color:#000;font-size:20px;position: relative; display: block;vertical-align: middle; height:70px;width:120px; margin:10px 20px;" onclick="my_dis(this)">' + SuffButton[my_x] + "</button></div>");
                        });
                        $("#ad").html("");
                        nxtWhere();
                        console.log(quiz_counter + ": 새 버튼 생성");
                    }
                }
            }
            else if (getPast() <= How_video_pasted) {
                allRightBool = false;
                if (getPastStart() <= How_video_pasted) { //진행시간이 미래 보다 작고, 현재보다 크면
                    $("#ad").html(""); // 자막 지우기
                }
            }
        }

        function replay() {
            prvWhere();
            console.log(quiz_counter + ":replay가 불려짐");
            player.seekTo(getNowStart());
            player.playVideo();
            HowMany_wrongs = 0;
        }

        function my_dis(my) {
            if (unshuffled[howMany_del] == my.innerHTML) { //정답일 경우
                $("#buttonP").html("");
                $("#hintP").html("");
                [0, 1, 2, 3].forEach((i) => {
                    if (i < unshuffled.length) SuffButton[i] = unshuffled[(i + howMany_del) % unshuffled.length];
                });
                SuffButton = shuffle(SuffButton);
                [0, 1, 2, 3].forEach((my_x) => {
                    $("#buttonP").append('<div class="text-center" style="float:left;"><button class="btn btn-primary btn-lg" style="color:#000;font-size:20px;position: relative; display: block;vertical-align: middle; height:70px;width:120px; margin:10px 20px;" onclick="my_dis(this)">' + SuffButton[my_x] + "</button> </div>");
                });
                //$("#textP").append(unshuffled[howMany_del]);
                $("#ad").append(unshuffled[howMany_del] + " ");
                howMany_del++;
                if (unshuffled.length == howMany_del) { //전부 맞첬을 경우
                    player.seekTo(getPastStart());
                    player.playVideo();
                    allRightBool = true;
                    howMany_del = 0;
                }
            }
            else { //틀릴 경우
                HowMany_wrongs++;
                wrongsCnt++;
                wrongWord += my.innerHTML + ",";
                if (HowMany_wrongs == 3) { //3번 틀리면 다시 시작.
                    console.log("3번 틀려서 replay를 부름");
                    replay();
                }
                else {
                    [0, 1, 2, 3].forEach((i) => {
                        if (unshuffled[howMany_del] == selected_word(i).innerHTML) {
                            selected_word(i).style.color = "#ffff00";
                        }
                    });
                    $("#hintP").html("<h1>" + unshuffled[howMany_del] + "</h1>");
                }
            }
        }
