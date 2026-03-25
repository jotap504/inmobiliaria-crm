'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Badge } from './badge';
import { Button } from './button';
import { Calendar, Clock, User, MessageSquare, Home, FileText, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

// Define TimelineEvent locally to avoid import issues
export interface TimelineEvent {
  id: string;
  transaction_id: string;
  type: 'contact' | 'documentation' | 'visit' | 'offer' | 'negotiation' | 'boleto' | 'writing' | 'completed';
  title: string;
  description: string;
  date: string;
  priority: 'low' | 'medium' | 'high';
  agent_id: string;
  created_at: string;
}

interface TimelineProps {
  events: TimelineEvent[];
  onEventClick?: (event: TimelineEvent) => void;
  onAddEvent?: () => void;
  currentStep?: string;
  className?: string;
}

const timelineSteps = [
  { id: 'contact', label: 'Contacto Inicial', icon: User, color: 'bg-blue-500' },
  { id: 'documentation', label: 'Documentación', icon: FileText, color: 'bg-yellow-500' },
  { id: 'published', label: 'Publicación', icon: Home, color: 'bg-purple-500' },
  { id: 'visits', label: 'Visitas', icon: Calendar, color: 'bg-green-500' },
  { id: 'negotiation', label: 'Negociación', icon: MessageSquare, color: 'bg-orange-500' },
  { id: 'boleto', label: 'Boleto', icon: MessageSquare, color: 'bg-pink-500' },
  { id: 'writing', label: 'Escrituración', icon: FileText, color: 'bg-indigo-500' },
  { id: 'completed', label: 'Venta Completada', icon: CheckCircle, color: 'bg-emerald-500' },
];

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high': return 'bg-red-100 text-red-800 border-red-200';
    case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'low': return 'bg-green-100 text-green-800 border-green-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getStepIcon = (stepId: string) => {
  const step = timelineSteps.find(s => s.id === stepId);
  return step ? step.icon : Calendar;
};

export function Timeline({ events, onEventClick, onAddEvent, currentStep, className }: TimelineProps) {
  const sortedEvents = [...events].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const getCurrentStepIndex = () => {
    if (!currentStep) return -1;
    return timelineSteps.findIndex(step => step.id === currentStep);
  };

  const currentStepIndex = getCurrentStepIndex();

  const handleEventClick = (event: TimelineEvent) => {
    if (onEventClick) {
      onEventClick(event);
    } else {
      console.log('Event clicked:', event);
    }
  };

  const handleAddEvent = () => {
    if (onAddEvent) {
      onAddEvent();
    } else {
      console.log('Add event');
    }
  };

  return (
    <div className={cn("w-full", className)}>
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 right-0 top-5 h-1 bg-gray-200 -z-10" />
          <div 
            className="absolute left-0 top-5 h-1 bg-blue-500 -z-10 transition-all duration-500"
            style={{ 
              width: `${currentStepIndex >= 0 ? ((currentStepIndex + 1) / timelineSteps.length) * 100 : 0}%` 
            }}
          />
          
          {timelineSteps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index <= currentStepIndex;
            const isCurrent = index === currentStepIndex;
            
            return (
              <div key={step.id} className="relative flex flex-col items-center">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                    isActive 
                      ? `${step.color} border-white shadow-lg` 
                      : "bg-white border-gray-300"
                  )}
                >
                  <Icon className={cn("w-5 h-5", isActive ? "text-white" : "text-gray-400")} />
                </div>
                <span className={cn(
                  "text-xs mt-2 text-center font-medium",
                  isActive ? "text-gray-900" : "text-gray-500"
                )}>
                  {step.label}
                </span>
                {isCurrent && (
                  <Badge className="mt-1 text-xs" variant="secondary">
                    Actual
                  </Badge>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Timeline de Procesos</h3>
        {sortedEvents.length === 0 ? (
          <div className="p-6 text-center text-gray-500 border rounded-lg">
            No hay eventos registrados aún
          </div>
        ) : (
          sortedEvents.map((event, index) => {
            return (
              <div key={event.id} className="p-4 border rounded-lg bg-white">
                <h4 className="font-medium">{event.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                <p className="text-xs text-gray-500 mt-2">
                  {new Date(event.date).toLocaleDateString()}
                </p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
