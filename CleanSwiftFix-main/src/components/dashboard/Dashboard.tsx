import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useDashboardData } from '@/hooks/useDashboardData';
import { DashboardHeader } from './DashboardHeader';
import { DashboardStats } from './DashboardStats';
import { ProgressCard } from './ProgressCard';
import { TaskCreation } from '../tasks/TaskCreation';
import { AITaskCreation } from '../tasks/AITaskCreation';
import { TaskList } from '../tasks/TaskList';
import { TaskCreationButtons } from '../tasks/TaskCreationButtons';
import { DevMenu } from '@/components/admin/DevMenu';
import Groq from 'groq-sdk';

type CreationMode = 'none' | 'manual' | 'ai';

export function Dashboard() {
  const { user, signOut } = useAuth();
  const { tasks, profile, isLoading, loadData, handleStartTask, handleCompleteTask } = useDashboardData(user?.id || '');
  const [creationMode, setCreationMode] = useState<CreationMode>('none');

  const handleTaskCreated = () => {
    setCreationMode('none');
    loadData();
  };

  const handleCustomStartTask = async (task: { id: string; image_url: string }) => {
    const { id, image_url } = task;

    // Hardcoded API key
    const apiKey = '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';
    
    // Direct API URL
    const apiUrl = 'https://api.groq.com/openai/v1/chat/completions';

    try {
      const chatCompletion = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: 'whats the best and most effeciant way to clean this room in 10 steps or less small and easy steps'
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: image_url
                  }
                }
              ]
            }
          ],
          model: 'llama-3.2-90b-vision-preview',
          temperature: 1,
          max_completion_tokens: 1024,
          top_p: 1,
          stream: false,
          stop: null
        })
      });

      const data = await chatCompletion.json();
      console.log(data.choices[0].message.content);
    } catch (error) {
      console.error("Error fetching chat completion:", error);
    }
  };

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <DashboardHeader onSignOut={signOut} />
        
        {/* Stats Overview */}
        <DashboardStats tasks={tasks} />
        
        {/* Points and Progress */}
        {profile && (
          <ProgressCard profile={profile} tasks={tasks} />
        )}
        
        {/* Task Creation */}
        {creationMode === 'none' ? (
          <TaskCreationButtons 
            onManualCreate={() => setCreationMode('manual')} 
            onAICreate={() => setCreationMode('ai')} 
          />
        ) : creationMode === 'manual' ? (
          <TaskCreation onTaskCreated={handleTaskCreated} />
        ) : (
          <AITaskCreation onComplete={handleTaskCreated} />
        )}
        
        {/* Task List */}
        <TaskList 
          tasks={tasks} 
          onStartTask={handleCustomStartTask}
          onCompleteTask={handleCompleteTask}
        />

        {/* Developer Menu - Only shown for admin users */}
        {profile?.is_admin && (
          <DevMenu />
        )}
      </div>
    </div>
  );
}

export default Dashboard;
