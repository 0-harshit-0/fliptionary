import type { JSX } from "react";

type EndPageProps = {
    title: string;
    subtitle: string;
    ref?: React.Ref<HTMLElement>;
};

export function EndPage(props: EndPageProps): JSX.Element {
    const { title, subtitle, ref } = props;

    return (
        <article className="flip_book__page flip_book__page--end" ref={ref}>
            <header className="flip_book__page_header">
                <h2 className="flip_book__page_title">{title}</h2>
                <p className="flip_book__subtitle">{subtitle}</p>
            </header>
        </article>
    );
}
