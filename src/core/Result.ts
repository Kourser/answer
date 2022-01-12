export interface Link {
    title: string;
    href: string;
    text: string;
};

export interface Description {
    text: string;
};

export interface Question {
    text: string;
    answer: string;
}

export class Result {

    public readonly links: Set<Link> = new Set;
    public readonly descriptions: Set<Description> = new Set;
    public readonly questions: Set<Question> = new Set;

    private document: Document;

    /** Parses the html and gets the data */
    public set(data: string) {

        const parser = new DOMParser();

        this.document = parser.parseFromString(data, 'text/html');

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
        const elements = this.document.querySelectorAll('.g');

        for (let element of elements) {

            /** This element has the url */
            const a = element.querySelector(".yuRUbf > a");

            /** This element has the title */
            const title = element.querySelector(".yuRUbf > a > h3");

            /** This element has the description text */
            const text = element.querySelector(".IsZvec")

            this.links.add({
                title: title?.textContent,
                text: text?.textContent,
                href: a?.getAttribute("href")
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

    /**
     * Gets the header descriptions .
     * Its usually the first data and the most important.
     */
    private description() {

        /** Gets the descriptions elements */
        const elements = this.document.querySelectorAll('[data-attrid="wa:/description"]');

        for (let element of elements)
            this.descriptions.add({ text: element.textContent })
    }
}