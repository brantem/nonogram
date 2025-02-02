import * as nonogram from 'lib/nonogram';

export default function Footer() {
  return (
    <footer className="flex items-center justify-center text-sm">
      <button
        className="rounded-full border border-neutral-200 bg-white px-6 py-1.5 hover:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:bg-neutral-800"
        onClick={nonogram.generate}
      >
        New Board
      </button>
    </footer>
  );
}
