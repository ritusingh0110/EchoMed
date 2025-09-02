"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { 
  Brain, 
  Calendar, 
  Clock, 
  Download, 
  Heart, 
  LineChart, 
  Moon, 
  Play, 
  PauseCircle,
  RefreshCw, 
  Save, 
  Sun, 
  Volume2,
  Waves,
  Activity,
  Briefcase,
  Check,
  Dumbbell,
  Footprints,
  Trophy,
  Music,
  FlowerIcon,
  Bike,
  Mountain,
  Pencil,
  HeartHandshake as HandHeart,
  Wind,
  BookOpen,
  Flower as Flower2,
  Coffee,
  Users,
  Home,
  UserPlus,
  PartyPopper as PartyIcon,
  CalendarClock,
  Phone,
  Dog as Paw,
  HandHelping as Helping,
  Laptop,
  GraduationCap,
  Palette,
  Utensils,
  Sparkles,
  ShoppingBag,
  Gamepad as Gamepad2,
  Smartphone,
  Plus,
  PenLine,
  Smile,
  CircleOff,
  Gauge,
  CloudRain,
  Zap,
  BedIcon,
  AlertTriangle,
  HelpCircle,
  Tag,
  ArrowRight,
  CalendarDays,
  BarChart,
  HeartPulse,
  XCircle,
  SunMoon
} from "lucide-react";
import { useDrEcho } from "@/components/ai-assistant/dr-echo-context";
import { generateMentalWellnessResponse } from "@/lib/mentalWellnessRecommendations";
import { AnimatedHeart } from '@/components/ui/animated-heart';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import "@/styles/mental-wellness.css"; // Import external CSS file

// Function to render the floating heart icon
function FloatingHeartIcon() {
  return (
    <motion.div
      className="floating-heart-icon"
      initial={{ y: 0 }}
      animate={{ y: [0, -15, 0] }}
      transition={{ 
        duration: 3, 
        repeat: Infinity, 
        ease: "easeInOut" 
      }}
    >
      <AnimatedHeart 
        size={60} 
        color="rgba(255, 51, 102, 0.8)" 
        pulseColor="rgba(255, 102, 153, 0.8)"
      />
    </motion.div>
  );
}

export default function MentalWellnessPage() {
  const { openAssistant, sendMessage } = useDrEcho();
  const [activeTab, setActiveTab] = useState("assessment");
  const [moodScore, setMoodScore] = useState<number>(7);
  const [anxietyLevel, setAnxietyLevel] = useState<number>(3);
  const [sleepQuality, setSleepQuality] = useState<number>(8);
  const [energyLevel, setEnergyLevel] = useState<number>(6);
  const [focusLevel, setFocusLevel] = useState<number>(7);
  const [journalEntry, setJournalEntry] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [meditationTime, setMeditationTime] = useState(300); // 5 minutes in seconds
  const [remainingTime, setRemainingTime] = useState(300);
  const [selectedSound, setSelectedSound] = useState("rain");
  const [journalMoodScore, setJournalMoodScore] = useState(7);
  const [journalEnergyLevel, setJournalEnergyLevel] = useState(6);
  
  const moodLabels = {
    1: "Very Low",
    3: "Low",
    5: "Neutral",
    7: "Good",
    9: "Excellent"
  };
  
  const anxietyLabels = {
    1: "None",
    3: "Mild",
    5: "Moderate",
    7: "High",
    9: "Severe"
  };
  
  const sleepLabels = {
    1: "Poor",
    3: "Fair",
    5: "Average",
    7: "Good",
    9: "Excellent"
  };
  
  const energyLabels = {
    1: "Exhausted",
    3: "Tired",
    5: "Neutral",
    7: "Energetic",
    9: "Very Energetic"
  };
  
  const focusLabels = {
    1: "Distracted",
    3: "Somewhat Focused",
    5: "Moderately Focused",
    7: "Focused",
    9: "Highly Focused"
  };
  
  const getWellnessScore = () => {
    // Calculate overall wellness score (0-100)
    const moodWeight = 0.25;
    const anxietyWeight = 0.25;
    const sleepWeight = 0.2;
    const energyWeight = 0.15;
    const focusWeight = 0.15;
    
    // Normalize anxiety (lower is better)
    const normalizedAnxiety = 10 - anxietyLevel;
    
    const score = (
      (moodScore * moodWeight) +
      (normalizedAnxiety * anxietyWeight) +
      (sleepQuality * sleepWeight) +
      (energyLevel * energyWeight) +
      (focusLevel * focusWeight)
    ) * 10;
    
    return Math.round(score);
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  const toggleMeditation = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      
      // Simulate countdown
      const interval = setInterval(() => {
        setRemainingTime(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsPlaying(false);
            return meditationTime;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };
  
  const resetMeditation = () => {
    setIsPlaying(false);
    setRemainingTime(meditationTime);
  };
  
  const setMeditationDuration = (minutes: number) => {
    const seconds = minutes * 60;
    setMeditationTime(seconds);
    setRemainingTime(seconds);
  };
  
  const handleConsultAI = () => {
    // Prepare the message for the AI assistant
    const message = `
I'd like some mental wellness advice based on my current state:

Mood: ${moodScore}/10 (${Object.entries(moodLabels).find(([key]) => Number(key) === moodScore)?.[1] || 'N/A'})
Anxiety Level: ${anxietyLevel}/10 (${Object.entries(anxietyLabels).find(([key]) => Number(key) === anxietyLevel)?.[1] || 'N/A'})
Sleep Quality: ${sleepQuality}/10 (${Object.entries(sleepLabels).find(([key]) => Number(key) === sleepQuality)?.[1] || 'N/A'})
Energy Level: ${energyLevel}/10 (${Object.entries(energyLabels).find(([key]) => Number(key) === energyLevel)?.[1] || 'N/A'})
Focus Level: ${focusLevel}/10 (${Object.entries(focusLabels).find(([key]) => Number(key) === focusLevel)?.[1] || 'N/A'}

Journal Entry: ${journalEntry || 'No journal entry provided'}

Based on this information, could you provide some personalized mental wellness recommendations?
`;
    
    // Open the assistant first
    openAssistant();
    
    // Then send the message directly using the provider's sendMessage function
    // This bypasses the DOM manipulation which could be causing issues
    setTimeout(() => {
      sendMessage(message);
    }, 300);
  };
  
  const wellnessScore = getWellnessScore();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-bold mb-2">Mental Wellness</h1>
        <p className="text-muted-foreground mb-8">
          Track, assess, and improve your mental wellbeing
        </p>
      </motion.div>
      
      <FloatingHeartIcon />
      
      <Tabs defaultValue="assessment" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-full mb-8">
          <TabsTrigger value="assessment" className="flex items-center gap-1">
            <Brain className="h-4 w-4" />
            Assessment
          </TabsTrigger>
          <TabsTrigger value="journal" className="flex items-center gap-1">
            <LineChart className="h-4 w-4" />
            Mood Journal
          </TabsTrigger>
          <TabsTrigger value="meditation" className="flex items-center gap-1">
            <Waves className="h-4 w-4" />
            Meditation
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center gap-1">
            <Heart className="h-4 w-4" />
            Insights
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="assessment">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <motion.div
                      initial={{ scale: 1 }}
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ 
                        repeat: Infinity, 
                        duration: 2,
                        repeatType: "reverse"
                      }}
                    >
                      <Heart className="h-6 w-6 text-rose-500" />
                    </motion.div>
                    Daily Wellness Check-in
                  </CardTitle>
                  <CardDescription className="text-base">
                    Rate how you're feeling today to track your mental wellbeing
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* Mood Slider */}
                  <motion.div 
                    className="mood-metric-container"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="flex justify-between items-center">
                      <Label className="text-base flex items-center gap-2">
                        <Sun className="h-5 w-5 text-yellow-500" />
                        Mood
                      </Label>
                      <motion.span 
                        className="mood-label"
                        animate={{ 
                          backgroundColor: moodScore > 7 ? ["#bfdbfe", "#93c5fd", "#bfdbfe"] : undefined 
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {Object.entries(moodLabels).find(([key]) => Number(key) === moodScore)?.[1] || 'N/A'}
                      </motion.span>
                    </div>
                    <div className="mood-slider-container">
                      <div className="mood-indicator-segments">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(value => (
                          <div 
                            key={value} 
                            className={`mood-segment ${value <= moodScore ? 'active' : ''}`}
                            onClick={() => setMoodScore(value)}
                          />
                        ))}
                      </div>
                      <div className="slider-thumb-custom" />
                      <input 
                        type="range"
                        min={1}
                        max={10}
                        step={1}
                        value={moodScore}
                        onChange={(e) => setMoodScore(parseInt(e.target.value))}
                        className="hidden-range-input"
                        title="Mood Slider"
                        placeholder="Adjust your mood score"
                      />
                    </div>
                  </motion.div>
                  
                  {/* Anxiety Slider */}
                  <motion.div 
                    className="anxiety-metric-container"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="flex justify-between items-center">
                      <Label className="text-base flex items-center gap-2">
                        <Activity className="h-5 w-5 text-orange-500" />
                        Anxiety Level
                      </Label>
                      <motion.span 
                        className="anxiety-label"
                        animate={{ 
                          backgroundColor: anxietyLevel < 3 ? ["#fed7aa", "#fdba74", "#fed7aa"] : undefined 
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {Object.entries(anxietyLabels).find(([key]) => Number(key) === anxietyLevel)?.[1] || 'N/A'}
                      </motion.span>
                    </div>
                    <div className="anxiety-slider-container">
                      <div className="anxiety-indicator-segments">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(value => (
                          <div 
                            key={value} 
                            className={`anxiety-segment ${value <= anxietyLevel ? 'active' : ''}`}
                            onClick={() => setAnxietyLevel(value)}
                          />
                        ))}
                      </div>
                      <div className="slider-thumb-custom anxiety-thumb" />
                      <input 
                        type="range"
                        min={1}
                        max={10}
                        step={1}
                        value={anxietyLevel}
                        onChange={(e) => setAnxietyLevel(parseInt(e.target.value))}
                        className="hidden-range-input"
                        title="Anxiety Level Slider"
                        placeholder="Adjust your anxiety level"
                      />
                    </div>
                  </motion.div>
                  
                  {/* Sleep Quality Slider */}
                  <motion.div 
                    className="sleep-metric-container"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="flex justify-between items-center">
                      <Label className="text-base flex items-center gap-2">
                        <Moon className="h-5 w-5 text-purple-500" />
                        Sleep Quality
                      </Label>
                      <motion.span 
                        className="sleep-label"
                        animate={{ 
                          backgroundColor: sleepQuality > 7 ? ["#e9d5ff", "#d8b4fe", "#e9d5ff"] : undefined 
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {Object.entries(sleepLabels).find(([key]) => Number(key) === sleepQuality)?.[1] || 'N/A'}
                      </motion.span>
                    </div>
                    <div className="sleep-slider-container">
                      <div className="sleep-indicator-segments">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(value => (
                          <div 
                            key={value} 
                            className={`sleep-segment ${value <= sleepQuality ? 'active' : ''}`}
                            onClick={() => setSleepQuality(value)}
                          />
                        ))}
                      </div>
                      <div className="slider-thumb-custom sleep-thumb" />
                      <input 
                        type="range"
                        min={1}
                        max={10}
                        step={1}
                        value={sleepQuality}
                        onChange={(e) => setSleepQuality(parseInt(e.target.value))}
                        className="hidden-range-input"
                        title="Sleep Quality Slider"
                        placeholder="Adjust your sleep quality"
                      />
                    </div>
                  </motion.div>
                  
                  {/* Energy Level Slider */}
                  <motion.div 
                    className="energy-metric-container"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="flex justify-between items-center">
                      <Label className="text-base flex items-center gap-2">
                        <RefreshCw className="h-5 w-5 text-yellow-500" />
                        Energy Level
                      </Label>
                      <motion.span 
                        className="energy-label"
                        animate={{ 
                          backgroundColor: energyLevel > 7 ? ["#fef08a", "#fde047", "#fef08a"] : undefined 
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {Object.entries(energyLabels).find(([key]) => Number(key) === energyLevel)?.[1] || 'N/A'}
                      </motion.span>
                    </div>
                    <div className="energy-slider-container">
                      <div className="energy-indicator-segments">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(value => (
                          <div 
                            key={value} 
                            className={`energy-segment ${value <= energyLevel ? 'active' : ''}`}
                            onClick={() => setEnergyLevel(value)}
                          />
                        ))}
                      </div>
                      <div className="slider-thumb-custom energy-thumb" />
                      <input 
                        type="range"
                        min={1}
                        max={10}
                        step={1}
                        value={energyLevel}
                        onChange={(e) => setEnergyLevel(parseInt(e.target.value))}
                        className="hidden-range-input"
                        title="Energy Level Slider"
                        placeholder="Adjust your energy level"
                      />
                    </div>
                  </motion.div>
                  
                  {/* Focus Level Slider */}
                  <motion.div 
                    className="focus-metric-container"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="flex justify-between items-center">
                      <Label className="text-base flex items-center gap-2">
                        <Brain className="h-5 w-5 text-green-500" />
                        Focus Level
                      </Label>
                      <motion.span 
                        className="focus-label"
                        animate={{ 
                          backgroundColor: focusLevel > 7 ? ["#bbf7d0", "#86efac", "#bbf7d0"] : undefined 
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {Object.entries(focusLabels).find(([key]) => Number(key) === focusLevel)?.[1] || 'N/A'}
                      </motion.span>
                    </div>
                    <div className="focus-slider-container">
                      <div className="focus-indicator-segments">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(value => (
                          <div 
                            key={value} 
                            className={`focus-segment ${value <= focusLevel ? 'active' : ''}`}
                            onClick={() => setFocusLevel(value)}
                          />
                        ))}
                      </div>
                      <div className="slider-thumb-custom focus-thumb" />
                      <input 
                        type="range"
                        min={1}
                        max={10}
                        step={1}
                        value={focusLevel}
                        onChange={(e) => setFocusLevel(parseInt(e.target.value))}
                        className="hidden-range-input"
                        title="Focus Level Slider"
                        placeholder="Adjust your focus level"
                      />
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="wellness-activity-tracker"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
                      <Calendar className="h-5 w-5 text-indigo-500" />
                      Activities That Influenced Your Mood Today
                    </h3>

                    <div className="activity-categories space-y-6">
                      {/* Physical Section */}
                      <div className="activity-category">
                        <h4 className="text-sm font-medium mb-2 text-indigo-600/80 dark:text-indigo-400/80 flex items-center gap-1.5">
                          <Activity className="h-4 w-4" />
                          Physical
                        </h4>
                        <div className="activities-grid grid grid-cols-2 gap-2 md:grid-cols-4">
                          {[
                            { name: "Exercise", icon: <Dumbbell className="h-3.5 w-3.5" /> },
                            { name: "Walking", icon: <Footprints className="h-3.5 w-3.5" /> },
                            { name: "Sports", icon: <Trophy className="h-3.5 w-3.5" /> },
                            { name: "Dancing", icon: <Music className="h-3.5 w-3.5" /> },
                            { name: "Yoga", icon: <FlowerIcon className="h-3.5 w-3.5" /> },
                            { name: "Cycling", icon: <Bike className="h-3.5 w-3.5" /> },
                            { name: "Hiking", icon: <Mountain className="h-3.5 w-3.5" /> },
                            { name: "Swimming", icon: <Waves className="h-3.5 w-3.5" /> }
                          ].map((activity) => (
                            <div key={activity.name} className="activity-item">
                              <label className="flex items-center gap-2 cursor-pointer p-2.5 rounded-lg hover:bg-white dark:hover:bg-slate-800 transition-colors hover:shadow-sm border border-transparent hover:border-blue-100 dark:hover:border-indigo-900/30">
                                <div className="activity-checkbox">
                                  <input type="checkbox" className="peer hidden" title={`Select ${activity.name}`} />
                                  <div className="checkbox-display">
                                    <Check className="h-3.5 w-3.5 opacity-0 peer-checked:opacity-100" />
                                  </div>
                                </div>
                                <div className="activity-info flex items-center gap-1.5">
                                  <div className="icon-circle">
                                    {activity.icon}
                                  </div>
                                  <span className="text-sm font-medium text-gray-700 dark:text-slate-300">{activity.name}</span>
                                </div>
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
