import { useGridState } from 'lib/grid';

export default function Footer() {
  const generate = useGridState((state) => state.generate);

  return (
    <footer className="flex items-center justify-center text-sm">
      <button
        className="rounded-full border border-neutral-200 bg-white px-6 py-1.5 hover:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:bg-neutral-800"
        onClick={generate}
      >
        New Board
      </button>
    </footer>
  );
}
