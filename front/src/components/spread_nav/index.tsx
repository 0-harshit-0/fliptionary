import type { JSX } from "react";
import { get_spread_start_page } from "../../utils/pagination";

type SpreadNavProps = {
    spread_letters: readonly string[];
    current_page: number;
    on_go_to_spread: (spread_index: number) => void;
};

export function SpreadNav(props: SpreadNavProps): JSX.Element {
    const { spread_letters, current_page, on_go_to_spread } = props;

    return (
        <nav className="spread_nav" aria-label="Dictionary letter navigation">
            <ul className="spread_nav__list" id="spread_nav_list">
                {spread_letters.map((letter, idx) => {
                    const spread_start_page = get_spread_start_page(idx);
                    const is_active = current_page === spread_start_page;

                    return (
                        <li className="spread_nav__item" key={letter}>
                            <button
                                className={`spread_nav__button${is_active ? " spread_nav__button--active" : ""}`}
                                type="button"
                                onClick={() => on_go_to_spread(idx)}
                                aria-controls="fliptionary_book"
                                aria-current={is_active ? "page" : undefined}
                                aria-label={`Go to letter ${letter}`}
                            >
                                {letter}
                            </button>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
