import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  async redirects() {
    return [
      // Carried over from the legacy netlify.toml.
      { source: '/projects', destination: '/projects/manage', permanent: false },
      // Application pages moved out of Guides. Browsers keep the `#fragment`, and the pages keep their ids.
      { source: '/guides/bedrock', destination: '/applications/bedrock', permanent: true },
      { source: '/guides/bedrock.md', destination: '/applications/bedrock.md', permanent: true },
      { source: '/guides/laravel', destination: '/applications/laravel', permanent: true },
      { source: '/guides/laravel.md', destination: '/applications/laravel.md', permanent: true },
      { source: '/guides/wordpress-health-endpoint', destination: '/applications/wordpress', permanent: true },
      { source: '/guides/wordpress-health-endpoint.md', destination: '/applications/wordpress.md', permanent: true },
    ];
  },
};

export default withMDX(config);
