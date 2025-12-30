import { type JSX } from "react";

type CoverPageProps = {
    title: string;
    subtitle: string;
    ref?: React.Ref<HTMLElement>;
};

export function CoverPage(props: CoverPageProps): JSX.Element {
    const { title, subtitle, ref } = props;

    return (
        <article className="flip_book__page flip_book__page--cover" ref={ref}>
            <header className="flip_book__page_header">
                <h1 className="flip_book__title">{title}</h1>
                <p className="flip_book__subtitle">{subtitle}</p>
            </header>
        </article>
    );
}
