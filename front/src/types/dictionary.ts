export type DictionaryEntry = {
    word: string;
    definition: string;
};

export type DictionaryData = Record<string, DictionaryEntry[]>;
