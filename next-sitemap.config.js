module.exports = {
  siteUrl: process.env.SERVER || 'https://example.com',
  generateRobotsTxt: true, 
  exclude: ['/admin*', '/user/*'],
    robotsTxtOptions: {
      policies: [
        {
          userAgent: '*',
          allow: '/',
          disallow: [
            '/admin*', 
            '/user/*'
          ]
        },
      ],
    }
  }