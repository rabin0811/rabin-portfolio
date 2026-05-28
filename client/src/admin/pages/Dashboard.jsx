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

import Sidebar from '../components/Sidebar'

const data = [
    {
        name: 'Blogs',
        total: 12,
        color: '#4ade80' // Parrot Green (Tailwind green-400)
    },
    {
        name: 'Projects',
        total: 5,
        color: '#38bdf8' // Light Blue (Tailwind sky-400)
    },
    {
        name: 'Visitors',
        total: 1200,
        color: '#e0f2fe' // Light Light Color / Ice Blue (Tailwind sky-100)
    },
]

const Dashboard = () => {

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
                            12
                        </p>
                    </div>

                    <div className='bg-zinc-900 p-6 rounded-2xl border border-zinc-800/50 shadow-lg'>
                        <h2 className='text-zinc-400 font-medium tracking-wide uppercase text-xs'>
                            Total Projects
                        </h2>
                        <p className='text-4xl font-bold mt-3 text-white'>
                            5
                        </p>
                    </div>

                    <div className='bg-zinc-900 p-6 rounded-2xl border border-zinc-800/50 shadow-lg col-span-2 sm:col-span-1'>
                        <h2 className='text-zinc-400 font-medium tracking-wide uppercase text-xs'>
                            Visitors
                        </h2>
                        <p className='text-4xl font-bold mt-3 text-white'>
                            1,200
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
                                data={data}
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
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                </div>

            </div>
        </div>
    )
}

export default Dashboard