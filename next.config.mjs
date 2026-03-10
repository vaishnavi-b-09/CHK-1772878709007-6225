/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        esmExternals: 'loose'
    },
    webpack: (config) => {
        config.externals.push({
            'utf-8-validate': 'commonjs utf-8-validate',
            'bufferutil': 'commonjs bufferutil',
        });
        return config;
    },
    transpilePackages: ['three', '@react-three/fiber', '@react-three/drei'],
    images: {
        domains: ['localhost'],
    },
    env: {
        CUSTOM_KEY: process.env.CUSTOM_KEY,
    }
};

export default nextConfig;
