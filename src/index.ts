import { Engine, GoogleResult, Result, ResultList, DuckduckgoResult } from "./core/Result";
import Similar from "string-similarity"

export const googleSearch = async (q: string) => {
    /** Creates the google url */
    const url = new URL("https://www.google.com");

    /** 
     * Adds the search pathname.
     * lets google know that we want to make a search.
     */
    url.pathname = "/search";

    /** 
     * Sets the query search param data 
     * Replaces spaces with "+".
     * Google's query format.
     * 
     */
    url.searchParams.set("q", q);

    /** Makes the request */
    const request: Response = await fetch(url.toString());

    /** Gets the rat text data from the request */
    const data = await request.text()

    /** creates the result*/
    const result = new GoogleResult;

    /** Sends the raw html data to the result to parse */
    result.set(data);

    /** Returns the result */
    return result;
}

export const duckduckgoSearch = async (q: string) => {

    /** Creates the duckduckgo url */
    const url = new URL("https://proxy-1.movie-web.workers.dev/");

    url.searchParams.set("destination", "https://html.duckduckgo.com/html/?q=" + q);

    /** Makes the request */
    const request: Response = await fetch(url.toString());

    /** Gets the rat text data from the request */
    const data = await request.text()

    /** creates the result*/
    const result = new DuckduckgoResult;

    /** Sends the raw html data to the result to parse */
    result.set(data);

    /** Returns the result */
    return result;
}


/** Search for contents */
export const search = async (q: string, engines: Engine[] = ["google", "duckduckgo"]): Promise<Result> => {

    const list = new ResultList;
    const array: Result[] = new Array;

    if (engines.includes("google")) {
        const search = await googleSearch(q);
        array.push(search)
    }

    if (engines.includes("duckduckgo")) {
        const search = await duckduckgoSearch(q);
        array.push(search)
    }

    list.set(array);

    console.log(list.descriptions.size)

    return list;
};

/** Gets the static answer from the result using a question */
export const solve = async (input: string, result: Result) => {

    let similarities: Array<{ answer: string, similarity: number }> = [];

    for (let { answer } of result.questions) {
        if (!answer) continue;

        if (answer.includes(".")) answer = answer?.split(".")[0]

        let similarity = Similar.compareTwoStrings(
            input,
            answer
        );

        similarities.push({ answer, similarity })
    };

    for (let { text } of result.links) {
        if (!text) continue;

        if (text.includes("—")) text = text.split("—")[1];
        if (text.includes(".")) text = text?.split(".")[0]

        let similarity = Similar.compareTwoStrings(
            input,
            text
        );

        similarities.push({ answer: text, similarity })
    };

    for (let { text } of result.descriptions) {
        if (!text) continue;

        let similarity = Similar.compareTwoStrings(
            input,
            text
        );

        similarities.push({ answer: text, similarity })
    };

    let match = similarities.reduce(function (prev, current) {
        return (prev.similarity > current.similarity) ? prev : current
    });

    if (!match && result.descriptions.size !== 0)
        return { answer: Array.from(result.descriptions)[0].bold[0], similarity: 0.1 }

    if (!match && result.links.size !== 0)
        return { answer: Array.from(result.links)[0].bold[0], similarity: 0.1 }

    return match;
}