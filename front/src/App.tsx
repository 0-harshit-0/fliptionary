import {
  useCallback,
  useMemo,
  useRef,
  useEffect,
  useState,
  type JSX,
} from 'react';
import './App.css';

import dictionary_json from './data/mock.json';
import type { DictionaryData } from './types/dictionary';

import {
  FliptionaryBook,
  type FlipBookHandle,
} from './components/fliptionary_book';
import { SpreadNav } from './components/spread_nav';
import { get_spread_letters, get_spread_start_page } from './utils/pagination';

const dictionary = dictionary_json as DictionaryData;

export default function App(): JSX.Element {
  const book_ref = useRef<FlipBookHandle | null>(null);
  const [current_page, set_current_page] = useState<number>(0);
  const [book_height, set_book_height] = useState(window.innerHeight - 120);

  useEffect(() => {
    function handle_resize() {
      set_book_height(window.innerHeight - 120);
    }

    window.addEventListener('resize', handle_resize);
    return () => window.removeEventListener('resize', handle_resize);
  }, []);

  const letters = useMemo(() => Object.keys(dictionary).sort(), []);
  const spread_letters = useMemo(() => get_spread_letters(letters), [letters]);

  const go_to_spread = useCallback((spread_index: number) => {
    const target_page = get_spread_start_page(spread_index);
    const api = book_ref.current?.pageFlip();
    if (!api) return;

    api.flip(target_page, 'bottom');
    set_current_page(target_page);
  }, []);

  return (
    <main className="fliptionary" id="fliptionary_app">
      <section className="fliptionary__stage" aria-label="Flip book stage">
        <FliptionaryBook
          book_ref={book_ref}
          dictionary={dictionary}
          letters={letters}
          width={400}
          height={book_height}
          on_flip={set_current_page}
        />
      </section>

      <SpreadNav
        spread_letters={spread_letters}
        current_page={current_page}
        on_go_to_spread={go_to_spread}
      />
    </main>
  );
}
