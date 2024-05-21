export default function MdxLayout({ children }: { children: React.ReactNode }) {
  return (
    <article className="prose prose-lg mx-auto my-16 px-4 prose-img:max-w-[50%] prose-img:mx-auto">
      {children}
    </article>
  )
}
