import React from 'react';

interface JsonLdProps {
  /** A schema.org node, or an array of nodes to emit as separate scripts. */
  data: Record<string, unknown> | Record<string, unknown>[];
}

/**
 * Renders schema.org structured data as `application/ld+json`.
 *
 * Server component - the payload is built on the server, so nothing here is
 * user-controlled markup. JSON.stringify escaping is enough for JSON-LD, but
 * `<` is escaped as well to be safe against a stray `</script>` in CMS copy.
 */
export default function JsonLd({ data }: JsonLdProps) {
  const nodes = Array.isArray(data) ? data : [data];

  return (
    <>
      {nodes.map((node, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(node).replace(/</g, '\\u003c')
          }}
        />
      ))}
    </>
  );
}
