export function TypographyH1({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
      {children}
    </h1>
  );
}

export function TypographyH2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
      {children}
    </h2>
  );
}
