"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Camera, Smile, Lock, Unlock, TrendingUp, Brain, Heart, Settings } from "lucide-react"

interface SmileSession {
  timestamp: Date
  duration: number
  quality: "good" | "excellent"
}

export default function SmileUnlockApp() {
  const [isLocked, setIsLocked] = useState(true)
  const [isDetecting, setIsDetecting] = useState(false)
  const [smileProgress, setSmileProgress] = useState(0)
  const [smileQuality, setSmileQuality] = useState<"none" | "artificial" | "duchenne">("none")
  const [sessions, setSessions] = useState<SmileSession[]>([])
  const [streak, setStreak] = useState(0)
  const [totalUnlocks, setTotalUnlocks] = useState(0)
  const [cameraActive, setCameraActive] = useState(false)

  const progressInterval = useRef<NodeJS.Timeout>()
  const qualityInterval = useRef<NodeJS.Timeout>()

  const startSmileDetection = () => {
    setIsDetecting(true)
    setCameraActive(true)
    setSmileProgress(0)

    // Simulate smile quality detection
    qualityInterval.current = setInterval(() => {
      const qualities: ("none" | "artificial" | "duchenne")[] = ["none", "artificial", "duchenne"]
      const randomQuality = qualities[Math.floor(Math.random() * qualities.length)]
      setSmileQuality(randomQuality)
    }, 500)

    // Progress only increases with Duchenne smile
    progressInterval.current = setInterval(() => {
      setSmileProgress((prev) => {
        if (smileQuality === "duchenne") {
          const newProgress = prev + 20
          if (newProgress >= 100) {
            unlockPhone()
            return 100
          }
          return newProgress
        } else if (smileQuality === "artificial") {
          return Math.max(0, prev - 5) // Slight decrease for artificial smile
        }
        return Math.max(0, prev - 10) // Decrease for no smile
      })
    }, 100)
  }

  const unlockPhone = () => {
    setIsLocked(false)
    setIsDetecting(false)
    setCameraActive(false)
    setSmileProgress(100)

    // Record session
    const newSession: SmileSession = {
      timestamp: new Date(),
      duration: 5,
      quality: smileQuality === "duchenne" ? "excellent" : "good",
    }
    setSessions((prev) => [newSession, ...prev.slice(0, 9)]) // Keep last 10 sessions
    setTotalUnlocks((prev) => prev + 1)
    setStreak((prev) => prev + 1)

    // Clear intervals
    if (progressInterval.current) clearInterval(progressInterval.current)
    if (qualityInterval.current) clearInterval(qualityInterval.current)

    // Auto-lock after 30 seconds for demo
    setTimeout(() => {
      setIsLocked(true)
      setSmileProgress(0)
      setSmileQuality("none")
    }, 30000)
  }

  const stopDetection = () => {
    setIsDetecting(false)
    setCameraActive(false)
    setSmileProgress(0)
    setSmileQuality("none")
    if (progressInterval.current) clearInterval(progressInterval.current)
    if (qualityInterval.current) clearInterval(qualityInterval.current)
  }

  useEffect(() => {
    return () => {
      if (progressInterval.current) clearInterval(progressInterval.current)
      if (qualityInterval.current) clearInterval(qualityInterval.current)
    }
  }, [])

  const getSmileQualityColor = () => {
    switch (smileQuality) {
      case "duchenne":
        return "text-green-500"
      case "artificial":
        return "text-yellow-500"
      default:
        return "text-gray-400"
    }
  }

  const getSmileQualityText = () => {
    switch (smileQuality) {
      case "duchenne":
        return "Genuine Duchenne Smile Detected! 😊"
      case "artificial":
        return "Artificial Smile - Try to engage your eyes"
      default:
        return "No smile detected"
    }
  }

  if (isLocked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit">
              <Lock className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl">Phone Locked</CardTitle>
            <CardDescription>Maintain a genuine Duchenne smile for 5 seconds to unlock</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Camera Simulation */}
            <div className="relative">
              <div
                className={`aspect-square rounded-lg border-2 border-dashed ${cameraActive ? "border-green-400 bg-green-50" : "border-gray-300 bg-gray-50"} flex items-center justify-center`}
              >
                {cameraActive ? (
                  <div className="text-center">
                    <div className="animate-pulse">
                      <Camera className="h-12 w-12 text-green-500 mx-auto mb-2" />
                    </div>
                    <p className="text-sm text-gray-600">Camera Active</p>
                    <div className="mt-2">
                      <Smile className={`h-8 w-8 mx-auto ${getSmileQualityColor()}`} />
                      <p className={`text-xs mt-1 ${getSmileQualityColor()}`}>{getSmileQualityText()}</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-400">
                    <Camera className="h-12 w-12 mx-auto mb-2" />
                    <p className="text-sm">Camera Off</p>
                  </div>
                )}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Smile Progress</span>
                <span>{Math.round(smileProgress)}%</span>
              </div>
              <Progress value={smileProgress} className="h-3" />
              <p className="text-xs text-gray-500 text-center">
                Hold a genuine Duchenne smile to fill the progress bar
              </p>
            </div>

            {/* Action Button */}
            {!isDetecting ? (
              <Button onClick={startSmileDetection} className="w-full" size="lg">
                <Smile className="mr-2 h-5 w-5" />
                Start Smile Detection
              </Button>
            ) : (
              <Button onClick={stopDetection} variant="outline" className="w-full bg-transparent" size="lg">
                Cancel
              </Button>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{streak}</div>
                <div className="text-xs text-gray-500">Day Streak</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{totalUnlocks}</div>
                <div className="text-xs text-gray-500">Total Unlocks</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Unlocked State - Full App Interface */}
      <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Unlock className="h-6 w-6" />
            <span className="font-semibold">Phone Unlocked</span>
          </div>
          <Badge variant="secondary" className="bg-white/20 text-white">
            Smile Streak: {streak}
          </Badge>
        </div>
      </div>

      <div className="p-4">
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="science">Science</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="mr-2 h-5 w-5 text-red-500" />
                  Today's Mood Boost
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-2">
                  <div className="text-3xl">😊</div>
                  <p className="text-sm text-gray-600">
                    You've activated positive facial feedback {totalUnlocks} times today!
                  </p>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-sm text-green-700">
                      Each genuine smile triggers the release of endorphins and serotonin, naturally improving your mood
                      and reducing stress.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {sessions.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No sessions yet</p>
                  ) : (
                    sessions.slice(0, 3).map((session, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <div>
                          <div className="text-sm font-medium">{session.timestamp.toLocaleTimeString()}</div>
                          <div className="text-xs text-gray-500">{session.duration}s duration</div>
                        </div>
                        <Badge variant={session.quality === "excellent" ? "default" : "secondary"}>
                          {session.quality}
                        </Badge>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="science" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="mr-2 h-5 w-5 text-purple-500" />
                  The Science Behind Smile Unlock
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Facial Feedback Hypothesis</h4>
                  <p className="text-sm text-gray-600">
                    Your facial expressions directly influence your emotional state. When you smile, your brain receives
                    signals that trigger the release of mood-boosting chemicals.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Duchenne vs. Artificial Smiles</h4>
                  <p className="text-sm text-gray-600">
                    A Duchenne smile engages both mouth and eye muscles, creating genuine positive neurological effects.
                    Artificial smiles only use mouth muscles and have limited impact.
                  </p>
                </div>

                <div className="bg-blue-50 p-3 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-1">Breaking Phone Addiction</h4>
                  <p className="text-sm text-blue-700">
                    By requiring intentional positive action to access your phone, we interrupt mindless scrolling
                    patterns and create positive associations with device usage.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="progress" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5 text-green-500" />
                  Your Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{streak}</div>
                    <div className="text-sm text-green-700">Day Streak</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{totalUnlocks}</div>
                    <div className="text-sm text-blue-700">Total Unlocks</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold">Benefits You're Experiencing:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Increased mindful phone usage</li>
                    <li>• Regular mood-boosting micro-moments</li>
                    <li>• Strengthened positive facial muscle memory</li>
                    <li>• Reduced unconscious doom-scrolling</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="mr-2 h-5 w-5" />
                  Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-semibold">Smile Detection Sensitivity</h4>
                  <p className="text-sm text-gray-600">Adjust how strict the Duchenne smile detection is</p>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      Relaxed
                    </Button>
                    <Button size="sm">Standard</Button>
                    <Button variant="outline" size="sm">
                      Strict
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold">Hold Duration</h4>
                  <p className="text-sm text-gray-600">Time required to maintain smile</p>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      3s
                    </Button>
                    <Button size="sm">5s</Button>
                    <Button variant="outline" size="sm">
                      7s
                    </Button>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Button variant="outline" className="w-full bg-transparent">
                    Reset All Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
