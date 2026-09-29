import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  async redirects() {
    return [
      // Carried over from the legacy netlify.toml.
      { source: '/projects', destination: '/projects/manage', permanent: false },
    ];
  },
};

export default withMDX(config);
