'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageSquare, Video } from "lucide-react"
import { useState, useEffect, useCallback } from "react"

interface VideoData {
  id: string
  desc: string
  coverURL: string
  videoURL: string
  status: number
  message: string
  percent?: number
}

console.log('base::',process.env.NEXT_PUBLIC_API_BASE_URL)

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api/proxy';
const TOKEN = process.env.NEXT_PUBLIC_TOKEN || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MzE2ODczMDcsInVzZXIiOnsiaWQiOiIyOTkzNjIwMTYyMDQwNTQ1MjkiLCJuYW1lIjoi5bCP6J665bi9NDUyOSIsImF2YXRhciI6Imh0dHBzOi8vY2RuLnlpbmdzaGktYWkuY29tL3Byb2QvdXNlcl9hdmF0YXIvMTcwNjI2NzU5ODg3NTg5OTk1My0xNzMxOTQ1NzA2Njg5NjU4OTZvdmVyc2l6ZS5wbmciLCJkZXZpY2VJRCI6IjI5OTM2MjAxNTk4NTk0MjUzNyIsImlzQW5vbnltb3VzIjp0cnVlfX0.CwdI2QTjAax-Dwz4oQTLTH_hUErBOw2_1WVS6EJ2MZA';
const YY = process.env.NEXT_PUBLIC_YY || 'd8dea9ba1bd22dcdd215903a5c74a541';

export function VideoPlatform() {
  const [videos, setVideos] = useState<VideoData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [description, setDescription] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  const startProgressMonitoring = useCallback((videoList: VideoData[]) => {
    const processingVideos = videoList.filter(video => video.status === 1)
    if (processingVideos.length === 0) return

    const monitorProgress = async () => {
      const idList = processingVideos.map(video => video.id).join(',')
      try {
        const response = await fetch(`${API_BASE_URL}/api/multimodal/video/processing?idList=${idList}&device_platform=web&app_id=3001&version_code=22201&uuid=eb389e4e-5305-4d98-9e97-fc8c1a978266&device_id=299362015985942537&os_name=Windows&browser_name=chrome&device_memory=8&cpu_core_num=32&browser_language=zh-CN&browser_platform=Win32&screen_width=2560&screen_height=1440&unix=1728230686000`, {
          headers: {
            Token: TOKEN
          }
        })
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        if (data && data.data && Array.isArray(data.data.videos)) {
          setVideos(prevVideos => {
            const updatedVideos = prevVideos.map(video => {
              const updatedVideo = data.data.videos.find((v: VideoData) => v.id === video.id)
              return updatedVideo ? { ...video, ...updatedVideo } : video
            })
            return updatedVideos
          })
          if (data.data.videos.some((video: VideoData) => video.status === 1)) {
            setTimeout(monitorProgress, 10000)
          }
        }
      } catch (error) {
        console.error('Error monitoring progress:', error)
      }
    }

    monitorProgress()
  }, [])

  const fetchVideos = useCallback(async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/v2/api/multimodal/video/my/cursor?type=next&currentID=0&limit=12&scene=list&device_platform=web&app_id=3001&version_code=22201&uuid=eb389e4e-5305-4d98-9e97-fc8c1a978266&device_id=299362015985942537&os_name=Windows&browser_name=chrome&device_memory=8&cpu_core_num=32&browser_language=zh-CN&browser_platform=Win32&screen_width=2560&screen_height=1440&unix=1728231307000`,
        {
          headers: {
            Token: TOKEN,
            Yy: YY
          }
        }
      )
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      if (data && data.data && Array.isArray(data.data.videos)) {
        setVideos(data.data.videos)
        startProgressMonitoring(data.data.videos)
      } else {
        throw new Error("Invalid data structure received from API")
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err)
      setError(`加载视频失败。错误详情：${errorMessage}`)
      console.error("Error fetching videos:", err)
    } finally {
      setIsLoading(false)
    }
  }, [startProgressMonitoring])

  useEffect(() => {
    fetchVideos()
  }, [fetchVideos])

  const handleGenerate = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch(`${API_BASE_URL}/api/multimodal/generate/video?device_platform=web&app_id=3001&version_code=22201&uuid=eb389e4e-5305-4d98-9e97-fc8c1a978266&device_id=299362015985942537&os_name=Windows&browser_name=chrome&device_memory=8&cpu_core_num=32&browser_language=zh-CN&browser_platform=Win32&screen_width=2560&screen_height=1440&unix=1728232094000`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Token': TOKEN,
          'Yy': YY
        },
        body: JSON.stringify({
          desc: description,
          useOriginPrompt: false,
          fileList: []
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Generation successful:', data);

      // 刷新视频列表
      await fetchVideos();

      // 清空描述输入
      setDescription('');
    } catch (error) {
      console.error('Error generating video:', error);
      setError('生成视频失败，请稍后重试。');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="flex items-center justify-between p-4 bg-gray-800">
        <h1 className="text-2xl font-bold">
          <span className="text-white">海螺AI </span>
          <span className="text-pink-500">创意视频</span>
          <span className="text-blue-500">平台</span>
        </h1>
        <div className="flex space-x-2">
          <Button variant="ghost" className="text-white">
            <MessageSquare className="mr-2 h-4 w-4" />
            Discord
          </Button>
          <Button variant="ghost" className="text-white">
            创作讨论
          </Button>
        </div>
      </header>
      <main className="p-4 space-y-6">
        <div className="bg-gray-800 rounded-lg p-4">
          <Input
            className="bg-gray-700 border-gray-600 text-white"
            placeholder="请描述想生成的视频内容"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="flex justify-between mt-4">
            <Button variant="ghost" className="text-gray-400">
              <Video className="mr-2 h-4 w-4" />
            </Button>
            <Button 
              className="bg-white text-black hover:bg-gray-200"
              onClick={handleGenerate}
              disabled={isGenerating || !description.trim()}
            >
              {isGenerating ? '生成中...' : '生成'}
            </Button>
          </div>
        </div>
        <Tabs defaultValue="featured">
          <TabsList className="bg-gray-800">
            <TabsTrigger value="featured" className="text-white">精选</TabsTrigger>
            <TabsTrigger value="my" className="text-white">我的 ({videos.length})</TabsTrigger>
          </TabsList>
        </Tabs>
        {isLoading ? (
          <div className="text-center">加载中...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {videos.map((video) => (
              <div key={video.id} className="bg-gray-800 rounded-lg overflow-hidden">
                <div className="aspect-video bg-gray-700 relative">
                  {video.status === 2 ? (
                    <video src={video.videoURL} controls className="w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full border-2 border-gray-500 flex items-center justify-center">
                        <span className="text-gray-500">{video.percent || 0}%</span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  {video.status === 2 ? (
                    <p className="text-sm line-clamp-2 overflow-hidden">{video.desc}</p>
                  ) : (
                    <p className="text-sm text-gray-400 line-clamp-2 overflow-hidden">{video.message}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}