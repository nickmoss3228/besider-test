import '../App.css'
import { useEffect, useState } from 'react'

type article = {
    title: string;

}

// const BASE_URL = 'https://api.nytimes.com/svc/archive/v1'
const API_KEY = 'qKDYFGMwUv10p4lIGXiNuxhQ0GWkGntd'

const News = () => {
    const [newsData, setNewsData] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null) 

    console.log(newsData)

    // const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    // const targetUrl = 'https://api.nytimes.com/svc/archive/v1/2025/5.json?api-key=qKDYFGMwUv10p4lIGXiNuxhQ0GWkGntd';
    
   const fetchData = async () => {
        // setLoading(true)
        // setError(null)
        
        try {
            const response = await fetch(
                `https://api.nytimes.com/svc/topstories/v2/home.json?api-key=${API_KEY}`
            )

            if (!response.ok) {
                if (response.status === 429) {
                    throw new Error('Rate limit exceeded. Please wait before making another request.')
                }
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            
            const data = await response.json()
            const sortedArticles = data.results
                .slice(0, 50)
                .sort((a, b) => {
                    const dateA = new Date(a.published_date)
                    const dateB = new Date(b.published_date)
                    
                    // Sort in descending order (newest first)
                    return dateB.getTime() - dateA.getTime()
                })
            
            setNewsData(sortedArticles)
            console.log('Fetched and sorted data:', sortedArticles)
    } catch (error) {
        console.error('Error fetching data:', error)
    }
    }
    
     // Helper function to format date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    useEffect(() => {
        fetchData()
    }, [])

  return (
        <div className='min-h-screen w-full p-4'>
            <div className='max-w-4xl mx-auto'>
                <div className='flex justify-between items-center mb-6'>
                    <h1 className='text-3xl font-bold'>Latest News</h1>
                    <button 
                        onClick={fetchData}
                        disabled={loading}
                        className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50'
                    >
                        {loading ? 'Loading...' : 'Refresh'}
                    </button>
                </div>

                {error && (
                    <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4'>
                        Error: {error}
                    </div>
                )}

                {loading && newsData.length === 0 && (
                    <div className='text-center py-8'>
                        <div className='text-gray-500'>Loading news...</div>
                    </div>
                )}

                <div className='space-y-4'>
                    {newsData.map((article, index) => (
                        <div key={index} className='flex gap-4 p-4 border-b border-gray-300 hover:bg-gray-50'>
                            <div className='flex-shrink-0'>
                                <img 
                                    className='w-[120px] h-[90px] object-cover rounded' 
                                    src={article.multimedia?.[0]?.url || 'https://i.ibb.co/RGCDDcHs/0d998bb6b4366e3f47beeadb8b19e6d914e9e43f.png'} 
                                    alt={article.title}
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/120x90?text=No+Image'
                                    }}
                                />
                            </div>
                            
                            <div className='flex-1'>
                                <div className='text-blue-500 font-semibold text-sm mb-1'>
                                    {article.section.toUpperCase()}
                                </div>
                                <h2 className='font-bold text-lg mb-2 line-clamp-2'>
                                    {article.title}
                                </h2>
                                <p className='text-gray-600 text-sm mb-2 line-clamp-2'>
                                    {article.abstract}
                                </p>
                                <div className='text-gray-500 text-xs'>
                                    {formatDate(article.published_date)}
                                </div>
                                {article.url && (
                                    <a 
                                        href={article.url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className='text-blue-500 text-sm hover:underline mt-1 inline-block'
                                    >
                                        Read more →
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {newsData.length === 0 && !loading && !error && (
                    <div className='text-center py-8 text-gray-500'>
                        No news articles found.
                    </div>
                )}
            </div>
        </div>
    )
}

export default News