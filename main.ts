import "./assets/style.css";

declare global {
    interface Window {
        webkitSpeechRecognition: any;
        webkitSpeechGrammarList: any;
        webkitSpeechRecognitionEvent: any;
    }
}

interface IWindow extends Window {
    webkitSpeechRecognition: any;
    webkitSpeechGrammarList: any;
    webkitSpeechRecognitionEvent: any;
}

const {
    webkitSpeechRecognition,
    webkitSpeechGrammarList,
    webkitSpeechRecognitionEvent,
}: IWindow = window;

var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
var SpeechRecognitionEvent =
    SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

const phrases = [
    "Đây có phải là trường của anh không",
    "anh yêu em",
    "bật chế độ bay",
    "em ăn cơm chưa",
    "chào em",
    "xin chào",
];

const phrasePara = document.querySelector(".phrase");
const resultPara = document.querySelector(".result") as HTMLParagraphElement;
const diagnosticPara = document.querySelector(".output");

const testBtn = document.querySelector("button");

function randomPhrase() {
    const number = Math.floor(Math.random() * phrases.length);
    return number;
}

function testSpeech() {
    testBtn.disabled = true;
    testBtn.textContent = "🧏🏼 Loading... 🧏🏼‍♂️";

    const phrase = phrases[randomPhrase()].toLowerCase();

    phrasePara.textContent = phrase;
    resultPara.textContent = "ĐÚNG hay SAI ?";
    resultPara.style.background = "rgba(0,0,0,0.2)";
    diagnosticPara.textContent = "...❤️❤️❤️..";

    const grammar =
        "#JSGF V1.0; grammar phrase; public <phrase> = " + phrase + ";";
    const recognition = new SpeechRecognition();
    const speechRecognitionList = new SpeechGrammarList();
    /**
     * @see https://developer.mozilla.org/en-US/docs/Web/API/SpeechGrammarList/addFromString
     * @see https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition/interimResults
     * @see https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition/maxAlternatives
     */
    speechRecognitionList.addFromString(grammar, 1);
    recognition.grammars = speechRecognitionList;
    // vietnamese lang code
    recognition.lang = "vi";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();

    recognition.onresult = function (event) {
        const speechResult = event.results[0][0].transcript.toLowerCase();
        diagnosticPara.textContent =
            "Câu trả lời nhận được: " + speechResult + ".";
        if (speechResult === phrase) {
            resultPara.textContent = "ĐÚNG 😘!";
            resultPara.style.background = "LimeGreen";
        } else {
            resultPara.textContent = "SAI 😭!";
            resultPara.style.background = "Crimson";
        }

        console.log("Confidence: " + event.results[0][0].confidence);
    };

    recognition.onspeechend = function () {
        recognition.stop();
        testBtn.disabled = false;
        testBtn.textContent = "Bắt đầu kiểm tra";
    };

    recognition.onerror = function (event) {
        testBtn.disabled = false;
        testBtn.textContent = "Bắt đầu kiểm tra";
        diagnosticPara.textContent =
            "Error occurred in recognition: " + event.error;
    };

    recognition.onaudiostart = function (event) {
        //Fired when the user agent has started to capture audio.
        console.log("SpeechRecognition.onaudiostart");
    };

    recognition.onaudioend = function (event) {
        //Fired when the user agent has finished capturing audio.
        console.log("SpeechRecognition.onaudioend");
    };

    recognition.onend = function (event) {
        //Fired when the speech recognition service has disconnected.
        console.log("SpeechRecognition.onend");
    };

    recognition.onnomatch = function (event) {
        //Fired when the speech recognition service returns a final result with no significant recognition. This may involve some degree of recognition, which doesn't meet or exceed the confidence threshold.
        console.log("SpeechRecognition.onnomatch");
    };

    recognition.onsoundstart = function (event) {
        //Fired when any sound — recognisable speech or not — has been detected.
        console.log("SpeechRecognition.onsoundstart");
    };

    recognition.onsoundend = function (event) {
        //Fired when any sound — recognisable speech or not — has stopped being detected.
        console.log("SpeechRecognition.onsoundend");
    };

    recognition.onspeechstart = function (event) {
        //Fired when sound that is recognised by the speech recognition service as speech has been detected.
        console.log("SpeechRecognition.onspeechstart");
    };
    recognition.onstart = function (event) {
        //Fired when the speech recognition service has begun listening to incoming audio with intent to recognize grammars associated with the current SpeechRecognition.
        console.log("SpeechRecognition.onstart");
    };
}

testBtn.addEventListener("click", testSpeech);
