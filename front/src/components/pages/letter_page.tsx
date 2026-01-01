import type { JSX } from "react";
import type { DictionaryEntry } from "../../types/dictionary";
import { to_snake_id } from "../../utils/id";

type LetterPageProps = {
    letter: string;
    entries: readonly DictionaryEntry[];
    ref?: React.Ref<HTMLElement>;
};

export function LetterPage(props: LetterPageProps): JSX.Element {
    const { letter, entries, ref } = props;

    const page_id = `letter_page_${to_snake_id(letter)}`;
    const title_id = `letter_title_${to_snake_id(letter)}`;

    return (
        <article className="flip_book__page" id={page_id} aria-labelledby={title_id} ref={ref}>
            <header className="flip_book__page_header">
                <h2 className="flip_book__page_title" id={title_id}>
                    Words that start with "{letter}"
                </h2>
            </header>

            <section className="flip_book__page_body">
                {entries.length === 0 ? (
                    <p className="flip_book__empty">No words available for this letter.</p>
                ) : (
                    <dl className="flip_book__definition_list">
                        {entries.map((entry) => (
                            <div className="flip_book__definition_item" key={entry.word}>
                                <dt className="flip_book__term">{entry.word}</dt>
                                <dd className="flip_book__definition">{entry.definition}</dd>
                            </div>
                        ))}
                    </dl>
                )}
            </section>
        </article>
    );
}
