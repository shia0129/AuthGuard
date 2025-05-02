const {
  PHASE_DEVELOPMENT_SERVER,
  PHASE_PRODUCTION_SERVER,
  PHASE_PRODUCTION_BUILD,
} = require('next/constants');
const SERVER_ADDRESS = process.env.NEXT_PUBLIC_SERVER_ADDRESS;

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
  openAnalyzer: false,
});

const webpack = require('webpack');

const addAssetLoader = (config) => {
  config.module.rules.push({
    test: /\.(png|jpg|jpe?g|gif)$/i,
    use: [
      {
        loader: 'file-loader',
        options: {
          name: '[path][name].[ext]',
        },
      },
    ],
  });
  return config;
};

const baseConfig = {
  staticPageGenerationTimeout: 1000,
  trailingSlash: true,
  compress: true,
  reactStrictMode: true,
  compiler: {
    removeConsole: false,
    styledComponents: true,
  },
  transpilePackages: ['@ant-design/icons', '@ant-design/icons-svg', 'rc-util'],
};

const createWebpackConfig = (config) => {
  config.externals = [
    ...(config.externals || []),
    function ({ request }, callback) {
      if (/xlsx|canvg/.test(request)) {
        return callback(null, 'commonjs ' + request);
      }
      callback();
    },
  ];

  config.plugins.push(
    new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /ko/)
  );

  if (config.module && config.module.rules) {
    config.module.rules = config.module.rules.filter(
      (rule) => !(rule.test && rule.test.toString().includes('svg'))
    );
  } else {
    config.module = { rules: [] };
  }

  config.module.rules.push({
    test: /\.svg$/,
    use: [
      {
        loader: '@svgr/webpack',
        options: {
          icon: true,
        },
      },
    ],
  });

  addAssetLoader(config);
  return config;
};

const nextConfig_dev = {
  ...baseConfig,
  images: {
    unoptimized: true,
    loader: 'custom',
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${SERVER_ADDRESS}api/:path*`,
        basePath: false,
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/common/login',
        permanent: false,
      },
    ];
  },
  webpack: createWebpackConfig,
  experimental: {
    allowedDevOrigins: ['http://10.10.0.5:3004'],
  },
};

const nextConfig_export = {
  ...baseConfig,
  output: 'export',
  images: {
    unoptimized: true,
  },
  webpack: (config) => {
    config.devtool = 'source-map';
    return createWebpackConfig(config);
  },
};

module.exports = (phase) => {
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    console.log('### Development Mode ####');
    console.log(`### SERVER ADDRESS: ${SERVER_ADDRESS} ####`);
    return withBundleAnalyzer(nextConfig_dev);
  } else if (phase === PHASE_PRODUCTION_SERVER) {
    console.log('### Production Mode ###');
    console.log(`### SERVER ADDRESS: ${SERVER_ADDRESS} ####`);
  } else if (phase === PHASE_PRODUCTION_BUILD) {
    console.log('### Build Mode ###');
  }
  return withBundleAnalyzer(nextConfig_export);
};
