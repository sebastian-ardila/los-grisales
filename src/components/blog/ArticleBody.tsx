import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'

interface Props {
  markdown: string
}

/** Renderiza el cuerpo del artículo. Estilos tipográficos con Tailwind. */
export default function ArticleBody({ markdown }: Props) {
  return (
    <div className="prose-article mx-auto max-w-2xl">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug, [rehypeAutolinkHeadings, { behavior: 'wrap' }]]}
        components={{
          h2: (props) => <h2 className="mt-12 font-display text-3xl font-bold text-brand" {...props} />,
          h3: (props) => <h3 className="mt-8 font-display text-2xl font-semibold text-brand" {...props} />,
          p: (props) => <p className="mt-5 leading-relaxed opacity-90" {...props} />,
          a: (props) => <a className="text-brand underline decoration-accent underline-offset-4 hover:text-accent" {...props} />,
          ul: (props) => <ul className="mt-5 list-disc space-y-2 pl-6" {...props} />,
          ol: (props) => <ol className="mt-5 list-decimal space-y-2 pl-6" {...props} />,
          img: (props) => <img loading="lazy" className="mt-8 rounded-2xl" {...props} />,
          blockquote: (props) => <blockquote className="mt-6 border-l-4 border-accent pl-4 italic opacity-80" {...props} />,
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  )
}
