"use client";

// Local storage keys
const STORAGE_KEYS = {
  BOOKMARKS: "mena_cyber_wire_bookmarks",
  UPVOTES: "mena_cyber_wire_upvotes",
  THEME: "mena_cyber_wire_theme",
  SEARCH_HISTORY: "mena_cyber_wire_search_history",
  FOLLOWED_COUNTRIES: "mena_cyber_wire_followed_countries",
  COMMUNITY_POSTS: "mena_cyber_wire_user_posts",
  COMMUNITY_COMMENTS: "mena_cyber_wire_user_comments",
};

export interface BookmarkItem {
  id: string;
  title: string;
  sourceName: string;
  sourceUrl: string;
  publishedAt: string;
  country?: string;
  category: string;
  severity: string;
  savedAt: string;
}

export const LocalStore = {
  // Bookmarks
  getBookmarks(): BookmarkItem[] {
    if (typeof window === "undefined") return [];
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  isBookmarked(id: string): boolean {
    const bookmarks = this.getBookmarks();
    return bookmarks.some((b) => b.id === id);
  },

  toggleBookmark(item: BookmarkItem): boolean {
    if (typeof window === "undefined") return false;
    const bookmarks = this.getBookmarks();
    const index = bookmarks.findIndex((b) => b.id === item.id);
    let isNowSaved = false;

    if (index >= 0) {
      bookmarks.splice(index, 1);
      isNowSaved = false;
    } else {
      bookmarks.unshift({ ...item, savedAt: new Date().toISOString() });
      isNowSaved = true;
    }

    try {
      localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarks));
      window.dispatchEvent(new Event("mena_bookmarks_changed"));
    } catch (e) {
      console.error("Failed to save bookmarks to localStorage", e);
    }
    return isNowSaved;
  },

  // Upvotes
  getUpvotedIds(): Record<string, "up" | "down"> {
    if (typeof window === "undefined") return {};
    try {
      const data = localStorage.getItem(STORAGE_KEYS.UPVOTES);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  },

  setVote(id: string, vote: "up" | "down" | null): void {
    if (typeof window === "undefined") return;
    const votes = this.getUpvotedIds();
    if (vote === null) {
      delete votes[id];
    } else {
      votes[id] = vote;
    }
    try {
      localStorage.setItem(STORAGE_KEYS.UPVOTES, JSON.stringify(votes));
      window.dispatchEvent(new Event("mena_votes_changed"));
    } catch (e) {
      console.error("Failed to save votes to localStorage", e);
    }
  },

  // Search History
  getSearchHistory(): string[] {
    if (typeof window === "undefined") return [];
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SEARCH_HISTORY);
      return data ? JSON.parse(data) : ["Saudi Arabia", "Ransomware UAE", "OT/SCADA", "LockBit", "NCA ECC"];
    } catch {
      return [];
    }
  },

  addSearchHistory(term: string): void {
    if (typeof window === "undefined" || !term.trim()) return;
    let history = this.getSearchHistory().filter((t) => t.toLowerCase() !== term.toLowerCase().trim());
    history.unshift(term.trim());
    if (history.length > 8) history = history.slice(0, 8);
    try {
      localStorage.setItem(STORAGE_KEYS.SEARCH_HISTORY, JSON.stringify(history));
    } catch (e) {
      console.error("Failed to save search history", e);
    }
  },

  clearSearchHistory(): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(STORAGE_KEYS.SEARCH_HISTORY);
    } catch (e) {
      console.error(e);
    }
  },

  // Followed Countries
  getFollowedCountries(): string[] {
    if (typeof window === "undefined") return ["AE", "SA"];
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FOLLOWED_COUNTRIES);
      return data ? JSON.parse(data) : ["AE", "SA"];
    } catch {
      return ["AE", "SA"];
    }
  },

  toggleFollowCountry(code: string): boolean {
    if (typeof window === "undefined") return false;
    const followed = this.getFollowedCountries();
    const idx = followed.indexOf(code);
    let isFollowed = false;
    if (idx >= 0) {
      followed.splice(idx, 1);
    } else {
      followed.push(code);
      isFollowed = true;
    }
    try {
      localStorage.setItem(STORAGE_KEYS.FOLLOWED_COUNTRIES, JSON.stringify(followed));
      window.dispatchEvent(new Event("mena_followed_changed"));
    } catch (e) {
      console.error(e);
    }
    return isFollowed;
  },

  // Theme
  getTheme(): "light" | "dark" {
    if (typeof window === "undefined") return "light";
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.THEME);
      if (saved === "dark" || saved === "light") return saved;
      // Default to light editorial theme as requested by user
      return "light";
    } catch {
      return "light";
    }
  },

  setTheme(theme: "light" | "dark"): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, theme);
      if (theme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      window.dispatchEvent(new CustomEvent("mena_theme_changed", { detail: theme }));
    } catch (e) {
      console.error(e);
    }
  },
};
