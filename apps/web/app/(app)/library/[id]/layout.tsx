/**
 * Layout override for resource detail pages.
 * The detail view is a full-height split pane that should occupy the entire
 * SidebarInset area without the standard px-6 py-4 padding applied in
 * the top-level (app) layout.
 *
 * We achieve this by nesting a layout directly under /library/[id] that
 * resets the padding using negative margins to break out of the parent padded box.
 */

export default function ResourceDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full flex-col -mx-6 -my-4">
      {children}
    </div>
  );
}
