export function get_spread_start_page(spread_index: number): number {
    // Cover is page 0, first letter page is 1, then spreads advance by 2 pages.
    return 1 + spread_index * 2;
}

export function get_spread_letters(letters: readonly string[]): string[] {
    const spreads: string[] = [];
    for (let i = 0; i < letters.length; i += 2) spreads.push(letters[i]);
    return spreads;
}
