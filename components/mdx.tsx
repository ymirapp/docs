import {
  Callout as FumadocsCallout,
  CalloutContainer,
  CalloutDescription,
  CalloutTitle,
  type CalloutType,
} from 'fumadocs-ui/components/callout';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import type { ComponentProps } from 'react';

const calloutLabels: Record<CalloutType, string> = {
  info: 'Note',
  idea: 'Tip',
  success: 'Success',
  warn: 'Warning',
  warning: 'Warning',
  error: 'Error',
};

/**
 * Fumadocs callout that names its type above the title, so a note, warning or error reads as one
 * without its color.
 */
function Callout({ type = 'info', title, children, className, ...props }: ComponentProps<typeof FumadocsCallout>) {
  return (
    <CalloutContainer type={type} className={`docs-callout ${className ?? ''}`} {...props}>
      <div className="docs-callout-heading">
        <p className="docs-callout-label">{calloutLabels[type]}</p>
        {title && <CalloutTitle>{title}</CalloutTitle>}
      </div>
      <CalloutDescription>{children}</CalloutDescription>
    </CalloutContainer>
  );
}

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    Callout,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
