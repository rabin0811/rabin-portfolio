import { Helmet } from 'react-helmet-async'

const BASE_URL = 'https://rabin-portfolio.vercel.app'

const SEO = ({
    title = 'Rabin Humagain | Full Stack Developer',
    description = 'Modern portfolio website of Rabin Humagain. Full stack developer, backend enthusiast, React developer, Node.js developer, and computer engineering student.',
    keywords = 'Rabin Humagain, Full Stack Developer, React Developer, Node Developer, Portfolio Website, Backend Enthusiast, Nepal',
    image = '/profile.jpeg',
    url = '/',
    type = 'website',
    publishedTime,
    schema,
}) => {
    const fullUrl = `${BASE_URL}${url}`
    const imageUrl = image.startsWith('http') ? image : `${BASE_URL}${image}`

    return (
        <Helmet>
            <title>{title}</title>
            <link rel="canonical" href={fullUrl} />
            <meta name="robots" content="index, follow" />
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            <meta name="author" content="Rabin Humagain" />
            <meta name="theme-color" content="#dc2626" />

            {/* Open Graph */}
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={imageUrl} />
            <meta property="og:url" content={fullUrl} />
            <meta property="og:type" content={type} />
            <meta property="og:site_name" content="Rabin Humagain Portfolio" />
            <meta property="og:locale" content="en_US" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={imageUrl} />

            {/* Article specific */}
            {publishedTime && (
                <meta property="article:published_time" content={publishedTime} />
            )}

            {/* JSON-LD Schema */}
            {schema && (
                <script type="application/ld+json">
                    {JSON.stringify(schema)}
                </script>
            )}
        </Helmet>
    )
}

export default SEO
