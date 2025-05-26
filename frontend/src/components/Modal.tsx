export function ModalFooter({
  children,
  ...props
}: React.PropsWithChildren<React.HTMLAttributes<HTMLElement>>) {
  return (
    <div className="space-y-4" {...props}>
      {children}
    </div>
  );
}

export function ModalHeader({
  children,
  ...props
}: React.PropsWithChildren<React.HTMLAttributes<HTMLElement>>) {
  return (
    <div className="mb-4 text-3xl font-extrabold" {...props}>
      {children}
    </div>
  );
}

export function ModalContent({
  children,
  ...props
}: React.PropsWithChildren<React.HTMLAttributes<HTMLElement>>) {
  return (
    <div className="text-foreground my-3" {...props}>
      {children}
    </div>
  );
}

export function Modal({
  children,
  ...props
}: React.PropsWithChildren<React.HTMLAttributes<HTMLElement>>) {
  return (
    <div
      className="fixed left-0 top-0 z-100 flex h-full w-full items-center justify-center bg-foreground dark:bg-gray-700 bg-opacity-50 py-10"
      {...props}
    >
      <div className="max-h-full w-full max-w-xl overflow-y-auto sm:rounded-2xl bg-background">
        <div className="w-full">
          <div className="m-8 my-20 max-w-[400px] mx-auto">
            <div className="mb-8">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
