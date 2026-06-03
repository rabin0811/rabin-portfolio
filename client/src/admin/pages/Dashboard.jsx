import {
    BarChart,
    Bar,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts'

import { useState, useEffect } from 'react'
import axios from 'axios'
import Sidebar from '../components/Sidebar'
const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'
const Dashboard = () => {
    const [stats, setStats] = useState({
        totalBlogs: 0,
        totalProjects: 0,
        totalMessages: 0,
        visitors: 1200,
        recentMessages: []
    })

    const [chartData, setChartData] = useState([
        { name: 'Blogs', total: 0, color: '#4ade80' },
        { name: 'Projects', total: 0, color: '#38bdf8' },
        { name: 'Messages', total: 0, color: '#f472b6' },
        { name: 'Visitors', total: 0, color: '#e0f2fe' },
    ])

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await axios.get(`${API}/api/analytics`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                })
                setStats(res.data)
                setChartData([
                    { name: 'Blogs', total: res.data.totalBlogs, color: '#4ade80' },
                    { name: 'Projects', total: res.data.totalProjects, color: '#38bdf8' },
                    { name: 'Messages', total: res.data.totalMessages || 0, color: '#f472b6' },
                    { name: 'Visitors', total: res.data.visitors, color: '#e0f2fe' },
                ])
            } catch (error) {
                console.error("Error fetching analytics", error)
            }
        }
        fetchAnalytics()
    }, [])

    return (
        <div className='flex bg-black text-white min-h-screen font-sans'>

            <Sidebar />

            <div className='flex-1 p-6 md:p-10 overflow-x-hidden'>

                <h1 className='text-4xl md:text-5xl font-bold text-red-600 mb-10'>
                    Dashboard
                </h1>

                {/* STAT CARDS CONTAINER */}
                <div className='grid sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10'>

                    <div className='bg-zinc-900 p-6 rounded-2xl border border-zinc-800/50 shadow-lg'>
                        <h2 className='text-zinc-400 font-medium tracking-wide uppercase text-xs'>
                            Total Blogs
                        </h2>
                        <p className='text-4xl font-bold mt-3 text-white'>
                            {stats.totalBlogs}
                        </p>
                    </div>

                    <div className='bg-zinc-900 p-6 rounded-2xl border border-zinc-800/50 shadow-lg'>
                        <h2 className='text-zinc-400 font-medium tracking-wide uppercase text-xs'>
                            Total Projects
                        </h2>
                        <p className='text-4xl font-bold mt-3 text-white'>
                            {stats.totalProjects}
                        </p>
                    </div>

                    <div className='bg-zinc-900 p-6 rounded-2xl border border-zinc-800/50 shadow-lg col-span-2 sm:col-span-1'>
                        <h2 className='text-zinc-400 font-medium tracking-wide uppercase text-xs'>
                            Visitors
                        </h2>
                        <p className='text-4xl font-bold mt-3 text-white'>
                            {stats.visitors}
                        </p>
                    </div>

                </div>

                {/* ANALYTICS CHART CONTAINER */}
                <div className='bg-zinc-900 rounded-3xl p-6 md:p-8 border border-zinc-800/50 shadow-xl h-[500px] flex flex-col'>

                    <h2 className='text-2xl font-bold mb-6 text-zinc-100'>
                        Analytics Overview
                    </h2>

                    <div className='flex-1 min-h-0 w-full pr-4 pb-2'>
                        <ResponsiveContainer width='100%' height='100%'>
                            <BarChart
                                data={chartData}
                                margin={{ top: 10, right: 10, left: -10, bottom: 5 }}
                            >
                                {/* Subtle background grid lines */}
                                <CartesianGrid
                                    strokeDasharray='3 3'
                                    stroke='#27272a'
                                    vertical={false}
                                />

                                <XAxis
                                    dataKey='name'
                                    stroke='#71717a'
                                    tickLine={false}
                                    dy={10}
                                    style={{ fontSize: '13px', fontWeight: 500 }}
                                />

                                <YAxis
                                    stroke='#71717a'
                                    tickLine={false}
                                    dx={-5}
                                    style={{ fontSize: '12px' }}
                                />

                                {/* Premium custom tooltip block that matches dark UI */}
                                <Tooltip
                                    cursor={{ fill: '#1f1f23', opacity: 0.4 }}
                                    contentStyle={{
                                        backgroundColor: '#18181b',
                                        borderColor: '#27272a',
                                        borderRadius: '12px',
                                        color: '#fff',
                                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
                                    }}
                                    itemStyle={{ color: '#fff' }}
                                    labelStyle={{ color: '#a1a1aa', fontWeight: 600 }}
                                />

                                {/* Individual bar settings mapped with colors */}
                                <Bar
                                    dataKey='total'
                                    radius={[8, 8, 0, 0]}
                                    maxBarSize={80}
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                </div>

                {/* RECENT MESSAGES CONTAINER */}
                {stats.recentMessages && stats.recentMessages.length > 0 && (
                    <div className='mt-10 bg-zinc-900 rounded-3xl p-6 md:p-8 border border-zinc-800/50 shadow-xl'>
                        <h2 className='text-2xl font-bold mb-6 text-zinc-100'>
                            Recent Messages
                        </h2>
                        <div className='space-y-4'>
                            {stats.recentMessages.map((msg) => (
                                <div key={msg.id} className='bg-zinc-950 p-4 rounded-xl border border-zinc-800'>
                                    <div className='flex justify-between items-start mb-2'>
                                        <h3 className='font-semibold text-zinc-100'>{msg.name}</h3>
                                        <span className='text-xs text-zinc-500'>
                                            {new Date(msg.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className='text-sm text-zinc-400 font-medium mb-1'>{msg.subject}</p>
                                    <p className='text-sm text-zinc-500 line-clamp-2'>{msg.message}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </div>
    )
}

export default Dashboard