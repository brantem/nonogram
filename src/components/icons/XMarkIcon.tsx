export default function XMarkIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 14 14"
      strokeWidth="1.5"
      stroke="currentColor"
      {...props}
    >
      <path d="M1 13L13 1M1 1L13 13" />
    </svg>
  );
}
