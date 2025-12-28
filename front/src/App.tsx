import { useRef, useState } from 'react';
import HTMLFlipBook from 'react-pageflip';
import './App.css';
import dictionary from './mocktionary.json';

const letters = Object.keys(dictionary);

function App() {
  const book = useRef<any>();
  const [currentPage, setCurrentPage] = useState(0);

  // Only show buttons for even pages (spreads)
  const spreadButtons = [];
  for (let i = 0; i < letters.length; i += 2) {
    spreadButtons.push(letters[i]);
  }

  // Go to the spread (cover is 0, first dictionary page is 1)
  const goToSpread = (spreadIdx: number) => {
    // Each spread starts at page 1 + spreadIdx * 2
    const page = 1 + spreadIdx * 2;
    book.current?.pageFlip().flip(page);
    setCurrentPage(page);
  };

  return (
    <div className="container">
      <HTMLFlipBook
        width={400}
        height={600}
        showCover={true}
        ref={book}
        onFlip={(e: any) => setCurrentPage(e.data)}
      >
        <div className="demoPage">
          <h1>Fliptionary</h1>
          <p>A Dictionary You Can Flip Through</p>
        </div>
        {letters.map((letter) => (
          <div className="demoPage" key={letter}>
            <h2>Words that start with '{letter}'</h2>
            <ul>
              {dictionary[letter].map((entry: any) => (
                <li key={entry.word}>
                  <strong>{entry.word}:</strong> {entry.definition}
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div className="demoPage">
          <h1>Thank You for Flipping!</h1>
          <p>~ Fliptionary</p>
        </div>
      </HTMLFlipBook>

      <div className="controls">
        {spreadButtons.map((letter, idx) => (
          <button
            key={letter}
            onClick={() => goToSpread(idx)}
            style={{
              fontWeight: currentPage === 1 + idx * 2 ? 'bold' : 'normal',
            }}
          >
            {letter}
          </button>
        ))}
      </div>
    </div>
  );
}

export default App;
