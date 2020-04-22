const SEQUENCE_LENGTH = 40;
const GENERATE_LENGTH = 200;
var model;
var currently_generating = false;
const displayElement = document.querySelector("#generated-text");

document.addEventListener("DOMContentLoaded", function() {
    displayElement.innerHTML = "Loading...";
    tf.loadLayersModel("../assets/modeluint8/model.json").then(function(_model) {
        model = _model;
        generateSpeech();
    });
});


function generateSpeech() {
    displayElement.innerHTML = "Generating speech...";

    if (window.currently_generating) {
        return;
    }
    window.currently_generating = true;

    var input = [6495,5187,5008,1005,24,1676,6493,17,6495,6876,4427,4420,24,1894,6055,24,1976,6493,5845,21,5073,2992,4420,5588,4098,4281,6495,7004,3259,6955,2016,5372,6929,4420,3334,2171,2030,6472,4441,24];
    var text = [];

    var generate = function(i) {
        var prediction = model.predict(
            tf.tensor2d(input, [1, SEQUENCE_LENGTH])
        ).dataSync();

        var wordIndex = randomChoice(prediction);

        if (words[wordIndex].length > 1 || words[wordIndex].match("[A-Za-z\$0-9]")) {
            text.push(" ");
        }
        text.push(words[wordIndex]);
        displayElement.innerHTML = text.join("");

        input.push(wordIndex);
        input.shift();

        if (i > GENERATE_LENGTH) {
            window.currently_generating = false;
            return;
        }
        setTimeout(function() {
            generate(i+1);
        }, 1);
    }

    generate(0);
}

function randomChoice(p) {
    var sum = p.reduce(function(a, b) {
        return a + b;
    }) * Math.random();
    return p.findIndex(function(a) {
        return (sum -= a) < 0;
    });
}