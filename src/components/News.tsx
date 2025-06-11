import '../App.css'
import { useEffect, useState } from 'react'
import Footer from './Footer';
import type { Article, ApiResponse } from '../types/types';
import {ClipLoader} from 'react-spinners';

type ErrorMessage = string | null;

type LoadingState = boolean;

const API_KEY: string = 'qKDYFGMwUv10p4lIGXiNuxhQ0GWkGntd' // my own key

const News = () => {
    const [newsData, setNewsData] = useState<Article[]>([])
    const [loading, setLoading] = useState<LoadingState>(false)
    const [error, setError] = useState<ErrorMessage>('Error!') 
    
    const fetchData = async (): Promise<void> => {
        setLoading(true)
        setError(null)
        
        try {
            const response: Response = await fetch(
                `https://api.nytimes.com/svc/topstories/v2/home.json?api-key=${API_KEY}`
            )

            if (!response.ok) {
                if (response.status === 429) {
                    throw new Error('Rate limit exceeded. Please wait before making another request.')
                }
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            
            const data: ApiResponse = await response.json()
            const sortedArticles: Article[] = data.results
                .slice(0, 50)
                .sort((a, b) => {
                    const dateA = new Date(a.published_date)
                    const dateB = new Date(b.published_date)
                    
                    // Sort in descending order
                    return dateB.getTime() - dateA.getTime()
                })
            
            setNewsData(sortedArticles)
            // console.log('Fetched and sorted data:', sortedArticles)
        
        } catch (error) {
            console.error('Error fetching data:', error)
        } finally {
            setLoading(false)
        }
    }
    
     // format the date like in figma
    const formatDate = (dateString: string): string => {
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
        const interval = setInterval((): void => {
            fetchData();
            // console.log('refetched')
        }, 30000)

        return ():void => clearInterval(interval)
    }, [])

  return (
        <div className='min-h-screen w-full p-4'>
            <div className='max-w-4xl mx-auto'>
                <div className='flex justify-between items-center mb-6'>
                    <h1 className='text-3xl font-bold'>Latest News</h1>
                </div>

                {error && (
                    <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4'>
                        Error: {error}
                    </div>
                )}

                {loading && newsData.length === 0 && (
                    <div className='text-center py-8'>
                      <div className='text-gray-500'>
                          <ClipLoader
                            color="#2732c9" 
                            loading={true} 
                            size={50} />
                        </div>
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
          <Footer/>
        </div>
    )
}

export default News