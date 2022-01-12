import axios, { AxiosResponse } from "axios";
import { Result } from "./core/Result";

/** Search for contents */
export const search = async (q: string): Promise<Result> => {

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
    url.searchParams.set("q", q.replace(/[ ]/gm, "+"));

    /** Makes the request */
    const request: AxiosResponse<string> = await axios.get(url.toString());

    console.log(request.data)

    /** creates the result*/
    const result = new Result;

    /** Sends the raw html data to he result to parse */
    result.set(request.data);

    /** Returns the result */
    return result;
};

// TESTING - TO REMOVE BEFORE PUBLISH
search("What are the 4 possible phenotypes for human blood type? (Choose 4)")
    .then(result => {

        console.log(Array.from(result.descriptions))
        console.log(Array.from(result.questions))
        console.log(Array.from(result.links))
    })