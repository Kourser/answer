import { search, solve as solveResult } from ".";

const timeout = (time: number): Promise<void> =>
    new Promise(resolve => setTimeout(() => resolve(), time));


unsafeWindow.document.body.append(Object.assign(document.createElement("style"), {
    innerText: `
    /* width */
    logger-object::-webkit-scrollbar {
      width: 10px;
    }
    
    /* Track */
    logger-object::-webkit-scrollbar-track {
      background: #f1f1f1; 
    }
     
    /* Handle */
    logger-object::-webkit-scrollbar-thumb {
      background: #888; 
    }
    
    /* Handle on hover */
    logger-object::-webkit-scrollbar-thumb:hover {
      background: #555; 
    }

    logger-object {
        opacity: 0.5;
        transition:opacity 0.1s;
        cursor: move;
        user-select:none;
        box-shadow: -2px 3px 14px 1px #00000085;
    }

    logger-object:hover {
        opacity: 1;
    }
    
    `
}))

const logger = document.createElement("logger-object");

Object.assign(logger.style, {
    position: 'absolute',
    top: '0',
    //right: '0',
    width: '400px',
    height: '50%',
    background: 'rgb(30 30 30)',
    padding: '20px',
    paddingRight: "0px",
    paddingLeft: "0px",
    color: 'white',
    overflow: 'auto',
    margin: '20px',
    gap: '10px',
    display: 'flex',
    flexDirection: 'column'
})

if (unsafeWindow.document.body) unsafeWindow.document.body.append(logger);

interface EdpuzzleQuestion {
    absoluteTime: number;
    body: Array<{
        text: string;
        html: string;
    }>
    choices: Array<{
        body: Array<{
            text: string;
            html: string;
        }>
        choiceNumber: number
        isCorrect: boolean
    }>
};

declare var unsafeWindow: typeof globalThis

var active = false;
var currentX;
var currentY;
var initialX;
var initialY;
var xOffset = 0;
var yOffset = 0;

unsafeWindow.document.addEventListener("touchstart", dragStart, false);
unsafeWindow.document.addEventListener("touchend", dragEnd, false);
unsafeWindow.document.addEventListener("touchmove", drag, false);

unsafeWindow.document.addEventListener("mousedown", dragStart, false);
unsafeWindow.document.addEventListener("mouseup", dragEnd, false);
unsafeWindow.document.addEventListener("mousemove", drag, false);

function dragStart(e) {
    if (e.type === "touchstart") {
        initialX = e.touches[0].clientX - xOffset;
        initialY = e.touches[0].clientY - yOffset;
    } else {
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;
    }

    if (e.path.includes(logger)) {
        active = true;
    }
}

function dragEnd(e) {
    initialX = currentX;
    initialY = currentY;

    active = false;
}

function drag(e) {
    if (active) {

        e.preventDefault();

        if (e.type === "touchmove") {
            currentX = e.touches[0].clientX - initialX;
            currentY = e.touches[0].clientY - initialY;
        } else {
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
        }

        xOffset = currentX;
        yOffset = currentY;

        setTranslate(currentX, currentY, logger);
    }
}

function setTranslate(xPos, yPos, el) {
    el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
}

const formatBody = (data: Array<{
    text: string;
    html: string;
}>) => {

    /** Gets the first body */
    const body = data[0];

    if (body.text.length > 0) return body.text;

    const div = document.createElement("div");
    div.innerHTML = body.html;

    return div.textContent;
}


const solve = async (questions: EdpuzzleQuestion[]) => {

    for (let question of questions) {

        const query = formatBody(question.body);
        const result = await search(query);

        let similarities: Array<{ answer: string, similarity: number }> = [];

        for (let choice of question.choices) {
            const body = formatBody(choice.body);
            const answer = await solveResult(body, result);

            if (answer == null) continue;

            similarities.push(answer)
        }

        let match = similarities.length !== 0 ? similarities.reduce(function (prev, current) {
            return (prev.similarity > current.similarity) ? prev : current
        }) : null;

        if (match !== null) {
            const group = document.createElement("question-group");
            const questionElement = document.createElement("question-object");
            const answerElement = document.createElement("answer-object");

            Object.assign(answerElement.style, { color: "#5fedffdb" })
            Object.assign(group.style, {
                color: 'white',
                fontSize: '12px',
                display: 'flex',
                flexDirection: 'column',
                padding: "5px",
                paddingRight: '20px',
                paddingLeft: '20px',
                background: "#282828"
            })

            questionElement.innerText = query;
            answerElement.innerText = match.answer.replace(/\n/gm, " ").trim();

            group.append(questionElement, answerElement);
            logger.append(group)
        }

        /** waits one second so its not a spam. */
        await timeout(1000);
    }
}

/** The original json parser function */
const parse = JSON.parse;

/**
 * This will get all data being parsed
 * It will get the answers from the data. if given
 */
unsafeWindow.JSON.parse = (text: string, reviver?: (this: any, key: string, value: any) => any): any => {

    /** Parses the string data given. */
    const json = parse(text, reviver);

    if ("medias" in json && typeof json["medias"][0] !== "undefined") {

        const { questions } = json["medias"][0];
        solve(questions)
    };

    return json;
}