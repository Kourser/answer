export interface Link {
    title: string;
    href: string;
    text: string;
    bold: string[]
};

export interface Description {
    text: string;
    bold: string[];
};

export interface Question {
    text: string;
    answer: string;
};

export type Engine = "google" | "duckduckgo";

export class Result {

    public readonly links: Set<Link> = new Set;
    public readonly questions: Set<Question> = new Set;

    public readonly descriptions: Set<Description> = new Set;

    public document: Document;
}

export class ResultList extends Result {

    document = null;

    constructor(results: Result[] = []) {

        super();

        this.set(results)
    }

    set(results: Result[]) {
        results.forEach(result => {
            result.questions.forEach(q => this.questions.add(q))
            result.descriptions.forEach(q => this.descriptions.add(q))
            result.links.forEach(q => this.links.add(q))
        })
    }
}

export class DuckduckgoResult extends Result {

    /** Parses the html and gets the data */
    public set(data: string) {

        const parser = new DOMParser();

        this.document = parser.parseFromString(data, 'text/html');

        Object.assign(self, { doc: this.document })

        this.link()
    }

    link() {

        const elements = this.document.querySelectorAll("#links > .result");

        for (let element of elements) {

            /** This element has the url */
            const a = element.querySelector(".result__title a");

            /** This element has the title */
            const title = element.querySelector(".result__title");

            /** This element has the description text */
            const text = element.querySelector(".result__snippet");

            /** All the bolded parts of the text */
            const bold: Element[] = [];

            /** the bolded elements */
            text?.querySelectorAll("b").forEach(em => bold.push(em))

            this.links.add({
                title: title?.textContent,
                text: text?.textContent,
                href: a?.getAttribute("href"),
                bold: bold.map(e => e.textContent)
            })
        }
    }
}

export class GoogleResult extends Result {

    /** Parses the html and gets the data */
    public set(data: string) {

        const parser = new DOMParser();

        this.document = parser.parseFromString(data, 'text/html');

        //@ts-ignore
        Object.assign(unsafeWindow, { doc: this.document })

        this.description();
        this.question();
        this.link()
    }

    /** 
     * Gets all the link elements from the html.
     * The title.
     * The url.
     * The description.
     */
    private link() {

        /** Gets the link's container */
        const elements = this.document.querySelectorAll('.g, .ZINbbc, .xpd, .O9g5cc, .uUPGi');

        for (let element of elements) {

            /** This element has the url */
            const a = element.querySelector(".yuRUbf > a");

            /** This element has the title */
            const title = element.querySelector(".yuRUbf > a > h3, .zBAuLc, .l97dzf");

            /** This element has the description text */
            const text = element.querySelector(".IsZvec, .BNeawe, .s3v9rd, .AP7Wnd");

            /** All the bolded parts of the text */
            const bold: Element[] = [];

            /** the bolded elements */
            text?.querySelectorAll("em").forEach(em => bold.push(em))

            this.links.add({
                title: title?.textContent,
                text: text?.textContent,
                href: a?.getAttribute("href"),
                bold: bold.map(e => e.textContent)
            })
        }

    }

    /**
     * Gets all the questions and answers from the document
     */
    private question() {

        /** Gets the q&a containers */
        const elements = this.document.querySelectorAll('.BmkBMc');

        for (let element of elements) {

            /** This element has the question title */
            const text = element.querySelector("g-inner-card .RqlTSb");

            /** This element has the answer text */
            const answer = element.querySelector("g-inner-card .YQhxq");

            this.questions.add({
                text: text?.textContent,
                answer: answer?.textContent
            })
        }
    }

    private description() {

        /** Gets the descriptions elements */
        const elements = this.document.querySelectorAll('.hgKElc, .ILfuVd, .LGOjhe, .wDYxhc, .atOwb, .UMOHqf, .BNeawe, .s3v9rd, .AP7Wnd')

        for (let element of elements) {
            const bold = element.querySelectorAll("b, .atOwb, .UMOHqf");
            this.descriptions.add({
                text: element?.textContent,
                bold: Array.from(bold).map(e => e.textContent)
            })
        }

    }
}