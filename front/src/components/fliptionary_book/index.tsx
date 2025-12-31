import HTMLFlipBook from 'react-pageflip';

import type { DictionaryData } from '../../types/dictionary';
import { CoverPage } from '../pages/cover_page';
import { LetterPage } from '../pages/letter_page';
import { EndPage } from '../pages/end_page';

type PageFlipApi = {
  flip: (page_num: number, corner?: 'top' | 'bottom') => void;
};

export type FlipBookHandle = {
  pageFlip: () => PageFlipApi;
};

type FliptionaryBookProps = {
  book_ref: React.RefObject<FlipBookHandle | null>;
  dictionary: DictionaryData;
  letters: readonly string[];
  width: number;
  height: number;
  on_flip: (page_index: number) => void;
};

type FlipEvent = {
  data: number | string;
};

export function FliptionaryBook(props: FliptionaryBookProps): JSX.Element {
  const { book_ref, dictionary, letters, width, height, on_flip } = props;

  console.log(height);
  return (
    <HTMLFlipBook
      key={`${width}-${height}`}
      width={width}
      height={height}
      minWidth={300}
      minHeight={400}
      maxWidth={2000}
      showCover
      ref={book_ref}
      onFlip={(e: FlipEvent) => {
        const next_index = typeof e.data === 'number' ? e.data : Number(e.data);
        on_flip(Number.isFinite(next_index) ? next_index : 0);
      }}
      className="fliptionary__book"
    >
      <CoverPage
        title="Fliptionary"
        subtitle="A dictionary you can flip through"
      />

      {letters.map((letter) => (
        <LetterPage
          key={letter}
          letter={letter}
          entries={dictionary[letter] ?? []}
        />
      ))}

      <EndPage title="Thank you for flipping!" subtitle="~ Fliptionary" />
    </HTMLFlipBook>
  );
}
